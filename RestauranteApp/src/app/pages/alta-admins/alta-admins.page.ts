import { Component, OnInit } from '@angular/core';
import { InputVerifierService } from "../../services/input-verifier.service";
import { AuthService } from "../../services/auth.service";

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
  preview: string = "assets/img/avatarVacio.jpg";
  foto: string = "test";
  mensaje: string = "";
  error: string = "";
  agregado: boolean = false;
  hayError: boolean = false;
  spinner: boolean = false;

  constructor(private db: AuthService) { }

  ngOnInit() {
  }

  validarCampos(){
    this.error = "";
    this.hayError = false;
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
    else if(!InputVerifierService.verifyEmailFormat(this.correo)){
      this.error = "¡El correo tiene caracteres invalidos!";
    }
    else if(this.clave.length < 6){
      this.error = "¡La clave debe tener al menos 6 caracteres!";
    }
  }

  validarFoto(){
    if (this.foto == ""){
      this.error = "¡Por favor, cargue una foto!"; 
    }
  }

  registrar(){
    this.agregado = false;
    this.validarCampos();
    this.validarFoto();
    if(this.error != ""){
      this.hayError = true;
    }
    else{
      this.db.registroAdmins(this.apellido, this.nombre, this.dni, this.cuil, this.perfil, this.correo, this.clave, this.foto)
      .then(() => {
        this.agregado = true;
        this.limpiar();
      })
      .catch(error => {
        this.hayError = true;
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
    this.foto = "assets/img/avatarVacio.jpg";
  }
}
