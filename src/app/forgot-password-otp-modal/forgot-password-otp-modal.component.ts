import { Component, OnInit, Inject, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ForgotPasswordOTP } from '../models/ForgotPasswordOTP.model';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastMaker } from '../Toast/ToastMaker.service';
import { Platform, NavParams, ModalController } from '@ionic/angular';
import { GetService } from '../services/getservice.service';
import { LoadingAnimation } from '../LoadingAnimation/LoadingAnimation.service';
import { OTPResponseBody } from '../models/OTPResponseBody.model';
import { AffrimativeOTPBody } from '../models/AffrimativeOTPBody.model';

@Component({
  selector: 'app-forgot-password-otp-modal',
  templateUrl: './forgot-password-otp-modal.component.html',
  styleUrls: ['./forgot-password-otp-modal.component.scss'],
})
export class ForgotPasswordOtpModalComponent implements OnInit {
  @Input() otpinfo: OTPResponseBody | string  ;
  otpform = new FormGroup({
    otp: new FormControl('', [Validators.required, Validators.maxLength(6)]),
    new_password: new FormControl('', [Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{6,15}$')]),
    conf_password: new FormControl('', Validators.required)

  });

  forgotpasswordotp: ForgotPasswordOTP = new ForgotPasswordOTP();
  constructor( private toast: ToastMaker,private modalCtrl:ModalController,public navParams: NavParams, private platform:Platform,private getservice: GetService, private loading: LoadingAnimation,
    ) {
    
   
    this.otpinfo = navParams.get('OTPinfo');
      console.log(this.otpinfo);
      
    
   
  }

  ngOnInit() {

  }

  get otp() {
    return this.otpform.get('otp')
  }

  onClickSubmit() {
    this.loading.presentLoading().then(() => {
      if(this.otpinfo.valueOf().hasOwnProperty('OTPtranID')){
      let otpbody:AffrimativeOTPBody = new AffrimativeOTPBody();
      otpbody.newPassword = this.otpform.get('new_password').value;
      otpbody.recievedOTP = this.otpform.get('otp').value;
      let d =  this.otpinfo.valueOf() as OTPResponseBody;
      otpbody.OTPTransID = d.OTPtranID;
      otpbody.UserGuid = d.UserGuid;
      this.getservice.changePasswordWithSMSOTP(otpbody).subscribe((kl)=>{
        this.loading.loadingController.dismiss().then(()=>{
         if(kl ==="Success"){
          this.toast.pwdchangedsuccess();
          this.modalCtrl.dismiss();
         }
         else{
           this.toast.MakeToast(kl+" Please try again");
           this.modalCtrl.dismiss();
         }
         
        },
        err =>{
          this.loading.loadingController.dismiss().then(()=>{
            if (err.status == 0) {
  
              this.toast.internetConnection();
            }
            else if (err.status == 400) {
              this.toast.IncorrectOTP();
              
            }
          })
         
        }
        )
        
      })
      }
      else{
        this.forgotpasswordotp.UserCode = this.otpinfo.valueOf().toString();
        this.forgotpasswordotp.NewPassword = this.otpform.get('new_password').value;
        this.forgotpasswordotp.OTP = this.otpform.get('otp').value;
        this.getservice.changePasswordUsingOTP(this.forgotpasswordotp).subscribe((z: any) => {
          this.toast.pwdchangedsuccess();
          this.modalCtrl.dismiss();
          this.loading.loadingController.dismiss()
           
          
        },
          catchError => {
            this.loading.loadingController.dismiss();
            console.log(catchError);
  
  
            if (catchError.status == 0) {
  
              this.toast.internetConnection();
            }
            else if (catchError.status == 400) {
              this.toast.IncorrectOTP();
            }
  
          }
        )
      }
      
    })




  }
}
