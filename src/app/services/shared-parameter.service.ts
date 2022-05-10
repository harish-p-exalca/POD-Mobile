import { Injectable } from '@angular/core';
import { FilterClass, FilterParam } from '../models/FilterParam.model';

@Injectable({
  providedIn: 'root'
})
export class SharedParameterService {

  ChartFilterData:FilterClass=new FilterClass();
  InvoiceFilterData:FilterClass=new FilterClass();
  IsInvoiceFilterData:boolean=false;
  Plants=[];
  Organizations=[];
  Divisions=[];
  CustomerGroups=[];
  constructor() { }

  GetChartFilterData(){
    return this.ChartFilterData;
  }
  SetChartFilterData(filterClass:FilterClass){
    this.ChartFilterData=filterClass;
  }
  GetInvoiceFilterData(){
    return this.InvoiceFilterData;
  }
  SetInvoiceFilterData(filterClass:FilterClass){
    this.InvoiceFilterData=filterClass;
  }
}
