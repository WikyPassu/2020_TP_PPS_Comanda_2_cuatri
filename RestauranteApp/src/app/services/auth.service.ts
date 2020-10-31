import { Injectable } from '@angular/core';

import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from "@angular/fire/firestore";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private AFauth:AngularFireAuth, private db:AngularFirestore) {}
  
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

  registroCliente(correo:string, clave:string, apellido:string, nombre:string, dni:number, foto:string, tipoRegistro : string){
    var fecha = Date.now();
    return new Promise((resolve, rejected) => {
      this.AFauth.createUserWithEmailAndPassword(correo, clave).then(res => {
        resolve(res);
        this.db.collection("clientes").doc(dni + '.' + fecha).set({
          id: dni + '.' + fecha,
          apellido: apellido,
          aprobado : false,
          clave: clave,
          correo: correo,
          dni: dni,
          foto: foto,
          nombre: nombre,
          tipo: "registrado",
          fecha: fecha
        }).catch(error =>rejected(error))
      }).catch(error =>rejected(error));
    });
  }
  
  verificarSiEstaAceptado(){
  }

  registroAnonimo(nombre : string, foto : string){
    var fecha = Date.now();

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
}