import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {PopoverController, MenuController, Platform, ModalController} from '@ionic/angular';
import { StorageService } from '../services/storage.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DataService } from '../services/BehaviourSubject.service';
import { TokenResponse } from '../models/TokenResponse.model';
import { ChangePasswordComponent } from '../ChangePassword/change-password/change-password.component';
import { ToastMaker } from '../Toast/ToastMaker.service';
@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit {
  userdetails:TokenResponse;
  displayname:string="name";
  emailaddress:string="email";
  constructor(private router:Router, private dataservice:DataService,public popover:PopoverController,private platform:Platform,private storage:StorageService,
    public menuCtrl: MenuController, private toast:ToastMaker,private modalCtrl:ModalController) { 
     
    }

  ngOnInit() {
    this.dataservice.user.subscribe((data:TokenResponse)=>{
      if(data!=null){
       this.userdetails=data;
       if(this.userdetails.displayName!=null){
         this.displayname = this.userdetails.displayName;
       }
       if(this.userdetails.emailAddress!=null){
         this.emailaddress=this.userdetails.emailAddress;
       }
      }
 
   })
  }

 async onClickChangePassword(){ 
   this.popover.dismiss();
    const changepswd = await this.modalCtrl.create({
      component:ChangePasswordComponent,
      cssClass:"change-password",
      componentProps:{
        'username':this.userdetails.userName,
        'userid':this.userdetails.userID
      }
    })
   
  await changepswd.present();

  }
  onClickSignout(){
    this.storage.clear().then(() =>{
      this.toast.logoutOutSuccess();
      this.dataservice.SignedInUser(null);
      this.router.navigate(['/home']);
      this.popover.dismiss();
    });
  

  
  }

}
