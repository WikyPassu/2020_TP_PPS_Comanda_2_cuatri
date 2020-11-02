import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CorreosService } from "../../services/correos.service";
import { InputVerifierService } from '../../services/input-verifier.service';
import { ToastController } from '@ionic/angular';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {

  email: string = "";
  pwd: string = "";
  err: string = '';
  hide: boolean = true;
  spinner: boolean = false;
  aprobado: boolean = true;
  perfil: string = "cliente";
  private usuario: any = null;
  private usuarioListo: Event = new Event('usuarioListo');

  constructor(
    private authService: AuthService,
    public router: Router,
    private servicioCorreo: CorreosService,
    private toast: ToastController,
    private fire: AngularFirestore,
    ) {}

  ngOnInit() {}

  onSubmitLogin(){
    if(!InputVerifierService.verifyEmailFormat(this.email))
      {this.presentToast('Formato de correo invalido.'); return;}
    if(InputVerifierService.verifyPasswordStrength(this.pwd) == 0)
      {this.presentToast('Clave invalida.'); return;}
    this.spinner = true;
    this.authService.login(this.email, this.pwd)
    .then( (response) => {
      this.manejarLoginExitoso(response);
    })
    .catch( (reason) => {
      this.presentToast(this.traducirErrorCode(reason.code));
      this.spinner = false;
    });
    /*
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
    }*/
  }

  /**
   * Traduce el codigo de error (string) que entrega Fire Auth y devuelve un equivalente aceptable
   * para PPS. Si no encuentra un equivalente devuelve "Error en login".
   * @param codigo Codigo de error entregado por Angular Fire Auth
   */
  traducirErrorCode(codigo: string) : string{
    let mensaje: string = 'Error en login';
    if(codigo == "auth/invalid-email"){
      mensaje = "Ingrese un correo válido!";
    }
    else if(codigo == "auth/user-not-found"){
      mensaje = "No existe un usuario con dicho correo electrónico.";
    }
    else if(codigo == "auth/wrong-password"){
      mensaje = "Contraseña incorrecta.";
    }
    return mensaje;
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
  /**
   * Presenta un toast en el medio de la pantalla, muestra el mensaje recibido como parametro.
   * El toast se ubica en el medio de la pantalla.
   * @param message Mensaje a presentar
   */
  async presentToast(message) {
    const toast = await this.toast.create({
      message: message,
      duration: 2000,
      position: "middle",
      animated: true,
      mode: "md",
    });
    toast.present();
  }

  /**
   * Llama a TraerUserInfo y se encarga de redireccionar a la pagina correspondiente.
   * Puede entregar la info del usuario a dicha pagina.
   * @param response Respuesta de auth.
   */
  manejarLoginExitoso(response){
    this.traerUserInfo()
    .then( (usr) => {
      this.spinner = false
      this.usuario = usr;
      if(this.usuario.perfil == 'cliente'){
        this.router.navigate(['home/' + JSON.stringify(this.usuario)]);
      }else if(this.usuario.perfil == 'dueño' || this.usuario.perfil == 'supervisor'){
        this.router.navigate(['supervisor']);
      }else{
        this.presentToast('Oof, se rompio.');
      }
    })
    .catch( () => {
      this.spinner = false;
      this.presentToast('Oof, se rompio.');
    });
  }

  /**
   * Realiza una peticion sobre una coleecion y verifica si existe una instancia donde el correo
   * coincida con el almacenado en this.email, puede llamarse a si misma e iterar sobre una segunda coleccion.
   * Retorna una promesa que de ser exitosa retorna un json con el usuario, caso contrario retorna null.
   * @param collection Colecion donde hace la peticion
   * @param recursive Define si la funcion se vuelve a llamar y realiza el query sobre la sengunda coleccion
   * @param segundo Segunda coleccion
   */
  traerUserInfo(collection: string = 'clientes', recursive: boolean = true, segundo: string = 'empleados'){
    let usuario;
    return new Promise( (resolve, reject) =>
    this.fire.collection(collection, 
    (ref) => ref.where('correo', '==', this.email))
    .valueChanges().subscribe( (data) => {
      if(data.length > 0){
        usuario = data[0];
        resolve(usuario);
      }else if(recursive){
        this.traerUserInfo(segundo, false)
        .then( dataRec => {resolve(dataRec)})
        .catch( () => {reject(null)} );
      }else{
        reject(null);
      }
    }));
  }
}
