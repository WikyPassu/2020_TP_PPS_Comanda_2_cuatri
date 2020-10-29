import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email:string = "";
  pwd:string = "";
  err:string;
  hide:boolean = true;
  spinner:boolean = false;
  aprobado:boolean = true;
  perfil: string = "cliente";

  constructor(private authService : AuthService, public router : Router) { 
  }

  ngOnInit() {
  }

  onSubmitLogin(){
    this.verificarSiEstaAprobado();
    this.traerTipoEmpleado();

    this.err = "";


    if(this.email == "" && this.pwd == ""){
      this.err = "Por favor, ingrese correo y contraseña!"
    }
    else if(this.email == "")
    {
      this.err = "Por favor, ingrese su correo!";
    }
    else if(this.pwd == "")
    {
      this.err = "Por favor, ingrese su contraseña!";
    }

      
    if(this.err != ""){
      this.hide = false;
    }
    else{
      this.hide = true;
      this.spinner = true;
      setTimeout(() => {
        this.authService.login(this.email, this.pwd).then(res =>{
          this.spinner = false;
          //ACA SE PASA LA VARIABLE APROBADO Y PERFIL HACIA EL HOME!
          console.log(this.perfil);
          this.router.navigate(["/home"], {state : {email: this.email, perfil : this.perfil, aprobado: this.aprobado}});
          this.clean();
        }).catch(error =>{
          this.spinner = false;
          console.log(error.code);
          if(error.code == "auth/invalid-email")
          {
            this.err = "Ingrese un correo válido!";
          }
          else if(error.code == "auth/user-not-found")
          {
            this.err = "No existe un usuario con dicho correo electrónico.";
          }
          else if(error.code == "auth/wrong-password")
          {
            this.err = "Contraseña incorrecta.";
          }
          else{
            this.err = error;
          }
          this.hide = false;
        });  
      }, 2000);
    }
  }

  clean(){
    this.email="";
    this.pwd="";
    this.hide = true;
  }

  loginDuenio(){
    this.email="dueño@dueño.com";
    this.pwd="111111";
    this.onSubmitLogin();
  }

  loginCliente(){
    this.email="cliente@cliente.com";
    this.pwd="222222";
    this.onSubmitLogin();
  }

  loginSupervisor(){
    this.email="supervisor@supervisor.com";
    this.pwd="333333";
    this.onSubmitLogin();
  }

  loginEmpleado(){
    this.email="empleado@empleado.com";
    this.pwd="444444";
    this.onSubmitLogin();
  }

  irRegistro(){
    this.router.navigate(["/registro"]);
  }

  /**
   * setea el tipo de empleado en perfil, caso contrario no sobreescribe y queda en cliente
   */
  async traerTipoEmpleado(){
    await this.authService.traerEmpleados().subscribe((res) => {
      let lista = null;

      lista = new Array();
      res.forEach((datosEmp: any) => {
        lista.push(datosEmp.payload.doc.data());
      });
      
      lista.forEach(e => {
        if (e.correo == this.email){
          this.perfil = e.perfil;
        }
      });
    });

  }

  /**
   * se fija si la persona logueada todavia no fue aprobada
   * setea false si no fue aprobada
   */
  async verificarSiEstaAprobado (){
    await this.authService.traerClientesSinAprobar().subscribe((res) => {
      let lista = null;

      lista = new Array();
      res.forEach((datosClientes: any) => {
        lista.push(datosClientes.payload.doc.data());
      });
      
      lista.forEach(c => {
        if (c.correo == this.email){
          this.aprobado = false;
        }
      });
    });
  }
}
