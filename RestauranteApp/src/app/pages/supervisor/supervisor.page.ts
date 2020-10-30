import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../services/auth.service";
import { CorreosService } from "../../services/correos.service";

@Component({
  selector: 'app-supervisor',
  templateUrl: './supervisor.page.html',
  styleUrls: ['./supervisor.page.scss'],
})
export class SupervisorPage implements OnInit {

  lista = new Array();

  constructor(private db: AuthService, private cs: CorreosService) {
    //this.db.registrarCliente();
  }

  
  ngOnInit() {
    this.db.traerClientesSinAprobar().subscribe(doc => this.lista = doc);
  }

  aceptarRegistro(dni: number, fecha: number, correo: string, nombre: string){
    this.db.actualizarAprobacionRegistro(dni+"."+fecha)
    .then(() => {
      this.cs.enviarCorreo(correo,
        "EL CIRCULO RESTAURANTE - SOLICITUD DE REGISTRO",
        `Hola, ${nombre}:\n
        Tu solicitud de registro a EL CIRCULO RESTAURANTE ha sido
        confirmada. Ya podés ingresar a tu cuenta a travez de la app.\n\n
        Saludos, EL CIRCULO RESTAURANTE`
      );
    });
  }

  rechazarRegistro(dni: number, fecha: number, correo: string, nombre: string){
    this.db.eliminarCliente(dni+"."+fecha)
    .then(() => {
      this.cs.enviarCorreo(correo,
        "EL CIRCULO RESTAURANTE - SOLICITUD DE REGISTRO",
        `Hola, ${nombre}:\n
        Tu solicitud de registro a EL CIRCULO RESTAURANTE ha sido
        rechazada. Lamentamos los inconvenientes ocasionados.\n\n
        Saludos, EL CIRCULO RESTAURANTE`
      );
    });
  }
}
