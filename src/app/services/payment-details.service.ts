import { Injectable } from '@angular/core';
// import { PaymentDetails } from 'src/app/classes/payment-details';
import { HttpClient } from '@angular/common/http';
import { ConstantsService } from 'src/app/services/constants.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentDetailsService {
  private static IHL_BASE_URL: string;
  private static httpClient: any;

  constructor(
    private _constants : ConstantsService,
    private httpClient: HttpClient,
  ) {
    PaymentDetailsService.IHL_BASE_URL = this._constants.ihlBaseurl;
    PaymentDetailsService.httpClient = this.httpClient;
  }

  /*static collectPaymentDetails<T>(MRPCost: T, TotalAmount: T, Discounts: T, ConsultantID: T, ConsultantName: T, ClassName: T, PurposeDetails: T, AppointmentID: T, AffilationUniqueName: T, SourceDevice: T): void{
    PaymentDetailsService.getPaymentTransactionStatusDetails<T>(MRPCost, TotalAmount, Discounts, ConsultantID, ConsultantName, ClassName, PurposeDetails, AppointmentID, AffilationUniqueName, SourceDevice);
  }

  static getPaymentTransactionStatusDetails<T>(MRPCost: T, TotalAmount: T, Discounts: T, ConsultantID: T, ConsultantName: T, ClassName: T, PurposeDetails: T, AppointmentID: T, AffilationUniqueName: T, SourceDevice: T): any{
    let PaymentDetail: PaymentDetails<T> = new PaymentDetails<T>(MRPCost, TotalAmount, Discounts, ConsultantID, ConsultantName, ClassName, PurposeDetails, AppointmentID, AffilationUniqueName, SourceDevice);
    return PaymentDetailsService.postPaymentTransacionData<T>(PaymentDetail).subscribe(data => console.log(data));
  }

  static postPaymentTransacionData<T>(PaymentDetail: PaymentDetails<T>): Observable<any>{
    let body = PaymentDetail;
    let _headers = {};
    console.log(PaymentDetail);
    return PaymentDetailsService.httpClient.post(PaymentDetailsService.IHL_BASE_URL +"consult/update_payment_transaction", body, _headers);
  }*/

}
