import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from "../../services/auth.service";
import { Router } from '@angular/router';
import { BarcodeScanner } from "@ionic-native/barcode-scanner/ngx";
import { InputVerifierService } from "../../services/input-verifier.service";
import { Camera, CameraOptions, DestinationType, EncodingType, PictureSourceType } from '@ionic-native/camera/ngx';

import { StorageService } from "../../services/storage.service";
import { AngularFireStorage } from "@angular/fire/storage";
import * as firebase from 'firebase';
import { observable } from 'rxjs';

import { AudioService } from "../../services/audio.service";
import { Vibration } from '@ionic-native/vibration/ngx';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  providers: [
    Camera,
    Vibration
  ]
})
export class RegistroPage implements OnInit {
  mostrarSpinner = false;
  sinContinuar = true;
  mostrarNombre = true;
  modoRegistro = true;
  mostrarAgregado = false;
  mostrarError = false;
  error = "";
  titulo = "Modo Anónimo";
  fecha;
  apellido: string = "";
  nombre: string = "";
  dni: number = null;
  email: string = "";
  clave: string = "";
  claveConfirmada: string = "";
  foto: string = "";
  preview = "../../../assets/img/avatarVacio.jpg";
  mostrarBotonera = true;

  constructor(private auth: AuthService,
    private router: Router,
    private barcodeScanner: BarcodeScanner,
    private verifier: InputVerifierService,
    private camera: Camera,
    private dbStorage: StorageService,
    private audio: AudioService,
    private vibration: Vibration,) { }

  ngOnInit() {
    this.audio.reproducirAudioCambioPant();
    this.modoRegistro = this.router.getCurrentNavigation().extras.state.modo;

    if (this.modoRegistro) {
      this.titulo = "Registro de Cliente";
    }
  }

  limpiarCampos() {
    this.apellido = "";
    this.nombre = "";
    this.dni = null;
    this.email = "";
    this.clave = "";
    this.claveConfirmada = "";
    this.foto = "";
  }

  validarCampos() {
    this.error = "";
    this.mostrarError = false;

    if (this.modoRegistro == true) {
      if (this.apellido == "" || this.nombre == "" || this.dni == null || this.email == "" || this.clave == "" || this.claveConfirmada == "") {
        this.error = "¡Por favor, ingrese todos los campos!";
      }
      else if (this.clave != this.claveConfirmada) {
        this.error = "¡Las claves no coinciden!";
      }

      else if(this.dni < 800000 || this.dni > 99999999){
        this.error = "¡El DNI no existe!";
      }
      else if (this.nombre.length > 21){
        this.error = "¡El nombre es muy largo!";
      }
      else if (this.nombre.length < 3){
        this.error = "¡El nombre es muy corto!";
      }
      else if (this.nombre.length > 21){
        this.error = "¡El nombre es muy largo!";
      }
      else if (this.apellido.length < 3){
        this.error = "¡El apellido es muy corto!";
      }
      else if(!InputVerifierService.verifyEmailFormat(this.email)){
        this.error = "¡El correo tiene caracteres inválidos!";
      }
      else if(this.auth.verificarEmailAuth(this.email)){
        this.error = "¡Ya existe una cuenta con ese correo electrónico!";
      }
      else if(this.auth.verificarEmailFire(this.email)){
        this.error = "¡Ya existe un preregistro pendiente de aprobación con ese correo electrónico!";
      }
      else if(this.clave.length < 6){
        this.error = "¡La clave debe tener al menos 6 caracteres!";
      }
    }
    else {
      if (this.nombre == "") {
        this.error = "¡Por favor, ingrese su nombre!";
      }
    }
  }

  validarFoto(){
    if (this.foto == ""){
      this.audio.reproducirAudioErr();
      this.vibration.vibrate(5000);
      setTimeout (() => {
        this.vibration.vibrate(0);
      }, 2000);
      this.error = "¡Por favor, cargue una foto!"; 
    }
  }

  registrar() {
    this.mostrarAgregado = false;
    this.validarFoto();
    if (this.error != "") {
      this.audio.reproducirAudioErr();
      this.vibration.vibrate(5000);
      setTimeout (() => {
        this.vibration.vibrate(0);
      }, 2000);
      this.mostrarError = true;
    }
    else {
      let tipoRegistro = "anonimo";

      if (this.modoRegistro == true) {
        tipoRegistro = "registrado"

        this.auth.registroCliente(this.email, this.clave, this.apellido, this.nombre, this.dni, this.fecha, this.foto)
          .then(() => {
            let storageRef = firebase.storage().ref();
            let childRef = storageRef.child(this.foto);
            childRef.putString(this.preview, 'data_url');

            this.mostrarAgregado = true;
            this.mostrarBotonera = false;
            this.limpiarCampos();
          })
          .catch((error) => {
            this.error = error;
            this.error += ". Por favor, vuelva a intentarlo.";
          });
        }
      else {

        this.auth.registroAnonimo(this.nombre, this.fecha, this.foto)
          .then(() => {
            let storageRef = firebase.storage().ref();
            let childRef = storageRef.child(this.foto);
            
            childRef.putString(this.preview, 'data_url');
            let user = JSON.stringify({ nombre: this.nombre, id: this.nombre + "." + this.fecha, tipo: "anonimo", foto: this.foto, perfil: "cliente" });
            this.limpiarCampos();
            this.router.navigate(["/home/" + user]);

          })
          .catch((error) => {
            this.mostrarError = true;
            this.error = error.message;
          });

      }
    }
  }

  cancelar() {
    this.router.navigate(["/login"]);
  }


  formatear(s: string) {
    let palabra = s.toLowerCase().split(' ');
    for (let i = 0; i < palabra.length; i++) {
      palabra[i] = palabra[i].charAt(0).toUpperCase() + palabra[i].substring(1);
    }
    return palabra.join(' ');
  }

  scanCode() { //anda solamente con el formato nuevo
    this.barcodeScanner.scan({ formats: "PDF_417" }).then(barcodeData => {
      let scannedCode = barcodeData.text;
      let userQR = scannedCode.split("@");
      this.apellido = this.formatear(userQR[1]);
      this.nombre = this.formatear(userQR[2]);
      let auxDni = this.formatear(userQR[4]);
      this.dni = parseInt(auxDni);
    }).catch(error => {
      this.mostrarError = true;
      this.error = error;
    });
  }

  sacarFoto() {
    this.error = "";
    const opciones: CameraOptions = {
      quality: 50,
      targetHeight: 600,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
    }

    if (this.modoRegistro == true) {
      this.camera.getPicture(opciones).then((ImageData) => {
        this.fecha = Date.now();
        this.preview = 'data:image/jpeg;base64,' + ImageData;
        this.foto = this.dni + "." + this.fecha + ".jpg";

      }).catch(e => {
        if (e == "No Image Selected") {
          this.error = "Por favor, saque una foto";
        }
        else {
          this.error = e;
        }
        this.mostrarError = true;
      });
    }
    else {
      this.camera.getPicture(opciones).then((ImageData) => {
        this.fecha = Date.now();
        this.preview = 'data:image/jpeg;base64,' + ImageData;
        this.foto = this.nombre + "." + this.fecha + ".jpg";
      }).catch(e => {
        if (e == "No Image Selected") {
          this.error = "Por favor, saque una foto";
        }
        else {
          this.error = e;
        }
        this.mostrarError = true;
      });
    }
  }

  continuar() {
    this.validarCampos();
    if (this.error == "") {
      this.audio.reproducirAudioCambioPant();
      this.sinContinuar = false;
    }
    else {    
      this.audio.reproducirAudioErr();
      this.vibration.vibrate(5000);
      setTimeout (() => {
        this.vibration.vibrate(0);
      }, 2000);
      this.mostrarError = true;
    }
  }
}



