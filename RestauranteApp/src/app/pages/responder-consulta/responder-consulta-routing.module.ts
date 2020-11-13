import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResponderConsultaPage } from './responder-consulta.page';

const routes: Routes = [
  {
    path: '',
    component: ResponderConsultaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResponderConsultaPageRoutingModule {}
