import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonSlides, MenuController, PopoverController, IonContent, Platform, ModalController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { TokenResponse } from '../models/TokenResponse.model';
import { InvoiceHeaderDetail } from '../models/InvoiceHeaderDetail.model';
import { LoadingController } from '@ionic/angular';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PendingdailogComponent } from '../pendingdailog/pendingdailog.component';
import { GetService } from '../services/getservice.service';
import { InvoiceUpdation1 } from '../models/InvoiceUpdation1.model';
import { PopoverComponent } from '../popover/popover.component';
import { DataService } from '../services/BehaviourSubject.service';
import { FilterComponent } from '../filter/filter.component';
import { invUpdateandformdata } from '../models/invUpdateandformdata.model';
import { LoadingAnimation } from '../LoadingAnimation/LoadingAnimation.service';
import { ToastMaker } from '../Toast/ToastMaker.service';
import { catchError } from 'rxjs/operators';
import { forkJoin, Observable, pipe } from 'rxjs';
import { StorageService } from '../services/storage.service';
import { async } from '@angular/core/testing';
import { FilterParam } from '../models/FilterParam.model';
import { FilterClass } from '../models/FilterClass.model';
import { PlantStructure } from '../models/PlantStruct.model';
import { Guid } from 'guid-typescript';
import { Organization } from '../models/Organization.model';
import { DirectiveAst } from '@angular/compiler';
import { CustomerGroup } from '../models/CustomerGroup.model';
@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.page.html',
  styleUrls: ['./invoice.page.scss'],
})
export class InvoicePage implements OnInit {

  approvedinvoicedata: InvoiceHeaderDetail[];
  pendinginvoicedata: InvoiceHeaderDetail[];
  partiallinvoicedata: InvoiceHeaderDetail[];
  filteredPendingInvoices: InvoiceHeaderDetail[];
  filteredApprovedInvoices: InvoiceHeaderDetail[];
  AllCustomerGroups: CustomerGroup[] = [];
  filteredPartiallyApprovedInvoices: InvoiceHeaderDetail[];
  invoiceupdation: InvoiceUpdation1 = new InvoiceUpdation1();
  segment: number = 1;
  AmFliterObj: FilterClass;
  switchFlag: boolean = false;
  filterdata: any ;
  filteredInvoices: InvoiceHeaderDetail[];
  InitFliterObj: FilterClass = new FilterClass();
  hideConfirm: false;
  reportdate: number;
  sliderOptions = { pager: true, autoHeight: true }
  dataFromDailog: invUpdateandformdata;
  ewaybillno: string = "";
  hidesearchstatus = "yes";
  pgno = 1;
  cpgno = 1;
  AllOrganizations: Organization[];
  userdetails: TokenResponse = new TokenResponse();
  @ViewChild('slides', { static: true }) slider: IonSlides;
  @ViewChild('pageTop') pageTop: IonContent;
  constructor(private loadingController: LoadingController, private modalCtrl: ModalController, private platform: Platform, private storage: StorageService, private toast: ToastMaker, private loading: LoadingAnimation, private dataservice: DataService, public popoverCtrl: PopoverController, public menuCtrl: MenuController, private router: Router, private dialog: MatDialog, private activatedRoute: ActivatedRoute, private getservice: GetService) {

    this.menuCtrl.enable(true)
    this.switchFlag = false;
  }

  ngOnInit() {





    this.userdetails = JSON.parse(this.activatedRoute.snapshot.paramMap.get('user_data'));
    this.segment = parseInt(this.activatedRoute.snapshot.paramMap.get('selected_id'));


    this.dataservice.SignedInUser(this.userdetails);


    this.getInvoices();

    if (this.userdetails.userRole == "Amararaja User") {
      this.getAllCustomerGroups(Guid.parse(this.userdetails.userID))
    }


  }

  getAllCustomerGroups(Userid: Guid) {
    this.getservice.GetAllCustomerGroupsByUserID(Userid).subscribe((data: CustomerGroup[]) => {
      this.AllCustomerGroups = data;
    })
  }

  getInitialInvoices(): Observable<any> {
    this.InitFliterObj.CurrentPage = 1;
    this.InitFliterObj.Records = 10;
    this.InitFliterObj.UserID = this.userdetails.userID;
    this.InitFliterObj.StartDate = null;
    this.InitFliterObj.EndDate = null;
    this.InitFliterObj.Organization = [];
    this.InitFliterObj.Division = [];
    this.InitFliterObj.PlantList = [];
    this.InitFliterObj.CustomerGroup = [];

    return this.userdetails.userRole != "Customer" ? forkJoin([this.getservice.getConfirmedInvoicesforAMuser(this.InitFliterObj), this.getservice.getPartialInvoicesforAMuser(this.InitFliterObj), this.getservice.getPendingInvoicesforAMuser(this.InitFliterObj)]) : forkJoin([this.getservice.getApprovedInvoice(this.userdetails.userCode, this.userdetails.userID, this.userdetails.userRole, "1", "10"), (this.getservice.getPartiallyConfirmedInvoice(this.userdetails.userCode, this.userdetails.userID, this.userdetails.userRole, "1", "10")), (this.getservice.getPendingInvoice(this.userdetails.userCode, this.userdetails.userID, this.userdetails.userRole, "1", "10"))])
  }
  getInvoices() {


    this.loading.presentLoading().then(async () => {





      this.getInitialInvoices().subscribe((y: any) => {
        console.log(y);
        this.pgno = 1;
        this.cpgno = 1;
        this.approvedinvoicedata = y[0];
        if (this.filteredInvoices == null) {
          this.filteredApprovedInvoices = y[0];
        }

        this.partiallinvoicedata = y[1];
        if (this.filteredPartiallyApprovedInvoices == null) {
          this.filteredPartiallyApprovedInvoices = y[1];
        }
        this.pendinginvoicedata = y[2];
        if (this.filteredInvoices == null) {
          this.filteredPendingInvoices = y[2];

        }
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


  loadMoreInvoices(event) {
    if (this.switchFlag) {
      this.pgno++;
      this.getAllInvoices_loadmore(this.userdetails.userCode, this.filterdata.status, this.filterdata.stdate, this.filterdata.enddate, this.filterdata.invno, this.filterdata.customername, this.filterdata.plant, this.userdetails.userID, this.userdetails.userRole, event)

    }
    else {
      this.pgno++;
      this.cpgno = this.pgno;
      if (this.userdetails.userRole != "Customer") {
        this.AmFliterObj = new FilterClass();

        this.AmFliterObj.CurrentPage = this.pgno;
        this.AmFliterObj.Records = 10;
        this.AmFliterObj.UserID = this.userdetails.userID;
        this.AmFliterObj.StartDate = null;
        this.AmFliterObj.EndDate = null;
        this.AmFliterObj.Organization = [];
        this.AmFliterObj.Division = [];
        this.AmFliterObj.PlantList = [];
        forkJoin([this.getservice.getConfirmedInvoicesforAMuser(this.AmFliterObj), this.getservice.getPartialInvoicesforAMuser(this.AmFliterObj), this.getservice.getPendingInvoicesforAMuser(this.AmFliterObj)]).subscribe(x => {
          if (x[2] != null) {
            this.filteredPendingInvoices.push(...x[2]);
            this.pendinginvoicedata = this.filteredApprovedInvoices;
          }
          if (x[0] != null) {
            this.filteredApprovedInvoices.push(...x[0]);
            this.approvedinvoicedata = this.filteredApprovedInvoices;
          }
          if (x[1] != null) {
            this.filteredPartiallyApprovedInvoices.push(...x[1]);
            this.partiallinvoicedata = this.filteredPartiallyApprovedInvoices
          }



          console.log(this.filteredPendingInvoices, this.filteredPendingInvoices, this.filteredApprovedInvoices);

          if (event) {
            event.target.complete();
          }
        })
      } else {
        forkJoin([this.getservice.getApprovedInvoice(this.userdetails.userCode, this.userdetails.userID, this.userdetails.userRole, this.pgno.toString(), "10"), (this.getservice.getPartiallyConfirmedInvoice(this.userdetails.userCode, this.userdetails.userID, this.userdetails.userRole, this.pgno.toString(), "10")), (this.getservice.getPendingInvoice(this.userdetails.userCode, this.userdetails.userID, this.userdetails.userRole, this.pgno.toString(), "10"))]).subscribe(x => {
          if (x[2] != null) {
            this.filteredPendingInvoices.push(...x[2]);
            this.pendinginvoicedata = this.filteredPendingInvoices;
          }
          if (x[0] != null) {
            this.filteredApprovedInvoices.push(...x[0]);
            this.approvedinvoicedata = this.filteredApprovedInvoices;
          }
          if (x[1] != null) {
            this.filteredPartiallyApprovedInvoices.push(...x[1]);
            this.partiallinvoicedata = this.filteredPartiallyApprovedInvoices;
          }



          //  console.log(this.filteredPendingInvoices,this.filteredPendingInvoices,this.filteredApprovedInvoices);

          if (event) {
            event.target.complete();
          }
        })
      }

    }

  }

  getAllInvoices_loadmore(usercode, status: string[], stdate: string, endate: string, invnum: string, custname: string, plant: string[], usrid: string, usrrole: string, event?: any) {

    if (usrrole == "Customer") {
      this.getservice.getFilteredInvoiceForUser(usercode, status[0], stdate, endate, invnum, usrrole).subscribe((data: any) => {
        this.filteredInvoices = data;
        console.log(data);
        this.filteredApprovedInvoices = [];
        this.filteredPartiallyApprovedInvoices = [];
        this.filteredPendingInvoices = [];
        this.filteredInvoices.forEach(z => {
          if (z.STATUS == "Confirmed") {
            this.filteredApprovedInvoices.push(z)
          }
          if (z.STATUS == "PartiallyConfirmed") {
            this.filteredPartiallyApprovedInvoices.push(z);
          }
          if (z.STATUS == "Saved" || z.STATUS == "Open") {
            this.filteredPendingInvoices.push(z);
          }
        })

        if (this.filteredApprovedInvoices.length == 0 && this.segment != 2) {
          this.filteredApprovedInvoices = this.approvedinvoicedata;

        }
        if (this.filteredPartiallyApprovedInvoices.length == 0 && this.segment != 1) {
          this.filteredPartiallyApprovedInvoices = this.partiallinvoicedata;

        }
        if (this.filteredPendingInvoices.length == 0 && this.segment != 0) {
          this.filteredPendingInvoices = this.pendinginvoicedata;

        }




        if (event) {
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
        });
    }
    else {
      let filterAmData = new FilterClass();
      filterAmData.CurrentPage = ++this.pgno;
      filterAmData.Records = 500;
      filterAmData.CustomerName = custname;
      filterAmData.PlantList = plant != null ? plant : [];

      filterAmData.InvoiceNumber = invnum;
      filterAmData.StartDate = stdate;
      filterAmData.EndDate = endate;
      filterAmData.UserID = this.userdetails.userID;
      console.log(filterAmData);

      let inv_cat = ""
      if (this.segment == 2) {
        filterAmData.Status = ["Confirmed"]
      }
      else if (this.segment == 1) {
        filterAmData.Status = ["PartiallyConfirmed"]
      }
      else {
        filterAmData.Status = status;
      }
      this.getservice.getFilteredInvoicesAMuser(filterAmData, inv_cat).subscribe((fd: InvoiceHeaderDetail[]) => {
        console.log(fd);
        if (fd != null) {
          if (this.segment == 2) {
            this.filteredApprovedInvoices.push(...fd)
          }
          else if (this.segment == 1) {
            this.filteredPartiallyApprovedInvoices.push(...fd);
          }
          else {
            this.filteredPendingInvoices.push(...fd);
          }
          if (event) {
            event.target.complete();
          }
        }
        else {
          if (event) {
            event.target.complete();
          }
        }



      },
        (catchError) => {



          if (catchError.status == 0) {

            this.toast.internetConnection();
          }
          else {
            this.toast.wentWrong();
          }
        }
      )
    }


  }

  getAllInvoices(usercode, status: string[], stdate: string, endate: string, invnum: string, custname: string, plant: string[], usrid: string, usrrole: string,orgs:any[],divs:any[]) {
    this.loading.presentChartAnimation().then(() => {
      if (usrrole == "Customer") {
        this.getservice.getFilteredInvoiceForUser(usercode, status[0], stdate, endate, invnum, usrrole).subscribe((data: any) => {
          this.filteredInvoices = data;
          console.log(data);
          this.filteredApprovedInvoices = [];
          this.filteredPartiallyApprovedInvoices = [];
          this.filteredPendingInvoices = [];
          this.filteredInvoices.forEach(z => {
            if (z.STATUS == "Confirmed") {
              this.filteredApprovedInvoices.push(z)
            }
            if (z.STATUS == "PartiallyConfirmed") {
              this.filteredPartiallyApprovedInvoices.push(z);
            }
            if (z.STATUS == "Saved" || z.STATUS == "Open") {
              this.filteredPendingInvoices.push(z);
            }
          })

          if (this.filteredApprovedInvoices.length == 0 && this.segment != 2) {
            this.filteredApprovedInvoices = this.approvedinvoicedata;
            this.loadingController.dismiss();
          }
          if (this.filteredPartiallyApprovedInvoices.length == 0 && this.segment != 1) {
            this.filteredPartiallyApprovedInvoices = this.partiallinvoicedata;
            this.loadingController.dismiss();
          }
          if (this.filteredPendingInvoices.length == 0 && this.segment != 0) {
            this.filteredPendingInvoices = this.pendinginvoicedata;
            this.loadingController.dismiss();
          }



          this.loading.loadingController.dismiss();

        },
          (catchError) => {

            this.loading.loadingController.dismiss();

            if (catchError.status == 0) {

              this.toast.internetConnection();
            }
            else {
              this.toast.wentWrong();
            }
          });
      }
      else {
        let filterAmData = new FilterClass();
        filterAmData.StartDate = stdate;
        filterAmData.EndDate = endate;
        filterAmData.Organization = orgs != null ? orgs : [];
        filterAmData.CustomerName = custname;
        filterAmData.PlantList = plant != null ? plant : [];
        filterAmData.Status = [];
        filterAmData.InvoiceNumber = invnum;
        filterAmData.Division = divs != null ? divs : [];
        filterAmData.UserID = this.userdetails.userID;
        filterAmData.CurrentPage = 1;
        filterAmData.Records = 500;
        filterAmData.CustomerGroup = this.filterdata.customergroup;

        let inv_cat = ""

        if (this.segment == 2) {
          filterAmData.Status = ["Confirmed"]
        }
        else if (this.segment == 1) {
          filterAmData.Status = ["PartiallyConfirmed"]
        }
        else {
          filterAmData.Status = [];
        }
        console.log(filterAmData);
        this.getservice.getFilteredInvoicesAMuser(filterAmData, inv_cat).subscribe((fd) => {
          console.log(fd);

          if (this.segment == 2) {
            this.filteredApprovedInvoices = []
            if (fd != null) {
              this.filteredApprovedInvoices.push(...fd)
            }

          }
          else if (this.segment == 1) {
            this.filteredPartiallyApprovedInvoices = []
            if (fd != null) {
              this.filteredPartiallyApprovedInvoices.push(...fd);
            }

          }
          else {
            this.filteredPendingInvoices = []
            if (fd != null) {
              this.filteredPendingInvoices.push(...fd);
            }

          }
          this.loading.loadingController.dismiss();





        },
          (catchError) => {

            this.loading.loadingController.dismiss();

            if (catchError.status == 0) {

              this.toast.internetConnection();
            }
            else {
              this.toast.wentWrong();
            }
          }
        )
      }
    })

  }


  async segmentChanged(ev: any) {
    await this.slider.slideTo(this.segment);
    this.pageTop.scrollToTop();
    if (this.segment == 0) {
      this.hidesearchstatus = "no";
    } else {
      this.hidesearchstatus = "yes";
    }


  }
  async slideChanged() {
    this.segment = await this.slider.getActiveIndex();
  }




  // 


  onClicknavigate(x, y: string) {
    this.loading.presentLoading().then(() => {
      try {

        this.router.navigate(['/description', JSON.stringify(this.userdetails), JSON.stringify(x), y]).then(() => {
          this.loading.loadingController.dismiss();
        })

      } catch (error) {
        this.loading.loadingController.dismiss().then(() => {
          this.toast.wentWrong()
        })
      }
    })




  }





  async OpenDialogModal(x: number, y: string, i: string, i_dt, l_dt) {
    let tempQty = 0;

    this.getservice.getItemQuanttity(x).subscribe(async (z: any) => {
      tempQty = z;


      const ConfirmInvoiceModal = await this.modalCtrl.create({
        component: PendingdailogComponent,
        cssClass: "Pending-Modal",
        componentProps: {
          'qnty': tempQty,
          'headerid': x,
          'createdby': y,
          'invoice_no': i,
          'i_dt': i_dt,
          'l_dt': l_dt
        }
      })


      await ConfirmInvoiceModal.present();
      const { data } = await ConfirmInvoiceModal.onWillDismiss();
      this.dataFromDailog = data;

      this.loading.presentLoading().then(() => {
        if (data != null) {
          this.invoiceupdation.HEADER_ID = x;
          this.invoiceupdation.VEHICLE_REPORTED_DATE = new Date(data.reportdate);
          console.log(this.invoiceupdation);

          //update invoice
          this.getservice.confirmInvoiceItems(this.invoiceupdation).subscribe((z: any) => {
            console.log(z);

            //upload files
            this.getservice.addInvoiceAttachment(this.dataFromDailog.files).subscribe((x: any) => {
              console.log(x);

              if (!this.dataFromDailog.isfileEmpty) {
                setTimeout(() => {
                  this.getAllInvoices(this.userdetails.userCode, [""], "", "", "", "", null, this.userdetails.userID, this.userdetails.userRole,[],[]);
                  this.loadingController.dismiss();
                  this.toast.itemDetailsUpdationSuccess();
                }, 2000)

              }



            },
              (catchError) => {
                this.loadingController.dismiss();


                if (catchError.status == 0) {

                  this.toast.internetConnection();
                }
                else {
                  this.toast.wentWrongWithUpdatingInvoices();
                }
              })

            if (this.dataFromDailog.isfileEmpty) {
              setTimeout(() => {
                this.getAllInvoices(this.userdetails.userName, [""], "", "", "", "", null, this.userdetails.userID, this.userdetails.userRole,[],[]);
                this.loadingController.dismiss();
                this.toast.itemDetailsUpdationSuccess();
              }, 2000)


            }



          },


            (catchError) => {
              this.loadingController.dismiss();


              if (catchError.status == 0) {

                this.toast.internetConnection();
              }
              else {
                this.toast.wentWrongWithUpdatingInvoices();
              }
            }


          )


        }
        else {
          this.loadingController.dismiss();
          this.toast.confirmationCancelled();
        }
      })



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





  async onClickFilterModal() {
    await this.loading.presentLoading();
    this.getservice.getPlantList().subscribe((g: PlantStructure[]) => {

      this.getservice.getAllOrganizations(Guid.parse(this.userdetails.userID)).subscribe((org: Organization[]) => {
        this.getservice.getAllDivisions().subscribe(async (divs: string[]) => {


          this.AllOrganizations = org;

          const filterModal = await this.modalCtrl.create({
            component: FilterComponent,
            cssClass: this.userdetails.userRole == "Customer" ? "filter-modal-Customer" : "filter-modal",

            componentProps: {
              'usr_role': this.userdetails.userRole,
              'hide_status': this.hidesearchstatus,
              'segment': this.segment,
              'PlantList': g,
              'OrganizationList': org,
              'Divisions': divs,
              'CustomerGroups': this.AllCustomerGroups
            }
          })
          await filterModal.present();
          const { data } = await filterModal.onWillDismiss();
          this.filterdata = data
          this.loading.presentLoading().then(() => {
            try {
              if (this.filterdata != null) {

                console.log(this.filterdata);
                this.pgno = 1;
                this.switchFlag = true;

                this.loadingController.dismiss();
                this.getAllInvoices(this.userdetails.userCode, this.filterdata.status, this.filterdata.stdate, this.filterdata.enddate, this.filterdata.invno, this.filterdata.customername, this.filterdata.plant, this.userdetails.userID, this.userdetails.userRole,this.filterdata.organization,this.filterdata.division)
              }
              else {
                this.switchFlag = false;
                this.pgno = this.cpgno
                this.loadingController.dismiss();
                this.filteredApprovedInvoices = this.approvedinvoicedata;
                this.filteredPendingInvoices = this.pendinginvoicedata;
                this.filteredPartiallyApprovedInvoices = this.partiallinvoicedata;
              }


            } catch (error) {

              this.loadingController.dismiss()

            }

          }



          )
        })
      })
    })
  }
}
