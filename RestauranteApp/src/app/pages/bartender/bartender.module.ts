import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BartenderPageRoutingModule } from './bartender-routing.module';

import { BartenderPage } from './bartender.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BartenderPageRoutingModule
  ],
  declarations: [BartenderPage]
})
export class BartenderPageModule {}
