import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InvoicePage } from './invoice.page';

const routes: Routes = [
  {
    path: '',
    component: InvoicePage
  },
  {
    path: 'pending-invoices',
    loadChildren: () => import('./pending-invoices/pending-invoices.module').then( m => m.PendingInvoicesPageModule)
  },
  {
    path: 'partial-confirmed-invoices',
    loadChildren: () => import('./partial-confirmed-invoices/partial-confirmed-invoices.module').then( m => m.PartialConfirmedInvoicesPageModule)
  },
  {
    path: 'confirmed-invoices',
    loadChildren: () => import('./confirmed-invoices/confirmed-invoices.module').then( m => m.ConfirmedInvoicesPageModule)
  },  {
    path: 'saved-invoices',
    loadChildren: () => import('./saved-invoices/saved-invoices.module').then( m => m.SavedInvoicesPageModule)
  }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InvoicePageRoutingModule {}
