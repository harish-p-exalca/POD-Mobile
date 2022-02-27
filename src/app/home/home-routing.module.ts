import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';
import { SigninPage } from '../signin/signin.page';
import { InvoicePage } from '../invoice/invoice.page';
import { ChartsPage } from '../charts/charts.page';
import { DescriptionPage } from '../description/description.page';


const routes: Routes = [
  {
    path: '',
    component: HomePage,
  }
  // {
  //   path:'invoice',
  //   component: InvoicePage
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
