import {Resolve, ActivatedRouteSnapshot , RouterStateSnapshot, ActivatedRoute } from '@angular/router';
import {Injectable} from '@angular/core';
import { Observable, empty ,of, forkJoin } from 'rxjs';
import { GetService } from 'src/app/services/getservice.service';

import { take, mergeMap, catchError, filter, withLatestFrom } from 'rxjs/operators'

import { InvoiceStatusCount } from '../models/InvoiceStatusCount.model';
import { TokenResponse } from '../models/TokenResponse.model';
import { DeliveryCount } from '../models/DeliveryCount.model';
import { FilterClass } from '../models/FilterClass.model';
import { Guid } from "guid-typescript";
@Injectable({
    providedIn:"root"
})
export class GetAllInvoiceResolver{
userdetails:TokenResponse= new TokenResponse();
AmFliterObj:FilterClass = new FilterClass();
constructor(private getservice: GetService, private route: ActivatedRoute){


}

resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
     this.userdetails=JSON.parse(route.paramMap.get('user_data'));

    this.AmFliterObj.CurrentPage = 1;
    this.AmFliterObj.Records = 10;
    this.AmFliterObj.UserID = this.userdetails.userID;
    this.AmFliterObj.StartDate = null;
    this.AmFliterObj.EndDate =null;
    this.AmFliterObj.Organization =[];
    this.AmFliterObj.Division =[];
    this.AmFliterObj.PlantList =[];
     
    return this.userdetails.userRole!="Customer"? forkJoin([this.getservice.getConfirmedInvoicesforAMuser(this.AmFliterObj),this.getservice.getPartialInvoicesforAMuser(this.AmFliterObj),this.getservice.getPendingInvoicesforAMuser(this.AmFliterObj)]):forkJoin([this.getservice.getApprovedInvoice(this.userdetails.userCode,this.userdetails.userID,this.userdetails.userRole,"1","10"),(this.getservice.getPartiallyConfirmedInvoice(this.userdetails.userCode,this.userdetails.userID,this.userdetails.userRole,"1","10")),(this.getservice.getPendingInvoice(this.userdetails.userCode,this.userdetails.userID,this.userdetails.userRole,"1","10"))])
    
}


}