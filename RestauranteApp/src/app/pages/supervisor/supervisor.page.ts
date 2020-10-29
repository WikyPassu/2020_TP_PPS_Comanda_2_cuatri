import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../services/auth.service";

@Component({
  selector: 'app-supervisor',
  templateUrl: './supervisor.page.html',
  styleUrls: ['./supervisor.page.scss'],
})
export class SupervisorPage implements OnInit {

  lista = new Array();

  constructor(private db: AuthService) { }

  ngOnInit() {
    this.db.traerClientesPendientes()
    .subscribe(doc => {
      this.lista = doc;
      console.log(this.lista);
    });
  }

}
