import { DeliveryCount } from './DeliveryCount.model';
import { InvoiceStatusCount } from './InvoiceStatusCount.model';
import { TokenResponse } from './TokenResponse.model';

export class delAndInv{
    del:DeliveryCount;
    inv:InvoiceStatusCount;
    leadtime:number[];
    tok:TokenResponse;
}