import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AudioService } from "../../services/audio.service";

@Component({
  selector: 'app-estadisticas-empleados',
  templateUrl: './estadisticas-empleados.page.html',
  styleUrls: ['./estadisticas-empleados.page.scss'],
})
export class EstadisticasEmpleadosPage implements OnInit {

  public encuestas: Array<any> = [];

  constructor(
    private fire: AngularFirestore,
    private audio: AudioService
  ) { }

  ngOnInit() {
    this.audio.reproducirAudioCambioPant();
  }

}
