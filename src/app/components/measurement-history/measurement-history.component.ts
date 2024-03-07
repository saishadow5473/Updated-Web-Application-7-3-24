import { Component, OnInit, DoCheck } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ShareDataService } from '../../services/customServices/share-data.service'
import { ConstantsService } from 'src/app/services/constants.service';

@Component({
  selector: 'app-measurement-history',
  templateUrl: './measurement-history.component.html',
  styleUrls: ['./measurement-history.component.css']
})
export class MeasurementHistoryComponent implements OnInit {

  public titleStyles = {
    paddingTop: "10px",
    fontWeight: "600",
    color: "#4885ed",
    paddingLeft:"8px",
    fontSize:"17px"
  }

  healthData: any
  testType: any
  keys: any
  Height:any
  Weight:any
  Gender:any
  userHeight:any

  WeightHistory: any
  BMIHistory: any
  FatRatioHistory: any
  Spo2History: any
  TempHistory: any
  ECGHistory: any
  BPHistory: any
  PulseHistory: any
  pbfHistory: any
  bcmHistory: any
  bmctHistory: any
  ecwHistory: any
  icwHistory: any
  bfmHistory: any
  smmHistory: any
  mineralHistory: any
  proteinHistory: any
  whtrHistory: any
  whprHistory: any
  vfHistory: any
  bmrHistory: any

  weightbool = false
  spo2bool = false
  tempbool = false
  bmibool = false
  fatratiobool = false
  ecgbool = false
  bpbool = false
  pulsebool = false
  pbfbool = false
  bcmbool = false
  bmctbool = false
  ecwbool = false
  icwbool = false
  bfmbool = false
  smmbool = false
  mineralbool = false
  proteinbool = false
  whtrbool = false
  whprbool = false
  vfbool = false
  bmrbool = false

  min_history = false

  constructor(private authService: AuthService, private _currentTitle: ShareDataService, private constant: ConstantsService) { }

  ngOnInit() {
    this._currentTitle.currentTitle.subscribe(currentTitle => this.testType = currentTitle)

    //this.authService.fetchUser(this.authService.getIhlUserId()).subscribe(data => {
      //this.healthData = data["user"]["healthData"]

     this.WeightHistory= [];
     this.BMIHistory= [];
     this.FatRatioHistory = [];
     this.Spo2History = [];
     this.TempHistory = [];
     this.ECGHistory = [];
     this.BPHistory= [];
     this.PulseHistory = [];
     this.pbfHistory = [];
     this.bcmHistory = [];
     this.bmctHistory = [];
     this.ecwHistory = [];
     this.icwHistory = [];
     this.bfmHistory = [];
     this.smmHistory = [];
     this.mineralHistory = [];
     this.proteinHistory = [];
     this.whtrHistory = [];
     this.whprHistory = [];
     this.vfHistory = [];
     this.bmrHistory = [];

     // for (let index = 0; index < this.healthData.length; index++) {
       // if(this.healthData[index].vitals.weight && this.healthData[index].vitals.weight !== "-"){
        //  this.WeightHistory.push(this.healthData[index].vitals.weight)
        //}

    let ecgHValue ,ecgHStatus, ecgHDateTime ,ecgHLocation, bpHSystolicValue ,bpHDiastolicValue ,bpHStatus ,bpHDateTime ,bpHLocation, temperatureHValue, temperatureHLocation, temperatureHDateTime, temperatureHStatus, pulseHValue, pulseHLocation, pulseHDateTime, pulseHStatus, bmcHValue, bmcHDateTime, bmcHLocation, bmcHStatus, bmiHValue, bmiHDateTime, bmiHLocation, bmiHStatus, weightHLocation, weightHDateTime, weightHValue, spo2HLocation, spo2HDateTime,spo2HValue,spo2HStatus,
        pbfHValue, pbfHDateTime , pbfHLocation, bcmHValue,bcmDateTime,bcmHLocation,bmctHValue,bmctDateTime,bmctHLocation,ecwHValue,ecwDateTime,ecwHLocation,icwHValue,icwDateTime,icwHLocation,mineralHValue,mineralDateTime,mineralHLocation,bfmHValue,bfmDateTime,bfmHLocation,proteinHValue,proteinDateTime,proteinHLocation,smmHValue,smmDateTime,smmHLocation,vfHValue,vfDateTime,vfHLocation,whprHValue,whprDateTime,whprHLocation,bmrHValue,bmrDateTime,bmrHLocation,whtrHValue,whtrDateTime,whtrHLocation;

        //sandip start full body bmc

    let lowPbfReference ;
    let highPbfReference ;
    let acceptPbfReference;
    let bcmlow  =20;
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
     this.Gender = this.constant.aesDecryption('usergender');

    if (this.Gender != "m") {
      //alert(this.Height);
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
    for (let index = 0; index < this.authService.percentBodyFat.length; index++) {

      if(this.authService.percentBodyFat[index].percent_body_fat !== "-" && !isNaN(this.authService.percentBodyFat[index].percent_body_fat)){
        pbfHValue = this.authService.percentBodyFat[index].percent_body_fat.toFixed(2)
      }
      pbfHLocation = this.authService.percentBodyFat[index].IHLMachineLocation
      pbfHDateTime = this.authService.percentBodyFat[index].dateTimeFormatted

      if (pbfHValue < lowPbfReference) {
        let model = [{ "w": pbfHValue, "x": "Low", "y": pbfHDateTime, "z": pbfHLocation, "color": "#ff9800" }]
        this.pbfHistory.push(model)
      }
      if (pbfHValue >= lowPbfReference && pbfHValue <= acceptPbfReference) {
        let model = [{ "w": pbfHValue, "x": "Normal", "y": pbfHDateTime, "z": pbfHLocation, "color": "#43A047" }]
        this.pbfHistory.push(model)
      }
      if (pbfHValue > acceptPbfReference && pbfHValue <= highPbfReference) {
        let model = [{ "w": pbfHValue, "x": "Acceptable", "y": pbfHDateTime, "z": pbfHLocation, "color": "#fd7e14" }]
        this.pbfHistory.push(model)
      }
      if (pbfHValue > highPbfReference) {
        let model = [{ "w": pbfHValue, "x":"High" , "y":pbfHDateTime , "z": pbfHLocation, "color": "#e53935" }]
        this.pbfHistory.push(model)
      }
    }

    for (let index = 0; index < this.authService.bodyCellMass.length; index++) {

      if(this.authService.bodyCellMass[index].body_cell_mass !== "-" && !isNaN(this.authService.bodyCellMass[index].body_cell_mass)){
        bcmHValue = this.authService.bodyCellMass[index].body_cell_mass.toFixed(2)
      }
      bcmHLocation = this.authService.bodyCellMass[index].IHLMachineLocation
      bcmDateTime = this.authService.bodyCellMass[index].dateTimeFormatted
      if (parseInt(bcmHValue) < bcmlow) {
        let model = [{ "w": bcmHValue, "x": "Low", "y": bcmDateTime, "z": bcmHLocation, "color": "#ff9800" }]
        this.bcmHistory.push(model)
      }
      if (parseInt(bcmHValue) >= bcmlow) {
        let model = [{ "w": bcmHValue, "x":"Normal" , "y":bcmDateTime , "z": bcmHLocation, "color": "#43A047" }]
        this.bcmHistory.push(model)
      }
    }

    for (let index = 0; index < this.authService.boneMineralContent.length; index++) {

      if(this.authService.boneMineralContent[index].bone_mineral_content !== "-" && !isNaN(this.authService.boneMineralContent[index].bone_mineral_content)){
        bmctHValue = this.authService.boneMineralContent[index].bone_mineral_content.toFixed(2)
      }
      bmctHLocation = this.authService.boneMineralContent[index].IHLMachineLocation
      bmctDateTime = this.authService.boneMineralContent[index].dateTimeFormatted

      if (bmctHValue < lowBmcReference) {
        let model = [{ "w": bmctHValue, "x": "Low", "y": bmctDateTime, "z": bmctHLocation, "color": "#ff9800" }]
        this.bmctHistory.push(model)
      }
      if (bmctHValue >= lowBmcReference) {
        let model = [{ "w": bmctHValue, "x": "Normal", "y": bmctDateTime, "z": bmctHLocation, "color": "#43A047" }]
        this.bmctHistory.push(model)
      }
      // if (bmctHValue >= highBmcReference) {
      //   let model = [{ "w": bmctHValue, "x":"High" , "y":bmctDateTime , "z": bmctHLocation, "color": "#d32f2f" }]
      //   this.bmctHistory.push(model)
      // }
    }

    for (let index = 0; index < this.authService.extraCellularWater.length; index++) {

      if(this.authService.extraCellularWater[index].extra_cellular_water !== "-" && !isNaN(this.authService.extraCellularWater[index].extra_cellular_water)){
        ecwHValue = parseFloat(this.authService.extraCellularWater[index].extra_cellular_water.toFixed(2))
      }
      ecwHLocation = this.authService.extraCellularWater[index].IHLMachineLocation
      ecwDateTime = this.authService.extraCellularWater[index].dateTimeFormatted

      if (ecwHValue < parseInt(ecll)) {
        let model = [{ "w": ecwHValue, "x": "Low", "y": ecwDateTime, "z": ecwHLocation, "color": "#ff9800" }]
        this.ecwHistory.push(model)
      }
      if (ecwHValue >= parseInt(ecll) && ecwHValue <= parseInt(eclh)) {
        let model = [{ "w": ecwHValue, "x": "Normal", "y": ecwDateTime, "z": ecwHLocation, "color": "#43A047" }]
        this.ecwHistory.push(model)
      }
      if (ecwHValue > parseInt(eclh)) {
        let model = [{ "w": ecwHValue, "x":"High" , "y":ecwDateTime , "z": ecwHLocation, "color": "#f44336" }]
        this.ecwHistory.push(model)
      }
    }
    for (let index = 0; index < this.authService.intraCellularWater.length; index++) {

      if(this.authService.intraCellularWater[index].intra_cellular_water !== "-" && !isNaN(this.authService.intraCellularWater[index].intra_cellular_water)){
        icwHValue = this.authService.intraCellularWater[index].intra_cellular_water.toFixed(2)
      }
      icwHLocation = this.authService.intraCellularWater[index].IHLMachineLocation
      icwDateTime = this.authService.intraCellularWater[index].dateTimeFormatted

      if (icwHValue < icll) {
        let model = [{ "w": icwHValue, "x": "Low", "y": icwDateTime, "z": icwHLocation, "color": "#ff9800" }]
        this.icwHistory.push(model)
      }
      if (icwHValue >= icll && icwHValue <= iclh) {
        let model = [{ "w": icwHValue, "x": "Normal", "y": icwDateTime, "z": icwHLocation, "color": "#43A047" }]
        this.icwHistory.push(model)
      }
      if (icwHValue > iclh) {
        let model = [{ "w": icwHValue, "x":"High" , "y":icwDateTime , "z": icwHLocation, "color": "#f44336" }]
        this.icwHistory.push(model)
      }
    }

    for (let index = 0; index < this.authService.minerals.length; index++) {

      if(this.authService.minerals[index].mineral !== "-" && !isNaN(this.authService.minerals[index].mineral)){
        mineralHValue = this.authService.minerals[index].mineral.toFixed(2)
      }
      mineralHLocation = this.authService.minerals[index].IHLMachineLocation
      mineralDateTime = this.authService.minerals[index].dateTimeFormatted

      if (mineralHValue < lowMineral) {
        let model = [{ "w": mineralHValue, "x": "Low", "y": mineralDateTime, "z": mineralHLocation, "color": "#ff9800" }]
        this.mineralHistory.push(model)
      }
      if (mineralHValue >= lowMineral) {
        let model = [{ "w": mineralHValue, "x": "Normal", "y": mineralDateTime, "z": mineralHLocation, "color": "#43A047" }]
        this.mineralHistory.push(model)
      }
      // if (mineralHValue >= highMineral) {
      //   let model = [{ "w": mineralHValue, "x":"High" , "y":mineralDateTime , "z": mineralHLocation, "color": "#d32f2f" }]
      //   this.mineralHistory.push(model)
      // }
    }

    for (let index = 0; index < this.authService.bodyFatMass.length; index++) {

      if(this.authService.bodyFatMass[index].body_fat_mass !== "-" && !isNaN(this.authService.bodyFatMass[index].body_fat_mass)){
        bfmHValue = this.authService.bodyFatMass[index].body_fat_mass.toFixed(2)
      }
      bfmHLocation = this.authService.bodyFatMass[index].IHLMachineLocation
      bfmDateTime = this.authService.bodyFatMass[index].dateTimeFormatted

      if (bfmHValue < lowFatReference) {
        let model = [{ "w": bfmHValue, "x": "Low", "y": bfmDateTime, "z": bfmHLocation, "color": "#ff9800" }]
        this.bfmHistory.push(model)
      }
      if (bfmHValue >= lowFatReference && bfmHValue <= acceptFatReference) {
        let model = [{ "w": bfmHValue, "x": "Normal", "y": bfmDateTime, "z": bfmHLocation, "color": "#43A047" }]
        this.bfmHistory.push(model)
      }
      if (bfmHValue > acceptFatReference && bfmHValue <= highFatReference) {
        let model = [{ "w": bfmHValue, "x": "Acceptable", "y": bfmDateTime, "z": bfmHLocation, "color": "#fd7e14" }]
        this.bfmHistory.push(model)
      }
      if (bfmHValue > highFatReference) {
        let model = [{ "w": bfmHValue, "x":"High" , "y":bfmDateTime , "z": bfmHLocation, "color": "#d32f2f" }]
        this.bfmHistory.push(model)
      }
    }

    for (let index = 0; index < this.authService.protein.length; index++) {

      if(this.authService.protein[index].protien !== "-" && !isNaN(this.authService.protein[index].protien)){
        proteinHValue = parseFloat(this.authService.protein[index].protien.toFixed(2))
      }
      proteinHLocation = this.authService.protein[index].IHLMachineLocation
      proteinDateTime = this.authService.protein[index].dateTimeFormatted

      if (proteinHValue < proteinl) {
        let model = [{ "w": proteinHValue, "x": "Low", "y": proteinDateTime, "z": proteinHLocation, "color": "#ff9800" }]
        this.proteinHistory.push(model)
      }
      if (proteinHValue >= proteinl && proteinHValue <= proteinh) {
        let model = [{ "w": proteinHValue, "x": "Normal", "y": proteinDateTime, "z": proteinHLocation, "color": "#43A047" }]
        this.proteinHistory.push(model)
      }
      if (proteinHValue > proteinh) {
        let model = [{ "w": proteinHValue, "x":"High" , "y":proteinDateTime , "z": proteinHLocation, "color": "#d32f2f" }]
        this.proteinHistory.push(model)
      }
    }

    for (let index = 0; index < this.authService.skeletalMuscleMass.length; index++) {

      if(this.authService.skeletalMuscleMass[index].skeletal_muscle_mass !== "-" && !isNaN(this.authService.skeletalMuscleMass[index].skeletal_muscle_mass)){
        smmHValue = this.authService.skeletalMuscleMass[index].skeletal_muscle_mass.toFixed(2)
      }
      smmHLocation = this.authService.skeletalMuscleMass[index].IHLMachineLocation
      smmDateTime = this.authService.skeletalMuscleMass[index].dateTimeFormatted

      if (smmHValue < lowSmmReference) {
        let model = [{ "w": smmHValue, "x": "Low", "y": smmDateTime, "z": smmHLocation, "color": "#ff9800" }]
        this.smmHistory.push(model)
      }
      if (smmHValue >= lowSmmReference) {
        let model = [{ "w": smmHValue, "x":"Normal" , "y":smmDateTime , "z": smmHLocation, "color": "#43A047" }]
        this.smmHistory.push(model)
      }
    }

    for (let index = 0; index < this.authService.visceralFat.length; index++) {

      if(this.authService.visceralFat[index].visceral_fat !== "-" && !isNaN(this.authService.visceralFat[index].visceral_fat)){
        vfHValue = this.authService.visceralFat[index].visceral_fat
      }
      vfHLocation = this.authService.visceralFat[index].IHLMachineLocation
      vfDateTime = this.authService.visceralFat[index].dateTimeFormatted

      if (vfHValue <= 100 ) {
        let model = [{ "w": vfHValue, "x": "Normal", "y": vfDateTime, "z": vfHLocation, "color": "#ff9800" }]
        this.vfHistory.push(model)
      }
      if (vfHValue > 100 && vfHValue <= 120) {
        let model = [{ "w": vfHValue, "x":"Acceptable" , "y":vfDateTime , "z": vfHLocation, "color": "#43A047" }]
        this.vfHistory.push(model)
      }
      if (vfHValue > 120) {
        let model = [{ "w": vfHValue, "x":"High" , "y":vfDateTime , "z": vfHLocation, "color": "#f44336" }]
        this.vfHistory.push(model)
      }
    }
    for (let index = 0; index < this.authService.waistHipRatio.length; index++) {

      if(this.authService.waistHipRatio[index].waist_hip_ratio !== "-" && !isNaN(this.authService.waistHipRatio[index].waist_hip_ratio)){
        whprHValue = this.authService.waistHipRatio[index].waist_hip_ratio.toFixed(2)
      }
      whprHLocation = this.authService.waistHipRatio[index].IHLMachineLocation
      whprDateTime = this.authService.waistHipRatio[index].dateTimeFormatted

      if (whprHValue < 0.80) {
        let model = [{ "w": whprHValue, "x": "Low", "y": whprDateTime, "z": whprHLocation, "color": "#ff9800" }]
        this.whprHistory.push(model)
      }
      else if (whprHValue >= 0.80 && whprHValue <= 0.90) {
        let model = [{ "w": whprHValue, "x": "Normal", "y": whprDateTime, "z": whprHLocation, "color": "#43A047" }]
        this.whprHistory.push(model)
      }
      else if (whprHValue > 0.90) {
        let model = [{ "w": whprHValue, "x": "High", "y": whprDateTime, "z": whprHLocation, "color": "#d32f2f" }]
        this.whprHistory.push(model)
      }
    }

    for (let index = 0; index < this.authService.basalMetabolicRate.length; index++) {

      if(this.authService.basalMetabolicRate[index].basal_metabolic_rate !== "-" && !isNaN(this.authService.basalMetabolicRate[index].basal_metabolic_rate)){
        bmrHValue = this.authService.basalMetabolicRate[index].basal_metabolic_rate.toFixed(2)
      }
      bmrHLocation = this.authService.basalMetabolicRate[index].IHLMachineLocation
      bmrDateTime = this.authService.basalMetabolicRate[index].dateTimeFormatted

      // if (bmrHValue < 1200) {
        let model = [{ "w": bmrHValue, "y": bmrDateTime, "z": bmrHLocation }]
        this.bmrHistory.push(model)
      // }
      // if (bmrHValue >= 1200) {
      //   let model = [{ "w": bmrHValue, "x":"Normal" , "y":bmrDateTime , "z": bmrHLocation, "color": "#43A047" }]
      //   this.bmrHistory.push(model)
      // }
    }

    for (let index = 0; index < this.authService.waistHeightRatio.length; index++) {
      if(this.authService.waistHeightRatio[index].waist_height_ratio !== "-" && !isNaN(this.authService.waistHeightRatio[index].waist_height_ratio)){
        whtrHValue = this.authService.waistHeightRatio[index].waist_height_ratio
      }
      whtrDateTime = this.authService.waistHeightRatio[index].dateTimeFormatted
      whtrHLocation = this.authService.waistHeightRatio[index].IHLMachineLocation
      if (whtrHValue < waisttoheightratiolow) {
        let model = [{ "w": whtrHValue, "x": "Low", "y": whtrDateTime, "z": whtrHLocation, "color": "#ff9800" }]
        this.whtrHistory.push(model)
      }
      if (whtrHValue >= waisttoheightratiolow && whtrHValue <= waisttoheightratiohigh) {
        let model = [{ "w": whtrHValue, "x": "Normal", "y": whtrDateTime, "z": whtrHLocation, "color": "#43A047" }]
        this.whtrHistory.push(model)
      }
      if (whtrHValue > waisttoheightratiohigh) {
        let model = [{ "w": whtrHValue, "x":"High" , "y":whtrDateTime , "z": whtrHLocation, "color": "#d32f2f" }]
        this.whtrHistory.push(model)
      }
    }
    //sandip end full body bmc

        for (let index = 0; index < this.authService.BP.length; index++) {
          if(this.authService.BP[index].systolic !== "-"){
          bpHSystolicValue = this.authService.BP[index].systolic
          }
          if(this.authService.BP[index].diastolic !== "-"){
          bpHDiastolicValue = this.authService.BP[index].diastolic
          }
          bpHDateTime = this.authService.BP[index].dateTimeFormatted
          bpHLocation = this.authService.BP[index].IHLMachineLocation
          bpHLocation = bpHLocation.toLowerCase() == 'na' ? '' : bpHLocation;
          bpHStatus = this.authService.BP[index].bpClass;
          if (bpHStatus.toLowerCase() === "normal") {
            let model = [{"v": bpHSystolicValue, "w": bpHDiastolicValue , "x": "Normal", "y": bpHDateTime, "z": bpHLocation, "color": "#43A047" }]
            this.BPHistory.push(model)
          }
          else if (bpHStatus.toLowerCase() === "acceptable") {
            let model = [{"v": bpHSystolicValue, "w": bpHDiastolicValue , "x": "Acceptable", "y": bpHDateTime, "z": bpHLocation, "color": "#ff9800" }]
           this.BPHistory.push(model)
          }
          else if (bpHStatus.toLowerCase() === "high") {
            let model = [{"v": bpHSystolicValue, "w": bpHDiastolicValue , "x": "High", "y": bpHDateTime, "z": bpHLocation, "color": "#e53935" }]
            this.BPHistory.push(model)
          }
        }
        console.log(this.authService.ECG);
        for (let index = 0; index < this.authService.ECG.length; index++) {
          if(this.authService.ECG[index].ECGBpm !== "-"){
            ecgHValue = this.authService.ECG[index].ECGBpm
          }
          ecgHDateTime = this.authService.ECG[index].dateTimeFormatted
          ecgHLocation = this.authService.ECG[index].IHLMachineLocation
          ecgHStatus = this.authService.ECG[index].leadTwoStatus
          if (ecgHStatus === "Normal" || ecgHStatus === "Normal Sinus Rhythm" ) {
            let model = [{ "w": ecgHValue, "x": ecgHStatus, "y": ecgHDateTime , "z": ecgHLocation , "color": "#43A047" }]
            this.ECGHistory.push(model)
          }
          else if(ecgHStatus === "Require Doctor Attention" || ecgHStatus === "Doctor Attention Needed"){
            let model = [{ "w": ecgHValue, "x": ecgHStatus, "y": ecgHDateTime , "z": ecgHLocation, "color": "#e53935" }]
            this.ECGHistory.push(model)
          }
          else if(ecgHStatus === "High Pulse"){
            let model = [{ "w": ecgHValue, "x": ecgHStatus, "y": ecgHDateTime , "z": ecgHLocation, "color": "#e53935" }]
            this.ECGHistory.push(model)
          }
        }


        for (let index = 0; index < this.authService.TEMPERATURE.length; index++) {
          if(this.authService.TEMPERATURE[index].temperature !== "-"){
             var temp = this.authService.TEMPERATURE[index].temperature
             var temp1 = (temp*1.8)+32;
             temperatureHValue = temp1.toFixed(1)
          }
          temperatureHLocation = this.authService.TEMPERATURE[index].IHLMachineLocation
          temperatureHDateTime = this.authService.TEMPERATURE[index].dateTimeFormatted
          temperatureHStatus = this.authService.TEMPERATURE[index].temperatureClass
          if (temperatureHStatus.toLowerCase() === "normal") {
            let model = [{ "w":temperatureHValue, "x": temperatureHStatus, "y": temperatureHDateTime, "z": temperatureHLocation, "color": "#43A047" }]
            this.TempHistory.push(model)
          }
          else if (temperatureHStatus.toLowerCase() === "low") {
            let model = [{ "w":temperatureHValue, "x": temperatureHStatus, "y": temperatureHDateTime, "z": temperatureHLocation, "color": "#ff9800" }]
            this.TempHistory.push(model)
          }
          else if (temperatureHStatus.toLowerCase() === "high") {
            let model = [{ "w":temperatureHValue,  "x": temperatureHStatus, "y":temperatureHDateTime, "z": temperatureHLocation, "color": "#e53935" }]
            this.TempHistory.push(model)
          }
        }

        for (let index = 0; index < this.authService.PULSE.length; index++) {
          if(this.authService.PULSE[index].pulseBpm !== "-"){
             pulseHValue = this.authService.PULSE[index].pulseBpm
          }
          pulseHLocation = this.authService.PULSE[index].IHLMachineLocation
          pulseHDateTime = this.authService.PULSE[index].dateTimeFormatted
          pulseHStatus = this.authService.PULSE[index].pulseClass
          if (pulseHStatus.toLowerCase() === "normal") {
            let model = [{ "w": pulseHValue, "x": pulseHStatus , "y": pulseHDateTime , "z": pulseHLocation , "color": "#43A047" }]
            this.PulseHistory.push(model)
          }
          else if (pulseHStatus.toLowerCase() === "high") {
            let model = [{ "w": pulseHValue, "x": pulseHStatus , "y": pulseHDateTime , "z": pulseHLocation, "color": "#e53935" }]
            this.PulseHistory.push(model)
          }
          else if (pulseHStatus.toLowerCase() === "low") {
            let model = [{ "w": pulseHValue, "x": pulseHStatus , "y": pulseHDateTime , "z": pulseHLocation, "color": "#ff9800" }]
            this.PulseHistory.push(model)
          }
        }

        for (let index = 0; index < this.authService.BMC.length; index++) {
          if(this.authService.BMC[index].fatRatio !== "-"){
            bmcHValue = this.authService.BMC[index].fatRatio.toFixed(2)
          }
          bmcHDateTime = this.authService.BMC[index].dateTimeFormatted
          bmcHLocation = this.authService.BMC[index].IHLMachineLocation
          bmcHStatus = this.authService.BMC[index].fatClass
          if (bmcHStatus === "acceptable" && bmcHStatus !== "undefined" && bmcHStatus !== "null") {
            let model = [{"w": bmcHValue, "x": bmcHStatus, "y": bmcHDateTime, "z": bmcHLocation, "color": "#FDD835" }]
            this.FatRatioHistory.push(model)
          }
          if (bmcHStatus === "healthy" && bmcHStatus !== "undefined" && bmcHStatus !== "null") {
            let model = [{"w": bmcHValue, "x": bmcHStatus, "y": bmcHDateTime, "z": bmcHLocation, "color": "#43A047" }]
            this.FatRatioHistory.push(model)
          }
          if (bmcHStatus === "atrisk" && bmcHStatus !== "undefined" && bmcHStatus !== "null") {
            let model = [{"w": bmcHValue, "x": bmcHStatus, "y": bmcHDateTime, "z": bmcHLocation, "color": "#e53935" }]
            this.FatRatioHistory.push(model)
          }
        }

        for (let index = 0; index < this.authService.BMI.length; index++) {
          if(this.authService.BMI[index].bmi !== "-"){
            bmiHValue = this.authService.BMI[index].bmi.toFixed(2)
          }
          bmiHDateTime = this.authService.BMI[index].dateTimeFormatted
          bmiHLocation = this.authService.BMI[index].IHLMachineLocation;
          bmiHLocation = bmiHLocation.toLowerCase() == 'na' ? '' : bmiHLocation;
          bmiHStatus = this.authService.BMI[index].bmiClass
          if (bmiHStatus.toLowerCase() === "low") {
            let model = [{"w": bmiHValue, "x": "Low", "y": bmiHDateTime, "z": bmiHLocation, "color": "#ff9800" }]
            this.BMIHistory.push(model)
          }
          if (bmiHStatus.toLowerCase() === "normal") {
            let model = [{"w": bmiHValue, "x": "Normal", "y": bmiHDateTime, "z": bmiHLocation, "color": "#43A047" }]
            this.BMIHistory.push(model)
          }
          if (bmiHStatus.toLowerCase() === "high") {
            let model = [{"w": bmiHValue, "x": "High", "y": bmiHDateTime, "z": bmiHLocation, "color": "#e53935" }]
            this.BMIHistory.push(model)
          }
        }

        for (let index = 0; index < this.authService.WEIGHT.length; index++) {
          if(this.authService.WEIGHT[index].weightKG !== "-"){
            weightHValue = this.authService.WEIGHT[index].weightKG.toFixed(2)
          }
          weightHDateTime = this.authService.WEIGHT[index].dateTimeFormatted
          weightHLocation = this.authService.WEIGHT[index].IHLMachineLocation
          weightHLocation = weightHLocation.toLowerCase() == 'na' ? '' : weightHLocation;
          bmiHStatus = this.authService.BMI[index].bmiClass
          if (bmiHStatus.toLowerCase() === "low") {
            let model = [{"w": weightHValue, "x": "Low", "y": weightHDateTime, "z": weightHLocation, "color": "#ff9800" }]
            this.WeightHistory.push(model)
          }
          if (bmiHStatus.toLowerCase() === "normal") {
            let model = [{"w": weightHValue, "x": "Normal", "y": weightHDateTime, "z": weightHLocation, "color": "#43A047" }]
            this.WeightHistory.push(model)
          }
          if (bmiHStatus.toLowerCase() === "High") {
            let model = [{"w": weightHValue, "x": bmiHStatus, "y": weightHDateTime, "z": weightHLocation, "color": "#e53935" }]
            this.WeightHistory.push(model)
          }
          //let model =[{ "x": weightHValue, "y": weightHDateTime  , "z": weightHLocation }]
          //this.WeightHistory.push(model)
        }

        for (let index = 0; index < this.authService.SPO2.length; index++) {
          if(this.authService.SPO2[index].spo2 !== "-"){
            spo2HValue = this.authService.SPO2[index].spo2
          }
          spo2HLocation = this.authService.SPO2[index].IHLMachineLocation
          spo2HDateTime = this.authService.SPO2[index].dateTimeFormatted
          spo2HStatus = this.authService.SPO2[index].spo2Class
          if (spo2HStatus.toLowerCase() === "low") {
            let model = [{ "w": spo2HValue, "x": spo2HStatus, "y": spo2HDateTime, "z": spo2HLocation, "color": "#ff9800" }]
            this.Spo2History.push(model)
          }
          if (spo2HStatus.toLowerCase() === "normal") {
            let model = [{ "w": spo2HValue, "x": spo2HStatus, "y": spo2HDateTime, "z": spo2HLocation, "color": "#43A047" }]
            this.Spo2History.push(model)
          }
          //let model =[{ "w": spo2HValue, "x": spo2HStatus, "y": spo2HDateTime, "z": spo2HLocation }]
          //this.Spo2History.push(model)
        }
        console.log("ecwHistory");
        console.log(this.ecwHistory);
        console.log(this.ecwHistory[0]);
        console.log(this.ecwHistory.length);

      console.log(this.WeightHistory)
      console.log(this.TempHistory)
      console.log(this.Spo2History)
      console.log(this.PulseHistory)
      console.log(this.BMIHistory)
      console.log(this.BPHistory)
      console.log(this.FatRatioHistory)
      console.log(this.ECGHistory)


  }
  ngDoCheck() {
    // console.log(this.testType)

    if (this.testType === "Protein" && this.proteinbool === false) {

        this.weightbool = false
        this.spo2bool = false
        this.bmibool = false
        this.fatratiobool = false
        this.pulsebool  = false
        this.tempbool = false
        this.ecgbool = false
        this.bpbool = false
        this.pbfbool = false
        this.bcmbool = false
        this.bmctbool = false
        this.ecwbool = false
        this.icwbool = false
        this.bfmbool = false
        this.smmbool = false
        this.mineralbool = false
        this.proteinbool = true
        this.whtrbool = false
        this.whprbool = false
        this.vfbool = false
        this.bmrbool = false

        if (this.authService.protein.length < 1) {
          this.min_history = true
          this.proteinbool = false
         }
         else{
          this.min_history = false
          this.proteinbool = true
         }

      }
      else if (this.testType === "Extra Cellular Water" && this.ecwbool === false) {

        this.weightbool = false
        this.spo2bool = false
        this.bmibool = false
        this.fatratiobool = false
        this.pulsebool  = false
        this.tempbool = false
        this.ecgbool = false
        this.bpbool = false
        this.pbfbool = false
        this.bcmbool = false
        this.bmctbool = false
        this.ecwbool = true
        this.icwbool = false
        this.bfmbool = false
        this.smmbool = false
        this.mineralbool = false
        this.proteinbool = false
        this.whtrbool = false
        this.whprbool = false
        this.vfbool = false
        this.bmrbool = false

        if (this.authService.extraCellularWater.length < 1) {
          this.min_history = true
          this.ecwbool = false
         }
         else{
          this.min_history = false
          this.ecwbool = true
         }

      }
      else if (this.testType === "Intra Cellular Water" && this.icwbool === false) {

        this.weightbool = false
        this.spo2bool = false
        this.bmibool = false
        this.fatratiobool = false
        this.pulsebool  = false
        this.tempbool = false
        this.ecgbool = false
        this.bpbool = false
        this.pbfbool = false
        this.bcmbool = false
        this.bmctbool = false
        this.ecwbool = false
        this.icwbool = true
        this.bfmbool = false
        this.smmbool = false
        this.mineralbool = false
        this.proteinbool = false
        this.whtrbool = false
        this.whprbool = false
        this.vfbool = false
        this.bmrbool = false

        if (this.authService.intraCellularWater.length < 1) {
          this.min_history = true
          this.icwbool = false
         }
         else{
          this.min_history = false
          this.icwbool = true
         }

      }
      else if (this.testType === "Mineral" && this.mineralbool === false) {

        this.weightbool = false
        this.spo2bool = false
        this.bmibool = false
        this.fatratiobool = false
        this.pulsebool  = false
        this.tempbool = false
        this.ecgbool = false
        this.bpbool = false
        this.pbfbool = false
        this.bcmbool = false
        this.bmctbool = false
        this.ecwbool = false
        this.icwbool = false
        this.bfmbool = false
        this.smmbool = false
        this.mineralbool = true
        this.proteinbool = false
        this.whtrbool = false
        this.whprbool = false
        this.vfbool = false
        this.bmrbool = false

        if (this.authService.minerals.length < 1) {
          this.min_history = true
          this.mineralbool = false
         }
         else{
          this.min_history = false
          this.mineralbool = true
         }

      }
      else if (this.testType === "Skeletal Muscle Mass" && this.smmbool === false) {

        this.weightbool = false
        this.spo2bool = false
        this.bmibool = false
        this.fatratiobool = false
        this.pulsebool  = false
        this.tempbool = false
        this.ecgbool = false
        this.bpbool = false
        this.pbfbool = false
        this.bcmbool = false
        this.bmctbool = false
        this.ecwbool = false
        this.icwbool = false
        this.bfmbool = false
        this.smmbool = true
        this.mineralbool = false
        this.proteinbool = false
        this.whtrbool = false
        this.whprbool = false
        this.vfbool = false
        this.bmrbool = false

        if (this.authService.skeletalMuscleMass.length < 1) {
          this.min_history = true
          this.smmbool = false
         }
         else{
          this.min_history = false
          this.smmbool = true
         }

      }
      else if (this.testType === "Body Fat Mass" && this.bfmbool === false) {

        this.weightbool = false
        this.spo2bool = false
        this.bmibool = false
        this.fatratiobool = false
        this.pulsebool  = false
        this.tempbool = false
        this.ecgbool = false
        this.bpbool = false
        this.pbfbool = false
        this.bcmbool = false
        this.bmctbool = false
        this.ecwbool = false
        this.icwbool = false
        this.bfmbool = true
        this.smmbool = false
        this.mineralbool = false
        this.proteinbool = false
        this.whtrbool = false
        this.whprbool = false
        this.vfbool = false
        this.bmrbool = false

        if (this.authService.bodyFatMass.length < 1) {
          this.min_history = true
          this.bfmbool = false
         }
         else{
          this.min_history = false
          this.bfmbool = true
         }

      }
      else if (this.testType === "Waist/Hip Ratio" && this.whprbool === false) {

        this.weightbool = false
        this.spo2bool = false
        this.bmibool = false
        this.fatratiobool = false
        this.pulsebool  = false
        this.tempbool = false
        this.ecgbool = false
        this.bpbool = false
        this.pbfbool = false
        this.bcmbool = false
        this.bmctbool = false
        this.ecwbool = false
        this.icwbool = false
        this.bfmbool = false
        this.smmbool = false
        this.mineralbool = false
        this.proteinbool = false
        this.whtrbool = false
        this.whprbool = true
        this.vfbool = false
        this.bmrbool = false

        if (this.authService.waistHipRatio.length < 1) {
          this.min_history = true
          this.whprbool = false
         }
         else{
          this.min_history = false
          this.whprbool = true
         }

      }
      else if (this.testType === "Body Cell Mass" && this.bcmbool === false) {

        this.weightbool = false
        this.spo2bool = false
        this.bmibool = false
        this.fatratiobool = false
        this.pulsebool  = false
        this.tempbool = false
        this.ecgbool = false
        this.bpbool = false
        this.pbfbool = false
        this.bcmbool = true
        this.bmctbool = false
        this.ecwbool = false
        this.icwbool = false
        this.bfmbool = false
        this.smmbool = false
        this.mineralbool = false
        this.proteinbool = false
        this.whtrbool = false
        this.whprbool = false
        this.vfbool = false
        this.bmrbool = false

        if (this.authService.bodyCellMass.length < 1) {
          this.min_history = true
          this.bcmbool = false
         }
         else{
          this.min_history = false
          this.bcmbool = true
         }

      }
      else if (this.testType === "Waist/Height Ratio" && this.whtrbool === false) {

        this.weightbool = false
        this.spo2bool = false
        this.bmibool = false
        this.fatratiobool = false
        this.pulsebool  = false
        this.tempbool = false
        this.ecgbool = false
        this.bpbool = false
        this.pbfbool = false
        this.bcmbool = false
        this.bmctbool = false
        this.ecwbool = false
        this.icwbool = false
        this.bfmbool = false
        this.smmbool = false
        this.mineralbool = false
        this.proteinbool = false
        this.whtrbool = true
        this.whprbool = false
        this.vfbool = false
        this.bmrbool = false

        if (this.authService.waistHeightRatio.length < 1) {
          this.min_history = true
          this.whtrbool = false
         }
         else{
          this.min_history = false
          this.whtrbool = true
         }

      }
      else if (this.testType === "Visceral Fat" && this.vfbool === false) {

        this.weightbool = false
        this.spo2bool = false
        this.bmibool = false
        this.fatratiobool = false
        this.pulsebool  = false
        this.tempbool = false
        this.ecgbool = false
        this.bpbool = false
        this.pbfbool = false
        this.bcmbool = false
        this.bmctbool = false
        this.ecwbool = false
        this.icwbool = false
        this.bfmbool = false
        this.smmbool = false
        this.mineralbool = false
        this.proteinbool = false
        this.whtrbool = false
        this.whprbool = false
        this.vfbool = true
        this.bmrbool = false

        if (this.authService.visceralFat.length < 1) {
          this.min_history = true
          this.vfbool = false
         }
         else{
          this.min_history = false
          this.vfbool = true
         }

      }
      else if (this.testType === "Basal Metabolic Rate" && this.bmrbool === false) {

        this.weightbool = false
        this.spo2bool = false
        this.bmibool = false
        this.fatratiobool = false
        this.pulsebool  = false
        this.tempbool = false
        this.ecgbool = false
        this.bpbool = false
        this.pbfbool = false
        this.bcmbool = false
        this.bmctbool = false
        this.ecwbool = false
        this.icwbool = false
        this.bfmbool = false
        this.smmbool = false
        this.mineralbool = false
        this.proteinbool = false
        this.whtrbool = false
        this.whprbool = false
        this.vfbool = false
        this.bmrbool = true

        if (this.authService.basalMetabolicRate.length < 1) {
          this.min_history = true
          this.bmrbool = false
         }
         else{
          this.min_history = false
          this.bmrbool = true
         }

      }
      else if (this.testType === "Bone Mineral Content" && this.bmctbool === false) {

        this.weightbool = false
        this.spo2bool = false
        this.bmibool = false
        this.fatratiobool = false
        this.pulsebool  = false
        this.tempbool = false
        this.ecgbool = false
        this.bpbool = false
        this.pbfbool = false
        this.bcmbool = false
        this.bmctbool = true
        this.ecwbool = false
        this.icwbool = false
        this.bfmbool = false
        this.smmbool = false
        this.mineralbool = false
        this.proteinbool = false
        this.whtrbool = false
        this.whprbool = false
        this.vfbool = false
        this.bmrbool = false

        if (this.authService.boneMineralContent.length < 1) {
          this.min_history = true
          this.bmctbool = false
         }
         else{
          this.min_history = false
          this.bmctbool = true
         }

      }
      else if (this.testType === "Percent Body Fat" && this.pbfbool === false) {

        this.weightbool = false
        this.spo2bool = false
        this.bmibool = false
        this.fatratiobool = false
        this.pulsebool  = false
        this.tempbool = false
        this.ecgbool = false
        this.bpbool = false
        this.pbfbool = true
        this.bcmbool = false
        this.bmctbool = false
        this.ecwbool = false
        this.icwbool = false
        this.bfmbool = false
        this.smmbool = false
        this.mineralbool = false
        this.proteinbool = false
        this.whtrbool = false
        this.whprbool = false
        this.vfbool = false
        this.bmrbool = false

        if (this.authService.percentBodyFat.length < 1) {
          this.min_history = true
          this.pbfbool = false
         }
         else{
          this.min_history = false
          this.pbfbool = true
         }

      }

      else if (this.testType === "WEIGHT" && this.weightbool === false) {

        this.weightbool = true
        this.spo2bool = false
        this.bmibool = false
        this.fatratiobool = false
        this.pulsebool  = false
        this.tempbool = false
        this.ecgbool = false
        this.bpbool = false
        this.pbfbool = false
        this.bcmbool = false
        this.bmctbool = false
        this.ecwbool = false
        this.icwbool = false
        this.bfmbool = false
        this.smmbool = false
        this.mineralbool = false
        this.proteinbool = false
        this.whtrbool = false
        this.whprbool = false
        this.vfbool = false
        this.bmrbool = false

        if (this.authService.WEIGHT.length < 1) {
          this.min_history = true
          this.weightbool = false
         }
         else{
          this.min_history = false
          this.weightbool = true
         }

      }
      else if (this.testType === "SpO2" && this.spo2bool === false) {

        this.spo2bool = true
        this.weightbool = false
        this.bmibool =false
        this.fatratiobool = false
        this.pulsebool  = false
        this.tempbool = false
        this.ecgbool = false
        this.bpbool = false
        this.pbfbool = false
        this.bcmbool = false
        this.bmctbool = false
        this.ecwbool = false
        this.icwbool = false
        this.bfmbool = false
        this.smmbool = false
        this.mineralbool = false
        this.proteinbool = false
        this.whtrbool = false
        this.whprbool = false
        this.vfbool = false
        this.bmrbool = false

        if (this.authService.SPO2.length < 1) {
          this.min_history = true
          this.spo2bool = false
         }
         else{
          this.min_history = false
          this.spo2bool = true
         }

      }
      else if (this.testType === "BMI" && this.bmibool === false) {

        this.bmibool =true
        this.spo2bool = false
        this.weightbool = false
        this.fatratiobool = false
        this.pulsebool  = false
        this.tempbool = false
        this.ecgbool = false
        this.bpbool = false
        this.pbfbool = false
        this.bcmbool = false
        this.bmctbool = false
        this.ecwbool = false
        this.icwbool = false
        this.bfmbool = false
        this.smmbool = false
        this.mineralbool = false
        this.proteinbool = false
        this.whtrbool = false
        this.whprbool = false
        this.vfbool = false
        this.bmrbool = false

        if (this.authService.BMI.length < 1) {
          this.min_history = true
          this.bmibool = false
         }
         else{
          this.min_history = false
          this.bmibool = true
         }

      }
      else if (this.testType === "Fat Ratio" && this.fatratiobool === false) {

        this.fatratiobool = true
        this.bmibool =false
        this.spo2bool = false
        this.weightbool = false
        this.pulsebool  = false
        this.tempbool = false
        this.ecgbool = false
        this.bpbool = false
        this.pbfbool = false
        this.bcmbool = false
        this.bmctbool = false
        this.ecwbool = false
        this.icwbool = false
        this.bfmbool = false
        this.smmbool = false
        this.mineralbool = false
        this.proteinbool = false
        this.whtrbool = false
        this.whprbool = false
        this.vfbool = false
        this.bmrbool = false

        if (this.authService.BMC.length < 1) {
          this.min_history = true
          this.fatratiobool = false
         }
         else{
          this.min_history = false
          this.fatratiobool = true
         }


      }
      else if (this.testType === "PULSE" && this.pulsebool === false) {

        this.pulsebool  = true
        this.fatratiobool = false
        this.bmibool =false
        this.spo2bool = false
        this.weightbool = false
        this.tempbool = false
        this.ecgbool = false
        this.bpbool = false
        this.pbfbool = false
        this.bcmbool = false
        this.bmctbool = false
        this.ecwbool = false
        this.icwbool = false
        this.bfmbool = false
        this.smmbool = false
        this.mineralbool = false
        this.proteinbool = false
        this.whtrbool = false
        this.whprbool = false
        this.vfbool = false
        this.bmrbool = false

        if (this.authService.PULSE.length < 1) {
          this.min_history = true
          this.pulsebool = false
         }
         else{
          this.min_history = false
          this.pulsebool = true
         }

      }
      else if (this.testType === "TEMPERATURE" && this.tempbool === false) {

        this.tempbool  = true
        this.fatratiobool = false
        this.bmibool =false
        this.spo2bool = false
        this.weightbool = false
        this.pulsebool  = false
        this.ecgbool = false
        this.bpbool = false
        this.pbfbool = false
        this.bcmbool = false
        this.bmctbool = false
        this.ecwbool = false
        this.icwbool = false
        this.bfmbool = false
        this.smmbool = false
        this.mineralbool = false
        this.proteinbool = false
        this.whtrbool = false
        this.whprbool = false
        this.vfbool = false
        this.bmrbool = false

        if (this.authService.TEMPERATURE.length < 1) {
          this.min_history = true
          this.tempbool = false
         }
         else{
          this.min_history = false
          this.tempbool = true
         }

      }
      else if (this.testType === "ECG" && this.ecgbool === false) {

        this.ecgbool = true
        this.tempbool  = false
        this.fatratiobool = false
        this.bmibool =false
        this.spo2bool = false
        this.weightbool = false
        this.pulsebool  = false
        this.bpbool = false
        this.pbfbool = false
        this.bcmbool = false
        this.bmctbool = false
        this.ecwbool = false
        this.icwbool = false
        this.bfmbool = false
        this.smmbool = false
        this.mineralbool = false
        this.proteinbool = false
        this.whtrbool = false
        this.whprbool = false
        this.vfbool = false
        this.bmrbool = false

        if (this.authService.ECG.length < 1) {
          this.min_history = true
          this.ecgbool = false
         }
         else{
          this.min_history = false
          this.ecgbool = true
         }

      }
      else if (this.testType === "Blood Pressure" && this.bpbool === false) {

        this.bpbool = true
        this.tempbool  = false
        this.fatratiobool = false
        this.bmibool =false
        this.spo2bool = false
        this.weightbool = false
        this.pulsebool  = false
        this.ecgbool = false
        this.pbfbool = false
        this.bcmbool = false
        this.bmctbool = false
        this.ecwbool = false
        this.icwbool = false
        this.bfmbool = false
        this.smmbool = false
        this.mineralbool = false
        this.proteinbool = false
        this.whtrbool = false
        this.whprbool = false
        this.vfbool = false
        this.bmrbool = false

        if (this.authService.BP.length < 1) {
          this.min_history = true
          this.bpbool = false
         }
         else{
          this.min_history = false
          this.bpbool = true
         }

      }
  }
}
