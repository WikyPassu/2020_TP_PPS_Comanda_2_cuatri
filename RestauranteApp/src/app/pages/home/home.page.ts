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

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  public tab: string = '';
  public comenzales: number = 1;
  public email: string;
  public maximo: number = 4;
  public minimo: number = 1;
  public acceso;
  private user: any;


  constructor(
    private scanner: BarcodeScanner,
    private router: Router,
    private route: ActivatedRoute,
    private toast: ToastController,
    private fire: AngularFirestore,
  ) { }

  ngOnInit() {
    this.tab = 'local';
    /*try{
      this.user = JSON.parse(this.route.snapshot.paramMap.get('user'));
      
      if(this.user.perfil == 'cliente'){
        this.cambiarTab('local');
      } else if (this.user.perfil == 'dueño' || this.user.perfil == 'supervisor'){
        this.router.navigate(['supervisor']);
      } else {
        this.router.navigate(['login']);
      }
    } catch {
      this.router.navigate(['login']);
    }*/
  }

  cambiarTab(tabName: string){
    this.tab = 'cambiando';
    setTimeout( () => {this.tab = tabName}, 1000)
  }
  escanear(foo){
    this.presentToast('Escaner');
    let resultado: string = 'OqJvTwaXF5GvroLveLvQ';
    this.fire.doc('codigos/' + resultado)
    .get().subscribe( (data) => {
      console.log(data.data() );
    });
  }
  agregarComenzal(cantidad: number){
    let resultado = this.comenzales + cantidad;
    this.comenzales = resultado > this.maximo ? this.maximo : resultado < this.minimo ? this.minimo : resultado;
    console.log(this.comenzales);
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
}
