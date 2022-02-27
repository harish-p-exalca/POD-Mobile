import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ForgotPasswordComponent } from '../ForgotPassword/forgot-password/forgot-password.component';
import { ForgotPasswordModalComponent } from '../forgot-password-modal/forgot-password-modal.component';
import { ForgotPasswordOtpModalComponent } from '../forgot-password-otp-modal/forgot-password-otp-modal.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    FlexLayoutModule,
    HomePageRoutingModule
  ],
  declarations: [HomePage,ForgotPasswordModalComponent,ForgotPasswordOtpModalComponent],
  entryComponents:[ForgotPasswordModalComponent,ForgotPasswordOtpModalComponent]
})
export class HomePageModule {}
