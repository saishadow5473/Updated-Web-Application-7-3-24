import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators'
import { Router } from '@angular/router'
import { ConstantsService } from 'src/app/services/constants.service';
import { AuthService } from 'src/app/services/auth.service';
import { Observable, throwError, Subject } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { TeleConsultService } from 'src/app/services/tele-consult.service';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceLogin {

  constructor(
     private http: HttpClient,
     private router: Router,
     private _constants: ConstantsService,
    private _authService: AuthService,
    private _teleConsultService:TeleConsultService
  ) {

  }

  IHL_BASE_URL = this._constants.ihlBaseurl;
  vaptEnabled = this._constants.vaptEnabled;
  BASE_URL = "https://ihl-web-portal.herokuapp.com/api/";
  ihlToken = 'hZH2vKcf1BPjROFM/DY0XAt89wo/09DXqsAzoCQC5QHYpXttcd5DNPOkFuhrPWcyT57DFFR9MnAdRAXoVw1j5yupkl+ps7+Z1UoM6uOrTxUBAA==';
  authToken: string;
  user: any;
  apiKey: string;

   fetchUser(username){
    let headers : HttpHeaders = this.getBearerHeaders()
    return this.http.get(this.BASE_URL+'users/'+username, {headers: headers}).pipe(map(res => res/*.json()*/));
  }

  fetchBadge(username){
    let headers : HttpHeaders = this.getBearerHeaders()
    return this.http.get(this.BASE_URL+'users/'+username+"/badges", {headers: headers}).pipe(map(res => res/*.json()*/));
  }

  authenticate(user){
    let headers : HttpHeaders = this.getBearerHeaders()
    return this.http.post(this.BASE_URL+'authToken/', user, {headers: headers}).pipe(map(res => res/*.json()*/));
  }

  authenticateIhlForVapt(user, apiKey, CToken):Observable<any>{
    let headers = new HttpHeaders()
    headers = headers.append('ApiToken', apiKey);
    headers = headers.append('X-XSRF-TOKEN', CToken);
    return this.http.post(this.IHL_BASE_URL+'login/qlogin2',user,{headers: headers});
  }

  authenticateIhl(user, apiKey):Observable<any>{
    let headers : HttpHeaders = this.getBearerHeadersIhl()
    if(localStorage.getItem('apiKey') == undefined){
      headers['ApiToken'] = apiKey;
    }

    return this.http.post(this.IHL_BASE_URL+'login/qlogin2',user,{headers: headers});
  }

  authenticateIhlId(user, apiKey): Observable<any> {
    let headers: HttpHeaders = this.getBearerHeadersIhl()
    if (localStorage.getItem('apiKey') == undefined) {
      headers['ApiToken'] = apiKey;
    }

    return this.http.post(this.IHL_BASE_URL + 'login/get_user_login', user, { headers: headers });
  }


  fetchMetrics(username, vital){
    let headers : HttpHeaders = this.getBearerHeaders()
    return this.http.get(this.BASE_URL+'users/'+username+'/metrics/'+vital, {headers: headers}).pipe(map(res => res/*.json()*/));
  }

  getBearerHeaders(){
    let headers = new HttpHeaders()
    const token = 'bearer ' + localStorage.getItem('id_token');
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('Authorization', token);
    if(!this.apiKey){
      this.getApiKey();
    }
    headers = headers.append('ApiToken', this.apiKey);
    return headers
  }

  getBearerHeadersIhl(){
    let headers = new HttpHeaders()
    const token = 'bearer ' + localStorage.getItem('id_token');
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('Token', token);
    if(!this.apiKey){
      this.getApiKey();
    }

    headers = headers.append('ApiToken', this.apiKey);
    return headers
  }

  getApiKey() {
    const apiKey = localStorage.getItem('apiKey');
    if(!apiKey){
      let apiKeyHeader = new HttpHeaders();
      apiKeyHeader = apiKeyHeader.append('ApiToken', this.ihlToken);
      if(this.vaptEnabled){
        let body = {"id": this._constants.aesEncryptionForVAPT('2936')};
        return this.http.post(this.IHL_BASE_URL+'login/kioskLogin', body, {headers: apiKeyHeader}).subscribe(data => {
          this.apiKey = data["ApiKey"]
          localStorage.setItem('apiKey',data["ApiKey"]);
        })
      }else{
        this.http.get(this.IHL_BASE_URL+'login/kioskLogin?id=2936',{headers: apiKeyHeader}).subscribe(data => {
          this.apiKey = data["ApiKey"]
          localStorage.setItem('apiKey',data["ApiKey"]);
        })
      }
    }
    else{
      this.apiKey = apiKey;
    }

  }

  getCToken(apiKey): Observable<any> {
    this.apiKey = apiKey;
    let headers: HttpHeaders = this.getBearerHeadersIhl()
    return this.http.get(this.IHL_BASE_URL + '/login/getCToken', { headers: headers }).pipe(map(res => res/*.json()*/));
  }

  logOut(userId){
    let headers = new HttpHeaders()
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('ApiToken', localStorage.getItem('api_header_token') || localStorage.getItem('apiKey'));
    let text = {
      "ihl_user_id": userId,
      "logout_from":"portal"//portal||mobile||all
    }
    return this.http.post(this.IHL_BASE_URL +"/login/logout", text, {headers}).pipe(map(res => res));
  }
  
  getAPItokenKeyForVapt(){
    let myHeaders = new HttpHeaders();
    myHeaders = myHeaders.append('content-type','application/text');
    myHeaders = myHeaders.append('Access-Control-Allow-Origin', '*');
    myHeaders = myHeaders.append('ApiToken', this.ihlToken);
    let body = {"id": this._constants.aesEncryptionForVAPT('2936')};
    return this.http.post(this.IHL_BASE_URL+'login/kioskLogin', body, {headers: myHeaders});
  }

  getAPItokenKey(){
    let apiKeyHeader = new HttpHeaders();
    apiKeyHeader = apiKeyHeader.append('ApiToken', this.ihlToken);
    if(this.vaptEnabled){
      let body = {"id": this._constants.aesEncryptionForVAPT('2936')};
      return this.http.post(this.IHL_BASE_URL+'login/kioskLogin', body, {headers: apiKeyHeader});
    }else{
      return this.http.get(this.IHL_BASE_URL+'login/kioskLogin?id=2936',{headers: apiKeyHeader});
    }
  }

  registerAccountForVapt(user, CToken){
    let headers = new HttpHeaders()
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('ApiToken', localStorage.getItem('api_header_token') || localStorage.getItem('apiKey') || 'hZH2vKcf1BPjROFM/DY0XAt89wo/09DXqsAzoCQC5QHYpXttcd5DNPOkFuhrPWcyT57DFFR9MnAdRAXoVw1j5yupkl+ps7+Z1UoM6uOrTxUBAA==');
    //headers = headers.append('Token', localStorage.getItem('id_token'));
    headers = headers.append('X-XSRF-TOKEN', CToken);
    return this.http.put(this.IHL_BASE_URL+"data/user",user, {headers: headers});
  }

  storeUserData(token, user){
    localStorage.setItem('id_token', token);
    // delete user.healthData
    localStorage.setItem('user', this._constants.aesEncryption(user));
    this.authToken = token;
    this.user = user;
  }

  storeLoginUserRecord(user, type){
    let jsonData = {
      "ihl_user_id": user.id,  //mandatory
      "login_type": type,   // sso, password  //mandatory
      "login_source": "web"    // web, moblie, kiosk    //mandatory      
    }
    return this.http.post(this.IHL_BASE_URL + 'ihlanalytics/store_and_update_login_user_record', jsonData);
  }

  storeUserDataIhl(token, user, healthData){

    localStorage.setItem('id_token', token);
    localStorage.setItem('userData', this._constants.aesEncryption(JSON.stringify(user)));
    localStorage.setItem('firstName', this._constants.aesEncryption(user["firstName"]));
    localStorage.setItem('lastName', this._constants.aesEncryption(user["lastName"]));
    localStorage.setItem('userId', this._constants.aesEncryption(user["id"]));
    localStorage.setItem('email', this._constants.aesEncryption(user["email"]));
    localStorage.setItem('isUserLoggedIn', this._constants.aesEncryption('true'));

    //this._teleConsultService.nativeWindow.$crisp.push(["do", "session:reset"]);
    //this._teleConsultService.nativeWindow.CRISP_TOKEN_ID = user["email"];
    this._teleConsultService.nativeWindow.CRISP_TOKEN_ID = "253cd617-5a8f-4963-85b3-77ab91687196";
    this._teleConsultService.nativeWindow.$crisp.push(["set", "user:nickname", [user["firstName"] + user["lastName"]]]);
    if (user["email"] != undefined && user["email"] != null &&  user["email"].toString().length > 0) {
      this._teleConsultService.nativeWindow.$crisp.push(["set", "user:email", [user["email"]]]);
    }


    /*localStorage.setItem('score',user["higiScore"]);
     localStorage.setItem('height', user["heightMeters"])
    localStorage.setItem('weight', user["user_entered_weight"])
    localStorage.setItem('usersDateOfBirth' , user["dateOfBirth"]); */
    //localStorage.setItem('height', '1.9785657')
    //localStorage.setItem('weight', '78.9865')

    if('userData' in localStorage) {
      let userData = JSON.parse(this._constants.aesDecryption('userData'));
      let obj:any;
      for(obj in userData['user_affiliate']) {
        //console.log(obj);
        for(let index in userData['user_affiliate'][obj]) {
          //console.log(index);
          if(index == "affilate_name" || index == "affilate_unique_name"){
            if(userData['user_affiliate'][obj][index] === "") {
              userData['user_affiliate'][obj] = null;
              localStorage.setItem('userData', this._constants.aesEncryption(JSON.stringify(userData)));
              this._constants.isAffiliatedUser = false;
              break;
            }
        }
      }
    }

    if (user["mobileNumber"] !== null &&  user["mobileNumber"] !== undefined) {
      localStorage.setItem('editMobile', this._constants.aesEncryption(user["mobileNumber"]));
    }

    if (user["affiliate"] != null &&  user["affiliate"] != undefined &&  user["affiliate"] != "") {
      localStorage.setItem('affiliateProgram', this._constants.aesEncryption(user["affiliate"]));
    }

    if (user["affliate_program_approval"] != null &&  user["affliate_program_approval"] != undefined &&  user["affliate_program_approval"] != "") {
      localStorage.setItem('affliateProgramApproval', this._constants.aesEncryption(user["affliate_program_approval"]));
    }

    if (user["affiliate_program_name"] != null &&  user["affiliate_program_name"] != undefined &&  user["affiliate_program_name"] != "") {
      localStorage.setItem('affiliateProgramName', this._constants.aesEncryption(user["affiliate_program_name"]));
    }

    if (user["mobileNumber"] != null &&  user["mobileNumber"] != undefined &&  user["mobileNumber"] != "") {
      localStorage.setItem('affiliatemobileNumber', this._constants.aesEncryption(user["mobileNumber"]));
    }

    if(healthData == undefined){

      //dateOfBirth gender heightMeters user_entered_weight
      if(user["dateOfBirth"] == undefined || user["gender"] == undefined || user["heightMeters"] == undefined || user["userInputWeightInKG"] == undefined){
        this.router.navigate(['export']);
        return 0;
      }

      localStorage.setItem('height', user["heightMeters"]);
      localStorage.setItem('weight', user["userInputWeightInKG"]);

      let userHealthQuestion  = this.getSurveyQuestions();
      if(userHealthQuestion.length > 0){
        let affiliatesOrganisationName = user["affiliate"];
        let affiliatesUsersProgramName = user["affiliate_program_name"];
        let affiliatesUsersProgramApproval = user["affliate_program_approval"];
        if(affiliatesOrganisationName !== undefined && affiliatesOrganisationName !== null && affiliatesOrganisationName !== "" && affiliatesUsersProgramName !== undefined && affiliatesUsersProgramName !== null && affiliatesUsersProgramName !== "" && affiliatesUsersProgramApproval == "True"){
          var org;
          if(affiliatesOrganisationName == "Dimension"){
            org = "dimension";
          }else{
            org = affiliatesOrganisationName;
          }
          var req = '{"affiliate_name": "'+org+'","affiliate_program_name":"'+affiliatesUsersProgramName+'"}';
          this.metricesInput(req).subscribe((response: any) =>{
            var initialResponse = JSON.parse(response.replace(/&quot;/g,'"'));
            this._constants.loggedInMetricsObject = initialResponse;
          });
        }

        if(this._constants.aesDecryption('user')){
          let isjointuserlogin = 'true';
          localStorage.setItem('isjointuserlogin', this._constants.aesEncryption(isjointuserlogin));
          this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
              this.router.navigate(['teleconsultation']);
          });
        }

        if(this._constants.aesDecryption('teleflow') && this._constants.aesDecryption('addlinkanotheracc')){
          this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
            this.router.navigate(['teleconsultation']);
          });
        }

        if(this.router.url ==  '/takesurvey'){
          this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
              this.router.navigate(['takesurvey']);
          });

        }else{
          this.router.navigate(['takesurvey']);
        }


      } else {
        let affiliatesOrganisationName = user["affiliate"];
        let affiliatesUsersProgramName = user["affiliate_program_name"];
        let affiliatesUsersProgramApproval = user["affliate_program_approval"];
        if(affiliatesOrganisationName !== undefined && affiliatesOrganisationName !== null && affiliatesOrganisationName !== "" && affiliatesUsersProgramName !== undefined && affiliatesUsersProgramName !== null && affiliatesUsersProgramName !== "" && affiliatesUsersProgramApproval == "True"){
          var org;
          if(affiliatesOrganisationName == "Dimension"){
            org = "dimension";
          }else{
            org = affiliatesOrganisationName;
          }
          var req = '{"affiliate_name": "'+org+'","affiliate_program_name":"'+affiliatesUsersProgramName+'"}';
          this.metricesInput(req).subscribe((response: any) =>{
            var initialResponse = JSON.parse(response.replace(/&quot;/g,'"'));
            this._constants.loggedInMetricsObject = initialResponse;
          });
        }

        if(this._constants.aesDecryption('user')){
          let isjointuserlogin = 'true';
          localStorage.setItem('isjointuserlogin', this._constants.aesEncryption(isjointuserlogin));
          this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
              this.router.navigate(['teleconsultation']);
          });
        } else{
          this.router.navigate(['dashboard']);
        }
      }
    } else {
     // localStorage.setItem('healthData', JSON.stringify(healthData));
      localStorage.setItem('Age', this._constants.aesEncryption(healthData["Age"]));

      let affiliatesOrganisationName = user["affiliate"];
      let affiliatesUsersProgramName = user["affiliate_program_name"];
      let affiliatesUsersProgramApproval = user["affliate_program_approval"];
      if(affiliatesOrganisationName !== undefined && affiliatesOrganisationName !== null && affiliatesOrganisationName !== "" && affiliatesUsersProgramName !== undefined && affiliatesUsersProgramName !== null && affiliatesUsersProgramName !== "" && affiliatesUsersProgramApproval == "True"){
        var org;
        if(affiliatesOrganisationName == "Dimension"){
          org = "dimension";
        }else{
          org = affiliatesOrganisationName;
        }
        var req = '{"affiliate_name": "'+org+'","affiliate_program_name":"'+affiliatesUsersProgramName+'"}';
        this.metricesInput(req).subscribe((response: any) =>{
          var initialResponse = JSON.parse(response.replace(/&quot;/g,'"'));
          this._constants.loggedInMetricsObject = initialResponse;
        });
      }
      // check bmi test taken
      // if not not taken check userEnterWeight
      // if not there userEnterWeight redirected to edit profile page
      //
      this._authService.weightInputCheckForBMiCal();

      if(this._constants.aesDecryption('teleCall') ==  'true') {
          this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
              this.router.navigate(['teleconsultation']);
          });
      } else {
        this.router.navigate(['dashboard']);
      }
    }

    this.authToken = token;
    this.user = user;
  }}

  getToken(){
    const token = localStorage.getItem('id_token');
    if(!token) return false
    return token
  }

  getUser(){
    const user = this._constants.aesDecryption('user');
    if(!user) return undefined
    return user
  }

  getInviteLink(id){
    let headers : HttpHeaders = this.getBearerHeaders()
    return this.http.get(this.BASE_URL+'playgrounds/'+id+'/inviteLink', {headers: headers}).pipe(map(res => res/*.json()*/));
  }

  getPlaygrounds(username){
    let headers : HttpHeaders = this.getBearerHeaders()
    return this.http.get(this.BASE_URL+'users/'+username+'/playgrounds', {headers: headers}).pipe(map(res => res/*.json()*/));
  }

  getPlaygroundFromId(id){
    let headers : HttpHeaders = this.getBearerHeaders()
    return this.http.get(this.BASE_URL+'playgrounds/'+id, {headers: headers}).pipe(map(res => res/*.json()*/));
  }

  getUsersFromPlayground(id){
    let headers : HttpHeaders = this.getBearerHeaders()
    return this.http.get(this.BASE_URL+'playgrounds/'+id+'/users', {headers: headers}).pipe(map(res => res/*.json()*/));
  }

  isLoggedIn(){
    let body = {username: this.getUser(), token: this.getToken()}
    //console.log(body);

    let headers : HttpHeaders = this.getBearerHeaders()
    return this.http.post(this.BASE_URL+'authToken/authenticate', body, {headers: headers}).pipe(map(res => res/*.json()*/));
  }
  isLoggedInIhl() {
    const token = localStorage.getItem('id_token');
    if (token) {
      return true;
    }
    else {
      return false;
    }
  }

  getAffiliateProgram(jsontext22){
    let headers : HttpHeaders = this.getBearerHeadersAffiliate()
    return this.http.post(this.IHL_BASE_URL+'data/affiliate_programs',jsontext22, {headers: headers}).pipe(map(res => res/*.json()*/));
  }

  getBearerHeadersAffiliate(){
    let headers = new HttpHeaders()
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('ApiToken', this.ihlToken);
    return headers
  }

  postSelectedProgram(email: string,firstName: string,lastName: string,age: string,programSelect: string,mobileNumber: string){
    let headers : HttpHeaders = this.getBearerHeadersProgramSelect()
    return this.http.post(this.IHL_BASE_URL+"login/SendAutoProgramApprovalEmail/toEmail/thamaraiselvan@indiahealthlink.com/userEmail/"+email+"/name/"+firstName+" "+lastName+"/age/"+age+"/program/"+programSelect+"/mobileNumber/"+mobileNumber+"/",null, {headers: headers}).pipe(map(res => res/*.json()*/));
  }

  getBearerHeadersProgramSelect(){
    let headers = new HttpHeaders()
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('ApiToken', '32iYJ+Lw/duU/2jiMHf8vQcmtD4SxpuKcwt7n/ej5dgvZPUgvHaYQHPRW3nh+GT+N9bfMEK5fofdt9AfA6T9S3BnDHVe0FvUYuPmnMO0WGQBAA==');
    return headers
  }

  getMetricsInput(jsontext){
    let headers : HttpHeaders = this.getBearerHeadersProgramSelect()
    return this.http.post(this.IHL_BASE_URL+'data/affiliate',jsontext, {headers: headers}).pipe(map(res => res/*.json()*/));
  }

  postMetricsInput(apiKey,IHLUserToken,IHLUserId,emailIsThis,stringCheckin) : Observable<any>{
    let headers = new HttpHeaders()
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('ApiToken', apiKey);
    headers =  headers.append('Token', IHLUserToken);
    return this.http.put(this.IHL_BASE_URL+"/data/user/"+IHLUserId+"/checkIn/?email=" + encodeURIComponent(emailIsThis),stringCheckin, {headers: headers}).pipe(map(res => res/*.json()*/),catchError((error: any) => {
      if (error.status === 417 || error.status === 400) {
          return Observable.throw(new Error(error.status));
      }else{
        return Observable.throw(new Error(error.status));
      }
  }))
  }

  metricesInput(req){
    let headers : HttpHeaders = this.getBearerHeadersProgramSelect()
    return this.http.post(this.IHL_BASE_URL+'data/affiliate',req, {headers: headers}).pipe(map(res => res/*.json()*/));
  }

  PreferedQues = [];
  getSurveyQuestions(){

    this.PreferedQues = this.filterQuestions();
    //this.PreferedQues = [ "A1", "A2", "A3", "A4", "A5", "A6", "A7", "A8", "B1", "B2", "B3", "B4", "C1", "C2", "C3", "C4", "C5", "D1", "D2", "D3", "D4"];
    //this.PreferedQues = [ "A5", "D3", "D4"];

   /*  if(localStorage.getItem("withKiosk") == "true"){
      this.ArrayValueCheck("A3"); // bp
      this.ArrayValueCheck("A4"); // bmi
      this.ArrayValueCheck("A5");// BMC
      this.ArrayValueCheck("A8"); // pulse
    } else {
      if(this.PreferedQues.indexOf("A4") !== -1){
        this.PreferedQues = this.PreferedQues.filter(obj => obj !== "A4");
        this.A4QuestionSubmit();
      }
    }    */

    if(this.PreferedQues.indexOf("A4") !== -1){
      this.PreferedQues = this.PreferedQues.filter(obj => obj !== "A4");
      this.A4QuestionSubmit();
    }

    console.log( this.PreferedQues);
    //this.PreferedQues = [];
    return this.PreferedQues;
  }

  ArrayValueCheck(val){
    if(this.PreferedQues.indexOf(val) !== -1){
      this.PreferedQues = this.PreferedQues.filter(obj => obj !== val);
    }
  }

  A4QuestionSubmit(){
    let user = JSON.parse(this._constants.aesDecryption('userData'));
    console.log(user);
    console.log(user['heightMeters']);

    let userWeight;

    if(this._authService.WEIGHT.length > 0){
      userWeight = this._authService.WEIGHT[this._authService.WEIGHT.length-1].weightKG;
    } else {
      userWeight = user['userInputWeightInKG'];
    }


    let bmiVal = this.calculateBmi(user['heightMeters'], userWeight, 2);

    let ihl_answer = {};
    ihl_answer["QA4"] = this.calculateBmiRisk(bmiVal);

    console.log(ihl_answer);

    this.takeSurveyAnswer(ihl_answer).subscribe(data =>  {
      console.log(data);
      let finalData:any;
      if(data != ""){
        data = JSON.parse(data.replace(/&quot;/g, '\\"'));
        finalData = data;

        if(typeof finalData === "string"){
          localStorage.setItem("surveyScore", this._constants.aesEncryption(finalData));
          this.scoreFetch();
          this.publish('score-update');
        }
      }
    })
  }
  calculateBmi(weightInKilograms, heightInMeters, precision){
    let result = weightInKilograms / Math.pow(heightInMeters, 2);
    return result.toFixed(precision);
  }

  calculateBmiRisk(bmi){
    if (bmi < 18.5) {
        return 'underweight';
    }
    else if (bmi >= 18.5 && bmi <= 22.99) {
        return 'normal';
    }
    else if (bmi >= 23 && bmi <= 27.5) {
        return 'overweight';
    }
    else if (bmi > 27.5) {
        return 'obese';
    }
    else {
        return 'dont_know';
    }
  }

   takeSurveyAnswer(answer){
    let userData = JSON.parse(this._constants.aesDecryption("userData"));
    let headers : HttpHeaders = this.getBearerHeadersIhl();
    return this.http.post(this.IHL_BASE_URL+'/login/submit_answers?id='+userData.id,answer,{headers: headers, responseType: 'text'}).pipe(map(res => res/*.json()*/));
  }

 scoreFetch(){
  let ihlQuestionScore = JSON.parse(this._constants.aesDecryption('userData'));
  let quest = [];
  let questIndex = 0;
  let score = 0;
  let questionComptionStatus: boolean = false;
  if(ihlQuestionScore != undefined){
    if(this._constants.aesDecryption("surveyScore") != undefined){
      quest = this.objectFilter(JSON.parse(this._constants.aesDecryption("surveyScore")));
      let getScore = JSON.parse(this._constants.aesDecryption("surveyScore"));
      score = getScore.T;
      if(quest.length > 0){
        questionComptionStatus = false;
      } else {
        questionComptionStatus = true;
      }
    }else if(ihlQuestionScore.user_score != undefined){
      quest = this.objectFilter(ihlQuestionScore.user_score);
      score = ihlQuestionScore.user_score.T;
      if(quest.length > 0){
        questionComptionStatus = false;
      } else {
        questionComptionStatus = true;
      }
    } else {
      questionComptionStatus = false;
      score = 0;
    }
  }
  this._constants.takeSurveyScore = score;
  this._constants.takeSurveyScoreShow = questionComptionStatus;

  return ({"score":score, "questionComptionStatus": questionComptionStatus });
 }

 private subjects = [];


  publish(eventName: string) {
    console.log(eventName);
  // ensure a subject for the event name exists
  this.subjects[eventName] = this.subjects[eventName] || new Subject();

  // publish event
  let Res = this.subjects[eventName].next();
  console.log(Res);
  }

  on(eventName: string): Observable<any> {
  // ensure a subject for the event name exists
  this.subjects[eventName] = this.subjects[eventName] || new Subject();
  // return observable
  return this.subjects[eventName].asObservable();
  }

  filterQuestions(){
    let ihlQuestionScore = JSON.parse(this._constants.aesDecryption('userData'));
   // console.log(ihlQuestionScore.user_score);
    let quest = [];
    let questIndex = 0;
    if(ihlQuestionScore != undefined){
      if(this._constants.aesDecryption("surveyScore") != undefined){
        quest = this.objectFilter(JSON.parse(this._constants.aesDecryption("surveyScore")));
      }else if(ihlQuestionScore.user_score != undefined){
        quest = this.objectFilter(ihlQuestionScore.user_score);
      } else {
        quest = [ "A1", "A2", "A3", "A4", "A5", "A6", "A7", "A8", "B1", "B2", "B3", "B4", "C1", "C2", "C3", "C4", "C5", "D1", "D2", "D3", "D4"];
      }
  }
    console.log(quest);
    return quest;
  }

  objectFilter(user_score){
    let quest = [];
    let questIndex = 0;
    Object.keys(user_score).forEach(key => {
      if(user_score[key] == 0){
        if(key.includes("A") || key.includes("B") || key.includes("C") || key.includes("D")){
          quest[questIndex] = key;
          questIndex++;
        }
      }
    });
    console.log(quest);
    return quest;
  }

  forgotPassword(email){
    let headers = new HttpHeaders()
    headers = headers.append('ApiToken', '32iYJ+Lw/duU/2jiMHf8vQcmtD4SxpuKcwt7n/ej5dgvZPUgvHaYQHPRW3nh+GT+N9bfMEK5fofdt9AfA6T9S3BnDHVe0FvUYuPmnMO0WGQBAA==');
    return this.http.get(this.IHL_BASE_URL+"login/passreset?email="+email, {headers: headers});
  }

  forgotPasswordForVapt(email, CToken) {
    let headers = new HttpHeaders()
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('ApiToken', localStorage.getItem('api_header_token') || localStorage.getItem('apiKey'));
    headers = headers.append('X-XSRF-TOKEN', CToken);

    const forEmail = {
      email: email
    }
    return this.http.post(this.IHL_BASE_URL+"login/passreset", forEmail, {headers: headers}).pipe(map(res => res));
  }

  registerAccount(user){
    let headers = new HttpHeaders()
    headers = headers.append('ApiToken', 'hZH2vKcf1BPjROFM/DY0XAt89wo/09DXqsAzoCQC5QHYpXttcd5DNPOkFuhrPWcyT57DFFR9MnAdRAXoVw1j5yupkl+ps7+Z1UoM6uOrTxUBAA==');
    return this.http.put(this.IHL_BASE_URL+"data/user",user, {headers: headers});
  }

  checkMobileExistsOrNot(emailIsThis,mobileIsThis,aadhaarIsThis, apiKey) : Observable<any>{
    let headers = new HttpHeaders()
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('ApiToken', apiKey);
    return this.http.get(this.IHL_BASE_URL+"data/emailormobileused?email=" + emailIsThis + "&mobile=" + mobileIsThis + "&aadhaar=" + aadhaarIsThis,{headers: headers}).pipe(map(res => res/*.json()*/));
  }

  getAffiliateUserDetails(endPointUrl){
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    return this.http.get(this.IHL_BASE_URL + endPointUrl, {headers: headers}).pipe(map(res => res/*.json()*/));
  }

  sendOtpViaSmsAndEmail(email, mobile) {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    return this.http.get(this.IHL_BASE_URL +"login/send_email_and_sms_otp_verify?email=" + email + "&mobile=" + mobile, {headers: headers}).pipe(map(res => res));
  }

  addAffiliatedUserDetails(userId, parms) {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('ApiToken', parms['TokenInfo']['ApiToken']);
    headers =  headers.append('Token', parms['TokenInfo']['Token']);
    return this.http.post(this.IHL_BASE_URL+"data/user/"+userId, parms['data'], {headers: headers}).pipe(map(res => res));
  }

  checkEmailExistForVapt(email) {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('ApiToken', localStorage.getItem('api_header_token') || localStorage.getItem('apiKey'));

    let param = { email: email };
    return this.http.post(this.IHL_BASE_URL +"/login/accountexists", param, {headers: headers}).pipe(map(res => res));
  }

  checkMobileExistForVapt(mobile) {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('ApiToken', localStorage.getItem('api_header_token') || localStorage.getItem('apiKey'));

    let param = {mobile: mobile};
    return this.http.post(this.IHL_BASE_URL +"/login/accountexists", param, {headers: headers}).pipe(map(res => res));
  }

  checkEmailExist(email) {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    return this.http.get(this.IHL_BASE_URL +"/data/emailormobileused?email=" + email + "&mobile=" + '' + "&aadhaar=" + '', {headers: headers}).pipe(map(res => res));
  }
  ssoRegisterAccount(user){
    let headers = new HttpHeaders()
    headers = headers.append('ApiToken', 'VYcLOWACBK6yEhC4bJ0D1JrX/Lb11Ij97jeEcBge8D881x5PvG/1KYrTkYS6K2qWTKgkCZP35L+kiIgdFaT0imQy8teYAWIAUPT0vUxdbQwBAA==');
    return this.http.post(this.IHL_BASE_URL+"sso/create_sso_user_account",user, {headers: headers});
  }
  checkMobileExist(mobile) {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    return this.http.get(this.IHL_BASE_URL +"/data/emailormobileused?email=" + '' + "&mobile=" + mobile + "&aadhaar=" + '', {headers: headers}).pipe(map(res => res));
  }

  ssoOrganizationName(orgName){
    return this.http.get(this.IHL_BASE_URL +"consult/list_of_aff_starts_with?search_string=" + orgName + "&ihl_user_id=" + "N6wKpKGxoUS0TlVpoU81tw");
  }

  ssoPersonalEmail(mail){
   return this.http.get(this.IHL_BASE_URL + "sso/personal_email_check?email=" + mail);
  }

  orgUserDataSharePermission(accessData){

  }

  validateSSOToken(data){
    let body = JSON.stringify(data);
    let headers = {};
    return this.http.post(this.IHL_BASE_URL + "sso/login_sso_user_account_v1", body, {headers: headers}).pipe(map(res => res/*.json()*/));
  }

  sendOtpVerificationToUserByEmail(email) {
    let headers = {};
    return this.http.get(this.IHL_BASE_URL + "login/send_registration_otp_verify?email=" + email + "&mobile="+ '' +"&from=portal", {headers: headers}).pipe(map(res => res/*.json()*/));
  }
  sendOtpVerificationToUserByEmailOrNumber(data) {
    let headers = {};
    let email = data.email;
    let mobile = data.mobile;
    return this.http.get(this.IHL_BASE_URL + "login/send_registration_otp_verify?email=" + email + "&mobile="+ mobile +"&from=portal", {headers: headers}).pipe(map(res => res/*.json()*/));
  }
  getSSOUserByIhlId(data) {
    let headers = {};
    let body = JSON.stringify(data);
    return this.http.post(this.IHL_BASE_URL + "sso/get_sso_user_ihl_id", body, {headers: headers}).pipe(map(res => res/*.json()*/));
  }
  ssoUserSetPassword(data, apiKey, ihlUserToken) {
    let headers = new HttpHeaders()
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('ApiToken', apiKey);
    headers =  headers.append('Token', ihlUserToken);
    let body = JSON.stringify(data);
    return this.http.post(this.IHL_BASE_URL + "sso/sso_user_set_password", body, {headers: headers}).pipe(map(res => res/*.json()*/));
  }
  // postDoctorReview(obj) : Observable<any>{
  //   let dataObj = JSON.stringify(obj);
  //   let headers = new HttpHeaders()
  //   headers = headers.append('Content-Type', 'application/json');
  //   return this.http.post(this.IHL_BASE_URL+"consult/insert_telemed_reviews", dataObj, {headers: headers}).pipe(map(res => res/*.json()*/));
  // }
}
