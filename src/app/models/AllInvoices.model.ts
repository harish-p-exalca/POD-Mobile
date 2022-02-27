import { InvoiceHeaderDetail } from './InvoiceHeaderDetail.model';

export class AllInvoices {
    pending:InvoiceHeaderDetail[];
    partial:InvoiceHeaderDetail[];
    confirm:InvoiceHeaderDetail[];
}