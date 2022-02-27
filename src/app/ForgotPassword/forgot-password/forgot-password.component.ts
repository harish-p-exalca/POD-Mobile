import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { DescriptiondailogComponent } from 'src/app/descriptiondailog/descriptiondailog.component';
import { Platform } from '@ionic/angular';


@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  emailform:FormGroup;
  submitted = false;
  constructor(private formBuilder: FormBuilder,private platform:Platform,private dialogRef: MatDialogRef<DescriptiondailogComponent>) {
   
   }

  ngOnInit() {
    this.emailform = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    })
  }

  get f() { return this.emailform.controls; }

  onClickSubmit(){
    this.submitted = true;

    // stop here if form is invalid
    if (this.emailform.invalid) {
        return;
    }
    else{
     
      this.dialogRef.close(this.emailform.get('email').value);
    
    }
  }
  
}

