import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner/ngx';
import { ToastController } from '@ionic/angular';
import { firestore } from 'firebase';

@Component({
  selector: 'app-lista-espera',
  templateUrl: './lista-espera.page.html',
  styleUrls: ['./lista-espera.page.scss'],
})
export class ListaEsperaPage implements OnInit {

  private user: any = {};
  private enEspera: Array<any> = [];
  public cargando: boolean = true;
  public pre: string = 'https://firebasestorage.googleapis.com/v0/b/restauranteapp-581eb.appspot.com/o/';
  public pos: string = '?alt=media';
  public cliente: boolean;
  public personasDelante: number;
  public userData;
  private userObs;
  public spinner: boolean = true;

  constructor(
    private fire: AngularFirestore,
    private router: Router,
    private route: ActivatedRoute,
    private toast: ToastController,
    private scanner: BarcodeScanner,
  ) { }

  ngOnInit() {
    this.user = JSON.parse(this.route.snapshot.paramMap.get('user'));
    this.cliente = this.user.perfil == 'cliente';
    if(this.cliente){
      setInterval( () => {
        this.fire.collection('listaespera', (ref) => ref.where('id', '==', this.user.id))
        .get().subscribe( obsList => {
          this.userObs = obsList.docs[0];
          this.userData = this.userObs.data();
        });
      }, 1500);
    }
    this.traerEnEspera();
    this.spinner = false;
  }

  traerEnEspera(){
    this.fire.collection('listaespera')
    .valueChanges().subscribe( (collection) => {
      this.enEspera = collection;
      this.enEspera.sort( (a, b) => {
        return a.fecha - b.fecha;
      });
      if(this.cliente){
        this.traerLugarEnLista();
      }
      this.cargando = false;
    });
  }

  sentar(uid){
    this.fire.collection('listaespera', (ref) => ref.where('id', '==', uid))
    .get().subscribe( (data) => {
      this.userData = data.docs[0].data();
      this.userData.puedeSentarse = !this.userData.puedeSentarse;
      data.docs[0].ref.set(this.userData);
    });
  }

  traerLugarEnLista(){
    let len = this.enEspera.length;
    for(let i = 0; i < len; i++){
      if(this.enEspera[i].id == this.user.id){
        this.personasDelante = i;
        break;
      }
    }
  }

  abandonarLista(){
    let uid = this.user.id;
    this.fire.collection('listaespera', (ref) => ref.where('id', '==', uid))
    .get().subscribe( (data) => {
      this.fire.doc('listaespera/' + data.docs[0].id ).delete();
      this.router.navigate(['home/' + this.route.snapshot.paramMap.get('user')]);
    });
    
  }

  escanear(){
    this.spinner = true;
    this.scanner.scan()
    .then( codeInfo => {
      this.manejarCodigoEscaneado(codeInfo);
    })
    .catch( reason => {
      this.presentToast('Hubo un error al escanear. Vuelva a intentar.');
      this.spinner = false;
    });
  }

  manejarCodigoEscaneado(codigo){
    if(codigo.text){
      this.fire.collection('codigos').doc(codigo.text)
      .get().subscribe( docRef => {
        this.manejarDocRef(docRef);
      });
    }else{
      this.presentToast('Hubo un error al escanear. Vuelva a intentar.');
      this.spinner = false;
    }
  }

  manejarDocRef(docRef){
    let codeData = docRef.data();
    if(codeData.tipo == 'mesa'){
      this.manejarMesaEscaneada(codeData);
    }else {
      this.presentToast('El codigo escaneado no es de una mesa.');
      this.spinner = false;
    }
  }

  manejarMesaEscaneada(codeData){
    this.fire.collection('mesas').doc(codeData.valor)
    .get().subscribe( mesaRef => {
      this.spinner = false;
      let mesaData = mesaRef.data();
      if(!mesaData.ocupada){
        mesaData.ocupada = true;
        mesaData.idcliente = this.userData.id;
        mesaRef.ref.set(mesaData);
        this.abandonarLista();
        this.router.navigate(["mesa"], {state : {mesa: mesaData.mesa}});
      }else{
        this.presentToast('La mesa esta ocupada o reservada.');
        this.spinner = false;
      }
    });
  }

  /**
   * Presenta un toast con el mensaje indicado en la posicion indicada, la posicion por default es top.
   * @param message Mensaje a presentar
   * @param pos Posicion del toast
   */
  async presentToast(message: string, pos: 'top' | "middle" | "bottom" = "top") {
    const toast = await this.toast.create({
      message: message,
      duration: 2000,
      position: pos,
      animated: true,
      mode: "md",
    });
    toast.present();
  }

}
