import { Component } from '@angular/core';

@Component({
  selector: 'app-voucher-sms',
  standalone: false,
  templateUrl: './voucher-sms.component.html',
  styleUrl: './voucher-sms.component.css',
})
export class VoucherSmsComponent {
  // Messages to display when no data is available
  availablePrintVouchers: string = 'No available print vouchers found';
  issuedPrintVouchers: string = 'No issued print vouchers found';
  sentSmsInfo: string = 'No sent sms info found';

  constructor() {}
}
