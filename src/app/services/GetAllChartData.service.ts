import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, ActivatedRoute } from '@angular/router';
import { Injectable, OnInit } from '@angular/core';
import { Observable, empty, of, forkJoin } from 'rxjs';
import { GetService } from 'src/app/services/getservice.service';

import { take, mergeMap, catchError, filter, retry, map } from 'rxjs/operators'

import { InvoiceStatusCount } from '../models/InvoiceStatusCount.model';
import { TokenResponse } from '../models/TokenResponse.model';
import { DeliveryCount } from '../models/DeliveryCount.model';
import { StorageService } from './storage.service';
import { Plugins } from '@capacitor/core';
import { delAndInv } from '../models/delAndInv.model';
import { async } from '@angular/core/testing';
import { promise } from 'protractor';
@Injectable({
  providedIn: "root"
})
export class GetAllChartData {
  userdetails: TokenResponse = new TokenResponse();
  response: TokenResponse = new TokenResponse();
  j: delAndInv = new delAndInv();
  constructor(private getservice: GetService, private route: ActivatedRoute, private storage: StorageService) {



  }



  getpart(): Observable<any> {
    return Observable.create((data) => {
      this.storage.getObject('signedUser').then((y: any) => {
        this.response = y;
        console.log(this.response);
        // data.next(forkJoin([this.getservice.deliverychart(this.response.userName,this.response.userID,this.response.userRole),this.getservice.invoicechart(this.response.userName,this.response.userID,this.response.userRole)]))
        this.getservice.deliverychart(this.response.userCode, this.response.userID, this.response.userRole,).subscribe((x: DeliveryCount) => {
          this.getservice.invoicechart(this.response.userCode, this.response.userID, this.response.userRole).subscribe((m: InvoiceStatusCount) => {
            this.getservice.LeadTimeChartData(this.response.userCode, this.response.userID, this.response.userRole).subscribe((l: any) => {
              this.j.del = x;
              this.j.inv = m;
              this.j.tok = y;
              this.j.leadtime = l;
              console.log(this.j);
              data.next(this.j);
            });
          });
        });
      });
    });
  }
}