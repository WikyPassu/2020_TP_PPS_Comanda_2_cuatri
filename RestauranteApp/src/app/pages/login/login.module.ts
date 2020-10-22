import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoginPageRoutingModule } from './login-routing.module';

import { LoginPage } from './login.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoginPageRoutingModule
  ],
  declarations: [LoginPage]
})
export class LoginPageModule {
  email:string = "";
  pwd:string = "";
  err:string;
  hide:boolean = true;
  spinner:boolean = false;

  constructor(private authService : AuthService, public router : Router) { 
  }

  ngOnInit() {

  }

  onSubmitLogin(){
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
      this.authService.login(this.email, this.pwd).then(res =>{
        this.spinner = true;
        this.hide = true;
        setTimeout(() => {
          this.spinner = false;
          this.router.navigate(["/home"], {state : {email: this.email}});
          this.clean();
        },2000);
      }).catch(error =>{
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
    }
  }

  clean(){
    this.email="";
    this.pwd="";
    this.hide = true;
  }

  loginAdmin(){
    this.email="admin@admin.com";
    this.pwd="111111";
    this.onSubmitLogin();
  }

  loginInvitado(){
    this.email="invitado@invitado.com";
    this.pwd="222222";
    this.onSubmitLogin();
  }

  loginUsuario(){
    this.email="usuario@usuario.com";
    this.pwd="333333";
    this.onSubmitLogin();
  }

  loginAnonimo(){
    this.email="anonimo@anonimo.com";
    this.pwd="444444";
    this.onSubmitLogin();
  }

  loginTester(){
    this.email="tester@tester.com";
    this.pwd="555555";
    this.onSubmitLogin();
  }
}
 
}
