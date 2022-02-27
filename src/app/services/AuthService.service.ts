import { Injectable, OnInit } from '@angular/core';

import { DataService } from './BehaviourSubject.service';
import { TokenResponse } from '../models/TokenResponse.model';
import { StorageService } from './storage.service';
import { Plugins } from '@capacitor/core';
import { temp } from '../models/temp.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    userdetails:TokenResponse = new TokenResponse()
     
    t:temp= new temp();
  constructor(private dataservice:DataService,private storage:StorageService) {
   
  
   
  }
  
  // ...
  public async isAuthenticated(): Promise<temp> {
   
  
 
    // Check whether the token is expired and return
    // true or false
    this.userdetails = await JSON.parse((await Plugins.Storage.get({key:'signedUser'})).value)
    
    
    
    if(this.userdetails !=null){
      this.t.tok=this.userdetails;
      console.log(this.userdetails);
      
      this.t.b=true;
      console.log(this.t.b);
      return this.t;
    }
    else{
      this.t.b=false;
      return this.t;
    }
  }

 
  
}