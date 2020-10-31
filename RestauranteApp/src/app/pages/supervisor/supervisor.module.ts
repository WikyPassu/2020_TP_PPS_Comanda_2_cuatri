import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SupervisorPageRoutingModule } from './supervisor-routing.module';

import { SupervisorPage } from './supervisor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SupervisorPageRoutingModule
  ],
  declarations: [SupervisorPage]
})
export class SupervisorPageModule {}
