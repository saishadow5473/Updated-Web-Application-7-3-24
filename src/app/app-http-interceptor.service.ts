import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { ConstantsService } from './services/constants.service';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

@Injectable()
export class AppHttpInterceptorService implements HttpInterceptor {

  //private staticLoginHeaderToken: string = "hZH2vKcf1BPjROFM/DY0XAt89wo/09DXqsAzoCQC5QHYpXttcd5DNPOkFuhrPWcyT57DFFR9MnAdRAXoVw1j5yupkl+ps7+Z1UoM6uOrTxUBAA==";
  private token: any = (('id_token' in localStorage) ? localStorage.getItem('id_token') : "");
  private apiToken: any = (('api_header_token' in localStorage) ? localStorage.getItem('api_header_token') : "");
  constructor(
    private http: HttpClient,
    private constants: ConstantsService,
  ) {
  }

  private ihlBaseUrl: string = this.constants.ihlBaseurl;
  private vaptEnabled: boolean = this.constants.vaptEnabled;

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.token = (('id_token' in localStorage) ? localStorage.getItem('id_token') : "");
    this.apiToken = (('api_header_token' in localStorage) ? localStorage.getItem('api_header_token') : "");
    if(this.apiToken == ""){
      this.apiToken = (('apiKey' in localStorage) ? localStorage.getItem('apiKey') : "");
    }
    //console.log("AppHttpInterceptorService");
    let paymentUrl = (req.url.indexOf(this.constants.externalBaseURL+"payment/tele_consult/pay.php?paymentLiveMode=") > -1) ? true : false;
    if (req.url != `${this.ihlBaseUrl}login/kioskLogin?id=2936` && paymentUrl == false) {
      if (req.headers && req.headers.has('apitoken') == true && req.headers.has('token') == true) {
        //console.log("token true");
        //console.log(req);
        return next.handle(req);
      } else {
        if(this.vaptEnabled){
          return next.handle(req);
        }else{
        //console.log("token false");
        //console.log(req);
        req = req.clone({ headers: req.headers.set('ApiToken', this.apiToken) });
        req = req.clone({ headers: req.headers.set('Token', this.token) });
        return next.handle(req);
        }
      }
    } else {
      return next.handle(req);
    }
  }
}
