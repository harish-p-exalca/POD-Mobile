export class FilterParam{
    constructor() {
        var currDate = new Date();
        currDate.setMonth(currDate.getMonth() - 2);
        this.stdate = currDate.toISOString().slice(0, 10);
    }
    status:string[];
    plant:string[];
    invno:string;
    stdate:string;
    enddate:string=new Date().toISOString().slice(0, 10);
    customername:string;
    organization:string[];
    division:string[];
    customergroup:string[];
}

export class FilterClass {
    constructor() {
        var currDate = new Date();
        currDate.setMonth(currDate.getMonth() - 2);
        this.StartDate = currDate.toISOString().slice(0, 10);
    }
    UserID: any;
    UserCode:any;
    CurrentPage: number;
    Records: number;
    Status: string[]=[];
    StartDate: string;
    EndDate: string=new Date().toISOString().slice(0, 10);
    InvoiceNumber: string;
    Organization: string[]=[];
    Division: string[]=[];
    Plant: string;
    PlantList: string[]=[];
    CustomerName: string;
    LRNumber: string;
    CustomerGroup: string[]=[];
    LeadTime:string[]=[];
    Delivery:string[]=[];
}