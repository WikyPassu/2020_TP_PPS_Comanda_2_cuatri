import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResponderConsultaPageRoutingModule } from './responder-consulta-routing.module';

import { ResponderConsultaPage } from './responder-consulta.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResponderConsultaPageRoutingModule
  ],
  declarations: [ResponderConsultaPage]
})
export class ResponderConsultaPageModule {}
