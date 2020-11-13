import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';

import { Camera, CameraOptions, DestinationType, EncodingType, PictureSourceType } from '@ionic-native/camera/ngx';

import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";
import * as firebase from 'firebase';

@Component({
  selector: 'app-encuesta',
  templateUrl: './encuesta.page.html',
  styleUrls: ['./encuesta.page.scss'],
  providers: [
    Camera
  ]
})

export class EncuestaPage implements OnInit {
  spinner = false;
  fotoUser1 = { base64: "https://png.pngtree.com/png-clipart/20190415/ourlarge/pngtree-cute-retro-photo-camera-cartoon-style-illustration-png-image_939633.jpg", fecha: null, nombre: null };
  fotoUser2 = { base64: "https://png.pngtree.com/png-clipart/20190415/ourlarge/pngtree-cute-retro-photo-camera-cartoon-style-illustration-png-image_939633.jpg", fecha: null, nombre: null };
  fotoUser3 = { base64: "https://png.pngtree.com/png-clipart/20190415/ourlarge/pngtree-cute-retro-photo-camera-cartoon-style-illustration-png-image_939633.jpg", fecha: null, nombre: null };

  rangoEdad = "";
  llamativo = "";
  protocolo = "";
  recomendadosAmigos = false;
  recomendadosFamilia = false;
  recomendadosTrabajo = false;
  comentario = "";

  idCliente = null;
  mesa = null;
  arrFotos = new Array();

  enviado;
  error = "";

  constructor(private camera: Camera, private router: Router, private db: AuthService) { }

  ngOnInit() {
    this.mesa = this.router.getCurrentNavigation().extras.state.mesa;
    this.idCliente = this.router.getCurrentNavigation().extras.state.cliente;
    this.enviado =  this.router.getCurrentNavigation().extras.state.encuesta;
  }

  sacarFoto(punteroFoto) {
    const opciones: CameraOptions = {
      quality: 50,
      targetHeight: 600,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
    }

    this.camera.getPicture(opciones).then((ImageData) => {
      punteroFoto.fecha = Date.now();
      punteroFoto.base64 = 'data:image/jpeg;base64,' + ImageData;
      punteroFoto.nombre = this.idCliente + "." + punteroFoto.fecha + ".jpg";
    }).catch(e => {
      console.log(e.message);
    });
  }

  cambiarEdad(e) {
    switch (e.detail.value) {
      case "13a20":
        this.rangoEdad = "13 a 20";
        break;
      case "20a30":
        this.rangoEdad = "20 a 30";
        break;
      case "30a40":
        this.rangoEdad = "30 a 40";
        break;
      case "40mas":
        this.rangoEdad = "40+";
        break;
      default:
        break;
    }
  }

  cambiarLlamativo(e) {
    this.llamativo = e.detail.value;
  }

  cambiarValorProtocolo(e) {
    this.protocolo = e.detail.value;
  }

  cambiarValorRecomendadosAmigos(e) {
    if (!this.recomendadosAmigos) {
      this.recomendadosAmigos = true;
    }
    else {
      this.recomendadosAmigos = false;
    }
  }

  cambiarValorRecomendadosFamilia(e) {
    if (!this.recomendadosFamilia) {
      this.recomendadosFamilia = true;
    }
    else {
      this.recomendadosFamilia = false;
    }
  }

  cambiarValorRecomendadosTrabajo(e) {
    if (!this.recomendadosTrabajo) {
      this.recomendadosTrabajo = true;
    }
    else {
      this.recomendadosTrabajo = false;
    }
  }

  validarRespuestas() {
    if (this.rangoEdad == "") {
      this.error = "Seleccione su edad!!"
    }
    else if (this.llamativo == "") {
      this.error = "Seleccione qué le gustó más!!"
    }
    else if (this.protocolo == "") {
      this.error = "Seleccione nivel de satisfaccion de protocolo!!"
    }
  }

  async enviarRespuestas() {
    this.error = "";
    this.validarRespuestas();

    if (this.error == "") {

      let arrRecomendados = new Array();
      if (this.recomendadosTrabajo) {
        arrRecomendados.push("trabajo");
      }

      if (this.recomendadosAmigos) {
        arrRecomendados.push("amigos");
      }

      if (this.recomendadosFamilia) {
        arrRecomendados.push("familia");
      }
      await this.traerFotos();

      this.spinner = true;
      setTimeout(() => {
        this.db.guardarEncuestaCliente(this.mesa, this.idCliente, this.rangoEdad, this.llamativo, this.protocolo, arrRecomendados, this.comentario, this.arrFotos);
        this.enviado = true;
        this.spinner = false;
      }, 5000);
    }
  }

  traerFotos() {
    if (this.fotoUser1.fecha != null) {
      this.guardarFoto(this.fotoUser1);
    }

    if (this.fotoUser2.fecha != null) {
      this.guardarFoto(this.fotoUser2);
    }

    if (this.fotoUser3.fecha != null) {
      this.guardarFoto(this.fotoUser3);
    }
  }

  async guardarFoto(fotoUser) {
    let storageRef = firebase.storage().ref();
    let childRef = storageRef.child(fotoUser.nombre);

    await childRef.putString(fotoUser.base64, 'data_url');

    await this.db.buscarFotoPorNombre(fotoUser.nombre).then(link => {
      this.arrFotos.push(link);
    });
  }

  verResultados() {
    alert("NO SE HACER GRAFICOS XDDDDDDDD");
  }

  volverAtras() {
    this.router.navigate(["/mesa"], { state: { encuesta: true } });
  }
}



