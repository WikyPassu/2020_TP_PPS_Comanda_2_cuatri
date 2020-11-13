import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EstadisticasEmpleadosPage } from './estadisticas-empleados.page';

const routes: Routes = [
  {
    path: '',
    component: EstadisticasEmpleadosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EstadisticasEmpleadosPageRoutingModule {}
