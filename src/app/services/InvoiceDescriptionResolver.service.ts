import {Resolve, ActivatedRouteSnapshot , RouterStateSnapshot, ActivatedRoute } from '@angular/router';
import {Injectable} from '@angular/core';
import { Observable, empty ,of, forkJoin } from 'rxjs';
import { GetService } from 'src/app/services/getservice.service';

import { take, mergeMap, catchError, filter } from 'rxjs/operators'

import { InvoiceStatusCount } from '../models/InvoiceStatusCount.model';
import { TokenResponse } from '../models/TokenResponse.model';
import { DeliveryCount } from '../models/DeliveryCount.model';
import { InvoiceHeaderDetail } from '../models/InvoiceHeaderDetail.model';
@Injectable({
    providedIn:"root"
})
export class InvoiceDescriptionResolver{
userdetails:TokenResponse = new TokenResponse();
constructor(private getservice: GetService, private route: ActivatedRoute){


}

resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
     this.userdetails=JSON.parse(route.paramMap.get('user_data'));
     let header_id= JSON.parse(route.paramMap.get('header_id'));
     console.log(this.userdetails);
     
     
     
    return  forkJoin([this.getservice.getItemDescription(this.userdetails.userCode,this.userdetails.userID,this.userdetails.userRole,JSON.stringify(header_id.HEADER_ID)),this.getservice.getDescriptionReasons()])
    
}


}