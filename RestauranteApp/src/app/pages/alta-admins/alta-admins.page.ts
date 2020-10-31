import { Component, OnInit } from '@angular/core';
import { InputVerifierService } from "../../services/input-verifier.service";

@Component({
  selector: 'app-alta-admins',
  templateUrl: './alta-admins.page.html',
  styleUrls: ['./alta-admins.page.scss'],
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
  foto: string = "assets/img/avatarVacio.jpg";
  fotoAGuardar: string = "";
  mensaje: string = "";
  error: string = "";
  agregado: boolean = false;
  hayError: boolean = false;
  spinner: boolean = false;

  constructor(private inputVerifier: InputVerifierService) { }

  ngOnInit() {
  }

  validarCampos(){
    this.error = "";
    this.hayError = false;

    if (this.hayError) {
      if (this.apellido == "" || this.nombre == "" || this.dni == null || this.cuil == null  || this.perfil == "" || this.correo == "" || this.clave == "" || this.claveConfirmada == "" || this.foto == "") {
        this.error = "¡Por favor, ingrese todos los campos!";
      }
      else if (this.clave != this.claveConfirmada) {
        this.error = "¡Las claves no coinciden!";
      }

      if(this.dni < 800000 || this.dni > 99999999){
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
      else if(!this.inputVerifier.verifyEmailFormat(this.correo)){
        this.error = "¡El correo tiene caracteres invalidos!";
      }

      if (this.foto != "" ){
        this.fotoAGuardar = this.foto;
      }
    }
    else {
      if (this.nombre == "") {
        this.error = "¡Por favor, ingrese su nombre!";
      }

      if(this.fotoAGuardar != "" ){
        this.error = "¡Por favor, ingrese su foto!";
      }
      else{
        this.fotoAGuardar = this.foto;
      }
    }
  }

  registrar(){

  }

  guardarPerfil(event){
    this.perfil = event.detail.value;
  }

  cancelar(){
    this.apellido = "";
    this.nombre = "";
    this.dni = null;
    this.cuil = null;
    this.correo = "";
    this.clave = "";
    this.claveConfirmada = "";
    this.foto = "assets/img/avatarVacio.jpg";
  }
}
