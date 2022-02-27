import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit, ElementRef } from '@angular/core';
import { ChartType } from 'chart.js';
import { Chart } from 'chart.js';
import { Router, ActivatedRoute } from '@angular/router'
import { MultiDataSet, Label } from 'ng2-charts';
import { TokenResponse } from '../models/TokenResponse.model';
import { InvoiceStatusCount } from '../models/InvoiceStatusCount.model';
import { DeliveryCount } from '../models/DeliveryCount.model';
import { MenuController, Platform, AlertController, IonRouterOutlet } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';
import { PopoverComponent } from '../popover/popover.component';
import { DataService } from '../services/BehaviourSubject.service';
import { LoadingController } from '@ionic/angular';
import { pipe, interval } from 'rxjs';
import { retry } from 'rxjs/operators';
import { StorageService } from '../services/storage.service';
import { delAndInv } from '../models/delAndInv.model';
import { GetAllChartData } from '../services/GetAllChartData.service';
import { LoadingAnimation } from '../LoadingAnimation/LoadingAnimation.service';
import 'chartjs-plugin-labels';
@Component({
  selector: 'app-charts',
  templateUrl: './charts.page.html',
  styleUrls: ['./charts.page.scss'],
})
export class ChartsPage implements OnInit, AfterViewInit {

  confirmedinvoices: number = 0;
  pendinginvoices: number = 0;
  inlinedelvery: number = 0;
  delayeddelivery: number = 0;
  inline: number = 0;

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
    "PENDING INVOICES",
  ];
  public doughnutChartData: any[] = [[0, 0]];
  // public doughnutChartData: any[] = [];
  public colors: any[] = [{ backgroundColor: ["#52de97", '#4452c6', "#fb7800"] }];

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
    "WITHIN LEAD TIME",
    "BEYOND LEAD TIME"
  ];
  public doughnutChartData2: any[] = [[0, 0]];
  // public doughnutChartData: any[] = [];
  public colors2: any[] = [{ backgroundColor: ["#4361ee", "#4cc9f0"] }];

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




  constructor(private router: Router, private alrtctrl: AlertController, private m: GetAllChartData, private platform: Platform, private storage: StorageService, public loading: LoadingAnimation, private dataservice: DataService, public popoverCtrl: PopoverController, private activatedRoute: ActivatedRoute, public menuCtrl: MenuController) {
    this.menuCtrl.enable(true);



  }
  ngAfterViewInit(): void {

  }

  // ionViewWillLeave(){
  //   console.log("hello");

  //  this.doughnutCanvas= null;
  //  this.doughnutCanvas1 = null;
  // }

  ngOnInit() {


    this.userdetails = JSON.parse(this.activatedRoute.snapshot.paramMap.get('user_data'));
    this.dataservice.SignedInUser(this.userdetails);
    this.displayname = this.userdetails.displayName;

    this.loading.presentLoading().then(() => {
      this.activatedRoute.data.subscribe(
        (data: { delivery: any[] }) => {

          console.log("route",data);
          this.deliverychartdata = data.delivery[0];
          const chartData1: number[] = [];
          chartData1.push(this.deliverychartdata.InLineDelivery);
          chartData1.push(this.deliverychartdata.DelayedDelivery);

          this.doughnutChartData1 = chartData1;




          console.log(data.delivery);
          this.invoicechartdata = data.delivery[1];
          const chartData: number[] = [];
          chartData.push(this.invoicechartdata.ConfirmedInvoices);
          chartData.push(this.invoicechartdata.PartiallyConfirmedInvoices);
          chartData.push(this.invoicechartdata.PendingInvoices);
          this.doughnutChartData = chartData;
          console.log(this.invoicechartdata);

          var leadtimeData = data.delivery[2];
          const chartData2: number[] = [];
          chartData2.push(leadtimeData[1]);
          chartData2.push(leadtimeData[2]);
          this.doughnutChartData2 = chartData2;
          console.log("leadTime chart data",this.invoicechartdata);


          let t = this.loading.loadingController.getTop();
          if (t) {
            this.loading.loadingController.dismiss();
          }


        }
      )

    })
  }








  doughnutChart1Clicked(e: any): void {
    console.log(e);
    if (e.active.length > 0) {
      const chart = e.active[0]._chart;
      const activePoints = chart.getElementAtEvent(e.event);
      if (activePoints.length > 0) {
        // get the internal index of slice in pie chart
        const clickedElementIndex = activePoints[0]._index;
        const label = chart.data.labels[clickedElementIndex] as String;
        // get value by index
        const value = chart.data.datasets[0].data[clickedElementIndex];
        console.log(clickedElementIndex, label, value);
        if (label.toLowerCase() === "on time delivery") {

          this.loading.presentLoading().then(() => {
            this.router.navigate(['/on-time-and-late-invs', JSON.stringify(this.userdetails), JSON.stringify(1)]).then(() => {
              this.loading.loadingController.dismiss();
            })


          })
          // this.currentLabel = 'ON TIME DELIVERY';
          // if (this.currentUserRole === "Amararaja User") {
          //     this.FilterOnTimeDeliveryInvoices();
          // } else if (this.currentUserRole === "Customer") {
          //     this.FilterOnTimeDeliveryInvoicesByUser();
          // }
        }
        else if (label.toLowerCase() === "late delivery") {

          this.loading.presentLoading().then(() => {
            this.router.navigate(['/on-time-and-late-invs', JSON.stringify(this.userdetails), JSON.stringify(0)]).then(() => {
              this.loading.loadingController.dismiss();
            })


          })
          // this.currentLabel = 'LATE DELIVERY';
          // if (this.currentUserRole === "Amararaja User") {
          //     this.FilterLateDeliveryInvoices();
          // } else if (this.currentUserRole === "Customer") {
          //     this.FilterLateDeliveryInvoicesByUser();
          // }
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
        // get the internal index of slice in pie chart
        const clickedElementIndex = activePoints[0]._index;
        const label = chart.data.labels[clickedElementIndex] as String;
        // get value by index
        const value = chart.data.datasets[0].data[clickedElementIndex];
        console.log(clickedElementIndex, label, value);
        if (label) {
          if (label.toLowerCase() === "pending invoices") {
            this.loading.presentLoading().then(() => {
              this.router.navigate(['/invoice', JSON.stringify(this.userdetails), JSON.stringify(0)]).then(() => {
                this.loading.loadingController.dismiss();
              })


            })
          }
          else if (label.toLowerCase() === "confirmed invoices") {
            this.loading.presentLoading().then(() => {
              this.router.navigate(['/invoice', JSON.stringify(this.userdetails), JSON.stringify(2)]).then(() => {
                this.loading.loadingController.dismiss();
              })


            })
          }
          else if (label.toLowerCase() === "partially confirmed") {
            this.loading.presentLoading().then(() => {
              this.router.navigate(['/invoice', JSON.stringify(this.userdetails), JSON.stringify(1)]).then(() => {
                this.loading.loadingController.dismiss();
              })


            })
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
        // get the internal index of slice in pie chart
        const clickedElementIndex = activePoints[0]._index;
        const label = chart.data.labels[clickedElementIndex] as String;
        // get value by index
        const value = chart.data.datasets[0].data[clickedElementIndex];
        console.log(clickedElementIndex, label, value);
        if (label) {
          if (label.toLowerCase() === "within lead time") {
            this.loading.presentLoading().then(() => {
              this.router.navigate(['/invoice', JSON.stringify(this.userdetails), JSON.stringify(0)]).then(() => {
                this.loading.loadingController.dismiss();
              })
            })
          }
          else if (label.toLowerCase() === "beyond lead time") {
            this.loading.presentLoading().then(() => {
              this.router.navigate(['/invoice', JSON.stringify(this.userdetails), JSON.stringify(0)]).then(() => {
                this.loading.loadingController.dismiss();
              })
            })
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






}
