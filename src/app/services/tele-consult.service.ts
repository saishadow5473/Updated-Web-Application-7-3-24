import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
// import { last } from '@angular/router/src/utils/collection';
import { ConstantsService } from 'src/app/services/constants.service';
import { Router } from '@angular/router'
import { catchError, retry } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { Observable, throwError, Subject } from 'rxjs';

function _window(): any {
  // return the global native browser window object
  return window;
}

@Injectable({
  providedIn: 'root'
})
export class TeleConsultService {

  IHL_BASE_URL = this._constant.ihlBaseurl;
  vaptEnabled = this._constant.vaptEnabled;
  appointmentApikey = 'IWkzkviYuwJqJ2S/F858AdtNyyP3iIDEwJVW4lnn4itl9MOJ9rgTGN2uCRr2ymWQ4qC8ufGtabVjJxZr1o+t1ji4Qk7kFnO4HLtabbdPPFsBAA==';
  appointmentApiToken = 'GKsshZNXO3CzNge63IrpY0W8YNBUMzpbYlvxZ3whkPEUKbk4Oy3KewiOmD3ehOjOi/4hvCSVy8Yuhr31pG76R28OA5j3/Sh6W7JymgFvNN63wY9NaTsFYi2yYtTvelpbxEmIV27w51tT97kizP0C1Ey76NK6BKZy+y7DML12Qv4o1/DqpHx5iqVlXsAcCg50AQA=';
  constructor(@Inject(PLATFORM_ID) private platformId: object, private httpClient: HttpClient, private router: Router, private _constant: ConstantsService) { }

  /* getTeleConsultData(){
    // this.httpClient.get("assets/teleconsult.json").subscribe(data =>{
    //   console.log(data);

    // })
    return this.httpClient.get("assets/teleconsult.json");
  } */
  ihlToken = 'hZH2vKcf1BPjROFM/DY0XAt89wo/09DXqsAzoCQC5QHYpXttcd5DNPOkFuhrPWcyT57DFFR9MnAdRAXoVw1j5yupkl+ps7+Z1UoM6uOrTxUBAA==';
  apiKey: string;
  getApiKey() {
    const apiKey = localStorage.getItem('apiKey');
    if(!apiKey){
      let apiKeyHeader = new HttpHeaders();
      apiKeyHeader = apiKeyHeader.append('ApiToken',this.ihlToken);
      if(this.vaptEnabled){
        let body = {"id": this._constant.aesEncryptionForVAPT('2936')};
        this.httpClient.post(this.IHL_BASE_URL+'login/kioskLogin',body,{headers: apiKeyHeader}).subscribe(data => {
          this.apiKey = data["ApiKey"]
          localStorage.setItem('apiKey',data["ApiKey"]);
        })
      }else{
        this.httpClient.get(this.IHL_BASE_URL+'login/kioskLogin?id=2936',{headers: apiKeyHeader}).subscribe(data => {
          this.apiKey = data["ApiKey"]
          localStorage.setItem('apiKey',data["ApiKey"]);
        })
      }
    }
    else{
      this.apiKey = apiKey;
    }

  }
  getTeleConsultUserData(ihlId){
    if(this.vaptEnabled){
      let _headers = {
        'ApiToken': this.apiKey,
        'token':localStorage.getItem('id_token')
      };      
      let body = {
        'ihl_id':ihlId,
      };
      return this.httpClient.post(this.IHL_BASE_URL+"consult/get_user_details", body, {headers: _headers});
    }else{
      let _headers = {};
      let body = {
        'ihl_id':ihlId,
      };
      return this.httpClient.post(this.IHL_BASE_URL+"consult/get_user_details", body, _headers);
    }
  }
  getTeleConsultUserPlatformData(ihlId){
    if(this.vaptEnabled){
      let _headers = {
        'ApiToken': this.apiKey,
      };
      let body = {'ihl_id':ihlId, "cache": "true"};
      return this.httpClient.post(this.IHL_BASE_URL+"consult/GetPlatfromData", body, {headers: _headers});
    }else{
      let _headers = {};
      let body = {'ihl_id':ihlId, "cache": "true"};
      return this.httpClient.post(this.IHL_BASE_URL+"consult/GetPlatfromData", body, _headers);
    }
  }

  // getTeleConsultUserPlatformData(ihlId="59827823537"){
  //   //let _headers = {};
  //   //let body = {'ihl_id':ihlId, "cache": "false"};
  //   return this.httpClient.get("assets/teleconsult.json");
  // }

  getCoursesImges(courseIds){
    if(this.vaptEnabled){
      let _headers = {
        'Content-Type': 'application/json',
        'ApiToken':this.apiKey,
        'token':localStorage.getItem('id_token')
      };
      let body = courseIds;
      return this.httpClient.post(this.IHL_BASE_URL+"consult/courses_image_fetch", body, { headers: _headers});
    }else{
      let _headers = {};
      let body = courseIds;
      return this.httpClient.post(this.IHL_BASE_URL+"consult/courses_image_fetch", body, _headers);
    }
  }

  getPaymentOrderID(requestId, amt){
    let timestamp = Date.now();
    let order_rcptid = "web"+timestamp;
    return this.httpClient.get(this._constant.externalBaseURL+ "payment/tele_consult/pay.php?paymentLiveMode="+this._constant.razorpayMode+"&receipt="+order_rcptid+"&amount="+amt).pipe(map(res => res/*.json()*/));
  }

  paymentRequestIdGenerate(endpoint,ihlID){
    let getTimeStamp = new Date().getTime();
    return endpoint+"_"+ihlID+"_"+getTimeStamp;
  }

  get nativeWindow(): any {
    if (isPlatformBrowser(this.platformId)) {
      return _window();
    }
  }

  paymentTransInit(jsonData){
    let body = JSON.stringify(jsonData);
    let _headers = new HttpHeaders()
    _headers = _headers.append('Content-Type', 'application/json');
   /* console.log("ApiToken" in _headers);
    if("ApiToken" in _headers){
      if(_headers['ApiToken'] == "") {
        const apiKey = localStorage.getItem('apiKey');
        console.log(typeof _headers['ApiToken']);
        _headers['ApiToken'] = apiKey.toString();
      }
    } */
    //return this.httpClient.post( this.IHL_BASE_URL +"consult/create_payment_transaction", body, {});
    return this.httpClient.post( this.IHL_BASE_URL +"data/paymenttransaction", body, {headers: _headers});
  }

  paymentTransUpdate(jsonDataUpdate){
    let body = jsonDataUpdate;
    let _headers = {};
    return this.httpClient.post( this.IHL_BASE_URL +"consult/update_payment_transaction", body, _headers);
  }

  getHealthAssesmentSurveyQuestion(){
    return this.httpClient.get("assets/questions.json");
  }
  getDoctorStatus(_doctor_ids:(string|number)[]){
    if(this.vaptEnabled){
      if(_doctor_ids.length == 0) return;
      let body = {
        'consultant_id':_doctor_ids,
      };
      let _headers = {
        'Content-Type': 'application/json',
        'ApiToken':this.apiKey,
      };
      return this.httpClient.post( this.IHL_BASE_URL +"consult/getConsultantLiveStatus", body, { headers: _headers});
    }else{
      if(_doctor_ids.length == 0) return;
      let body = {
        'consultant_id':_doctor_ids,
      };
      let _headers = {};
      return this.httpClient.post( this.IHL_BASE_URL +"consult/getConsultantLiveStatus", body, _headers);
    }
  }

  doctorNextAvailability(docId, vendorId, status){
    return this.httpClient.get(this.IHL_BASE_URL+"consult/busy_availability_check"+"?ihl_consultant_id="+docId+"&vendor_id="+vendorId+"&status="+status);
  }

  doctorNextAvailabilityNew(docId, vendorId, status){
    if(this.vaptEnabled){
      let _headers = {
        'Content-Type': 'application/json',
        'ApiToken':this.apiKey,
      };
      return this.httpClient.get(this.IHL_BASE_URL+"consult/busy_availability_check_new"+"?ihl_consultant_id="+docId+"&vendor_id="+vendorId+"&status="+status,{ headers: _headers});
    }else{
      return this.httpClient.get(this.IHL_BASE_URL+"consult/busy_availability_check_new"+"?ihl_consultant_id="+docId+"&vendor_id="+vendorId+"&status="+status);
    }
  }

  appointmentConsultantDataList(data, startIndex = 0, endIndex = 0):Observable<any>{
    //let id = doctor_id.toString();
    let consultantData = {
      "consultant_id": data.toString(),
      "start_index":startIndex,
      "end_index": endIndex
    };
    let headers : HttpHeaders = this.getHeaders();
    return this.httpClient.post(this.IHL_BASE_URL + "consult/view_all_book_appointment_pagination",JSON.stringify(consultantData), {headers});
  }

  consultantAppointmentCallStatusUpdate(appointment_id:string|number, appointment_status:string):Observable<any>{
    let headers = new HttpHeaders()
    headers = headers.append('Content-Type', 'application/json');
    return this.httpClient.get(this.IHL_BASE_URL+"consult/update_call_status?appointment_id="+appointment_id.toString()+"&call_status="+appointment_status,{headers: headers});
  }

  consultationAppointmentAccept_Reject(data):Observable<any>{
    let headers = new HttpHeaders()
    headers = this.getBookAppointmentHeaders();
    return this.httpClient.get(this.IHL_BASE_URL+"consult/update_appointment_status?appointment_id="+data["appointment_id"].toString()+"&appointment_status="+data["appointment_status"],{headers: headers});
  }

  updateCallLogDetails(obj):Observable<any>{
    let _headers = {};
    return this.httpClient.get(this.IHL_BASE_URL + "consult/call_log?by=" + obj.host +"&user_id="+ obj.hostId + "&action=" + obj.action + "&reference_id=" + obj.refId + "&course_id=" + obj.courseId, {headers: _headers});
  }

  getConsultantImage(obj):Observable<any>{
    if(this.vaptEnabled){
      let headers = {
        'Content-Type': 'application/json',
        'ApiToken':this.apiKey,
      }
      //headers = headers.append('Content-Type', 'application/json');
      return this.httpClient.post(this.IHL_BASE_URL+"consult/profile_image_fetch", obj, { headers: headers});
    }else{
      let headers = {}
      //headers = headers.append('Content-Type', 'application/json');
      return this.httpClient.post(this.IHL_BASE_URL+"consult/profile_image_fetch", obj, headers);
    }
  }

  private apiToken = "tNfJTkJafsrzhJB3KQteyk2caz5Ye2OukglXvXr+ez8pB33+C2D+w+zHEHJ7UgboKrrf50P/jE8+On1IOVlObEsDyK/Gtf6iItpBPAwOcc0BAA==" ;
  private token =  "9Jk4Kqbm4qVOwRbftbg2s9Qu7tXxxiPvKcdLl/kPwbckzpWyrZc6OLaJ6KbiGBDDCSCHayHvYnDmxHqk9sND9uhRNhjflKmXsxnDes/YHSdBhka4Msh5zoheHPRCiPtyvtRHVz6yxBOpUBexiFIRCZJDswg7j198BH9+6ITZoNZhwe3RV9+43FlbbMlPkaFDAQA=";
  private apiTokenSubscription = "32iYJ+Lw/duU/2jiMHf8vQcmtD4SxpuKcwt7n/ej5dgvZPUgvHaYQHPRW3nh+GT+N9bfMEK5fofdt9AfA6T9S3BnDHVe0FvUYuPmnMO0WGQBAA==";

  getHeaders(){
    let headers = new HttpHeaders()
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('ApiToken', this.apiToken);
    headers = headers.append('Token', this.token);
    return headers;
  }
  getAppointmentHeaders(){
    let headers = new HttpHeaders()
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('ApiToken', this.apiTokenSubscription);
    return headers;
  }

  getDoctorSignature(ihl_consultant_id): Observable<any> {
    //ihl_consultant_id = "355b25949ed8405dba88c07e9705082a";
    let url = this.IHL_BASE_URL+'consult/getGenixDoctorSign?ihl_consultant_id='+ihl_consultant_id;
    let headers : HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    return this.httpClient.get<any>(url, {headers:headers}).pipe(map(res => res));
  }

  getConsultationCallSummary() : Observable<any>{
    let appointment_id = this._constant.doctorPrescribedData.appointment_id;
    //let appointment_id = "667a9d620d7c46a297f4398bf4557732";//genix id
    //let appointment_id = "725abf21472449969e9ed70301f96740";//ihl id
    let headers : HttpHeaders = this.getBookAppointmentHeaders();
    let getAppoinmenttDetailsUrl = this._constant.ihlBaseurl+`consult/get_appointment_details?appointment_id=${appointment_id}`;
    return this.httpClient.get<any>(getAppoinmenttDetailsUrl,{headers: headers}).pipe(map(res => res));
  }

  genixVideoCallUrl(data):  Observable<any>{
    let headers = {};
    console.log(`${this.IHL_BASE_URL}consult/direct_call_to_genix?ihl_user_id=${data.ihl_user_id}&specality=${data.specality}&vendor_consultant_id=${data.vendor_consultant_id}&ihl_appointment_id=${data.ihl_appointment_id}`);
    return this.httpClient.get(`${this.IHL_BASE_URL}consult/direct_call_to_genix?ihl_user_id=${data.ihl_user_id}&specality=${data.specality}&vendor_consultant_id=${data.vendor_consultant_id}&ihl_appointment_id=${data.ihl_appointment_id}`);
  }

  genixBookAppointemtVideoCallUrl(id): Observable<any>{
    let headers = {};
    return this.httpClient.get(`${this.IHL_BASE_URL}consult/get_existing_appointment_url_for_genix?ihl_appointment_id=${id}`);
  }

  getTransactionIdDetails(id): Observable<any>{
    return this.httpClient.get(`${this.IHL_BASE_URL}consult/user_transaction_from_ihl_id?ihl_id=${id}`);
  }

  initiatePayment(transaction_id) {
    let url = this.IHL_BASE_URL+'consult/update_refund_status?transaction_id='+transaction_id+'&refund_status=Initated';
    return this.httpClient.get(url);
  }

  getgenixPrescriptionLogoUrl(accountid):Observable<any>{
    return this.httpClient.get(`${this.IHL_BASE_URL}consult/genixAccountLogoFetch?accountid=${accountid}`);
  }

  updateTeleconsultServiceProvidedStatus(id): Observable<any>{
    let headers = this.getAppointmentHeaders();
    return this.httpClient.post(`${this.IHL_BASE_URL}data/serviceProvidedPortal?transaction=${id}`, null, {headers});
  }

  getBookAppointmentHeaders() {
    let headers = new HttpHeaders()
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('ApiToken', this.appointmentApikey);
    headers = headers.append('Token', this.appointmentApiToken);
    return headers
  }

  getAffiliationExclusiveData() {
    if(this.vaptEnabled){
      this.getApiKey();
      const headers = new HttpHeaders({
        'ApiToken': this.apiKey
      });
      let url = this._constant.ihlBaseurl+'consult/get_list_of_affiliation';
      return this.httpClient.get<any>(url, { headers }).pipe(map(res => res));
    }else{
      let url = this._constant.ihlBaseurl+'consult/get_list_of_affiliation';
      return this.httpClient.get<any>(url).pipe(map(res => res));
    }
  }


 private subjects = [];


 publish(eventName: string) {
  // ensure a subject for the event name exists
  this.subjects[eventName] = this.subjects[eventName] || new Subject();

  // publish event
  this.subjects[eventName].next();
 }

 on(eventName: string): Observable<any> {
  // ensure a subject for the event name exists
  this.subjects[eventName] = this.subjects[eventName] || new Subject();
  // return observable
  return this.subjects[eventName].asObservable();
 }

 oneMgCall(){
    // let url = "../assets/phpservice/oneMgBase64Generate.php";
    // return this.httpClient.get<any>(url).pipe(map(res => res));

    return this.httpClient.get<any>(`../assets/phpservice/oneMgBase64Generate.php`);
   //return this.httpClient.get<any>(`../assets/teleconsult.json`);
 }

  getbase64Pdf(data): Observable<any> {
    let headers = new HttpHeaders()
    headers = headers.append('Content-Type', 'application/json')
    //headers = headers.append('ApiToken', '32iYJ+Lw/duU/2jiMHf8vQcmtD4SxpuKcwt7n/ej5dgvZPUgvHaYQHPRW3nh+GT+N9bfMEK5fofdt9AfA6T9S3BnDHVe0FvUYuPmnMO0WGQBAA==');
    return this.httpClient.post(`${this.IHL_BASE_URL}consult/html_to_pdfbase64`, data,  {headers});
  }

  sharePrescriptionTo1mg(data): Observable<any> {
    let headers = new HttpHeaders()
    headers = headers.append('Content-Type', 'application/json');
    return this.httpClient.post(`${this.IHL_BASE_URL}login/sendPrescription`, data,  {headers});
  }

  searchTrainerOrConsultant(searchObj) {
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.httpClient.post(`${this.IHL_BASE_URL}consult/consultant_trainer_search_filter`, searchObj);
  }

  getPrescriptionLogoUrl(id): Observable<any>{
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.httpClient.get(`${this.IHL_BASE_URL}consult/get_logo_url?accountId=${id}`, {headers});
  };

  viewAllSubscriptionsPagination(start, end){
    if(this.vaptEnabled){
      let body = {
        user_ihl_id: this._constant.aesDecryption("userId"),
        start_index: start,
        end_index: end,
        approval_status: ''
      };
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'ApiToken':this.apiKey,
        'token':localStorage.getItem('id_token')
      });
      return this.httpClient.post(this.IHL_BASE_URL + "consult/view_all_subcription_pagination", body, { headers });
    }else{
      let body = {
        user_ihl_id: this._constant.aesDecryption("userId"),
        start_index: start,
        end_index: end,
        approval_status: ''
      };
      let headers = new HttpHeaders({
        'Content-Type': 'application/json'
      });
      return this.httpClient.post(this.IHL_BASE_URL + "consult/view_all_subcription_pagination", body, { headers });
    }
  }

  viewAppointmentStatusPagination(start, end){
    let body = {
      user_ihl_id: this._constant.aesDecryption("userId"),
      start_index: start,
      end_index: end,
      appointment_status: ''
    };
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.httpClient.post(this.IHL_BASE_URL + "consult/get_user_appointment_status_pagination", body, { headers });
  }

  viewConsultationHistoryPagination(start, end){
    if(this.vaptEnabled){
      let body = {
        ihl_id: this._constant.aesDecryption("userId"),
        start_index: start,
        end_index: end,
        status: 'completed'
      };
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'ApiToken':this.apiKey,
        'token':localStorage.getItem('id_token')
      });
      return this.httpClient.post(this.IHL_BASE_URL + "consult/get_user_consultation_history_pagination", body, { headers });
    }else{
      let body = {
        ihl_id: this._constant.aesDecryption("userId"),
        start_index: start,
        end_index: end,
        status: 'completed'
      };
      let headers = new HttpHeaders({
        'Content-Type': 'application/json'
      });
      return this.httpClient.post(this.IHL_BASE_URL + "consult/get_user_consultation_history_pagination", body, { headers });
    }
  }

}
