import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { ForgotPasswordRequest } from '../models/ForgotPasswordRequest.model';

@Component({
  selector: 'app-forgot-password-modal',
  templateUrl: './forgot-password-modal.component.html',
  styleUrls: ['./forgot-password-modal.component.scss'],
})
export class ForgotPasswordModalComponent implements OnInit {

  emailform:FormGroup;
  submitted = false;
  constructor(private formBuilder: FormBuilder,private modalCtrl:ModalController) {
   
   }

  ngOnInit() {
    this.emailform = this.formBuilder.group({
      username:['',Validators.required],
      email: ['email', [Validators.required]]
    })
  }

  get f() { return this.emailform.controls; }

 async onClickSubmit(){
    this.submitted = true;

    // stop here if form is invalid
    if (this.emailform.invalid) {
        return;
    }
    else{
      let req:ForgotPasswordRequest = new ForgotPasswordRequest();
     let val:string = this.emailform.get("email").value;
    
    req.mode = val;
     req.UserName = this.emailform.get("username").value;

     console.log(req);
     
     await this.modalCtrl.dismiss({req});
    
    }
  }

}
