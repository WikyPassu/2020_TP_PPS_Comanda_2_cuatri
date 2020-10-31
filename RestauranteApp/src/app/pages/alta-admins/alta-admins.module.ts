import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AltaAdminsPageRoutingModule } from './alta-admins-routing.module';

import { AltaAdminsPage } from './alta-admins.page';

import { SpinnerComponent } from "../../components/spinner/spinner.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AltaAdminsPageRoutingModule
  ],
  exports: [
    SpinnerComponent
  ],
  declarations: [AltaAdminsPage, SpinnerComponent]
})
export class AltaAdminsPageModule {}
