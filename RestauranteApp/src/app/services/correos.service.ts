import { Injectable } from '@angular/core';
import { EmailComposer } from "@ionic-native/email-composer/ngx";

@Injectable({
  providedIn: 'root'
})
export class CorreosService {

  constructor(private emailComposer: EmailComposer) {}

  enviarCorreo(receptor, titulo, cuerpo){
    let correo = {
      to: receptor,
      subject: titulo,
      body: cuerpo,
      isHtml: true
    };
    this.emailComposer.open(correo);
  }
}
