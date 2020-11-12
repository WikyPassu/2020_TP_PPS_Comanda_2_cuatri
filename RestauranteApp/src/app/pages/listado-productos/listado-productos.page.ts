import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent } from "@ionic/angular";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: 'app-listado-productos',
  templateUrl: './listado-productos.page.html',
  styleUrls: ['./listado-productos.page.scss'],
})
export class ListadoProductosPage implements OnInit {

  listaProd = new Array();
  listaComidas = new Array();
  listaBebidas = new Array();
  listaPostres = new Array();
  tab = "Comidas";
  subtotal = 0;
  carrito = new Array();

  @ViewChild(IonContent, { read: IonContent, static: false }) myContent: IonContent;

  constructor(private db: AuthService) { }

  ngOnInit() {
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
    if (producto.cantidad != 0){
      let prod = {
        id: producto.id,
        descripcion: producto.descripcion,
        nombre: producto.nombre,
        fotos: producto.fotos,
        tipo: producto.tipo,
        precio: producto.precio,
        cantidad: producto.cantidad,
        tiempo: producto.tiempo
      }
  
      producto.cantidad = 0;
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
  
      this.calcularPrecioCarrito();
    }
    else{
      producto.cantidad = -1;
      setTimeout(() => {
        producto.cantidad = 0;
      }, 2000);
    }
  }

  sumarCantidad(producto) {
    producto.cantidad++;
  }

  restarCantidad(producto) {
    if (producto.cantidad > 0) {
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
    if (producto.cantidad > 0) {

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
    this.db.cargarPedido(idcliente, mesa, this.carrito);
  }
}
