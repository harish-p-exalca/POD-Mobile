import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import {FlexLayoutModule} from '@angular/flex-layout';
import { DescriptionPageRoutingModule } from './description-routing.module';
import {MaterialModule} from '../material/material.module';
import { DescriptionPage } from './description.page';
import { AuthGuardService } from '../services/AuthGuardService.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    DescriptionPageRoutingModule,
    MaterialModule
  ],
  declarations: [DescriptionPage]
})
export class DescriptionPageModule {}
