import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AltaAdminsPage } from './alta-admins.page';

const routes: Routes = [
  {
    path: '',
    component: AltaAdminsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AltaAdminsPageRoutingModule {}
