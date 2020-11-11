import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent } from "@ionic/angular";

@Component({
  selector: 'app-listado-productos',
  templateUrl: './listado-productos.page.html',
  styleUrls: ['./listado-productos.page.scss'],
})
export class ListadoProductosPage implements OnInit {

  listaComidas = new Array();
  listaBebidas = new Array();
  listaPostres = new Array();
  tab = "Comidas";
  subtotal = 0;
  carrito = new Array();

  @ViewChild(IonContent, { read: IonContent, static: false }) myContent: IonContent;

  constructor() { }

  ngOnInit() {
    let prod1 = {
      nombre: "Mi Pinga",
      fotos: ["https://www.viuvalencia.com/netpublisher/minfo/imagenes/9485_22.jpg", "https://cdn2.cocinadelirante.com/sites/default/files/styles/gallerie/public/images/2020/05/churros-caseros-disney-chocolate.jpg", "https://i.pinimg.com/originals/cd/c8/63/cdc863190cf8953f94b2d109129191d9.jpg"],
      tipo: "postre",
      precio: "30",
    };

    let prod2 = {
      nombre: "Sanguchoto",
      fotos: ["https://i.ytimg.com/vi/telUPSOQL5A/maxresdefault.jpg", "https://i.pinimg.com/originals/67/a6/9b/67a69b6d316638d6241005d25d254c5e.jpg", "https://img-global.cpcdn.com/recipes/dd0edd31f3ef36f4/751x532cq70/sandwiches-de-miga-vegetarianos-y-de-los-otros-para-san-valentin-foto-principal.jpg"],
      tipo: "comida",
      precio: 60,
    };

    let prod3 = {
      nombre: "Coca Culo 360ml",
      fotos: ["https://mui.today/__export/1586886992211/sites/mui/img/2020/04/14/pepsi-coca-cola-sabor-ingrediente.jpg_375107944.jpg", "https://assets.entrepreneur.com/content/3x2/2000/20181226163637-CocaCola.jpeg", "https://bradenbost.files.wordpress.com/2010/09/350lbs.jpg"],
      tipo: "bebida",
      precio: 80,
    };

    this.listaPostres.push(prod1);
    this.listaComidas.push(prod2);
    this.listaBebidas.push(prod3);

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
      p.cantidad = 0;
    });
    
    this.listaComidas.forEach(p => {
      p.cantidad = 0;
    });
    
    this.listaPostres.forEach(p => {
      p.cantidad = 0;
    });
  }

  agregarAlCarrito(producto) {
    let prod = {
      nombre: producto.nombre,
      fotos: producto.fotos,
      tipo: producto.tipo,
      precio: producto.precio,
      cantidad: producto.cantidad,
    }

    producto.cantidad = 0;
    let encontrado = false;

    this.carrito.forEach(p => {
      if (p.nombre==prod.nombre){
        p.cantidad += prod.cantidad;
        encontrado = true;
      }
    });

    if (encontrado == false){
      this.carrito.push(prod);
    }

    this.calcularPrecioCarrito();
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
}
