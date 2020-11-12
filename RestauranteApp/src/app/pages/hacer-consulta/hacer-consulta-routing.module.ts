import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HacerConsultaPage } from './hacer-consulta.page';

const routes: Routes = [
  {
    path: '',
    component: HacerConsultaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HacerConsultaPageRoutingModule {}
