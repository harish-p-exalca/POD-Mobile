import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {FlexLayoutModule} from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {MaterialModule} from '../material/material.module';
import { OnTimeAndLateInvsPageRoutingModule } from './on-time-and-late-invs-routing.module';

import { OnTimeAndLateInvsPage } from './on-time-and-late-invs.page';
import { LateAndOnTimeFilterComponent } from '../late-and-on-time-filter/late-and-on-time-filter.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    MaterialModule,
    OnTimeAndLateInvsPageRoutingModule
  ],
  declarations: [OnTimeAndLateInvsPage,LateAndOnTimeFilterComponent]
})
export class OnTimeAndLateInvsPageModule {}
