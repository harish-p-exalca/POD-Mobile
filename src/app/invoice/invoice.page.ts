import {
  AfterContentInit,
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
} from "@angular/core";
import {
  AlertController,
  IonSlides,
  MenuController,
  PopoverController,
  IonContent,
  Platform,
  ModalController,
} from "@ionic/angular";
import { Router, ActivatedRoute } from "@angular/router";
import {
  ChangesDetected,
  TokenResponse,
  UserActionHistory,
} from "../models/TokenResponse.model";
import { InvoiceHeaderDetail } from "../models/InvoiceHeaderDetail.model";
import { LoadingController } from "@ionic/angular";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { PendingdailogComponent } from "../pendingdailog/pendingdailog.component";
import { GetService } from "../services/getservice.service";
import { InvoiceUpdation1 } from "../models/InvoiceUpdation1.model";
import { PopoverComponent } from "../popover/popover.component";
import { DataService } from "../services/BehaviourSubject.service";
import { FilterComponent } from "../filter/filter.component";
import { invUpdateandformdata } from "../models/invUpdateandformdata.model";
import { LoadingAnimation } from "../LoadingAnimation/LoadingAnimation.service";
import { ToastMaker } from "../Toast/ToastMaker.service";
import { catchError } from "rxjs/operators";
import { forkJoin, Observable, pipe } from "rxjs";
import { StorageService } from "../services/storage.service";
import { async } from "@angular/core/testing";
import { FilterClass, FilterParam } from "../models/FilterParam.model";
import { PlantStructure } from "../models/PlantStruct.model";
import { Guid } from "guid-typescript";
import { Organization } from "../models/Organization.model";
import { DirectiveAst } from "@angular/compiler";
import { CustomerGroup } from "../models/CustomerGroup.model";
import { SharedParameterService } from "../services/shared-parameter.service";
@Component({
  selector: "app-invoice",
  templateUrl: "./invoice.page.html",
  styleUrls: ["./invoice.page.scss"],
})
export class InvoicePage implements OnInit {
  FilteredInvoices: InvoiceHeaderDetail[] = [];
  Plants = [];
  Organizations = [];
  Divisions = [];
  CustomerGroups: CustomerGroup[] = [];
  filterdata: FilterClass = new FilterClass();
  isLoadMore: boolean = false;
  invoiceupdation: InvoiceUpdation1 = new InvoiceUpdation1();

  userdetails: TokenResponse = new TokenResponse();
  @ViewChild("slides", { static: true }) slider: IonSlides;
  @ViewChild("pageTop") pageTop: IonContent;
  currentPage: number = 1;
  constructor(
    private loadingController: LoadingController,
    private modalCtrl: ModalController,
    private platform: Platform,
    private storage: StorageService,
    private toast: ToastMaker,
    private loading: LoadingAnimation,
    private dataservice: DataService,
    public popoverCtrl: PopoverController,
    public menuCtrl: MenuController,
    private router: Router,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private getservice: GetService,
    private sharedParam: SharedParameterService
  ) {
    this.menuCtrl.enable(true);
  }

  ngOnInit() {
    this.userdetails = JSON.parse(
      this.activatedRoute.snapshot.paramMap.get("user_data")
    );
    this.dataservice.SignedInUser(this.userdetails);
    if (this.sharedParam.IsInvoiceFilterData) {
      this.filterdata = new FilterClass();
      this.filterdata = Object.assign(
        {},
        this.sharedParam.GetInvoiceFilterData()
      );
    } else {
      this.filterdata = new FilterClass();
      this.filterdata = Object.assign(
        {},
        this.sharedParam.GetChartFilterData()
      );
      if (
        this.filterdata.Status.length == 0 &&
        this.filterdata.Delivery.length == 0
      ) {
        this.filterdata.Status = ["Open"];
      }
    }
    this.Plants = this.sharedParam.Plants;
    this.Organizations = this.sharedParam.Organizations;
    this.Divisions = this.sharedParam.Divisions;
    this.CustomerGroups = this.sharedParam.CustomerGroups;
    console.log("Filter data", this.filterdata);
    this.getFilteredInvoices(this.filterdata);
  }

  ionViewWillEnter() {}

  getFilteredInvoices(filterClass: FilterClass) {
    filterClass.UserCode = this.userdetails.userCode;
    filterClass.UserID = this.userdetails.userID;
    filterClass.CurrentPage = this.currentPage;
    filterClass.Records = 20;
    this.loading.presentLoading().then(async () => {
      this.getservice
        .FilterInvoiceData(filterClass, this.userdetails.userRole)
        .subscribe(
          (data) => {
            if (this.isLoadMore) {
              this.FilteredInvoices.push(...data);
              this.isLoadMore = false;
            } else {
              this.FilteredInvoices = data;
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
            } else {
              this.toast.wentWrong();
            }
          }
        );
    });
  }

  onClicknavigate(x, y: string) {
    this.loading.presentLoading().then(() => {
      try {
        this.router
          .navigate([
            "/description",
            JSON.stringify(this.userdetails),
            JSON.stringify(x),
            y,
          ])
          .then(() => {
            this.loading.loadingController.dismiss();
          });
      } catch (error) {
        this.loading.loadingController.dismiss().then(() => {
          this.toast.wentWrong();
        });
      }
    });
  }

  async OpenDialogModal(
    HeaderID: number,
    CreatedBy: string,
    InvNo: string,
    InvDate,
    LRDate,
    vehicleReportedDate,
    status,
    ind,
    isReConfirm: boolean = false,
    isWithOutDoc: boolean = false
  ) {
    const ConfirmInvoiceModal = await this.modalCtrl.create({
      component: PendingdailogComponent,
      cssClass: "Pending-Modal",
      componentProps: {
        headerid: HeaderID,
        createdby: CreatedBy,
        invoice_no: InvNo,
        i_dt: InvDate,
        l_dt: LRDate,
        vehicleReportedDate: vehicleReportedDate,
        isReConfirm: isReConfirm,
      },
    });
    await ConfirmInvoiceModal.present();
    const data = await ConfirmInvoiceModal.onWillDismiss();
    this.storage.getObject("signedUser").then((res) => {
      this.loading.presentLoading().then(() => {
        if (data["data"] != null) {
          this.invoiceupdation.HEADER_ID = HeaderID;
          this.invoiceupdation.VEHICLE_REPORTED_DATE = new Date(
            data["data"].reportdate
          );
          console.log("Invoice updation", this.invoiceupdation);
          const Changes = new ChangesDetected();
          Changes.Status =
            status != "confirmed" ? status + " to Confirmed" : status;
          Changes.UnloadedDate = data["data"].reportdate;
          Changes.DocumentUpload = data["role"];
          const ActionLog = new UserActionHistory();
          ActionLog.Action = "Mobile";
          ActionLog.ChangesDetected = JSON.stringify(Changes);
          ActionLog.DateTime = new Date();
          ActionLog.IpAddress = res["ipAddress"] ? res["ipAddress"] : "";
          ActionLog.Location = res["geoLocation"] ? res["geoLocation"] : "";
          ActionLog.TransID = this.FilteredInvoices[ind].HEADER_ID;
          ActionLog.UserName = res["userName"];
          if (isReConfirm) {
            this.getservice.addInvoiceAttachment(data["data"].files).subscribe(
              (x: any) => {
                console.log("Document uploaded successfully", x);
                this.getservice
                  .CreateUserActionHistory(ActionLog)
                  .subscribe(() => {});
                setTimeout(() => {
                  this.getFilteredInvoices(this.filterdata);
                  this.closeLoader();
                  this.toast.ReConfirmSuccess();
                }, 2000);
              },
              (catchError) => {
                this.closeLoader();
                if (catchError.status == 0) {
                  this.toast.internetConnection();
                } else {
                  this.toast.wentWrongWithUpdatingInvoices();
                }
              }
            );
          } else {
            //update invoice
            if (
              this .invoiceupdation.VEHICLE_REPORTED_DATE != null &&
              !this.invoiceupdation.VEHICLE_REPORTED_DATE.toString().includes(
                "1970"
              )
            ) {
              this.getservice
                .addInvoiceAttachment(data["data"].files)
                .subscribe(
                  (x: any) => {
                    this.getservice
                      .confirmInvoiceItems(this.invoiceupdation)
                      .subscribe(
                        (z: any) => {
                          this.getservice
                            .CreateUserActionHistory(ActionLog)
                            .subscribe(() => {});
                          this.getFilteredInvoices(this.filterdata);
                          this.closeLoader();
                          this.toast.itemDetailsUpdationSuccess();
                        },
                        (catchError) => {
                          this.closeLoader();
                          if (catchError.status == 0) {
                            this.toast.internetConnection();
                          } else {
                            this.toast.wentWrongWithUpdatingInvoices();
                          }
                        }
                      );
                  },
                  (catchError) => {
                    this.closeLoader();
                    if (catchError.status == 0) {
                      this.toast.internetConnection();
                    } else {
                      this.toast.wentWrongWithUpdatingInvoices();
                    }
                  }
                );
            }
            else {
              this.toast.wrongVehicleUnloadedDate();
            }
          }
        } else {
          this.closeLoader();
          this.toast.confirmationCancelled();
        }
      });
    });
  }

  async ConfirmQty(i) {
    this.storage.getObject("signedUser").then((res) => {
      this.invoiceupdation.HEADER_ID = this.FilteredInvoices[i].HEADER_ID;
      this.invoiceupdation.VEHICLE_REPORTED_DATE = new Date(
        this.FilteredInvoices[i].VEHICLE_REPORTED_DATE
      );
      console.log("Invoice updation", this.invoiceupdation);
      const Changes = new ChangesDetected();
      Changes.Status =
        this.FilteredInvoices[i].STATUS != "confirmed"
          ? this.FilteredInvoices[i].STATUS + " to Confirmed"
          : this.FilteredInvoices[i].STATUS;
      Changes.UnloadedDate = this.FilteredInvoices[i].VEHICLE_REPORTED_DATE;
      // Changes.DocumentUpload = data['role'];
      const ActionLog = new UserActionHistory();
      ActionLog.Action = "Mobile";
      ActionLog.ChangesDetected = JSON.stringify(Changes);
      ActionLog.DateTime = new Date();
      ActionLog.IpAddress = res["ipAddress"] ? res["ipAddress"] : "";
      ActionLog.Location = res["geoLocation"] ? res["geoLocation"] : "";
      ActionLog.TransID = this.FilteredInvoices[i].HEADER_ID;
      ActionLog.UserName = res["userName"];
      if (
        this.invoiceupdation.VEHICLE_REPORTED_DATE != null &&
        !this.invoiceupdation.VEHICLE_REPORTED_DATE.toString().includes("1970")
      ) {
        this.getservice
          .confirmInvoiceItems(this.invoiceupdation)
          .subscribe((z: any) => {
            this.getservice
              .CreateUserActionHistory(ActionLog)
              .subscribe(() => {});
            this.getFilteredInvoices(this.filterdata);
          });
      }
    });
  }

  async onClickProfile(ev: any) {
    const popover = await this.popoverCtrl.create({
      component: PopoverComponent,
      event: ev,
      cssClass: "popover",

      animated: true,
      showBackdrop: false,
    });
    return await popover.present();
  }

  async onClickFilterModal() {
    await this.loading.presentLoading();
    const filterModal = await this.modalCtrl.create({
      component: FilterComponent,
      cssClass: "filter-modal",
      componentProps: {
        usr_role: this.userdetails.userRole,
        PlantList: this.Plants,
        OrganizationList: this.Organizations,
        Divisions: this.Divisions,
        CustomerGroups: this.CustomerGroups,
        isFromCharts: false,
        filterData: this.filterdata,
        IsCustomer:
          this.userdetails.userRole.toLowerCase() == "customer" ? true : false,
      },
    });
    await filterModal.present();
    const { data } = await filterModal.onWillDismiss();
    if (data) {
      this.currentPage = 1;
      this.filterdata = data as FilterClass;
      this.sharedParam.IsInvoiceFilterData = true;
      this.sharedParam.SetInvoiceFilterData(this.filterdata);
      this.loading.presentLoading().then(() => {
        try {
          if (this.filterdata != null) {
            this.getFilteredInvoices(this.filterdata);
            this.closeLoader();
          } else {
            this.closeLoader();
          }
        } catch (error) {
          this.closeLoader();
        }
      });
    }
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
    if (loader !== undefined) {
      await this.loadingController.dismiss();
    }
  }

  OpenPDFViewer(
    HeaderID: number,
    AttachmentID: number,
    AttachmentName: string
  ) {
    this.router
      .navigate([
        "/pdf-view",
        JSON.stringify({
          HeaderID: HeaderID,
          AttachmentID: AttachmentID,
          AttachmentName: AttachmentName,
        }),
      ])
      .then(() => {
        this.loading.loadingController.dismiss();
      });
  }

  loadMoreInvoices(event) {
    this.isLoadMore = true;
    this.currentPage++;
    this.filterdata.CurrentPage = this.currentPage;
    this.getFilteredInvoices(this.filterdata);
    if (event) {
      event.target.complete();
    }
  }
}
