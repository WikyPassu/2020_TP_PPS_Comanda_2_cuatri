import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BartenderPageRoutingModule } from './bartender-routing.module';

import { BartenderPage } from './bartender.page';
import { SpinnerComponent } from 'src/app/components/spinner/spinner.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BartenderPageRoutingModule
  ],
  declarations: [BartenderPage, SpinnerComponent]
})
export class BartenderPageModule {}
