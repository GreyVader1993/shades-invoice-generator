export interface LineItem {
  id: string;
  dates: string;
  service: string;
  time: string;
  rate: string;
  hours: string;
}

export interface InvoiceFields {
  invNum: string;
  invDate: string;
  fromName: string;
  fromAddr: string;
  fromEmail: string;
  toName: string;
  toAddr: string;
  note: string;
}
