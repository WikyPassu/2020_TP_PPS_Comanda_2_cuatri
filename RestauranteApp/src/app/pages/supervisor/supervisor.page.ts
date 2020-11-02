import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";

import emailjs, { EmailJSResponseStatus } from 'emailjs-com';
import { init } from "emailjs-com";
init("user_HmGWxdqAC7p1mfhW8tjX3");

@Component({
  selector: 'app-supervisor',
  templateUrl: './supervisor.page.html',
  styleUrls: ['./supervisor.page.scss'],
})
export class SupervisorPage implements OnInit {

  lista = new Array();
  hayPendientes: boolean = false;
  spinner: boolean = false;

  constructor(private db: AuthService, private router: Router) { }

  ngOnInit() {
    this.db.traerClientesPendientesAprobacion().subscribe(doc => {
      this.lista = doc;
      this.lista.forEach(cliente => {
        this.db.buscarFotoPorNombre(cliente.foto)
        .then(link => cliente.link = link);
      });
      if(this.lista.length != 0){
        this.hayPendientes = true;
      }
    });
  }

  aceptarRegistro(dni: number, fecha: number, correo: string, clave: string, nombre: string){
    this.spinner = true;
    setTimeout(() => {
      this.db.actualizarAprobacionRegistro(dni+"."+fecha)
      .then(() => {
        this.db.registroAuth(correo, clave)
        .then(cliente => {
          console.log(cliente);
          this.enviarEmail("registro_aprobado", correo, nombre);
          this.spinner = false;
        })
        .catch(error => console.log(error));
      });  
    }, 2000);
  }

  rechazarRegistro(dni: number, fecha: number, correo: string, nombre: string){
    this.spinner = true;
    setTimeout(() => {
      this.db.borrarFotoPorNombre(dni+"."+fecha+".jpg");
      this.db.eliminarCliente(dni+"."+fecha)
      .then(() => {
        this.enviarEmail("registro_rechazado", correo, nombre);
        this.spinner = false;
      });  
    }, 2000);
  }

  enviarEmail(templateID: string, correo: string, nombre: string){
    let templateParams = {
      correoDestinatario: correo,
      nombreDestinatario: nombre
    };
    emailjs.send("gmail", templateID, templateParams)
    .then(res => console.log("Correo enviado.", res.status, res.text))
    .catch(error => console.log("Error al enviar.", error));
  }

  irAltaAdmins(){
    this.router.navigate(["/alta-admins"]);
  }

  test(){
  }
}
