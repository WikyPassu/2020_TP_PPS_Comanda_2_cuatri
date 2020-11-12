import { Component, OnInit } from '@angular/core';
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';

@Component({
  selector: 'app-juegos',
  templateUrl: './juegos.page.html',
  styleUrls: ['./juegos.page.scss'],
})
export class JuegosPage implements OnInit {

  intentosDiez = 3;
  intentosBebida = 3;
  intentosTreinta = 1;

  resultDiez = "";
  resultBebida = "";
  resultTreint = "";

  sacarBotones = false;

  constructor() { }

  ngOnInit() {
  }

  descuentoDiezTotal(){
    this.sacarBotones = true;
    if(this.intentosDiez > 0){
      this.resultDiez = "Espera..."
      let descuento = Math.random() * (21 - 1) + 1;
      descuento = Math.round(descuento);
      if (descuento == 10){
        setTimeout(() => {
          this.intentosDiez = 0;
        this.resultDiez = "LO HICISTE!!";
        this.sacarBotones = false;
        }, 2000);
      }
      else{
        setTimeout(() => {
          this.intentosDiez--;
        this.resultDiez = "Mejor suerte la próxima :(";
        this.sacarBotones = false;
        }, 2000);
      }
    }
    else{
      this.resultDiez = "No te quedan más intenetos :("
      this.sacarBotones = false;
    }

  }

  descuentoBebida(){
    if(this.intentosBebida > 0){
      this.sacarBotones = true;
      this.resultBebida = "Espera..."
      let descuento = Math.random() * (11 - 1) + 1;
      descuento = Math.round(descuento);
      if (descuento == 10){
        setTimeout(() => {
          this.intentosBebida = 0;
        this.resultBebida = "SI!!";
        this.sacarBotones = false;
        }, 2000);
      }
      else{
        setTimeout(() => {
          this.intentosBebida--;
        this.resultBebida = "Mejor suerte la próxima :(";
        this.sacarBotones = false;
        }, 2000);
      }
    }
    else{
      this.resultBebida = "No te quedan más intentos :("
      this.sacarBotones = false;
    }
  }

  descuentoTreintaTotal(){
    if(this.intentosTreinta > 0){    
      this.sacarBotones = true;  
      this.resultTreint = "Espera..."
      let descuento = Math.random() * (31 - 1) + 1;
      descuento = Math.round(descuento);
      if (descuento == 10){
        setTimeout(() => {
          this.intentosTreinta = 0;
        this.resultTreint = "ES TU DIA!!";
        this.sacarBotones = false;
        }, 2000);
      }
      else{
        setTimeout(() => {
          this.intentosTreinta--;
        this.resultTreint = "Mejor suerte la próxima :(";
        this.sacarBotones = false;
        }, 2000);
      }
    }
    else{
      this.resultTreint = "No te quedan más intenetos :("
      this.sacarBotones = false;
    }
  }
}
