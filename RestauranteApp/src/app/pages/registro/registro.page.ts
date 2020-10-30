import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from "../../services/auth.service";
import { Router } from '@angular/router';
import { BarcodeScanner } from "@ionic-native/barcode-scanner/ngx";
import { InputVerifierService } from "../../services/input-verifier.service";
import { Camera, CameraOptions, DestinationType, EncodingType, PictureSourceType } from '@ionic-native/camera/ngx';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  providers:[
    Camera
  ]
})
export class RegistroPage implements OnInit {
  modoRegistro = true;
  mostrarAgregado = false;
  mostrarError = false;
  error = "";
  titulo = "Modo Anónimo";

  apellido: string = "";
  nombre: string = "";
  dni: number = null;
  email: string = "";
  clave: string = "";
  claveConfirmada: string = "";
  foto: string = "../../../assets/img/avatarVacio.jpg";

  constructor(private auth: AuthService, private router: Router, private barcodeScanner: BarcodeScanner, private verifier : InputVerifierService, private camera: Camera,) { }

  ngOnInit() {
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
    this.foto = "../../../assets/img/avatarVacio.jpg";
  }

  validarCampos() {
    this.error = "";
    this.mostrarError = false;
    this.foto = "https://firebasestorage.googleapis.com/v0/b/restauranteapp-581eb.appspot.com/o/12123123.1603989824251.jpg?alt=media&token=76495d20-578e-43bc-82a6-83534b0474a2";

    if (this.modoRegistro == true) {
      if (this.apellido == "" || this.nombre == "" || this.dni == null || this.email == "" || this.clave == "" || this.claveConfirmada == "" || this.foto == "../../../assets/img/avatarVacio.jpg") {
        this.error = "Por favor, ingrese todos los campos!";
      }
      else if (this.clave != this.claveConfirmada) {
        this.error = "Las claves no coinciden!";
      }

      if(this.dni < 800000 || this.dni > 99999999){
        this.error = "El DNI no existe!";
      }
      else if (this.nombre.length > 21){
        this.error = "El nombre es muy largo!";
      }
      else if (this.nombre.length < 3){
        this.error = "El nombre es muy corto!";
      }
      else if (this.nombre.length > 21){
        this.error = "El nombre es muy largo!";
      }
      else if (this.apellido.length < 21){
        this.error = "El apellido es muy corto!";
      }
      else if(!this.verifier.verifyEmailFormat(this.email)){
        this.error = "El correo tiene caracteres invalidos!";
      }
    }
    else {
      if (this.nombre == "") {
        this.error = "Por favor, ingrese su nombre!";
      }
      else if(this.foto == "../../../assets/img/avatarVacio.jpg"){
        this.error = "Por favor, ingrese su foto!";
      }
    }
    /*
        if(){
          
        }
    */
  }
  registrar() {
    this.mostrarAgregado = false;
    this.validarCampos();
    if (this.error != "") {
      this.mostrarError = true;
    }
    else {
      //this.spinner = true;
      //setTimeout(() => {
      let tipoRegistro = "anonimo";

      if (this.modoRegistro == true) {
        tipoRegistro = "registrado"

        this.auth.registroCliente(this.email, this.clave, this.apellido, this.nombre, this.dni, this.foto, tipoRegistro)
          .then(() => {
            this.mostrarAgregado = true;
            this.limpiarCampos();
          })
          .catch((error) => {
            this.mostrarError = true;
            if (error.code == "auth/weak-password") {
              this.error = "La clave es muy corta";
            }
            else if (error.code == "auth/email-already-in-use") {
              this.error = "El correo ya existe";
            }
            else if (error.code == "auth/invalid-email") {
              this.error = "El correo ya existe";
            }
            else {
              this.error = error;
            }
          });
      }
      else{
        this.auth.registroAnonimo(this.nombre, this.foto)
          .then(() => {
            this.limpiarCampos();
            this.router.navigate(["/home"]);
          })
          .catch((error) => {
            this.mostrarError = true;
            this.error = error;
          });
        // this.spinner = false;
        //  }, 2000); 
      }
    }
  }

  cancelar(){
    this.router.navigate(["/login"]);
  }

  
  formatear(s: string){
    let palabra = s.toLowerCase().split(' ');
    for(let i=0; i<palabra.length; i++){
      palabra[i] = palabra[i].charAt(0).toUpperCase() + palabra[i].substring(1);
    }
    return palabra.join(' ');
  }
  
  scanCode(){
    this.barcodeScanner.scan({formats: "PDF_417"}).then(barcodeData => {
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
    const opciones: CameraOptions = {
      quality: 50,
      targetHeight: 600,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
    }

    if (this.modoRegistro == true){/*
      this.camera.getPicture(opciones).then((ImageData) => {
        let base64Str = 'data:image/jpeg;base64,' + ImageData;
        let storageRef = firebase.storage().ref();
        let nombre = this.email + "_" + new Date() + "_linda_" +".jpg";
        let childRef = storageRef.child(nombre);
        childRef.putString(base64Str, 'data_url').then(function (snapshot){});
          let votantes: any = new Array();
          this.databases.guardarPublicacion(
            nombre,
            this.email,
            votantes,
            0,
            Date.now()).then(()=>{
              this.traerFotos();
            });
      });*/
    }
    else{//debo guardar la foto en el usuario y luego cargarla en el storage. TESTEAR!
      /*this.camera.getPicture(opciones).then((ImageData) => {
        let base64Str = 'data:image/jpeg;base64,' + ImageData;
        let storageRef = firebase.storage().ref();
        let nombre = this.email + "_" + new Date() + "_linda_" +".jpg";
        let childRef = storageRef.child(nombre);
        childRef.putString(base64Str, 'data_url').then(function (snapshot){});
          let votantes: any = new Array();
          this.databases.guardarFoto(
            nombre,
            this.email,
            votantes,
            0,
            Date.now()).then(()=>{
              this.traerFotos();
            });
      });*/
    }
}

}


