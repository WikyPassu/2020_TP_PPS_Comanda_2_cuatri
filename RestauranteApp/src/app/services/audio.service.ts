import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioService {

  audio = null;

  constructor() { }

  private reproducirAudio(sonido : string){
    this.audio = null;
    this.audio = new Audio(sonido);
    this.audio.play();
  }

  reproducirAudioCambioPant(){
    this.reproducirAudio("../../assets/sonidos/changesound.m4a");
  }

  reproducirAudioInicio(){
    this.reproducirAudio("../../assets/sonidos/startupsound.m4a");
  }

  reproducirAudioErr(){
    this.reproducirAudio("../../assets/sonidos/errsound.m4a");
  }
}
