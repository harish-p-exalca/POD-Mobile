import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PendingInvoicesPage } from './pending-invoices.page';

const routes: Routes = [
  {
    path: '',
    component: PendingInvoicesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PendingInvoicesPageRoutingModule {}
