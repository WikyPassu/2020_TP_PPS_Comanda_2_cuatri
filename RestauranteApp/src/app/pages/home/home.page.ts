/**
 * Este home page es para los clientes, por el momento la unica actividad 
 * posible es escanear el QR para entrar a la lista de espera.
 */

import { JsonPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { BarcodeScanner, BarcodeScannerOptions, BarcodeScanResult } from '@ionic-native/barcode-scanner/ngx';

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
  private user: any;

  constructor(
    private scanner: BarcodeScanner,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    try{
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
    }
    
    /*this.route.paramMap.subscribe( (data) => {
      let tipo = 'cliente';
      console.log(data['user']);
      if(tipo == 'cliente'){
        this.cambiarTab('local');
      } else if (tipo == 'supervisor' || tipo == 'dueño'){
        this.router.navigate(['supervisor']);
      } else {
        this.router.navigate(['login']);
      }
    })*/
  }

  cambiarTab(tabName: string){
    this.tab = 'cambiando';
    setTimeout( () => {this.tab = tabName}, 1000)
  }
  escanear(foo){
    //console.log(foo);
  }
  agregarComenzal(cantidad: number){
    let resultado = this.comenzales + cantidad;
    this.comenzales = resultado > this.maximo ? this.maximo : resultado < this.minimo ? this.minimo : resultado;
    console.log(this.comenzales);
  }

}
