import { Injectable } from '@angular/core';
import { GetService } from './getservice.service';
import { ActivatedRoute, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { TokenResponse } from '../models/TokenResponse.model';

@Injectable({
    providedIn: "root"
  })

  export class GetAllInvoices{
    userdetails:TokenResponse;
    segment:number;
    constructor( ) {
    
        
       
        
    }

    setData(usr:TokenResponse,seg:number){
        this.userdetails=usr;
        this.segment = seg;
        console.log("working");
        
    }
  }