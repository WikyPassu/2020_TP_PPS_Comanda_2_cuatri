import { Injectable } from '@angular/core';
import { LocalNotifications, ELocalNotificationTriggerUnit } from "@ionic-native/local-notifications/ngx";

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {

  constructor(private ln: LocalNotifications) { }

  /**
   * Genera una push notification con el titulo y mensaje en los x segundos siguientes pasados por parametro
   * @param titulo Titulo que tendra la push notification
   * @param mensaje Mensaje que tendra la push notification
   * @param segundos Segundos de delay hasta que se muestre la push notification
   */
  pushNotification(titulo: string, mensaje: string, segundos: number){
    this.ln.schedule({
      title: titulo,
      text: mensaje,
      trigger: {
        in: segundos,
        unit: ELocalNotificationTriggerUnit.SECOND
      }
    });
  }
}
