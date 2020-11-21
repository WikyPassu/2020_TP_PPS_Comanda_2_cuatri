import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListadoProductosPageRoutingModule } from './listado-productos-routing.module';

import { ListadoProductosPage } from './listado-productos.page';
import { SpinnerComponent } from 'src/app/components/spinner/spinner.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListadoProductosPageRoutingModule
  ],
  declarations: [ListadoProductosPage,
  SpinnerComponent]
})
export class ListadoProductosPageModule {}
