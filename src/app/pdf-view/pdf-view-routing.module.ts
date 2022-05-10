import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PdfViewPage } from './pdf-view.page';

const routes: Routes = [
  {
    path: '',
    component: PdfViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PdfViewPageRoutingModule {}
