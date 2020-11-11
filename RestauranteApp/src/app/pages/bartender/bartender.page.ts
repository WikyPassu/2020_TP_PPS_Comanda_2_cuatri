import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-bartender',
  templateUrl: './bartender.page.html',
  styleUrls: ['./bartender.page.scss'],
})
export class BartenderPage implements OnInit {

  public pedidos: Array<any> = [];

  constructor(
    private fire: AngularFirestore,
  ) { }

  ngOnInit() {
    this.fire.collection('pedidos')
    .snapshotChanges().subscribe( collection => {
      this.pedidos = [];
      collection.map( obj => {
        this.agregarAListaDePedidos(obj.payload.doc);
      });
    });
  }

  agregarAListaDePedidos(doc){
    let productos: Array<any> = [];
    let temp: Array<any> = [];
    doc.data().productos.map((prodString: string) => {
      temp = prodString.split('/');
      let prod = {
        id: temp[0],
        nombre: temp[1],
        precio: temp[2] + 0,
        cantidad: temp[3] + 0,
        estado: temp[4],
      };
      productos.push(prod);
    });
    console.log(productos);
    let pedido: any = {
      docid: doc.id,
      descuento: doc.data().descuento,
      estado: doc.data().estado,
      mesa: doc.data().mesa, 
      cliente: doc.data().idcliente,
    };
  }

}

