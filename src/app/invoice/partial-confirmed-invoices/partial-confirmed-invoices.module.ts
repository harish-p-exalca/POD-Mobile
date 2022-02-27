import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PartialConfirmedInvoicesPageRoutingModule } from './partial-confirmed-invoices-routing.module';

import { PartialConfirmedInvoicesPage } from './partial-confirmed-invoices.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PartialConfirmedInvoicesPageRoutingModule
  ],
  declarations: [PartialConfirmedInvoicesPage]
})
export class PartialConfirmedInvoicesPageModule {}
