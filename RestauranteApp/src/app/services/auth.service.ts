import { Injectable } from '@angular/core';

import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from "@angular/fire/firestore";
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  base;
  userObs;

  constructor(
    private AFauth:AngularFireAuth, 
    private db:AngularFirestore,
    ) { }

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

  registroCliente(correo:string, clave:string, apellido:string, nombre:string, dni:number, tipoRegistro : string, fecha){
    return new Promise((resolve, rejected) => {
      this.AFauth.createUserWithEmailAndPassword(correo, clave).then(res => {
        resolve(res);
        this.db.collection("clientes").doc(dni + '.' + fecha).set({
          id: dni + '.' + fecha,
          apellido: apellido,
          aprobado : false,
          correo: correo,
          dni: dni,
          foto: nombre + "." + fecha,
          nombre: nombre,
          tipo: "registrado",
          fecha: fecha
        }).catch(error =>rejected(error))
      }).catch(error =>rejected(error));
    });
  }
  
  verificarSiEstaAceptado(){
  }

  registroAnonimo(nombre : string, fecha){
    return new Promise((resolve, rejected) => {
        this.db.collection("clientes").doc(nombre + '.' + fecha).set({
          id: nombre + '.' + fecha,
          apellido: "",
          aprobado : true,
          clave: "",
          correo: "",
          dni: "",
          foto: nombre + "." + fecha,
          nombre: nombre,
          tipo: "anonimo",
          fecha: fecha
        }).catch(error => rejected(error));
        resolve("done");
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
}