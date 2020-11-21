import { Component, OnInit } from '@angular/core';
import { InputVerifierService } from "../../services/input-verifier.service";
import { AuthService } from "../../services/auth.service";
import { BarcodeScanner } from "@ionic-native/barcode-scanner/ngx";
import { Camera, CameraOptions, DestinationType, EncodingType, PictureSourceType } from '@ionic-native/camera/ngx';
import * as firebase from 'firebase';
import { AudioService } from "../../services/audio.service";
import { Vibration } from '@ionic-native/vibration/ngx';


@Component({
  selector: 'app-alta-admins',
  templateUrl: './alta-admins.page.html',
  styleUrls: ['./alta-admins.page.scss'],
  providers: [Camera,
  Vibration]
})
export class AltaAdminsPage implements OnInit {

  apellido: string = "";
  nombre: string = "";
  dni: number = null;
  cuil: number = null;
  perfil: string = "";
  correo: string = "";
  clave: string = "";
  claveConfirmada: string = "";
  preview: string = "assets/img/avatarVacio.jpg";
  foto: string = "";
  mensaje: string = "";
  error: string = "";
  agregado: boolean = false;
  hayError: boolean = false;
  spinner: boolean = false;

  constructor(private db: AuthService, private barcodeScanner: BarcodeScanner, private camera: Camera,
    private audio: AudioService,
    private vibration: Vibration,
) { }

  ngOnInit() {
    this.audio.reproducirAudioCambioPant();
  }

  validarCampos(){
    this.error = "";
    this.hayError = false;
    
    if (this.apellido == "" || this.nombre == "" || this.dni == null || this.cuil == null || this.correo == "" || this.clave == "" || this.claveConfirmada == "") {
      this.error = "¡Por favor, ingrese todos los campos!";
    }
    else if (this.clave != this.claveConfirmada) {
      this.error = "¡Las claves no coinciden!";
    }
    else if(this.dni < 800000 || this.dni > 99999999){
      this.error = "¡El DNI no existe!";
    }
    else if(this.cuil < 208000009 || this.cuil > 27999999999){
      this.error = "¡El CUIL no existe!";
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
    else if(this.perfil == ""){
      this.error = "¡Debe elegir un perfil!"
    }
    else if(!InputVerifierService.verifyEmailFormat(this.correo)){
      this.error = "¡El correo tiene caracteres inválidos!";
    }
    else if(this.clave.length < 6){
      this.error = "¡La clave debe tener al menos 6 caracteres!";
    }
  }

  validarFoto(){
    if (this.foto == "" && this.error == ""){
      this.error = "¡Por favor, cargue una foto!"; 
    }
  }

  vibrar(){
    this.audio.reproducirAudioErr();
    this.vibration.vibrate(5000);
    setTimeout (() => {
      this.vibration.vibrate(0);
   }, 2000);
  }

  registrar(){
    this.agregado = false;
    this.validarCampos();
    this.validarFoto();
    if(this.error != ""){
      this.hayError = true;
      this.vibrar();
    }
    else{
      this.db.registroAdmins(this.apellido, this.nombre, this.dni, this.cuil, this.perfil, this.correo, this.clave, this.foto)
      .then(() => {
        this.limpiar();
        this.agregado = true;
        this.mensaje = "¡Empleado agregado exitosamente!";
      })
      .catch(error => {
        this.hayError = true;
        this.vibrar();
        if (error.code == "auth/weak-password") {
          this.error = "La clave es muy corta.";
        }
        else if (error.code == "auth/email-already-in-use") {
          this.error = "El correo ya existe.";
        }
        else if (error.code == "auth/invalid-email") {
          this.error = "El correo es inválido.";
        }
        else {
          this.error = error;
        }
        this.error += ". Por favor, vuelva a intentarlo.";
      });
    }
  }

  formatear(s: string){
    let palabra = s.toLowerCase().split(' ');
    for(let i=0; i<palabra.length; i++){
      palabra[i] = palabra[i].charAt(0).toUpperCase() + palabra[i].substring(1);
    }
    return palabra.join(' ');
  }

  scanCode(){ //anda solamente con el formato nuevo
    this.barcodeScanner.scan({formats: "PDF_417"}).then(barcodeData => {
      let scannedCode = barcodeData.text;
      let userQR = scannedCode.split("@");
      this.apellido = this.formatear(userQR[1]);
      this.nombre = this.formatear(userQR[2]);
      let auxDni = this.formatear(userQR[4]);
      this.dni = parseInt(auxDni);
    }).catch(error => {
      this.hayError = true;
      this.vibrar();
      this.error = error;
    });
  }

  sacarFoto() {
    this.error = "";
    this.hayError = false;
    this.db.borrarFoto(this.preview);
    const opciones: CameraOptions = {
      quality: 50,
      targetHeight: 600,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
    }
    this.camera.getPicture(opciones).then((ImageData) => {
      let base64Str = 'data:image/jpeg;base64,' + ImageData;
      let storageRef = firebase.storage().ref();
      let fecha = Date.now();
      let nombreFoto = this.dni + "." + fecha +".jpg";

      let childRef = storageRef.child(nombreFoto);
      
      childRef.putString(base64Str, 'data_url').then((res)=>{
        storageRef.listAll().then((lista)=>{
          lista.items.forEach(foto => {
            if (foto.name == nombreFoto){
              foto.getDownloadURL().then((link)=>{
                this.preview = link;
              });
            }
          });
        })
      });
      this.foto = nombreFoto;
    }).catch(error => {
        if(error == "No Image Selected"){
          this.error = "Por favor, saque una foto.";
        }
        else{
          this.error = error;
        }
        this.hayError = true;
        this.vibrar();
    });
  }

  guardarPerfil(event){
    this.perfil = event.detail.value;
  }

  limpiar(){
    this.apellido = "";
    this.nombre = "";
    this.dni = null;
    this.cuil = null;
    this.correo = "";
    this.clave = "";
    this.claveConfirmada = "";
    this.foto = "";
    this.preview = "assets/img/avatarVacio.jpg";
    this.error = "";
    this.hayError = false;
    this.agregado = false;
  }
}
