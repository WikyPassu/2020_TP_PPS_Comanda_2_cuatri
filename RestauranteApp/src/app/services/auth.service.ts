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

  register(correo:string, clave:string, apellido:string, nombre:string, dni:string){
    return new Promise((resolve, rejected) => {
      this.AFauth.createUserWithEmailAndPassword(correo, clave).then(res => {
        this.db.collection("Usuarios").doc(res.user.uid).set({
          id: res.user.uid,
          correo: correo,
          clave: clave,
          perfil: "usuario",
          sexo: "N/A",
          apellido: apellido,
          nombre: nombre,
          dni: dni
        });
        resolve(res);
      }).catch(error => rejected(error));
    });
  }

  traerClientesPendientes(){
    return this.db.collection("clientes",
    ref => ref.where("aprobado","==",false))
    .valueChanges();
  }
  
  verificarSiEstaAceptado(){
  }

  traerClientesSinAprobar(){
    return this.db.collection("clientes", ref=>ref.where("aprobado", "==", false)).snapshotChanges();
  }

  traerEmpleados(){
    return this.db.collection("empleados").snapshotChanges();
  }
}