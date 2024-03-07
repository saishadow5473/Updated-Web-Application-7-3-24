import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators'
import { Observable, of } from 'rxjs';
import {  Subject } from 'rxjs'
import { ConstantsService } from 'src/app/services/constants.service';
import { Router } from '@angular/router'
import { catchError, retry } from 'rxjs/operators';
import { constants } from 'buffer';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient,
    private _constants: ConstantsService,
    private router:Router) { }

  IHL_BASE_URL = this._constants.ihlBaseurl;
  vaptEnabled = this._constants.vaptEnabled;
  BASE_URL = "https://ihl-web-portal.herokuapp.com/api/"
  authToken: any
  user: any
  Height:any
  Weight:any
  Gender:any
  userHeight:any
  apiKey: string;
  ihlToken = 'hZH2vKcf1BPjROFM/DY0XAt89wo/09DXqsAzoCQC5QHYpXttcd5DNPOkFuhrPWcyT57DFFR9MnAdRAXoVw1j5yupkl+ps7+Z1UoM6uOrTxUBAA==';
  appointmentApikey = 'IWkzkviYuwJqJ2S/F858AdtNyyP3iIDEwJVW4lnn4itl9MOJ9rgTGN2uCRr2ymWQ4qC8ufGtabVjJxZr1o+t1ji4Qk7kFnO4HLtabbdPPFsBAA==';
  appointmentApiToken = 'GKsshZNXO3CzNge63IrpY0W8YNBUMzpbYlvxZ3whkPEUKbk4Oy3KewiOmD3ehOjOi/4hvCSVy8Yuhr31pG76R28OA5j3/Sh6W7JymgFvNN63wY9NaTsFYi2yYtTvelpbxEmIV27w51tT97kizP0C1Ey76NK6BKZy+y7DML12Qv4o1/DqpHx5iqVlXsAcCg50AQA=';
  subscriptionApiToken = "tNfJTkJafsrzhJB3KQteyk2caz5Ye2OukglXvXr+ez8pB33+C2D+w+zHEHJ7UgboKrrf50P/jE8+On1IOVlObEsDyK/Gtf6iItpBPAwOcc0BAA=="
  subscriptionApikey = "9Jk4Kqbm4qVOwRbftbg2s9Qu7tXxxiPvKcdLl/kPwbckzpWyrZc6OLaJ6KbiGBDDCSCHayHvYnDmxHqk9sND9uhRNhjflKmXsxnDes/YHSdBhka4Msh5zoheHPRCiPtyvtRHVz6yxBOpUBexiFIRCZJDswg7j198BH9+6ITZoNZhwe3RV9+43FlbbMlPkaFDAQA="
  apiTokenSubscription = "32iYJ+Lw/duU/2jiMHf8vQcmtD4SxpuKcwt7n/ej5dgvZPUgvHaYQHPRW3nh+GT+N9bfMEK5fofdt9AfA6T9S3BnDHVe0FvUYuPmnMO0WGQBAA==";
  LastCheckin = [];
  BMI  = [];
  ECG  = [];
  BP   = [];
  BMC  = [];
  BPW  = [];
  HOME = [];
  PULSE  = [];
  WEIGHT   = [];
  TEMPERATURE   = [];
  SPO2   = [];
  percentBodyFat = [];
  bodyCellMass = [];
  boneMineralContent = [];
  extraCellularWater = [];
  intraCellularWater = [];
  minerals = [];
  bodyFatMass = [];
  protein = [];
  skeletalMuscleMass = [];
  visceralFat = [];
  waistHipRatio = [];
  basalMetabolicRate = [];
  waistHeightRatio = [];
  private apiToken: any = "";
  private staticLoginHeaderToken: string = "hZH2vKcf1BPjROFM/DY0XAt89wo/09DXqsAzoCQC5QHYpXttcd5DNPOkFuhrPWcyT57DFFR9MnAdRAXoVw1j5yupkl+ps7+Z1UoM6uOrTxUBAA==";
  public consultantId:any = '';
  public courseId:any = '';
  public couponpurpose:any = '';

  fetchUser(username, apiKey) {
    return this.getIhlUser(username, apiKey);
  }

  fetchBadge(username) {
    let headers: HttpHeaders = this.getBearerHeaders()
    return this.http.get(this.BASE_URL + 'users/' + username + "/badges", { headers: headers }).pipe(map(res => res/*.json()*/));
  }

  // authenticate(user){
  //   let headers : HttpHeaders = this.getBearerHeaders()
  //   return this.http.post(this.BASE_URL+'authToken/', user, {headers: headers}).pipe(map(res => res/*.json()*/));
  // }

  fetchMetrics(username, vital) {
    let headers: HttpHeaders = this.getBearerHeaders()
    return this.http.get(this.BASE_URL + 'users/' + username + '/metrics/' + vital, { headers: headers }).pipe(map(res => res/*.json()*/));
  }

  getBearerHeaders() {
    let headers = new HttpHeaders()
    const token = 'bearer ' + localStorage.getItem('id_token');
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('Authorization', token);
    if (!this.apiKey) {
      this.getApiKey();
    }
    headers = headers.append('ApiToken', this.apiKey);
    return headers
  }

  getBearerHeadersIhl() {
    let headers = new HttpHeaders()
    const token = localStorage.getItem('id_token');
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('Token', token);
    if (!this.apiKey) {
      this.getApiKey();
    }
    headers = headers.append('ApiToken', this.apiKey);
    return headers
  }

  getApiKey() {
    if(this.vaptEnabled){
      const apiKey = localStorage.getItem('apiKey');
      if (!apiKey) {
        let apiKeyHeader = new HttpHeaders();
        apiKeyHeader = apiKeyHeader.append('ApiToken', this.ihlToken);
        let body = {"id": this._constants.aesEncryptionForVAPT('2936')};
        this.http.post(this.IHL_BASE_URL + 'login/kioskLogin', body, { headers: apiKeyHeader }).subscribe(data => {
          this.apiKey = data["ApiKey"]
          localStorage.setItem('apiKey', data["ApiKey"]);
        })
      }
      else {
        this.apiKey = apiKey;
      }
    }else{
      const apiKey = localStorage.getItem('apiKey');
      if (!apiKey) {
        let apiKeyHeader = new HttpHeaders();
        apiKeyHeader = apiKeyHeader.append('ApiToken', this.ihlToken);
        this.http.get(this.IHL_BASE_URL + 'login/kioskLogin?id=2936', { headers: apiKeyHeader }).subscribe(data => {
          this.apiKey = data["ApiKey"]
          localStorage.setItem('apiKey', data["ApiKey"]);
        })
      }
      else {
        this.apiKey = apiKey;
      }
    }
  }

  getApiKeyForConfirmVisit(): Observable<any>{
    if(this.vaptEnabled){
      let apiKeyHeader = new HttpHeaders();
      apiKeyHeader = apiKeyHeader.append('ApiToken', this.ihlToken);
      let body = {"id": this._constants.aesEncryptionForVAPT('2936')};
      return this.http.post(this.IHL_BASE_URL + 'login/kioskLogin', body, { headers: apiKeyHeader });
    }else{
      let apiKeyHeader = new HttpHeaders();
      apiKeyHeader = apiKeyHeader.append('ApiToken', this.ihlToken);
      return this.http.get(this.IHL_BASE_URL + 'login/kioskLogin?id=2936', { headers: apiKeyHeader });
    }
  }

  storeUserData(token, user) {
    localStorage.setItem('id_token', token);
    localStorage.setItem('user', this._constants.aesEncryption(user));
    this.authToken = token;
    this.user = user;
  }

  getToken() {
    const token = localStorage.getItem('id_token');
    if (!token) return false
    return token
  }

  getUser() {
    let userData = JSON.parse(this._constants.aesDecryption("userData"));
    if(userData != undefined){
      if(userData["lastName"] == "" || userData["lastName"] == null || userData["lastName"] == "null" || userData["lastName"] == undefined){
        return userData["firstName"];
      } else {
        return userData["firstName"] + " " + userData["lastName"];
      }
    }
  }
  getUserFirstName() {
    let userData = JSON.parse(this._constants.aesDecryption("userData"));
    if(userData != undefined){
      return userData["firstName"];
    }
  }
  getUserLastName() {
    let userData = JSON.parse(this._constants.aesDecryption("userData"));
    if(userData != undefined){
      return userData["lastName"];
    }

  }

  getIhlUserId(): string {
    return this._constants.aesDecryption("userId");
  }

  getIhlProfilePhoto(): any {
    let userData = JSON.parse(this._constants.aesDecryption("userData"));
    localStorage.setItem('gender', this._constants.aesEncryption(userData['gender']));
    console.log(userData);
    if(userData != undefined){
      return userData["photo"];
    }
  }

  private getIhlUser(userId: string, apiKey): Observable<any> {
    let headers: HttpHeaders = this.getBearerHeadersIhl();

    if(localStorage.getItem('apiKey') == undefined){
      headers['ApiToken'] = apiKey;
    }

    return this.http.get(`${this.IHL_BASE_URL}/data/user/${userId}/checkIn`, { headers: headers }).pipe(map((res: any[]) => {
      if (res.length === 0) {
        return res;
      }

      let AFFILIATEDATA = [];
      let metricsLastCheckin = [];
      let AffiliateHistory = [];
      let AffiliateMinMax = [];
      let bmcArrIndex  = 0;
      let bmiArrIndex  = 0;
      let ecgArrIndex  = 0;
      let bpArrIndex   = 0;
      let weightArrIndex = 0;
      let pulseArrIndex  = 0;
      let spo2ArrIndex = 0;
      let temperatureArrIndex = 0;

      let percent_body_fatArrIndex = 0;
      let body_cell_massArrIndex = 0;
      let bone_mineral_contentArrIndex = 0;
      let extra_cellular_waterArrIndex = 0;
      let intra_cellular_waterArrIndex = 0;
      let mineralArrIndex = 0;
      let body_fat_massArrIndex = 0;
      let protienArrIndex = 0;
      let skeletal_muscle_massArrIndex = 0;
      let visceral_fatArrIndex = 0;
      let waist_hip_ratioArrIndex = 0;
      let basal_metabolic_rateArrIndex = 0;
      let waist_height_ratioArrIndex = 0;

      let affiliatedataArrIndex = 0;

      let overAllData = res;

      this.BMI  = [];
      this.ECG  = [];
      this.BP   = [];
      this.BMC  = [];
      this.BPW  = [];
      this.HOME = [];
      this.PULSE  = [];
      this.WEIGHT   = [];
      this.TEMPERATURE   = [];
      this.SPO2   = [];
      this.percentBodyFat = [];
      this.bodyCellMass = [];
      this.boneMineralContent = [];
      this.extraCellularWater = [];
      this.intraCellularWater = [];
      this.minerals = [];
      this.bodyFatMass = [];
      this.protein = [];
      this.skeletalMuscleMass = [];
      this.visceralFat = [];
      this.waistHipRatio = [];
      this.basalMetabolicRate = [];
      this.waistHeightRatio = [];
      // this._constants.affiliatedUsersOverAllDatas = null;
      // this._constants.affiliatedUsersLastCheckinDatas = null;
      // this._constants.affiliatedUsersMeasurementOverAllDatas = null;
      // this._constants.affiliatedUsersMinimumMaximumOverAllDatas = null;
      for(let init = 0; overAllData.length > init; init++ ) {
         if(overAllData[init]['ECGData'] != undefined && overAllData[init]['ECGData'] != '' && overAllData[init]['ECGBpm'] != undefined && overAllData[init]['ECGBpm'] != ''){ // ECG
           this.ECG[ecgArrIndex] = {};
           this.ECG[ecgArrIndex].ECGBpm = overAllData[init]['ECGBpm'];
           this.ECG[ecgArrIndex].ECGData  = overAllData[init]['ECGData'];
           this.ECG[ecgArrIndex].ECGData2  =overAllData[init]['ECGData2'];
           this.ECG[ecgArrIndex].ECGData3  = overAllData[init]['ECGData3'];
           this.ECG[ecgArrIndex].leadTwoStatus  = overAllData[init]['leadTwoStatus'];
           this.ECG[ecgArrIndex].ECGRawFullData = overAllData[init]['ECGRawFullData'];
           this.ECG[ecgArrIndex].ecg_graph_shown  = overAllData[init]['ecg_graph_shown'];
           this.ECG[ecgArrIndex].dateTimeFormatted  = overAllData[init]['dateTimeFormatted'];
           this.ECG[ecgArrIndex].IHLMachineLocation = overAllData[init]['IHLMachineLocation'];
           ecgArrIndex++;
         }

         if(overAllData[init]['percent_body_fat'] != undefined){ // pbf
          this.percentBodyFat[percent_body_fatArrIndex] = {};
          this.percentBodyFat[percent_body_fatArrIndex].percent_body_fat = overAllData[init]['percent_body_fat'];
          //this.BMC[bmcArrIndex].fatClass = overAllData[init]['fatClass'];
          this.percentBodyFat[percent_body_fatArrIndex].dateTimeFormatted  = overAllData[init]['dateTimeFormatted'];
          this.percentBodyFat[percent_body_fatArrIndex].IHLMachineLocation = overAllData[init]['IHLMachineLocation'];
          percent_body_fatArrIndex++;
         }

         if(overAllData[init]['body_cell_mass'] != undefined){ // bcm
          this.bodyCellMass[body_cell_massArrIndex] = {};
          this.bodyCellMass[body_cell_massArrIndex].body_cell_mass = overAllData[init]['body_cell_mass'];
          //this.BMC[bmcArrIndex].fatClass = overAllData[init]['fatClass'];
          this.bodyCellMass[body_cell_massArrIndex].dateTimeFormatted  = overAllData[init]['dateTimeFormatted'];
          this.bodyCellMass[body_cell_massArrIndex].IHLMachineLocation = overAllData[init]['IHLMachineLocation'];
           body_cell_massArrIndex++;
         }

         if(overAllData[init]['bone_mineral_content'] != undefined){ // BMC
          this.boneMineralContent[bone_mineral_contentArrIndex] = {};
          this.boneMineralContent[bone_mineral_contentArrIndex].bone_mineral_content = overAllData[init]['bone_mineral_content'];
          //this.BMC[bmcArrIndex].fatClass = overAllData[init]['fatClass'];
          this.boneMineralContent[bone_mineral_contentArrIndex].dateTimeFormatted  = overAllData[init]['dateTimeFormatted'];
          this.boneMineralContent[bone_mineral_contentArrIndex].IHLMachineLocation = overAllData[init]['IHLMachineLocation'];
           bone_mineral_contentArrIndex++;
         }

         if(overAllData[init]['extra_cellular_water'] != undefined){ // ecw
          this.extraCellularWater[extra_cellular_waterArrIndex] = {};
          this.extraCellularWater[extra_cellular_waterArrIndex].extra_cellular_water = overAllData[init]['extra_cellular_water'];
          //this.BMC[bmcArrIndex].fatClass = overAllData[init]['fatClass'];
          this.extraCellularWater[extra_cellular_waterArrIndex].dateTimeFormatted  = overAllData[init]['dateTimeFormatted'];
          this.extraCellularWater[extra_cellular_waterArrIndex].IHLMachineLocation = overAllData[init]['IHLMachineLocation'];
           extra_cellular_waterArrIndex++;
         }

         if(overAllData[init]['intra_cellular_water'] != undefined){ // icw
          this.intraCellularWater[intra_cellular_waterArrIndex] = {};
          this.intraCellularWater[intra_cellular_waterArrIndex].intra_cellular_water = overAllData[init]['intra_cellular_water'];
          //this.BMC[bmcArrIndex].fatClass = overAllData[init]['fatClass'];
          this.intraCellularWater[intra_cellular_waterArrIndex].dateTimeFormatted  = overAllData[init]['dateTimeFormatted'];
          this.intraCellularWater[intra_cellular_waterArrIndex].IHLMachineLocation = overAllData[init]['IHLMachineLocation'];
           intra_cellular_waterArrIndex++;
         }

         if(overAllData[init]['mineral'] != undefined){ // mineral
          this.minerals[mineralArrIndex] = {};
          this.minerals[mineralArrIndex].mineral = overAllData[init]['mineral'];
          //this.BMC[bmcArrIndex].fatClass = overAllData[init]['fatClass'];
          this.minerals[mineralArrIndex].dateTimeFormatted  = overAllData[init]['dateTimeFormatted'];
          this.minerals[mineralArrIndex].IHLMachineLocation = overAllData[init]['IHLMachineLocation'];
           mineralArrIndex++;
         }

         if(overAllData[init]['body_fat_mass'] != undefined){ // bfm
          this.bodyFatMass[body_fat_massArrIndex] = {};
          this.bodyFatMass[body_fat_massArrIndex].body_fat_mass = overAllData[init]['body_fat_mass'];
          //this.BMC[bmcArrIndex].fatClass = overAllData[init]['fatClass'];
          this.bodyFatMass[body_fat_massArrIndex].dateTimeFormatted  = overAllData[init]['dateTimeFormatted'];
          this.bodyFatMass[body_fat_massArrIndex].IHLMachineLocation = overAllData[init]['IHLMachineLocation'];
           body_fat_massArrIndex++;
         }

         if(overAllData[init]['protien'] != undefined){ // protein
          this.protein[protienArrIndex] = {};
          this.protein[protienArrIndex].protien = overAllData[init]['protien'];
          //this.BMC[bmcArrIndex].fatClass = overAllData[init]['fatClass'];
          this.protein[protienArrIndex].dateTimeFormatted  = overAllData[init]['dateTimeFormatted'];
          this.protein[protienArrIndex].IHLMachineLocation = overAllData[init]['IHLMachineLocation'];
          protienArrIndex++;
         }

         if(overAllData[init]['skeletal_muscle_mass'] != undefined){ // smm
          this.skeletalMuscleMass[skeletal_muscle_massArrIndex] = {};
          this.skeletalMuscleMass[skeletal_muscle_massArrIndex].skeletal_muscle_mass = overAllData[init]['skeletal_muscle_mass'];
          //this.BMC[bmcArrIndex].fatClass = overAllData[init]['fatClass'];
          this.skeletalMuscleMass[skeletal_muscle_massArrIndex].dateTimeFormatted  = overAllData[init]['dateTimeFormatted'];
          this.skeletalMuscleMass[skeletal_muscle_massArrIndex].IHLMachineLocation = overAllData[init]['IHLMachineLocation'];
          skeletal_muscle_massArrIndex++;
         }

         if(overAllData[init]['visceral_fat'] != undefined){ // vf
          this.visceralFat[visceral_fatArrIndex] = {};
          this.visceralFat[visceral_fatArrIndex].visceral_fat = overAllData[init]['visceral_fat'];
          //this.BMC[bmcArrIndex].fatClass = overAllData[init]['fatClass'];
          this.visceralFat[visceral_fatArrIndex].dateTimeFormatted  = overAllData[init]['dateTimeFormatted'];
          this.visceralFat[visceral_fatArrIndex].IHLMachineLocation = overAllData[init]['IHLMachineLocation'];
           visceral_fatArrIndex++;
         }

         if(overAllData[init]['waist_hip_ratio'] != undefined){ // whpr
          this.waistHipRatio[waist_hip_ratioArrIndex] = {};
          this.waistHipRatio[waist_hip_ratioArrIndex].waist_hip_ratio = overAllData[init]['waist_hip_ratio'];
          //this.BMC[bmcArrIndex].fatClass = overAllData[init]['fatClass'];
          this.waistHipRatio[waist_hip_ratioArrIndex].dateTimeFormatted  = overAllData[init]['dateTimeFormatted'];
          this.waistHipRatio[waist_hip_ratioArrIndex].IHLMachineLocation = overAllData[init]['IHLMachineLocation'];
           waist_hip_ratioArrIndex++;
         }

         if(overAllData[init]['basal_metabolic_rate'] != undefined){ // bmr
          this.basalMetabolicRate[basal_metabolic_rateArrIndex] = {};
          this.basalMetabolicRate[basal_metabolic_rateArrIndex].basal_metabolic_rate = overAllData[init]['basal_metabolic_rate'];
          //this.BMC[bmcArrIndex].fatClass = overAllData[init]['fatClass'];
          this.basalMetabolicRate[basal_metabolic_rateArrIndex].dateTimeFormatted  = overAllData[init]['dateTimeFormatted'];
          this.basalMetabolicRate[basal_metabolic_rateArrIndex].IHLMachineLocation = overAllData[init]['IHLMachineLocation'];
          basal_metabolic_rateArrIndex++;
         }

         if(overAllData[init]['waist_height_ratio'] != undefined){ // whtr
          this.waistHeightRatio[waist_height_ratioArrIndex] = {};
          this.waistHeightRatio[waist_height_ratioArrIndex].waist_height_ratio = overAllData[init]['waist_height_ratio'];
          //this.waistHeightRatio[waist_height_ratioArrIndex].fatClass = overAllData[init]['fatClass'];
          this.waistHeightRatio[waist_height_ratioArrIndex].dateTimeFormatted  = overAllData[init]['dateTimeFormatted'];
          this.waistHeightRatio[waist_height_ratioArrIndex].IHLMachineLocation = overAllData[init]['IHLMachineLocation'];
          waist_height_ratioArrIndex++;
         }

         /* if(overAllData[init]['fatRatio'] != undefined){ // BMC
          this.BMC[bmcArrIndex] = {};
          this.BMC[bmcArrIndex].fatRatio = overAllData[init]['fatRatio'];
          this.BMC[bmcArrIndex].fatClass = overAllData[init]['fatClass'];
          this.BMC[bmcArrIndex].dateTimeFormatted  = overAllData[init]['dateTimeFormatted'];
          this.BMC[bmcArrIndex].IHLMachineLocation = overAllData[init]['IHLMachineLocation'];
           bmcArrIndex++;
         } */


         if(overAllData[init]['bmi'] != undefined){ // BMI
          this.BMI[bmiArrIndex] = {};
          this.BMI[bmiArrIndex]['bmi'] = overAllData[init]['bmi'];
          this.BMI[bmiArrIndex]['bmiClass']  = overAllData[init]['bmiClass'];
          this.BMI[bmiArrIndex].dateTimeFormatted  = overAllData[init]['dateTimeFormatted'];
          this.BMI[bmiArrIndex].IHLMachineLocation = overAllData[init]['IHLMachineLocation'];
           bmiArrIndex++;
         }

         if(overAllData[init]['systolic'] != undefined){ // BP
          this.BP[bpArrIndex] = {};
          this.BP[bpArrIndex].systolic = overAllData[init]['systolic'];
          this.BP[bpArrIndex].diastolic  = overAllData[init]['diastolic'];
          this.BP[bpArrIndex].bpClass  = overAllData[init]['bpClass'];
          this.BP[bpArrIndex].dateTimeFormatted  = overAllData[init]['dateTimeFormatted'];
          this.BP[bpArrIndex].IHLMachineLocation = overAllData[init]['IHLMachineLocation'];
           bpArrIndex++;
         }

         if(overAllData[init]['weightKG'] != undefined){ // WEIGHT
          this.WEIGHT[weightArrIndex]  = {};
          this.WEIGHT[weightArrIndex].weightKG = overAllData[init]['weightKG'];
          this.WEIGHT[weightArrIndex].dateTimeFormatted  = overAllData[init]['dateTimeFormatted'];
          this.WEIGHT[weightArrIndex].IHLMachineLocation = overAllData[init]['IHLMachineLocation'];
           weightArrIndex++;
         }

         if(overAllData[init]['pulseBpm'] != undefined){ // PULSE
          this.PULSE[pulseArrIndex]  = {};
          this.PULSE[pulseArrIndex].pulseBpm = overAllData[init]['pulseBpm'];
          this.PULSE[pulseArrIndex].pulseClass = overAllData[init]['pulseClass'];
          this.PULSE[pulseArrIndex].dateTimeFormatted  = overAllData[init]['dateTimeFormatted'];
          this.PULSE[pulseArrIndex].IHLMachineLocation = overAllData[init]['IHLMachineLocation'];
           pulseArrIndex++;
         }

         if(overAllData[init]['spo2'] != undefined){ // spo2
          this.SPO2[spo2ArrIndex]  = {};
          this.SPO2[spo2ArrIndex].spo2 = overAllData[init]['spo2'];
          this.SPO2[spo2ArrIndex].spo2Class = overAllData[init]['spo2Class'];
          this.SPO2[spo2ArrIndex].dateTimeFormatted  = overAllData[init]['dateTimeFormatted'];
          this.SPO2[spo2ArrIndex].IHLMachineLocation = overAllData[init]['IHLMachineLocation'];
           spo2ArrIndex++;
         }


         if(overAllData[init]['temperature'] != undefined){ // Temperature
          this.TEMPERATURE[temperatureArrIndex]  = {};
          this.TEMPERATURE[temperatureArrIndex].temperature = overAllData[init]['temperature'];
          this.TEMPERATURE[temperatureArrIndex].temperatureClass = overAllData[init]['temperatureClass'];
          this.TEMPERATURE[temperatureArrIndex].dateTimeFormatted  = overAllData[init]['dateTimeFormatted'];
          this.TEMPERATURE[temperatureArrIndex].IHLMachineLocation = overAllData[init]['IHLMachineLocation'];
           temperatureArrIndex++;
         }
        if(this._constants.loggedInMetricsObject != undefined && this._constants.loggedInMetricsObject != null && this._constants.loggedInMetricsObject != ""){
          if(overAllData[init][this._constants.loggedInMetricsObject.Affliate_Name] != undefined && overAllData[init][this._constants.loggedInMetricsObject.Affliate_Name] != null && overAllData[init][this._constants.loggedInMetricsObject.Affliate_Name] != ""){ //dimension affiliates dynamic object fetching thamarai
            //console.log(overAllData[init][this._constants.loggedInMetricsObject.Affliate_Name]);
            //$scope.AFFILIATEDATA[$affiliatedataArrIndex]  = [];
            for (var j = 0; j < this._constants.loggedInMetricsObject.content.Metrices.length; j++) {
              if (overAllData[init][this._constants.loggedInMetricsObject.Affliate_Name][this._constants.loggedInMetricsObject.content.Metrices[j].Metrices_Name] != undefined && overAllData[init][this._constants.loggedInMetricsObject.Affliate_Name][this._constants.loggedInMetricsObject.content.Metrices[j].Metrices_Name] != null && overAllData[init][this._constants.loggedInMetricsObject.Affliate_Name][this._constants.loggedInMetricsObject.content.Metrices[j].Metrices_Name] != "") {
                for (var k = 0; k < this._constants.loggedInMetricsObject.content.Metrices[j].Metrices_list.length; k++) {
                  if (overAllData[init][this._constants.loggedInMetricsObject.Affliate_Name][this._constants.loggedInMetricsObject.content.Metrices[j].Metrices_Name][this._constants.loggedInMetricsObject.content.Metrices[j].Metrices_list[k]] != undefined && overAllData[init][this._constants.loggedInMetricsObject.Affliate_Name][this._constants.loggedInMetricsObject.content.Metrices[j].Metrices_Name][this._constants.loggedInMetricsObject.content.Metrices[j].Metrices_list[k]] != null && overAllData[init][this._constants.loggedInMetricsObject.Affliate_Name][this._constants.loggedInMetricsObject.content.Metrices[j].Metrices_Name][this._constants.loggedInMetricsObject.content.Metrices[j].Metrices_list[k]] != "") {
                    if(this._constants.loggedInMetricsObject.content.Metrices[j].Metrices_type[k] != "string" && this._constants.loggedInMetricsObject.content.Metrices[j].Metrices_type[k] != "NA" && this._constants.loggedInMetricsObject.content.Metrices[j].Metrices_type[k] != "" && this._constants.loggedInMetricsObject.content.Metrices[j].Metrices_type[k] != undefined){
                      var arr = {
                        "Title":this._constants.loggedInMetricsObject.content.Metrices[j].Metrices_list[k].replace(/_/g," "),
                        "Value":overAllData[init][this._constants.loggedInMetricsObject.Affliate_Name][this._constants.loggedInMetricsObject.content.Metrices[j].Metrices_Name][this._constants.loggedInMetricsObject.content.Metrices[j].Metrices_list[k]],
                        "dateTimeFormatted":overAllData[init]['dateTimeFormatted'],
                        "higher_reference_range":this._constants.loggedInMetricsObject.content.Metrices[j].high_reference_range[k],
                        "lower_reference_range":this._constants.loggedInMetricsObject.content.Metrices[j].low_reference_range[k],
                      }

                      var arrHis = {
                        "Title_history":this._constants.loggedInMetricsObject.content.Metrices[j].Metrices_list[k].replace(/_/g," ") + " history",
                        "Value_history":overAllData[init][this._constants.loggedInMetricsObject.Affliate_Name][this._constants.loggedInMetricsObject.content.Metrices[j].Metrices_Name][this._constants.loggedInMetricsObject.content.Metrices[j].Metrices_list[k]],
                        "dateTime_history":overAllData[init]['dateTimeFormatted']
                      }

                      var arrMinMax = {
                        "Title_min_max":this._constants.loggedInMetricsObject.content.Metrices[j].Metrices_list[k].replace(/_/g," ") + " minmax",
                        "Value_min_max":overAllData[init][this._constants.loggedInMetricsObject.Affliate_Name][this._constants.loggedInMetricsObject.content.Metrices[j].Metrices_Name][this._constants.loggedInMetricsObject.content.Metrices[j].Metrices_list[k]],
                        "dateTime_min_max":overAllData[init]['dateTimeFormatted']
                      }
                      //$scope.AFFILIATEDATA[$affiliatedataArrIndex][$rootScope.newAffliateObj.content.Metrices[j].Metrices_list[k]] = $scope.overAllData[$init][$rootScope.newAffliateObj.Affliate_Name][$rootScope.newAffliateObj.content.Metrices[j].Metrices_Name][$rootScope.newAffliateObj.content.Metrices[j].Metrices_list[k]];
                      //$scope.AFFILIATEDATA[$affiliatedataArrIndex].dateTimeFormatted  = $scope.overAllData[$init]['dateTimeFormatted'];
                      //$scope.AFFILIATEDATA[$affiliatedataArrIndex].push(arr);
                      AFFILIATEDATA.push(arr);
                      AffiliateHistory.push(arrHis);
                      AffiliateMinMax.push(arrMinMax);
                    }
                  }
                }
              }
            }
            // $affiliatedataArrIndex++;
          }
        }

      }
      localStorage.setItem("AFFILIATEDATA", this._constants.aesEncryption(JSON.stringify(AFFILIATEDATA)));
      localStorage.setItem("AffiliateHistory", this._constants.aesEncryption(JSON.stringify(AffiliateHistory)));
      localStorage.setItem("AffiliateMinMax", this._constants.aesEncryption(JSON.stringify(AffiliateMinMax)));
      // let outJSON = AFFILIATEDATA
      // var groupBy = function(xs, key) {
      //   return xs.reduce(function(rv, x) {
      //     (rv[x[key]] = rv[x[key]] || []).push(x);
      //     return rv;
      //   }, []);
      // };
      // var seperatedMetricsData = groupBy(outJSON, 'Title');
      // if(Object.keys(seperatedMetricsData).length === 0){
      //   console.log("seperated metrics data is not available");
      // }else{
      //   console.log(seperatedMetricsData);
      //   this._constants.affiliatedUsersOverAllDatas = seperatedMetricsData;
      //   for (let l = 0; l < Object.keys(seperatedMetricsData).length; l++) {
      //     metricsLastCheckin.push(Object(Object.values(seperatedMetricsData)[l][Object.values(Object.values(seperatedMetricsData)[l]).length-1]));
      //   }
      //   console.log(metricsLastCheckin);
      //   this._constants.affiliatedUsersLastCheckinDatas = metricsLastCheckin;
      // }

      // let outJSONHistory = AffiliateHistory
      // var groupByHistory = function(xs, key) {
      //   return xs.reduce(function(rv, x) {
      //     (rv[x[key]] = rv[x[key]] || []).push(x);
      //     return rv;
      //   }, []);
      // };
      // var seperatedMetricsDataHistory = groupByHistory(outJSONHistory, 'Title_history');

      // if(Object.keys(seperatedMetricsDataHistory).length === 0){
      //   console.log("seperated metrics data history is not available");
      // }else{
      //   console.log(seperatedMetricsDataHistory);
      //   this._constants.affiliatedUsersMeasurementOverAllDatas = seperatedMetricsDataHistory;
      // }

      // let outJSONMinMax = AffiliateMinMax
      // var groupByMinMax = function(xs, key) {
      //   return xs.reduce(function(rv, x) {
      //     (rv[x[key]] = rv[x[key]] || []).push(x);
      //     return rv;
      //   }, []);
      // };
      // var seperatedMetricsDataMinimumMaximum = groupByMinMax(outJSONMinMax, 'Title_min_max');

      // if(Object.keys(seperatedMetricsDataMinimumMaximum).length === 0){
      //   console.log("seperated metrics data MinimumMaximum is not available");
      // }else{
      //   console.log(seperatedMetricsDataMinimumMaximum);
      //   this._constants.affiliatedUsersMinimumMaximumOverAllDatas = seperatedMetricsDataMinimumMaximum;
      // }
      let lowPbfReference ;
    let highPbfReference ;
    let acceptPbfReference;
    let bcmlow  ="20.00";
    let bcmhigh  ="25.00";
    let lowMineral ="2.00";
    let highMineral ="3.00";
    let lowSmmReference;
    let highSmmReference ;
    let lowFatReference ;
    let acceptFatReference;
    let highFatReference ;
    let lowBmcReference ;
    let highBmcReference ;
    let icll ;
    let iclh ;
    let ecll ;
    let eclh ;
    let proteinl ;
    let proteinh ;
    let waisttoheightratiolow ;
    let waisttoheightratiohigh ;

    this.userHeight = localStorage.getItem('height');
    this.Height = (this.userHeight)*100;
     this.Weight = localStorage.getItem('weight');
     this.Gender = this._constants.aesDecryption('usergender');

    if (this.Gender != "m") {
      lowPbfReference = "18.00";
      acceptPbfReference = "28.00";
      highPbfReference = "32.00";
      let female_height_weight = [
          [147 , 45  , 59],
          [150 , 45  , 60],[152 , 46  , 62],[155 , 47  , 63],[157 , 49  , 65],[160 , 50  , 67],[162 , 51  , 69],
          [165 , 53  , 70],[167 , 54  , 72],
          [170 , 55  , 74],[172 , 57  , 75],[175 , 58  , 77],[177 , 60  , 78],[180 , 61  , 80]
      ];
      var i =0;
      while(female_height_weight[i][0]<= this.Height)
    {
          i++;
          if(i == 13){
              break;
          }
    }
      var wtl, wth;
      if(i == 0){
          wtl=female_height_weight[i][1];
          wth=female_height_weight[i][2];
      }
      else{
          wtl=female_height_weight[i-1][1];
          wth=female_height_weight[i-1][2];
      }
      lowSmmReference = (0.36*wtl).toFixed(2);
      highSmmReference = (0.36*wth).toFixed(2);
      lowFatReference=(0.18*this.Weight).toFixed(2);
      acceptFatReference=(0.28*this.Weight).toFixed(2);
      highFatReference=(0.32*this.Weight).toFixed(2);
      lowBmcReference = "1.70";
      highBmcReference = "3.00";
      icll=(0.3*wtl).toFixed(2);
      iclh=(0.3*wth).toFixed(2);
      ecll=(0.2*wtl).toFixed(2);
      eclh=(0.2*wth).toFixed(2);
      proteinl=(0.116*this.Weight).toFixed(2);
      proteinh=(0.141*this.Weight).toFixed(2);
      waisttoheightratiolow= "0.35";
      waisttoheightratiohigh= "0.53";
    }
    else{
      lowPbfReference = "10.00";
      acceptPbfReference = "20.00"
      highPbfReference = "27.00";
      let male_height_weight = [
          [155,55,66],
          [157,56,67],[160,57,68],[162,58,70],[165,59,72],[167,60,74],[170,61,75],[172,62,77],[175,63,79],
          [177,64,81],[180,65,83],[182,66,85],[185,68,87],[187,69,89],[190,71,91]
      ];
      var i =0;
      while(male_height_weight[i][0]<= this.Height){
          i++;
          if(i==14){
              break;
          }
      }
      var wtl, wth;
      if(i == 0){
          wtl=male_height_weight[i][1];
          wth=male_height_weight[i][2];
      }
      else{
          wtl=male_height_weight[i-1][1];
          wth=male_height_weight[i-1][2];
      }
      lowSmmReference = (0.42*wtl).toFixed(2);
      highSmmReference = (0.42*wth).toFixed(2);
      lowFatReference=(0.10*this.Weight).toFixed(2);
      acceptFatReference=(0.20*this.Weight).toFixed(2);
      highFatReference=(0.27*this.Weight).toFixed(2);
      lowBmcReference = "1.70";
      highBmcReference = "3.70";
      icll=(0.3*wtl).toFixed(2);
      iclh=(0.3*wth).toFixed(2);
      ecll=(0.2*wtl).toFixed(2);
      eclh=(0.2*wth).toFixed(2);
      proteinl=(0.109*this.Weight).toFixed(2);
      proteinh=(0.135*this.Weight).toFixed(2);
      waisttoheightratiolow= "0.35";
      waisttoheightratiohigh= "0.57";
    }

      let bmcLength = (this.BMC.length) - 1;
      let bmiLength = (this.BMI.length) - 1;
      let weightLength = (this.WEIGHT.length) - 1;
      let pulseLength = (this.PULSE.length) -1;
      let bpLength = (this.BP.length) -1;
      let ecgLength = (this.ECG.length) -1;
      let temperatureLength = (this.TEMPERATURE.length) -1;
      let spo2Length = (this.SPO2.length) -1;

      let percent_body_fat_Length = (this.percentBodyFat.length) -1;
      let body_cell_mass_Length = (this.bodyCellMass.length) -1;
      let bone_mineral_content_Length = (this.boneMineralContent.length) -1;
      let extra_cellular_water_Length = (this.extraCellularWater.length) -1;
      let intra_cellular_water_Length = (this.intraCellularWater.length) -1;
      let mineral_Length = (this.minerals.length) -1;
      let body_fat_mass_Length = (this.bodyFatMass.length) -1;
      let protien_Length = (this.protein.length) -1;
      let skeletal_muscle_mass_Length = (this.skeletalMuscleMass.length) -1;
      let visceral_fat_Length = (this.visceralFat.length) -1;
      let waist_hip_ratio_Length = (this.waistHipRatio.length) -1;
      let basal_metabolic_rate_Length = (this.basalMetabolicRate.length) -1;
      let waist_height_ratio_Length = (this.waistHeightRatio.length) -1;

      let LastCheckinArr = 0;

      if(bmcLength != -1){
        this.LastCheckin[LastCheckinArr] = [];
        // this.LastCheckin[LastCheckinArr]['title'] = 'Fat Ratio';
        // this.LastCheckin[LastCheckinArr]['name'] = 'fatRatio';
        // this.LastCheckin[LastCheckinArr]['icon'] = 'fa-diagnoses';
        if(this.BMC[bmcLength]['fatClass'] == "healthy"){
          this.LastCheckin[LastCheckinArr]['color'] = '#4caf50';
        }
        else if(this.BMC[bmcLength]['fatClass'] == "acceptable"){
          this.LastCheckin[LastCheckinArr]['color'] = '#ff9800';
        }
        else if(this.BMC[bmcLength]['fatClass'] == "atrisk"){
          this.LastCheckin[LastCheckinArr]['color'] = '#f44336';
        }
        this.LastCheckin[LastCheckinArr]['val'] = this.BMC[bmcLength]['fatRatio'].toFixed(2);
        this.LastCheckin[LastCheckinArr]['unit'] = '%';
        this.LastCheckin[LastCheckinArr]['fatClass'] = this.BMC[bmcLength]['fatClass'];
        LastCheckinArr++;
      }
      else{
        this.LastCheckin[LastCheckinArr] = [];
        // this.LastCheckin[LastCheckinArr]['title'] = 'Fat Ratio';
        // this.LastCheckin[LastCheckinArr]['name'] = 'fatRatio';
        // this.LastCheckin[LastCheckinArr]['icon'] = 'fa-diagnoses';
        // this.LastCheckin[LastCheckinArr]['val'] = "-";
        // LastCheckinArr++;
      }
      if(bmiLength != -1){
        this.LastCheckin[LastCheckinArr] = [];
        this.LastCheckin[LastCheckinArr]['title'] = 'BMI';
        this.LastCheckin[LastCheckinArr]['name'] = 'bmi';
        this.LastCheckin[LastCheckinArr]['icon'] = 'fa-female';
        if(this.BMI[bmiLength]['bmiClass'].toLowerCase() == "normal"){
          this.LastCheckin[LastCheckinArr]['color'] = '#4caf50';
        }
        else if(this.BMI[bmiLength]['bmiClass'].toLowerCase() == "low"){
          this.LastCheckin[LastCheckinArr]['color'] = '#ff9800';
        }
        else if(this.BMI[bmiLength]['bmiClass'].toLowerCase() == "high"){
          this.LastCheckin[LastCheckinArr]['color'] = '#f44336';
        }
        // else if(this.BMI[bmiLength]['bmiClass'] == "obese"){
        //   this.LastCheckin[LastCheckinArr]['color'] = '#f44336';
        // }
        this.LastCheckin[LastCheckinArr]['val'] = this.BMI[bmiLength]['bmi'].toFixed(2);
        this.LastCheckin[LastCheckinArr]['bmiClass'] = this.BMI[bmiLength]['bmiClass'];
        LastCheckinArr++;
      }
      else{
        this.LastCheckin[LastCheckinArr] = [];
        this.LastCheckin[LastCheckinArr]['title'] = 'BMI';
        this.LastCheckin[LastCheckinArr]['name'] = 'bmi';
        this.LastCheckin[LastCheckinArr]['icon'] = 'fa-female';
        this.LastCheckin[LastCheckinArr]['val'] = '-';
        LastCheckinArr++;
      }
      if(weightLength != -1){
        this.LastCheckin[LastCheckinArr] = [];
        this.LastCheckin[LastCheckinArr]['title'] = 'WEIGHT';
        this.LastCheckin[LastCheckinArr]['name'] = 'weightKG';
        this.LastCheckin[LastCheckinArr]['icon'] = 'fa-weight';
        if(this.BMI[weightLength]['bmiClass'].toLowerCase() == "normal"){
          this.LastCheckin[LastCheckinArr]['color'] = '#4caf50';
        }
        else if(this.BMI[weightLength]['bmiClass'].toLowerCase() == "low"){
          this.LastCheckin[LastCheckinArr]['color'] = '#ff9800';
        }
        else if(this.BMI[weightLength]['bmiClass'].toLowerCase() == "high"){
          this.LastCheckin[LastCheckinArr]['color'] = '#f44336';
        }
        // else if(this.BMI[weightLength]['bmiClass'] == "obese"){
        //   this.LastCheckin[LastCheckinArr]['color'] = '#f44336';
        // }
        this.LastCheckin[LastCheckinArr]['val'] = this.WEIGHT[weightLength]['weightKG'].toFixed(2);
        this.LastCheckin[LastCheckinArr]['unit'] = 'Kgs';
        LastCheckinArr++;
      }
      else{
        this.LastCheckin[LastCheckinArr] = [];
        this.LastCheckin[LastCheckinArr]['title'] = 'WEIGHT';
        this.LastCheckin[LastCheckinArr]['name'] = 'weightKG';
        this.LastCheckin[LastCheckinArr]['icon'] = 'fa-weight';
        this.LastCheckin[LastCheckinArr]['val'] = '-';
        LastCheckinArr++;
      }
      if(pulseLength != -1){
        this.LastCheckin[LastCheckinArr] = [];
        this.LastCheckin[LastCheckinArr]['title'] = 'PULSE';
        this.LastCheckin[LastCheckinArr]['name'] = 'pulseBpm';
        this.LastCheckin[LastCheckinArr]['icon'] = 'fa-file-medical-alt';
        if(this.PULSE[pulseLength]['pulseClass'].toLowerCase() == "normal"){
          this.LastCheckin[LastCheckinArr]['color'] = '#4caf50';
        }
        else if(this.PULSE[pulseLength]['pulseClass'].toLowerCase() == "low"){
          this.LastCheckin[LastCheckinArr]['color'] = '#ff9800';
        }
        else if(this.PULSE[pulseLength]['pulseClass'].toLowerCase() == "high"){
          this.LastCheckin[LastCheckinArr]['color'] = '#f44336';
        }
        this.LastCheckin[LastCheckinArr]['val'] = this.PULSE[pulseLength]['pulseBpm'];
        this.LastCheckin[LastCheckinArr]['unit'] = 'bpm';
        this.LastCheckin[LastCheckinArr]['pulseClass'] = this.PULSE[pulseLength]['pulseClass'];
        LastCheckinArr++;
      }
      else{
        this.LastCheckin[LastCheckinArr] = [];
        this.LastCheckin[LastCheckinArr]['title'] = 'PULSE';
        this.LastCheckin[LastCheckinArr]['name'] = 'pulseBpm';
        this.LastCheckin[LastCheckinArr]['icon'] = 'fa-file-medical-alt';
        this.LastCheckin[LastCheckinArr]['val'] = '-';
        LastCheckinArr++;
      }
      if(bpLength != -1){
        this.LastCheckin[LastCheckinArr] = [];
        this.LastCheckin[LastCheckinArr]['title'] = 'Blood Pressure';
        this.LastCheckin[LastCheckinArr]['name'] = 'bp';
        this.LastCheckin[LastCheckinArr]['icon'] = 'fa-heart';
        if(this.BP[bpLength]['bpClass'].toLowerCase() == "normal"){
          this.LastCheckin[LastCheckinArr]['color'] = '#4caf50';
        }
        else if(this.BP[bpLength]['bpClass'].toLowerCase() == "acceptable"){
          this.LastCheckin[LastCheckinArr]['color'] = '#ff9800';
        }
        else if(this.BP[bpLength]['bpClass'].toLowerCase() == "high"){
          this.LastCheckin[LastCheckinArr]['color'] = '#f44336';
        }
        this.LastCheckin[LastCheckinArr]['val'] = this.BP[bpLength]['diastolic'] + " / "+  this.BP[bpLength]['systolic'];
        this.LastCheckin[LastCheckinArr]['bpClass'] = this.BP[bpLength]['bpClass'];
        LastCheckinArr++;
      }
      else{
        this.LastCheckin[LastCheckinArr] = [];
        this.LastCheckin[LastCheckinArr]['title'] = 'Blood Pressure';
        this.LastCheckin[LastCheckinArr]['name'] = 'bp';
        this.LastCheckin[LastCheckinArr]['icon'] = 'fa-heart';
        this.LastCheckin[LastCheckinArr]['val'] = '-';
        LastCheckinArr++;
      }
      if(ecgLength != -1){
        this.LastCheckin[LastCheckinArr] = [];
        this.LastCheckin[LastCheckinArr]['title'] = 'ECG';
        this.LastCheckin[LastCheckinArr]['name'] = 'ecgbpm';
        this.LastCheckin[LastCheckinArr]['icon'] = 'fa-heartbeat';
        if(this.ECG[ecgLength]['ECGBpm'] >59 && this.ECG[ecgLength]['ECGBpm'] < 101 ){
          this.LastCheckin[LastCheckinArr]['color'] = '#4caf50';
        }
        else {
          this.LastCheckin[LastCheckinArr]['color'] = '#f44336';
        }
        this.LastCheckin[LastCheckinArr]['val'] = this.ECG[ecgLength]['ECGBpm'];
        this.LastCheckin[LastCheckinArr]['unit'] = 'bpm';
        this.LastCheckin[LastCheckinArr]['ECGData'] = this.ECG[ecgLength]['ECGData'];
        this.LastCheckin[LastCheckinArr]['ECGRawFullData'] = this.ECG[ecgLength]['ECGRawFullData'];
        this.LastCheckin[LastCheckinArr]['ecg_graph_shown'] = this.ECG[ecgLength]['ecg_graph_shown'];
        LastCheckinArr++;
      }
      else{
        this.LastCheckin[LastCheckinArr] = [];
        this.LastCheckin[LastCheckinArr]['title'] = 'ECG';
        this.LastCheckin[LastCheckinArr]['name'] = 'ecgbpm';
        this.LastCheckin[LastCheckinArr]['icon'] = 'fa-heartbeat';
        this.LastCheckin[LastCheckinArr]['val'] = '-';
        LastCheckinArr++;
      }
      if(temperatureLength != -1){
        this.LastCheckin[LastCheckinArr] = [];
        this.LastCheckin[LastCheckinArr]['title'] = 'TEMPERATURE';
        this.LastCheckin[LastCheckinArr]['name'] = 'temperature';
        this.LastCheckin[LastCheckinArr]['icon'] = 'fa-thermometer-half';
        if(this.TEMPERATURE[temperatureLength]['temperatureClass'].toLowerCase() == "normal"){
          this.LastCheckin[LastCheckinArr]['color'] = '#4caf50';
        }
        else if(this.TEMPERATURE[temperatureLength]['temperatureClass'].toLowerCase() == "low"){
          this.LastCheckin[LastCheckinArr]['color'] = '#ff9800';
        }
        else if(this.TEMPERATURE[temperatureLength]['temperatureClass'].toLowerCase() == "high"){
          this.LastCheckin[LastCheckinArr]['color'] = '#f44336';
        }
        var tempValue = this.TEMPERATURE[temperatureLength]['temperature'].toFixed(2);
        this.LastCheckin[LastCheckinArr]['val'] = Number((tempValue * 9/5) + 32).toFixed(1)
        this.LastCheckin[LastCheckinArr]['unit'] = String.fromCharCode(8457);
        this.LastCheckin[LastCheckinArr]['TemperatureClass'] = this.TEMPERATURE[temperatureLength]['temperatureClass'];
        LastCheckinArr++;
      }
      else{
        this.LastCheckin[LastCheckinArr] = [];
        this.LastCheckin[LastCheckinArr]['title'] = 'TEMPERATURE';
        this.LastCheckin[LastCheckinArr]['name'] = 'temperature';
        this.LastCheckin[LastCheckinArr]['icon'] = 'fa-thermometer-half';
        this.LastCheckin[LastCheckinArr]['val'] = '-';
        LastCheckinArr++;
      }
      if(spo2Length != -1){
        this.LastCheckin[LastCheckinArr] = [];
        this.LastCheckin[LastCheckinArr]['title'] = 'SpO2';
        this.LastCheckin[LastCheckinArr]['name'] = 'spo2';
        this.LastCheckin[LastCheckinArr]['icon'] = 'fa-lungs';
        if(this.SPO2[spo2Length]['spo2Class'].toLowerCase == "normal"){
          this.LastCheckin[LastCheckinArr]['color'] = '#4caf50';
        }
        else if(this.SPO2[spo2Length]['spo2Class'].toLowerCase() == "low"){
          this.LastCheckin[LastCheckinArr]['color'] = '#ff9800';
        }
        this.LastCheckin[LastCheckinArr]['val'] = this.SPO2[spo2Length]['spo2'];
        this.LastCheckin[LastCheckinArr]['unit'] = '%';
        this.LastCheckin[LastCheckinArr]['spo2Class'] = this.SPO2[spo2Length]['spo2Class'];
        LastCheckinArr++;
      }
      else{
        this.LastCheckin[LastCheckinArr] = [];
        this.LastCheckin[LastCheckinArr]['title'] = 'SpO2';
        this.LastCheckin[LastCheckinArr]['name'] = 'spo2';
        this.LastCheckin[LastCheckinArr]['icon'] = 'fa-lungs';
        this.LastCheckin[LastCheckinArr]['val'] = '-';
        LastCheckinArr++;
      }

      if(percent_body_fat_Length != -1 && !isNaN(this.percentBodyFat[percent_body_fat_Length]["percent_body_fat"])){
        this.LastCheckin[LastCheckinArr] = [];
        this.LastCheckin[LastCheckinArr]['title'] = 'Percent Body Fat';
        this.LastCheckin[LastCheckinArr]['name'] = 'percent_body_fat';
        this.LastCheckin[LastCheckinArr]['icon'] = 'fac-vitals fa-fat';
        console.log( this.percentBodyFat);
        console.log("test");
        this.LastCheckin[LastCheckinArr]['val'] = this.percentBodyFat[percent_body_fat_Length]['percent_body_fat'].toFixed(2);
        this.LastCheckin[LastCheckinArr]['unit'] = '%';
        if (this.LastCheckin[LastCheckinArr]['val'] < lowPbfReference) {
          this.LastCheckin[LastCheckinArr]['color'] = '#ff9800';
        }
        if (this.LastCheckin[LastCheckinArr]['val'] >= lowPbfReference && this.LastCheckin[LastCheckinArr]['val'] <= acceptPbfReference) {
          this.LastCheckin[LastCheckinArr]['color'] = '#4caf50';
        }
        if (this.LastCheckin[LastCheckinArr]['val'] > acceptPbfReference && this.LastCheckin[LastCheckinArr]['val'] <= highPbfReference) {
          this.LastCheckin[LastCheckinArr]['color'] = '#fd7e14';
        }
        if (this.LastCheckin[LastCheckinArr]['val'] > highPbfReference) {
          this.LastCheckin[LastCheckinArr]['color'] = '#f44336';
        }
        LastCheckinArr++;
      }
      else{
        this.LastCheckin[LastCheckinArr] = [];
        this.LastCheckin[LastCheckinArr]['title'] = 'Percent Body Fat';
        this.LastCheckin[LastCheckinArr]['name'] = 'percent_body_fat';
        this.LastCheckin[LastCheckinArr]['icon'] = 'fac-vitals fa-fat';
        this.LastCheckin[LastCheckinArr]['val'] = "-";
        LastCheckinArr++;
      }

      if(body_cell_mass_Length != -1 && !isNaN(this.bodyCellMass[body_cell_mass_Length]['body_cell_mass'])){
        this.LastCheckin[LastCheckinArr] = [];
        this.LastCheckin[LastCheckinArr]['title'] = 'Body Cell Mass';
        this.LastCheckin[LastCheckinArr]['name'] = 'body_cell_mass';
        this.LastCheckin[LastCheckinArr]['icon'] = 'fac-vitals fa-cell';
        this.LastCheckin[LastCheckinArr]['val'] = this.bodyCellMass[body_cell_mass_Length]['body_cell_mass'];
        this.LastCheckin[LastCheckinArr]['unit'] = 'Kgs';
        if (this.LastCheckin[LastCheckinArr]['val'] < bcmlow) {
          this.LastCheckin[LastCheckinArr]['color'] = '#ff9800';
        }
        if (this.LastCheckin[LastCheckinArr]['val'] >= bcmlow) {
          this.LastCheckin[LastCheckinArr]['color'] = '#4caf50';
        }
        // if (this.LastCheckin[LastCheckinArr]['val'] > bcmhigh) {
        //   this.LastCheckin[LastCheckinArr]['color'] = '#f44336';
        // }
        LastCheckinArr++;
      }
      else{
        this.LastCheckin[LastCheckinArr] = [];
        this.LastCheckin[LastCheckinArr]['title'] = 'Body Cell Mass';
        this.LastCheckin[LastCheckinArr]['name'] = 'body_cell_mass';
        this.LastCheckin[LastCheckinArr]['icon'] = 'fac-vitals fa-cell';
        this.LastCheckin[LastCheckinArr]['val'] = "-";
        LastCheckinArr++;
      }

      if(bone_mineral_content_Length != -1 && !isNaN(this.boneMineralContent[bone_mineral_content_Length]['bone_mineral_content'])){
        this.LastCheckin[LastCheckinArr] = [];
        this.LastCheckin[LastCheckinArr]['title'] = 'Bone Mineral Content';
        this.LastCheckin[LastCheckinArr]['name'] = 'bone_mineral_content';
        this.LastCheckin[LastCheckinArr]['icon'] = 'fac-vitals fa-bone';
        this.LastCheckin[LastCheckinArr]['val'] = this.boneMineralContent[bone_mineral_content_Length]['bone_mineral_content'];
        this.LastCheckin[LastCheckinArr]['unit'] = 'Kgs';
        if (this.LastCheckin[LastCheckinArr]['val'] < lowBmcReference) {
          this.LastCheckin[LastCheckinArr]['color'] = '#ff9800';
        }
        if (this.LastCheckin[LastCheckinArr]['val'] >= lowBmcReference) {
          this.LastCheckin[LastCheckinArr]['color'] = '#4caf50';
        }
        // if (this.LastCheckin[LastCheckinArr]['val'] > highBmcReference) {
        //   this.LastCheckin[LastCheckinArr]['color'] = '#f44336';
        // }
        LastCheckinArr++;
      }
      else{
        this.LastCheckin[LastCheckinArr] = [];
        this.LastCheckin[LastCheckinArr]['title'] = 'Bone Mineral Content';
        this.LastCheckin[LastCheckinArr]['name'] = 'bone_mineral_content';
        this.LastCheckin[LastCheckinArr]['icon'] = 'fac-vitals fa-bone';
        this.LastCheckin[LastCheckinArr]['val'] = "-";
        LastCheckinArr++;
      }

      if(extra_cellular_water_Length != -1 && !isNaN(this.extraCellularWater[extra_cellular_water_Length]['extra_cellular_water'])){
        this.LastCheckin[LastCheckinArr] = [];
        this.LastCheckin[LastCheckinArr]['title'] = 'Extra Cellular Water';
        this.LastCheckin[LastCheckinArr]['name'] = 'extra_cellular_water';
        this.LastCheckin[LastCheckinArr]['icon'] = 'fac-vitals fa-drop';
        this.LastCheckin[LastCheckinArr]['val'] = this.extraCellularWater[extra_cellular_water_Length]['extra_cellular_water'].toFixed(2);
        this.LastCheckin[LastCheckinArr]['unit'] = 'Ltr';
        if (this.LastCheckin[LastCheckinArr]['val'] < ecll) {
          this.LastCheckin[LastCheckinArr]['color'] = '#ff9800';
        }
        if (this.LastCheckin[LastCheckinArr]['val'] >= ecll && this.LastCheckin[LastCheckinArr]['val'] <= eclh) {
          this.LastCheckin[LastCheckinArr]['color'] = '#4caf50';
        }
        if (this.LastCheckin[LastCheckinArr]['val'] > eclh) {
          this.LastCheckin[LastCheckinArr]['color'] = '#f44336';
        }
        LastCheckinArr++;
      }
      else{
        this.LastCheckin[LastCheckinArr] = [];
        this.LastCheckin[LastCheckinArr]['title'] = 'Extra Cellular Water';
        this.LastCheckin[LastCheckinArr]['name'] = 'extra_cellular_water';
        this.LastCheckin[LastCheckinArr]['icon'] = 'fac-vitals fa-drop';
        this.LastCheckin[LastCheckinArr]['val'] = "-";
        LastCheckinArr++;
      }

      if(intra_cellular_water_Length != -1 && !isNaN(this.intraCellularWater[intra_cellular_water_Length]['intra_cellular_water'])){
        this.LastCheckin[LastCheckinArr] = [];
        this.LastCheckin[LastCheckinArr]['title'] = 'Intra Cellular Water';
        this.LastCheckin[LastCheckinArr]['name'] = 'intra_cellular_water';
        this.LastCheckin[LastCheckinArr]['icon'] = 'fac-vitals fa-dropICW';
        this.LastCheckin[LastCheckinArr]['val'] = this.intraCellularWater[intra_cellular_water_Length]['intra_cellular_water'].toFixed(2);
        this.LastCheckin[LastCheckinArr]['unit'] = 'Ltr';
        if (this.LastCheckin[LastCheckinArr]['val'] < icll) {
          this.LastCheckin[LastCheckinArr]['color'] = '#ff9800';
        }
        if (this.LastCheckin[LastCheckinArr]['val'] >= icll && this.LastCheckin[LastCheckinArr]['val'] <= iclh) {
          this.LastCheckin[LastCheckinArr]['color'] = '#4caf50';
        }
        if (this.LastCheckin[LastCheckinArr]['val'] > iclh) {
          this.LastCheckin[LastCheckinArr]['color'] = '#f44336';
        }
        LastCheckinArr++;
      }
      else{
        this.LastCheckin[LastCheckinArr] = [];
        this.LastCheckin[LastCheckinArr]['title'] = 'Intra Cellular Water';
        this.LastCheckin[LastCheckinArr]['name'] = 'intra_cellular_water';
        this.LastCheckin[LastCheckinArr]['icon'] = 'fac-vitals fa-dropICW';
        this.LastCheckin[LastCheckinArr]['val'] = "-";
        LastCheckinArr++;
      }

      if(mineral_Length != -1 && !isNaN(this.minerals[mineral_Length]['mineral'])){
        this.LastCheckin[LastCheckinArr] = [];
        this.LastCheckin[LastCheckinArr]['title'] = 'Mineral';
        this.LastCheckin[LastCheckinArr]['name'] = 'mineral';
        this.LastCheckin[LastCheckinArr]['icon'] = 'fac-vitals fa-minerals';
        this.LastCheckin[LastCheckinArr]['val'] = this.minerals[mineral_Length]['mineral'].toFixed(2);
        this.LastCheckin[LastCheckinArr]['unit'] = 'Kg';
        if (this.LastCheckin[LastCheckinArr]['val'] < lowMineral) {
          this.LastCheckin[LastCheckinArr]['color'] = '#ff9800';
        }
        if (this.LastCheckin[LastCheckinArr]['val'] >= lowMineral) {
          this.LastCheckin[LastCheckinArr]['color'] = '#4caf50';
        }
        // if (this.LastCheckin[LastCheckinArr]['val'] > highMineral) {
        //   this.LastCheckin[LastCheckinArr]['color'] = '#f44336';
        // }
        LastCheckinArr++;
      }
      else{
        this.LastCheckin[LastCheckinArr] = [];
        this.LastCheckin[LastCheckinArr]['title'] = 'Mineral';
        this.LastCheckin[LastCheckinArr]['name'] = 'mineral';
        this.LastCheckin[LastCheckinArr]['icon'] = 'fac-vitals fa-minerals';
        this.LastCheckin[LastCheckinArr]['val'] = "-";
        LastCheckinArr++;
      }

      if(body_fat_mass_Length != -1 && !isNaN(this.bodyFatMass[body_fat_mass_Length]['body_fat_mass'])){
        this.LastCheckin[LastCheckinArr] = [];
        this.LastCheckin[LastCheckinArr]['title'] = 'Body Fat Mass';
        this.LastCheckin[LastCheckinArr]['name'] = 'body_fat_mass';
        this.LastCheckin[LastCheckinArr]['icon'] = 'fac-vitals fa-fat';
        this.LastCheckin[LastCheckinArr]['val'] = this.bodyFatMass[body_fat_mass_Length]['body_fat_mass'].toFixed(2);
        this.LastCheckin[LastCheckinArr]['unit'] = 'Kg';
        if (this.LastCheckin[LastCheckinArr]['val'] < lowFatReference) {
          this.LastCheckin[LastCheckinArr]['color'] = '#ff9800';
        }
        if (this.LastCheckin[LastCheckinArr]['val'] >= lowFatReference && this.LastCheckin[LastCheckinArr]['val'] <= acceptFatReference) {
          this.LastCheckin[LastCheckinArr]['color'] = '#4caf50';
        }
        if (this.LastCheckin[LastCheckinArr]['val'] > acceptFatReference && this.LastCheckin[LastCheckinArr]['val'] <= highFatReference) {
          this.LastCheckin[LastCheckinArr]['color'] = '#fd7e14';
        }
        if (this.LastCheckin[LastCheckinArr]['val'] > highFatReference) {
          this.LastCheckin[LastCheckinArr]['color'] = '#f44336';
        }
        LastCheckinArr++;
      }
      else{
        this.LastCheckin[LastCheckinArr] = [];
        this.LastCheckin[LastCheckinArr]['title'] = 'Body Fat Mass';
        this.LastCheckin[LastCheckinArr]['name'] = 'body_fat_mass';
        this.LastCheckin[LastCheckinArr]['icon'] = 'fac-vitals fa-fat';
        this.LastCheckin[LastCheckinArr]['val'] = "-";
        LastCheckinArr++;
      }

      if(protien_Length != -1 && !isNaN(this.protein[protien_Length]['protien'])){
        this.LastCheckin[LastCheckinArr] = [];
        this.LastCheckin[LastCheckinArr]['title'] = 'Protein';
        this.LastCheckin[LastCheckinArr]['name'] = 'protien';
        this.LastCheckin[LastCheckinArr]['icon'] = 'fac-vitals fa-protein';
        this.LastCheckin[LastCheckinArr]['val'] = this.protein[protien_Length]['protien'].toFixed(2);
        this.LastCheckin[LastCheckinArr]['unit'] = 'Kg';
        if (this.LastCheckin[LastCheckinArr]['val'] < proteinl) {
          this.LastCheckin[LastCheckinArr]['color'] = '#ff9800';
        }
        if (this.LastCheckin[LastCheckinArr]['val'] >= proteinl && this.LastCheckin[LastCheckinArr]['val'] <= proteinh) {
          this.LastCheckin[LastCheckinArr]['color'] = '#4caf50';
        }
        if (this.LastCheckin[LastCheckinArr]['val'] > proteinh) {
          this.LastCheckin[LastCheckinArr]['color'] = '#f44336';
        }
        LastCheckinArr++;
      }
      else{
        this.LastCheckin[LastCheckinArr] = [];
        this.LastCheckin[LastCheckinArr]['title'] = 'Protein';
        this.LastCheckin[LastCheckinArr]['name'] = 'protien';
        this.LastCheckin[LastCheckinArr]['icon'] = 'fac-vitals fa-protein';
        this.LastCheckin[LastCheckinArr]['val'] = "-";
        LastCheckinArr++;
      }

      if(skeletal_muscle_mass_Length != -1 && !isNaN(this.skeletalMuscleMass[skeletal_muscle_mass_Length]['skeletal_muscle_mass'])){
        this.LastCheckin[LastCheckinArr] = [];
        this.LastCheckin[LastCheckinArr]['title'] = 'Skeletal Muscle Mass';
        this.LastCheckin[LastCheckinArr]['name'] = 'skeletal_muscle_mass';
        this.LastCheckin[LastCheckinArr]['icon'] = 'fac-vitals fa-muscle';
        this.LastCheckin[LastCheckinArr]['val'] = this.skeletalMuscleMass[skeletal_muscle_mass_Length]['skeletal_muscle_mass'].toFixed(2);
        this.LastCheckin[LastCheckinArr]['unit'] = 'Kg';
        if (this.LastCheckin[LastCheckinArr]['val'] < lowSmmReference) {
          this.LastCheckin[LastCheckinArr]['color'] = '#ff9800';
        }
        if (this.LastCheckin[LastCheckinArr]['val'] >= lowSmmReference) {
          this.LastCheckin[LastCheckinArr]['color'] = '#4caf50';
        }
        // if (this.LastCheckin[LastCheckinArr]['val'] > highSmmReference) {
        //   this.LastCheckin[LastCheckinArr]['color'] = '#f44336';
        // }
        LastCheckinArr++;
      }
      else{
        this.LastCheckin[LastCheckinArr] = [];
        this.LastCheckin[LastCheckinArr]['title'] = 'Skeletal Muscle Mass';
        this.LastCheckin[LastCheckinArr]['name'] = 'skeletal_muscle_mass';
        this.LastCheckin[LastCheckinArr]['icon'] = 'fac-vitals fa-muscle';
        this.LastCheckin[LastCheckinArr]['val'] = "-";
        LastCheckinArr++;
      }

      if(visceral_fat_Length != -1 && !isNaN(this.visceralFat[visceral_fat_Length]['visceral_fat'])){
        this.LastCheckin[LastCheckinArr] = [];
        this.LastCheckin[LastCheckinArr]['title'] = 'Visceral Fat';
        this.LastCheckin[LastCheckinArr]['name'] = 'visceral_fat';
        this.LastCheckin[LastCheckinArr]['icon'] = 'fac-vitals fa-fat';
        this.LastCheckin[LastCheckinArr]['val'] = this.visceralFat[visceral_fat_Length]['visceral_fat'].toFixed(2);
        this.LastCheckin[LastCheckinArr]['unit'] = 'Sq.cm';
        if (this.LastCheckin[LastCheckinArr]['val'] <= 100) {
          this.LastCheckin[LastCheckinArr]['color'] = '#ff9800';
        }
        if (this.LastCheckin[LastCheckinArr]['val'] > 100 && this.LastCheckin[LastCheckinArr]['val'] >= 120) {
          this.LastCheckin[LastCheckinArr]['color'] = '#4caf50';
        }
        if (this.LastCheckin[LastCheckinArr]['val'] > 120) {
          this.LastCheckin[LastCheckinArr]['color'] = '#f44336';
        }
        LastCheckinArr++;
      }
      else{
        this.LastCheckin[LastCheckinArr] = [];
        this.LastCheckin[LastCheckinArr]['title'] = 'Visceral Fat';
        this.LastCheckin[LastCheckinArr]['name'] = 'visceral_fat';
        this.LastCheckin[LastCheckinArr]['icon'] = 'fac-vitals fa-fat';
        this.LastCheckin[LastCheckinArr]['val'] = "-";
        LastCheckinArr++;
      }

      if(waist_hip_ratio_Length != -1){
        this.LastCheckin[LastCheckinArr] = [];
        this.LastCheckin[LastCheckinArr]['title'] = 'Waist/Hip Ratio';
        this.LastCheckin[LastCheckinArr]['name'] = 'waist_hip_ratio';
        this.LastCheckin[LastCheckinArr]['icon'] = 'fac-vitals fa-hip';
        this.LastCheckin[LastCheckinArr]['val'] = this.waistHipRatio[waist_hip_ratio_Length]['waist_hip_ratio'];
        this.LastCheckin[LastCheckinArr]['unit'] = '';
        if (this.LastCheckin[LastCheckinArr]['val'] < 0.80) {
          this.LastCheckin[LastCheckinArr]['color'] = '#ff9800';
        }
        if (this.LastCheckin[LastCheckinArr]['val'] >= 0.80 && this.LastCheckin[LastCheckinArr]['val'] <= 0.90) {
          this.LastCheckin[LastCheckinArr]['color'] = '#4caf50';
        }
        if (this.LastCheckin[LastCheckinArr]['val'] > 0.90) {
          this.LastCheckin[LastCheckinArr]['color'] = '#f44336';
        }
        LastCheckinArr++;
      }
      else{
        this.LastCheckin[LastCheckinArr] = [];
        this.LastCheckin[LastCheckinArr]['title'] = 'Waist/Hip Ratio';
        this.LastCheckin[LastCheckinArr]['name'] = 'waist_hip_ratio';
        this.LastCheckin[LastCheckinArr]['icon'] = 'fac-vitals fa-hip';
        this.LastCheckin[LastCheckinArr]['val'] = "-";
        LastCheckinArr++;
      }

      if(basal_metabolic_rate_Length != -1 && !isNaN(this.basalMetabolicRate[basal_metabolic_rate_Length]['basal_metabolic_rate'])){
        this.LastCheckin[LastCheckinArr] = [];
        this.LastCheckin[LastCheckinArr]['title'] = 'Basal Metabolic Rate';
        this.LastCheckin[LastCheckinArr]['name'] = 'basal_metabolic_rate';
        this.LastCheckin[LastCheckinArr]['icon'] = 'fac-vitals fa-fat';
        this.LastCheckin[LastCheckinArr]['val'] = this.basalMetabolicRate[basal_metabolic_rate_Length]['basal_metabolic_rate'].toFixed(2);
        this.LastCheckin[LastCheckinArr]['unit'] = 'Kcal';
        // if (this.LastCheckin[LastCheckinArr]['val'] <= 1200) {
        //   this.LastCheckin[LastCheckinArr]['color'] = '#f44336';
        // }
        // if (this.LastCheckin[LastCheckinArr]['val'] > 1200) {
        //   this.LastCheckin[LastCheckinArr]['color'] = '#4caf50';
        // }
        LastCheckinArr++;
      }
      else{
        this.LastCheckin[LastCheckinArr] = [];
        this.LastCheckin[LastCheckinArr]['title'] = 'Basal Metabolic Rate';
        this.LastCheckin[LastCheckinArr]['name'] = 'basal_metabolic_rate';
        this.LastCheckin[LastCheckinArr]['icon'] = 'fac-vitals fa-fat';
        this.LastCheckin[LastCheckinArr]['val'] = "-";
        LastCheckinArr++;
      }

      if(waist_height_ratio_Length != -1 && !isNaN(this.waistHeightRatio[waist_height_ratio_Length]['waist_height_ratio'])){
        this.LastCheckin[LastCheckinArr] = [];
        this.LastCheckin[LastCheckinArr]['title'] = 'Waist/Height Ratio';
        this.LastCheckin[LastCheckinArr]['name'] = 'waist_height_ratio';
        this.LastCheckin[LastCheckinArr]['icon'] = 'fac-vitals fa-tape';
        this.LastCheckin[LastCheckinArr]['val'] = this.waistHeightRatio[waist_height_ratio_Length]['waist_height_ratio'].toFixed(2);
        this.LastCheckin[LastCheckinArr]['unit'] = '';
        if (this.LastCheckin[LastCheckinArr]['val'] < waisttoheightratiolow) {
          this.LastCheckin[LastCheckinArr]['color'] = '#ff9800';
        }
        if (this.LastCheckin[LastCheckinArr]['val'] >= waisttoheightratiolow && this.LastCheckin[LastCheckinArr]['val'] <= waisttoheightratiohigh) {
          this.LastCheckin[LastCheckinArr]['color'] = '#4caf50';
        }
        if (this.LastCheckin[LastCheckinArr]['val'] > waisttoheightratiohigh) {
          this.LastCheckin[LastCheckinArr]['color'] = '#f44336';
        }
        LastCheckinArr++;
      }
      else{
        this.LastCheckin[LastCheckinArr] = [];
        this.LastCheckin[LastCheckinArr]['title'] = 'Waist/Height Ratio';
        this.LastCheckin[LastCheckinArr]['name'] = 'waist_height_ratio';
        this.LastCheckin[LastCheckinArr]['icon'] = 'fac-vitals fa-tape';
        this.LastCheckin[LastCheckinArr]['val'] = "-";
        LastCheckinArr++;
      }

      //this.weightInputCheckForBMiCal();
      this.basicInfoCheck();
      //this.getLastCheckinData();

      let healthData: any[] = res.map(vital => {
        return {
          vitals: {
            ecgBpm: vital.ECGBpm !== "" ? vital.ECGBpm : '-',
            fatRatio: vital.fatRatio !== undefined ? vital.fatRatio : '-',
            weight: vital.weightKG !== undefined ? vital.weightKG.toFixed(2) : '-',
            bmi: vital.bmi !== undefined ? vital.bmi.toFixed(2) : '-',
            systolic: vital.systolic !== undefined ? vital.systolic : '-',
            diastolic: vital.diastolic !== undefined ? vital.diastolic : '-',
            pulseBpm: vital.pulseBpm != undefined ? vital.pulseBpm : '-',
            spo2: vital.spo2 !== undefined ? vital.spo2 : '-',
            temperature: vital.temperature !== undefined ? vital.temperature.toFixed(2) : '-',
            height: vital.heightMeters,
            bmiClass: vital.bmi !== undefined ? this.toTitleCase(vital.bmiClass) : '-',
            ecg1: vital.ECGData,
            ecg2: vital.ECGData2,
            ecg3: vital.ECGData3,
            lead2Status: vital.leadTwoStatus !== "" ? vital.leadTwoStatus : '-',
            dateTime: vital.dateTimeFormatted,
            percent_body_fat: vital.percent_body_fat !== undefined && !isNaN(vital.percent_body_fat) ? vital.percent_body_fat.toFixed(2) : '-',
            body_cell_mass: vital.body_cell_mass !== undefined && !isNaN(vital.body_cell_mass)? vital.body_cell_mass.toFixed(2) : '-',
            bone_mineral_content: vital.bone_mineral_content !== undefined && !isNaN(vital.bone_mineral_content)? vital.bone_mineral_content.toFixed(2) : '-',
            extra_cellular_water: vital.extra_cellular_water !== undefined && !isNaN(vital.extra_cellular_water)? vital.extra_cellular_water.toFixed(2) : '-',
            intra_cellular_water: vital.intra_cellular_water !== undefined && !isNaN(vital.intra_cellular_water)? vital.intra_cellular_water.toFixed(2) : '-',
            mineral: vital.mineral !== undefined && !isNaN(vital.mineral)? vital.mineral.toFixed(2) : '-',
            body_fat_mass: vital.body_fat_mass !== undefined && !isNaN(vital.body_fat_mass)? vital.body_fat_mass.toFixed(2) : '-',
            protien: vital.protien !== undefined && !isNaN(vital.protien)? vital.protien.toFixed(2) : '-',
            skeletal_muscle_mass: vital.skeletal_muscle_mass !== undefined && !isNaN(vital.skeletal_muscle_mass)? vital.skeletal_muscle_mass.toFixed(2) : '-',
            visceral_fat: vital.visceral_fat !== undefined && !isNaN(vital.visceral_fat)? vital.visceral_fat : '-',
            waist_hip_ratio: vital.waist_hip_ratio !== undefined && !isNaN(vital.waist_hip_ratio)? vital.waist_hip_ratio.toFixed(2) : '-',
            basal_metabolic_rate: vital.basal_metabolic_rate !== undefined && !isNaN(vital.basal_metabolic_rate)? vital.basal_metabolic_rate.toFixed(2) : '-',
            waist_height_ratio: vital.waist_height_ratio !== undefined && !isNaN(vital.waist_height_ratio) ? vital.waist_height_ratio : '-',
          }
        }
      });

      let graphData = {};
      Object.keys(healthData[0].vitals).forEach((key: string) => {
        graphData[key] = healthData.reduce((acc: any[], cur) => {
          if (cur.vitals === undefined) return acc;
          acc.push(cur.vitals[key]);
          return acc;
        }, []).join(",");

      });

      return {
        success: true,
        user: {
          gender: res[0].gender === "m" ? "male" : "female",
          dateOfBirth: res[0].dateOfBirth,
          healthData: healthData,
          graphData: graphData
        }
      }
    }));
  }

  weightInputCheckForBMiCal(){
        if(this.WEIGHT.length == 0){
          let userData = JSON.parse(this._constants.aesDecryption('userData'));
          if(userData['userInputWeightInKG'] == undefined ||  userData['heightMeters'] == undefined){
            this.router.navigate(['export']);
            return 0;
          } else {
            localStorage.setItem('height', userData['heightMeters']);
            localStorage.setItem('weight', userData['userInputWeightInKG']);
          }
        } else {          
          localStorage.setItem('weight', this.WEIGHT[this.WEIGHT.length-1]);
        }
  }

  /*getLastCheckinData(){
    return this.LastCheckin;
  }

  getECGcheckins(){
    return this.ECG;
  }

  getBMCcheckins(){
    return this.BMC;
  }

  getWEIGHTcheckins(){
    return this.WEIGHT;
  }

  getBMIcheckins(){
    return this.BMI;
  }

  getBPcheckins(){
    return this.BP;
  }

  getPULSEcheckins(){
    return this.PULSE;
  }

  gettEMPERATUREcheckins(){
    return this.TEMPERATURE;
  }

  getSPO2checkins(){
    return this.SPO2;
  } */

  getInviteLink(id) {
    let headers: HttpHeaders = this.getBearerHeaders()
    return this.http.get(this.BASE_URL + 'playgrounds/' + id + '/inviteLink', { headers: headers }).pipe(map(res => res));
  }

  getPlaygrounds(username) {
    let headers: HttpHeaders = this.getBearerHeaders()
    return this.http.get(this.BASE_URL + 'users/' + username + '/playgrounds', { headers: headers }).pipe(map(res => res));
  }

  getPlaygroundFromId(id) {
    let headers: HttpHeaders = this.getBearerHeaders()
    return this.http.get(this.BASE_URL + 'playgrounds/' + id, { headers: headers }).pipe(map(res => res));
  }

  getUsersFromPlayground(id) {
    let headers: HttpHeaders = this.getBearerHeaders()
    return this.http.get(this.BASE_URL + 'playgrounds/' + id + '/users', { headers: headers }).pipe(map(res => res/*.json()*/));
  }

  isLoggedIn() {
    let body = { username: this.getUser(), token: this.getToken() }

    let headers: HttpHeaders = this.getBearerHeaders()
    return this.http.post(this.BASE_URL + 'authToken/authenticate', body, { headers: headers }).pipe(map(res => res/*.json()*/));
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

  toTitleCase(text) {
    if (text !== undefined) {
      var result = text.replace(/([A-Z])/g, " $1");
      return result.charAt(0).toUpperCase() + result.slice(1);
    }
  }

  checkSession(){
    if(this._constants.aesDecryption('userData') == undefined){
      this.globalVariableReset();
      if(this._constants.aesDecryption("loginValue") != undefined){
        localStorage.clear();
        this.LastCheckin = [];
        window.location.href="../index.html";
      } else {
        localStorage.clear();
        this.LastCheckin = [];
        this.router.navigate(['/']);
      }
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

  postEditProfilePic(apiKey, IHLUserToken, IHLUserId, jsontext){
    let headers = new HttpHeaders()
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('ApiToken', apiKey);
    headers =  headers.append('Token', IHLUserToken);
    return this.http.post(this.IHL_BASE_URL+"data/user/"+IHLUserId+"/photo",jsontext, {headers: headers, responseType: 'text'}).pipe(map(res => res/*.json()*/));
  }

  postNewPasswordInput(apiKey,IHLUserToken,jsontext){
    let headers = new HttpHeaders()
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('ApiToken', apiKey);
    headers =  headers.append('Token', IHLUserToken);
    return this.http.post(this.IHL_BASE_URL+"login/changepassword",jsontext, {headers: headers, responseType: 'text'}).pipe(map(res => res/*.json()*/),catchError((error: any) => {
      if(error.status === 401 || error.status === 403){
          return Observable.throw(new Error(error.status));
        }
  }))
  }

  postEditProfieInput(apiKey,IHLUserToken,IHLUserId,jsontext): Observable<any>{
    let headers = new HttpHeaders()
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('ApiToken', apiKey);
    headers =  headers.append('Token', IHLUserToken);
    //return this.http.post(this.IHL_BASE_URL+"data/user/"+IHLUserId,jsontext, {headers: headers}).pipe(map(res => res/*.json()*/));
    return this.http.post(this.IHL_BASE_URL+"data/user/"+IHLUserId,jsontext, {headers: headers});
  }

  deleteProfieInput(apiKey,IHLUserToken,IHLUserId,emailforDel,pwdForDel){
    let headers = new HttpHeaders()
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('ApiToken', apiKey);
    headers =  headers.append('Token', IHLUserToken);
    //return this.http.delete(this.IHL_BASE_URL+"login/user/"+IHLUserId+"/"+emailforDel+"/"+pwdForDel, {headers: headers}).pipe(map(res => res/*.json()*/));
  //   return this.http.delete(this.IHL_BASE_URL+"login/user/"+IHLUserId+"/emailormobile/"+emailforDel+"/pass/"+pwdForDel, {headers: headers}).pipe(map(res => res/*.json()*/),catchError((error: any) => {
  //     if(error.status === 401 || error.status === 403){
  //         return Observable.throw(new Error(error.status));
  //       }
  // }))
  return this.http.delete(this.IHL_BASE_URL+"login/user/"+IHLUserId+"/emailormobile/"+emailforDel+"/pass/"+pwdForDel, {headers: headers})


  }

  teleCallRedirection(): Observable<any>{

  const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');

    let body = null;
    let userData = JSON.parse(this._constants.aesDecryption('userData'));
    var gender = "";
    if(userData.gender == "m"){
     gender = "Male";
    } else {
     gender = "Female";
    }
     var dob = userData.dateOfBirth.replace(/\s+/g, '');

     var dobArr = dob.split("/");
     var finalDob = dobArr[0]+'/'+dobArr[1]+'/'+dobArr[2];

     let url = this._constants.externalBaseURL+'genix/subDomainUrlGenerate.php?UserName='+userData.email+'&Name='+userData.firstName+'&Phone=&Password=1234562563&rand='+this.randNumber()+'&Gender='+gender+'&DOB='+finalDob;
     //alert(url);
    return this.http.post(url, body, {headers, responseType: 'text'}).pipe(map(res => res/*.json()*/));
  }

  randNumber(){
    return Math.random();
  }

  basicInfoCheck(){
    // localstorage basic info check
    // lastCheckin weight check
    //user entered weight check
    let userData = JSON.parse(this._constants.aesDecryption('userData'));
    let userGender = localStorage.setItem('usergender', this._constants.aesEncryption(userData['gender']));

    /* alert(" userData['dateOfBirth'] = "+ userData['dateOfBirth']);
    alert(" userData['gender'] = "+ userData['gender']);
    alert("userData['heightMeters'] = "+ userData['heightMeters']); */

    if(userData != undefined){
      if(userData['dateOfBirth'] == undefined || userData['dateOfBirth'] == '' || userData['dateOfBirth'] == "null" || userData['dateOfBirth'] == null ||
        userData['gender'] == undefined || userData['gender'] == '' || userData['gender'] == 'null' || userData['gender'] == null ){
          this._constants.basicInfoNeed = true;
          this.router.navigate(['export']);
        return 0;
      }
      if(userData['heightMeters'] == undefined || userData['heightMeters'] == '' || userData['heightMeters'] == 'null' || userData['heightMeters'] == null ){
        // height check
        let userEnterHeight = this._constants.aesDecryption('height');
        if(userEnterHeight == undefined || userEnterHeight == '' || userEnterHeight == 'null' || userEnterHeight == null){
          this._constants.basicInfoNeed = true;
          this.router.navigate(['export']);
          return 0;
        }
      } else {
        localStorage.setItem('height', userData['heightMeters']);
      }

    // alert("this.WEIGHT.length = "+ this.WEIGHT.length);
      if(this.WEIGHT.length == 0){
        //weight check
        if(userData['userInputWeightInKG'] == undefined || userData['userInputWeightInKG'] == '' || userData['userInputWeightInKG'] == 'null' || userData['userInputWeightInKG'] == null || userData['userInputWeightInKG'] == "0"){
          let userEnterWeight = this._constants.aesDecryption('weight');
        //  alert("userEnterWeight check = "+ typeof userEnterWeight);
          if(userEnterWeight == undefined || userEnterWeight == '' || userEnterWeight == 'null' || userEnterWeight == null || userEnterWeight== "0"){
        //    alert("true");
            this._constants.basicInfoNeed = true;
            this.router.navigate(['export']);
            return 0;
          } else {
          //  alert("false");
            localStorage.setItem("weight", userEnterWeight);
          // alert("userEnterWeight = "+ userEnterWeight);
          }
        } else {
        // alert("userData['userInputWeightInKG'] = "+ userData['userInputWeightInKG']);
          localStorage.setItem("weight", userData['userInputWeightInKG']);
        }
      } else {
      // alert("this.WEIGHT[this.WEIGHT.length -1].weightKG = " + this.WEIGHT[this.WEIGHT.length -1].weightKG);
        let weight = this.WEIGHT[this.WEIGHT.length -1].weightKG;
        localStorage.setItem("weight", weight);
      }

    }

  }

  globalVariableReset(){
    this._constants.basicInfoNeed = false;
    this._constants.dashboardBmiCalculDone = false;
    this._constants.loggedInMetricsObject  = null;
    this._constants.openModal = null;
    this._constants.processingContent = null;
    this._constants.programIsCancelled = false;
    this._constants.programIsWaiting = null;
    this._constants.selectedProgram = null;
    this._constants.takeSurveyScore = null;
    this._constants.takeSurveyScoreShow = null;
    this._constants.teleConsultaionAgree = false;
    this._constants.userChangedProgram = null;
    this._constants.userFirstName = null;
    this._constants.userGender = null;
    this._constants.userLastName = null;
    this._constants.userPassword = null;
    this._constants.userSelectedOldProgram = null;
    this._constants.wrongInformation = null;
    this._constants.notShowMetrics = false;
    this._constants.changedAffiliation = null;
    this._constants.riskInfoAlerts = false;
    this._constants.riskInfoTitle = null;
    this._constants.riskInfoSubTitle = null;
    this._constants.notShowMetricsTitle = "programs";
    this._constants.prescriptionPreparation = false;
    this._constants.buyMedicineOnline = false;
    this._constants.getLabOrder = false;
    this._constants.confirmAppointment = false;
    this._constants.genixIframeOpened = false;
    this._constants.genixVideoCallURL = "";
    this._constants.genixAppointmentDetais = {};


    this._constants.getTeleConsulationHistory = null;
    this._constants.userProfilePic = null;
    this._constants.userProfilePicType = null;

    this._constants.generateCouponCode = false;
    this._constants.videoWindow = false;
    this._constants.videoCallStart = false;
    this._constants.videoCallExpandStyle = true;

    this._constants.consultationPlatformData = null;
    this._constants.teleConsultPageFlow = [];
    this._constants.healthBlogsData = null;
    this._constants.appointmentDetails;
    this._constants.newAppointmentID = null;
    this._constants.consultationUserData = null;
    // Global variable to pass the doctor details from doctor list page to video call page
    this._constants.selectedDoctor = undefined;
    this._constants.teleconsultCrossbarServiceData = {};
    this._constants.reachingVideoCallPageFrom = '';
    this._constants.genixVideoCallURL = "";
    this._constants.genixAppointmentDetais = {};
    this._constants.doctorPrescribedData = {};
    this._constants.noDoctorIsAvailable = false;
    this._constants.noCourseIsAvailable = false;
    this._constants.startCallFlow = false;
    this._constants.genixIframeOpened = false;
    this._constants.teleConsultType = null;
    this._constants.teleSpecalityType = null;
    this._constants.teleConsultBackBtnClick = false;
    this._constants.bookAppointmentProcess = false;
    this._constants.liveAppointmentProcess = false;
    this._constants.createSubscriptionProcess = false;
    this._constants.teleconsultMobileValidate = false;
    this._constants.teleconsultAddMobileNumber = false;
    this._constants.teleconsultMyAppointmentCancelButton = false;
    this._constants.cancelAndRefundAppointment = false;
    this._constants.cancelAndRefundModelBoxBtn = true;
    this._constants.cancelAndRefundModelBoxInput = true;
    this._constants.teleconsultMySubscriptionCancelButton = false;
    this._constants.teleconsultMySubscriptionRefundCancelButton = false;
    this._constants.consultantDataForReview;
    this._constants.platformDataFailedToLoad = false;
    this._constants.directCallfind = false;
    this._constants.initUITour = false;
    this._constants.challenge_welcomeWindow = false;
    this._constants.challenge_numberOfDays;
    this._constants.razorpayMode = false;
    this._constants.newSubscriptionId = null;
    this._constants.isOnlineClassEnded = false;
    this._constants.liveCallCourseObj = {};
    this._constants.challenge_programName = '';
    this._constants.isAffiliatedRouterLink = false;
    this._constants.tourDoneShowHbuddy = false;
    this._constants.teleconsultationFlowSelected = "genric";//genric //affiliate
    this._constants.teleconsultationAffiliationSelectedName = "";//persistent //dimention //Dimention Gym
    this._constants.isAffiliatedUser = false;
    this._constants.teleconsultationAffiliationSelectedCompanyImg = "";
    this._constants.affiliatedCompanies = [];
    this._constants.showAffDeleteModal = false;
    this._constants.affilate_unique_name = '';
    this._constants.affilate_company_name = '';
    this._constants.telePlatformDataFirstTimeCall = false;
    this._constants.fitnessDashboardObj = {};
    this._constants.transactionIdForTeleconsultation = "";
    this._constants.printInvoiceNumberForTeleconsultation = "";
    this._constants.teleConsultaionAgreeFlow  = false;

    this._constants.refundInfo = false;
    this._constants.showConsultantRefundInfo = false;
    this._constants.showClassRefundInfo = false;
    this._constants.refundConsultantInfoArr = [
      {cancellation_time:'x_hours',cancellation_refund:'_'},
      {cancellation_time:'refund_perenct_before_x_hours',cancellation_refund:'50%'},
      {cancellation_time:'refund_perenct_after_x_hours',cancellation_refund:'30%'},
      {cancellation_time:'refund_perenct_for_customer_noshow',cancellation_refund:'0%'},
      {cancellation_time:'refund_perenct_for_consultant_cancel_before_appointment',cancellation_refund:'100%'},
      {cancellation_time:'refund_percent_for_consultant_no_show',cancellation_refund:'100%'}
    ];
    this._constants.refundClassInfoArr = [
      {cancellation_time:'x_percent_of_course_completed',cancellation_refund:'20%'},
      {cancellation_time:'y_percent_of_course_completed',cancellation_refund:'50%'},
      {cancellation_time:'z_percent_of_course_completed',cancellation_refund:'70%'},
      {cancellation_time:'refund_perenct_before_x_percent_of_course_completed',cancellation_refund:'60%'},
      {cancellation_time:'refund_perenct_after_x_and_before_y_percent_of_course_completed',cancellation_refund:'30%'},
      {cancellation_time:'refund_perenct_after_y_and_before_z_percent_of_course_completed',cancellation_refund:'10%'},
      {cancellation_time:'refund_perenct_after_z_percent_of_course_completed',cancellation_refund:'0%'}
    ];
    this._constants.genixSuperAdminDoctorId = "c55b08329ec34ca9a049723bd3fe0231";
    this._constants.affiliationListReceived = false;
    this._constants.cancelAppointmentModelBoxTitle = '';
    this._constants.prescriptionObjectFor1mg = "";
    this._constants._is_base64_pdf_available = false;
    this._constants.checkinHistory = {};
    this._constants.vendorAppointmentId = "";
    this._constants.medicationPartnerDetails = null;
    this._constants.labPartnerDetails = null;
    this._constants.getLabOrder = false;
    this._constants.teleconsultationAffiliationCode = undefined;
    this._constants._is_base64_lab_pdf_available =false;
    this._constants.labObjectFor1mg = "";
    this._constants.documentToShare = [];
    this._constants.jointAccountTermsAndConditions = false;
    this._constants.affiliatedFirstLoginModelBox = false;
    this._constants.userProfileData = null;
    this._constants.unlinkJointUserConfirmationPopUp = false;
    this._constants._isDiagnosticConsultantSelected = false;
    this._constants.jointUserTermsConditionsPopUp = false;
    this._constants.jointuserSelectMyself = false;
    this._constants.jointuserSelectMyselforOthers = false;
    this._constants.jointuserSelectothers = true;
    this._constants.teleflowjoinuser = [];
    this._constants.requestedjoinuser = false;
    this._constants.requestacceptance = false;
    this._constants.requested_users;
    this._constants.unsendJointUserrequestconfirmation = false;
    this._constants.caretakerlistAccount = false;
    this._constants.caretakeracceptance = false;
    this._constants.unsendCareUserrequestconfirmation = false;
    this._constants.unlinkJointAccountPopUp = false;
    this._constants.renameFilePopUp = false;
    this._constants.currentUploadedFileName = null;
    this._constants.medicalDocumentsList = [];
    this._constants.saveFile = true;
    this._constants.modifiedMedicalFileName = null;
    this._constants._isDependentUserAccount = false;
    this._constants.requestedlistAccount = false;
    this._constants.persistentSpecialityArrList;
  }

  liveVideoCallWindow(){
    //alert(this.router.url);
    if(this._constants.videoCallStart){
      if(this.router.url === "/teleconsult-video-call"){
       // this._constants.videoWindow = false;
      //  $("body > app-root > div").css("transform","translate3d(0px, 0px, 0px)");
       this._constants.videoCallExpandStyle = false;
      } else {
        this._constants.videoWindow = true;
        this._constants.videoCallExpandStyle = true;
      }
    } else {
      this._constants.videoWindow = false;
    }
  }

  getHealthBlogData(){
    let url = this._constants.externalBaseURL+'php/pulseArticle/article_curl.php';
    return this.http.get(url).pipe(map(res => res/*.json()*/));
  }

  bookAppointment(data){
    //let headers: HttpHeaders = this.getBookAppointmentHeaders();
    let headers = new HttpHeaders()
    headers = headers.append('Content-Type', 'application/json');
    return this.http.post(this._constants.ihlBaseurl+"consult/BookAppointment",JSON.stringify(data), {headers: headers}).pipe(map(res => res/*.json()*/));
  }

  createUserSubscription(data){
    let headers: HttpHeaders = this.getSubscriptionHeaders();
    return this.http.post(this._constants.ihlBaseurl+"consult/createsubscription",JSON.stringify(data), {headers: headers}).pipe(map(res => res/*.json()*/));
  }

  cancelAppointmentWithRefund(req, url): Observable<any>{
    let headers: HttpHeaders = this.getSubscriptionHeaders();
    return this.http.post(this.IHL_BASE_URL + url, JSON.stringify(req), {headers: headers}).pipe(map(res => res));
  }

  cancelSubscriptionWithRefund(req): Observable<any>{
    let headers: HttpHeaders = this.getSubscriptionHeaders();
    return this.http.post(this.IHL_BASE_URL + "consult/cancel_subscription",JSON.stringify(req), {headers: headers}).pipe(map(res => res));
  }

  cancelAppointment(id): Observable<any>{
    let headers: HttpHeaders = this.getSubscriptionHeaders();
    return this.http.get(this.IHL_BASE_URL + "/consult/update_appointment_status?appointment_id="+id+"&appointment_status=canceled", {headers: headers}).pipe(map(res => res/*.json()*/));
  }


  generateGenixURL(id): Observable<any>{
    let urlDetail = {
      "ihl_appointment_id": id
    };

    let headers: HttpHeaders = this.getSubscriptionHeaders();
    return this.http.post(this.IHL_BASE_URL + "consult/generate_genix_call_url",JSON.stringify(urlDetail), {headers: headers});
  }

  getLiveDoctorStatus(obj){
    if(this.vaptEnabled){
      console.log(obj);
      //alert("check log");
      let id = obj.consultantId.toString();
      let vendor = obj.vendorId.toString();
      //let headers: HttpHeaders = this.getSubscriptionHeaders();
      let headers : HttpHeaders = new HttpHeaders();
      headers = headers.append('Content-Type', 'application/json');
      headers = headers.append('ApiToken', localStorage.getItem('apiKey'));
      return this.http.get(this.IHL_BASE_URL + "consult/consultant_timings_live_availablity?ihl_consultant_id="+id+"&vendor_id="+vendor, {headers: headers}).pipe(map(res => res/*.json()*/));
    }else{
      console.log(obj);
      //alert("check log");
      let id = obj.consultantId.toString();
      let vendor = obj.vendorId.toString();
      //let headers: HttpHeaders = this.getSubscriptionHeaders();
      let headers : HttpHeaders = new HttpHeaders();
      headers = headers.append('Content-Type', 'application/json');
      return this.http.get(this.IHL_BASE_URL + "consult/consultant_timings_live_availablity?ihl_consultant_id="+id+"&vendor_id="+vendor, {headers: headers}).pipe(map(res => res/*.json()*/));
    }
  }

  getClassImages(data){
    if(this.vaptEnabled){
      let body = JSON.stringify(data);
      let headers = {
        'Content-Type': 'application/json',
        'ApiToken':localStorage.getItem('apiKey')
      };
      return this.http.post(this.IHL_BASE_URL + "consult/courses_image_fetch", body, {headers: headers}).pipe(map(res => res/*.json()*/));
    }else{
      let body = JSON.stringify(data);
      let headers = {};
      return this.http.post(this.IHL_BASE_URL + "consult/courses_image_fetch", body, {headers: headers}).pipe(map(res => res/*.json()*/));
    }
  }

  couponCheck(data){
    let coupon = data;
    if(this._constants.selectedCourseId == ''){
      this.consultantId = this._constants.appointmentDetails.ihl_consultant_id;
      this.couponpurpose = 'teleconsultation';
    }else{
      this.consultantId = this._constants.selectedCourseConsultantId;
      this.courseId = this._constants.selectedCourseId;
      this.couponpurpose = 'class';
    }
    let ihlId = this._constants.aesDecryption('userId');
     return this.http.get(this.IHL_BASE_URL + "coupon/check_coupon_access?code="+ coupon +"&kiosk_id=&ihl_id="+ ihlId +"&source=portal&consultant_id="+ this.consultantId + "&course_id="+ this.courseId + "&purpose="+ this.couponpurpose);
  }

  appointmentDatAccept_Reject(appointmentDetails):Observable<any>{
    let headers : HttpHeaders = this.getAppointmentHeaders()
    return this.http.post(this.IHL_BASE_URL+"consult/approve_or_reject_subscription",JSON.stringify(appointmentDetails),{headers: headers});
  }

  postDoctorReview(obj) : Observable<any>{
    let dataObj = JSON.stringify(obj);
    //let headers : HttpHeaders = this.getBookAppointmentHeaders();
    let headers = new HttpHeaders()
    headers = headers.append('Content-Type', 'application/json');
    return this.http.post(this.IHL_BASE_URL+"consult/insert_telemed_reviews_new", dataObj, {headers: headers}).pipe(map(res => res/*.json()*/));
  }

  postCourseReview(obj) : Observable<any>{
    let dataObj = JSON.stringify(obj);
    let headers : HttpHeaders = this.getSubscriptionHeaders();
    return this.http.post(this.IHL_BASE_URL+"consult/insert_course_reviews", dataObj, {headers: headers}).pipe(map(res => res/*.json()*/));
  }

  postIntroIsDone(data) {
    let dataObj = JSON.stringify(data);
    let headers: HttpHeaders = this.getBearerHeadersIhl();
    return this.http.post(this.IHL_BASE_URL+"data/user/"+data.id, dataObj, {headers: headers}).pipe(map(res => res/*.json()*/));
  }

  updateDeletedAffiliation(userObj:object, apiToken:string) {
    let data = JSON.stringify(userObj['User']);
    let headers = {'Content-Type':'application/json', 'ApiToken':apiToken, 'Token':userObj['Token']};
    return this.http.post(this.IHL_BASE_URL+'data/user/'+userObj['User']['id']+'', data, {headers: headers}).pipe(map(res => res));
  }

  getSubscriptionHeaders() {
    let headers = new HttpHeaders()
    headers = headers.append('Content-Type', 'application/json');
    //headers = headers.append('ApiToken', this.subscriptionApiToken);
    //headers = headers.append('Token', this.subscriptionApikey);
    return headers
  }

  getBookAppointmentHeaders() {
    let headers = new HttpHeaders()
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('ApiToken', this.appointmentApikey);
    headers = headers.append('Token', this.appointmentApiToken);
    return headers
  }

  getAppointmentHeaders(){
    let headers = new HttpHeaders()
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('ApiToken', this.apiTokenSubscription);
    return headers
  }

  loginHeaderToken(): any {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('ApiToken', this.staticLoginHeaderToken);
    return headers;
  }

  getApiHeaderToken(): Observable<any> {
    if(this.vaptEnabled){
      let body = {"id": this._constants.aesEncryptionForVAPT('2936')};
      return this.http.post(`${this.IHL_BASE_URL}login/kioskLogin`, body, { headers: this.loginHeaderToken() }).pipe(
        map(response => {
          this.apiToken = "";
          if ('ApiKey' in JSON.parse(JSON.stringify(response))) {
            let responseObj = JSON.parse(JSON.stringify(response));
            this.apiToken = responseObj.ApiKey;
          }
          return this.apiToken;
        }),
        catchError(err => {
          return of("");
        })
      );
    }else{
      return this.http.get(`${this.IHL_BASE_URL}login/kioskLogin?id=2936`, { headers: this.loginHeaderToken() }).pipe(
        map(response => {
          this.apiToken = "";
          if ('ApiKey' in JSON.parse(JSON.stringify(response))) {
            let responseObj = JSON.parse(JSON.stringify(response));
            this.apiToken = responseObj.ApiKey;
          }
          return this.apiToken;
        }),
        catchError(err => {
          return of("");
        })
      );
    }
  }
  getRequest(url:any){
      var reqHeader = new HttpHeaders({ 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.apiToken
       });
      return this.http.get(url, { headers: new HttpHeaders({ 
        'Authorization': 'Bearer ' + this.apiToken
     }).delete('Content-Type')});
  }
  shareMedicalDocAfterAppointment(data){
    let body = JSON.stringify(data);
    let headers = {};
    return this.http.post(this.IHL_BASE_URL + "consult/share_medical_doc_after_appointment", body, {headers: headers}).pipe(map(res => res/*.json()*/));
  }

  getCToken(apiKey): Observable<any> {
    let headers: HttpHeaders = this.getBearerHeadersIhl()
    if (localStorage.getItem('apiKey') == undefined) {
      headers['ApiToken'] = apiKey;
    }
    return this.http.get(this.IHL_BASE_URL + '/login/getCToken', { headers: headers }).pipe(map(res => res/*.json()*/));
  }

}