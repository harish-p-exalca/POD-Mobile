import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';


import { GetAllInvoiceResolver } from './services/ApprovedInvoiceResolver.service';

import { InvoiceDescriptionResolver } from './services/InvoiceDescriptionResolver.service';
import {OnTimeAndLateInvResolver} from './services/OnTimeAndLateInvResolver.service'
import { AuthGuardService } from './services/AuthGuardService.service';
import { AuthGuard } from './auth.guard';
import { DeliveryResolver } from './services/chartresolver.service';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule),
    canActivate :[AuthGuardService]
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  
  {
    path: 'invoice/:user_data/:selected_id',
    loadChildren: () => import('./invoice/invoice.module').then( m => m.InvoicePageModule),
    
    
    
    canActivate :[AuthGuard]
    
  },
  {
    path: 'charts/:user_data',
    loadChildren: () => import('./charts/charts.module').then( m => m.ChartsPageModule),
    
    resolve:{ delivery:DeliveryResolver},
    canActivate :[AuthGuard]
    
  },
  {
    path: 'description/:user_data/:header_id/:type',
    loadChildren: () => import('./description/description.module').then( m => m.DescriptionPageModule),
    
    resolve:{descrptn:InvoiceDescriptionResolver},
    canActivate :[AuthGuard]
  },
  {
    path: 'on-time-and-late-invs/:user_data/:selected_id',
    loadChildren: () => import('./on-time-and-late-invs/on-time-and-late-invs.module').then( m => m.OnTimeAndLateInvsPageModule),
    canActivate:[AuthGuard]

  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
