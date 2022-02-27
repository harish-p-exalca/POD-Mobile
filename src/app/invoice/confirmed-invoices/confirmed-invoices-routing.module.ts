import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConfirmedInvoicesPage } from './confirmed-invoices.page';

const routes: Routes = [
  {
    path: '',
    component: ConfirmedInvoicesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfirmedInvoicesPageRoutingModule {}
