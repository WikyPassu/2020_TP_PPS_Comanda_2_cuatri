import { Injectable } from '@angular/core';

import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from "@angular/fire/firestore";
import * as firebase from 'firebase';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private AFauth:AngularFireAuth, private db:AngularFirestore) {
    // Actualizo la lista actual de clientes en la coleccion
    this.traerClientes().subscribe(data => this.clientesRegistrados = data);
  }
  base;
  clientesRegistrados = new Array(); //Lista de clientes en la coleccion
  userObs;

  login(email:string, pwd:string){
    return new Promise((resolve, rejected) => {
      this.AFauth.signInWithEmailAndPassword(email,pwd).then(user => resolve(user))
      .catch(err => rejected(err));
    });
  }

  logout() : boolean{
    let retorno:boolean = false;
    this.AFauth.signOut().then(() => {
      retorno = true;
    })
    .catch(error => {
      console.log(error);
      retorno = false;
    })
    return retorno;
  }
  
  consultar(){
    return this.db.collection("Usuarios").snapshotChanges();
  }

  /**
   * Trae el link de la foto con el nombre pasado por parametro
   * @param nombreFoto Nombre de la foto de la que se quiere el link
   */
  buscarFotoPorNombre(nombreFoto){
    let storageRef = firebase.storage().ref();
    return new Promise(resolve => {
      storageRef.listAll().then(lista => {
        lista.items.forEach(foto => {
          if(foto.name == nombreFoto){
            foto.getDownloadURL().then(link => {
              resolve(link);
            });
          }
        });
      })
    });
  }

  borrarFoto(linkFoto){
    let storageRef = firebase.storage().ref();

    if (linkFoto != "../../../assets/img/avatarVacio.jpg"){
    
      storageRef.listAll().then((lista)=>{

        lista.items.forEach(f => {
          f.getDownloadURL().then((link)=>{
            if (link == linkFoto){    
              f.delete();
            }
          });
        });

      }).catch(e=>{
        alert(e);
      });
    }
  }

  borrarFotoPorNombre(nombreFoto){
    let storageRef = firebase.storage().ref();

    storageRef.listAll().then((lista)=>{

      lista.items.forEach(f => {

        if (f.name == nombreFoto){
          f.delete();
        }
      });

    }).catch(e=>{
      alert(e);
    });

  }

  /**
   * Registra un cliente en el auth
   * @param correo
   * @param clave
   */
  registroAuth(correo: string, clave:string){
    return new Promise((resolve, rejected) => {
      this.AFauth.createUserWithEmailAndPassword(correo, clave)
      .then(user => resolve(user))
      .catch(error => rejected(error));
    });
  }

  /**
   * Registra un cliente en la coleccion con aprobado = false
   * @param correo
   * @param clave 
   * @param apellido 
   * @param nombre 
   * @param dni 
   * @param fecha 
   * @param foto 
   */
  registroCliente(correo:string, clave:string, apellido:string, nombre:string, dni:number, fecha:number, foto:string){
    return new Promise((resolve, rejected) => {
        this.db.collection("clientes").doc(dni + '.' + fecha).set({
          id: dni + '.' + fecha,
          apellido: apellido,
          aprobado : false,
          correo: correo,
          clave: clave, //agrego clave porque la necesito para hacer auth
          dni: dni,
          foto: foto,
          nombre: nombre,
          tipo: "registrado",
          fecha: fecha,
          perfil: 'cliente'
        }).then(()=>{
          resolve();})
        .catch(error =>rejected(error))
    });
  }
  
  verificarSiEstaAceptado(){
  }

  registroAnonimo(nombre : string, fecha, foto){
    return new Promise((resolve, rejected) => {
        this.db.collection("clientes").doc(nombre + '.' + fecha).set({
          id: nombre + '.' + fecha,
          apellido: "",
          aprobado : true,
          clave: "",
          correo: "",
          dni: "",
          foto: foto,
          nombre: nombre,
          tipo: "anonimo",
          fecha: fecha
        }).then(()=>{
          resolve();
        }).catch(error => rejected(error));
      });
  }

  registroAdmins(apellido:string,nombre:string,dni:number,cuil:number,perfil:string,correo:string,clave:string,foto:string){
    let fecha = Date.now();
    return new Promise((resolve, rejected) => {
      this.AFauth.createUserWithEmailAndPassword(correo, clave).then(res => {
        resolve(res);
        this.db.collection("empleados").doc(dni+"."+fecha).set({
          id: dni+"."+fecha,
          apellido: apellido,
          nombre: nombre,
          dni: dni,
          cuil: cuil,
          perfil: perfil,
          correo: correo,
          clave: clave,
          foto: foto
        }).catch(error => rejected(error));
      }).catch(error => rejected(error));
    });
  }

  /**
   * Permite saber cuando hay un nuevo registro pendiente de aprobacion, retorna el documento encriptado recientemente agregado
   */
  hayNuevoRegistro(){
    return this.db.collection("clientes", ref => ref.where("aprobado", "==", false)).stateChanges(["added"]);
  }

  /**
   * Esta es igual a traerClientesSinAprobar pero con valueChanges porque no me funcionaba la otra
   */
  traerClientesPendientesAprobacion(){
    return this.db.collection("clientes", ref => ref.where("aprobado", "==", false)).valueChanges();
  }

  traerClientesSinAprobar(){
    return this.db.collection("clientes", ref=>ref.where("aprobado", "==", false)).snapshotChanges();
  }

  traerEmpleados(){
    return this.db.collection("empleados").snapshotChanges();
  }

  /**
   * Hardcodea un cliente para probar cositas ricas, tiene pocos atributos.
   */
  registrarCliente(){
    return this.db.collection("clientes").doc("123123123.111111").set({
      id: 123123123.111111,
      dni: 123123123,
      nombre: "porta",
      apellido: "queteim",
      fecha: 111111,
      aprobado: false
    });
  }

  /**
   * Actualiza la aprobacion de un cliente.
   * @param uid uid del cliente a actualizar.
   */
  actualizarAprobacionRegistro(uid){
    return this.db.collection("clientes").doc(uid).update({aprobado: true});
  }

  /**
   * Elimina un cliente de la coleccion.
   * @param uid uid del cliente a eliminar.
   */
  eliminarCliente(uid){
    return this.db.collection("clientes").doc(uid).delete();
  }

  /**
   * Trae todos los docs de la coleccion clientes
   */
  traerClientes(){
    return this.db.collection("clientes").valueChanges();
  }

  /**
   * Recorre la lista de clientes (que se actualiza en el constructor)
   * y se fija si existe un cliente registrado en la coleccion con el
   * correo pasado por parametro 
   * @param correo Correo del cliente que quiero saber si esta registrado en
   * la coleccion
   */
  verificarEmailFire(correo: string): boolean{
    let existe = false;
    this.clientesRegistrados.forEach(cliente => {
      if(cliente.correo == correo && !cliente.aprobado){
        existe = true;
      }
    });
    return existe;
  }

  /**
   * Recorre la lista de clientes (que se actualiza en el constructor)
   * y se fija si existe un cliente registrado y aprobado en la coleccion
   * con el correo pasado por parametro
   * @param correo Correo del cliente que quiero saber si esta registrado en
   * el auth
   */
  verificarEmailAuth(correo: string){
    let existe = false;
    this.clientesRegistrados.forEach(cliente => {
      if(cliente.correo == correo && cliente.aprobado){
        existe = true;
      }
    });
    return existe;
  }
  
  /**
   * Trae el observable de los datos de usuario en firestore.
   * @param correo Correo del usuario
   */
  async traerInfoFirestore(correo){
    return new Promise( (resolve, rejected) => {
      this.db.collection('clientes', (ref) => ref.where('correo', '==', correo))
      .get().subscribe( data => {
        resolve(data);
      });
    });
  }

  /**
   * Trae un documento de la coleccion de mesas a partir del id de la mesa pasado por parametro
   * @param id Id de la mesa
   */
  traerMesa(id: string){
    return this.db.collection("mesas").doc(id).get();
  }

  /**
   * Trae un documento de la coleccion de clientes a partir del id del cliente pasado por parametro
   * @param id Id del cliente
   */
  traerCliente(id: string){
    return this.db.collection("clientes").doc(id).get();
  }

  /**
   * Trae el pedido de un cliente
   * @param idcliente Id del cliente asociado al pedido
   */
  traerPedidoCliente(idcliente: string){
    return this.db.collection("pedidos", ref => ref.where('idCliente', "==", idcliente)).valueChanges();
  }

  /**
   * Crea una nueva consulta
   * @param mesa Id de la mesa de donde viene la consulta
   * @param idcliente Id del cliente que hizo la consulta
   * @param consulta El mensaje enviado por el cliente
   */
  crearConsulta(mesa: string, idcliente: string, nombreCliente:string, consulta: string){
    let fecha = Date.now();
    let idconsulta: string = fecha + "." + idcliente;
    return this.db.collection("consultas").doc(idconsulta).set({
      idconsulta: idconsulta,
      mesa: mesa,
      idcliente: idcliente,
      nombreCliente: nombreCliente,
      consulta: consulta,
      respuesta: "Esperando respuesta...",
      fecha: fecha
    });
  }

  /**
   * Actualiza la respuesta a una consulta
   * @param idconsulta Id de la consulta a responder
   * @param respuesta Respuesta enviada por el mozo
   */
  responderConsulta(idconsulta: string, respuesta: string){
    return this.db.collection("consultas").doc(idconsulta).update({respuesta: respuesta});
  }

  /**
   * Trae todas las consultas existentes
   */
  traerConsultas(){
    return this.db.collection("consultas").valueChanges();
  }

  /**
   * Trae todas las conultas existentes de un cliente
   * @param idcliente Id del cliente del que se quieren traer todas las consultas
   */
  traerConsultasCliente(idcliente: string){
    return this.db.collection("consultas", ref => ref.where("idcliente", "==", idcliente)).valueChanges();
  }
}