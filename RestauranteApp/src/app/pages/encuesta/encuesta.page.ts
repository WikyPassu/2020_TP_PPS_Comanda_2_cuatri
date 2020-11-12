import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';

import { Camera, CameraOptions, DestinationType, EncodingType, PictureSourceType } from '@ionic-native/camera/ngx';

@Component({
  selector: 'app-encuesta',
  templateUrl: './encuesta.page.html',
  styleUrls: ['./encuesta.page.scss'],
  providers: [
    Camera
  ]
})
export class EncuestaPage implements OnInit {

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
  
  enviado = false;
  constructor(private camera: Camera,) { }

  ngOnInit() {
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
      punteroFoto.nombre = "NOMBRECLIENTE" + "." + punteroFoto.fecha + ".jpg";
      alert(punteroFoto);
    }).catch(e => {
      alert(e.message);
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

  cambiarLlamativo(e){
    this.llamativo = e.detail.value;
  }

  cambiarValorProtocolo(e){
    this.protocolo = e.detail.value; 
  }

  cambiarValorRecomendadosAmigos(e){
    if (!this.recomendadosAmigos){
      this.recomendadosAmigos = true;
    }
    else{
      this.recomendadosAmigos = false;
    }
  }
  
  cambiarValorRecomendadosFamilia(e){
    if (!this.recomendadosFamilia){
      this.recomendadosFamilia = true;
    }
    else{
      this.recomendadosFamilia = false;
    }
  }

  cambiarValorRecomendadosTrabajo(e){
    if (!this.recomendadosTrabajo){
      this.recomendadosTrabajo = true;
    }
    else{
      this.recomendadosTrabajo = false;
    }
  }

  enviarRespuestas(){
    //range listo para enviar
    //select listo para enviar
    //rango edad listo para enviar
    //fotos listas para enviar
    //comentario listo para enviar
  }

  verResultados() {
    alert("NO SE HACER GRAFICOS XDDDDDDDD");
  }
}



