import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-bartender',
  templateUrl: './bartender.page.html',
  styleUrls: ['./bartender.page.scss'],
})
export class BartenderPage implements OnInit {

  public tab: string;

  public sector: string = '';
  public titulo: string = '';
  public tipos: Array<string> = [];

  public puedeEntregar: boolean = false;
  public puedeModificar: boolean = false;
  
  public pedidos: Array<any> = [];
  private pedidoListo: Array<boolean> = [];

  public detalle: boolean = false;
  public spinner: boolean;
  public itemSeleccionado: any;

  constructor(
    private fire: AngularFirestore,
    private router: Router,
    private route: ActivatedRoute,
    private toast: ToastController,
    private auth: AuthService,
  ) { 
    this.spinner = true;
  }

  ngOnInit() {
    //console.log(this.auth.userObs);
    this.tab = 'encuesta';
    this.sector = this.route.snapshot.paramMap.get('sector');
    this.prepararSector();
    this.fire.collection('pedidos')
    .snapshotChanges().subscribe( collection => {
      this.pedidos = [];
      collection.map( obj => {
        this.agregarAListaDePedidos(obj.payload.doc);
      });
      this.pedidos.forEach( (ped) => {
        if(ped.listo){
          this.actualizarEstadoPedido(ped, null, 'Listo');
        }
      });
      this.spinner = false;
    });
  }

  agregarAListaDePedidos(doc){
    if(doc.data().confirmado){
      this.pedidoListo = [];
      let listaProductos: Array<any> = this.prepararListaProductos(doc, this.tipos);
      let pedido: any = this.prepararPedido(doc, listaProductos, !this.pedidoListo.includes(false));
      if(pedido.productos.length > 0){
        this.pedidos.push(pedido);
      }
    }
  }

  prepararSector(){
    if(this.sector == 'bar'){
      this.titulo = 'Barra';
      this.tipos = ['bebida'];
      this.puedeEntregar = false;
      this.puedeModificar = true;
    } else if (this.sector == 'cocina'){
      this.titulo = 'Cocina';
      this.tipos = ['comida', 'postre'];
      this.puedeEntregar = false;
      this.puedeModificar = true;
    } else if (this.sector == 'salon'){
      this.titulo = 'Salon';
      this.tipos = ['bebida', 'comida', 'postre'];
      this.puedeEntregar = true;
      this.puedeModificar = false;
    } else {
      this.presentToast('Hubo un error en el sector elegido.');
      this.router.navigate(['login']);
    }
  }

  prepararListaProductos(docRef, tipos: Array<string>): Array<any>{
    let productosObj: Array<any> = [];
    let temp: Array<any> = [];
    let i = 0;
    docRef.data().productos.map((prodString: string) => {
      temp = prodString.split('/');
      temp.push(i);
      temp.push(docRef.id);
      this.pedidoListo.push(temp[4] == "Listo");
      let tipo = (temp[0].split('.'))[0];
      if(tipos.includes(tipo)){
        productosObj.push(this.prepararProducto(temp, docRef));
      }
      i++;
    });
    return productosObj;
  }

  prepararProducto(datosProd: Array<any>, docRef): any{
    let prod = {
      doc: docRef,
      id: datosProd[0],
      nombre: datosProd[1],
      precio: datosProd[2],
      cantidad: datosProd[3],
      estado: datosProd[4],
      index: datosProd[5],
      parentDoc: datosProd[6]
    };
    return prod;
  }

  prepararPedido(docRef, listaProductos: Array<any>, estaListo: boolean): any{
    let pedido: any = {
      docid: docRef.id,
      descuento: docRef.data().descuento,
      estado: docRef.data().estado,
      mesa: docRef.data().mesa, 
      cliente: docRef.data().idcliente,
      productos: listaProductos,
      listo: estaListo,
    };
    return pedido;
  }

  colorearChip(pedido, prod: boolean = false){
    switch(pedido.estado){
      case 'En preparacion':
        return 'danger';  
      case 'Listo':
        return prod ? 'success' : 'warning';  
      case 'Entregado':
        return 'success';  
    }
  }

  mostrarDetalle(item){
    this.itemSeleccionado = item;
    this.detalle = true;
  }

  ocultarDetalle(){
    this.detalle = false;
  }

  // bebida.vinofamiglia/Famiglia Bianchi Malbec/600/1/En preparacion
  productoListo(estado: string){
    let aModificar = this.itemSeleccionado;
    let tempList: Array<any> = <Array<any>>aModificar.doc.data().productos
    tempList[aModificar.index] = '' +
      aModificar.id + '/' +
      aModificar.nombre + '/' +
      aModificar.precio + '/' +
      aModificar.cantidad + '/' +
      estado;
    this.fire.collection('pedidos').doc(aModificar.parentDoc).update({productos: tempList});
    if(estado != 'Listo'){
      this.actualizarEstadoPedido(null, aModificar.parentDoc, 'En preparacion');
    }
  }

  actualizarEstadoPedido(ped, docid, est: string){
    if(ped != null){
      this.fire.collection('pedidos').doc(ped.docid).update({estado: est});
    } else if (docid != null){
      this.fire.collection('pedidos').doc(docid).update({estado: est});      
    }
  }

  entregarPedido(pedido: any, estado: 'Enrega a confirmar' | 'Listo'){
    this.fire.collection('pedidos').doc(pedido.docid).update({estado: estado});
  }

  cambiarTab(tab: string){
    this.tab = tab;
  }

  /**
   * Presenta un toast con el mensaje indicado en la posicion indicada, la posicion por default es top.
   * @param message Mensaje a presentar
   * @param pos Posicion del toast
   */
  async presentToast(message: string, pos: 'top' | "middle" | "bottom" = "top") {
    const toast = await this.toast.create({
      message: message,
      duration: 2000,
      position: pos,
      animated: true,
      mode: "md",
    });
    toast.present();
  }

}

