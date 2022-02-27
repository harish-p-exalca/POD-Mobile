import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { FilterClass } from '../models/FilterClass.model';
import { TokenResponse } from '../models/TokenResponse.model';
import { GetService } from './getservice.service';

@Injectable({
    providedIn:'root'
})
export class OnTimeAndLateInvResolver{
    userdetails:TokenResponse=new TokenResponse();
    AmFliterObj:FilterClass = new FilterClass();
constructor(private getservice: GetService){

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
    
    return this.userdetails.userRole!="Customer"? forkJoin([this.getservice.getOnTimeInvoicesforAMuser(this.AmFliterObj),this.getservice.getLateInvoicesforAMuser(this.AmFliterObj)]):forkJoin([this.getservice.getOnTimeDeliveryInvoices(this.userdetails.userCode,this.userdetails.userID,this.userdetails.userRole,"","","","",1,(10).toString()),this.getservice.getLateDeliveryInvoices(this.userdetails.userCode,this.userdetails.userID,this.userdetails.userRole,"","","","",1,(10).toString())])
}



}