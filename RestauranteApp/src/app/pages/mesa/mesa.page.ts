import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";

import { AudioService } from "../../services/audio.service";

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
  pedido: any = {};
  hayPedido: boolean = false;
  subtotal: number = 0;
  descuento: number = 0;
  propina: number = 0;
  total: number = 0;
  entregado: boolean = false;
  quierePagar: boolean = false;
  spinner: boolean = false;

  constructor(private router: Router, private db: AuthService,
    private audio: AudioService) { }

  ngOnInit() {
    this.audio.reproducirAudioCambioPant();
    this.spinner = true;
    let idMesa: string = this.router.getCurrentNavigation().extras.state.mesa;
    //let idMesa = "1";
    
    this.db.traerMesa(idMesa).subscribe(doc => {
      this.mesa = doc.data();
      
      if(this.mesa != null && this.mesa.ocupada){
        this.db.traerCliente(this.mesa.idcliente).subscribe(doc => {
          this.cliente = doc.data();
          this.header = "Mesa " + this.mesa.mesa + ": " + this.cliente.apellido + " " + this.cliente.nombre;
          this.deshabilitado = false;
          
          this.db.traerPedidoCliente(this.cliente.id).subscribe(doc => {
            if(doc.length != 0){
              this.pedido = doc[0];
              console.log(this.pedido);
              this.hayPedido = true;
              this.subtotal = 0;
              this.descuento = 0;
              this.total = 0;
              this.pedido.productos.forEach(producto => {
                this.subtotal += producto.cantidad * producto.precio;
              });
              this.descuento = this.subtotal * this.pedido.descuento / 100;
              this.total = this.subtotal - this.descuento;
              if(this.pedido.estado == "Entrega a confirmar"){
                this.entregado = true;
              }
              else if(this.pedido.estado == "Entregado"){
                this.quierePagar = true;
              }
              this.spinner = false;
            }
            else{
              this.hayPedido = false;
              this.pedido = {};
              this.subtotal = 0;
              this.descuento = 0;
              this.total = 0;
            }
          });
        });
      }
      else{
        this.deshabilitado = true;
      }
    });
  }

  redireccionar(opcion: number){
    switch(opcion){
      case 0:
        this.router.navigate(["/hacer-consulta"], {state: { mesa: this.mesa, cliente: this.cliente }});
        break;
      case 1:
        this.router.navigate(["/listado-productos"], {state: { mesa: this.mesa.mesa, cliente: this.mesa.idcliente }});
        break;
      case 2:
        this.router.navigate(["/juegos"], {state: { mesa: this.mesa.mesa, cliente: this.mesa.idcliente }});
        break;
      case 3:
        this.router.navigate(["/encuesta"], {state: { mesa: this.mesa.mesa, cliente: this.mesa.idcliente }});
        break;
    }
  }

  cerrarSesion(){
    this.router.navigate(["/login"]);
  }

  cambiarEstado(){
    this.db.cambiarEstadoPedido(this.pedido.idCliente, "Entregado");
  }
}
