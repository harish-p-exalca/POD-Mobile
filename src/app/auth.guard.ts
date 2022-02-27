import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './services/AuthService.service';
import { temp } from './models/temp.model';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(public auth: AuthService, public router: Router){}
 
   canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      
      
      //  if (!this.gateFlag) {
      //   console.log("hello");
      //   this.router.navigate(['/home']);
      //   return  false ;
      //  }else{
         
         
      //    console.log("hai");
         
      //   return  true;
      //  }
       
      return new Promise((x)=>{
       this.auth.isAuthenticated().then((y:temp)=>{
         if(!y.b){
          this.router.navigate(['/home']);
         }
         x(y.b == true)
       })

      })
    
      
      
  }

  
  
}
