import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OnTimeAndLateInvsPage } from './on-time-and-late-invs.page';

const routes: Routes = [
  {
    path: '',
    component: OnTimeAndLateInvsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OnTimeAndLateInvsPageRoutingModule {}
