export class TokenResponse{
    access_token:string;
    token_type: string;
    expires_in:string;
    userID: string;
    userName: string;
    plant: string;
    displayName: string;
    emailAddress:string;
    userRole:string;
    userCode:string;
    menuItemNames: string;
    isChangePasswordRequired: string;
    ipAddress: string;
    geoLocation: string;
   
}


export class geoLocation {
    latitude: number;
    longitude: number;
}

export class UserActionHistory {
    UserName: string;
    IpAddress: string;
    Location: string;
    TransID: number;
    Action: string;
    ChangesDetected: string;
    DateTime: Date;
}
export class UserActionHistoryView {
    InvoiceNumber: string;
    UserName: string;
    IpAddress: string;
    Location: string;
    TransID: number;
    Action: string;
    ChangesDetected: string;
    DateTime: Date;
}

export class ActionHistoryFilter {
    StartDate: Date | string | null;
    EndDate: Date | string | null;
    UserName: string;
    InvoiceNumber: string;
}

export class ChangesDetected {
    Item: Itemchanges[];
    Status: string;
    UnloadedDate: string;
    DocumentUpload: string;
    DocumentReUpload: string;
}

export class Itemchanges {
    ID: number;
    Item: string;
    Quantity: string;
    ReceivedQty: string;
    Remarks: string;
}