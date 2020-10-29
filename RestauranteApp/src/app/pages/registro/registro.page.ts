import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  textoTipo: string = "modo anonimo?"
  modoRegistro = true;
  mostrarAgregado = false;
  
  constructor() { }

  ngOnInit() {
  }

  cambiarTipo(){
    if (this.textoTipo == "modo anonimo?"){
      this.modoRegistro = false;
      this.textoTipo = "registro?";
    }
    else{
      this.modoRegistro = true;
      this.textoTipo = "modo anonimo?";
    }
  }

}
