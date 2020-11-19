import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { AudioService } from "../../services/audio.service";
import { BarcodeScanner } from "@ionic-native/barcode-scanner";
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-mesa',
  templateUrl: './mesa.page.html',
  styleUrls: ['./mesa.page.scss'],
  providers: [BarcodeScanner]
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
  puedePagar: boolean = true;
  spinner: boolean = false;

  constructor(private router: Router, private db: AuthService,
    private audio: AudioService, private bs: BarcodeScanner) { }

  ngOnInit() {
    this.audio.reproducirAudioCambioPant();
    this.spinner = true;
    let idMesa: string = this.router.getCurrentNavigation().extras.state.mesa;
    
    this.db.consultarEstadoMesa(idMesa).subscribe((doc: any) => {
      if(!doc.ocupada){
        this.router.navigate(["home/" + JSON.stringify(this.cliente)]);
      }
    });

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
              this.propina = this.subtotal * this.pedido.propina / 100;
              this.total = this.subtotal - this.descuento + this.propina;
              if(this.pedido.estado == "Entrega a confirmar"){
                this.entregado = true;
              }
              else if(this.pedido.estado == "Entregado"){
                this.quierePagar = true;
              }
              else{
                this.entregado = false;
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
    this.entregado = false;
  }

  escanearPropina(){
    this.bs.scan()
    .then(data => {
      if(data.text == "0" || data.text == "5" || data.text == "10" || data.text == "15" || data.text == "20"){
        this.db.cambiarPropinaPedido(this.pedido.idCliente, parseInt(data.text))
        .then(() => {
          this.puedePagar = false;
        });
      }
    })
    .catch(error => console.log(error));
  }

  pagar(){
    this.db.cambiarEstadoPedido(this.pedido.idCliente, "Pago a confirmar")
    .then(() => {
      this.quierePagar = false;
      this.puedePagar = true;
    });
  }
}
