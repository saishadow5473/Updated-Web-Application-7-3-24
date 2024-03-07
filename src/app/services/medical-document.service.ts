import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject  } from 'rxjs';
import { ConstantsService } from './constants.service';

@Injectable({
  providedIn: 'root'
})
export class MedicalDocumentService {
  IHL_BASE_URL = this._constant.ihlBaseurl;
  vaptEnabled = this._constant.vaptEnabled;
  private documentShareSubject = new BehaviorSubject<any[]>([]);
  readonly observedValue = this.documentShareSubject.asObservable();

  constructor(
    private httpClient: HttpClient,
    private _constant: ConstantsService
  ) { }

  public uploadFiles(data: any): Observable<any>{
    let headers = new HttpHeaders();
    return this.httpClient.post(`${this.IHL_BASE_URL}consult/upload_medical_document`, data, { reportProgress: true, observe: "events"});
  }

  public uploadFilesForVapt(data: any, CToken: any): Observable<any>{
    // let headers = new HttpHeaders();
    // return this.httpClient.post(`${this.IHL_BASE_URL}consult/upload_medical_document`, data, { reportProgress: true, observe: "events"});
    let headers = new HttpHeaders()
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('ApiToken', localStorage.getItem('api_header_token') || localStorage.getItem('apiKey'));
    headers = headers.append('Token', localStorage.getItem('id_token'));
    headers = headers.append('X-XSRF-TOKEN', CToken);
    return this.httpClient.post(`${this.IHL_BASE_URL}consult/upload_medical_document`, data, {headers:headers,  reportProgress: true, observe: "events"});
  }

  public getAllMedicalFiles(data: any): Observable<any>{
    if(this.vaptEnabled){
      let headers = new HttpHeaders();
      headers = headers.append('ApiToken', localStorage.getItem('api_header_token') || localStorage.getItem('apiKey'));
      headers = headers.append('Token', localStorage.getItem('id_token'));
      return this.httpClient.post(`${this.IHL_BASE_URL}consult/view_user_medical_document`, data, {headers});
    }else{
      let headers = new HttpHeaders();
      return this.httpClient.post(`${this.IHL_BASE_URL}consult/view_user_medical_document`, data, {headers});
    }
  }

  public deleteSeletectedFile(data: any): Observable<any>{
    if(this.vaptEnabled){
      let headers = new HttpHeaders();
      headers = headers.append('ApiToken', localStorage.getItem('api_header_token') || localStorage.getItem('apiKey'));
      headers = headers.append('Token', localStorage.getItem('id_token'));
      return this.httpClient.post(`${this.IHL_BASE_URL}consult/delete_medical_document`, data, {headers});
    }else{
      let headers = new HttpHeaders();
      return this.httpClient.post(`${this.IHL_BASE_URL}consult/delete_medical_document`, data, {headers});
    }
  }

  public selectedDocumentedId(data: any[]): void{
    this.documentShareSubject.next(Object.assign([], data));
  }

  public getselectedDocumentedId(): any{
    let data: any = "";
    this.observedValue.subscribe((val)=>{
      data =  val;
    });
    return data;
  }
}
