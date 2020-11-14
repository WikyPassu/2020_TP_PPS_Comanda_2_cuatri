import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-responder-consulta',
  templateUrl: './responder-consulta.page.html',
  styleUrls: ['./responder-consulta.page.scss'],
})
export class ResponderConsultaPage implements OnInit {

  public consultas: Array<any>;
  public listo = false;

  constructor(
    private fire: AngularFirestore,
    private router: Router,
  ) { }

  ngOnInit() {
    this.fire.collection('consultas', (ref) => ref.where('respondida', '==', false))
    .snapshotChanges().subscribe( (consultas) => {
      this.consultas = [];
      consultas.forEach( (doc) => {
        let consulta: any = doc.payload.doc.data();
        consulta.docid = doc.payload.doc.id;
        consulta.respuesta = '';
        this.consultas.push(consulta);
      });
      this.listo = true;
    });
  }

  responderConsulta(consulta){
    consulta.respondida = true;
    this.fire.collection('consultas').doc(consulta.docid).update(consulta);
  }

  volver(){
    this.router.navigate(['preparacion/salon']);
  }

}
