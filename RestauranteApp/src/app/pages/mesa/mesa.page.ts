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
  spinner: boolean = false;

  constructor(private router: Router, private db: AuthService) { }

  ngOnInit() {
    this.spinner = true;
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
              //this.pedido.productos = this.transformarProductos(this.pedido.productos);
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

  // En desuso actualmente
  transformarProductos(productos: any){
    let arrayProductos = new Array();
    let arrayObjProductos = new Array();
    
    productos.forEach(producto => {
      arrayProductos.push(producto.split("/"));
    });

    arrayProductos.forEach(producto => {
        let objProducto: any = {
          id: producto[0],
          nombre: producto[1],
          precio: producto[2],
          cantidad: producto[3],
          estado: producto[4],
        };
        arrayObjProductos.push(objProducto);
    
    });

    return arrayObjProductos;  
  }

  redireccionar(opcion: number){
    let state = {state: { mesa: this.mesa.mesa, cliente: this.mesa.idcliente }};
    switch(opcion){
      case 0:
        this.router.navigate(["/hacer-consulta"], {state: { mesa: this.mesa, cliente: this.cliente }});
        break;
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
