import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {ChartsModule} from 'ng2-charts';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PendingdailogComponent } from './pendingdailog/pendingdailog.component';
import { DescriptiondailogComponent } from './descriptiondailog/descriptiondailog.component';
import { PopoverComponent } from './popover/popover.component';
import { FilterComponent } from './filter/filter.component';
import { AuthGuardService } from './services/AuthGuardService.service';
import { JwtModule } from "@auth0/angular-jwt";
import { AuthGuard } from './auth.guard';
import { AuthService } from './services/AuthService.service';
import { MaterialModule } from './material/material.module';
import { ChangePasswordComponent } from './ChangePassword/change-password/change-password.component';
import {ForgotPasswordComponent} from './ForgotPassword/forgot-password/forgot-password.component'
import {ForgotPasswordOTPComponent} from './ForgotPassword/forgot-password-otp/forgot-password-otp.component'
import {FileChooser} from '@ionic-native/file-chooser/ngx'
import {FilePath} from '@ionic-native/file-path/ngx'
import {File} from '@ionic-native/file/ngx'
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { Base64 } from '@ionic-native/base64/ngx';
import { FilterCustomerGroupsPipe } from './services/FilterCustomerGroupPipe.service';

@NgModule({
  declarations: [AppComponent,PendingdailogComponent,DescriptiondailogComponent,PopoverComponent,ChangePasswordComponent,ForgotPasswordComponent,ForgotPasswordOTPComponent],
  entryComponents: [PendingdailogComponent,DescriptiondailogComponent,PopoverComponent,ChangePasswordComponent,ForgotPasswordComponent,ForgotPasswordOTPComponent],
  imports: [BrowserModule, MaterialModule,ReactiveFormsModule,FormsModule,IonicModule.forRoot(),AppRoutingModule,FlexLayoutModule,HttpClientModule,ChartsModule, BrowserAnimationsModule],
  providers: [
    StatusBar,
    SplashScreen,
    AuthGuard,
    AuthService,
    FileChooser,
    FilePath,
    WebView,
    File,
    Base64,
    { provide: RouteReuseStrategy,useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
