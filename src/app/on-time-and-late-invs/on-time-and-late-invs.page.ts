import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, IonSlides, MenuController, PopoverController, IonContent, Platform, ModalController, LoadingController } from '@ionic/angular';
import { forkJoin, Observable } from 'rxjs';
import { LateAndOnTimeFilterComponent } from '../late-and-on-time-filter/late-and-on-time-filter.component';
import { LoadingAnimation } from '../LoadingAnimation/LoadingAnimation.service';
import { FilterClass } from '../models/FilterClass.model';
import { FilterDataForOnTimeAndLate } from '../models/FilterDataForOnTimeAndLate.model';
import { InvoiceHeaderDetail } from '../models/InvoiceHeaderDetail.model';
import { PlantStructure } from '../models/PlantStruct.model';
import { TokenResponse } from '../models/TokenResponse.model';
import { PopoverComponent } from '../popover/popover.component';
import { DataService } from '../services/BehaviourSubject.service';
import { GetService } from '../services/getservice.service';
import { ToastMaker } from '../Toast/ToastMaker.service';
@Component({
  selector: 'app-on-time-and-late-invs',
  templateUrl: './on-time-and-late-invs.page.html',
  styleUrls: ['./on-time-and-late-invs.page.scss'],
})
export class OnTimeAndLateInvsPage implements OnInit {
  @ViewChild('slides', { static: true }) slider: IonSlides;
  @ViewChild('pageTop') pageTop: IonContent;
  sliderOptions = { pager: true, autoHeight: true }
  userdetails: TokenResponse = new TokenResponse();
  segment: number = 1;
  OnTimeInvoices: InvoiceHeaderDetail[];
  LateInvoices: InvoiceHeaderDetail[];
  FilterOnTimeInv:InvoiceHeaderDetail[];
  FilterLateInv:InvoiceHeaderDetail[];
  AmFliterObj:FilterClass;
  InitFliterObj:FilterClass = new FilterClass();
  filterdata:any;
  switchFlag:boolean = false; 
  pgno=1;
  cpgno=1;
  constructor(private activatedRoute: ActivatedRoute,private modalCtrl:ModalController ,public popoverCtrl: PopoverController,private dataservice: DataService,private getservice:GetService ,private loadingController: LoadingController, private toast: ToastMaker, private loading: LoadingAnimation,private router: Router) {
    
   }

  ngOnInit() {
    this.userdetails = JSON.parse(this.activatedRoute.snapshot.paramMap.get('user_data'));
    this.segment = parseInt(this.activatedRoute.snapshot.paramMap.get('selected_id'));
    this.dataservice.SignedInUser(this.userdetails);
    this.loading.presentLoading().then(async () => {

      this.getInitialInvoices().subscribe((x:any) => {
        this.pgno = 1;
    this.cpgno = 1;
        this.OnTimeInvoices = x[0];
        this.FilterOnTimeInv= x[0];
        console.log(this.OnTimeInvoices);

        this.LateInvoices = x[1];
        this.FilterLateInv = x[1];
        console.log(this.LateInvoices);

        this.segmentChanged(null);
        this.slideChanged();

        this.loadingController.getTop().then((has) => {
          if (has) {
            this.loadingController.dismiss();
          }
        })










      },
        (catchError) => {


          this.loadingController.getTop().then((has) => {
            if (has) {
              this.loadingController.dismiss();
            }
          })


          if (catchError.status == 0) {

            this.toast.internetConnection();


          }
          else {
            this.toast.wentWrong();


          }

        })

    })
  }

  getInitialInvoices():Observable<any>{
    this.InitFliterObj.CurrentPage = 1;
    this.InitFliterObj.Records = 10;
    this.InitFliterObj.UserID = this.userdetails.userID;
    this.InitFliterObj.StartDate = null;
    this.InitFliterObj.EndDate =null;
    this.InitFliterObj.Organization =[];
    this.InitFliterObj.Division =[];
    this.InitFliterObj.PlantList =[];
    this.InitFliterObj.CustomerGroup =[];
     
     
    return this.userdetails.userRole!="Customer"? forkJoin([this.getservice.getOnTimeInvoicesforAMuser(this.InitFliterObj),this.getservice.getLateInvoicesforAMuser(this.InitFliterObj)]):forkJoin([this.getservice.getOnTimeDeliveryInvoices(this.userdetails.userCode,this.userdetails.userID,this.userdetails.userRole,"","","","",1,(10).toString()),this.getservice.getLateDeliveryInvoices(this.userdetails.userCode,this.userdetails.userID,this.userdetails.userRole,"","","","",1,(10).toString())])
  }
  loadMoreInvoices(event){
if(this.switchFlag){
  this.pgno++;
this.flterInvcsLoadmore(event);
}
else{
  this.pgno++;
  console.log(this.pgno);
  
  this.cpgno = this.pgno;
  
  
  if(this.userdetails.userRole!="Customer"){
    this.AmFliterObj = new  FilterClass();
    this.AmFliterObj.CurrentPage = this.pgno;
    this.AmFliterObj.Records = 10;
    this.AmFliterObj.UserID = this.userdetails.userID;
    this.AmFliterObj.StartDate = null;
    this.AmFliterObj.EndDate =null;
    this.AmFliterObj.Organization =[];
    this.AmFliterObj.Division =[];
    this.AmFliterObj.PlantList =[];
    this.AmFliterObj.CustomerGroup =[];
    forkJoin([this.getservice.getOnTimeInvoicesforAMuser(this.AmFliterObj),this.getservice.getLateInvoicesforAMuser(this.AmFliterObj)]).subscribe((x)=>{
     console.log(x);
     
      if(x[0]!=null){
      this.FilterOnTimeInv.push(...x[0]);
      this.OnTimeInvoices = this.FilterOnTimeInv;
      }
      if(x[1]!=null){
      this.FilterLateInv.push(...x[1]);
      this.LateInvoices = this.FilterLateInv;
      }
      if(event){
        event.target.complete();
      }
    })
  }

  else{
    forkJoin([this.getservice.getOnTimeDeliveryInvoices(this.userdetails.userCode,this.userdetails.userID,this.userdetails.userRole,"","","","",this.pgno,(10).toString()),this.getservice.getLateDeliveryInvoices(this.userdetails.userCode,this.userdetails.userID,this.userdetails.userRole,"","","","",this.pgno,(10).toString())]).subscribe((x)=>{
      if(x[0]!=null){
        this.FilterOnTimeInv.push(...x[0]);
        this.OnTimeInvoices = this.FilterOnTimeInv;
      }
      if(x[1]!=null){
        this.FilterLateInv.push(...x[1]);
        this.FilterLateInv = this.LateInvoices;
      }
      if(event){
        event.target.complete();
      }
    })
  }
 
}
  }

  flterInvcsLoadmore(event?:any){
    
      
         if(this.filterdata!=undefined){
           if(this.segment==0){
          if(this.userdetails.userRole!="Customer"){
            this.AmFliterObj = new FilterClass();
            this.AmFliterObj.CurrentPage = this.pgno;
            
      this.AmFliterObj.Records = 50;
      this.AmFliterObj.UserID = this.userdetails.userID;
      this.AmFliterObj.StartDate = this.filterdata.st_date;
      this.AmFliterObj.EndDate =this.filterdata.end_date;
      this.AmFliterObj.Organization =this.filterdata.organization;
      this.AmFliterObj.Division =this.filterdata.division;
      this.AmFliterObj.PlantList =this.filterdata.plant!=null?this.filterdata.plant:[];
      this.AmFliterObj.CustomerGroup = [];
           this.getservice.getLateInvoicesforAMuser(this.AmFliterObj).subscribe((u:InvoiceHeaderDetail[])=>{
             console.log("this",u);
             
             if(u.length!=0){
              this.FilterLateInv=u
             }
             
             if(event){
              event.target.complete();
            }
           },
           
            (catchError) => {
    
    
             
              if(event){
                event.target.complete();
              }
    
              if (catchError.status == 0) {
    
                this.toast.internetConnection();
    
    
              }
              else {
                this.toast.wentWrong();
    
    
              }
    
            })
          }
          else{
            this.getservice.getLateDeliveryInvoices(this.userdetails.userCode,this.userdetails.userID,this.userdetails.userRole,this.filterdata.st_date,this.filterdata.end_date,this.filterdata.division,this.filterdata.organization,this.pgno,(50).toString()).subscribe((x:InvoiceHeaderDetail[])=>{
             if(x.length!=0){
              this.FilterLateInv =x;
             }
              console.log(this.FilterLateInv);
              if(event){
                event.target.complete();
              }
              
            },
            (catchError) => {
    
    
             
              if(event){
                event.target.complete();
              }
    
              if (catchError.status == 0) {
    
                this.toast.internetConnection();
    
    
              }
              else {
                this.toast.wentWrong();
    
    
              }
    
            })
          }
           }
           else{
             if(this.userdetails.userRole!='Customer'){
               this.AmFliterObj = new FilterClass();
              this.AmFliterObj.CurrentPage = this.pgno;
              
        this.AmFliterObj.Records = 50;
        this.AmFliterObj.UserID = this.userdetails.userID;
        this.AmFliterObj.StartDate = this.filterdata.st_date;
        this.AmFliterObj.EndDate =this.filterdata.end_date;
        this.AmFliterObj.Organization =this.filterdata.organization;
        this.AmFliterObj.Division =this.filterdata.division;
        this.AmFliterObj.PlantList =this.filterdata.plant!=null?this.filterdata.plant:[];
        this.AmFliterObj.CustomerGroup = [];
             this.getservice.getOnTimeInvoicesforAMuser(this.AmFliterObj).subscribe((u:InvoiceHeaderDetail[])=>{
               if(u.length!=0){
                this.FilterOnTimeInv=u
               }
               
               if(event){
                event.target.complete();
              }
             },
             
              (catchError) => {
      
      
               
      
      
                if (catchError.status == 0) {
      
                  this.toast.internetConnection();
      
      
                }
                else {
                  this.toast.wentWrong();
      
      
                }
      
              })
             }
             else{
              this.getservice.getOnTimeDeliveryInvoices(this.userdetails.userCode,this.userdetails.userID,this.userdetails.userRole,this.filterdata.st_date,this.filterdata.end_date,this.filterdata.division,this.filterdata.organization,this.pgno,(50).toString()).subscribe((x:InvoiceHeaderDetail[])=>{
                if(x.length!=0){
                  this.FilterOnTimeInv =x;
                }
                console.log(this.FilterOnTimeInv);
                
               
              },
              (catchError) => {
      
      
               
      
                if (catchError.status == 0) {
      
                  this.toast.internetConnection();
      
      
                }
                else {
                  this.toast.wentWrong();
      
      
                }
      
              })
             }
           
           }
         }
         else{
          
           this.FilterLateInv=this.LateInvoices;
           this.FilterOnTimeInv = this.OnTimeInvoices;
         }
      
  
    
  
  }

  async segmentChanged(ev: any) {
    await this.slider.slideTo(this.segment);
    this.pageTop.scrollToTop();
    // if(this.segment==0){
    //  this.hidesearchstatus="no";
    // }else{
    //   this.hidesearchstatus="yes";
    // }
    
    
  }
  async slideChanged() {
    this.segment = await this.slider.getActiveIndex();
  }

  onClicknavigate(x, y: string) {
    this.loading.presentLoading().then(()=>{
      try {
        
          this.router.navigate(['/description', JSON.stringify(this.userdetails), JSON.stringify(x), y]).then(()=>{
            this.loading.loadingController.dismiss();
          })
          
      } catch (error) {
        this.loading.loadingController.dismiss().then(()=>{
          this.toast.wentWrong()
        })
      }
    })
        
      
   

  }

  async onClickProfile(ev: any) {
    const popover = await this.popoverCtrl.create({
      component: PopoverComponent,
      event: ev,
      cssClass: 'popover',

      animated: true,
      showBackdrop: false
    });
    return await popover.present();
  }


   onClickFilterModal(){
    this.getservice.getPlantList().subscribe(async (g:PlantStructure[])=>{
      const filterModal = await this.modalCtrl.create({
        component:LateAndOnTimeFilterComponent,
        cssClass:"filter-ontimeandlate-modal",
        componentProps:{
          'usr_role':this.userdetails.userRole,
         
          'segment':this.segment,
          'plantlist':g
        }
      })
      await filterModal.present();
      const {data} = await filterModal.onWillDismiss();
      this.filterdata=data as FilterDataForOnTimeAndLate;
        console.log(this.filterdata);
        
     this.loading.presentLoading().then(() => {
      try {
         if(this.filterdata!=undefined){
           this.switchFlag = true;
           this.pgno = 1;
           if(this.segment==0){
          if(this.userdetails.userRole!="Customer"){
            this.AmFliterObj = new FilterClass();
            this.AmFliterObj.CurrentPage = this.pgno;
            
      this.AmFliterObj.Records = 50;
      this.AmFliterObj.UserID = this.userdetails.userID;
      this.AmFliterObj.StartDate = this.filterdata.st_date;
      this.AmFliterObj.EndDate =this.filterdata.end_date;
      this.AmFliterObj.Organization =this.filterdata.organization;
      this.AmFliterObj.Division =this.filterdata.division;
      this.AmFliterObj.PlantList =this.filterdata.plant!=null?this.filterdata.plant:[];
      this.AmFliterObj.CustomerGroup = [];
           this.getservice.getLateInvoicesforAMuser(this.AmFliterObj).subscribe(u=>{
             console.log(u);
             
             this.FilterLateInv=u
             this.loadingController.dismiss();
           },
           
            (catchError) => {
    
    
              this.loadingController.getTop().then((has) => {
                if (has) {
                  this.loadingController.dismiss();
                }
              })
    
    
              if (catchError.status == 0) {
    
                this.toast.internetConnection();
    
    
              }
              else {
                this.toast.wentWrong();
    
    
              }
    
            })
          }
          else{
            this.getservice.getLateDeliveryInvoices(this.userdetails.userCode,this.userdetails.userID,this.userdetails.userRole,this.filterdata.st_date,this.filterdata.end_date,this.filterdata.division,this.filterdata.organization,1,(50).toString()).subscribe((x:InvoiceHeaderDetail[])=>{
              this.FilterLateInv =x;
              console.log(this.FilterLateInv);
              
              this.loadingController.dismiss();
            },
            (catchError) => {
    
    
              this.loadingController.getTop().then((has) => {
                if (has) {
                  this.loadingController.dismiss();
                }
              })
    
    
              if (catchError.status == 0) {
    
                this.toast.internetConnection();
    
    
              }
              else {
                this.toast.wentWrong();
    
    
              }
    
            })
          }
           }
           else{
             if(this.userdetails.userRole!='Customer'){
               this.AmFliterObj = new FilterClass();
              this.AmFliterObj.CurrentPage = 1;
              
        this.AmFliterObj.Records = 50;
        this.AmFliterObj.UserID = this.userdetails.userID;
        this.AmFliterObj.StartDate = this.filterdata.st_date;
        this.AmFliterObj.EndDate =this.filterdata.end_date;
        this.AmFliterObj.Organization =this.filterdata.organization;
        this.AmFliterObj.Division =this.filterdata.division;
        this.AmFliterObj.PlantList =this.filterdata.plant!=null?this.filterdata.plant:[];
        this.AmFliterObj.CustomerGroup =[];
             this.getservice.getOnTimeInvoicesforAMuser(this.AmFliterObj).subscribe(u=>{
               this.FilterOnTimeInv=u
               this.loadingController.dismiss();
             },
             
              (catchError) => {
      
      
                this.loadingController.getTop().then((has) => {
                  if (has) {
                    this.loadingController.dismiss();
                  }
                })
      
      
                if (catchError.status == 0) {
      
                  this.toast.internetConnection();
      
      
                }
                else {
                  this.toast.wentWrong();
      
      
                }
      
              })
             }
             else{
              this.getservice.getOnTimeDeliveryInvoices(this.userdetails.userCode,this.userdetails.userID,this.userdetails.userRole,this.filterdata.st_date,this.filterdata.end_date,this.filterdata.division,this.filterdata.organization,1,(50).toString()).subscribe((x:InvoiceHeaderDetail[])=>{
                this.FilterOnTimeInv =x;
                console.log(this.FilterOnTimeInv);
                
                this.loadingController.dismiss();
              },
              (catchError) => {
      
      
                this.loadingController.getTop().then((has) => {
                  if (has) {
                    this.loadingController.dismiss();
                  }
                })
      
      
                if (catchError.status == 0) {
      
                  this.toast.internetConnection();
      
      
                }
                else {
                  this.toast.wentWrong();
      
      
                }
      
              })
             }
           
           }
         }
         else{
           this.switchFlag = false;
           this.pgno = this.cpgno;
          this.loadingController.dismiss();
           this.FilterLateInv=this.LateInvoices;
           this.FilterOnTimeInv = this.OnTimeInvoices;
         }
      } catch (error) {
        
       this.loadingController.dismiss()
       
      }
  
    }
  
  
  
    )
    })
   
  }

}




