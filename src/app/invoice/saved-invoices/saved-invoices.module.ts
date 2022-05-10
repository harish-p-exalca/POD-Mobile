import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SavedInvoicesPageRoutingModule } from './saved-invoices-routing.module';

import { SavedInvoicesPage } from './saved-invoices.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SavedInvoicesPageRoutingModule
  ],
  declarations: [SavedInvoicesPage]
})
export class SavedInvoicesPageModule {}
