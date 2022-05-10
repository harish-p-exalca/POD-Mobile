import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, IonSlides, MenuController, PopoverController, IonContent, Platform, ModalController, LoadingController } from '@ionic/angular';
import { forkJoin, Observable } from 'rxjs';
import { LateAndOnTimeFilterComponent } from '../late-and-on-time-filter/late-and-on-time-filter.component';
import { LoadingAnimation } from '../LoadingAnimation/LoadingAnimation.service';
import { FilterClass } from '../models/FilterParam.model';
import { FilterDataForOnTimeAndLate } from '../models/FilterDataForOnTimeAndLate.model';
import { InvoiceHeaderDetail } from '../models/InvoiceHeaderDetail.model';
import { PlantStructure } from '../models/PlantStruct.model';
import { TokenResponse } from '../models/TokenResponse.model';
import { PopoverComponent } from '../popover/popover.component';
import { DataService } from '../services/BehaviourSubject.service';
import { GetService } from '../services/getservice.service';
import { ToastMaker } from '../Toast/ToastMaker.service';
import { SharedParameterService } from '../services/shared-parameter.service';
import { FilterComponent } from '../filter/filter.component';
import { Guid } from 'guid-typescript';
import { Organization } from '../models/Organization.model';
import { CustomerGroup } from '../models/CustomerGroup.model';
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
  FilterOnTimeInv: InvoiceHeaderDetail[];
  FilterLateInv: InvoiceHeaderDetail[];
  AllCustomerGroups: CustomerGroup[] = [];
  AmFliterObj: FilterClass;
  InitFliterObj: FilterClass = new FilterClass();
  filterdata: any;
  switchFlag: boolean = false;
  pgno = 1;
  cpgno = 1;
  constructor(
    private activatedRoute: ActivatedRoute,
    private modalCtrl: ModalController,
    public popoverCtrl: PopoverController,
    private dataservice: DataService,
    private getservice: GetService,
    private loadingController: LoadingController,
    private toast: ToastMaker,
    private loading: LoadingAnimation,
    private router: Router,
    private sharedParam: SharedParameterService
  ) {

  }

  ngOnInit() {
    this.userdetails = JSON.parse(this.activatedRoute.snapshot.paramMap.get('user_data'));
    this.segment = parseInt(this.activatedRoute.snapshot.paramMap.get('selected_id'));
    this.dataservice.SignedInUser(this.userdetails);
    this.segmentChanged(null);
    this.slideChanged();
    this.getFilteredInvoices(this.sharedParam.GetChartFilterData());
    if (this.userdetails.userRole == "Amararaja User") {
      this.getAllCustomerGroups(Guid.parse(this.userdetails.userID))
    }
  }

  getAllCustomerGroups(Userid: Guid) {
    this.getservice.GetAllCustomerGroupsByUserID(Userid).subscribe((data: CustomerGroup[]) => {
      this.AllCustomerGroups = data;
    });
  }

  ionViewWillEnter(){
    
  }

  getFilteredInvoices(filterClass: FilterClass) {
    filterClass.LeadTime=[];
    filterClass.Status=[];
    if (this.segment == 0) {
      filterClass.Status = [];
      filterClass.Delivery = ["late"]
    }
    else if (this.segment == 1) {
      filterClass.Status = [];
      filterClass.Delivery = ["ontime"]
    }
    filterClass.UserCode = this.userdetails.userCode;
    filterClass.UserID = this.userdetails.userID;
    filterClass.CurrentPage = 1;
    filterClass.Records = 10;
    this.loading.presentLoading().then(async () => {
      this.getservice.FilterInvoiceData(filterClass, this.userdetails.userRole).subscribe(data => {
        console.log("filtered data", data);
        if (this.segment == 0) {
          this.FilterLateInv = data;
        }
        else if (this.segment == 1) {
          this.FilterOnTimeInv = data;
        }
        this.loadingController.getTop().then((has) => {
          if (has) {
            this.closeLoader();
          }
        });
      },
        (catchError) => {
          this.loadingController.getTop().then((has) => {
            if (has) {
              this.closeLoader();
            }
          });
          if (catchError.status == 0) {
            this.toast.internetConnection();
          }
          else {
            this.toast.wentWrong();
          }
        });
    });
  }

  async segmentChanged(ev: any) {
    await this.slider.slideTo(this.segment);
    this.pageTop.scrollToTop();
    var filterData = this.sharedParam.GetChartFilterData();
    this.getFilteredInvoices(filterData);
  }
  async slideChanged() {
    this.segment = await this.slider.getActiveIndex();
  }

  onClicknavigate(x, y: string) {
    this.loading.presentLoading().then(() => {
      try {

        this.router.navigate(['/description', JSON.stringify(this.userdetails), JSON.stringify(x), y]).then(() => {
          this.loading.loadingController.dismiss();
        });

      } catch (error) {
        this.loading.loadingController.dismiss().then(() => {
          this.toast.wentWrong()
        });
      }
    });

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


  async onClickFilterModal() {
    await this.loading.presentLoading();
    this.getservice.getPlantList().subscribe((g: PlantStructure[]) => {
      this.getservice.getAllOrganizations(Guid.parse(this.userdetails.userID)).subscribe((org: Organization[]) => {
        this.getservice.getAllDivisions().subscribe(async (divs: string[]) => {
          // this.AllOrganizations = org;
          const filterModal = await this.modalCtrl.create({
            component: FilterComponent,
            cssClass: this.userdetails.userRole == "Customer" ? "filter-modal-Customer" : "filter-modal",
            componentProps: {
              'usr_role': this.userdetails.userRole,
              'hide_status': true,
              'segment': this.segment,
              'PlantList': g,
              'OrganizationList': org,
              'Divisions': divs,
              'CustomerGroups': this.AllCustomerGroups,
              'isFromCharts': false,
              'filterData': this.sharedParam.GetChartFilterData()
            }
          });
          await filterModal.present();
          const { data } = await filterModal.onWillDismiss();
          this.filterdata = data
          this.loading.presentLoading().then(() => {
            try {
              if (this.filterdata != null) {
                this.getFilteredInvoices(this.filterdata);
                this.closeLoader();
              }
              else {
                this.closeLoader();
              }
            } catch (error) {
              this.closeLoader();
            }
          });
        });
      });
    });
  }
  async closeLoader() {
    // Instead of directly closing the loader like below line
    // return await this.loadingController.dismiss();
	
    this.checkAndCloseLoader();
	
	// sometimes there's delay in finding the loader. so check if the loader is closed after one second. if not closed proceed to close again
    setTimeout(() => this.checkAndCloseLoader(), 1000);
    
  }

  async checkAndCloseLoader() {
   // Use getTop function to find the loader and dismiss only if loader is present.
   const loader = await this.loadingController.getTop();
   // if loader present then dismiss
    if(loader !== undefined) { 
      await this.loadingController.dismiss();
    }
  }
}




