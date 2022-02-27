import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PendingInvoicesPageRoutingModule } from './pending-invoices-routing.module';

import { PendingInvoicesPage } from './pending-invoices.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PendingInvoicesPageRoutingModule
  ],
  declarations: [PendingInvoicesPage]
})
export class PendingInvoicesPageModule {}
