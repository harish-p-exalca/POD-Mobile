import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConfirmedInvoicesPageRoutingModule } from './confirmed-invoices-routing.module';

import { ConfirmedInvoicesPage } from './confirmed-invoices.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConfirmedInvoicesPageRoutingModule
  ],
  declarations: [ConfirmedInvoicesPage]
})
export class ConfirmedInvoicesPageModule {}
