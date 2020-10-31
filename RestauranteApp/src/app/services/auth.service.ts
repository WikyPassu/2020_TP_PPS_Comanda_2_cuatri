import { Injectable } from '@angular/core';

import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from "@angular/fire/firestore";
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private AFauth:AngularFireAuth, private db:AngularFirestore) { }
  base;

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

  traerClientesSinAprobar(){
    return this.db.collection("clientes", ref=>ref.where("aprobado", "==", false)).snapshotChanges();
  }

  traerEmpleados(){
    return this.db.collection("empleados").snapshotChanges();
  }
}
