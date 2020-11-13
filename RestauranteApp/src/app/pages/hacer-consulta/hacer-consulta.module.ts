import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HacerConsultaPageRoutingModule } from './hacer-consulta-routing.module';

import { HacerConsultaPage } from './hacer-consulta.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HacerConsultaPageRoutingModule
  ],
  declarations: [HacerConsultaPage]
})
export class HacerConsultaPageModule {}
