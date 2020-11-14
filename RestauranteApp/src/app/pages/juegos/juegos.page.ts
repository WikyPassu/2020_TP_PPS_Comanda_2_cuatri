import { Component, OnInit } from '@angular/core';

import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-juegos',
  templateUrl: './juegos.page.html',
  styleUrls: ['./juegos.page.scss'],
})
export class JuegosPage implements OnInit {

  intentosDiez;
  intentosQuince;
  intentosTreinta;

  resultDiez = "";
  resultQuince = "";
  resultTreint = "";

  sacarBotones = false;
  idCliente = null;

  constructor(private router: Router, private db: AuthService) { }


  ngOnInit() {
    this.idCliente = this.router.getCurrentNavigation().extras.state.cliente;

    this.intentosDiez = this.router.getCurrentNavigation().extras.state.intentosDiez;
    this.intentosQuince = this.router.getCurrentNavigation().extras.state.intentosQuince;
    this.intentosTreinta = this.router.getCurrentNavigation().extras.state.intentosTreinta;
  }

  descuentoDiezTotal() {
    this.sacarBotones = true;
    if (this.intentosDiez > 0) {
      this.resultDiez = "Espera..."
      let descuento = Math.random() * (21 - 1) + 1;
      descuento = Math.round(descuento);
      if (descuento == 10) {
        setTimeout(() => {
          this.intentosDiez = 0;
          this.resultDiez = "LO HICISTE!!";
          this.intentosTreinta = 0;
          this.intentosQuince = 0;

          this.db.setearDescuentoPedido(this.idCliente, 10);
        }, 2000);
      }
      else {
        setTimeout(() => {
          this.intentosDiez--;
          this.resultDiez = "Mejor suerte la próxima :(";
          this.sacarBotones = false;
        }, 2000);
      }
    }
    else {
      this.resultDiez = "No te quedan más intenetos :("
      this.sacarBotones = false;
    }

  }
  descuentoQuinceTotal() {
    if (this.intentosQuince > 0) {
      this.sacarBotones = true;
      this.resultQuince = "Espera..."
      let descuento = Math.random() * (11 - 1) + 1;
      descuento = Math.round(descuento);
      if (descuento == 10) {
        setTimeout(() => {
          this.intentosQuince = 0;
          this.resultQuince = "SI!!";
          this.intentosDiez = 0;
          this.intentosTreinta = 0;

          this.db.setearDescuentoPedido(this.idCliente, 15);
        }, 2000);
      }
      else {
        setTimeout(() => {
          this.intentosQuince--;
          this.resultQuince = "Mejor suerte la próxima :(";
          this.sacarBotones = false;
        }, 2000);
      }
    }
    else {
      this.resultQuince = "No te quedan más intentos :("
      this.sacarBotones = false;
    }
  }

  descuentoTreintaTotal() {
    if (this.intentosTreinta > 0) {
      this.sacarBotones = true;
      this.resultTreint = "Espera..."
      let descuento = Math.random() * (31 - 1) + 1;
      descuento = Math.round(descuento);
      if (descuento == 10) {
        setTimeout(() => {
          this.intentosTreinta = 0;
          this.resultTreint = "ES TU DIA!!";
          this.intentosDiez = 0;
          this.intentosQuince = 0;

          this.db.setearDescuentoPedido(this.idCliente, 30);
        }, 2000);
      }
      else {
        setTimeout(() => {
          this.intentosTreinta--;
          this.resultTreint = "Mejor suerte la próxima :(";
          this.sacarBotones = false;
        }, 2000);
      }
    }
    else {
      this.resultTreint = "No te quedan más intenetos :("
      this.sacarBotones = false;
    }
  }

  volverAtras() {
    let state = { state: { intentosDiez: this.intentosDiez, intentosQuince: this.intentosQuince, intentosTreinta: this.intentosTreinta } };
    this.router.navigate(["/mesa"], state);
  }
}
