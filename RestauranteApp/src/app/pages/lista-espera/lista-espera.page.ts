import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-lista-espera',
  templateUrl: './lista-espera.page.html',
  styleUrls: ['./lista-espera.page.scss'],
})
export class ListaEsperaPage implements OnInit {

  private user: any = {};
  private enEspera: Array<any> = [];
  public cargando: boolean = true;
  public pre: string = 'https://firebasestorage.googleapis.com/v0/b/restauranteapp-581eb.appspot.com/o/';
  public pos: string = '?alt=media';
  public cliente: boolean;
  public personasDelante: number;

  constructor(
    private fire: AngularFirestore,
    private router: Router,
    private route: ActivatedRoute,
    private toast: ToastController,
  ) { }

  ngOnInit() {
    this.user = JSON.parse(this.route.snapshot.paramMap.get('user'));
    this.cliente = this.user.perfil == 'cliente';
    this.traerEnEspera();
  }

  traerEnEspera(){
    this.fire.collection('listaespera')
    .valueChanges().subscribe( (collection) => {
      this.enEspera = collection;
      this.enEspera.sort( (a, b) => {
        return a.fecha - b.fecha;
      });
      if(this.cliente){
        this.traerLugarEnLista();
      }
      this.cargando = false;
    });
  }

  sentar(uid){
    console.log(uid);
    this.fire.collection('listaespera', (ref) => ref.where('id', '==', uid))
    .get().subscribe( (data) => {
      this.fire.doc('listaespera/' + data.docs[0].id ).delete();
    });
  }

  traerLugarEnLista(){
    let len = this.enEspera.length;
    for(let i = 0; i < len; i++){
      if(this.enEspera[i].id == this.user.id){
        this.personasDelante = i;
        break;
      }
    }
  }

}
