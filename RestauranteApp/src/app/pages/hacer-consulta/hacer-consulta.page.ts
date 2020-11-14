import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-hacer-consulta',
  templateUrl: './hacer-consulta.page.html',
  styleUrls: ['./hacer-consulta.page.scss'],
})
export class HacerConsultaPage implements OnInit {

  mesa: any = {};
  cliente: any = {};
  mensaje: string = "";
  consultas = new Array();

  constructor(private db: AuthService, private router: Router) { }

  ngOnInit() {
    this.mesa = this.router.getCurrentNavigation().extras.state.mesa;
    this.cliente = this.router.getCurrentNavigation().extras.state.cliente;
    this.db.traerConsultasCliente(this.cliente.id).subscribe(lista => {
      this.consultas = lista;
    });
  }

  enviar(){
    if(this.mensaje != ""){
      this.db.crearConsulta(this.mesa.mesa, this.cliente.id, this.cliente.apellido+", "+this.cliente.nombre, this.mensaje)
      .then(() => {
        this.mensaje = "";
      })
      .catch(error => console.log(error));
    }
  }
}
