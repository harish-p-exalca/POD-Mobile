import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit, ElementRef } from '@angular/core';
import { ChartType } from 'chart.js';
import { Chart } from 'chart.js';
import { Router, ActivatedRoute } from '@angular/router'
import { MultiDataSet, Label } from 'ng2-charts';
import { TokenResponse } from '../models/TokenResponse.model';
import { InvoiceStatusCount } from '../models/InvoiceStatusCount.model';
import { DeliveryCount } from '../models/DeliveryCount.model';
import { MenuController, Platform, AlertController, IonRouterOutlet, ModalController } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';
import { PopoverComponent } from '../popover/popover.component';
import { DataService } from '../services/BehaviourSubject.service';
import { LoadingController } from '@ionic/angular';
import { pipe, interval, forkJoin } from 'rxjs';
import { retry } from 'rxjs/operators';
import { StorageService } from '../services/storage.service';
import { delAndInv } from '../models/delAndInv.model';
import { GetAllChartData } from '../services/GetAllChartData.service';
import { LoadingAnimation } from '../LoadingAnimation/LoadingAnimation.service';
import 'chartjs-plugin-labels';
import { PlantStructure } from '../models/PlantStruct.model';
import { Guid } from 'guid-typescript';
import { FilterComponent } from '../filter/filter.component';
import { Organization } from '../models/Organization.model';
import { GetService } from '../services/getservice.service';
import { CustomerGroup } from '../models/CustomerGroup.model';
import { InvoiceHeaderDetail } from '../models/InvoiceHeaderDetail.model';
import { ToastMaker } from '../Toast/ToastMaker.service';
import { FilterClass } from '../models/FilterParam.model';
import { SharedParameterService } from '../services/shared-parameter.service';
@Component({
  selector: 'app-charts',
  templateUrl: './charts.page.html',
  styleUrls: ['./charts.page.scss'],
})
export class ChartsPage implements OnInit {

  confirmedinvoices: number = 0;
  pendinginvoices: number = 0;
  inlinedelvery: number = 0;
  delayeddelivery: number = 0;
  inline: number = 0;
  AllOrganizations: Organization[];
  public doughnutChartOptions = {
    responsive: false,

    legend: {
      position: "right",
      labels: {
        fontSize: 10,

        usePointStyle: true,
      },
    },
    cutoutPercentage: 60,
    elements: {
      arc: {
        borderWidth: 0,
      },
    },
    plugins: {
      labels: {
        // tslint:disable-next-line:typedef
        render: function (args) {
          return args.value + "\n(" + args.percentage + "%" + ")";
        },
        fontColor: "#000",
        position: "default",
        // outsidePadding: 0,
        // textMargin: 0
      },
    },
  };
  public doughnutChartType: ChartType = "doughnut";
  public doughnutChartLabels: any[] = [
    "CONFIRMED INVOICES",
    "PARTIALLY CONFIRMED",
    "SAVED INVOICES",
    "PENDING INVOICES",
  ];
  public doughnutChartData: any[] = [[0, 0]];
  // public doughnutChartData: any[] = [];
  public colors: any[] = [{ backgroundColor: ["#52de97", '#4452c6', "#fb7800", "yellow"] }];

  public doughnutChartOptions2 = {
    responsive: false,

    legend: {
      position: "right",
      labels: {
        fontSize: 10,

        usePointStyle: true,
      },
    },
    cutoutPercentage: 60,
    elements: {
      arc: {
        borderWidth: 0,
      },
    },
    plugins: {
      labels: {
        // tslint:disable-next-line:typedef
        render: function (args) {
          return args.value + "\n(" + args.percentage + "%" + ")";
        },
        fontColor: "#000",
        position: "default",
        // outsidePadding: 0,
        // textMargin: 0
      },
    },
  };
  public doughnutChartType2: ChartType = "doughnut";
  public doughnutChartLabels2: any[] = [
    "WITHIN PDD",
    "BEYOND PDD"
  ];
  public doughnutChartData2: any[] = [[0, 0]];
  // public doughnutChartData: any[] = [];
  public colors2: any[] = [{ backgroundColor: ["#40E0D0", "#DE3163"] }];

  public doughnutChartOptions1 = {
    responsive: false,

    legend: {
      position: "right",
      labels: {
        fontSize: 10,

        usePointStyle: true,
      },
    },
    cutoutPercentage: 60,
    elements: {
      arc: {
        borderWidth: 0,
      },
    },
    plugins: {
      labels: {
        // tslint:disable-next-line:typedef
        render: function (args) {
          return args.value + "\n(" + args.percentage + "%" + ")";
        },
        fontColor: "#000",
        position: "default",
        // outsidePadding: 0,
        // textMargin: 0
      },
    },
  };
  public doughnutChartType1: ChartType = "doughnut";
  public doughnutChartLabels1: any[] = ["ON TIME DELIVERY", "LATE DELIVERY"];
  public doughnutChartData1: any[] = [[0, 0]];
  // public doughnutChartData: any[] = [];
  public colors1: any[] = [{ backgroundColor: ["#52de97", "#eff54f"] }];

  doughnutChart: any;
  doughnutChart1: any;
  doughnutChart2: any;
  destroycharts: any;
  mouse_event: any
  ref;
  userdetails: TokenResponse = new TokenResponse();
  displayname: string = "";
  invoicechartdata: InvoiceStatusCount = new InvoiceStatusCount();
  deliverychartdata: DeliveryCount = new DeliveryCount();

  //Harish-8-3-2022
  Plants=[];
  Organizations=[];
  Divisions=[];
  CustomerGroups=[];
  filterdata:FilterClass=new FilterClass();

  constructor(
    private router: Router,
    private alrtctrl: AlertController,
    private m: GetAllChartData,
    private platform: Platform,
    private storage: StorageService,
    public loading: LoadingAnimation,
    private dataservice: DataService,
    public popoverCtrl: PopoverController,
    private activatedRoute: ActivatedRoute,
    public menuCtrl: MenuController,
    private getservice: GetService,
    private loadingController: LoadingController,
    private modalCtrl: ModalController,
    private toast: ToastMaker,
    private sharedParam: SharedParameterService
  ) {
    this.menuCtrl.enable(true);
  }

  ionViewWillEnter(){
    this.sharedParam.SetInvoiceFilterData(new FilterClass());
  }

  ngOnInit() {
    this.userdetails = JSON.parse(this.activatedRoute.snapshot.paramMap.get('user_data'));
    this.dataservice.SignedInUser(this.userdetails);
    this.displayname = this.userdetails.displayName;
    this.filterdata=Object.assign({},this.sharedParam.GetChartFilterData());
    this.loading.presentLoading().then(() => {
      this.activatedRoute.data.subscribe((data: { delivery: any[] }) => {
        console.log("route", data);
        this.deliverychartdata = data.delivery[0];
        const chartData1: number[] = [];
        chartData1.push(this.deliverychartdata.InLineDelivery);
        chartData1.push(this.deliverychartdata.DelayedDelivery);
        this.doughnutChartData1 = chartData1;

        this.invoicechartdata = data.delivery[1];
        const chartData: number[] = [];
        chartData.push(this.invoicechartdata.ConfirmedInvoices);
        chartData.push(this.invoicechartdata.PartiallyConfirmedInvoices);
        chartData.push(this.invoicechartdata.SavedInvoices);
        chartData.push(this.invoicechartdata.PendingInvoices);
        this.doughnutChartData = chartData;
        console.log(this.invoicechartdata);

        var leadtimeData = data.delivery[2];
        const chartData2: number[] = [];
        chartData2.push(leadtimeData[1]);
        chartData2.push(leadtimeData[2]);
        this.doughnutChartData2 = chartData2;
        console.log("leadTime chart data", this.invoicechartdata);
        let t = this.loading.loadingController.getTop();
        if (t) {
          this.loading.loadingController.dismiss();
        }

        this.Plants=data.delivery[3];
        this.Organizations=data.delivery[4];
        this.Divisions=data.delivery[5];
        this.CustomerGroups=data.delivery[6];
        this.sharedParam.Plants=this.Plants;
        this.sharedParam.Organizations=this.Organizations;
        this.sharedParam.Divisions=this.Divisions;
        this.sharedParam.CustomerGroups=this.CustomerGroups;
      });
    });
  }

  doughnutChart1Clicked(e: any): void {
    console.log(e);
    if (e.active.length > 0) {
      const chart = e.active[0]._chart;
      const activePoints = chart.getElementAtEvent(e.event);
      if (activePoints.length > 0) {
        this.sharedParam.IsInvoiceFilterData=false;
        this.filterdata.LeadTime=[];
        // get the internal index of slice in pie chart
        const clickedElementIndex = activePoints[0]._index;
        const label = chart.data.labels[clickedElementIndex] as String;
        // get value by index
        const value = chart.data.datasets[0].data[clickedElementIndex];
        console.log(clickedElementIndex, label, value);
        if (label.toLowerCase() === "on time delivery") {
          this.loading.presentLoading().then(() => {
            this.filterdata.Delivery=["ontime"];
            this.filterdata.Status=["Saved","PartiallyConfirmed","Confirmed"];
              this.sharedParam.SetChartFilterData(this.filterdata);
            this.router.navigate(['/invoice', JSON.stringify(this.userdetails)]).then(() => {
              this.loading.loadingController.dismiss();
            });
          });
        }
        else if (label.toLowerCase() === "late delivery") {
          this.loading.presentLoading().then(() => {
            this.filterdata.Delivery=["late"];
            this.filterdata.Status=["Saved","PartiallyConfirmed","Confirmed"];
              this.sharedParam.SetChartFilterData(this.filterdata);
            this.router.navigate(['/invoice', JSON.stringify(this.userdetails)]).then(() => {
              this.loading.loadingController.dismiss();
            });
          });
        }
      }
    }
  }

  doughnutChartClicked(e: any): void {
    console.log(e);
    if (e.active.length > 0) {
      const chart = e.active[0]._chart;
      const activePoints = chart.getElementAtEvent(e.event);
      if (activePoints.length > 0) {
        this.sharedParam.IsInvoiceFilterData=false;
        this.filterdata.LeadTime=[];
        this.filterdata.Delivery=[];
        // get the internal index of slice in pie chart
        const clickedElementIndex = activePoints[0]._index;
        const label = chart.data.labels[clickedElementIndex] as String;
        // get value by index
        const value = chart.data.datasets[0].data[clickedElementIndex];
        console.log(clickedElementIndex, label, value);
        if (label) {
          if (label.toLowerCase() === "pending invoices") {
            this.loading.presentLoading().then(() => {
              this.filterdata.Status=["Open"];
              this.sharedParam.SetChartFilterData(this.filterdata);
              this.router.navigate(['/invoice', JSON.stringify(this.userdetails)]).then(() => {
                this.loading.loadingController.dismiss();
              });
            });
          }
          else if (label.toLowerCase() === "confirmed invoices") {
            this.loading.presentLoading().then(() => {
              this.filterdata.Status=["Confirmed"];
              this.sharedParam.SetChartFilterData(this.filterdata);
              this.router.navigate(['/invoice', JSON.stringify(this.userdetails)]).then(() => {
                this.loading.loadingController.dismiss();
              });
            });
          }
          else if (label.toLowerCase() === "partially confirmed") {
            this.loading.presentLoading().then(() => {
              this.filterdata.Status=["PartiallyConfirmed"];
              this.sharedParam.SetChartFilterData(this.filterdata);
              this.router.navigate(['/invoice', JSON.stringify(this.userdetails)]).then(() => {
                this.loading.loadingController.dismiss();
              });
            });
          }
          else if (label.toLowerCase() === "saved invoices") {
            this.loading.presentLoading().then(() => {
              this.filterdata.Status=["Saved"];
              this.sharedParam.SetChartFilterData(this.filterdata);
              this.router.navigate(['/invoice', JSON.stringify(this.userdetails)]).then(() => {
                this.loading.loadingController.dismiss();
              });
            });
          }
        }
      }
    }
  }

  doughnutChartClicked2(e: any): void {
    console.log(e);
    if (e.active.length > 0) {
      const chart = e.active[0]._chart;
      const activePoints = chart.getElementAtEvent(e.event);
      if (activePoints.length > 0) {
        this.sharedParam.IsInvoiceFilterData=false;
        this.filterdata.Delivery=[];
        // get the internal index of slice in pie chart
        const clickedElementIndex = activePoints[0]._index;
        const label = chart.data.labels[clickedElementIndex] as String;
        // get value by index
        const value = chart.data.datasets[0].data[clickedElementIndex];
        console.log(clickedElementIndex, label, value);
        if (label) {
          if (label.toLowerCase() === "within pdd") {
            this.loading.presentLoading().then(() => {
              this.filterdata.LeadTime=["within"];
              this.filterdata.Status=["Open"];
              this.sharedParam.SetChartFilterData(this.filterdata);
              this.router.navigate(['/invoice', JSON.stringify(this.userdetails)]).then(() => {
                this.loading.loadingController.dismiss();
              });
            });
          }
          else if (label.toLowerCase() === "beyond pdd") {
            this.loading.presentLoading().then(() => {
              this.filterdata.LeadTime=["beyond"];
              this.filterdata.Status=["Open"];
              this.sharedParam.SetChartFilterData(this.filterdata);
              this.router.navigate(['/invoice', JSON.stringify(this.userdetails)]).then(() => {
                this.loading.loadingController.dismiss();
              });
            });
          }
        }
      }
    }
  }


  async onClickProfile(ev: any) {
    this.mouse_event = ev;
    const popover = await this.popoverCtrl.create({
      component: PopoverComponent,
      event: ev,
      cssClass: 'popover',
      animated: true,
      showBackdrop: false
    });
    await popover.present();

  }

  async onClickFilterModal() {
    await this.loading.presentLoading();
    const filterModal = await this.modalCtrl.create({
      component: FilterComponent,
      cssClass: this.userdetails.userRole == "Customer" ? "filter-modal-Customer" : "filter-modal",
      componentProps: {
        'usr_role': this.userdetails.userRole,
        'hide_status': true,
        'segment': 0,
        'PlantList': this.Plants,
        'OrganizationList': this.Organizations,
        'Divisions': this.Divisions,
        'CustomerGroups': this.CustomerGroups,
        'isFromCharts': true,
        'filterData': this.filterdata,
        'IsCustomer':this.userdetails.userRole.toLowerCase()=="customer"?true:false
      }
    });
    await filterModal.present();
    const { data } = await filterModal.onWillDismiss();
    if(data){
      this.filterdata = data as FilterClass;
    }
    this.loading.presentLoading().then(() => {
      try {
        console.log("filterData",this.filterdata);
        this.sharedParam.SetChartFilterData(this.filterdata);
        this.GetFilteredChartData().subscribe((data:any[]) => {
          console.log(data);
          this.deliverychartdata = data[0];
          const chartData1: number[] = [];
          chartData1.push(this.deliverychartdata.InLineDelivery);
          chartData1.push(this.deliverychartdata.DelayedDelivery);
          this.doughnutChartData1 = chartData1;
  
          this.invoicechartdata = data[1];
          const chartData: number[] = [];
          chartData.push(this.invoicechartdata.ConfirmedInvoices);
          chartData.push(this.invoicechartdata.PartiallyConfirmedInvoices);
          chartData.push(this.invoicechartdata.SavedInvoices);
          chartData.push(this.invoicechartdata.PendingInvoices);
          this.doughnutChartData = chartData;
          console.log(this.invoicechartdata);
  
          var leadtimeData = data[2];
          const chartData2: number[] = [];
          chartData2.push(leadtimeData[1]);
          chartData2.push(leadtimeData[2]);
          this.doughnutChartData2 = chartData2;
          console.log("leadTime chart data", this.invoicechartdata);
          this.closeLoader();
        });
      } catch (error) {
        this.closeLoader();
      }
    });
  }

  GetFilteredChartData() {
    return forkJoin([
      this.getservice.deliverychart(this.userdetails.userCode, this.userdetails.userID, this.userdetails.userRole),
      this.getservice.invoicechart(this.userdetails.userCode, this.userdetails.userID, this.userdetails.userRole),
      this.getservice.LeadTimeChartData(this.userdetails.userCode, this.userdetails.userID, this.userdetails.userRole)
    ]);
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
}
