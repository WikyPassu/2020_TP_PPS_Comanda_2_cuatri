/**
 * Este home page es para los clientes, por el momento la unica actividad 
 * posible es escanear el QR para entrar a la lista de espera.
 */
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { BarcodeScanner, BarcodeScannerOptions, BarcodeScanResult } from '@ionic-native/barcode-scanner/ngx';
import { ToastController } from '@ionic/angular';
import { BackButtonEvent } from '@ionic/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  public spinner: boolean = false;
  public tab: string = 'cambiando';
  public comenzales: number = 1;
  public email: string;
  public maximo: number = 4;
  public minimo: number = 1;
  public acceso: boolean = false; 
  private user: any;
  

  constructor(
    private scanner: BarcodeScanner,
    private router: Router,
    private route: ActivatedRoute,
    private toast: ToastController,
    private fire: AngularFirestore,
  ) { }

  ngOnInit() {
    document.addEventListener('ionBackButton', this.verificarListaEspera);
    this.tab = 'local';
    try{
      this.user = JSON.parse(this.route.snapshot.paramMap.get('user'));    
      this.verificarListaEspera();  
      if(this.user.perfil == 'cliente'){
        this.cambiarTab('local');
      } else if (this.user.perfil == 'dueño' || this.user.perfil == 'supervisor'){
        this.router.navigate(['supervisor']);
      } else {
        this.router.navigate(['login']);
      }
    } catch {
      this.router.navigate(['login']);
    }
  }

  cambiarTab(tabName: string){
    this.tab = 'cambiando';
    setTimeout( () => {this.tab = tabName}, 1000)
  }
  escanear(){
    //this.presentToast('Escaner');
    let resultado: string = 'OqJvTwaXF5GvroLveLvQ';
    this.fire.doc('codigos/' + resultado)
    .get().subscribe( (data => {
      let code = data.data();
      if(code.tipo == 'lista-espera'){
        this.agregarAListaDeEspera();
      }else{
        this.presentToast('El codigo escaneado no de entrada.');
      }
    }));
  }
  agregarComenzal(cantidad: number){
    let resultado = this.comenzales + cantidad;
    this.comenzales = resultado > this.maximo ? this.maximo : resultado < this.minimo ? this.minimo : resultado;
    //console.log(this.comenzales);
  }
  async presentToast(message) {
    const toast = await this.toast.create({
      message: message,
      duration: 2000,
      position: "top",
      animated: true,
      mode: "md",
    });
    toast.present();
  }
  agregarAListaDeEspera(){
    let nuevoEnLista = {
      nombre: this.user.nombre,
      id: this.user.id,
      foto: this.user.foto,
      fecha: Date.now(),
      comenzales: this.comenzales,
      acceso: this.acceso,
    }
    //console.log(nuevoEnLista);
    this.fire.collection('listaespera').add(nuevoEnLista)
    .then( () => {
      this.router.navigate(['lista-espera']);
    })
    .catch( () => {
      this.presentToast('Hubo un error, vuelva a intentar.');
    });
  }

  async verificarListaEspera(){
    let userStr: string = JSON.stringify(this.user);
    this.fire.collection('listaespera', (ref) => ref.where('id', '==', this.user.id))
    .valueChanges().subscribe( (resultList) => {
      //console.log(resultList);
      if(resultList.length > 0){
        this.router.navigate(['lista-espera/' + userStr]);
      }
    });
  }
}
