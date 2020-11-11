import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CocineroPageRoutingModule } from './cocinero-routing.module';

import { CocineroPage } from './cocinero.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CocineroPageRoutingModule
  ],
  declarations: [CocineroPage]
})
export class CocineroPageModule {}
