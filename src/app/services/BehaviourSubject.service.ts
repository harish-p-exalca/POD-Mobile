import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TokenResponse } from '../models/TokenResponse.model';




@Injectable({
    providedIn: "root"
})
export class DataService {
    userSource = new BehaviorSubject<TokenResponse>(null);
    user = this.userSource.asObservable();

    


    constructor() { }



    SignedInUser(user:TokenResponse) {
        return this.userSource.next(user);
    }

   



}   