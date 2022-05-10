import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SavedInvoicesPage } from './saved-invoices.page';

const routes: Routes = [
  {
    path: '',
    component: SavedInvoicesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SavedInvoicesPageRoutingModule {}
