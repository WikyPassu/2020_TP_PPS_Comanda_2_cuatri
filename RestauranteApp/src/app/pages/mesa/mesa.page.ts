import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-mesa',
  templateUrl: './mesa.page.html',
  styleUrls: ['./mesa.page.scss'],
})
export class MesaPage implements OnInit {

  mesa: any = {};

  constructor(private router: Router) { }

  ngOnInit() {
    //this.router.getCurrentNavigation().extras.state;
  }

  
}
