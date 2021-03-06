import { Component, OnInit } from '@angular/core';

import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";
import { AudioService } from "../../services/audio.service";

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

  constructor(private router: Router, private db: AuthService,
    private audio: AudioService) { }


  ngOnInit() {
    this.audio.reproducirAudioCambioPant();
    this.idCliente = this.router.getCurrentNavigation().extras.state.cliente;
    this.db.traerPedidoCliente(this.idCliente).subscribe((p: any) => {
      this.intentosDiez = p[0].intentosDescuentoDiez;
      this.intentosQuince = p[0].intentosDescuentoQuince;
      this.intentosTreinta = p[0].intentosDescuentoTreinta;
    });
    /*
      this.spinner = true;
      setTimeout(() => {
        this.spinner = false;
      }, 3000);
    */
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
          this.resultDiez = "¡LO HICISTE!";
          this.intentosTreinta = 0;
          this.intentosQuince = 0;

          this.db.setearIntentoDescuento10(this.idCliente, this.intentosDiez);
          this.db.setearIntentoDescuento15(this.idCliente, this.intentosQuince);
          this.db.setearIntentoDescuento30(this.idCliente, this.intentosTreinta);

          this.db.setearDescuentoPedido(this.idCliente, 10);
        }, 2000);
      }
      else {
        setTimeout(() => {
          this.intentosDiez--;
          this.db.setearIntentoDescuento10(this.idCliente, this.intentosDiez);
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
          this.resultQuince = "¡SI!";
          this.intentosDiez = 0;
          this.intentosTreinta = 0;

          this.db.setearIntentoDescuento10(this.idCliente, this.intentosDiez);
          this.db.setearIntentoDescuento15(this.idCliente, this.intentosQuince);
          this.db.setearIntentoDescuento30(this.idCliente, this.intentosTreinta);

          this.db.setearDescuentoPedido(this.idCliente, 15);
        }, 2000);
      }
      else {
        setTimeout(() => {
          this.intentosQuince--;
          this.db.setearIntentoDescuento15(this.idCliente, this.intentosQuince);
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
          this.resultTreint = "¡ES TU DÍA!";
          this.intentosDiez = 0;
          this.intentosQuince = 0;

          this.db.setearIntentoDescuento10(this.idCliente, this.intentosDiez);
          this.db.setearIntentoDescuento15(this.idCliente, this.intentosQuince);
          this.db.setearIntentoDescuento30(this.idCliente, this.intentosTreinta);

          this.db.setearDescuentoPedido(this.idCliente, 30);
        }, 2000);
      }
      else {
        setTimeout(() => {
          this.intentosTreinta--;
          this.db.setearIntentoDescuento30(this.idCliente, this.intentosTreinta);
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
