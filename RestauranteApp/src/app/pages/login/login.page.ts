import { Component, EventEmitter, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CorreosService } from "../../services/correos.service";
import { InputVerifierService } from '../../services/input-verifier.service';
import { ToastController } from '@ionic/angular';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Keyboard, KeyboardResizeMode } from '@ionic-native/keyboard/ngx';

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
  public vh;
  public vw;
  private cambiaView: EventEmitter<any> = new EventEmitter<any>()

  constructor(
    private authService: AuthService,
    public router: Router,
    private servicioCorreo: CorreosService,
    private toast: ToastController,
    private fire: AngularFirestore,
    ) {}

  ngOnInit() {
    this.vh = document.body.clientHeight + 'px';
    this.vw = document.body.clientWidth + 'px';
    //this.cambiaView.subscribe( (e) => this.arreglarView(e));
    //this.verificarView();
  }

  async verificarView(){
    setInterval(() => {
      console.log(document.body.clientWidth, this.vh, document.body.clientWidth % this.vh);
      if(document.body.clientWidth == this.vh){
        this.cambiaView.emit(this.vw);
        console.log(this.vw);
      }
    }, 1000)
  }

  arreglarView(e){
    console.log(e);
  }

  onSubmitLogin(){
    if(!InputVerifierService.verifyEmailFormat(this.email))
      {this.presentToast('Formato de correo inválido.'); return;}
    if(InputVerifierService.verifyPasswordStrength(this.pwd) == 0)
      {this.presentToast('Clave inválida.'); return;}
    
    if(!this.authService.verificarEmailFire(this.email)){
      this.spinner = true;
      this.authService.login(this.email, this.pwd)
      .then( (response) => {
        this.manejarLoginExitoso(response);
      })
      .catch( (reason) => {
        this.presentToast(this.traducirErrorCode(reason.code));
        this.spinner = false;
      });
    }
    else{
      this.presentToast('Su solicitud de registro aún está pendiente de aprobación.');
    }
  }

  /**
   * Traduce el codigo de error (string) que entrega Fire Auth y devuelve un equivalente aceptable
   * para PPS. Si no encuentra un equivalente devuelve "Error en login".
   * @param codigo Codigo de error entregado por Angular Fire Auth
   */
  traducirErrorCode(codigo: string) : string{
    let mensaje: string = 'Error en login';
    if(codigo == "auth/invalid-email"){
      mensaje = "¡Ingrese un correo válido!";
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

  loginMozo(){
    this.email="mesero@mesero.com";
    this.pwd="123456789";
    this.onSubmitLogin();
  }

  loginCocinero(){
    this.email="cocinera@cocinera.com";
    this.pwd="123456789";
    this.onSubmitLogin();
  }

  loginBartender(){
    this.email="bartender@bartender.com";
    this.pwd="123456789";
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
      this.email = "";
      this.pwd = "";
      this.spinner = false
      this.usuario = usr;
      if(this.usuario.perfil == 'cliente'){
        //console.log(JSON.stringify(this.usuario));
        this.router.navigate(['home/' + JSON.stringify(this.usuario)]);
      }else if(this.usuario.perfil == 'dueño' || this.usuario.perfil == 'supervisor'){
        this.router.navigate(['supervisor']);
      }else if(this.usuario.perfil == 'metre'){
        //console.log(JSON.stringify(this.usuario));
        this.router.navigate(['listaespera/' + JSON.stringify(this.usuario)]);
      }else if(this.usuario.perfil == 'mozo'){
        this.router.navigate(['preparacion/salon']);
      }else if(this.usuario.perfil == 'bartender'){
        this.router.navigate(['preparacion/bar']);
      }else if(this.usuario.perfil == 'cocinero'){
        this.router.navigate(['preparacion/cocina']);
      }else{
        this.presentToast('Oof, se rompió.');
      }
    })
    .catch( () => {
      this.spinner = false;
      this.presentToast('Oof, se rompió.');
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
