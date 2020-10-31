/**
 * Este home page es para los clientes, por el momento la unica actividad 
 * posible es escanear el QR para entrar a la lista de espera.
 */

import { Component, OnInit } from '@angular/core';
import { BarcodeScanner, BarcodeScannerOptions, BarcodeScanResult } from '@ionic-native/barcode-scanner/ngx';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  public tab: string = '';
  public comenzales: number;
  public email: string;

  constructor(
    private scanner: BarcodeScanner,
  ) { }

  ngOnInit() {
    this.cambiarTab('local');
  }

  cambiarTab(tabName: string){
    this.tab = 'cambiando';
    setTimeout( () => {this.tab = tabName}, 1000)
  }
  escanear(){}
    

}
