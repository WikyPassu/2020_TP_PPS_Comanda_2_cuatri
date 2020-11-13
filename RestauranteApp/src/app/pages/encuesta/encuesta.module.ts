import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EncuestaPageRoutingModule } from './encuesta-routing.module';

import { EncuestaPage } from './encuesta.page';
import { SpinnerComponent } from "../../components/spinner/spinner.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EncuestaPageRoutingModule
  ],
  declarations: [EncuestaPage, SpinnerComponent]
})
export class EncuestaPageModule {}
