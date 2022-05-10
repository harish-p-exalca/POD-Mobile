import { DatePipe } from '@angular/common';
import { Component, OnInit, Inject, Input, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DateAdapter, MatOption } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Platform, ModalController, NavParams, LoadingController } from '@ionic/angular';
import { CustomerGroup } from '../models/CustomerGroup.model';
import { FilterClass, FilterParam } from '../models/FilterParam.model';
import { Organization } from '../models/Organization.model';
import { PlantStructure } from '../models/PlantStruct.model';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent implements OnInit {
  @ViewChild('allStatusSelected') private allStatusSelected: MatOption;
  @ViewChild('allPlantSelected') private allPlantSelected: MatOption;
  @ViewChild('allSelected1') private allSelected1: MatOption;
  @ViewChild('allSelected2') private allSelected2: MatOption;
  @ViewChild('allSelected3') private allSelected3: MatOption;
  StatusList:string[]=["Open","Saved","PartiallyConfirmed","Confirmed"];
  IsCustomer:boolean=false;
  status = new FormControl();
  start_date: string = "";
  end_date: string = "";
  customer_name: string = "";
  customer_group = new FormControl();
  invoice_number: string = "";
  plant = new FormControl();
  orgs = new FormControl();
  divs = new FormControl();
  SearchCG = new FormControl();
  LeadTime=new FormControl();
  Delivery=new FormControl();
  LRNumber:string="";
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
  filterdata: FilterClass = new FilterClass();
  isFromCharts: boolean = false;
  constructor(private modalCtrl: ModalController, private navPrams: NavParams, private loadingController: LoadingController) {
    this.userRole = this.navPrams.get('usr_role');
    this.PlantList = this.navPrams.get('PlantList') as PlantStructure[];
    this.OrgList = this.navPrams.get('OrganizationList') as Organization[];
    this.CustGrps = this.navPrams.get('CustomerGroups') as CustomerGroup[];
    this.Divisions = this.navPrams.get('Divisions') as string[];
    this.isFromCharts = this.navPrams.get('isFromCharts') as boolean;
    this.IsCustomer = this.navPrams.get('IsCustomer') as boolean;
    this.filterdata = this.navPrams.get('filterData') as FilterClass;
    this.SetFilterData(this.filterdata);
    this.loadingController.getTop().then(async (o) => {
      if (o) {
        await this.loadingController.dismiss();
      }
    });
  }

  ngOnInit() {
    this.FilteredCustomerGroups = this.CustGrps;
  }

  SetFilterData(filterClass: FilterClass) {
    this.start_date = filterClass.StartDate;
    this.end_date = filterClass.EndDate;
    this.customer_name = filterClass.CustomerName;
    this.customer_group.setValue(filterClass.CustomerGroup);
    this.orgs.setValue(filterClass.Organization);
    this.divs.setValue(filterClass.Division);
    this.status.setValue(filterClass.Status);
    this.invoice_number = filterClass.InvoiceNumber;
    this.LRNumber=filterClass.LRNumber;
    this.plant.setValue(filterClass.PlantList);
    this.LeadTime.setValue(filterClass.LeadTime);
    this.Delivery.setValue(filterClass.Delivery);
    console.log("onpopup data", filterClass);
  }

  CheckCustomerGroups(val: string, matval: string) {
    if (val == null || val == "") {
      return false;
    }
    else {
      let lst = this.CustGrps.filter(k => k.CustomerGroupCode.toLowerCase().includes(val.toLowerCase()))
      if (lst.length > 0) {
        if (lst.filter(k => k.CustomerGroupCode == matval)) {
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

  toggleStatusSelection(): void {
    if (this.allStatusSelected.selected) {
      const values = this.StatusList.map(x => x);
      values.push("all");
      this.status.patchValue(values);
    } else {
      this.status.patchValue([]);
    }
  }
  toggleStatus() {
    if (this.allStatusSelected.selected) {
      this.allStatusSelected.deselect();
      return false;
    }
    if (this.status.value.length) {
      if (this.status.value.length === this.StatusList.length) {
        this.allStatusSelected.select();
      }
    }
  }

  toggleAllSelection(): void {
    if (this.allPlantSelected.selected) {
      const pls = this.PlantList.map(x => x.PlantCode);
      pls.push("all");
      this.plant.patchValue(pls);
    } else {
      this.plant.patchValue([]);
    }
  }

  togglePerOne() {
    if (this.allPlantSelected.selected) {
      this.allPlantSelected.deselect();
      return false;
    }
    if (this.plant.value.length) {
      if (this.plant.value.length === this.PlantList.length) {
        this.allPlantSelected.select();
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
    this.filterdata.InvoiceNumber = this.invoice_number;
    this.filterdata.LRNumber=this.LRNumber;
    if (this.start_date) {
      this.start_date = this.DatePipe.transform(this.start_date, 'yyyy-MM-dd');
    }
    if (this.end_date) {
      this.end_date = this.DatePipe.transform(this.end_date, 'yyyy-MM-dd');
    }
    this.filterdata.StartDate = this.start_date;
    this.filterdata.EndDate = this.end_date;
    this.filterdata.CustomerName = this.customer_name;
    this.filterdata.CustomerGroup = this.customer_group.value ? this.customer_group.value : [];
    this.filterdata.Organization = this.orgs.value ? this.orgs.value : [];
    this.filterdata.Division = this.divs.value ? this.divs.value : [];
    this.filterdata.PlantList = this.plant.value ? this.plant.value : [];
    this.filterdata.Status = this.status.value ? this.status.value : [];
    this.filterdata.LeadTime = this.LeadTime.value ? this.LeadTime.value : [];
    this.filterdata.Delivery = this.Delivery.value ? this.Delivery.value : [];
    this.modalCtrl.dismiss(this.filterdata);
  }

}
