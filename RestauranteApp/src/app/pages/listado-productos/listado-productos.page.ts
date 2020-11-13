import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent } from "@ionic/angular";
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-listado-productos',
  templateUrl: './listado-productos.page.html',
  styleUrls: ['./listado-productos.page.scss'],
})
export class ListadoProductosPage implements OnInit {

  mesa = null;
  idCliente = null;

  listaProd = new Array();
  listaComidas = new Array();
  listaBebidas = new Array();
  listaPostres = new Array();
  tab = "Comidas";
  subtotal = 0;
  carrito = new Array();
  terminado = false;

  @ViewChild(IonContent, { read: IonContent, static: false }) myContent: IonContent;

  constructor(private router: Router, private db: AuthService) { }

  ngOnInit() {
    this.mesa = this.router.getCurrentNavigation().extras.state.mesa;
    this.idCliente = this.router.getCurrentNavigation().extras.state.cliente;
    
    this.db.traerProductos().subscribe(lista => {

      lista.forEach(prod => {
        this.listaProd.push(prod);
      });

      this.discriminarListas();
      this.setearCantidades();
    });
  }

  discriminarListas() {
    this.listaProd.forEach(prod => {
      switch (prod.tipo) {
        case "bebida":
          this.listaBebidas.push(prod);
          break;
        case "comida":
          this.listaComidas.push(prod);
          break;
        case "postre":
          this.listaPostres.push(prod);
          break;
        default:
          break;
      }
    });
  }

  setearCantidades() {
    this.listaPostres.forEach(p => {
      p.cantidad = 1;
    });

    this.listaComidas.forEach(p => {
      p.cantidad = 1;
    });

    this.listaBebidas.forEach(p => {
      p.cantidad = 1;
    });
  }

  cambiarTab(tabName: string) {
    this.tab = tabName;
    this.listaBebidas.forEach(p => {
      p.cantidad = 1;
    });

    this.listaComidas.forEach(p => {
      p.cantidad = 1;
    });

    this.listaPostres.forEach(p => {
      p.cantidad = 1;
    });
  }

  agregarAlCarrito(producto) {
      let prod = {
        id: producto.id,
        descripcion: producto.descripcion,
        nombre: producto.nombre,
        fotos: producto.fotos,
        tipo: producto.tipo,
        precio: producto.precio,
        cantidad: producto.cantidad,
        tiempo: producto.tiempo,
        estado: "En preparación"
      }
  
      let encontrado = false;
  
      this.carrito.forEach(p => {
        if (p.nombre == prod.nombre) {
          p.cantidad += prod.cantidad;
          encontrado = true;
        }
      });
  
      if (encontrado == false) {
        this.carrito.push(prod);
      }
  
      producto.cantidad = -1;
      setTimeout(() => {
        producto.cantidad = 1;
      }, 3000);

      this.calcularPrecioCarrito();
  }

  sumarCantidad(producto) {
    producto.cantidad++;
  }

  restarCantidad(producto) {
    if (producto.cantidad > 1) {
      producto.cantidad--;
    }
  }

  calcularPrecioCarrito() {
    this.subtotal = 0;
    this.carrito.forEach(p => {
      this.subtotal += p.precio * p.cantidad;
    });
  }

  sumarCantidadCarrito(producto) {
    producto.cantidad++;
    this.calcularPrecioCarrito();
  }

  restarCantidadCarrito(producto) {
    if (producto.cantidad > 1) {

      if (producto.cantidad == 1) {
        this.carrito.forEach((p, i) => {
          if (producto.nombre == p.nombre) {
            this.carrito.splice(i, 1);
          }
        });
      }
      else {
        producto.cantidad--;
      }
      this.calcularPrecioCarrito();
    }
  }

  cambiarProductoCarrito(producto) {
    this.carrito.forEach(p => {
      if (p.nombre == producto.nombre) {
        p.cantidad = producto.cantidad;
      }
    });
  }

  enviarPedido(){
    this.db.cargarPedido(this.idCliente, this.mesa, this.carrito);
    this.terminado = true;
  }

  volverAMesa(){
    this.router.navigate(["/mesa"]);
  }
}
