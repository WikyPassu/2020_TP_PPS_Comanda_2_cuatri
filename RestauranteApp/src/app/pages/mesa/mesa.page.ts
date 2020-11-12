import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: 'app-mesa',
  templateUrl: './mesa.page.html',
  styleUrls: ['./mesa.page.scss'],
})
export class MesaPage implements OnInit {

  mesa: any = {};
  cliente: any = {};
  header: string;
  deshabilitado: boolean = true;
  spinner: boolean = false;

  constructor(private router: Router, private db: AuthService) { }

  ngOnInit() {
    this.spinner = true;
    //this.router.getCurrentNavigation().extras.state;
    let idMesa = "1";
    this.db.traerMesa(idMesa).subscribe(doc => {
      this.mesa = doc.data();
      if(this.mesa != null && this.mesa.ocupada){
        console.log(this.mesa);
        this.db.traerCliente(this.mesa.idcliente).subscribe(doc => {
          this.cliente = doc.data();
          this.header = "Mesa " + this.mesa.mesa + ": " + this.cliente.apellido + ", " + this.cliente.nombre;
          console.log(this.cliente);
          this.deshabilitado = false;
          this.spinner = false;
        });
      }
      else{
        this.deshabilitado = true;
      }
    });
  }

  redireccionar(opcion: number){
    let state = {
      state: [
        {
          mesa: this.mesa 
        }, 
        {
          cliente: this.cliente
        }
      ]
    };
    switch(opcion){
      case 1:
        this.router.navigate(["/listado-productos"], state);
        break;
      case 2:
        this.router.navigate(["/juegos"], state);
        break;
      case 3:
        this.router.navigate(["/encuesta"], state);
        break;
    }
  }
}
