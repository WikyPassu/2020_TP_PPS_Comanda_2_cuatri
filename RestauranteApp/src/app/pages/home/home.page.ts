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
import { AuthService } from 'src/app/services/auth.service';

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

  async ngOnInit() {
    document.addEventListener('ionBackButton', this.verificarListaEspera);
    try{
      let userStr = this.route.snapshot.paramMap.get('user')
      this.user = JSON.parse(userStr);
      await this.verificarListaEspera().then(estaEnLista => {
        if(estaEnLista){
          this.router.navigate(['listaespera/' + userStr]);
        }
      });
      await this.verificarSentado().then( mesa => {
        this.router.navigate(["mesa"], {state : {mesa: mesa}});
      });
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

  /**
   * Cambia de tab
   * @param tabName Nombre del tab.
   */
  cambiarTab(tabName: string){
    this.tab = 'cambiando';
    setTimeout( () => {this.tab = tabName}, 1000);
  }

  /**
   * Abre la camara para escanear un codigo QR. Si el QR es el de lista de espera
   * agrega al usuario a la lista, si no es QR de lista, lo notifica mediante un toast.
   */
  escanear(){
    this.scanner.scan().then( (code) => {      
      this.fire.doc('codigos/' + code.text)
      .get().subscribe( (data => {
        let codigoQR = data.data();
        if(codigoQR.tipo == 'lista-espera'){
          this.agregarAListaDeEspera();
        }else{
          this.presentToast('El codigo escaneado no es de entrada.', 'middle');
        }
      }));
    }).catch( reason => {
      this.presentToast('Error en escaneo', 'middle');
    });
  }

  /**
   * Cambia la cantidad de comenzales para la reserva
   * @param cantidad Comenzales a sumar
   */
  agregarComenzal(cantidad: number){
    let resultado = this.comenzales + cantidad;
    this.comenzales = resultado > this.maximo ? this.maximo : resultado < this.minimo ? this.minimo : resultado;
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

  /**
   * Verifica si el usuario ya esta en la lista de espera, si ya esta redirecciona
   * a la pagina de lista de espera, si no esta, agrega al usuario a la lista y redirecciona
   * a la pagina de lista de espera. Presenta errores por medio de toast.
   */
  async agregarAListaDeEspera(){
    this.verificarListaEspera().then( alreadyExists => {
      let userStr: string = JSON.stringify(this.user);
      if(alreadyExists){
        this.presentToast('Ya estas en la lista de espera.', 'middle');
        setTimeout( () => {
          this.router.navigate(['listaespera/' + userStr]);
        }, 1500);
      } else {
        let nuevoEnLista = {
          nombre: this.user.nombre,
          id: this.user.id,
          foto: this.user.foto,
          fecha: Date.now(),
          comenzales: this.comenzales,
          acceso: this.acceso,
          puedeSentarse: false,
        }
        console.log(nuevoEnLista);
        this.fire.collection('listaespera').add(nuevoEnLista)
        .then( () => {
          this.router.navigate(['listaespera/' + userStr]);
        })
        .catch( () => {
          this.presentToast('Hubo un error, vuelva a intentar.');
        });
      }
    });
  }

  /**
   * Verifica si el usuario ya esta en la lista de espera y retorma una promesa
   * que, una vez cuncluida, devuelve un boolean en true si ya esta en la lista
   * y en false si no esta en la lista.
   */
  async verificarListaEspera(): Promise<boolean>{
    return new Promise( (resolve, reject) => {
      this.fire.collection('listaespera', (ref) => ref.where('id', '==', this.user.id))
      .valueChanges().subscribe( (resultList) => {
        if(resultList.length > 0){
          resolve(true);
        } else {
          resolve(false);
        }
      })
    });
  }

  async verificarSentado(){
    return new Promise( (resolve, reject) => {
      this.fire.collection('mesas', (ref) => ref.where('idcliente', '==' , this.user.id))
      .valueChanges().subscribe( (resultList) => {
        if(resultList.length > 0){
          resolve((<any>resultList[0]).mesa);
        } else {
          resolve(false)
        }
      })
    });
  }
}
