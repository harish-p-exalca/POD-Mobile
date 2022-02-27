import { Component, OnInit, Injectable, Inject, Input, ElementRef, ViewChild } from '@angular/core';
import { Plugins, CameraResultType, CameraSource, Camera, Filesystem } from '@capacitor/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { StorageService } from '../services/storage.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GetService } from '../services/getservice.service';
import { invUpdateandformdata } from '../models/invUpdateandformdata.model';
import { Platform, NavParams, ModalController } from '@ionic/angular';
import {FileChooser} from '@ionic-native/file-chooser/ngx'
import {FilePath} from '@ionic-native/file-path/ngx'
import { ToastMaker } from '../Toast/ToastMaker.service';
import { async } from 'rxjs/internal/scheduler/async';

import { WebView } from '@ionic-native/ionic-webview/ngx';
import { Base64 } from '@ionic-native/base64/ngx';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-pendingdailog',
  templateUrl: './pendingdailog.component.html',
  styleUrls: ['./pendingdailog.component.scss'],
})
export class PendingdailogComponent implements OnInit {
  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;
  image;
  photo: SafeResourceUrl;
 @Input() qnty: number;
 @Input() headerid: number;
  i = 0;
  j = 0;
  mimetype:string;
  submitclicked=false;
 
  attchReq = true;
 @Input() inv_no:string;
 @Input() createdby: string;
 @Input() l_dt:string;
 @Input() i_dt:string;
 current_date = new Date();
 dtpipe:DatePipe;
 mindate:string;
 maxdate:string;
  isfileempty=true;
  form: FormData = new FormData();
  returndata: invUpdateandformdata = new invUpdateandformdata();
  constructor(private sanitizer: DomSanitizer,private base64: Base64,private webview: WebView,private toast:ToastMaker,private filechooser:FileChooser,private filepath:FilePath ,private modalCtrl:ModalController,private navParam:NavParams) {
    this.qnty = this.navParam.get('qnty');
    this.rcvdqnty = this.qnty;
    this.headerid = this.navParam.get('headerid');
    this.createdby = this.navParam.get('createdby');
    this.inv_no = this.navParam.get('invoice_no');
    console.log(this.inv_no);
    this.l_dt= (this.navParam.get('l_dt'));
    this.i_dt= (this.navParam.get('i_dt'));
    if(this.l_dt === null){
      this.mindate=this.i_dt.slice(0,10);

    }
    else{
    this.mindate=this.l_dt.slice(0,10);
    }
    // console.log(this.current_date);
    this.dtpipe= new DatePipe('en-US');
    this.maxdate = this.dtpipe.transform(this.current_date,'yyyy-MM-dd');
    console.log(this.maxdate);
    
  }
  selectedFile: File;
  filename: string = "No file";
  a: string = "No";
  reportdate: string = "";
  rcvdqnty: number;
  ngOnInit(): void { 
    
   
  }

 

  async clickPicture() { 
    this.isfileempty = true;
   const image = await Plugins.Camera.getPhoto({
      quality: 100,
      
      allowEditing: false,
      
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
    })
    // let blob = b64toBlob(contents.data, "image/jpg", 512);
    console.log(image);
    
     this.form = new FormData();
     this.photo = this.sanitizer.bypassSecurityTrustResourceUrl(image && (image.webPath));
    
    
     const blob = await fetch(image.webPath).then(r=>r.blob())
      
      this.form.append('cam' +this.inv_no+'.png',blob,'cam' +this.inv_no+'.png');
      console.log(blob);
      this.filename="No file"
      this.i=1
       this.a = JSON.stringify(this.i);
       this.isfileempty = false;
      // POST formData call
      this.returndata.isfileEmpty = false;
   
     
   
    
    
    

  }
  
   


onFileChanged(event: EventTarget) {
  this.isfileempty = true;
  const eventObj: MSInputMethodContext = event as MSInputMethodContext;
  const target: HTMLInputElement = eventObj.target as HTMLInputElement;
  this.selectedFile = target.files[0] ;
  console.log(this.selectedFile);
  let splitfortype = this.selectedFile.name.split('.')
  let type = splitfortype[splitfortype.length-1];
  if(type == 'png' || type == 'jpg' || type == 'jpeg' || type == 'pdf'){
    this.form= new FormData();
    this.form.append(this.selectedFile.name,this.selectedFile,this.selectedFile.name);
    this.filename=this.selectedFile.name.substring(0,12);    
    this.toast.fileExt(this.selectedFile.name);
    console.log(this.form.get(this.selectedFile.name));
    this.i=0
    this.a = JSON.stringify(this.i);
    this.returndata.isfileEmpty = false;
    
     this.isfileempty = false;
    
  }
  else{
    this.isfileempty = true;
    this.toast.InvaldFileExt();
  }
  
}

  save() {
    this.submitclicked=true
    
    
     if(this.reportdate!="" && !this.isfileempty){
      this.form.append('HeaderID', this.headerid.toString());
      this.form.append('CreatedBy', this.createdby);
      this.returndata.files = this.form;
      this.returndata.reportdate = this.reportdate;
      // this.dialogRef.close(this.returndata);
      this.modalCtrl.dismiss(this.returndata);
     }
     else{
      if(this.isfileempty){
        this.toast.fileUploadEmpty();
       }
     }
   


  }

}
