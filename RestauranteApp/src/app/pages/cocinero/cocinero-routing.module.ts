import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CocineroPage } from './cocinero.page';

const routes: Routes = [
  {
    path: '',
    component: CocineroPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CocineroPageRoutingModule {}
