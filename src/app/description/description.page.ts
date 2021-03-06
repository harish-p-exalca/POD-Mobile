import { Component, OnInit, OnDestroy, ViewChildren, QueryList } from '@angular/core';
import { TokenResponse } from '../models/TokenResponse.model';
import { Router, ActivatedRoute } from '@angular/router';
import { InvoiceDescriptionResolver } from '../services/InvoiceDescriptionResolver.service';
import { InvoiceHeaderDetail } from '../models/InvoiceHeaderDetail.model';
import { InvoiceItemDetail } from '../models/InvoiceItemDetail.model';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DescriptiondailogComponent } from '../descriptiondailog/descriptiondailog.component';
import { InvoiceUpdation } from '../models/InvoiceUpdation.model';
import { GetService } from '../services/getservice.service';
import { MenuController, PopoverController, LoadingController, ModalController } from '@ionic/angular';
import { PopoverComponent } from '../popover/popover.component';
import { DataService } from '../services/BehaviourSubject.service';
import { invUpdateandformdata } from '../models/invUpdateandformdata.model';
import { ToastMaker } from '../Toast/ToastMaker.service';
import { LoadingAnimation } from '../LoadingAnimation/LoadingAnimation.service';
import { StorageService } from '../services/storage.service';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl, Validators, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { reasonSelectOption } from '../models/reasonSelectOption.model';
import { Platform, IonRouterOutlet } from '@ionic/angular';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-description',
  templateUrl: './description.page.html',
  styleUrls: ['./description.page.scss'],
})
export class DescriptionPage implements OnInit {
  userdetails: TokenResponse = new TokenResponse();
  invoicedetails: InvoiceHeaderDetail = new InvoiceHeaderDetail();
  description_data: InvoiceItemDetail[];
  copydescription_data: InvoiceItemDetail[]
  invoiceupdation: InvoiceUpdation = new InvoiceUpdation();
  dataForm: FormGroup;
  items: FormArray=this.formBuilder.array([]);
  dataArr: Array<any> = new Array<any>();
  cnfbtn_hidden = true;
  Forder: number = 0;
  dataFromDailog: invUpdateandformdata;
  disableSelect = false;
  hide_custnameDiv = true;
  inv_dt: string = "";
  lr_dt: string = "";
  prop_dt: string = "";
  dtpipe: DatePipe;
  disable_save = false;

  header_id: InvoiceHeaderDetail;
  displayedColumns = ["material_code", "invoice_qty", "recieved_qty", "reason"];
  // reasons: reasonSelectOption[] = [
  //   { id: 1, value: '1', viewValue: 'Completely received' },
  //   { id: 2, value: '2', viewValue: 'Partially received' },
  //   { id: 3, value: '3', viewValue: 'Damaged' },
  //   { id: 4, value: '4', viewValue: 'Others' }
  // ];
  reasons: reasonSelectOption[] = []
  selected = "1";
  backButtonSub;
  constructor(private router: Router, private platform: Platform, private formBuilder: FormBuilder, public loadingcontroller: LoadingController, private toast: ToastMaker, private loading: LoadingAnimation, private dataservice: DataService, private storage: StorageService, public popoverCtrl: PopoverController, public menuCtrl: MenuController, private getservice: GetService, private activatedRoute: ActivatedRoute, private modalCtrl: ModalController, private dialog: MatDialog) {
    this.menuCtrl.enable(true);
  }

  ionViewWillLeave() {
    this.dataArr = [];
    this.reasons = [];
  }

  ngOnInit() {
    this.userdetails = JSON.parse(this.activatedRoute.snapshot.paramMap.get('user_data'));
    this.invoicedetails = JSON.parse(this.activatedRoute.snapshot.paramMap.get('header_id'));
    this.header_id = JSON.parse(this.activatedRoute.snapshot.paramMap.get('header_id'));
    if (this.invoicedetails.INV_DATE != null) {
      this.inv_dt = this.invoicedetails.INV_DATE.slice(0, 10);
      this.dtpipe = new DatePipe('en-US');
      this.inv_dt = this.dtpipe.transform(this.inv_dt, 'dd-MM-yyyy')
    }
    if (this.invoicedetails.LR_DATE != null) {
      this.lr_dt = this.invoicedetails.LR_DATE.slice(0, 10);
      this.dtpipe = new DatePipe('en-US');
      this.lr_dt = this.dtpipe.transform(this.lr_dt, 'dd-MM-yyyy')
    }
    if (this.invoicedetails.PROPOSED_DELIVERY_DATE != null) {
      this.prop_dt = this.invoicedetails.PROPOSED_DELIVERY_DATE.slice(0, 10);
      this.dtpipe = new DatePipe('en-US');
      this.prop_dt = this.dtpipe.transform(this.prop_dt, 'dd-MM-yyyy')
    }
    if (this.userdetails.userRole === 'Customer') {
      this.hide_custnameDiv = false;
    }

    let urlTree = this.router.parseUrl(this.router.url);
    urlTree.queryParams = {};
    let urlcurrent = urlTree.toString();
    console.log(this.router.url.split('/')[1]);
    console.log(this.invoicedetails);
    this.dataservice.SignedInUser(this.userdetails);
    console.log((this.activatedRoute.snapshot.paramMap.get('type')));

    if ((this.activatedRoute.snapshot.paramMap.get('type')) == "PartiallyConfirmed") {
      this.cnfbtn_hidden = true;
    }
    else if ((this.activatedRoute.snapshot.paramMap.get('type')) == "Confirmed") {
      this.cnfbtn_hidden = true;
    }
    else if (this.userdetails.userRole != "Customer" && this.invoicedetails.STATUS == "Saved") {
      this.cnfbtn_hidden = false;
    }
    else if (this.userdetails.userRole != "Customer" && this.invoicedetails.STATUS == "Open") {
      this.cnfbtn_hidden = true;
    }
    else {
      this.cnfbtn_hidden = false;
    }
    this.activatedRoute.data.subscribe((x: { descrptn: any }) => {
      console.log(x.descrptn[0]);
      this.description_data = x.descrptn[0];
      this.copydescription_data = this.description_data;
      console.log(x.descrptn[1]);
      x.descrptn[1].forEach(element => {
        this.reasons.push({ id: element.ReasonID, value: (element.ReasonID).toString(), viewValue: element.Description })
      });
      console.log("reasons",this.reasons);
      this.CreateFormControls();
    },
      (catchError) => {
        if (catchError.status == 0) {
          this.toast.internetConnection();
          this.router.navigate(['/charts', JSON.stringify(this.userdetails)])
        }
        else {
          this.toast.wentWrong();
          this.router.navigate(['/charts', JSON.stringify(this.userdetails)])
        }
      }
    )

  }

  CreateFormControls() {
    this.dataForm = this.formBuilder.group({
      items: this.items
    });
    console.log("description_data",this.description_data);
    this.description_data.forEach(z => {
      var lReasons = null;
      if (z.REASON != null) {
        lReasons = z.REASON.split(',');
      }
      else {
        lReasons = ['Completely received'];
      }

      if(this.invoicedetails.STATUS=="Open"){
        this.dataArr.push({ 'mat': z.MATERIAL_CODE, 'qty': z.QUANTITY, 'uom': z.QUANTITY_UOM, 'rcvd': z.QUANTITY, 'reason': ['Completely received'],'remarks':z.REMARKS });
      }
      else{
        this.dataArr.push({ 'mat': z.MATERIAL_CODE, 'qty': z.QUANTITY, 'uom': z.QUANTITY_UOM, 'rcvd': z.RECEIVED_QUANTITY, 'reason': lReasons,'remarks':z.REMARKS });
      }
    });
    console.log("dataArr", this.dataArr);
    // this.items = this.dataForm.get('items') as FormArray;
    this.dataArr.forEach((z: any) => {
      const ctrl = this.formBuilder.group({
        key: [z.reason],
        mat: [z.mat],
        qty: [z.qty],
        uom: [z.uom],
        rcvd: [z.rcvd],
        remarks:[z.remarks]
      });
      if (z.uom == "NOS")
        ctrl.get('rcvd').setValidators([Validators.required, Validators.max(parseInt(z.qty)), Validators.min(0), Validators.pattern(/^[0-9]\d*$/)])
      else
        ctrl.get('rcvd').setValidators([Validators.required, Validators.max(parseFloat(z.qty)), Validators.min(0), Validators.pattern(/^[0-9]\d*(\.?\d{1,2})?$/)])
      this.items.push(ctrl);
    });
    console.log("formGroup",this.dataForm.value);
    this.initializeFormControls();
  }

  initializeFormControls() {
    console.log("test");
    let formvalues = this.dataForm.get('items').value;
    for (let h in formvalues) {
      this.onChangeQty(formvalues[h].rcvd, h);
    }
    this.disableFormControlsForAM_User();
  }

  disableFormControlsForAM_User() {
    let formvalues = this.dataForm.get('items').value;
    if (this.userdetails.userRole != 'Customer' || this.invoicedetails.STATUS.toLowerCase().includes('confirmed')) {
      for (let h in formvalues) {
        (<FormArray>this.dataForm.get('items')).controls[h].get('rcvd').disable();
        (<FormArray>this.dataForm.get('items')).controls[h].get('key').disable();
        (<FormArray>this.dataForm.get('items')).controls[h].get('remarks').disable();
      }
      this.disable_save = true;
    }
  }

  refreshTableData() {
    let reasonctrl = (<FormArray>this.dataForm.get('items'));
    if (reasonctrl.valid) {
      for (let h in this.copydescription_data) {
        reasonctrl.controls[h].get('key').enable();
      }
      let formvalues = this.dataForm.get('items').value;

      for (let h in this.copydescription_data) {
        var reasons = "";
        var selectedReasons = formvalues[h].key;
        console.log("selectedReasons", selectedReasons);
        if (selectedReasons != null) {
          selectedReasons.forEach((reason, i) => {
            if (i < selectedReasons.length - 1) {
              reasons += reason + ",";
            }
            else {
              reasons += reason;
            }
          });
        }
        else {
          reasons = null;
        }
        this.copydescription_data[h].REMARKS = formvalues[h].remarks;
        this.copydescription_data[h].REASON = reasons;
        this.copydescription_data[h].RECEIVED_QUANTITY = formvalues[h].rcvd;
        this.copydescription_data[h].STATUS = "Saved"
      }
      console.log(this.copydescription_data);

      this.invoiceupdation.InvoiceItems = this.copydescription_data;
      return true;
    }
    else {
      this.toast.checkTable();
      return false;
    }

  }

  onFormSubmit(reportedDate) {
    let reasonctrl = (<FormArray>this.dataForm.get('items'));
    if (reasonctrl.valid) {
      this.loading.presentLoading().then(() => {
        for (let h in this.copydescription_data) {
          reasonctrl.controls[h].get('key').enable();
        }
        let formvalues = this.dataForm.get('items').value;

        for (let h in this.copydescription_data) {
          var reasons = "";
          var selectedReasons = formvalues[h].key;
          console.log("selectedReasons", selectedReasons);
          if (selectedReasons != null) {
            selectedReasons.forEach((reason, i) => {
              if (i < selectedReasons.length - 1) {
                reasons += reason + ",";
              }
              else {
                reasons += reason;
              }
            });
          }
          else {
            reasons = null;
          }
          this.copydescription_data[h].REMARKS = formvalues[h].remarks;
          this.copydescription_data[h].REASON = reasons;
          this.copydescription_data[h].RECEIVED_QUANTITY = formvalues[h].rcvd;
          this.copydescription_data[h].STATUS = "Saved"
        }
        console.log(this.copydescription_data);
        this.invoiceupdation.VEHICLE_REPORTED_DATE = reportedDate;
        this.invoiceupdation.InvoiceItems = this.copydescription_data;
        this.getservice.updateInvoiceItems(this.invoiceupdation).subscribe((z: any) => {
          this.dataArr = [];
          this.getservice.getItemDescription(this.userdetails.userCode, this.userdetails.userID, this.userdetails.userRole, JSON.stringify(this.header_id.HEADER_ID)).subscribe((l: any) => {
            this.description_data = l;
            this.copydescription_data = this.description_data;
            this.CreateFormControls()
          });
          this.toast.itemDetailsUpdationSuccess()
        },
          (catchError) => {
            if (catchError.status == 0) {
              this.toast.internetConnection();
              this.loading.loadingController.dismiss();
            }
            else {
              this.toast.wentWrong();
              this.loading.loadingController.dismiss();
            }
          })
        this.loading.loadingController.dismiss();
      });
    }
    else {
      this.toast.checkTable();
    }
  }

  async descriptionConfirmModal(isSave:boolean=false,isReConfirm:boolean=false) {
    const descripModal = await this.modalCtrl.create({
      component: DescriptiondailogComponent,
      cssClass: "Pending-Modal",
      componentProps: {
        'headerid': this.invoicedetails.HEADER_ID,
        'createdby': this.invoicedetails.CREATED_BY,
        'inv_no': this.invoicedetails.INV_NO,
        'vehicleReportedDate': this.invoicedetails.VEHICLE_REPORTED_DATE,
        'i_dt': this.invoicedetails.INV_DATE,
        'l_dt': this.invoicedetails.LR_DATE,
        'IsSave':isSave,
        'IsReConfirm':isReConfirm
      }
    });
    console.log("isave,isrecocnfirm",isSave,isReConfirm);
    await descripModal.present();
    const { data } = await descripModal.onWillDismiss();
    this.dataFromDailog = data;

    this.loading.presentLoading().then(() => {
      if (this.dataFromDailog != null && this.refreshTableData()) {
        console.log("dialogRes",this.dataFromDailog);
        if(isSave){
          this.onFormSubmit(this.dataFromDailog.reportdate);
        }
        else if(isReConfirm){
          this.getservice.addInvoiceAttachment(data.files).subscribe((x: any) => {
            console.log("Document uploaded successfully", x);
            setTimeout(() => {
              this.router.navigate(['/invoice', JSON.stringify(this.userdetails)]);
              this.closeLoader();
              this.toast.ReConfirmSuccess();
            }, 2000);
          },
            (catchError) => {
              this.closeLoader();
              if (catchError.status == 0) {

                this.toast.internetConnection();
              }
              else {
                this.toast.wentWrongWithUpdatingInvoices();
              }
            });
        }
        else {
          this.invoiceupdation.VEHICLE_REPORTED_DATE = new Date(this.dataFromDailog.reportdate);
          //update invoice
          this.getservice.updateInvoiceItems(this.invoiceupdation).subscribe((z: any) => {
            console.log(z);
            //upload files
            this.getservice.addInvoiceAttachment(data.files).subscribe((x: any) => {
              console.log("Document uploaded successfully", x);
              this.router.navigate(['/invoice', JSON.stringify(this.userdetails)]);
              this.closeLoader();
              this.toast.itemDetailsUpdationSuccess();
            },
              (catchError) => {
                this.closeLoader();
                if (catchError.status == 0) {
                  this.toast.internetConnection();
                }
                else {
                  this.toast.wentWrongWithUpdatingInvoices();
                }
              });
          },
            (catchError) => {
              this.closeLoader();
              if (catchError.status == 0) {
                this.toast.internetConnection();
              }
              else {
                this.toast.wentWrongWithUpdatingInvoices();
              }
          });
        }
        this.closeLoader();
      }
      else {
        this.loadingcontroller.dismiss();
        this.toast.confirmationCancelled();
      }
    });
  }

  onChangeQty(s: number, i) {
    let reasonctrl = (<FormArray>this.dataForm.get('items')).controls[i].get('key')
    if (this.description_data[i].QUANTITY == s) {
      reasonctrl.disable();
      reasonctrl.setValue(['Completely received']);
    }
    else {
      reasonctrl.enable();
    }
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

  OpenPDFViewer(HeaderID: number, AttachmentID: number, AttachmentName: string) {
    this.router.navigate(['/pdf-view', JSON.stringify({
      "HeaderID": HeaderID,
      "AttachmentID": AttachmentID,
      "AttachmentName": AttachmentName,
    })]).then(() => {
      this.loading.loadingController.dismiss();
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
    const loader = await this.loadingcontroller.getTop();
    // if loader present then dismiss
    if (loader !== undefined) {
      await this.loadingcontroller.dismiss();
    }
  }

}
