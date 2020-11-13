import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-responder-consulta',
  templateUrl: './responder-consulta.page.html',
  styleUrls: ['./responder-consulta.page.scss'],
})
export class ResponderConsultaPage implements OnInit {

  public consultas: Array<any>;

  constructor(
    private fire: AngularFirestore,
  ) { }

  ngOnInit() {
    //this.fire.collection('consultas', (ref) => ref.where())
  }

}
