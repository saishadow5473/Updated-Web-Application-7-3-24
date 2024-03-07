import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaderResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, delay, map, switchMap, tap } from 'rxjs/operators';
import { ConstantsService } from './constants.service';
import { TeleconsultationCrossbarService } from 'src/app/services/tele-consult-crossbar.service';
import { TeleConsultService } from 'src/app/services/tele-consult.service';
import { AuthService } from 'src/app/services/auth.service';
import { AuthServiceLogin } from 'src/app/services/auth.service.login';
import { EventEmitterService } from 'src/app/services/event-emitter.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JointAccountService {

  private emailMobileHeaderToken: string = "hZH2vKcf1BPjROFM/DY0XAt89wo/09DXqsAzoCQC5QHYpXttcd5DNPOkFuhrPWcyT57DFFR9MnAdRAXoVw1j5yupkl+ps7+Z1UoM6uOrTxUBAA==";

  constructor(
    private http: HttpClient,
    private constants: ConstantsService,
    private teleConsultCrossbarService: TeleconsultationCrossbarService,
    private _teleConsultService: TeleConsultService,
    private authService: AuthService,
    private authServiceLogin: AuthServiceLogin,
    private eventEmitter: EventEmitterService,
    private snackBar: MatSnackBar
  ) { }
  private ihlBaseUrl = this.constants.ihlBaseurl;
  private vaptEnabled = this.constants.vaptEnabled;

  isEmailExists(email: any): Observable<any> {

    let params = new HttpParams();
    params = params.append("email", email);
    params = params.append("mobile", "");
    params = params.append("aadhaar", "");
    if(this.vaptEnabled){
      let body = {"id": this.constants.aesEncryptionForVAPT('2936')};
      return this.http.post(`${this.ihlBaseUrl}login/kioskLogin`,body, { headers: this.getHttpHeaders() }).pipe(
        switchMap((jsonResponse) => {
          let response = JSON.parse(JSON.stringify(jsonResponse));
          let key = response.ApiKey;
          const headers = this.getDynamicHttpHeaders(key)
          return this.http.get(`${this.ihlBaseUrl}data/emailormobileused`, { params, headers }).pipe(
            map(responseString => {
              return (responseString !== "Email ID already exists") ? true : null;
            }),
            catchError(() => {
              return of(null);
            })
          )
        }),
        catchError(() => {
          return of(null);
        })
      );
    }else{
      return this.http.get(`${this.ihlBaseUrl}login/kioskLogin?id=2936`, { headers: this.getHttpHeaders() }).pipe(
        switchMap((jsonResponse) => {
          let response = JSON.parse(JSON.stringify(jsonResponse));
          let key = response.ApiKey;
          const headers = this.getDynamicHttpHeaders(key)
          return this.http.get(`${this.ihlBaseUrl}data/emailormobileused`, { params, headers }).pipe(
            map(responseString => {
              return (responseString !== "Email ID already exists") ? true : null;
            }),
            catchError(() => {
              return of(null);
            })
          )
        }),
        catchError(() => {
          return of(null);
        })
      );
    }
  }

  isMobileExists(mobile: any): Observable<any> {
    const params = new HttpParams()
      .set("email", "")
      .set("mobile", mobile)
      .set("aadhaar", "");
    const headers = this.getHttpHeaders();
    if(this.vaptEnabled){
      let body = {"id": this.constants.aesEncryptionForVAPT('2936')};
      return this.http.post(`${this.ihlBaseUrl}login/kioskLogin`,body, { headers }).pipe(
        switchMap((jsonResponse) => {
          let response = JSON.parse(JSON.stringify(jsonResponse));
          let key = response.ApiKey;
          const headers = this.getDynamicHttpHeaders(key);
          return this.http.get(`${this.ihlBaseUrl}data/emailormobileused`, { params, headers }).pipe(
            map((responseString) => ((responseString !== "Mobile Number already exists") ? true : null)),
            //catchError(() => of(null))
          )
        }),
        catchError(() => of(null))
      )
    }else{
      return this.http.get(`${this.ihlBaseUrl}login/kioskLogin?id=2936`, { headers }).pipe(
        switchMap((jsonResponse) => {
          let response = JSON.parse(JSON.stringify(jsonResponse));
          let key = response.ApiKey;
          const headers = this.getDynamicHttpHeaders(key);
          return this.http.get(`${this.ihlBaseUrl}data/emailormobileused`, { params, headers }).pipe(
            map((responseString) => ((responseString !== "Mobile Number already exists") ? true : null)),
            //catchError(() => of(null))
          )
        }),
        catchError(() => of(null))
      )
    }
  }

  createNewJointAccountUser(userDetails: any, urlString: string): Observable<any> {
    const headers = this.getHttpHeaders();
    if(this.vaptEnabled){
      let body = {"id": this.constants.aesEncryptionForVAPT('2936')};
      return this.http.post(`${this.ihlBaseUrl}login/kioskLogin`,body, { headers }).pipe(
        switchMap((jsonResponse) => {
          if ('ApiKey' in JSON.parse(JSON.stringify(jsonResponse))) {
            let response = JSON.parse(JSON.stringify(jsonResponse));
            let apikey = response.ApiKey;
            let headers = new HttpHeaders();
            headers = headers.set('Content-Type', 'application/json');
            headers = headers.set('ApiToken', apikey);
            headers = headers.set('Token', localStorage.getItem("id_token"));
            return this.http.put(`${this.ihlBaseUrl}data/${urlString}`, userDetails, { headers });
          } else {
            return throwError('Valid token not returned');
          }
        })
      )
    }else{
      return this.http.get(`${this.ihlBaseUrl}login/kioskLogin?id=2936`, { headers }).pipe(
        switchMap((jsonResponse) => {
          if ('ApiKey' in JSON.parse(JSON.stringify(jsonResponse))) {
            let response = JSON.parse(JSON.stringify(jsonResponse));
            let apikey = response.ApiKey;
            let headers = new HttpHeaders();
            headers = headers.set('Content-Type', 'application/json');
            headers = headers.set('ApiToken', apikey);
            headers = headers.set('Token', localStorage.getItem("id_token"));
            return this.http.put(`${this.ihlBaseUrl}data/${urlString}`, userDetails, { headers });
          } else {
            return throwError('Valid token not returned');
          }
        })
      )
    }
  }

  quickUserLoginOnlyEmail(email) {
    const headers = this.getHttpHeaders();
    if(this.vaptEnabled){
      let body = {"id": this.constants.aesEncryptionForVAPT('2936')};
      return this.http.post(`${this.ihlBaseUrl}login/kioskLogin`,body, { headers }).pipe(
        switchMap((jsonResponse) => {
          if('ApiKey' in JSON.parse(JSON.stringify(jsonResponse))) {
            let response = JSON.parse(JSON.stringify(jsonResponse));
            let headers = new HttpHeaders();
            headers = headers.set('Content-Type', 'application/json');
            headers = headers.set('Token', localStorage.getItem("id_token"));
            return this.http.post(`${this.ihlBaseUrl}login/quickUserLoginOnlyEmail`, email, { headers }) 
          } else {
            return throwError('Not Valid');
          }
        })
      )
    }else{
      return this.http.get(`${this.ihlBaseUrl}login/kioskLogin?id=2936`, { headers }).pipe(
        switchMap((jsonResponse) => {
          if('ApiKey' in JSON.parse(JSON.stringify(jsonResponse))) {
            let response = JSON.parse(JSON.stringify(jsonResponse));
            let headers = new HttpHeaders();
            headers = headers.set('Content-Type', 'application/json');
            headers = headers.set('Token', localStorage.getItem("id_token"));
            return this.http.post(`${this.ihlBaseUrl}login/quickUserLoginOnlyEmail`, email, { headers }) 
          } else {
            return throwError('Not Valid');
          }
        })
      )
    }
  }

  updateMainAccountUser(userDetails: any, id: number | string): Observable<any> {
    const headers = this.getHttpHeaders();
    if(this.vaptEnabled){
      let body = {"id": this.constants.aesEncryptionForVAPT('2936')};
      return this.http.post(`${this.ihlBaseUrl}login/kioskLogin`,body, { headers }).pipe(
        switchMap((jsonResponse) => {
          if ('ApiKey' in JSON.parse(JSON.stringify(jsonResponse))) {
            let response = JSON.parse(JSON.stringify(jsonResponse));
            let apikey = response.ApiKey;
            let headers = new HttpHeaders();
            headers = headers.set('Content-Type', 'application/json');
            headers = headers.set('ApiToken', apikey);
            headers = headers.set('Token', localStorage.getItem('id_token'));
            return this.http.post(`${this.ihlBaseUrl}data/user/${id}`, userDetails, { headers });
          } else {
            return throwError('Valid token not returned');
          }
        })
      )
    }else{
      return this.http.get(`${this.ihlBaseUrl}login/kioskLogin?id=2936`, { headers }).pipe(
        switchMap((jsonResponse) => {
          if ('ApiKey' in JSON.parse(JSON.stringify(jsonResponse))) {
            let response = JSON.parse(JSON.stringify(jsonResponse));
            let apikey = response.ApiKey;
            let headers = new HttpHeaders();
            headers = headers.set('Content-Type', 'application/json');
            headers = headers.set('ApiToken', apikey);
            headers = headers.set('Token', localStorage.getItem('id_token'));
            return this.http.post(`${this.ihlBaseUrl}data/user/${id}`, userDetails, { headers });
          } else {
            return throwError('Valid token not returned');
          }
        })
      )
    }
  }

  seperateJointAccountRequest(obj: any): Observable<any> {
    const headers = this.getHttpHeaders();
    if(this.vaptEnabled){
      let body = {"id": this.constants.aesEncryptionForVAPT('2936')};
      return this.http.post(`${this.ihlBaseUrl}login/kioskLogin`,body, { headers }).pipe(
        switchMap((jsonResponse) => {
          if ('ApiKey' in JSON.parse(JSON.stringify(jsonResponse))) {
            let response = JSON.parse(JSON.stringify(jsonResponse));
            let apikey = response.ApiKey;
            let headers = new HttpHeaders();
            headers = headers.set('Content-Type', 'application/json');
            headers = headers.set('ApiToken', apikey);
            headers = headers.set('Token', localStorage.getItem('id_token'));
            return this.http.post(`${this.ihlBaseUrl}login/send_joint_account_request`, obj, { headers });
          } else {
            return throwError('Valid token not returned');
          }
        })
      )
    }else{
      return this.http.get(`${this.ihlBaseUrl}login/kioskLogin?id=2936`, { headers }).pipe(
        switchMap((jsonResponse) => {
          if ('ApiKey' in JSON.parse(JSON.stringify(jsonResponse))) {
            let response = JSON.parse(JSON.stringify(jsonResponse));
            let apikey = response.ApiKey;
            let headers = new HttpHeaders();
            headers = headers.set('Content-Type', 'application/json');
            headers = headers.set('ApiToken', apikey);
            headers = headers.set('Token', localStorage.getItem('id_token'));
            return this.http.post(`${this.ihlBaseUrl}login/send_joint_account_request`, obj, { headers });
          } else {
            return throwError('Valid token not returned');
          }
        })
      )
    }
  }

  initiateSwitchUserAccount(cred: any, _isMainAccountSwitch: boolean = false): void {
    let currentUserId = JSON.parse(this.constants.aesDecryption('userData')).id;
    let apikeyMainAcc = localStorage.getItem('apiKey');
    this.teleConsultCrossbarService.closeConnection();
    delete this._teleConsultService.nativeWindow.CRISP_TOKEN_ID;
    this._teleConsultService.nativeWindow.$crisp.push(["do", "session:reset"]);

    this.authService.globalVariableReset();
    if(this.constants.aesDecryption('user') && this.constants.aesDecryption('teleflow')){
      let joinUser =  this.constants.aesDecryption('user');
      let jointuserteleflow = this.constants.aesDecryption('teleflow'); //if the mainaccount user clicked book now in teleconsultaion stored in localstorage
      localStorage.clear();
      localStorage.setItem('user', this.constants.aesEncryption(joinUser));
      localStorage.setItem('teleflow', this.constants.aesEncryption(jointuserteleflow));
      this.constants.teleflowjoinuser = joinUser;
    }else if(this.constants.aesDecryption('teleflow') && this.constants.aesDecryption('addlinkanotheracc')){  //updated for add/link joinuser for others option
      let linkjoinuser = this.constants.aesDecryption('teleflow');
      let linkanotheracc = this.constants.aesDecryption('addlinkanotheracc');
      localStorage.clear();
      localStorage.setItem('teleflow', this.constants.aesEncryption(linkjoinuser));
      localStorage.setItem('addlinkanotheracc', this.constants.aesEncryption(linkanotheracc));
    }else {
      localStorage.clear();
    }
    localStorage.setItem('m_acc', this.constants.aesEncryption(currentUserId));
    localStorage.setItem('apiKey', apikeyMainAcc);
    // console.log(this.constants.currentUserId);
    this.authService.LastCheckin = [];
    this.ihlUserLogin(cred, _isMainAccountSwitch);
  }

  ihlUserLogin(credentials, _isMainAccountSwitch): void {

    let user: any = {
      id: credentials.id
    }

    let obs: any = "";
    this.authServiceLogin.getAPItokenKey().subscribe(data => {
      let apiKey = data["ApiKey"]
      localStorage.setItem('apiKey', data["ApiKey"]);

      if (_isMainAccountSwitch) {
        /*user = {
          "password": this.constants.mainUserAccountCredentials.password,
          "encryptionVersion": null,
          "email": this.constants.mainUserAccountCredentials.email
        }*/
        user = {
          id: this.constants.mainUserAccountCredentials.id
        }
        obs = this.authServiceLogin.authenticateIhlId(user, apiKey);
      }
      else {
        user = {
          id: credentials.id
        }
        obs = this.authServiceLogin.authenticateIhlId(user, apiKey);
      }

      obs.subscribe(data => {

        if (data != undefined && data !== null && data != "Object reference not set to an instance of an object.") {
          if ((data["User"]["email"] != undefined && data["User"]["email"] != null && data["User"]["email"].toString().length > 0) || (data["User"]["mobileNumber"] != undefined && data["User"]["mobileNumber"] != null && data["User"]["mobileNumber"].toString().length == 10)) {
            if (data["User"]["id"] == this.constants.mainUserAccountCredentials.id) {
              this.constants._isDependentUserAccount = false;
              this.authServiceLogin.storeUserDataIhl(data["Token"], data["User"], data["LastCheckin"]);
              return;
            }
            this.constants._isDependentUserAccount = false;
            this.authService.globalVariableReset();
            if(this.constants.aesDecryption('isjointuserlogin')){           //to store common variable for redirect after teleconsutation once jointuser account switched
              let joinuserlogin = this.constants.aesDecryption('isjointuserlogin')
              localStorage.clear();
              this.authService.LastCheckin = [];
              window.location.href = "../index.html";
              localStorage.setItem('isjointuserlogin', this.constants.aesEncryption(joinuserlogin));
            }
            localStorage.clear();
            this.authService.LastCheckin = [];
            window.location.href = "../index.html";
          } else {
            this.constants._isDependentUserAccount = true;
            this.authServiceLogin.storeUserDataIhl(data["Token"], data["User"], data["LastCheckin"]);
            console.log(this.constants.mainUserAccountCredentials);
          }
        } else {
          this.snackBar.open("Invalid user credentials", '', {
            duration: 10000,
            panelClass: ['error'],
          });
          this.authService.globalVariableReset();
          localStorage.clear();
          this.authService.LastCheckin = [];
          window.location.href = "../index.html";
        }
      })

    })
  }

  public onUnLinkGuestUserConfirmation(msg: any): any {
    this.eventEmitter._isUnLinkJointUser.emit(msg);
  }

  getHttpHeaders(): any {
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("ApiToken", this.emailMobileHeaderToken);
    return headers;
  }

  getDynamicHttpHeaders(value): any {
    let headers = new HttpHeaders();
    headers = headers.append("Content-Type", "application/json");
    headers = headers.append("ApiToken", value);
    return headers;
  }
}
