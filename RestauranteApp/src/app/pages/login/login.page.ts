import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CorreosService } from "../../services/correos.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {

  email:string = "";
  pwd:string = "";
  err:string;
  hide:boolean = true;
  spinner:boolean = false;
  aprobado:boolean = true;
  perfil: string = "cliente";

  constructor(private authService : AuthService, public router : Router, private servicioCorreo: CorreosService) { 
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
          //console.log(this.perfil);
          let user = JSON.stringify({email: this.email, perfil : this.perfil, aprobado: this.aprobado});
          if(this.perfil == "cliente"){
            this.router.navigate(["home/"+user]);
          } else if (this.perfil === "dueño" || this.perfil === "supervisor"){
            this.router.navigate(["supervisor"]);
          }
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
    this.email="duenio@gmail.com";
    this.pwd="123456";
    this.onSubmitLogin();
  }

  loginCliente(){
    this.perfil = 'cliente';
    this.email="ruiz@gmail.com";
    this.pwd="123456";
    this.onSubmitLogin();
  }

  loginSupervisor(){
    this.email="supervisor@gmail.com";
    this.pwd="123456";
    this.onSubmitLogin();
  }

  loginEmpleado(){
    this.email="metre@gmail.com";
    this.pwd="123456";
    this.onSubmitLogin();
  }

  irRegistro(tipo : string){
    this.router.navigate(["/registro"], {state : {modo: tipo}});
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
