import { DatePipe } from '@angular/common';
import { Component, OnInit, Inject, Input, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DateAdapter, MatOption } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Platform, ModalController, NavParams, LoadingController } from '@ionic/angular';
import { CustomerGroup } from '../models/CustomerGroup.model';
import { FilterParam } from '../models/FilterParam.model';
import { Organization } from '../models/Organization.model';
import { PlantStructure } from '../models/PlantStruct.model';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent implements OnInit {
  @ViewChild('allSelected') private allSelected: MatOption;
  @ViewChild('allSelected1') private allSelected1: MatOption;
  @ViewChild('allSelected2') private allSelected2: MatOption;
  @ViewChild('allSelected3') private allSelected3: MatOption;
  status: string = "";
  start_date: string = "";
  end_date: string = "";
  customer_name: string = "";
  customer_group = new FormControl();
  invoice_number: string = "";
  plant = new FormControl();
  orgs = new FormControl();
  divs = new FormControl();
  SearchCG = new FormControl();
  FilteredCustomerGroups: CustomerGroup[] = [];
  flag = "yes";
  userRole = "";
  hideforCustomer = true;
  @Input() hidestatus = false;
  @Input() temphide = "no"
  @Input() segment: number
  @Input() PlantList: PlantStructure[];
  @Input() OrgList: Organization[];
  @Input() CustGrps: CustomerGroup[];
  @Input() Divisions: string[];
  DatePipe: DatePipe = new DatePipe('en-US');
  filterdata: FilterParam = new FilterParam();
  constructor(private modalCtrl: ModalController, private navPrams: NavParams, private loadingController: LoadingController) {
    this.userRole = this.navPrams.get('usr_role'),
      this.temphide = this.navPrams.get('hide_status')
    this.segment = this.navPrams.get('segment')

    this.PlantList = this.navPrams.get('PlantList') as PlantStructure[]
    this.OrgList = this.navPrams.get('OrganizationList') as Organization[]
    this.CustGrps = this.navPrams.get('CustomerGroups') as CustomerGroup[];
    this.Divisions = this.navPrams.get('Divisions') as string[]
    this.loadingController.getTop().then(async (o) => {
      if (o) {
        await this.loadingController.dismiss();
      }
    })
    console.log(this.PlantList);

  }

  ngOnInit() {
    if (this.userRole == "Customer") {
      this.hideforCustomer = true;

    } else {

      this.hideforCustomer = false;
    }
    if (this.temphide == "no") {
      this.hidestatus = false
    } else {
      this.hidestatus = true
    }

    // this.plant.valueChanges.subscribe(f=>{
    //   console.log(f);

    // })
    this.FilteredCustomerGroups = this.CustGrps;
    //   this.SearchCG.valueChanges.subscribe((f:string)=>{
    //    // console.log(f);

    //     if(f){
    //       this.FilteredCustomerGroups = this.CustGrps.filter(k=>k.CustomerGroupCode.toLowerCase().includes(f.toLowerCase()));
    //  //   console.log(this.FilteredCustomerGroups.length);

    //     }
    //     else{
    //       this.FilteredCustomerGroups = this.CustGrps
    //     }
    //   })

  }
  CheckCustomerGroups(val: string, matval: string) {


    if (val == null || val == "") {
      //  console.log(val);
      return false;
    }
    else {
      let lst = this.CustGrps.filter(k => k.CustomerGroupCode.toLowerCase().includes(val.toLowerCase()))
      if (lst.length > 0) {


        if (lst.filter(k => k.CustomerGroupCode == matval)) {
          //  console.log(lst);
          return false;
        }
        else {
          return true;
        }
      }
      else {
        return false;
      }



    }

  }

  toggleAllSelection(): void {
    if (this.allSelected.selected) {
      const pls = this.PlantList.map(x => x.PlantCode);
      pls.push("all");
      this.plant.patchValue(pls);
    } else {
      this.plant.patchValue([]);
    }

  }

  togglePerOne() {
    if (this.allSelected.selected) {
      this.allSelected.deselect();
      return false;
    }
    if (this.plant.value.length) {
      if (this.plant.value.length === this.PlantList.length) {
        this.allSelected.select();
      }
    }

  }

  toggleAllSelection1(): void {
    if (this.allSelected1.selected) {
      const pls = this.CustGrps.map(x => x.CustomerGroupCode);
      pls.push("all");
      this.customer_group.patchValue(pls);
    } else {
      this.customer_group.patchValue([]);
    }

  }

  togglePerOne1() {
    if (this.allSelected1.selected) {
      this.allSelected1.deselect();
      return false;
    }
    if (this.customer_group.value.length) {
      if (this.customer_group.value.length === this.CustGrps.length) {
        this.allSelected1.select();
      }
    }

  }
  toggleAllSelection2(): void {
    if (this.allSelected2.selected) {
      const pls = this.OrgList.map(x => x.OrganizationCode);
      pls.push("all");
      this.orgs.patchValue(pls);
    } else {
      this.orgs.patchValue([]);
    }

  }

  togglePerOne2() {
    if (this.allSelected2.selected) {
      this.allSelected2.deselect();
      return false;
    }
    if (this.orgs.value.length) {
      if (this.orgs.value.length === this.OrgList.length) {
        this.allSelected2.select();
      }
    }

  }
  toggleAllSelection3(): void {
    if (this.allSelected3.selected) {
      const pls = this.Divisions.map(x => x);
      pls.push("all");
      this.divs.patchValue(pls);
    } else {
      this.divs.patchValue([]);
    }

  }

  togglePerOne3() {
    if (this.allSelected3.selected) {
      this.allSelected3.deselect();
      return false;
    }
    if (this.divs.value.length) {
      if (this.divs.value.length === this.Divisions.length) {
        this.allSelected3.select();
      }
    }

  }

  save() {
    if (this.status == "" && this.segment == 1) {
      this.status = "PartiallyConfirmed"

    }
    if (this.status == "" && this.segment == 2) {
      this.status = "Confirmed"

    }


    this.filterdata.status = this.status;
    this.filterdata.invno = this.invoice_number;
    this.filterdata.plant = this.plant.value ? this.plant.value : [];
    if (this.start_date) {
      this.start_date = (this.DatePipe.transform(this.start_date)).toString();
    }
    if (this.end_date) {
      this.end_date = (this.DatePipe.transform(this.end_date)).toString();
    }
    this.filterdata.stdate = this.start_date;
    this.filterdata.enddate = this.end_date;
    this.filterdata.customername = this.customer_name;
    this.filterdata.customergroup = this.customer_group.value ? this.customer_group.value : [];
    this.filterdata.organization = this.orgs.value ? this.orgs.value : [];
    this.filterdata.division = this.divs.value ? this.divs.value : [];
    //  console.log(this.filterdata);

    this.modalCtrl.dismiss(this.filterdata);
  }

}
