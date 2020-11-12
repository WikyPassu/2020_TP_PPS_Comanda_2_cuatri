import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListadoProductosPage } from './listado-productos.page';

const routes: Routes = [
  {
    path: '',
    component: ListadoProductosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListadoProductosPageRoutingModule {}
