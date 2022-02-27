import { Pipe, PipeTransform } from "@angular/core";
import { CustomerGroup } from "../models/CustomerGroup.model";

@Pipe({
    name:'FilterCustomerGroups'
})

export class FilterCustomerGroupsPipe implements PipeTransform{
    transform(CustGrps:CustomerGroup[],val:string) {
       // console.log(val);
        if(val==null || val==""){
            
              return CustGrps;
             }
             else {
                return CustGrps.filter(k=>k.CustomerGroupCode.toLowerCase().includes(val.toLowerCase()))
              
                
                
                 
             
              
             
              
              
             }
    }

}