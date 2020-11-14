import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { Camera, CameraOptions, DestinationType, EncodingType, PictureSourceType } from '@ionic-native/camera/ngx';
import { PushNotificationService } from '../../services/push-notification.service';



@Component({
  selector: 'app-bartender',
  templateUrl: './bartender.page.html',
  styleUrls: ['./bartender.page.scss'],
  providers: [Camera],
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
  private cantidadPedidos: number = 0;

  public detalle: boolean = false;
  public spinner: boolean;
  public itemSeleccionado: any;
  public pedidoSeleccionado: any;

  public cantidadConsultas: number;

  public encuestaFoto: string = null;
  public encuestaSector: string;
  public encuestaLimpieza: number = 0;
  public encuestaLimpiezaTexto: string = "Aceptable";
  public encuestaInsumos: boolean = false;
  public encuestaTurno: string;
  public encuestaComentario: string;

  constructor(
    private fire: AngularFirestore,
    private storage: AngularFireStorage,
    private router: Router,
    private route: ActivatedRoute,
    private toast: ToastController,
    private auth: AuthService,
    private camara: Camera,
    private push: PushNotificationService,
  ) { 
    this.spinner = true;
  }

  ngOnInit() {
    this.tab = 'pedidos';
    this.sector = this.route.snapshot.paramMap.get('sector');
    this.encuestaLimpieza = 2;
    this.prepararSector();
    this.fire.collection('pedidos')
    .snapshotChanges().subscribe( collection => {
      this.pedidos = [];
      collection.map( obj => {
        this.agregarAListaDePedidos(obj.payload.doc);
      });
      if(this.pedidos.length > this.cantidadPedidos){
        let nuevos: number = this.pedidos.length - this.cantidadPedidos;
        this.push.pushNotification('Pedidos', 'Hay ' + nuevos + ' pedido/s nuevo/s.', 0.5);
        // console.log('Push notification');
      }
      this.cantidadPedidos = this.pedidos.length;
      this.pedidos.forEach( (ped) => {
        if(ped.listo){
          this.actualizarEstadoPedido(ped, null, 'Listo');
        }
      });
      this.spinner = false;
    });
  }

  traerCantidadConsultas(){
    var prev;
    this.fire.collection('consultas', (ref) => ref.where('respondida', '==', false))
    .snapshotChanges().subscribe( docs => {
      prev = this.cantidadConsultas;
      this.cantidadConsultas = docs.length;
      if(this.cantidadConsultas > prev){
        this.push.pushNotification('Nueva consulta', 'Hay una nueva consulta de un cliente', 0.5);
      }
    });
  }

  irAConsultas(){
    this.router.navigate(['responder-consulta']);
  }

  agregarAListaDePedidos(doc){
    //console.log(doc.data());
    if(this.sector != 'salon'){
      if(doc.data().confirmado){
        this.pedidoListo = [];
        let listaProductos: Array<any> = this.prepararListaProductos(doc, this.tipos);
        let pedido: any = this.prepararPedido(doc, listaProductos, !this.pedidoListo.includes(false));
        pedido.listaCompleta = doc.data().productos;
        if(pedido.productos.length > 0){
          this.pedidos.push(pedido);
        }
      }
    } else{
      this.pedidoListo = [];
      let listaProductos: Array<any> = this.prepararListaProductos(doc, this.tipos);
      let pedido: any = this.prepararPedido(doc, listaProductos, !this.pedidoListo.includes(false));
      pedido.listaCompleta = doc.data().productos;
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
      this.traerCantidadConsultas();
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
    docRef.data().productos.map((prodObj: any) => {
      prodObj.index = i;
      prodObj.parentDoc = docRef.id;
      this.pedidoListo.push(prodObj.estado == "Listo");      
      if(tipos.includes(prodObj.tipo)){
        productosObj.push(prodObj);
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
      confirmado: docRef.data().confirmado,
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
      case 'En preparación':
        return 'danger';  
      case 'Listo':
        return prod ? 'success' : 'warning';  
      case 'Entregado':
        return 'success';  
      case 'Entrega a confirmar':
        return 'success';
    }
  }

  confirmarPedido(ped){
    console.log(ped);
    this.fire.collection('pedidos').doc(ped.docid).update({confirmado: true});
  }

  mostrarDetalle(item, pedido){
    this.itemSeleccionado = item;
    this.pedidoSeleccionado = pedido;
    this.detalle = true;
  }

  ocultarDetalle(){
    this.detalle = false;
  }

  // bebida.vinofamiglia/Famiglia Bianchi Malbec/600/1/En preparacion
  productoListo(estadoNuevo: string){
    let aModificar = this.itemSeleccionado;
    let tempList: Array<any> = this.pedidoSeleccionado.listaCompleta;
    // console.log(aModificar);
    // console.log(tempList);
    tempList[aModificar.index].estado = estadoNuevo;
    this.fire.collection('pedidos').doc(aModificar.parentDoc).update({productos: tempList});
    if(estadoNuevo != 'Listo'){
      this.actualizarEstadoPedido(null, aModificar.parentDoc, 'En preparación');
    }
  }

  actualizarEstadoPedido(ped, docid, est: string, cancela: boolean = false){    
    if(ped != null){
      if(ped.estado == 'Listo' || cancela){
        this.fire.collection('pedidos').doc(ped.docid).update({estado: est});
      }
    }/* else if (docid != null){
      this.fire.collection('pedidos').doc(docid).update({estado: est});      
    }*/
  }

  entregarPedido(pedido: any, estado: 'Enrega a confirmar' | 'Listo', cancela: boolean = false){
    if(pedido.estado == 'Listo' || cancela){
      this.fire.collection('pedidos').doc(pedido.docid).update({estado: estado});
    }
  }

  cambiarTab(tab: string){
    this.tab = '';
    this.spinner = true;
    setTimeout(() => {
      this.tab = tab;
      this.spinner = false;
    }, 1000);
  }

  entregarEncuesta(){
    if(this.encuestaFoto == null){this.presentToast('Debe sacar una foto'); return;}
    if(typeof this.encuestaSector == 'undefined'){this.presentToast('Seleccione sector'); return;}
    if(typeof this.encuestaTurno == 'undefined'){this.presentToast('Seleccione turno'); return;}
    this.spinner = true;
    this.subirFotoEncuesta()
    .then( (link: string) => {
      let encuesta = this.prepararObjetoEncuesta(link);
      this.fire.collection('encuestasEmpleados').add(encuesta)
      .then( () => {
        this.spinner = false;
        this.encuestaFoto = null;
        this.presentToast('Se entrego la encuesta. Gracias!');
      })
      .catch( () => {
        this.spinner = false;
        this.presentToast('Hubo un error al cargar la encuesta. Vuelva a intentar.');
      })
    })
    .catch( (reason) => {
      this.spinner = false;
      this.presentToast('Hubo un error al subir la foto');
    });
  }

  prepararObjetoEncuesta(link: string){
    return {
      foto: link,
      sector: this.encuestaSector,
      limpieza: this.encuestaLimpiezaTexto,
      insumos: this.encuestaInsumos,
      turno: this.encuestaTurno,
      comentario: this.encuestaComentario
    };
  }

  async subirFotoEncuesta(){
    return new Promise( (resolve, reject) => {
      let fname = 'encuestas/encuestaEmpleado.' + Date.now() + '.jpg';
      fetch(this.encuestaFoto)
      .then( (res) => {
        res.blob()
        .then( (fotoBlob) => {
          this.storage.upload(fname, fotoBlob)
          .then( (uploadResponse) => {
            uploadResponse.ref.getDownloadURL()
            .then( (link) => {
              resolve(link);
            })
            .catch( (reason) => {
              console.log(reason);
              reject(reason);
            })            
          })
          .catch( (reason) => {
            console.log(reason);
            reject(reason);
          })
        })
        .catch( (reason) => {
          console.log(reason);
          reject(reason);
        })
      })
      .catch( (reason) => {
        console.log(reason);
        reject(reason);
      })
    });
  }

  actualizarLimpiezaTexto(){
    switch(this.encuestaLimpieza){
      case 0:
        this.encuestaLimpiezaTexto = 'Una mugre';
        break;
      case 1:
        this.encuestaLimpiezaTexto = 'Desordenado';
        break;
      case 2:
        this.encuestaLimpiezaTexto = 'Aceptable';
        break;
      case 3:
        this.encuestaLimpiezaTexto = 'Ordenado';
        break;
      case 4:
        this.encuestaLimpiezaTexto = 'Excelente';
        break;
    }
  }

  sacarFoto(){
    let opcionesCamara: CameraOptions = {
      allowEdit: false,
      cameraDirection: 0,
      correctOrientation: true,
      destinationType: 0,
      quality: 50,
    }
    this.camara.getPicture(opcionesCamara)
    .then( (fotoStream) => {
      this.encuestaFoto = 'data:image/jpeg;base64,' + fotoStream;
    })
    .catch( (reason) => {
      this.presentToast('Hubo un error al tomar la foto, intente nuevamente.');
    });
  }

  /**
   * Presenta un toast con el mensaje indicado en la posicion indicada, la posicion por default es top.
   * @param message Mensaje a presentar
   * @param pos Posicion del toast
   */
  async presentToast(message: string, pos: 'top' | "middle" | "bottom" = "middle") {
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

