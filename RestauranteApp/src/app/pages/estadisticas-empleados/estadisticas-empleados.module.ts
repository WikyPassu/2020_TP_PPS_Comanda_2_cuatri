import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EstadisticasEmpleadosPageRoutingModule } from './estadisticas-empleados-routing.module';

import { EstadisticasEmpleadosPage } from './estadisticas-empleados.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EstadisticasEmpleadosPageRoutingModule
  ],
  declarations: [EstadisticasEmpleadosPage]
})
export class EstadisticasEmpleadosPageModule {}
