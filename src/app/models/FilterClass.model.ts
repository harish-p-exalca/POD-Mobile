
export class FilterClass {
    constructor() {
        var currDate = new Date();
        currDate.setMonth(currDate.getMonth() - 2);
        this.StartDate = currDate.toISOString().slice(0, 10);
    }
    UserID: string;
    UserCode:any;
    CurrentPage: number;
    Records: number;
    Status: string[];
    StartDate: string;
    EndDate: string=new Date().toISOString().slice(0, 10);
    InvoiceNumber: string;
    Organization: string[];
    Division: string[];
    Plant: string;
    PlantList: string[];
    CustomerName: string;
    LRNumber: string;
    CustomerGroup: string[];
    LeadTime:string;
}