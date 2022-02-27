import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PartialConfirmedInvoicesPage } from './partial-confirmed-invoices.page';

const routes: Routes = [
  {
    path: '',
    component: PartialConfirmedInvoicesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PartialConfirmedInvoicesPageRoutingModule {}
