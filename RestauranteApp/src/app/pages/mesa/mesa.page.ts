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
  pedido: any = {};
  hayPedido: boolean = false;
  subtotal: number = 0;
  descuento: number = 0;
  total: number = 0; 
  intentosDiez: number = 3;
  intentosQuince: number = 3;
  intentosTreinta: number = 1;
  encuestaEnviada: boolean = false;
  spinner: boolean = false;

  constructor(private router: Router, private db: AuthService) { }

  ngOnInit() {
    this.spinner = true;
    
    this.intentosDiez = this.router.getCurrentNavigation().extras.state.intentosDiez;
    this.intentosQuince = this.router.getCurrentNavigation().extras.state.intentosQuince;
    this.intentosTreinta = this.router.getCurrentNavigation().extras.state.intentosTreinta;
    if(this.intentosDiez == undefined && this.intentosQuince == undefined && this.intentosTreinta == undefined){
      this.intentosDiez = 3;
      this.intentosQuince = 3;
      this.intentosTreinta = 1;
    }
    
    this.encuestaEnviada = this.router.getCurrentNavigation().extras.state.encuesta;
    if(this.encuestaEnviada == undefined){
      this.encuestaEnviada = false;
    }

    let idMesa: string = this.router.getCurrentNavigation().extras.state.mesa;
    //let idMesa = "1";
    
    this.db.traerMesa(idMesa).subscribe(doc => {
      this.mesa = doc.data();
      
      if(this.mesa != null && this.mesa.ocupada){
        this.db.traerCliente(this.mesa.idcliente).subscribe(doc => {
          this.cliente = doc.data();
          this.header = "Mesa " + this.mesa.mesa + ": " + this.cliente.apellido + ", " + this.cliente.nombre;
          this.deshabilitado = false;
          
          this.db.traerPedidoCliente(this.cliente.id).subscribe(doc => {
            if(doc != null){
              this.pedido = doc[0];
              console.log(this.pedido);
              this.hayPedido = true;
              this.pedido.productos.forEach(producto => {
                this.subtotal += producto.cantidad * producto.precio;
              });
              this.descuento = this.subtotal * this.pedido.descuento / 100;
              this.total = this.subtotal - this.descuento;
              this.spinner = false;
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
        this.router.navigate(["/juegos"], {state: { intentosDiez: this.intentosDiez, intentosQuince: this.intentosQuince, intentosTreinta: this.intentosTreinta }});
        break;
      case 3:
        this.router.navigate(["/encuesta"], {state : { mesa: this.mesa.mesa, cliente: this.cliente.id, enviada: this.encuestaEnviada }});
        break;
    }
  }
}
