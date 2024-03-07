import { Component, OnInit, HostListener, DoCheck } from '@angular/core';
import * as CanvasJS from '../../../assets/canvasjs.min';
import { AuthService } from 'src/app/services/auth.service';
import { ConstantsService } from '../../services/constants.service';
import { ShareDataService } from '../../services/customServices/share-data.service';

@Component({
  selector: 'app-vital-graphs',
  templateUrl: './vital-graphs.component.html',
  styleUrls: ['./vital-graphs.component.css']
})
export class VitalGraphsComponent implements OnInit {
  highestValueInLast30days =  "--";
  lowestValueInLast30days  =  "--";
  averageValueInLast30days =  "--";
  Height:any
  Weight:any
  Gender:any
  userHeight:any
  testType: any
  testValue: any
  testUnit: any
  testIcon: any
  testColour: any
  healthData: any
  weightGraphData: any
  bmiGraphData: any
  ecgGraphData: any
  bpSystolicGraphData: any
  bpDiastolicGraphData: any
  spo2GraphData: any
  temperatureGraphData: any
  pulseGraphData: any
  bmcGraphData: any
  pbfGraphData: any
  bcmGraphData: any
  bmctGraphData:any
  ecwGraphData:any
  icwGraphData:any
  mineralGraphData:any
  bfmGraphData:any
  proteinGraphData:any
  smmGraphData:any
  vfGraphData:any
  whprGraphData:any
  bmrGraphData:any
  whtrGraphData : any
  ecgChart: any
  data: any
  last30Days:any
  testTakenDate:any
  pbfVitalValue = [];
  bcmVitalValue = [];
  bmctVitalValue = [];
  ecwVitalValue = [];
  icwVitalValue = [];
  mineralVitalValue = [];
  proteinVitalValue = [];
  smmVitalValue = [];
  bfmVitalValue = [];
  vfVitalValue = [];
  whprVitalValue = [];
  bmrVitalValue   = [];
  whtrVitalValue = [];
  bmiVitalValue = [];
  bmcVitalValue = [];
  ecgVitalValue = [];
  pulseVitalValue = [];
  tempVitalValue = [];
  spo2VitalValue = [];
  bpSysValue = [];
  bpDiaValue = [];
  weightVitalValue = [];
  loadSpo2Graph = false
  loadBmiGraph = false
  loadBmcGraph = false
  loadTemperatureGraph = false
  loadBpGraph = false
  loadEcgGraph = false
  loadWeightGraph = false
  loadPulseGraph = false
  loadpbfGraph = false
  loadbcmGraph = false
  loadecwGraph = false
  loadicwGraph = false
  loadmineralGraph = false
  loadbfmGraph = false
  loadproteinGraph = false
  loadbmctGraph = false
  loadsmmGraph = false
  loadwhprGraph = false
  loadvfGraph = false
  loadbmrGraph = false
  loadwhtrGraph = false
  showMinimumError = false
  previousNav = false
  nextNav = false
  loadingMessage = true;
  centered = false;
  disabled = false;
  unbounded = false;
  sanitized = "";

  constructor(private authService: AuthService, private _constant: ConstantsService, private _currentValue: ShareDataService, private _currentUnit: ShareDataService, private _currentTitle: ShareDataService, private _currentIcon: ShareDataService, private _currentColour: ShareDataService) { }

  ngOnInit() {
    this.showMinimumError = false
    $("#ecgGraphChartContainerLead1").hide()
    $("#ecgGraphChartContainerLead2").hide()
    $("#ecgGraphChartContainerLead3").hide()
    $("#ecgGraphChartContainerLead4").hide()
    $("#ecgGraphChartContainerLead5").hide()
    $("#ecgGraphChartContainerLead6").hide()

    this._currentValue.currentValue.subscribe(currentValue => this.testValue = currentValue)
    this._currentUnit.currentUnit.subscribe(currentUnit => this.testUnit = currentUnit)
    this._currentTitle.currentTitle.subscribe(currentTitle => this.testType = currentTitle)
    this._currentIcon.currentIcon.subscribe(currentIcon => this.testIcon = currentIcon)
    this._currentColour.currentColour.subscribe(currentColour => this.testColour = currentColour)
    this.weightGraphData = []
    this.bmiGraphData = []
    this.ecgGraphData = []
    this.spo2GraphData = []
    this.temperatureGraphData = []
    this.pulseGraphData = []
    this.bmcGraphData = []
    this.bpSystolicGraphData = []
    this.bpDiastolicGraphData = []
    this.pbfGraphData = []
    this.bcmGraphData = []
    this.bmctGraphData = []
    this.ecwGraphData = []
    this.icwGraphData = []
    this.mineralGraphData = []
    this.bfmGraphData = []
    this.proteinGraphData = []
    this.smmGraphData = []
    this.vfGraphData = []
    this.whprGraphData = []
    this.bmrGraphData = []
    this.whtrGraphData = []

    var before30Days = new Date(Date.now() - (90 * 24 * 60 * 60 * 1000))
    this.last30Days = new Date(before30Days)

    let weightStatus, ecgDataLeadOne, ecgDataLeadTwo, ecgDataLeadThree, ecgDataLeadFour, ecgDataLeadFive, ecgDataLeadSix, bmiStatus, bmcStatus, spo2Status, temperatureStatus, pulseStatus, ecgStatus, bpStatus, temperatureValue, temperatureDateTime, temperatureDateTimeOriginal, pulseValue, pulseDateTime, pulseDateTimeOriginal, bmcValue, bmcDateTime, bmcDateTimeOriginal, spo2Value, spo2DateTime, spo2DateTimeOriginal, bmiValue, bmiDateTime, bmiDateTimeOriginal, bpSystolicValue, bpDiastolicValue, bpDateTime, bpOriginalDateTime, weightValue, weightDateTime, weightDateTimeOriginal, ecgValue, ecgDateTime, ecgDateTimeOriginal,
    pbfValue, pbfDateTime , pbfDateTimeOriginal, bcmValue,bcmDateTime,bcmDateTimeOriginal,bmctValue,bmctDateTime,bmctDateTimeOriginal,ecwValue,ecwDateTime,ecwDateTimeOriginal,icwValue,icwDateTime,icwDateTimeOriginal,mineralValue,mineralDateTime,mineralDateTimeOriginal,bfmValue,bfmDateTime,bfmDateTimeOriginal,proteinValue,proteinDateTime,proteinDateTimeOriginal,smmValue,smmDateTime,smmDateTimeOriginal,vfValue,vfDateTime,vfDateTimeOriginal,whprValue,whprDateTime,whprDateTimeOriginal,bmrValue,bmrDateTime,bmrDateTimeOriginal,whtrValue,whtrDateTime,whtrDateTimeOriginal;

    //sandip start full body bmc

    let lowPbfReference ;
    let acceptPbfReference;
    let highPbfReference ;
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
     this.Gender = this._constant.aesDecryption('usergender');

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
      acceptPbfReference = "20.00";
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
      acceptFatReference = (0.20*this.Weight).toFixed(2);
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
      if(!isNaN(this.authService.percentBodyFat[index].percent_body_fat)){
        var pbf = this.authService.percentBodyFat[index].percent_body_fat.toFixed(2)
        pbfValue = parseFloat(pbf)

        this.testTakenDate = new Date(this.authService.percentBodyFat[index].dateTimeFormatted);

        if(this.last30Days <= this.testTakenDate){
          this.pbfVitalValue[index]= pbfValue;
        }

        pbfDateTime = new Date(this.authService.percentBodyFat[index].dateTimeFormatted)
        pbfDateTimeOriginal = this.authService.percentBodyFat[index].dateTimeFormatted

        if (pbfValue < lowPbfReference) {
          let model = { "x": pbfDateTime, "y": pbfValue, "z": pbfDateTimeOriginal, "color": "#ff9800" }
          this.pbfGraphData.push(model)
        }
        if (pbfValue >= lowPbfReference && pbfValue <= acceptPbfReference) {
          let model = { "x": pbfDateTime, "y": pbfValue, "z": pbfDateTimeOriginal, "color": "#43A047" }
          this.pbfGraphData.push(model)
        }
        if (pbfValue > acceptPbfReference && pbfValue <= highPbfReference) {
          let model = { "x": pbfDateTime, "y": pbfValue, "z": pbfDateTimeOriginal, "color": "#fd7e14" }
          this.pbfGraphData.push(model)
        }
        if (pbfValue > highPbfReference) {
          let model = { "x": pbfDateTime, "y": pbfValue, "z": pbfDateTimeOriginal, "color": "#d32f2f" }
          this.pbfGraphData.push(model)
        }
      }
    }

    for (let index = 0; index < this.authService.bodyCellMass.length; index++) {
      if(!isNaN(this.authService.bodyCellMass[index].body_cell_mass)){
        var bcm = this.authService.bodyCellMass[index].body_cell_mass.toFixed(2)
        bcmValue = parseFloat(bcm)

        this.testTakenDate = new Date(this.authService.bodyCellMass[index].dateTimeFormatted);

        if(this.last30Days <= this.testTakenDate){
          this.bcmVitalValue[index]= bcmValue;
        }

        bcmDateTime = new Date(this.authService.bodyCellMass[index].dateTimeFormatted)
        bcmDateTimeOriginal = this.authService.bodyCellMass[index].dateTimeFormatted

        if (bcmValue < bcmlow) {
          let model = { "x": bcmDateTime, "y": bcmValue, "z": bcmDateTimeOriginal, "color": "#ff9800" }
          this.bcmGraphData.push(model)
        }
        if (bcmValue >= bcmlow) {
          let model = { "x": bcmDateTime, "y": bcmValue, "z": bcmDateTimeOriginal, "color": "#43A047" }
          this.bcmGraphData.push(model)
        }
      }
    }
    for (let index = 0; index < this.authService.boneMineralContent.length; index++) {
      if(!isNaN(this.authService.boneMineralContent[index].bone_mineral_content)){
        var bmct = this.authService.boneMineralContent[index].bone_mineral_content.toFixed(2)
        bmctValue = parseFloat(bmct)

        this.testTakenDate = new Date(this.authService.boneMineralContent[index].dateTimeFormatted);

        if(this.last30Days <= this.testTakenDate){
          this.bmctVitalValue[index]= bmctValue;
        }

        bmctDateTime = new Date(this.authService.boneMineralContent[index].dateTimeFormatted)
        bmctDateTimeOriginal = this.authService.boneMineralContent[index].dateTimeFormatted

        if (bmctValue < lowBmcReference) {
          let model = { "x": bmctDateTime, "y": bmctValue, "z": bmctDateTimeOriginal, "color": "#ff9800" }
          this.bmctGraphData.push(model)
        }
        if (bmctValue >= lowBmcReference && bmctValue <= highBmcReference) {
          let model = { "x": bmctDateTime, "y": bmctValue, "z": bmctDateTimeOriginal, "color": "#43A047" }
          this.bmctGraphData.push(model)
        }
        // if (bmctValue >= highBmcReference) {
        //   let model = { "x": bmctDateTime, "y": bmctValue, "z": bmctDateTimeOriginal, "color": "#d32f2f" }
        //   this.bmctGraphData.push(model)
        // }
      }
    }
    for (let index = 0; index < this.authService.extraCellularWater.length; index++) {
      if(!isNaN(this.authService.extraCellularWater[index].extra_cellular_water)){
        var ecw = this.authService.extraCellularWater[index].extra_cellular_water.toFixed(2)
        ecwValue = parseFloat(ecw)

        this.testTakenDate = new Date(this.authService.extraCellularWater[index].dateTimeFormatted);

        if(this.last30Days <= this.testTakenDate){
          this.ecwVitalValue[index]= ecwValue;
        }

        ecwDateTime = new Date(this.authService.extraCellularWater[index].dateTimeFormatted)
        ecwDateTimeOriginal = this.authService.extraCellularWater[index].dateTimeFormatted

        if (ecwValue < ecll) {
          let model = { "x":ecwDateTime, "y": ecwValue, "z": ecwDateTimeOriginal, "color": "#ff9800" }
          this.ecwGraphData.push(model)
        }
        if (ecwValue >= ecll && ecwValue <= eclh) {
          let model = { "x":ecwDateTime, "y": ecwValue, "z": ecwDateTimeOriginal, "color": "#43A047" }
          this.ecwGraphData.push(model)
        }
        if (ecwValue > eclh) {
          let model = { "x": ecwDateTime, "y": ecwValue, "z": ecwDateTimeOriginal, "color": "#d32f2f" }
          this.ecwGraphData.push(model)
        }
      }
    }
    for (let index = 0; index < this.authService.intraCellularWater.length; index++) {
      if(!isNaN(this.authService.intraCellularWater[index].intra_cellular_water)){
        var icw = this.authService.intraCellularWater[index].intra_cellular_water.toFixed(2)
        icwValue = parseFloat(icw)

        this.testTakenDate = new Date(this.authService.intraCellularWater[index].dateTimeFormatted);

        if(this.last30Days <= this.testTakenDate){
          this.icwVitalValue[index]= icwValue;
        }

        icwDateTime = new Date(this.authService.intraCellularWater[index].dateTimeFormatted)
        icwDateTimeOriginal = this.authService.intraCellularWater[index].dateTimeFormatted

        if (icwValue < icll) {
          let model = { "x": icwDateTime, "y": icwValue, "z": icwDateTimeOriginal, "color": "#ff9800" }
          this.icwGraphData.push(model)
        }
        if (icwValue >= icll && icwValue <= iclh) {
          let model = { "x": icwDateTime, "y": icwValue, "z": icwDateTimeOriginal, "color": "#43A047" }
          this.icwGraphData.push(model)
        }
        if (icwValue > iclh) {
          let model = { "x": icwDateTime, "y": icwValue, "z": icwDateTimeOriginal, "color": "#d32f2f" }
          this.icwGraphData.push(model)
        }
      }

    }
    for (let index = 0; index < this.authService.minerals.length; index++) {
      if(!isNaN(this.authService.minerals[index].mineral)){
        var mineral = this.authService.minerals[index].mineral.toFixed(2)
        mineralValue = parseFloat(mineral)

        this.testTakenDate = new Date(this.authService.minerals[index].dateTimeFormatted);

        if(this.last30Days <= this.testTakenDate){
          this.mineralVitalValue[index]= mineralValue;
        }

        mineralDateTime = new Date(this.authService.minerals[index].dateTimeFormatted)
        mineralDateTimeOriginal = this.authService.minerals[index].dateTimeFormatted

        if (mineralValue < lowMineral) {
          let model = { "x": mineralDateTime, "y": mineralValue, "z": mineralDateTimeOriginal, "color": "#ff9800" }
          this.mineralGraphData.push(model)
        }
        if (mineralValue >= lowMineral) {
          let model = { "x": mineralDateTime, "y": mineralValue, "z": mineralDateTimeOriginal, "color": "#43A047" }
          this.mineralGraphData.push(model)
        }
        // if (mineralValue >= highMineral) {
        //   let model = { "x": mineralDateTime, "y": mineralValue, "z": mineralDateTimeOriginal, "color": "#d32f2f" }
        //   this.mineralGraphData.push(model)
        // }
      }
    }
    for (let index = 0; index < this.authService.bodyFatMass.length; index++) {
      if(!isNaN(this.authService.bodyFatMass[index].body_fat_mass)){
        var bfm = this.authService.bodyFatMass[index].body_fat_mass.toFixed(2)
        bfmValue = parseFloat(bfm)

        this.testTakenDate = new Date(this.authService.bodyFatMass[index].dateTimeFormatted);

        if(this.last30Days <= this.testTakenDate){
          this.bfmVitalValue[index]= bfmValue;
        }

        bfmDateTime = new Date(this.authService.bodyFatMass[index].dateTimeFormatted)
        bfmDateTimeOriginal = this.authService.bodyFatMass[index].dateTimeFormatted

        if (bfmValue < lowFatReference) {
          let model = { "x": bfmDateTime, "y": bfmValue, "z": bfmDateTimeOriginal, "color": "#ff9800" }
          this.bfmGraphData.push(model)
        }
        if (bfmValue >= lowFatReference && bfmValue <= acceptFatReference) {
          let model = { "x": bfmDateTime, "y": bfmValue, "z": bfmDateTimeOriginal, "color": "#43A047" }
          this.bfmGraphData.push(model)
        }
        if (bfmValue > acceptFatReference && bfmValue <= highFatReference) {
          let model = { "x": bfmDateTime, "y": bfmValue, "z": bfmDateTimeOriginal, "color": "#fd7e14" }
          this.bfmGraphData.push(model)
        }
        if (bfmValue > highFatReference) {
          let model = { "x": bfmDateTime, "y": bfmValue, "z": bfmDateTimeOriginal, "color": "#d32f2f" }
          this.bfmGraphData.push(model)
        }
      }
    }
    for (let index = 0; index < this.authService.protein.length; index++) {
      if(!isNaN(this.authService.protein[index].protien)){
        var protein = this.authService.protein[index].protien.toFixed(2)
        proteinValue = parseFloat(protein)

        this.testTakenDate = new Date(this.authService.protein[index].dateTimeFormatted);

        if(this.last30Days <= this.testTakenDate){
          this.proteinVitalValue[index]= proteinValue;
        }

        proteinDateTime = new Date(this.authService.protein[index].dateTimeFormatted)
        proteinDateTimeOriginal = this.authService.protein[index].dateTimeFormatted

        if (proteinValue < proteinl) {
          let model = { "x": proteinDateTime, "y": proteinValue, "z": proteinDateTimeOriginal, "color": "#ff9800" }
          this.proteinGraphData.push(model)
        }
        if (proteinValue >= proteinl && proteinValue <= proteinh) {
          let model = { "x": proteinDateTime, "y": proteinValue, "z": proteinDateTimeOriginal, "color": "#43A047" }
          this.proteinGraphData.push(model)
        }
        if (proteinValue > proteinh) {
          let model = { "x": proteinDateTime, "y": proteinValue, "z": proteinDateTimeOriginal, "color": "#43A047" }
          this.proteinGraphData.push(model)
        }
      }
    }
    for (let index = 0; index < this.authService.skeletalMuscleMass.length; index++) {
      if(!isNaN(this.authService.skeletalMuscleMass[index].skeletal_muscle_mass)){
        var smm = this.authService.skeletalMuscleMass[index].skeletal_muscle_mass.toFixed(2)
        smmValue = parseFloat(smm)

        this.testTakenDate = new Date(this.authService.skeletalMuscleMass[index].dateTimeFormatted);

        if(this.last30Days <= this.testTakenDate){
          this.smmVitalValue[index]= smmValue;
        }

        smmDateTime = new Date(this.authService.skeletalMuscleMass[index].dateTimeFormatted)
        smmDateTimeOriginal = this.authService.skeletalMuscleMass[index].dateTimeFormatted

        if (smmValue < lowSmmReference) {
          let model = { "x": smmDateTime, "y": smmValue, "z": smmDateTimeOriginal, "color": "#ff9800" }
          this.smmGraphData.push(model)
        }
        if (smmValue >= lowSmmReference) {
          let model = { "x": smmDateTime, "y": smmValue, "z": smmDateTimeOriginal, "color": "#43A047" }
          this.smmGraphData.push(model)
        }
      }
    }
    for (let index = 0; index < this.authService.visceralFat.length; index++) {
      if(!isNaN(this.authService.visceralFat[index].visceral_fat)){
        var vf = this.authService.visceralFat[index].visceral_fat
        vfValue = parseFloat(vf)

        this.testTakenDate = new Date(this.authService.visceralFat[index].dateTimeFormatted);

        if(this.last30Days <= this.testTakenDate){
          this.vfVitalValue[index]= vfValue;
        }

        vfDateTime = new Date(this.authService.visceralFat[index].dateTimeFormatted)
        vfDateTimeOriginal = this.authService.visceralFat[index].dateTimeFormatted

        if (vfValue <= 100 ) {
          let model = { "x": vfDateTime, "y": vfValue, "z": vfDateTimeOriginal, "color": "#ff9800" }
          this.vfGraphData.push(model)
        }
        if (vfValue > 100 && vfValue <= 120) {
          let model = { "x": vfDateTime, "y": vfValue, "z": vfDateTimeOriginal, "color": "#43A047" }
          this.vfGraphData.push(model)
        }
        if (vfValue > 120) {
          let model = { "x": vfDateTime, "y": vfValue, "z": vfDateTimeOriginal, "color": "#d32f2f" }
          this.vfGraphData.push(model)
        }
      }
    }
    for (let index = 0; index < this.authService.waistHipRatio.length; index++) {
      if(!isNaN(this.authService.waistHipRatio[index].waist_hip_ratio)){
        var whpr = this.authService.waistHipRatio[index].waist_hip_ratio.toFixed(2)
        whprValue = parseFloat(whpr)

        this.testTakenDate = new Date(this.authService.waistHipRatio[index].dateTimeFormatted);

        if(this.last30Days <= this.testTakenDate){
          this.whprVitalValue[index]= whprValue;
        }

        whprDateTime = new Date(this.authService.waistHipRatio[index].dateTimeFormatted)
        whprDateTimeOriginal = this.authService.waistHipRatio[index].dateTimeFormatted

        if (whprValue < 0.80) {
          let model = { "x": whprDateTime, "y": whprValue, "z": whprDateTimeOriginal, "color": "#ff9800" }
          this.whprGraphData.push(model)
        }
        else if (whprValue >= 0.80 && whprValue <= 0.90) {
          let model = { "x": whprDateTime, "y": whprValue, "z": whprDateTimeOriginal, "color": "#43A047" }
          this.whprGraphData.push(model)
        }
        else if (whprValue > 0.90) {
          let model = { "x": whprDateTime, "y": whprValue, "z": whprDateTimeOriginal, "color": "#d32f2f" }
          this.whprGraphData.push(model)
        }
      }
    }
    for (let index = 0; index < this.authService.basalMetabolicRate.length; index++) {
      if(!isNaN(this.authService.basalMetabolicRate[index].basal_metabolic_rate)){
        var bmr = this.authService.basalMetabolicRate[index].basal_metabolic_rate.toFixed(2)
        bmrValue = parseFloat(bmr)

        this.testTakenDate = new Date(this.authService.basalMetabolicRate[index].dateTimeFormatted);

        if(this.last30Days <= this.testTakenDate){
          this.bmrVitalValue[index]= bmrValue;
        }

        bmrDateTime = new Date(this.authService.basalMetabolicRate[index].dateTimeFormatted)
        bmrDateTimeOriginal = this.authService.basalMetabolicRate[index].dateTimeFormatted

        // if (bmrValue < 1200) {
          let model = { "x": bmrDateTime, "y": bmrValue, "z": bmrDateTimeOriginal, "color": "#42a5f5" }
          this.bmrGraphData.push(model)
        // }
        // if (bmrValue >= 1200) {
        //   let model = { "x": bmrDateTime, "y": bmrValue, "z": bmrDateTimeOriginal, "color": "#43A047" }
        //   this.bmrGraphData.push(model)
        // }
      }
    }
    for (let index = 0; index < this.authService.waistHeightRatio.length; index++) {
      if(!isNaN(this.authService.waistHeightRatio[index].waist_height_ratio)){
        var whtr = this.authService.waistHeightRatio[index].waist_height_ratio
        whtrValue = parseFloat(whtr)

        this.testTakenDate = new Date(this.authService.waistHeightRatio[index].dateTimeFormatted);

        if(this.last30Days <= this.testTakenDate){
          this.whtrVitalValue[index]= whtrValue;
        }

        whtrDateTime = new Date(this.authService.waistHeightRatio[index].dateTimeFormatted)
        whtrDateTimeOriginal = this.authService.waistHeightRatio[index].dateTimeFormatted

        if (whtrValue < waisttoheightratiolow) {
          let model = { "x": whtrDateTime, "y": whtrValue, "z": whtrDateTimeOriginal, "color": "#ff9800" }
          this.whtrGraphData.push(model)
        }
        if (whtrValue >= waisttoheightratiolow && whtrValue <= waisttoheightratiohigh) {
          let model = { "x": whtrDateTime, "y": whtrValue, "z": whtrDateTimeOriginal, "color": "#43A047" }
          this.whtrGraphData.push(model)
        }
        if (whtrValue > waisttoheightratiohigh) {
          let model = { "x": whtrDateTime, "y": whtrValue, "z": whtrDateTimeOriginal, "color": "#d32f2f" }
          this.whtrGraphData.push(model)
        }
      }
    }
    //sandip end full body bmc

    for (let index = 0; index < this.authService.BP.length; index++) {
      bpSystolicValue = this.authService.BP[index].systolic
      bpStatus = this.authService.BP[index].bpClass;
      bpDiastolicValue = this.authService.BP[index].diastolic

      this.testTakenDate = new Date(this.authService.BP[index].dateTimeFormatted);

      if(this.last30Days <= this.testTakenDate){
        this.bpSysValue[index]= bpSystolicValue;
        this.bpDiaValue[index]= bpDiastolicValue;
      }

      bpDateTime = new Date(this.authService.BP[index].dateTimeFormatted)
      bpOriginalDateTime = this.authService.BP[index].dateTimeFormatted
      if (bpStatus.toLowerCase() === "normal") {
        let modelBpSystolic = { "x": bpDateTime, "y": parseFloat(bpSystolicValue), "a": parseFloat(bpSystolicValue), "b": parseFloat(bpDiastolicValue), "z": bpOriginalDateTime, "color": "#43A047" }
        this.bpSystolicGraphData.push(modelBpSystolic)
        let modelBpDiastolic = { "x": bpDateTime, "y": parseFloat(bpDiastolicValue), "a": parseFloat(bpSystolicValue), "b": parseFloat(bpDiastolicValue), "z": bpOriginalDateTime, "color": "#43A047" }
        this.bpDiastolicGraphData.push(modelBpDiastolic)
      }
      else if (bpStatus.toLowerCase() === "acceptable") {
        let modelBpSystolic = { "x": bpDateTime, "y": parseFloat(bpSystolicValue), "a": parseFloat(bpSystolicValue), "b": parseFloat(bpDiastolicValue), "z": bpOriginalDateTime, "color": "#ff9800" }
        this.bpSystolicGraphData.push(modelBpSystolic)
        let modelBpDiastolic = { "x": bpDateTime, "y": parseFloat(bpDiastolicValue), "a": parseFloat(bpSystolicValue), "b": parseFloat(bpDiastolicValue), "z": bpOriginalDateTime, "color": "#ff9800" }
        this.bpDiastolicGraphData.push(modelBpDiastolic)
      }
      // else if (bpStatus === "Low") {
      //   let modelBpSystolic = { "x": bpDateTime, "y": parseFloat(bpSystolicValue), "a": parseFloat(bpSystolicValue), "b": parseFloat(bpDiastolicValue), "z": bpOriginalDateTime, "color": "#ff5722" }
      //   this.bpSystolicGraphData.push(modelBpSystolic)
      //   let modelBpDiastolic = { "x": bpDateTime, "y": parseFloat(bpDiastolicValue), "a": parseFloat(bpSystolicValue), "b": parseFloat(bpDiastolicValue), "z": bpOriginalDateTime, "color": "#ff5722" }
      //   this.bpDiastolicGraphData.push(modelBpDiastolic)
      // }
      else if (bpStatus.toLowerCase() === "high") {
        let modelBpSystolic = { "x": bpDateTime, "y": parseFloat(bpSystolicValue), "a": parseFloat(bpSystolicValue), "b": parseFloat(bpDiastolicValue), "z": bpOriginalDateTime, "color": "#d32f2f" }
        this.bpSystolicGraphData.push(modelBpSystolic)
        let modelBpDiastolic = { "x": bpDateTime, "y": parseFloat(bpDiastolicValue), "a": parseFloat(bpSystolicValue), "b": parseFloat(bpDiastolicValue), "z": bpOriginalDateTime, "color": "#d32f2f" }
        this.bpDiastolicGraphData.push(modelBpDiastolic)
      }
      // else if (bpStatus === "isolated systolic hypertension") {
      //   let modelBpSystolic = { "x": bpDateTime, "y": parseFloat(bpSystolicValue), "a": parseFloat(bpSystolicValue), "b": parseFloat(bpDiastolicValue), "z": bpOriginalDateTime, "color": "#FFB300" }
      //   this.bpSystolicGraphData.push(modelBpSystolic)
      //   let modelBpDiastolic = { "x": bpDateTime, "y": parseFloat(bpDiastolicValue), "a": parseFloat(bpSystolicValue), "b": parseFloat(bpDiastolicValue), "z": bpOriginalDateTime, "color": "#FFB300" }
      //   this.bpDiastolicGraphData.push(modelBpDiastolic)
      // }
      // else if (bpStatus === "isolated diastolic hypertension") {
      //   let modelBpSystolic = { "x": bpDateTime, "y": parseFloat(bpSystolicValue), "a": parseFloat(bpSystolicValue), "b": parseFloat(bpDiastolicValue), "z": bpOriginalDateTime, "color": "#C0CA33" }
      //   this.bpSystolicGraphData.push(modelBpSystolic)
      //   let modelBpDiastolic = { "x": bpDateTime, "y": parseFloat(bpDiastolicValue), "a": parseFloat(bpSystolicValue), "b": parseFloat(bpDiastolicValue), "z": bpOriginalDateTime, "color": "#C0CA33" }
      //   this.bpDiastolicGraphData.push(modelBpDiastolic)
      // }
      // else if (bpStatus === undefined) {
      //   let modelBpSystolic = { "x": bpDateTime, "y": parseFloat(bpSystolicValue), "a": parseFloat(bpSystolicValue), "b": parseFloat(bpDiastolicValue), "z": bpOriginalDateTime, "color": "#4885ed" }
      //   this.bpSystolicGraphData.push(modelBpSystolic)
      //   let modelBpDiastolic = { "x": bpDateTime, "y": parseFloat(bpDiastolicValue), "a": parseFloat(bpSystolicValue), "b": parseFloat(bpDiastolicValue), "z": bpOriginalDateTime, "color": "#4885ed" }
      //   this.bpDiastolicGraphData.push(modelBpDiastolic)
      // }
    }
    for (let index = 0; index < this.authService.ECG.length; index++) {
      ecgValue = this.authService.ECG[index].ECGBpm

      this.testTakenDate = new Date(this.authService.ECG[index].dateTimeFormatted);

      if(this.last30Days <= this.testTakenDate){
        this.ecgVitalValue[index]= ecgValue;
      }

      ecgDateTime = new Date(this.authService.ECG[index].dateTimeFormatted)
      ecgDateTimeOriginal = this.authService.ECG[index].dateTimeFormatted
      if (this.authService.ECG[index].ECGData3 !== "") {
        ecgDataLeadOne = this.authService.ECG[index].ECGData
        ecgDataLeadTwo = this.authService.ECG[index].ECGData2
        ecgDataLeadThree = this.authService.ECG[index].ECGData3
        if (ecgValue < 101 && ecgValue > 59) {
          let model = { "x": ecgDateTime, "y": parseFloat(ecgValue), "z": ecgDateTimeOriginal, "color": "#43A047", "ecgLeadMode": 3, "ecgLeadOne": ecgDataLeadOne, "ecgLeadTwo": ecgDataLeadTwo, "ecgLeadThree": ecgDataLeadThree }
          this.ecgGraphData.push(model)
        }
        else {
          let model = { "x": ecgDateTime, "y": parseFloat(ecgValue), "z": ecgDateTimeOriginal, "color": "#d32f2f", "ecgLeadMode": 3, "ecgLeadOne": ecgDataLeadOne, "ecgLeadTwo": ecgDataLeadTwo, "ecgLeadThree": ecgDataLeadThree }
          this.ecgGraphData.push(model)
        }
      }
      else {
        ecgDataLeadOne = this.authService.ECG[index].ECGData
        ecgDataLeadTwo = this.authService.ECG[index].ECGData2
        var sixone = this.authService.ECG[index].ECGData
        var sixtwo = this.authService.ECG[index].ECGData2
        var sixLeadOne = sixone.split(',');
        var sixLeadTwo = sixtwo.split(',');
        var arrayValue = []
        var arrayValue1 = []
        var arrayValue2 = []
        var arrayValue3 = []
        for (var i = 0; i < sixLeadOne.length; i++) {
          arrayValue[i] = ((sixLeadTwo[i]) - (sixLeadOne[i]));
          arrayValue1[i] = -0.5 * ((parseInt(sixLeadOne[i])) + (parseInt(sixLeadTwo[i])));
          arrayValue2[i] = ((sixLeadOne[i]) - (0.5 * (sixLeadTwo[i])));
          arrayValue3[i] = ((sixLeadTwo[i]) - (0.5 * (sixLeadOne[i])));
        }
        ecgDataLeadThree = arrayValue.toString()
        ecgDataLeadFour = arrayValue1.toString()
        ecgDataLeadFive = arrayValue2.toString()
        ecgDataLeadSix = arrayValue3.toString()
        if (ecgValue < 101 && ecgValue > 59) {
          let model = { "x": ecgDateTime, "y": parseFloat(ecgValue), "z": ecgDateTimeOriginal, "color": "#43A047", "ecgLeadMode": 6, "ecgLeadOne": ecgDataLeadOne, "ecgLeadTwo": ecgDataLeadTwo, "ecgLeadThree": ecgDataLeadThree, "ecgLeadFour": ecgDataLeadFour, "ecgLeadFive": ecgDataLeadFive, "ecgLeadSix": ecgDataLeadSix }
          this.ecgGraphData.push(model)
        }
        else {
          let model = { "x": ecgDateTime, "y": parseFloat(ecgValue), "z": ecgDateTimeOriginal, "color": "#d32f2f", "ecgLeadMode": 6, "ecgLeadOne": ecgDataLeadOne, "ecgLeadTwo": ecgDataLeadTwo, "ecgLeadThree": ecgDataLeadThree, "ecgLeadFour": ecgDataLeadFour, "ecgLeadFive": ecgDataLeadFive, "ecgLeadSix": ecgDataLeadSix }
          this.ecgGraphData.push(model)
        }
      }
    }
    for (let index = 0; index < this.authService.BMI.length; index++) {
      var bmi = this.authService.BMI[index].bmi.toFixed(2)
      bmiValue = parseFloat(bmi)

      this.testTakenDate = new Date(this.authService.BMI[index].dateTimeFormatted);

      if(this.last30Days <= this.testTakenDate){
        this.bmiVitalValue[index]= bmiValue;
      }

      bmiDateTime = new Date(this.authService.BMI[index].dateTimeFormatted)
      bmiDateTimeOriginal = this.authService.BMI[index].dateTimeFormatted
      bmiStatus = this.authService.BMI[index].bmiClass
      if (bmiStatus.toLowerCase() === "low") {
        let model = { "x": bmiDateTime, "y": bmiValue, "z": bmiDateTimeOriginal, "color": "#ff9800" }
        this.bmiGraphData.push(model)
      }
      if (bmiStatus.toLowerCase() === "normal") {
        let model = { "x": bmiDateTime, "y": bmiValue, "z": bmiDateTimeOriginal, "color": "#43A047" }
        this.bmiGraphData.push(model)
      }
      if (bmiStatus.toLowerCase() === "high") {
        let model = { "x": bmiDateTime, "y": bmiValue, "z": bmiDateTimeOriginal, "color": "#d32f2f" }
        this.bmiGraphData.push(model)
      }
      // if (bmiStatus === undefined) {
      //   let model = { "x": bmiDateTime, "y": bmiValue, "z": bmiDateTimeOriginal, "color": "#4885ed" }
      //   this.bmiGraphData.push(model)
      // }
    }
    for (let index = 0; index < this.authService.WEIGHT.length; index++) {
      var weight = this.authService.WEIGHT[index].weightKG.toFixed(2)
      weightValue = parseFloat(weight)

      this.testTakenDate = new Date(this.authService.WEIGHT[index].dateTimeFormatted);

      if(this.last30Days <= this.testTakenDate){
        this.weightVitalValue[index]= weightValue;
      }

      weightStatus = this.authService.BMI[index].bmiClass
      weightDateTime = new Date(this.authService.WEIGHT[index].dateTimeFormatted)
      weightDateTimeOriginal = this.authService.WEIGHT[index].dateTimeFormatted
      if (weightStatus.toLowerCase() === "low") {
        let model = { "x": weightDateTime, "y": parseFloat(weightValue), "z": weightDateTimeOriginal, "color": "#ff9800" }
        this.weightGraphData.push(model)
      }
      if (weightStatus.toLowerCase() === "normal") {
        let model = { "x": weightDateTime, "y": parseFloat(weightValue), "z": weightDateTimeOriginal, "color": "#43A047" }
        this.weightGraphData.push(model)
      }
      if (weightStatus.toLowerCase() === "high") {
        let model = { "x": weightDateTime, "y": parseFloat(weightValue), "z": weightDateTimeOriginal, "color": "#d32f2f" }
        this.weightGraphData.push(model)
      }
      // if (weightStatus === undefined) {
      //   let model = { "x": weightDateTime, "y": parseFloat(weightValue), "z": weightDateTimeOriginal, "color": "#4885ed" }
      //   this.weightGraphData.push(model)
      // }
    }
    for (let index = 0; index < this.authService.SPO2.length; index++) {
      spo2Value = this.authService.SPO2[index].spo2

      this.testTakenDate = new Date(this.authService.SPO2[index].dateTimeFormatted);

      if(this.last30Days <= this.testTakenDate){
        this.spo2VitalValue[index]= spo2Value;
      }

      spo2DateTime = new Date(this.authService.SPO2[index].dateTimeFormatted)
      spo2DateTimeOriginal = this.authService.SPO2[index].dateTimeFormatted
      spo2Status = this.authService.SPO2[index].spo2Class
      if (spo2Status.toLowerCase() === "low") {
        let model = { "x": spo2DateTime, "y": parseFloat(spo2Value), "z": spo2DateTimeOriginal, "color": "#ff9800" }
        this.spo2GraphData.push(model)
      }
      if (spo2Status.toLowerCase() === "normal") {
        let model = { "x": spo2DateTime, "y": parseFloat(spo2Value), "z": spo2DateTimeOriginal, "color": "#43A047" }
        this.spo2GraphData.push(model)
      }
      // if (spo2Status === "AtRisk") {
      //   let model = { "x": spo2DateTime, "y": parseFloat(spo2Value), "z": spo2DateTimeOriginal, "color": "#d32f2f" }
      //   this.spo2GraphData.push(model)
      // }
      // if (spo2Status === "Healthy") {
      //   let model = { "x": spo2DateTime, "y": parseFloat(spo2Value), "z": spo2DateTimeOriginal, "color": "#43A047" }
      //   this.spo2GraphData.push(model)
      // }
      // if (spo2Status === "Acceptable") {
      //   let model = { "x": spo2DateTime, "y": parseFloat(spo2Value), "z": spo2DateTimeOriginal, "color": "#ff9800" }
      //   this.spo2GraphData.push(model)
      // }
      // if (spo2Status === undefined) {
      //   let model = { "x": spo2DateTime, "y": parseFloat(spo2Value), "z": spo2DateTimeOriginal, "color": "#4885ed" }
      //   this.spo2GraphData.push(model)
      // }
    }
    for (let index = 0; index < this.authService.TEMPERATURE.length; index++) {
      var tempValue = this.authService.TEMPERATURE[index].temperature
      temperatureValue = (tempValue * 9 / 5) + 32

      this.testTakenDate = new Date(this.authService.TEMPERATURE[index].dateTimeFormatted);

      if(this.last30Days <= this.testTakenDate){
        this.tempVitalValue[index]= temperatureValue;
      }

      temperatureDateTime = new Date(this.authService.TEMPERATURE[index].dateTimeFormatted)
      temperatureDateTimeOriginal = this.authService.TEMPERATURE[index].dateTimeFormatted
      temperatureStatus = this.authService.TEMPERATURE[index].temperatureClass
      if (temperatureStatus.toLowerCase() === "normal") {
        let model = { "x": temperatureDateTime, "y": parseFloat(temperatureValue), "z": temperatureDateTimeOriginal, "color": "#43A047" }
        this.temperatureGraphData.push(model)
      }
      if (temperatureStatus.toLowerCase() === "low") {
        let model = { "x": temperatureDateTime, "y": parseFloat(temperatureValue), "z": temperatureDateTimeOriginal, "color": "#ff9800" }
        this.temperatureGraphData.push(model)
      }
      if (temperatureStatus.toLowerCase() === "high") {
        let model = { "x": temperatureDateTime, "y": parseFloat(temperatureValue), "z": temperatureDateTimeOriginal, "color": "#d32f2f" }
        this.temperatureGraphData.push(model)
      }
      // if (temperatureStatus === "Veryhigh") {
      //   let model = { "x": temperatureDateTime, "y": parseFloat(temperatureValue), "z": temperatureDateTimeOriginal, "color": "#d32f2f" }
      //   this.temperatureGraphData.push(model)
      // }
      // if (temperatureStatus === undefined) {
      //   let model = { "x": temperatureDateTime, "y": parseFloat(temperatureValue), "z": temperatureDateTimeOriginal, "color": "#4885ed" }
      //   this.temperatureGraphData.push(model)
      // }

    }
    for (let index = 0; index < this.authService.PULSE.length; index++) {
      pulseValue = this.authService.PULSE[index].pulseBpm

      this.testTakenDate = new Date(this.authService.PULSE[index].dateTimeFormatted);

      if(this.last30Days <= this.testTakenDate){
        this.pulseVitalValue[index]= pulseValue;
      }

      pulseDateTime = new Date(this.authService.PULSE[index].dateTimeFormatted)
      pulseDateTimeOriginal = this.authService.PULSE[index].dateTimeFormatted
      pulseStatus = this.authService.PULSE[index].pulseClass
      if (pulseStatus.toLowerCase() === "normal") {
        let model = { "x": pulseDateTime, "y":
        (pulseValue), "z": pulseDateTimeOriginal, "color": "#43A047" }
        this.pulseGraphData.push(model)
      }
      if (pulseStatus.toLowerCase() === "high") {
        let model = { "x": pulseDateTime, "y": parseFloat(pulseValue), "z": pulseDateTimeOriginal, "color": "#d32f2f" }
        this.pulseGraphData.push(model)
      }
      if (pulseStatus.toLowerCase() === "low") {
        let model = { "x": pulseDateTime, "y": parseFloat(pulseValue), "z": pulseDateTimeOriginal, "color": "#ff9800" }
        this.pulseGraphData.push(model)
      }
    }
    for (let index = 0; index < this.authService.BMC.length; index++) {
      var bmc = this.authService.BMC[index].fatRatio.toFixed(2)
      bmcValue = parseFloat(bmc)

      this.testTakenDate = new Date(this.authService.BMC[index].dateTimeFormatted);

      if(this.last30Days <= this.testTakenDate){
        this.bmcVitalValue[index]= bmcValue;
      }

      bmcDateTime = new Date(this.authService.BMC[index].dateTimeFormatted)
      bmcDateTimeOriginal = this.authService.BMC[index].dateTimeFormatted
      bmcStatus = this.authService.BMC[index].fatClass
      if (bmcStatus === "acceptable") {
        let model = { "x": bmcDateTime, "y": parseFloat(bmcValue), "z": bmcDateTimeOriginal, "color": "#ff9800" }
        this.bmcGraphData.push(model)
      }
      if (bmcStatus === "healthy") {
        let model = { "x": bmcDateTime, "y": parseFloat(bmcValue), "z": bmcDateTimeOriginal, "color": "#43A047" }
        this.bmcGraphData.push(model)
      }
      if (bmcStatus === "atrisk") {
        let model = { "x": bmcDateTime, "y": parseFloat(bmcValue), "z": bmcDateTimeOriginal, "color": "#d32f2f" }
        this.bmcGraphData.push(model)
      }
      if (bmcStatus === undefined) {
        let model = { "x": bmcDateTime, "y": parseFloat(bmcValue), "z": bmcDateTimeOriginal, "color": "#4885ed" }
        this.bmcGraphData.push(model)
      }
    }
  }

  ngDoCheck() {
    if ($('#vital-stats-info').is(':visible')) {

      if (this.testType === "Percent Body Fat" && this.loadpbfGraph === false) {
        this.loadpbfGraph = true
        this.showGraph('showAllDays')

        let getMinMaxVal = this.minMaxCalc(this.pbfVitalValue);

        this.highestValueInLast30days =  getMinMaxVal.max;
        this.lowestValueInLast30days  =  getMinMaxVal.min;
        this.averageValueInLast30days =  getMinMaxVal.avg;

      }

      if (this.testType === "Protein" && this.loadproteinGraph === false) {
        this.loadproteinGraph = true
        this.showGraph('showAllDays')

        let getMinMaxVal = this.minMaxCalc(this.proteinVitalValue);

        this.highestValueInLast30days =  getMinMaxVal.max;
        this.lowestValueInLast30days  =  getMinMaxVal.min;
        this.averageValueInLast30days =  getMinMaxVal.avg;

      }

      if (this.testType === "Extra Cellular Water" && this.loadecwGraph === false) {
        this.loadecwGraph = true
        this.showGraph('showAllDays')

        let getMinMaxVal = this.minMaxCalc(this.ecwVitalValue);

        this.highestValueInLast30days =  getMinMaxVal.max;
        this.lowestValueInLast30days  =  getMinMaxVal.min;
        this.averageValueInLast30days =  getMinMaxVal.avg;

      }

      if (this.testType === "Intra Cellular Water" && this.loadicwGraph === false) {
        this.loadicwGraph = true
        this.showGraph('showAllDays')

        let getMinMaxVal = this.minMaxCalc(this.icwVitalValue);

        this.highestValueInLast30days =  getMinMaxVal.max;
        this.lowestValueInLast30days  =  getMinMaxVal.min;
        this.averageValueInLast30days =  getMinMaxVal.avg;

      }

      if (this.testType === "Mineral" && this.loadmineralGraph === false) {
        this.loadmineralGraph = true
        this.showGraph('showAllDays')

        let getMinMaxVal = this.minMaxCalc(this.mineralVitalValue);

        this.highestValueInLast30days =  getMinMaxVal.max;
        this.lowestValueInLast30days  =  getMinMaxVal.min;
        this.averageValueInLast30days =  getMinMaxVal.avg;

      }

      if (this.testType === "Skeletal Muscle Mass" && this.loadsmmGraph === false) {
        this.loadsmmGraph = true
        this.showGraph('showAllDays')

        let getMinMaxVal = this.minMaxCalc(this.smmVitalValue);

        this.highestValueInLast30days =  getMinMaxVal.max;
        this.lowestValueInLast30days  =  getMinMaxVal.min;
        this.averageValueInLast30days =  getMinMaxVal.avg;

      }

      if (this.testType === "Body Fat Mass" && this.loadbfmGraph === false) {
        this.loadbfmGraph = true
        this.showGraph('showAllDays')

        let getMinMaxVal = this.minMaxCalc(this.bfmVitalValue);

        this.highestValueInLast30days =  getMinMaxVal.max;
        this.lowestValueInLast30days  =  getMinMaxVal.min;
        this.averageValueInLast30days =  getMinMaxVal.avg;

      }

      if (this.testType === "Waist/Hip Ratio" && this.loadwhprGraph === false) {
        this.loadwhprGraph = true
        this.showGraph('showAllDays')

        let getMinMaxVal = this.minMaxCalc(this.whprVitalValue);

        this.highestValueInLast30days =  getMinMaxVal.max;
        this.lowestValueInLast30days  =  getMinMaxVal.min;
        this.averageValueInLast30days =  getMinMaxVal.avg;

      }

      if (this.testType === "Body Cell Mass" && this.loadbcmGraph === false) {
        this.loadbcmGraph = true
        this.showGraph('showAllDays')

        let getMinMaxVal = this.minMaxCalc(this.bcmVitalValue);

        this.highestValueInLast30days =  getMinMaxVal.max;
        this.lowestValueInLast30days  =  getMinMaxVal.min;
        this.averageValueInLast30days =  getMinMaxVal.avg;

      }

      if (this.testType === "Waist/Height Ratio" && this.loadwhtrGraph === false) {
        this.loadwhtrGraph = true
        this.showGraph('showAllDays')

        let getMinMaxVal = this.minMaxCalc(this.whtrVitalValue);

        this.highestValueInLast30days =  getMinMaxVal.max;
        this.lowestValueInLast30days  =  getMinMaxVal.min;
        this.averageValueInLast30days =  getMinMaxVal.avg;

      }

      if (this.testType === "Visceral Fat" && this.loadvfGraph === false) {
        this.loadvfGraph = true
        this.showGraph('showAllDays')

        let getMinMaxVal = this.minMaxCalc(this.vfVitalValue);

        this.highestValueInLast30days =  getMinMaxVal.max;
        this.lowestValueInLast30days  =  getMinMaxVal.min;
        this.averageValueInLast30days =  getMinMaxVal.avg;

      }

      if (this.testType === "Basal Metabolic Rate" && this.loadbmrGraph === false) {
        this.loadbmrGraph = true
        this.showGraph('showAllDays')

        let getMinMaxVal = this.minMaxCalc(this.bmrVitalValue);

        this.highestValueInLast30days =  getMinMaxVal.max;
        this.lowestValueInLast30days  =  getMinMaxVal.min;
        this.averageValueInLast30days =  getMinMaxVal.avg;

      }

      if (this.testType === "Bone Mineral Content" && this.loadbmctGraph === false) {
        this.loadbmctGraph = true
        this.showGraph('showAllDays')

        let getMinMaxVal = this.minMaxCalc(this.bmctVitalValue);

        this.highestValueInLast30days =  getMinMaxVal.max;
        this.lowestValueInLast30days  =  getMinMaxVal.min;
        this.averageValueInLast30days =  getMinMaxVal.avg;

      }

      else if (this.testType === "SpO2" && this.loadSpo2Graph === false) {
        this.loadSpo2Graph = true
        this.showGraph('showAllDays')

        let getMinMaxVal = this.minMaxCalc(this.spo2VitalValue);

        this.highestValueInLast30days =  getMinMaxVal.max;
        this.lowestValueInLast30days  =  getMinMaxVal.min;
        this.averageValueInLast30days =  getMinMaxVal.avg;

      }
      else if (this.testType === "ECG" && this.loadEcgGraph === false) {
        this.loadEcgGraph = true
        this.showGraph('showAllDays')

        let getMinMaxVal = this.minMaxCalc(this.ecgVitalValue);
        this.highestValueInLast30days =  getMinMaxVal.max;
        this.lowestValueInLast30days  =  getMinMaxVal.min;
        this.averageValueInLast30days =  getMinMaxVal.avg;
      }
      else if (this.testType === "Blood Pressure" && this.loadBpGraph === false) {
        this.loadBpGraph = true
        this.showGraph('showAllDays')

        let getMinMaxVal = this.minMaxBPCalc(this.bpSysValue,this.bpDiaValue);

        this.highestValueInLast30days =  getMinMaxVal.max;
        this.lowestValueInLast30days  =  getMinMaxVal.min;
        this.averageValueInLast30days =  getMinMaxVal.avg;
      }
      else if (this.testType === "WEIGHT" && this.loadWeightGraph === false) {
        this.loadWeightGraph = true
        this.showGraph('showAllDays')

        let getMinMaxVal = this.minMaxCalc(this.weightVitalValue);

        this.highestValueInLast30days =  getMinMaxVal.max;
        this.lowestValueInLast30days  =  getMinMaxVal.min;
        this.averageValueInLast30days =  getMinMaxVal.avg;
      }
      else if (this.testType === "BMI" && this.loadBmiGraph === false) {
        this.loadBmiGraph = true
        this.showGraph('showAllDays')

        let getMinMaxVal = this.minMaxCalc(this.bmiVitalValue);

        this.highestValueInLast30days =  getMinMaxVal.max;
        this.lowestValueInLast30days  =  getMinMaxVal.min;
        this.averageValueInLast30days =  getMinMaxVal.avg;
      }
      else if (this.testType === "TEMPERATURE" && this.loadTemperatureGraph === false) {
        this.loadTemperatureGraph = true
        this.showGraph('showAllDays')

        let getMinMaxVal = this.minMaxCalc(this.tempVitalValue);

        this.highestValueInLast30days =  getMinMaxVal.max;
        this.lowestValueInLast30days  =  getMinMaxVal.min;
        this.averageValueInLast30days =  getMinMaxVal.avg;
      }
      else if (this.testType === "Fat Ratio" && this.loadBmcGraph === false) {
        this.loadBmcGraph = true
        this.showGraph('showAllDays')

        let getMinMaxVal = this.minMaxCalc(this.bmcVitalValue);

        this.highestValueInLast30days =  getMinMaxVal.max;
        this.lowestValueInLast30days  =  getMinMaxVal.min;
        this.averageValueInLast30days =  getMinMaxVal.avg;
      }
      else if (this.testType === "PULSE" && this.loadPulseGraph === false) {
        this.loadPulseGraph = true
        this.showGraph('showAllDays')

        let getMinMaxVal = this.minMaxCalc(this.pulseVitalValue);

        this.highestValueInLast30days =  getMinMaxVal.max;
        this.lowestValueInLast30days  =  getMinMaxVal.min;
        this.averageValueInLast30days =  getMinMaxVal.avg;
      }
    }
    this.sanitized = this.testType.replace(/\s+/g, "-");
    // console.log("sanitized : ",this.sanitized);
  }

  minMaxCalc(vitalValue){
    let max;
    let min;
    let avg;
    if (vitalValue.length > 0)
        {
          var Len = vitalValue.length;
          let vitalArr = [];
          let vitalArrIndex = 0;
          let sum = 0;

          for(var index = 0; vitalValue.length > index; index++){
            if(vitalValue[index] != undefined && vitalValue != null){
              vitalArr[vitalArrIndex] = vitalValue[index];
              vitalArrIndex++;
              sum = sum + parseInt(vitalValue[index]);
            }
          }
          max = Math.max(...vitalArr).toFixed(2);
          min = Math.min(...vitalArr).toFixed(2);
          /* console.log("vitalArr");
          console.log(vitalArr); */
          /* var highest = Math.max.apply(null,vitalValue);
          var lowest  = Math.min.apply(null,vitalValue);
          max = highest.toFixed(2);
          min = lowest.toFixed(2);*/

          //var sum = vitalArr.reduce((a, b) => a + b, 0);
          var average = sum /vitalArr.length;
          avg = average.toFixed(2);
          if (this.testType === "ECG" || this.testType === "PULSE"){
            avg = Math.round(avg);
            avg = parseInt(avg);
          }
         }
         else{
          max =  "--";
          min =  "--";
          avg =  "--";
         }
         return {"max": max,"min":min,"avg":avg};
  }

  minMaxBPCalc(vitalValue1,vitalValue2){
    let max;
    let min;
    let avg;
    if (vitalValue1.length > 0 && vitalValue2.length > 0)
    {

              /* var vitalValue1 = vitalValue1.map(i=>Number(i));
              console.log(vitalValue1);

              var vitalValue2 = vitalValue2.map(i=>Number(i));
              console.log(vitalValue2); */


              let vitalArr1 = [];
              let vitalArrIndex1 = 0;
              let vitalArr2 = [];
              let vitalArrIndex2 = 0;

              for(var index = 1; vitalValue1.length > index; index++){
                if(vitalValue1[index] != undefined && vitalValue1 != null){
                  vitalArr1[vitalArrIndex1] = vitalValue1[index];
                  vitalArrIndex1++;
                }
             }

              for(var index = 1; vitalValue2.length > index; index++){
                if(vitalValue2[index] != undefined && vitalValue2 != null){
                  vitalArr2[vitalArrIndex2] = vitalValue2[index];
                  vitalArrIndex2++;
                }
              }


              var sysLen = vitalValue1.length;
              var diaLen = vitalValue2.length;

             /*  var highestSys = Math.max.apply(null,vitalValue1);
              var lowestSys  = Math.min.apply(null,vitalValue1);
              var highestDia = Math.max.apply(null,vitalValue2);
              var lowestDia  = Math.min.apply(null,vitalValue2); */

              var highestSys = Math.max(...vitalArr1);
              var lowestSys  = Math.min(...vitalArr1);
              var highestDia = Math.max(...vitalArr2);
              var lowestDia  = Math.min(...vitalArr2);

              max = highestSys+"/"+highestDia;
              min = lowestSys+"/"+lowestDia;

              var sumOfSys   = vitalValue1.reduce((a, b) => a + b, 0);
              var sumOfDia   = vitalValue2.reduce((a, b) => a + b, 0);

              var averageSys = sumOfSys / sysLen;
              var averageDia = sumOfDia / diaLen;

              avg = averageSys.toFixed(0)+"/"+averageDia.toFixed(0);
          }else
          {
          max =  "--";
          min =  "--";
          avg =  "--";
         }

         return {"max": max,"min":min,"avg":avg};
  }
  timeDifference(date1, date2) {
    if (date1 != undefined && date2 != undefined) {
      var difference = date1.getTime() - date2.getTime()
      if (date1.getFullYear() == date2.getFullYear() && date1.getMonth() == date2.getMonth() && date1.getDate() == date2.getDate()) {
        return 0
      } else {
        return 1
      }
    }
  }

  showGraph(GraphPeriod) {
    this.previousNav = false
    this.nextNav = false
    this.loadingMessage = true;
    document.getElementById("vitalChart").style.height = "460px";
    $("#ecgGraphChartContainerLead1").hide()
    $("#ecgGraphChartContainerLead2").hide()
    $("#ecgGraphChartContainerLead3").hide()
    $("#ecgGraphChartContainerLead4").hide()
    $("#ecgGraphChartContainerLead5").hide()
    $("#ecgGraphChartContainerLead6").hide()
    var graph = []
    var bpDiastolicGraph = []
    var date1; var date2
    var final_dp = 0
    var test_cond = false
    var before90Days
    if (GraphPeriod === "showAllDays") {
      var element = document.getElementById("test1");
      element.classList.remove("current");
      var element = document.getElementById("test2");
      element.classList.remove("current");
      var element = document.getElementById("test");
      element.classList.remove("current");
      var element = document.getElementById("all-days");
      element.classList.add("current");
    }
    if (GraphPeriod === "showNinetyDays") {
      var element = document.getElementById("all-days");
      element.classList.remove("current");
      var element = document.getElementById("test1");
      element.classList.remove("current");
      var element = document.getElementById("test2");
      element.classList.remove("current");
      var element = document.getElementById("test");
      element.classList.add("current");
      before90Days = new Date(Date.now() - (90 * 24 * 60 * 60 * 1000))
    }
    if (GraphPeriod === "showThirtyDays") {
      var element = document.getElementById("all-days");
      element.classList.remove("current");
      var element = document.getElementById("test");
      element.classList.remove("current");
      var element = document.getElementById("test2");
      element.classList.remove("current");
      var element = document.getElementById("test1");
      element.classList.add("current");
      before90Days = new Date(Date.now() - (30 * 24 * 60 * 60 * 1000))
    }
    if (GraphPeriod === "showSevenDays") {
      var element = document.getElementById("all-days");
      element.classList.remove("current");
      var element = document.getElementById("test");
      element.classList.remove("current");
      var element = document.getElementById("test1");
      element.classList.remove("current");
      var element = document.getElementById("test2");
      element.classList.add("current");
      before90Days = new Date(Date.now() - (7 * 24 * 60 * 60 * 1000))
    }
    var last90Days = new Date(before90Days)

    //sandip full body BMC graph plotting starts

    if (this.testType == "Percent Body Fat") {
      if (this.pbfGraphData.length < 2) {
        this.showMinimumError = true
        this.loadingMessage = false
      }
      else {
        this.showMinimumError = false
        for (let index = 0, count_inc = 0, init2 = 0; this.pbfGraphData.length > index; index++) {
          graph[index] = {}
          if (GraphPeriod !== "showAllDays") {
            var testTakenDate = this.pbfGraphData[index].x
          }
          if (index == 0) {
            if (GraphPeriod === "showAllDays") {
              var DateOnlyInit = new Date(this.pbfGraphData[index].z.slice(0, -10))
            }
          }
          if (GraphPeriod === "showAllDays") {
            if (index > 0) {
              var DateOnlyPrev = new Date(this.pbfGraphData[index - 1].z.slice(0, -10))
              var DateOnlyCurrent = new Date(this.pbfGraphData[index].z.slice(0, -10))
              var DateOnlyLast = new Date(this.pbfGraphData[this.pbfGraphData.length - 1].z.slice(0, -10))
              var diffInTimestampForLast = DateOnlyLast.valueOf() - DateOnlyInit.valueOf()
              var diffInHoursForLastStart = diffInTimestampForLast / 1000 / 60 / 60
              if (diffInHoursForLastStart <= 48) {
                graph[index - 1]['x'] = this.pbfGraphData[index - 1].x
                graph[index - 1]['y'] = this.pbfGraphData[index - 1].y
                graph[index - 1]['color'] = this.pbfGraphData[index - 1].color
                graph[index]['x'] = this.pbfGraphData[index].x
                graph[index]['y'] = this.pbfGraphData[index].y
                graph[index]['color'] = this.pbfGraphData[index].color
                test_cond = true
              }
              var dateDiff = this.timeDifference(DateOnlyCurrent, DateOnlyPrev);
              if (index == this.pbfGraphData.length - 1 && count_inc >= 1) {
                final_dp = count_inc;
                graph[count_inc]['x'] = this.pbfGraphData[index].x
                graph[count_inc]['y'] = this.pbfGraphData[index].y
                graph[count_inc]['color'] = this.pbfGraphData[index].color
              }
              if (dateDiff == 0) {
                //Nothing to do
              } else {
                if (diffInHoursForLastStart <= 48) {
                  test_cond = true
                } else {
                  test_cond = false;
                  graph[count_inc]['x'] = this.pbfGraphData[index - 1].x
                  graph[count_inc]['y'] = this.pbfGraphData[index - 1].y
                  graph[count_inc]['color'] = this.pbfGraphData[index - 1].color
                  final_dp = count_inc;
                  count_inc++;
                  if (index == this.pbfGraphData.length - 1 && count_inc >= 1 && diffInHoursForLastStart >= 48) {
                    final_dp = count_inc;
                    graph[count_inc]['x'] = this.pbfGraphData[index].x
                    graph[count_inc]['y'] = this.pbfGraphData[index].y
                    graph[count_inc]['color'] = this.pbfGraphData[index].color
                  }
                }
              }
            }
          }
          else {
            if (last90Days <= testTakenDate) {
              if (init2 == 0) {
                var DateOnlyInit = new Date(this.pbfGraphData[index].z.slice(0, -10))
                var DateOnlyLast = new Date(this.pbfGraphData[this.pbfGraphData.length - 1].z.slice(0, -10))
                var diffInTimestampForLast = DateOnlyLast.valueOf() - DateOnlyInit.valueOf()
                var diffInHoursForLastStart = diffInTimestampForLast / 1000 / 60 / 60
              }
              if (diffInHoursForLastStart <= 48) {
                graph[count_inc]['x'] = this.pbfGraphData[index].x
                graph[count_inc]['y'] = this.pbfGraphData[index].y
                graph[count_inc]['color'] = this.pbfGraphData[index].color
                test_cond = true
                count_inc++
              }
              var DateOnly = new Date(this.pbfGraphData[index].z.slice(0, -10))
              if (index > 0 && init2 > 0) {
                var DateOnlyPrev = new Date(this.pbfGraphData[index - 1].z.slice(0, -10))
                var dateDiff = this.timeDifference(DateOnly, DateOnlyPrev)
                if (index == this.pbfGraphData.length - 1 && count_inc >= 1 && diffInHoursForLastStart > 48) {
                  final_dp = count_inc
                  graph[count_inc]['x'] = this.pbfGraphData[index].x
                  graph[count_inc]['y'] = this.pbfGraphData[index].y
                  graph[count_inc]['color'] = this.pbfGraphData[index].color
                }
                if (dateDiff == 0 || diffInHoursForLastStart <= 48) {
                  //Nothing to do
                } else {
                  test_cond = false
                  graph[count_inc]['x'] = this.pbfGraphData[index - 1].x
                  graph[count_inc]['y'] = this.pbfGraphData[index - 1].y
                  graph[count_inc]['color'] = this.pbfGraphData[index - 1].color
                  final_dp = count_inc
                  count_inc++
                  if (index == this.pbfGraphData.length - 1 && count_inc >= 1) {
                    final_dp = count_inc
                    graph[count_inc]['x'] = this.pbfGraphData[index].x
                    graph[count_inc]['y'] = this.pbfGraphData[index].y
                    graph[count_inc]['color'] = this.pbfGraphData[index].color
                  }
                }
              }
              init2++
            }
          }
        }
        var beforeDate = null
        var dtArr = []
        var dt = 0
        if (test_cond === true) {
          for (let i = graph.length - 1; i > -1; i--) {
            if (graph[i]['y'] != undefined) {
              dtArr[dt] = graph[i]
              dt++
            }
          }
        } else {
          for (let i = final_dp; i > -1; i--) {
            if (graph[i]['y'] != undefined) {
              dtArr[dt] = graph[i]
              dt++
            }
          }
        }
        if (dtArr.length < 2) {
          $('#pbfChartContainer').hide()
          this.showMinimumError = true
          this.loadingMessage = false
        } else {
          $('#pbfChartContainer').show()
          this.showMinimumError = false;
        }
        if (test_cond) {
          var chartFor2Days = new CanvasJS.Chart("pbfChartContainer",
            {
              toolTip: {
                fontFamily: "'Quicksand', 'sans-serif'",
                borderThickness: "0",
                cornerRadius: 10,
                content: "<span style='\"'color: {color}'\"'>Percent Body Fat : {y} kg <br>Date : {x}</span>"
              },
              animationEnabled: true,
              animationDuration: 2000,
              axisX: {
                lineThickness: 0,
                tickThickness: 0,
                gridColor: "Silver",
                valueFormatString: "DD/MMM hh TT",
                labelFontSize: 12,
                labelFontWeight: "bold",
                labelFontColor: "#808080",
                labelFontFamily: "'Quicksand', 'sans-serif'"
              },
              axisY: {
                maximum: 120,
                lineThickness: 0,
                tickThickness: 0,
                gridThickness: 0,
                labelFontSize: 12,
                labelFontWeight: "bold",
                labelFontColor: "#808080",
                labelFontFamily: "'Quicksand', 'sans-serif'",
                includeZero: false
              },
              legend: {
                fontSize: 15,
                fontFamily: "'Quicksand', 'sans-serif'",
                fontColor: "#808080"
              },
              data: [
                {
                  type: "splineArea",
                  showInLegend: true,
                  legendText: "Low",
                  legendMarkerType: "square",
                  legendMarkerColor: "#ff9800",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                {
                  type: "splineArea",
                  showInLegend: true,
                  legendText: "Normal",
                  legendMarkerType: "square",
                  legendMarkerColor: "#43A047",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                {
                  type: "splineArea",
                  showInLegend: true,
                  legendText: "Acceptable",
                  legendMarkerType: "square",
                  legendMarkerColor: "#fd7e14",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                {
                  type: "splineArea",
                  showInLegend: true,
                  legendText: "High",
                  legendMarkerType: "square",
                  legendMarkerColor: "#d32f2f",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                {
                  type: "splineArea",
                  lineThickness: 2,
                  lineColor: "#4885ed",
                  fillOpacity: 0.1,
                  markerSize: 10,
                  dataPoints: dtArr
                }
              ]
            })
          setTimeout(() => {
            this.loadingMessage = false
            chartFor2Days.render()
          }, 2000)
        }
        else {
          var pbfChart = new CanvasJS.Chart("pbfChartContainer",
            {
              toolTip: {
                fontFamily: "'Quicksand', 'sans-serif'",
                borderThickness: "0",
                cornerRadius: 10,
                content: "<span style='\"'color: {color}'\"'>Percent Body Fat : {y} kg <br>Date : {x}</span>"
              },
              animationEnabled: true,
              animationDuration: 2000,
              axisX: {
                lineThickness: 0,
                tickThickness: 0,
                gridColor: "Silver",
                valueFormatString: "DD/MMM",
                labelFontSize: 12,
                labelFontWeight: "bold",
                labelFontColor: "#808080",
                labelFontFamily: "'Quicksand', 'sans-serif'"
              },
              axisY: {
                maximum: 120,
                lineThickness: 0,
                tickThickness: 0,
                gridThickness: 0,
                labelFontSize: 12,
                labelFontWeight: "bold",
                labelFontColor: "#808080",
                labelFontFamily: "'Quicksand', 'sans-serif'",
                includeZero: false
              },
              legend: {
                fontSize: 15,
                fontFamily: "'Quicksand', 'sans-serif'",
                fontColor: "#808080"
              },
              data: [
                {
                  type: "splineArea",
                  showInLegend: true,
                  legendText: "Low",
                  legendMarkerType: "square",
                  legendMarkerColor: "#ff9800",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                {
                  type: "splineArea",
                  showInLegend: true,
                  legendText: "Normal",
                  legendMarkerType: "square",
                  legendMarkerColor: "#43A047",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                {
                  type: "splineArea",
                  showInLegend: true,
                  legendText: "Acceptable",
                  legendMarkerType: "square",
                  legendMarkerColor: "#fd7e14",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                {
                  type: "splineArea",
                  showInLegend: true,
                  legendText: "High",
                  legendMarkerType: "square",
                  legendMarkerColor: "#d32f2f",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                {
                  type: "splineArea",
                  lineThickness: 2,
                  lineColor: "#4885ed",
                  fillOpacity: 0.1,
                  markerSize: 10,
                  dataPoints: dtArr
                }
              ]
            })
          setTimeout(() => {
            this.loadingMessage = false
            pbfChart.render()
          }, 3000)
        }
      }
    }

    if (this.testType == "Extra Cellular Water") {
      if (this.ecwGraphData.length < 2) {
        this.showMinimumError = true
        this.loadingMessage = false
      }
      else {
        this.showMinimumError = false
        for (let index = 0, count_inc = 0, init2 = 0; this.ecwGraphData.length > index; index++) {
          graph[index] = {}
          if (GraphPeriod !== "showAllDays") {
            var testTakenDate = this.ecwGraphData[index].x
          }
          if (index == 0) {
            if (GraphPeriod === "showAllDays") {
              var DateOnlyInit = new Date(this.ecwGraphData[index].z.slice(0, -10))
            }
          }
          if (GraphPeriod === "showAllDays") {
            if (index > 0) {
              var DateOnlyPrev = new Date(this.ecwGraphData[index - 1].z.slice(0, -10))
              var DateOnlyCurrent = new Date(this.ecwGraphData[index].z.slice(0, -10))
              var DateOnlyLast = new Date(this.ecwGraphData[this.ecwGraphData.length - 1].z.slice(0, -10))
              var diffInTimestampForLast = DateOnlyLast.valueOf() - DateOnlyInit.valueOf()
              var diffInHoursForLastStart = diffInTimestampForLast / 1000 / 60 / 60
              if (diffInHoursForLastStart <= 48) {
                graph[index - 1]['x'] = this.ecwGraphData[index - 1].x
                graph[index - 1]['y'] = this.ecwGraphData[index - 1].y
                graph[index - 1]['color'] = this.ecwGraphData[index - 1].color
                graph[index]['x'] = this.ecwGraphData[index].x
                graph[index]['y'] = this.ecwGraphData[index].y
                graph[index]['color'] = this.ecwGraphData[index].color
                test_cond = true
              }
              var dateDiff = this.timeDifference(DateOnlyCurrent, DateOnlyPrev);
              if (index == this.ecwGraphData.length - 1 && count_inc >= 1) {
                final_dp = count_inc;
                graph[count_inc]['x'] = this.ecwGraphData[index].x
                graph[count_inc]['y'] = this.ecwGraphData[index].y
                graph[count_inc]['color'] = this.ecwGraphData[index].color
              }
              if (dateDiff == 0) {
                //Nothing to do
              } else {
                if (diffInHoursForLastStart <= 48) {
                  test_cond = true
                } else {
                  test_cond = false;
                  graph[count_inc]['x'] = this.ecwGraphData[index - 1].x
                  graph[count_inc]['y'] = this.ecwGraphData[index - 1].y
                  graph[count_inc]['color'] = this.ecwGraphData[index - 1].color
                  final_dp = count_inc;
                  count_inc++;
                  if (index == this.ecwGraphData.length - 1 && count_inc >= 1 && diffInHoursForLastStart >= 48) {
                    final_dp = count_inc;
                    graph[count_inc]['x'] = this.ecwGraphData[index].x
                    graph[count_inc]['y'] = this.ecwGraphData[index].y
                    graph[count_inc]['color'] = this.ecwGraphData[index].color
                  }
                }
              }
            }
          }
          else {
            if (last90Days <= testTakenDate) {
              if (init2 == 0) {
                var DateOnlyInit = new Date(this.ecwGraphData[index].z.slice(0, -10))
                var DateOnlyLast = new Date(this.ecwGraphData[this.ecwGraphData.length - 1].z.slice(0, -10))
                var diffInTimestampForLast = DateOnlyLast.valueOf() - DateOnlyInit.valueOf()
                var diffInHoursForLastStart = diffInTimestampForLast / 1000 / 60 / 60
              }
              if (diffInHoursForLastStart <= 48) {
                graph[count_inc]['x'] = this.ecwGraphData[index].x
                graph[count_inc]['y'] = this.ecwGraphData[index].y
                graph[count_inc]['color'] = this.ecwGraphData[index].color
                test_cond = true
                count_inc++
              }
              var DateOnly = new Date(this.ecwGraphData[index].z.slice(0, -10))
              if (index > 0 && init2 > 0) {
                var DateOnlyPrev = new Date(this.ecwGraphData[index - 1].z.slice(0, -10))
                var dateDiff = this.timeDifference(DateOnly, DateOnlyPrev)
                if (index == this.ecwGraphData.length - 1 && count_inc >= 1 && diffInHoursForLastStart > 48) {
                  final_dp = count_inc
                  graph[count_inc]['x'] = this.ecwGraphData[index].x
                  graph[count_inc]['y'] = this.ecwGraphData[index].y
                  graph[count_inc]['color'] = this.ecwGraphData[index].color
                }
                if (dateDiff == 0 || diffInHoursForLastStart <= 48) {
                  //Nothing to do
                } else {
                  test_cond = false
                  graph[count_inc]['x'] = this.ecwGraphData[index - 1].x
                  graph[count_inc]['y'] = this.ecwGraphData[index - 1].y
                  graph[count_inc]['color'] = this.ecwGraphData[index - 1].color
                  final_dp = count_inc
                  count_inc++
                  if (index == this.ecwGraphData.length - 1 && count_inc >= 1) {
                    final_dp = count_inc
                    graph[count_inc]['x'] = this.ecwGraphData[index].x
                    graph[count_inc]['y'] = this.ecwGraphData[index].y
                    graph[count_inc]['color'] = this.ecwGraphData[index].color
                  }
                }
              }
              init2++
            }
          }
        }
        var beforeDate = null
        var dtArr = []
        var dt = 0
        if (test_cond === true) {
          for (let i = graph.length - 1; i > -1; i--) {
            if (graph[i]['y'] != undefined) {
              dtArr[dt] = graph[i]
              dt++
            }
          }
        } else {
          for (let i = final_dp; i > -1; i--) {
            if (graph[i]['y'] != undefined) {
              dtArr[dt] = graph[i]
              dt++
            }
          }
        }
        if (dtArr.length < 2) {
          $('#ecwChartContainer').hide()
          this.showMinimumError = true
          this.loadingMessage = false
        } else {
          $('#ecwChartContainer').show()
          this.showMinimumError = false;
        }
        if (test_cond) {
          var chartFor2Days = new CanvasJS.Chart("ecwChartContainer",
            {
              toolTip: {
                fontFamily: "'Quicksand', 'sans-serif'",
                borderThickness: "0",
                cornerRadius: 10,
                content: "<span style='\"'color: {color}'\"'>Extra Cellular Water : {y} kg <br>Date : {x}</span>"
              },
              animationEnabled: true,
              animationDuration: 2000,
              axisX: {
                lineThickness: 0,
                tickThickness: 0,
                gridColor: "Silver",
                valueFormatString: "DD/MMM hh TT",
                labelFontSize: 12,
                labelFontWeight: "bold",
                labelFontColor: "#808080",
                labelFontFamily: "'Quicksand', 'sans-serif'"
              },
              axisY: {
                maximum: 120,
                lineThickness: 0,
                tickThickness: 0,
                gridThickness: 0,
                labelFontSize: 12,
                labelFontWeight: "bold",
                labelFontColor: "#808080",
                labelFontFamily: "'Quicksand', 'sans-serif'",
                includeZero: false
              },
              legend: {
                fontSize: 15,
                fontFamily: "'Quicksand', 'sans-serif'",
                fontColor: "#808080"
              },
              data: [
                {
                  type: "splineArea",
                  showInLegend: true,
                  legendText: "Low",
                  legendMarkerType: "square",
                  legendMarkerColor: "#ff9800",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                {
                  type: "splineArea",
                  showInLegend: true,
                  legendText: "Normal",
                  legendMarkerType: "square",
                  legendMarkerColor: "#43A047",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                {
                  type: "splineArea",
                  showInLegend: true,
                  legendText: "High",
                  legendMarkerType: "square",
                  legendMarkerColor: "#d32f2f",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                {
                  type: "splineArea",
                  lineThickness: 2,
                  lineColor: "#4885ed",
                  fillOpacity: 0.1,
                  markerSize: 10,
                  dataPoints: dtArr
                }
              ]
            })
          setTimeout(() => {
            this.loadingMessage = false
            chartFor2Days.render()
          }, 2000)
        }
        else {
          var ecwChart = new CanvasJS.Chart("ecwChartContainer",
            {
              toolTip: {
                fontFamily: "'Quicksand', 'sans-serif'",
                borderThickness: "0",
                cornerRadius: 10,
                content: "<span style='\"'color: {color}'\"'>Extra Cellular Water : {y} kg <br>Date : {x}</span>"
              },
              animationEnabled: true,
              animationDuration: 2000,
              axisX: {
                lineThickness: 0,
                tickThickness: 0,
                gridColor: "Silver",
                valueFormatString: "DD/MMM",
                labelFontSize: 12,
                labelFontWeight: "bold",
                labelFontColor: "#808080",
                labelFontFamily: "'Quicksand', 'sans-serif'"
              },
              axisY: {
                maximum: 120,
                lineThickness: 0,
                tickThickness: 0,
                gridThickness: 0,
                labelFontSize: 12,
                labelFontWeight: "bold",
                labelFontColor: "#808080",
                labelFontFamily: "'Quicksand', 'sans-serif'",
                includeZero: false
              },
              legend: {
                fontSize: 15,
                fontFamily: "'Quicksand', 'sans-serif'",
                fontColor: "#808080"
              },
              data: [
                {
                  type: "splineArea",
                  showInLegend: true,
                  legendText: "Low",
                  legendMarkerType: "square",
                  legendMarkerColor: "#ff9800",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                {
                  type: "splineArea",
                  showInLegend: true,
                  legendText: "Normal",
                  legendMarkerType: "square",
                  legendMarkerColor: "#43A047",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                {
                  type: "splineArea",
                  showInLegend: true,
                  legendText: "High",
                  legendMarkerType: "square",
                  legendMarkerColor: "#d32f2f",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                {
                  type: "splineArea",
                  lineThickness: 2,
                  lineColor: "#4885ed",
                  fillOpacity: 0.1,
                  markerSize: 10,
                  dataPoints: dtArr
                }
              ]
            })
          setTimeout(() => {
            this.loadingMessage = false
            ecwChart.render()
          }, 3000)
        }
      }
    }

    if (this.testType == "Intra Cellular Water") {
      if (this.icwGraphData.length < 2) {
        this.showMinimumError = true
        this.loadingMessage = false
      }
      else {
        this.showMinimumError = false
        for (let index = 0, count_inc = 0, init2 = 0; this.icwGraphData.length > index; index++) {
          graph[index] = {}
          if (GraphPeriod !== "showAllDays") {
            var testTakenDate = this.icwGraphData[index].x
          }
          if (index == 0) {
            if (GraphPeriod === "showAllDays") {
              var DateOnlyInit = new Date(this.icwGraphData[index].z.slice(0, -10))
            }
          }
          if (GraphPeriod === "showAllDays") {
            if (index > 0) {
              var DateOnlyPrev = new Date(this.icwGraphData[index - 1].z.slice(0, -10))
              var DateOnlyCurrent = new Date(this.icwGraphData[index].z.slice(0, -10))
              var DateOnlyLast = new Date(this.icwGraphData[this.icwGraphData.length - 1].z.slice(0, -10))
              var diffInTimestampForLast = DateOnlyLast.valueOf() - DateOnlyInit.valueOf()
              var diffInHoursForLastStart = diffInTimestampForLast / 1000 / 60 / 60
              if (diffInHoursForLastStart <= 48) {
                graph[index - 1]['x'] = this.icwGraphData[index - 1].x
                graph[index - 1]['y'] = this.icwGraphData[index - 1].y
                graph[index - 1]['color'] = this.icwGraphData[index - 1].color
                graph[index]['x'] = this.icwGraphData[index].x
                graph[index]['y'] = this.icwGraphData[index].y
                graph[index]['color'] = this.icwGraphData[index].color
                test_cond = true
              }
              var dateDiff = this.timeDifference(DateOnlyCurrent, DateOnlyPrev);
              if (index == this.icwGraphData.length - 1 && count_inc >= 1) {
                final_dp = count_inc;
                graph[count_inc]['x'] = this.icwGraphData[index].x
                graph[count_inc]['y'] = this.icwGraphData[index].y
                graph[count_inc]['color'] = this.icwGraphData[index].color
              }
              if (dateDiff == 0) {
                //Nothing to do
              } else {
                if (diffInHoursForLastStart <= 48) {
                  test_cond = true
                } else {
                  test_cond = false;
                  graph[count_inc]['x'] = this.icwGraphData[index - 1].x
                  graph[count_inc]['y'] = this.icwGraphData[index - 1].y
                  graph[count_inc]['color'] = this.icwGraphData[index - 1].color
                  final_dp = count_inc;
                  count_inc++;
                  if (index == this.icwGraphData.length - 1 && count_inc >= 1 && diffInHoursForLastStart >= 48) {
                    final_dp = count_inc;
                    graph[count_inc]['x'] = this.icwGraphData[index].x
                    graph[count_inc]['y'] = this.icwGraphData[index].y
                    graph[count_inc]['color'] = this.icwGraphData[index].color
                  }
                }
              }
            }
          }
          else {
            if (last90Days <= testTakenDate) {
              if (init2 == 0) {
                var DateOnlyInit = new Date(this.icwGraphData[index].z.slice(0, -10))
                var DateOnlyLast = new Date(this.icwGraphData[this.icwGraphData.length - 1].z.slice(0, -10))
                var diffInTimestampForLast = DateOnlyLast.valueOf() - DateOnlyInit.valueOf()
                var diffInHoursForLastStart = diffInTimestampForLast / 1000 / 60 / 60
              }
              if (diffInHoursForLastStart <= 48) {
                graph[count_inc]['x'] = this.icwGraphData[index].x
                graph[count_inc]['y'] = this.icwGraphData[index].y
                graph[count_inc]['color'] = this.icwGraphData[index].color
                test_cond = true
                count_inc++
              }
              var DateOnly = new Date(this.icwGraphData[index].z.slice(0, -10))
              if (index > 0 && init2 > 0) {
                var DateOnlyPrev = new Date(this.icwGraphData[index - 1].z.slice(0, -10))
                var dateDiff = this.timeDifference(DateOnly, DateOnlyPrev)
                if (index == this.icwGraphData.length - 1 && count_inc >= 1 && diffInHoursForLastStart > 48) {
                  final_dp = count_inc
                  graph[count_inc]['x'] = this.icwGraphData[index].x
                  graph[count_inc]['y'] = this.icwGraphData[index].y
                  graph[count_inc]['color'] = this.icwGraphData[index].color
                }
                if (dateDiff == 0 || diffInHoursForLastStart <= 48) {
                  //Nothing to do
                } else {
                  test_cond = false
                  graph[count_inc]['x'] = this.icwGraphData[index - 1].x
                  graph[count_inc]['y'] = this.icwGraphData[index - 1].y
                  graph[count_inc]['color'] = this.icwGraphData[index - 1].color
                  final_dp = count_inc
                  count_inc++
                  if (index == this.icwGraphData.length - 1 && count_inc >= 1) {
                    final_dp = count_inc
                    graph[count_inc]['x'] = this.icwGraphData[index].x
                    graph[count_inc]['y'] = this.icwGraphData[index].y
                    graph[count_inc]['color'] = this.icwGraphData[index].color
                  }
                }
              }
              init2++
            }
          }
        }
        var beforeDate = null
        var dtArr = []
        var dt = 0
        if (test_cond === true) {
          for (let i = graph.length - 1; i > -1; i--) {
            if (graph[i]['y'] != undefined) {
              dtArr[dt] = graph[i]
              dt++
            }
          }
        } else {
          for (let i = final_dp; i > -1; i--) {
            if (graph[i]['y'] != undefined) {
              dtArr[dt] = graph[i]
              dt++
            }
          }
        }
        if (dtArr.length < 2) {
          $('#icwChartContainer').hide()
          this.showMinimumError = true
          this.loadingMessage = false
        } else {
          $('#icwChartContainer').show()
          this.showMinimumError = false;
        }
        if (test_cond) {
          var chartFor2Days = new CanvasJS.Chart("icwChartContainer",
            {
              toolTip: {
                fontFamily: "'Quicksand', 'sans-serif'",
                borderThickness: "0",
                cornerRadius: 10,
                content: "<span style='\"'color: {color}'\"'>Intra Cellular Water : {y} kg <br>Date : {x}</span>"
              },
              animationEnabled: true,
              animationDuration: 2000,
              axisX: {
                lineThickness: 0,
                tickThickness: 0,
                gridColor: "Silver",
                valueFormatString: "DD/MMM hh TT",
                labelFontSize: 12,
                labelFontWeight: "bold",
                labelFontColor: "#808080",
                labelFontFamily: "'Quicksand', 'sans-serif'"
              },
              axisY: {
                maximum: 120,
                lineThickness: 0,
                tickThickness: 0,
                gridThickness: 0,
                labelFontSize: 12,
                labelFontWeight: "bold",
                labelFontColor: "#808080",
                labelFontFamily: "'Quicksand', 'sans-serif'",
                includeZero: false
              },
              legend: {
                fontSize: 15,
                fontFamily: "'Quicksand', 'sans-serif'",
                fontColor: "#808080"
              },
              data: [
                {
                  type: "splineArea",
                  showInLegend: true,
                  legendText: "Low",
                  legendMarkerType: "square",
                  legendMarkerColor: "#ff9800",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                {
                  type: "splineArea",
                  showInLegend: true,
                  legendText: "Normal",
                  legendMarkerType: "square",
                  legendMarkerColor: "#43A047",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                {
                  type: "splineArea",
                  showInLegend: true,
                  legendText: "High",
                  legendMarkerType: "square",
                  legendMarkerColor: "#d32f2f",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                {
                  type: "splineArea",
                  lineThickness: 2,
                  lineColor: "#4885ed",
                  fillOpacity: 0.1,
                  markerSize: 10,
                  dataPoints: dtArr
                }
              ]
            })
          setTimeout(() => {
            this.loadingMessage = false
            chartFor2Days.render()
          }, 2000)
        }
        else {
          var icwChart = new CanvasJS.Chart("icwChartContainer",
            {
              toolTip: {
                fontFamily: "'Quicksand', 'sans-serif'",
                borderThickness: "0",
                cornerRadius: 10,
                content: "<span style='\"'color: {color}'\"'>Intra Cellular Water : {y} kg <br>Date : {x}</span>"
              },
              animationEnabled: true,
              animationDuration: 2000,
              axisX: {
                lineThickness: 0,
                tickThickness: 0,
                gridColor: "Silver",
                valueFormatString: "DD/MMM",
                labelFontSize: 12,
                labelFontWeight: "bold",
                labelFontColor: "#808080",
                labelFontFamily: "'Quicksand', 'sans-serif'"
              },
              axisY: {
                maximum: 120,
                lineThickness: 0,
                tickThickness: 0,
                gridThickness: 0,
                labelFontSize: 12,
                labelFontWeight: "bold",
                labelFontColor: "#808080",
                labelFontFamily: "'Quicksand', 'sans-serif'",
                includeZero: false
              },
              legend: {
                fontSize: 15,
                fontFamily: "'Quicksand', 'sans-serif'",
                fontColor: "#808080"
              },
              data: [
                {
                  type: "splineArea",
                  showInLegend: true,
                  legendText: "Low",
                  legendMarkerType: "square",
                  legendMarkerColor: "#ff9800",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                {
                  type: "splineArea",
                  showInLegend: true,
                  legendText: "Normal",
                  legendMarkerType: "square",
                  legendMarkerColor: "#43A047",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                {
                  type: "splineArea",
                  showInLegend: true,
                  legendText: "High",
                  legendMarkerType: "square",
                  legendMarkerColor: "#d32f2f",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                {
                  type: "splineArea",
                  lineThickness: 2,
                  lineColor: "#4885ed",
                  fillOpacity: 0.1,
                  markerSize: 10,
                  dataPoints: dtArr
                }
              ]
            })
          setTimeout(() => {
            this.loadingMessage = false
            icwChart.render()
          }, 3000)
        }
      }
    }

    if (this.testType == "Mineral") {
      if (this.mineralGraphData.length < 2) {
        this.showMinimumError = true
        this.loadingMessage = false
      }
      else {
        this.showMinimumError = false
        for (let index = 0, count_inc = 0, init2 = 0; this.mineralGraphData.length > index; index++) {
          graph[index] = {}
          if (GraphPeriod !== "showAllDays") {
            var testTakenDate = this.mineralGraphData[index].x
          }
          if (index == 0) {
            if (GraphPeriod === "showAllDays") {
              var DateOnlyInit = new Date(this.mineralGraphData[index].z.slice(0, -10))
            }
          }
          if (GraphPeriod === "showAllDays") {
            if (index > 0) {
              var DateOnlyPrev = new Date(this.mineralGraphData[index - 1].z.slice(0, -10))
              var DateOnlyCurrent = new Date(this.mineralGraphData[index].z.slice(0, -10))
              var DateOnlyLast = new Date(this.mineralGraphData[this.mineralGraphData.length - 1].z.slice(0, -10))
              var diffInTimestampForLast = DateOnlyLast.valueOf() - DateOnlyInit.valueOf()
              var diffInHoursForLastStart = diffInTimestampForLast / 1000 / 60 / 60
              if (diffInHoursForLastStart <= 48) {
                graph[index - 1]['x'] = this.mineralGraphData[index - 1].x
                graph[index - 1]['y'] = this.mineralGraphData[index - 1].y
                graph[index - 1]['color'] = this.mineralGraphData[index - 1].color
                graph[index]['x'] = this.mineralGraphData[index].x
                graph[index]['y'] = this.mineralGraphData[index].y
                graph[index]['color'] = this.mineralGraphData[index].color
                test_cond = true
              }
              var dateDiff = this.timeDifference(DateOnlyCurrent, DateOnlyPrev);
              if (index == this.mineralGraphData.length - 1 && count_inc >= 1) {
                final_dp = count_inc;
                graph[count_inc]['x'] = this.mineralGraphData[index].x
                graph[count_inc]['y'] = this.mineralGraphData[index].y
                graph[count_inc]['color'] = this.mineralGraphData[index].color
              }
              if (dateDiff == 0) {
                //Nothing to do
              } else {
                if (diffInHoursForLastStart <= 48) {
                  test_cond = true
                } else {
                  test_cond = false;
                  graph[count_inc]['x'] = this.mineralGraphData[index - 1].x
                  graph[count_inc]['y'] = this.mineralGraphData[index - 1].y
                  graph[count_inc]['color'] = this.mineralGraphData[index - 1].color
                  final_dp = count_inc;
                  count_inc++;
                  if (index == this.mineralGraphData.length - 1 && count_inc >= 1 && diffInHoursForLastStart >= 48) {
                    final_dp = count_inc;
                    graph[count_inc]['x'] = this.mineralGraphData[index].x
                    graph[count_inc]['y'] = this.mineralGraphData[index].y
                    graph[count_inc]['color'] = this.mineralGraphData[index].color
                  }
                }
              }
            }
          }
          else {
            if (last90Days <= testTakenDate) {
              if (init2 == 0) {
                var DateOnlyInit = new Date(this.mineralGraphData[index].z.slice(0, -10))
                var DateOnlyLast = new Date(this.mineralGraphData[this.mineralGraphData.length - 1].z.slice(0, -10))
                var diffInTimestampForLast = DateOnlyLast.valueOf() - DateOnlyInit.valueOf()
                var diffInHoursForLastStart = diffInTimestampForLast / 1000 / 60 / 60
              }
              if (diffInHoursForLastStart <= 48) {
                graph[count_inc]['x'] = this.mineralGraphData[index].x
                graph[count_inc]['y'] = this.mineralGraphData[index].y
                graph[count_inc]['color'] = this.mineralGraphData[index].color
                test_cond = true
                count_inc++
              }
              var DateOnly = new Date(this.mineralGraphData[index].z.slice(0, -10))
              if (index > 0 && init2 > 0) {
                var DateOnlyPrev = new Date(this.mineralGraphData[index - 1].z.slice(0, -10))
                var dateDiff = this.timeDifference(DateOnly, DateOnlyPrev)
                if (index == this.mineralGraphData.length - 1 && count_inc >= 1 && diffInHoursForLastStart > 48) {
                  final_dp = count_inc
                  graph[count_inc]['x'] = this.mineralGraphData[index].x
                  graph[count_inc]['y'] = this.mineralGraphData[index].y
                  graph[count_inc]['color'] = this.mineralGraphData[index].color
                }
                if (dateDiff == 0 || diffInHoursForLastStart <= 48) {
                  //Nothing to do
                } else {
                  test_cond = false
                  graph[count_inc]['x'] = this.mineralGraphData[index - 1].x
                  graph[count_inc]['y'] = this.mineralGraphData[index - 1].y
                  graph[count_inc]['color'] = this.mineralGraphData[index - 1].color
                  final_dp = count_inc
                  count_inc++
                  if (index == this.mineralGraphData.length - 1 && count_inc >= 1) {
                    final_dp = count_inc
                    graph[count_inc]['x'] = this.mineralGraphData[index].x
                    graph[count_inc]['y'] = this.mineralGraphData[index].y
                    graph[count_inc]['color'] = this.mineralGraphData[index].color
                  }
                }
              }
              init2++
            }
          }
        }
        var beforeDate = null
        var dtArr = []
        var dt = 0
        if (test_cond === true) {
          for (let i = graph.length - 1; i > -1; i--) {
            if (graph[i]['y'] != undefined) {
              dtArr[dt] = graph[i]
              dt++
            }
          }
        } else {
          for (let i = final_dp; i > -1; i--) {
            if (graph[i]['y'] != undefined) {
              dtArr[dt] = graph[i]
              dt++
            }
          }
        }
        if (dtArr.length < 2) {
          $('#mineralChartContainer').hide()
          this.showMinimumError = true
          this.loadingMessage = false
        } else {
          $('#mineralChartContainer').show()
          this.showMinimumError = false;
        }
        if (test_cond) {
          var chartFor2Days = new CanvasJS.Chart("mineralChartContainer",
            {
              toolTip: {
                fontFamily: "'Quicksand', 'sans-serif'",
                borderThickness: "0",
                cornerRadius: 10,
                content: "<span style='\"'color: {color}'\"'>Mineral : {y} kg <br>Date : {x}</span>"
              },
              animationEnabled: true,
              animationDuration: 2000,
              axisX: {
                lineThickness: 0,
                tickThickness: 0,
                gridColor: "Silver",
                valueFormatString: "DD/MMM hh TT",
                labelFontSize: 12,
                labelFontWeight: "bold",
                labelFontColor: "#808080",
                labelFontFamily: "'Quicksand', 'sans-serif'"
              },
              axisY: {
                maximum: 10,
                lineThickness: 0,
                tickThickness: 0,
                gridThickness: 0,
                labelFontSize: 12,
                labelFontWeight: "bold",
                labelFontColor: "#808080",
                labelFontFamily: "'Quicksand', 'sans-serif'",
                includeZero: false
              },
              legend: {
                fontSize: 15,
                fontFamily: "'Quicksand', 'sans-serif'",
                fontColor: "#808080"
              },
              data: [
                {
                  type: "splineArea",
                  showInLegend: true,
                  legendText: "Low",
                  legendMarkerType: "square",
                  legendMarkerColor: "#ff9800",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                {
                  type: "splineArea",
                  showInLegend: true,
                  legendText: "Normal",
                  legendMarkerType: "square",
                  legendMarkerColor: "#43A047",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                // {
                //   type: "splineArea",
                //   showInLegend: true,
                //   legendText: "High",
                //   legendMarkerType: "square",
                //   legendMarkerColor: "#d32f2f",
                //   fillOpacity: 0,
                //   lineThickness: 0,
                //   markerSize: 0,
                //   dataPoints: dtArr
                // },
                {
                  type: "splineArea",
                  lineThickness: 2,
                  lineColor: "#4885ed",
                  fillOpacity: 0.1,
                  markerSize: 10,
                  dataPoints: dtArr
                }
              ]
            })
          setTimeout(() => {
            this.loadingMessage = false
            chartFor2Days.render()
          }, 2000)
        }
        else {
          var mineralChart = new CanvasJS.Chart("mineralChartContainer",
            {
              toolTip: {
                fontFamily: "'Quicksand', 'sans-serif'",
                borderThickness: "0",
                cornerRadius: 10,
                content: "<span style='\"'color: {color}'\"'>Mineral : {y} kg <br>Date : {x}</span>"
              },
              animationEnabled: true,
              animationDuration: 2000,
              axisX: {
                lineThickness: 0,
                tickThickness: 0,
                gridColor: "Silver",
                valueFormatString: "DD/MMM",
                labelFontSize: 12,
                labelFontWeight: "bold",
                labelFontColor: "#808080",
                labelFontFamily: "'Quicksand', 'sans-serif'"
              },
              axisY: {
                maximum: 10,
                lineThickness: 0,
                tickThickness: 0,
                gridThickness: 0,
                labelFontSize: 12,
                labelFontWeight: "bold",
                labelFontColor: "#808080",
                labelFontFamily: "'Quicksand', 'sans-serif'",
                includeZero: false
              },
              legend: {
                fontSize: 15,
                fontFamily: "'Quicksand', 'sans-serif'",
                fontColor: "#808080"
              },
              data: [
                {
                  type: "splineArea",
                  showInLegend: true,
                  legendText: "Low",
                  legendMarkerType: "square",
                  legendMarkerColor: "#ff9800",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                {
                  type: "splineArea",
                  showInLegend: true,
                  legendText: "Normal",
                  legendMarkerType: "square",
                  legendMarkerColor: "#43A047",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                // {
                //   type: "splineArea",
                //   showInLegend: true,
                //   legendText: "High",
                //   legendMarkerType: "square",
                //   legendMarkerColor: "#d32f2f",
                //   fillOpacity: 0,
                //   lineThickness: 0,
                //   markerSize: 0,
                //   dataPoints: dtArr
                // },
                {
                  type: "splineArea",
                  lineThickness: 2,
                  lineColor: "#4885ed",
                  fillOpacity: 0.1,
                  markerSize: 10,
                  dataPoints: dtArr
                }
              ]
            })
          setTimeout(() => {
            this.loadingMessage = false
            mineralChart.render()
          }, 3000)
        }
      }
    }

    if (this.testType == "Skeletal Muscle Mass") {
      if (this.smmGraphData.length < 2) {
        this.showMinimumError = true
        this.loadingMessage = false
      }
      else {
        this.showMinimumError = false
        for (let index = 0, count_inc = 0, init2 = 0; this.smmGraphData.length > index; index++) {
          graph[index] = {}
          if (GraphPeriod !== "showAllDays") {
            var testTakenDate = this.smmGraphData[index].x
          }
          if (index == 0) {
            if (GraphPeriod === "showAllDays") {
              var DateOnlyInit = new Date(this.smmGraphData[index].z.slice(0, -10))
            }
          }
          if (GraphPeriod === "showAllDays") {
            if (index > 0) {
              var DateOnlyPrev = new Date(this.smmGraphData[index - 1].z.slice(0, -10))
              var DateOnlyCurrent = new Date(this.smmGraphData[index].z.slice(0, -10))
              var DateOnlyLast = new Date(this.smmGraphData[this.smmGraphData.length - 1].z.slice(0, -10))
              var diffInTimestampForLast = DateOnlyLast.valueOf() - DateOnlyInit.valueOf()
              var diffInHoursForLastStart = diffInTimestampForLast / 1000 / 60 / 60
              if (diffInHoursForLastStart <= 48) {
                graph[index - 1]['x'] = this.smmGraphData[index - 1].x
                graph[index - 1]['y'] = this.smmGraphData[index - 1].y
                graph[index - 1]['color'] = this.smmGraphData[index - 1].color
                graph[index]['x'] = this.smmGraphData[index].x
                graph[index]['y'] = this.smmGraphData[index].y
                graph[index]['color'] = this.smmGraphData[index].color
                test_cond = true
              }
              var dateDiff = this.timeDifference(DateOnlyCurrent, DateOnlyPrev);
              if (index == this.smmGraphData.length - 1 && count_inc >= 1) {
                final_dp = count_inc;
                graph[count_inc]['x'] = this.smmGraphData[index].x
                graph[count_inc]['y'] = this.smmGraphData[index].y
                graph[count_inc]['color'] = this.smmGraphData[index].color
              }
              if (dateDiff == 0) {
                //Nothing to do
              } else {
                if (diffInHoursForLastStart <= 48) {
                  test_cond = true
                } else {
                  test_cond = false;
                  graph[count_inc]['x'] = this.smmGraphData[index - 1].x
                  graph[count_inc]['y'] = this.smmGraphData[index - 1].y
                  graph[count_inc]['color'] = this.smmGraphData[index - 1].color
                  final_dp = count_inc;
                  count_inc++;
                  if (index == this.smmGraphData.length - 1 && count_inc >= 1 && diffInHoursForLastStart >= 48) {
                    final_dp = count_inc;
                    graph[count_inc]['x'] = this.smmGraphData[index].x
                    graph[count_inc]['y'] = this.smmGraphData[index].y
                    graph[count_inc]['color'] = this.smmGraphData[index].color
                  }
                }
              }
            }
          }
          else {
            if (last90Days <= testTakenDate) {
              if (init2 == 0) {
                var DateOnlyInit = new Date(this.smmGraphData[index].z.slice(0, -10))
                var DateOnlyLast = new Date(this.smmGraphData[this.smmGraphData.length - 1].z.slice(0, -10))
                var diffInTimestampForLast = DateOnlyLast.valueOf() - DateOnlyInit.valueOf()
                var diffInHoursForLastStart = diffInTimestampForLast / 1000 / 60 / 60
              }
              if (diffInHoursForLastStart <= 48) {
                graph[count_inc]['x'] = this.smmGraphData[index].x
                graph[count_inc]['y'] = this.smmGraphData[index].y
                graph[count_inc]['color'] = this.smmGraphData[index].color
                test_cond = true
                count_inc++
              }
              var DateOnly = new Date(this.smmGraphData[index].z.slice(0, -10))
              if (index > 0 && init2 > 0) {
                var DateOnlyPrev = new Date(this.smmGraphData[index - 1].z.slice(0, -10))
                var dateDiff = this.timeDifference(DateOnly, DateOnlyPrev)
                if (index == this.smmGraphData.length - 1 && count_inc >= 1 && diffInHoursForLastStart > 48) {
                  final_dp = count_inc
                  graph[count_inc]['x'] = this.smmGraphData[index].x
                  graph[count_inc]['y'] = this.smmGraphData[index].y
                  graph[count_inc]['color'] = this.smmGraphData[index].color
                }
                if (dateDiff == 0 || diffInHoursForLastStart <= 48) {
                  //Nothing to do
                } else {
                  test_cond = false
                  graph[count_inc]['x'] = this.smmGraphData[index - 1].x
                  graph[count_inc]['y'] = this.smmGraphData[index - 1].y
                  graph[count_inc]['color'] = this.smmGraphData[index - 1].color
                  final_dp = count_inc
                  count_inc++
                  if (index == this.smmGraphData.length - 1 && count_inc >= 1) {
                    final_dp = count_inc
                    graph[count_inc]['x'] = this.smmGraphData[index].x
                    graph[count_inc]['y'] = this.smmGraphData[index].y
                    graph[count_inc]['color'] = this.smmGraphData[index].color
                  }
                }
              }
              init2++
            }
          }
        }
        var beforeDate = null
        var dtArr = []
        var dt = 0
        if (test_cond === true) {
          for (let i = graph.length - 1; i > -1; i--) {
            if (graph[i]['y'] != undefined) {
              dtArr[dt] = graph[i]
              dt++
            }
          }
        } else {
          for (let i = final_dp; i > -1; i--) {
            if (graph[i]['y'] != undefined) {
              dtArr[dt] = graph[i]
              dt++
            }
          }
        }
        if (dtArr.length < 2) {
          $('#smmChartContainer').hide()
          this.showMinimumError = true
          this.loadingMessage = false
        } else {
          $('#smmChartContainer').show()
          this.showMinimumError = false;
        }
        if (test_cond) {
          var chartFor2Days = new CanvasJS.Chart("smmChartContainer",
            {
              toolTip: {
                fontFamily: "'Quicksand', 'sans-serif'",
                borderThickness: "0",
                cornerRadius: 10,
                content: "<span style='\"'color: {color}'\"'>Skeletal Muscle Mass : {y} kg <br>Date : {x}</span>"
              },
              animationEnabled: true,
              animationDuration: 2000,
              axisX: {
                lineThickness: 0,
                tickThickness: 0,
                gridColor: "Silver",
                valueFormatString: "DD/MMM hh TT",
                labelFontSize: 12,
                labelFontWeight: "bold",
                labelFontColor: "#808080",
                labelFontFamily: "'Quicksand', 'sans-serif'"
              },
              axisY: {
                maximum: 70,
                lineThickness: 0,
                tickThickness: 0,
                gridThickness: 0,
                labelFontSize: 12,
                labelFontWeight: "bold",
                labelFontColor: "#808080",
                labelFontFamily: "'Quicksand', 'sans-serif'",
                includeZero: false
              },
              legend: {
                fontSize: 15,
                fontFamily: "'Quicksand', 'sans-serif'",
                fontColor: "#808080"
              },
              data: [
                {
                  type: "splineArea",
                  showInLegend: true,
                  legendText: "Low",
                  legendMarkerType: "square",
                  legendMarkerColor: "#ff9800",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                {
                  type: "splineArea",
                  showInLegend: true,
                  legendText: "Normal",
                  legendMarkerType: "square",
                  legendMarkerColor: "#43A047",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                {
                  type: "splineArea",
                  lineThickness: 2,
                  lineColor: "#4885ed",
                  fillOpacity: 0.1,
                  markerSize: 10,
                  dataPoints: dtArr
                }
              ]
            })
          setTimeout(() => {
            this.loadingMessage = false
            chartFor2Days.render()
          }, 2000)
        }
        else {
          var smmChart = new CanvasJS.Chart("smmChartContainer",
            {
              toolTip: {
                fontFamily: "'Quicksand', 'sans-serif'",
                borderThickness: "0",
                cornerRadius: 10,
                content: "<span style='\"'color: {color}'\"'>Skeletal Muscle Mass : {y} kg <br>Date : {x}</span>"
              },
              animationEnabled: true,
              animationDuration: 2000,
              axisX: {
                lineThickness: 0,
                tickThickness: 0,
                gridColor: "Silver",
                valueFormatString: "DD/MMM",
                labelFontSize: 12,
                labelFontWeight: "bold",
                labelFontColor: "#808080",
                labelFontFamily: "'Quicksand', 'sans-serif'"
              },
              axisY: {
                maximum: 70,
                lineThickness: 0,
                tickThickness: 0,
                gridThickness: 0,
                labelFontSize: 12,
                labelFontWeight: "bold",
                labelFontColor: "#808080",
                labelFontFamily: "'Quicksand', 'sans-serif'",
                includeZero: false
              },
              legend: {
                fontSize: 15,
                fontFamily: "'Quicksand', 'sans-serif'",
                fontColor: "#808080"
              },
              data: [
                {
                  type: "splineArea",
                  showInLegend: true,
                  legendText: "Low",
                  legendMarkerType: "square",
                  legendMarkerColor: "#ff9800",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                {
                  type: "splineArea",
                  showInLegend: true,
                  legendText: "Normal",
                  legendMarkerType: "square",
                  legendMarkerColor: "#43A047",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                {
                  type: "splineArea",
                  lineThickness: 2,
                  lineColor: "#4885ed",
                  fillOpacity: 0.1,
                  markerSize: 10,
                  dataPoints: dtArr
                }
              ]
            })
          setTimeout(() => {
            this.loadingMessage = false
            smmChart.render()
          }, 3000)
        }
      }
    }

    if (this.testType == "Body Fat Mass") {
      if (this.bfmGraphData.length < 2) {
        this.showMinimumError = true
        this.loadingMessage = false
      }
      else {
        this.showMinimumError = false
        for (let index = 0, count_inc = 0, init2 = 0; this.bfmGraphData.length > index; index++) {
          graph[index] = {}
          if (GraphPeriod !== "showAllDays") {
            var testTakenDate = this.bfmGraphData[index].x
          }
          if (index == 0) {
            if (GraphPeriod === "showAllDays") {
              var DateOnlyInit = new Date(this.bfmGraphData[index].z.slice(0, -10))
            }
          }
          if (GraphPeriod === "showAllDays") {
            if (index > 0) {
              var DateOnlyPrev = new Date(this.bfmGraphData[index - 1].z.slice(0, -10))
              var DateOnlyCurrent = new Date(this.bfmGraphData[index].z.slice(0, -10))
              var DateOnlyLast = new Date(this.bfmGraphData[this.bfmGraphData.length - 1].z.slice(0, -10))
              var diffInTimestampForLast = DateOnlyLast.valueOf() - DateOnlyInit.valueOf()
              var diffInHoursForLastStart = diffInTimestampForLast / 1000 / 60 / 60
              if (diffInHoursForLastStart <= 48) {
                graph[index - 1]['x'] = this.bfmGraphData[index - 1].x
                graph[index - 1]['y'] = this.bfmGraphData[index - 1].y
                graph[index - 1]['color'] = this.bfmGraphData[index - 1].color
                graph[index]['x'] = this.bfmGraphData[index].x
                graph[index]['y'] = this.bfmGraphData[index].y
                graph[index]['color'] = this.bfmGraphData[index].color
                test_cond = true
              }
              var dateDiff = this.timeDifference(DateOnlyCurrent, DateOnlyPrev);
              if (index == this.bfmGraphData.length - 1 && count_inc >= 1) {
                final_dp = count_inc;
                graph[count_inc]['x'] = this.bfmGraphData[index].x
                graph[count_inc]['y'] = this.bfmGraphData[index].y
                graph[count_inc]['color'] = this.bfmGraphData[index].color
              }
              if (dateDiff == 0) {
                //Nothing to do
              } else {
                if (diffInHoursForLastStart <= 48) {
                  test_cond = true
                } else {
                  test_cond = false;
                  graph[count_inc]['x'] = this.bfmGraphData[index - 1].x
                  graph[count_inc]['y'] = this.bfmGraphData[index - 1].y
                  graph[count_inc]['color'] = this.bfmGraphData[index - 1].color
                  final_dp = count_inc;
                  count_inc++;
                  if (index == this.bfmGraphData.length - 1 && count_inc >= 1 && diffInHoursForLastStart >= 48) {
                    final_dp = count_inc;
                    graph[count_inc]['x'] = this.bfmGraphData[index].x
                    graph[count_inc]['y'] = this.bfmGraphData[index].y
                    graph[count_inc]['color'] = this.bfmGraphData[index].color
                  }
                }
              }
            }
          }
          else {
            if (last90Days <= testTakenDate) {
              if (init2 == 0) {
                var DateOnlyInit = new Date(this.bfmGraphData[index].z.slice(0, -10))
                var DateOnlyLast = new Date(this.bfmGraphData[this.bfmGraphData.length - 1].z.slice(0, -10))
                var diffInTimestampForLast = DateOnlyLast.valueOf() - DateOnlyInit.valueOf()
                var diffInHoursForLastStart = diffInTimestampForLast / 1000 / 60 / 60
              }
              if (diffInHoursForLastStart <= 48) {
                graph[count_inc]['x'] = this.bfmGraphData[index].x
                graph[count_inc]['y'] = this.bfmGraphData[index].y
                graph[count_inc]['color'] = this.bfmGraphData[index].color
                test_cond = true
                count_inc++
              }
              var DateOnly = new Date(this.bfmGraphData[index].z.slice(0, -10))
              if (index > 0 && init2 > 0) {
                var DateOnlyPrev = new Date(this.bfmGraphData[index - 1].z.slice(0, -10))
                var dateDiff = this.timeDifference(DateOnly, DateOnlyPrev)
                if (index == this.bfmGraphData.length - 1 && count_inc >= 1 && diffInHoursForLastStart > 48) {
                  final_dp = count_inc
                  graph[count_inc]['x'] = this.bfmGraphData[index].x
                  graph[count_inc]['y'] = this.bfmGraphData[index].y
                  graph[count_inc]['color'] = this.bfmGraphData[index].color
                }
                if (dateDiff == 0 || diffInHoursForLastStart <= 48) {
                  //Nothing to do
                } else {
                  test_cond = false
                  graph[count_inc]['x'] = this.bfmGraphData[index - 1].x
                  graph[count_inc]['y'] = this.bfmGraphData[index - 1].y
                  graph[count_inc]['color'] = this.bfmGraphData[index - 1].color
                  final_dp = count_inc
                  count_inc++
                  if (index == this.bfmGraphData.length - 1 && count_inc >= 1) {
                    final_dp = count_inc
                    graph[count_inc]['x'] = this.bfmGraphData[index].x
                    graph[count_inc]['y'] = this.bfmGraphData[index].y
                    graph[count_inc]['color'] = this.bfmGraphData[index].color
                  }
                }
              }
              init2++
            }
          }
        }
        var beforeDate = null
        var dtArr = []
        var dt = 0
        if (test_cond === true) {
          for (let i = graph.length - 1; i > -1; i--) {
            if (graph[i]['y'] != undefined) {
              dtArr[dt] = graph[i]
              dt++
            }
          }
        } else {
          for (let i = final_dp; i > -1; i--) {
            if (graph[i]['y'] != undefined) {
              dtArr[dt] = graph[i]
              dt++
            }
          }
        }
        if (dtArr.length < 2) {
          $('#bfmChartContainer').hide()
          this.showMinimumError = true
          this.loadingMessage = false
        } else {
          $('#bfmChartContainer').show()
          this.showMinimumError = false;
        }
        if (test_cond) {
          var chartFor2Days = new CanvasJS.Chart("bfmChartContainer",
            {
              toolTip: {
                fontFamily: "'Quicksand', 'sans-serif'",
                borderThickness: "0",
                cornerRadius: 10,
                content: "<span style='\"'color: {color}'\"'>Body Fat Mass : {y} kg <br>Date : {x}</span>"
              },
              animationEnabled: true,
              animationDuration: 2000,
              axisX: {
                lineThickness: 0,
                tickThickness: 0,
                gridColor: "Silver",
                valueFormatString: "DD/MMM hh TT",
                labelFontSize: 12,
                labelFontWeight: "bold",
                labelFontColor: "#808080",
                labelFontFamily: "'Quicksand', 'sans-serif'"
              },
              axisY: {
                maximum: 120,
                lineThickness: 0,
                tickThickness: 0,
                gridThickness: 0,
                labelFontSize: 12,
                labelFontWeight: "bold",
                labelFontColor: "#808080",
                labelFontFamily: "'Quicksand', 'sans-serif'",
                includeZero: false
              },
              legend: {
                fontSize: 15,
                fontFamily: "'Quicksand', 'sans-serif'",
                fontColor: "#808080"
              },
              data: [
                {
                  type: "splineArea",
                  showInLegend: true,
                  legendText: "Low",
                  legendMarkerType: "square",
                  legendMarkerColor: "#ff9800",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                {
                  type: "splineArea",
                  showInLegend: true,
                  legendText: "Normal",
                  legendMarkerType: "square",
                  legendMarkerColor: "#43A047",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                {
                  type: "splineArea",
                  showInLegend: true,
                  legendText: "Acceptable",
                  legendMarkerType: "square",
                  legendMarkerColor: "#ff5722",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                {
                  type: "splineArea",
                  showInLegend: true,
                  legendText: "High",
                  legendMarkerType: "square",
                  legendMarkerColor: "#d32f2f",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                {
                  type: "splineArea",
                  lineThickness: 2,
                  lineColor: "#4885ed",
                  fillOpacity: 0.1,
                  markerSize: 10,
                  dataPoints: dtArr
                }
              ]
            })
          setTimeout(() => {
            this.loadingMessage = false
            chartFor2Days.render()
          }, 2000)
        }
        else {
          var bfmChart = new CanvasJS.Chart("bfmChartContainer",
            {
              toolTip: {
                fontFamily: "'Quicksand', 'sans-serif'",
                borderThickness: "0",
                cornerRadius: 10,
                content: "<span style='\"'color: {color}'\"'>Body Fat Mass : {y} kg <br>Date : {x}</span>"
              },
              animationEnabled: true,
              animationDuration: 2000,
              axisX: {
                lineThickness: 0,
                tickThickness: 0,
                gridColor: "Silver",
                valueFormatString: "DD/MMM",
                labelFontSize: 12,
                labelFontWeight: "bold",
                labelFontColor: "#808080",
                labelFontFamily: "'Quicksand', 'sans-serif'"
              },
              axisY: {
                maximum: 120,
                lineThickness: 0,
                tickThickness: 0,
                gridThickness: 0,
                labelFontSize: 12,
                labelFontWeight: "bold",
                labelFontColor: "#808080",
                labelFontFamily: "'Quicksand', 'sans-serif'",
                includeZero: false
              },
              legend: {
                fontSize: 15,
                fontFamily: "'Quicksand', 'sans-serif'",
                fontColor: "#808080"
              },
              data: [
                {
                  type: "splineArea",
                  showInLegend: true,
                  legendText: "Low",
                  legendMarkerType: "square",
                  legendMarkerColor: "#ff9800",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                {
                  type: "splineArea",
                  showInLegend: true,
                  legendText: "Normal",
                  legendMarkerType: "square",
                  legendMarkerColor: "#43A047",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                {
                  type: "splineArea",
                  showInLegend: true,
                  legendText: "Acceptable",
                  legendMarkerType: "square",
                  legendMarkerColor: "#ff5722",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                {
                  type: "splineArea",
                  showInLegend: true,
                  legendText: "High",
                  legendMarkerType: "square",
                  legendMarkerColor: "#d32f2f",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                {
                  type: "splineArea",
                  lineThickness: 2,
                  lineColor: "#4885ed",
                  fillOpacity: 0.1,
                  markerSize: 10,
                  dataPoints: dtArr
                }
              ]
            })
          setTimeout(() => {
            this.loadingMessage = false
            bfmChart.render()
          }, 3000)
        }
      }
    }

    if (this.testType == "Waist/Hip Ratio") {
      if (this.whprGraphData.length < 2) {
        this.showMinimumError = true
        this.loadingMessage = false
      }
      else {
        this.showMinimumError = false
        for (let index = 0, count_inc = 0, init2 = 0; this.whprGraphData.length > index; index++) {
          graph[index] = {}
          if (GraphPeriod !== "showAllDays") {
            var testTakenDate = this.whprGraphData[index].x
          }
          if (index == 0) {
            if (GraphPeriod === "showAllDays") {
              var DateOnlyInit = new Date(this.whprGraphData[index].z.slice(0, -10))
            }
          }
          if (GraphPeriod === "showAllDays") {
            if (index > 0) {
              var DateOnlyPrev = new Date(this.whprGraphData[index - 1].z.slice(0, -10))
              var DateOnlyCurrent = new Date(this.whprGraphData[index].z.slice(0, -10))
              var DateOnlyLast = new Date(this.whprGraphData[this.whprGraphData.length - 1].z.slice(0, -10))
              var diffInTimestampForLast = DateOnlyLast.valueOf() - DateOnlyInit.valueOf()
              var diffInHoursForLastStart = diffInTimestampForLast / 1000 / 60 / 60
              if (diffInHoursForLastStart <= 48) {
                graph[index - 1]['x'] = this.whprGraphData[index - 1].x
                graph[index - 1]['y'] = this.whprGraphData[index - 1].y
                graph[index - 1]['color'] = this.whprGraphData[index - 1].color
                graph[index]['x'] = this.whprGraphData[index].x
                graph[index]['y'] = this.whprGraphData[index].y
                graph[index]['color'] = this.whprGraphData[index].color
                test_cond = true
              }
              var dateDiff = this.timeDifference(DateOnlyCurrent, DateOnlyPrev);
              if (index == this.whprGraphData.length - 1 && count_inc >= 1) {
                final_dp = count_inc;
                graph[count_inc]['x'] = this.whprGraphData[index].x
                graph[count_inc]['y'] = this.whprGraphData[index].y
                graph[count_inc]['color'] = this.whprGraphData[index].color
              }
              if (dateDiff == 0) {
                //Nothing to do
              } else {
                if (diffInHoursForLastStart <= 48) {
                  test_cond = true
                } else {
                  test_cond = false;
                  graph[count_inc]['x'] = this.whprGraphData[index - 1].x
                  graph[count_inc]['y'] = this.whprGraphData[index - 1].y
                  graph[count_inc]['color'] = this.whprGraphData[index - 1].color
                  final_dp = count_inc;
                  count_inc++;
                  if (index == this.whprGraphData.length - 1 && count_inc >= 1 && diffInHoursForLastStart >= 48) {
                    final_dp = count_inc;
                    graph[count_inc]['x'] = this.whprGraphData[index].x
                    graph[count_inc]['y'] = this.whprGraphData[index].y
                    graph[count_inc]['color'] = this.whprGraphData[index].color
                  }
                }
              }
            }
          }
          else {
            if (last90Days <= testTakenDate) {
              if (init2 == 0) {
                var DateOnlyInit = new Date(this.whprGraphData[index].z.slice(0, -10))
                var DateOnlyLast = new Date(this.whprGraphData[this.whprGraphData.length - 1].z.slice(0, -10))
                var diffInTimestampForLast = DateOnlyLast.valueOf() - DateOnlyInit.valueOf()
                var diffInHoursForLastStart = diffInTimestampForLast / 1000 / 60 / 60
              }
              if (diffInHoursForLastStart <= 48) {
                graph[count_inc]['x'] = this.whprGraphData[index].x
                graph[count_inc]['y'] = this.whprGraphData[index].y
                graph[count_inc]['color'] = this.whprGraphData[index].color
                test_cond = true
                count_inc++
              }
              var DateOnly = new Date(this.whprGraphData[index].z.slice(0, -10))
              if (index > 0 && init2 > 0) {
                var DateOnlyPrev = new Date(this.whprGraphData[index - 1].z.slice(0, -10))
                var dateDiff = this.timeDifference(DateOnly, DateOnlyPrev)
                if (index == this.whprGraphData.length - 1 && count_inc >= 1 && diffInHoursForLastStart > 48) {
                  final_dp = count_inc
                  graph[count_inc]['x'] = this.whprGraphData[index].x
                  graph[count_inc]['y'] = this.whprGraphData[index].y
                  graph[count_inc]['color'] = this.whprGraphData[index].color
                }
                if (dateDiff == 0 || diffInHoursForLastStart <= 48) {
                  //Nothing to do
                } else {
                  test_cond = false
                  graph[count_inc]['x'] = this.whprGraphData[index - 1].x
                  graph[count_inc]['y'] = this.whprGraphData[index - 1].y
                  graph[count_inc]['color'] = this.whprGraphData[index - 1].color
                  final_dp = count_inc
                  count_inc++
                  if (index == this.whprGraphData.length - 1 && count_inc >= 1) {
                    final_dp = count_inc
                    graph[count_inc]['x'] = this.whprGraphData[index].x
                    graph[count_inc]['y'] = this.whprGraphData[index].y
                    graph[count_inc]['color'] = this.whprGraphData[index].color
                  }
                }
              }
              init2++
            }
          }
        }
        var beforeDate = null
        var dtArr = []
        var dt = 0
        if (test_cond === true) {
          for (let i = graph.length - 1; i > -1; i--) {
            if (graph[i]['y'] != undefined) {
              dtArr[dt] = graph[i]
              dt++
            }
          }
        } else {
          for (let i = final_dp; i > -1; i--) {
            if (graph[i]['y'] != undefined) {
              dtArr[dt] = graph[i]
              dt++
            }
          }
        }
        if (dtArr.length < 2) {
          $('#whprChartContainer').hide()
          this.showMinimumError = true
          this.loadingMessage = false
        } else {
          $('#whprChartContainer').show()
          this.showMinimumError = false;
        }
        if (test_cond) {
          var chartFor2Days = new CanvasJS.Chart("whprChartContainer",
            {
              toolTip: {
                fontFamily: "'Quicksand', 'sans-serif'",
                borderThickness: "0",
                cornerRadius: 10,
                content: "<span style='\"'color: {color}'\"'>Waist/Hip Ratio : {y} kg <br>Date : {x}</span>"
              },
              animationEnabled: true,
              animationDuration: 2000,
              axisX: {
                lineThickness: 0,
                tickThickness: 0,
                gridColor: "Silver",
                valueFormatString: "DD/MMM hh TT",
                labelFontSize: 12,
                labelFontWeight: "bold",
                labelFontColor: "#808080",
                labelFontFamily: "'Quicksand', 'sans-serif'"
              },
              axisY: {
                maximum: 1.0,
                lineThickness: 0,
                tickThickness: 0,
                gridThickness: 0,
                labelFontSize: 12,
                labelFontWeight: "bold",
                labelFontColor: "#808080",
                labelFontFamily: "'Quicksand', 'sans-serif'",
                includeZero: false
              },
              legend: {
                fontSize: 15,
                fontFamily: "'Quicksand', 'sans-serif'",
                fontColor: "#808080"
              },
              data: [
                {
                  type: "splineArea",
                  showInLegend: true,
                  legendText: "Low",
                  legendMarkerType: "square",
                  legendMarkerColor: "#ff9800",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                {
                  type: "splineArea",
                  showInLegend: true,
                  legendText: "Normal",
                  legendMarkerType: "square",
                  legendMarkerColor: "#43A047",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                {
                  type: "splineArea",
                  showInLegend: true,
                  legendText: "High",
                  legendMarkerType: "square",
                  legendMarkerColor: "#d32f2f",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                {
                  type: "splineArea",
                  lineThickness: 2,
                  lineColor: "#4885ed",
                  fillOpacity: 0.1,
                  markerSize: 10,
                  dataPoints: dtArr
                }
              ]
            })
          setTimeout(() => {
            this.loadingMessage = false
            chartFor2Days.render()
          }, 2000)
        }
        else {
          var whprChart = new CanvasJS.Chart("whprChartContainer",
            {
              toolTip: {
                fontFamily: "'Quicksand', 'sans-serif'",
                borderThickness: "0",
                cornerRadius: 10,
                content: "<span style='\"'color: {color}'\"'>Waist/Hip Ratio : {y} kg <br>Date : {x}</span>"
              },
              animationEnabled: true,
              animationDuration: 2000,
              axisX: {
                lineThickness: 0,
                tickThickness: 0,
                gridColor: "Silver",
                valueFormatString: "DD/MMM",
                labelFontSize: 12,
                labelFontWeight: "bold",
                labelFontColor: "#808080",
                labelFontFamily: "'Quicksand', 'sans-serif'"
              },
              axisY: {
                maximum: 1.0,
                lineThickness: 0,
                tickThickness: 0,
                gridThickness: 0,
                labelFontSize: 12,
                labelFontWeight: "bold",
                labelFontColor: "#808080",
                labelFontFamily: "'Quicksand', 'sans-serif'",
                includeZero: false
              },
              legend: {
                fontSize: 15,
                fontFamily: "'Quicksand', 'sans-serif'",
                fontColor: "#808080"
              },
              data: [
                {
                  type: "splineArea",
                  showInLegend: true,
                  legendText: "Low",
                  legendMarkerType: "square",
                  legendMarkerColor: "#ff9800",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                {
                  type: "splineArea",
                  showInLegend: true,
                  legendText: "Normal",
                  legendMarkerType: "square",
                  legendMarkerColor: "#43A047",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                {
                  type: "splineArea",
                  showInLegend: true,
                  legendText: "High",
                  legendMarkerType: "square",
                  legendMarkerColor: "#d32f2f",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                {
                  type: "splineArea",
                  lineThickness: 2,
                  lineColor: "#4885ed",
                  fillOpacity: 0.1,
                  markerSize: 10,
                  dataPoints: dtArr
                }
              ]
            })
          setTimeout(() => {
            this.loadingMessage = false
            whprChart.render()
          }, 3000)
        }
      }
    }

    if (this.testType == "Bone Mineral Content") {
      if (this.bmctGraphData.length < 2) {
        this.showMinimumError = true
        this.loadingMessage = false
      }
      else {
        this.showMinimumError = false
        for (let index = 0, count_inc = 0, init2 = 0; this.bmctGraphData.length > index; index++) {
          graph[index] = {}
          if (GraphPeriod !== "showAllDays") {
            var testTakenDate = this.bmctGraphData[index].x
          }
          if (index == 0) {
            if (GraphPeriod === "showAllDays") {
              var DateOnlyInit = new Date(this.bmctGraphData[index].z.slice(0, -10))
            }
          }
          if (GraphPeriod === "showAllDays") {
            if (index > 0) {
              var DateOnlyPrev = new Date(this.bmctGraphData[index - 1].z.slice(0, -10))
              var DateOnlyCurrent = new Date(this.bmctGraphData[index].z.slice(0, -10))
              var DateOnlyLast = new Date(this.bmctGraphData[this.bmctGraphData.length - 1].z.slice(0, -10))
              var diffInTimestampForLast = DateOnlyLast.valueOf() - DateOnlyInit.valueOf()
              var diffInHoursForLastStart = diffInTimestampForLast / 1000 / 60 / 60
              if (diffInHoursForLastStart <= 48) {
                graph[index - 1]['x'] = this.bmctGraphData[index - 1].x
                graph[index - 1]['y'] = this.bmctGraphData[index - 1].y
                graph[index - 1]['color'] = this.bmctGraphData[index - 1].color
                graph[index]['x'] = this.bmctGraphData[index].x
                graph[index]['y'] = this.bmctGraphData[index].y
                graph[index]['color'] = this.bmctGraphData[index].color
                test_cond = true
              }
              var dateDiff = this.timeDifference(DateOnlyCurrent, DateOnlyPrev);
              if (index == this.bmctGraphData.length - 1 && count_inc >= 1) {
                final_dp = count_inc;
                graph[count_inc]['x'] = this.bmctGraphData[index].x
                graph[count_inc]['y'] = this.bmctGraphData[index].y
                graph[count_inc]['color'] = this.bmctGraphData[index].color
              }
              if (dateDiff == 0) {
                //Nothing to do
              } else {
                if (diffInHoursForLastStart <= 48) {
                  test_cond = true
                } else {
                  test_cond = false;
                  graph[count_inc]['x'] = this.bmctGraphData[index - 1].x
                  graph[count_inc]['y'] = this.bmctGraphData[index - 1].y
                  graph[count_inc]['color'] = this.bmctGraphData[index - 1].color
                  final_dp = count_inc;
                  count_inc++;
                  if (index == this.bmctGraphData.length - 1 && count_inc >= 1 && diffInHoursForLastStart >= 48) {
                    final_dp = count_inc;
                    graph[count_inc]['x'] = this.bmctGraphData[index].x
                    graph[count_inc]['y'] = this.bmctGraphData[index].y
                    graph[count_inc]['color'] = this.bmctGraphData[index].color
                  }
                }
              }
            }
          }
          else {
            if (last90Days <= testTakenDate) {
              if (init2 == 0) {
                var DateOnlyInit = new Date(this.bmctGraphData[index].z.slice(0, -10))
                var DateOnlyLast = new Date(this.bmctGraphData[this.bmctGraphData.length - 1].z.slice(0, -10))
                var diffInTimestampForLast = DateOnlyLast.valueOf() - DateOnlyInit.valueOf()
                var diffInHoursForLastStart = diffInTimestampForLast / 1000 / 60 / 60
              }
              if (diffInHoursForLastStart <= 48) {
                graph[count_inc]['x'] = this.bmctGraphData[index].x
                graph[count_inc]['y'] = this.bmctGraphData[index].y
                graph[count_inc]['color'] = this.bmctGraphData[index].color
                test_cond = true
                count_inc++
              }
              var DateOnly = new Date(this.bmctGraphData[index].z.slice(0, -10))
              if (index > 0 && init2 > 0) {
                var DateOnlyPrev = new Date(this.bmctGraphData[index - 1].z.slice(0, -10))
                var dateDiff = this.timeDifference(DateOnly, DateOnlyPrev)
                if (index == this.bmctGraphData.length - 1 && count_inc >= 1 && diffInHoursForLastStart > 48) {
                  final_dp = count_inc
                  graph[count_inc]['x'] = this.bmctGraphData[index].x
                  graph[count_inc]['y'] = this.bmctGraphData[index].y
                  graph[count_inc]['color'] = this.bmctGraphData[index].color
                }
                if (dateDiff == 0 || diffInHoursForLastStart <= 48) {
                  //Nothing to do
                } else {
                  test_cond = false
                  graph[count_inc]['x'] = this.bmctGraphData[index - 1].x
                  graph[count_inc]['y'] = this.bmctGraphData[index - 1].y
                  graph[count_inc]['color'] = this.bmctGraphData[index - 1].color
                  final_dp = count_inc
                  count_inc++
                  if (index == this.bmctGraphData.length - 1 && count_inc >= 1) {
                    final_dp = count_inc
                    graph[count_inc]['x'] = this.bmctGraphData[index].x
                    graph[count_inc]['y'] = this.bmctGraphData[index].y
                    graph[count_inc]['color'] = this.bmctGraphData[index].color
                  }
                }
              }
              init2++
            }
          }
        }
        var beforeDate = null
        var dtArr = []
        var dt = 0
        if (test_cond === true) {
          for (let i = graph.length - 1; i > -1; i--) {
            if (graph[i]['y'] != undefined) {
              dtArr[dt] = graph[i]
              dt++
            }
          }
        } else {
          for (let i = final_dp; i > -1; i--) {
            if (graph[i]['y'] != undefined) {
              dtArr[dt] = graph[i]
              dt++
            }
          }
        }
        if (dtArr.length < 2) {
          $('#bmctChartContainer').hide()
          this.showMinimumError = true
          this.loadingMessage = false
        } else {
          $('#bmctChartContainer').show()
          this.showMinimumError = false;
        }
        if (test_cond) {
          var chartFor2Days = new CanvasJS.Chart("bmctChartContainer",
            {
              toolTip: {
                fontFamily: "'Quicksand', 'sans-serif'",
                borderThickness: "0",
                cornerRadius: 10,
                content: "<span style='\"'color: {color}'\"'>Bone Mineral : {y} kg <br>Date : {x}</span>"
              },
              animationEnabled: true,
              animationDuration: 2000,
              axisX: {
                lineThickness: 0,
                tickThickness: 0,
                gridColor: "Silver",
                valueFormatString: "DD/MMM hh TT",
                labelFontSize: 12,
                labelFontWeight: "bold",
                labelFontColor: "#808080",
                labelFontFamily: "'Quicksand', 'sans-serif'"
              },
              axisY: {
                maximum: 10,
                lineThickness: 0,
                tickThickness: 0,
                gridThickness: 0,
                labelFontSize: 12,
                labelFontWeight: "bold",
                labelFontColor: "#808080",
                labelFontFamily: "'Quicksand', 'sans-serif'",
                includeZero: false
              },
              legend: {
                fontSize: 15,
                fontFamily: "'Quicksand', 'sans-serif'",
                fontColor: "#808080"
              },
              data: [
                {
                  type: "splineArea",
                  showInLegend: true,
                  legendText: "Normal",
                  legendMarkerType: "square",
                  legendMarkerColor: "#43A047",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                {
                  type: "splineArea",
                  showInLegend: true,
                  legendText: "Low",
                  legendMarkerType: "square",
                  legendMarkerColor: "#ff9800",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                // {
                //   type: "splineArea",
                //   showInLegend: true,
                //   legendText: "At-Risk",
                //   legendMarkerType: "square",
                //   legendMarkerColor: "#d32f2f",
                //   fillOpacity: 0,
                //   lineThickness: 0,
                //   markerSize: 0,
                //   dataPoints: dtArr
                // },
                {
                  type: "splineArea",
                  lineThickness: 2,
                  lineColor: "#4885ed",
                  fillOpacity: 0.1,
                  markerSize: 11,
                  dataPoints: dtArr
                }
              ]
            })
          setTimeout(() => {
            this.loadingMessage = false
            chartFor2Days.render()
          }, 2000)
        }
        else {
          var bmctChart = new CanvasJS.Chart("bmctChartContainer",
            {
              toolTip: {
                fontFamily: "'Quicksand', 'sans-serif'",
                borderThickness: "0",
                cornerRadius: 10,
                content: "<span style='\"'color: {color}'\"'>Bone Mineral : {y} kg <br>Date : {x}</span>"
              },
              animationEnabled: true,
              animationDuration: 2000,
              axisX: {
                lineThickness: 0,
                tickThickness: 0,
                gridColor: "Silver",
                valueFormatString: "DD/MMM",
                labelFontSize: 12,
                labelFontWeight: "bold",
                labelFontColor: "#808080",
                labelFontFamily: "'Quicksand', 'sans-serif'"
              },
              axisY: {
                maximum: 10,
                lineThickness: 0,
                tickThickness: 0,
                gridThickness: 0,
                labelFontSize: 12,
                labelFontWeight: "bold",
                labelFontColor: "#808080",
                labelFontFamily: "'Quicksand', 'sans-serif'",
                includeZero: false
              },
              legend: {
                fontSize: 15,
                fontFamily: "'Quicksand', 'sans-serif'",
                fontColor: "#808080"
              },
              data: [
                {
                  type: "splineArea",
                  showInLegend: true,
                  legendText: "Normal",
                  legendMarkerType: "square",
                  legendMarkerColor: "#43A047",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                {
                  type: "splineArea",
                  showInLegend: true,
                  legendText: "Low",
                  legendMarkerType: "square",
                  legendMarkerColor: "#ff9800",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                // {
                //   type: "splineArea",
                //   showInLegend: true,
                //   legendText: "At-Risk",
                //   legendMarkerType: "square",
                //   legendMarkerColor: "#d32f2f",
                //   fillOpacity: 0,
                //   lineThickness: 0,
                //   markerSize: 0,
                //   dataPoints: dtArr
                // },
                {
                  type: "splineArea",
                  lineThickness: 2,
                  lineColor: "#4885ed",
                  fillOpacity: 0.1,
                  markerSize: 11,
                  dataPoints: dtArr
                }
              ]
            })
          setTimeout(() => {
            this.loadingMessage = false
            bmctChart.render()
          }, 3000)
        }
      }
    }

    if (this.testType == "Body Cell Mass") {
      if (this.bcmGraphData.length < 2) {
        this.showMinimumError = true
        this.loadingMessage = false
      }
      else {
        this.showMinimumError = false
        for (let index = 0, count_inc = 0, init2 = 0; this.bcmGraphData.length > index; index++) {
          graph[index] = {}
          if (GraphPeriod !== "showAllDays") {
            var testTakenDate = this.bcmGraphData[index].x
          }
          if (index == 0) {
            if (GraphPeriod === "showAllDays") {
              var DateOnlyInit = new Date(this.bcmGraphData[index].z.slice(0, -10))
            }
          }
          if (GraphPeriod === "showAllDays") {
            if (index > 0) {
              var DateOnlyPrev = new Date(this.bcmGraphData[index - 1].z.slice(0, -10))
              var DateOnlyCurrent = new Date(this.bcmGraphData[index].z.slice(0, -10))
              var DateOnlyLast = new Date(this.bcmGraphData[this.bcmGraphData.length - 1].z.slice(0, -10))
              var diffInTimestampForLast = DateOnlyLast.valueOf() - DateOnlyInit.valueOf()
              var diffInHoursForLastStart = diffInTimestampForLast / 1000 / 60 / 60
              if (diffInHoursForLastStart <= 48) {
                graph[index - 1]['x'] = this.bcmGraphData[index - 1].x
                graph[index - 1]['y'] = this.bcmGraphData[index - 1].y
                graph[index - 1]['color'] = this.bcmGraphData[index - 1].color
                graph[index]['x'] = this.bcmGraphData[index].x
                graph[index]['y'] = this.bcmGraphData[index].y
                graph[index]['color'] = this.bcmGraphData[index].color
                test_cond = true
              }
              var dateDiff = this.timeDifference(DateOnlyCurrent, DateOnlyPrev);
              if (index == this.bcmGraphData.length - 1 && count_inc >= 1) {
                final_dp = count_inc;
                graph[count_inc]['x'] = this.bcmGraphData[index].x
                graph[count_inc]['y'] = this.bcmGraphData[index].y
                graph[count_inc]['color'] = this.bcmGraphData[index].color
              }
              if (dateDiff == 0) {
                //Nothing to do
              } else {
                if (diffInHoursForLastStart <= 48) {
                  test_cond = true
                } else {
                  test_cond = false;
                  graph[count_inc]['x'] = this.bcmGraphData[index - 1].x
                  graph[count_inc]['y'] = this.bcmGraphData[index - 1].y
                  graph[count_inc]['color'] = this.bcmGraphData[index - 1].color
                  final_dp = count_inc;
                  count_inc++;
                  if (index == this.bcmGraphData.length - 1 && count_inc >= 1 && diffInHoursForLastStart >= 48) {
                    final_dp = count_inc;
                    graph[count_inc]['x'] = this.bcmGraphData[index].x
                    graph[count_inc]['y'] = this.bcmGraphData[index].y
                    graph[count_inc]['color'] = this.bcmGraphData[index].color
                  }
                }
              }
            }
          }
          else {
            if (last90Days <= testTakenDate) {
              if (init2 == 0) {
                var DateOnlyInit = new Date(this.bcmGraphData[index].z.slice(0, -10))
                var DateOnlyLast = new Date(this.bcmGraphData[this.bcmGraphData.length - 1].z.slice(0, -10))
                var diffInTimestampForLast = DateOnlyLast.valueOf() - DateOnlyInit.valueOf()
                var diffInHoursForLastStart = diffInTimestampForLast / 1000 / 60 / 60
              }
              if (diffInHoursForLastStart <= 48) {
                graph[count_inc]['x'] = this.bcmGraphData[index].x
                graph[count_inc]['y'] = this.bcmGraphData[index].y
                graph[count_inc]['color'] = this.bcmGraphData[index].color
                test_cond = true
                count_inc++
              }
              var DateOnly = new Date(this.bcmGraphData[index].z.slice(0, -10))
              if (index > 0 && init2 > 0) {
                var DateOnlyPrev = new Date(this.bcmGraphData[index - 1].z.slice(0, -10))
                var dateDiff = this.timeDifference(DateOnly, DateOnlyPrev)
                if (index == this.bcmGraphData.length - 1 && count_inc >= 1 && diffInHoursForLastStart > 48) {
                  final_dp = count_inc
                  graph[count_inc]['x'] = this.bcmGraphData[index].x
                  graph[count_inc]['y'] = this.bcmGraphData[index].y
                  graph[count_inc]['color'] = this.bcmGraphData[index].color
                }
                if (dateDiff == 0 || diffInHoursForLastStart <= 48) {
                  //Nothing to do
                } else {
                  test_cond = false
                  graph[count_inc]['x'] = this.bcmGraphData[index - 1].x
                  graph[count_inc]['y'] = this.bcmGraphData[index - 1].y
                  graph[count_inc]['color'] = this.bcmGraphData[index - 1].color
                  final_dp = count_inc
                  count_inc++
                  if (index == this.bcmGraphData.length - 1 && count_inc >= 1) {
                    final_dp = count_inc
                    graph[count_inc]['x'] = this.bcmGraphData[index].x
                    graph[count_inc]['y'] = this.bcmGraphData[index].y
                    graph[count_inc]['color'] = this.bcmGraphData[index].color
                  }
                }
              }
              init2++
            }
          }
        }
        var beforeDate = null
        var dtArr = []
        var dt = 0
        if (test_cond === true) {
          for (let i = graph.length - 1; i > -1; i--) {
            if (graph[i]['y'] != undefined) {
              dtArr[dt] = graph[i]
              dt++
            }
          }
        } else {
          for (let i = final_dp; i > -1; i--) {
            if (graph[i]['y'] != undefined) {
              dtArr[dt] = graph[i]
              dt++
            }
          }
        }
        if (dtArr.length < 2) {
          $('#bcmChartContainer').hide()
          this.showMinimumError = true
          this.loadingMessage = false
        } else {
          $('#bcmChartContainer').show()
          this.showMinimumError = false;
        }
        if (test_cond) {
          var chartFor2Days = new CanvasJS.Chart("bcmChartContainer",
            {
              toolTip: {
                fontFamily: "'Quicksand', 'sans-serif'",
                borderThickness: "0",
                cornerRadius: 10,
                content: "<span style='\"'color: {color}'\"'>Body Cell Mass : {y} kg <br>Date : {x}</span>"
              },
              animationEnabled: true,
              animationDuration: 2000,
              axisX: {
                lineThickness: 0,
                tickThickness: 0,
                gridColor: "Silver",
                valueFormatString: "DD/MMM hh TT",
                labelFontSize: 12,
                labelFontWeight: "bold",
                labelFontColor: "#808080",
                labelFontFamily: "'Quicksand', 'sans-serif'"
              },
              axisY: {
                maximum: 40,
                lineThickness: 0,
                tickThickness: 0,
                gridThickness: 0,
                labelFontSize: 12,
                labelFontWeight: "bold",
                labelFontColor: "#808080",
                labelFontFamily: "'Quicksand', 'sans-serif'",
                includeZero: false
              },
              legend: {
                fontSize: 15,
                fontFamily: "'Quicksand', 'sans-serif'",
                fontColor: "#808080"
              },
              data: [
                {
                  type: "splineArea",
                  showInLegend: true,
                  legendText: "Low",
                  legendMarkerType: "square",
                  legendMarkerColor: "#ff9800",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                {
                  type: "splineArea",
                  showInLegend: true,
                  legendText: "Normal",
                  legendMarkerType: "square",
                  legendMarkerColor: "#43A047",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                // {
                //   type: "splineArea",
                //   showInLegend: true,
                //   legendText: "High",
                //   legendMarkerType: "square",
                //   legendMarkerColor: "#d32f2f",
                //   fillOpacity: 0,
                //   lineThickness: 0,
                //   markerSize: 0,
                //   dataPoints: dtArr
                // },
                {
                  type: "splineArea",
                  lineThickness: 2,
                  lineColor: "#4885ed",
                  fillOpacity: 0.1,
                  markerSize: 10,
                  dataPoints: dtArr
                }
              ]
            })
          setTimeout(() => {
            this.loadingMessage = false
            chartFor2Days.render()
          }, 2000)
        }
        else {
          var bcmChart = new CanvasJS.Chart("bcmChartContainer",
            {
              toolTip: {
                fontFamily: "'Quicksand', 'sans-serif'",
                borderThickness: "0",
                cornerRadius: 10,
                content: "<span style='\"'color: {color}'\"'>Body Cell Mass : {y} kg <br>Date : {x}</span>"
              },
              animationEnabled: true,
              animationDuration: 2000,
              axisX: {
                lineThickness: 0,
                tickThickness: 0,
                gridColor: "Silver",
                valueFormatString: "DD/MMM",
                labelFontSize: 12,
                labelFontWeight: "bold",
                labelFontColor: "#808080",
                labelFontFamily: "'Quicksand', 'sans-serif'"
              },
              axisY: {
                maximum: 40,
                lineThickness: 0,
                tickThickness: 0,
                gridThickness: 0,
                labelFontSize: 12,
                labelFontWeight: "bold",
                labelFontColor: "#808080",
                labelFontFamily: "'Quicksand', 'sans-serif'",
                includeZero: false
              },
              legend: {
                fontSize: 15,
                fontFamily: "'Quicksand', 'sans-serif'",
                fontColor: "#808080"
              },
              data: [
                {
                  type: "splineArea",
                  showInLegend: true,
                  legendText: "Low",
                  legendMarkerType: "square",
                  legendMarkerColor: "#ff9800",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                {
                  type: "splineArea",
                  showInLegend: true,
                  legendText: "Normal",
                  legendMarkerType: "square",
                  legendMarkerColor: "#43A047",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                // {
                //   type: "splineArea",
                //   showInLegend: true,
                //   legendText: "High",
                //   legendMarkerType: "square",
                //   legendMarkerColor: "#d32f2f",
                //   fillOpacity: 0,
                //   lineThickness: 0,
                //   markerSize: 0,
                //   dataPoints: dtArr
                // },
                {
                  type: "splineArea",
                  lineThickness: 2,
                  lineColor: "#4885ed",
                  fillOpacity: 0.1,
                  markerSize: 10,
                  dataPoints: dtArr
                }
              ]
            })
          setTimeout(() => {
            this.loadingMessage = false
            bcmChart.render()
          }, 3000)
        }
      }
    }

    if (this.testType == "Waist/Height Ratio") {
      if (this.whtrGraphData.length < 2) {
        this.showMinimumError = true
        this.loadingMessage = false
      }
      else {
        this.showMinimumError = false
        for (let index = 0, count_inc = 0, init2 = 0; this.whtrGraphData.length > index; index++) {
          graph[index] = {}
          if (GraphPeriod !== "showAllDays") {
            var testTakenDate = this.whtrGraphData[index].x
          }
          if (index == 0) {
            if (GraphPeriod === "showAllDays") {
              var DateOnlyInit = new Date(this.whtrGraphData[index].z.slice(0, -10))
            }
          }
          if (GraphPeriod === "showAllDays") {
            if (index > 0) {
              var DateOnlyPrev = new Date(this.whtrGraphData[index - 1].z.slice(0, -10))
              var DateOnlyCurrent = new Date(this.whtrGraphData[index].z.slice(0, -10))
              var DateOnlyLast = new Date(this.whtrGraphData[this.whtrGraphData.length - 1].z.slice(0, -10))
              var diffInTimestampForLast = DateOnlyLast.valueOf() - DateOnlyInit.valueOf()
              var diffInHoursForLastStart = diffInTimestampForLast / 1000 / 60 / 60
              if (diffInHoursForLastStart <= 48) {
                graph[index - 1]['x'] = this.whtrGraphData[index - 1].x
                graph[index - 1]['y'] = this.whtrGraphData[index - 1].y
                graph[index - 1]['color'] = this.whtrGraphData[index - 1].color
                graph[index]['x'] = this.whtrGraphData[index].x
                graph[index]['y'] = this.whtrGraphData[index].y
                graph[index]['color'] = this.whtrGraphData[index].color
                test_cond = true
              }
              var dateDiff = this.timeDifference(DateOnlyCurrent, DateOnlyPrev);
              if (index == this.whtrGraphData.length - 1 && count_inc >= 1) {
                final_dp = count_inc;
                graph[count_inc]['x'] = this.whtrGraphData[index].x
                graph[count_inc]['y'] = this.whtrGraphData[index].y
                graph[count_inc]['color'] = this.whtrGraphData[index].color
              }
              if (dateDiff == 0) {
                //Nothing to do
              } else {
                if (diffInHoursForLastStart <= 48) {
                  test_cond = true
                } else {
                  test_cond = false;
                  graph[count_inc]['x'] = this.whtrGraphData[index - 1].x
                  graph[count_inc]['y'] = this.whtrGraphData[index - 1].y
                  graph[count_inc]['color'] = this.whtrGraphData[index - 1].color
                  final_dp = count_inc;
                  count_inc++;
                  if (index == this.whtrGraphData.length - 1 && count_inc >= 1 && diffInHoursForLastStart >= 48) {
                    final_dp = count_inc;
                    graph[count_inc]['x'] = this.whtrGraphData[index].x
                    graph[count_inc]['y'] = this.whtrGraphData[index].y
                    graph[count_inc]['color'] = this.whtrGraphData[index].color
                  }
                }
              }
            }
          }
          else {
            if (last90Days <= testTakenDate) {
              if (init2 == 0) {
                var DateOnlyInit = new Date(this.whtrGraphData[index].z.slice(0, -10))
                var DateOnlyLast = new Date(this.whtrGraphData[this.whtrGraphData.length - 1].z.slice(0, -10))
                var diffInTimestampForLast = DateOnlyLast.valueOf() - DateOnlyInit.valueOf()
                var diffInHoursForLastStart = diffInTimestampForLast / 1000 / 60 / 60
              }
              if (diffInHoursForLastStart <= 48) {
                graph[count_inc]['x'] = this.whtrGraphData[index].x
                graph[count_inc]['y'] = this.whtrGraphData[index].y
                graph[count_inc]['color'] = this.whtrGraphData[index].color
                test_cond = true
                count_inc++
              }
              var DateOnly = new Date(this.whtrGraphData[index].z.slice(0, -10))
              if (index > 0 && init2 > 0) {
                var DateOnlyPrev = new Date(this.whtrGraphData[index - 1].z.slice(0, -10))
                var dateDiff = this.timeDifference(DateOnly, DateOnlyPrev)
                if (index == this.whtrGraphData.length - 1 && count_inc >= 1 && diffInHoursForLastStart > 48) {
                  final_dp = count_inc
                  graph[count_inc]['x'] = this.whtrGraphData[index].x
                  graph[count_inc]['y'] = this.whtrGraphData[index].y
                  graph[count_inc]['color'] = this.whtrGraphData[index].color
                }
                if (dateDiff == 0 || diffInHoursForLastStart <= 48) {
                  //Nothing to do
                } else {
                  test_cond = false
                  graph[count_inc]['x'] = this.whtrGraphData[index - 1].x
                  graph[count_inc]['y'] = this.whtrGraphData[index - 1].y
                  graph[count_inc]['color'] = this.whtrGraphData[index - 1].color
                  final_dp = count_inc
                  count_inc++
                  if (index == this.whtrGraphData.length - 1 && count_inc >= 1) {
                    final_dp = count_inc
                    graph[count_inc]['x'] = this.whtrGraphData[index].x
                    graph[count_inc]['y'] = this.whtrGraphData[index].y
                    graph[count_inc]['color'] = this.whtrGraphData[index].color
                  }
                }
              }
              init2++
            }
          }
        }
        var beforeDate = null
        var dtArr = []
        var dt = 0
        if (test_cond === true) {
          for (let i = graph.length - 1; i > -1; i--) {
            if (graph[i]['y'] != undefined) {
              dtArr[dt] = graph[i]
              dt++
            }
          }
        } else {
          for (let i = final_dp; i > -1; i--) {
            if (graph[i]['y'] != undefined) {
              dtArr[dt] = graph[i]
              dt++
            }
          }
        }
        if (dtArr.length < 2) {
          $('#whtrChartContainer').hide()
          this.showMinimumError = true
          this.loadingMessage = false
        } else {
          $('#whtrChartContainer').show()
          this.showMinimumError = false;
        }
        if (test_cond) {
          var chartFor2Days = new CanvasJS.Chart("whtrChartContainer",
            {
              toolTip: {
                fontFamily: "'Quicksand', 'sans-serif'",
                borderThickness: "0",
                cornerRadius: 10,
                content: "<span style='\"'color: {color}'\"'>Waist/Height Ratio : {y} kg <br>Date : {x}</span>"
              },
              animationEnabled: true,
              animationDuration: 2000,
              axisX: {
                lineThickness: 0,
                tickThickness: 0,
                gridColor: "Silver",
                valueFormatString: "DD/MMM hh TT",
                labelFontSize: 12,
                labelFontWeight: "bold",
                labelFontColor: "#808080",
                labelFontFamily: "'Quicksand', 'sans-serif'"
              },
              axisY: {
                maximum: 2.1,
                lineThickness: 0,
                tickThickness: 0,
                gridThickness: 0,
                labelFontSize: 12,
                labelFontWeight: "bold",
                labelFontColor: "#808080",
                labelFontFamily: "'Quicksand', 'sans-serif'",
                includeZero: false
              },
              legend: {
                fontSize: 15,
                fontFamily: "'Quicksand', 'sans-serif'",
                fontColor: "#808080"
              },
              data: [
                {
                  type: "splineArea",
                  showInLegend: true,
                  legendText: "Low",
                  legendMarkerType: "square",
                  legendMarkerColor: "#ff9800",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                {
                  type: "splineArea",
                  showInLegend: true,
                  legendText: "Normal",
                  legendMarkerType: "square",
                  legendMarkerColor: "#43A047",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                {
                  type: "splineArea",
                  showInLegend: true,
                  legendText: "High",
                  legendMarkerType: "square",
                  legendMarkerColor: "#d32f2f",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                {
                  type: "splineArea",
                  lineThickness: 2,
                  lineColor: "#4885ed",
                  fillOpacity: 0.1,
                  markerSize: 10,
                  dataPoints: dtArr
                }
              ]
            })
          setTimeout(() => {
            this.loadingMessage = false
            chartFor2Days.render()
          }, 2000)
        }
        else {
          var whtrChart = new CanvasJS.Chart("whtrChartContainer",
            {
              toolTip: {
                fontFamily: "'Quicksand', 'sans-serif'",
                borderThickness: "0",
                cornerRadius: 10,
                content: "<span style='\"'color: {color}'\"'>Waist/Height Ratio : {y} kg <br>Date : {x}</span>"
              },
              animationEnabled: true,
              animationDuration: 2000,
              axisX: {
                lineThickness: 0,
                tickThickness: 0,
                gridColor: "Silver",
                valueFormatString: "DD/MMM",
                labelFontSize: 12,
                labelFontWeight: "bold",
                labelFontColor: "#808080",
                labelFontFamily: "'Quicksand', 'sans-serif'"
              },
              axisY: {
                maximum: 2.1,
                lineThickness: 0,
                tickThickness: 0,
                gridThickness: 0,
                labelFontSize: 12,
                labelFontWeight: "bold",
                labelFontColor: "#808080",
                labelFontFamily: "'Quicksand', 'sans-serif'",
                includeZero: false
              },
              legend: {
                fontSize: 15,
                fontFamily: "'Quicksand', 'sans-serif'",
                fontColor: "#808080"
              },
              data: [
                {
                  type: "splineArea",
                  showInLegend: true,
                  legendText: "Low",
                  legendMarkerType: "square",
                  legendMarkerColor: "#ff9800",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                {
                  type: "splineArea",
                  showInLegend: true,
                  legendText: "Normal",
                  legendMarkerType: "square",
                  legendMarkerColor: "#43A047",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                {
                  type: "splineArea",
                  showInLegend: true,
                  legendText: "High",
                  legendMarkerType: "square",
                  legendMarkerColor: "#d32f2f",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                {
                  type: "splineArea",
                  lineThickness: 2,
                  lineColor: "#4885ed",
                  fillOpacity: 0.1,
                  markerSize: 10,
                  dataPoints: dtArr
                }
              ]
            })
          setTimeout(() => {
            this.loadingMessage = false
            whtrChart.render()
          }, 3000)
        }
      }
    }

    if (this.testType == "Visceral Fat") {
      if (this.vfGraphData.length < 2) {
        this.showMinimumError = true
        this.loadingMessage = false
      }
      else {
        this.showMinimumError = false
        for (let index = 0, count_inc = 0, init2 = 0; this.vfGraphData.length > index; index++) {
          graph[index] = {}
          if (GraphPeriod !== "showAllDays") {
            var testTakenDate = this.vfGraphData[index].x
          }
          if (index == 0) {
            if (GraphPeriod === "showAllDays") {
              var DateOnlyInit = new Date(this.vfGraphData[index].z.slice(0, -10))
            }
          }
          if (GraphPeriod === "showAllDays") {
            if (index > 0) {
              var DateOnlyPrev = new Date(this.vfGraphData[index - 1].z.slice(0, -10))
              var DateOnlyCurrent = new Date(this.vfGraphData[index].z.slice(0, -10))
              var DateOnlyLast = new Date(this.vfGraphData[this.vfGraphData.length - 1].z.slice(0, -10))
              var diffInTimestampForLast = DateOnlyLast.valueOf() - DateOnlyInit.valueOf()
              var diffInHoursForLastStart = diffInTimestampForLast / 1000 / 60 / 60
              if (diffInHoursForLastStart <= 48) {
                graph[index - 1]['x'] = this.vfGraphData[index - 1].x
                graph[index - 1]['y'] = this.vfGraphData[index - 1].y
                graph[index - 1]['color'] = this.vfGraphData[index - 1].color
                graph[index]['x'] = this.vfGraphData[index].x
                graph[index]['y'] = this.vfGraphData[index].y
                graph[index]['color'] = this.vfGraphData[index].color
                test_cond = true
              }
              var dateDiff = this.timeDifference(DateOnlyCurrent, DateOnlyPrev);
              if (index == this.vfGraphData.length - 1 && count_inc >= 1) {
                final_dp = count_inc;
                graph[count_inc]['x'] = this.vfGraphData[index].x
                graph[count_inc]['y'] = this.vfGraphData[index].y
                graph[count_inc]['color'] = this.vfGraphData[index].color
              }
              if (dateDiff == 0) {
                //Nothing to do
              } else {
                if (diffInHoursForLastStart <= 48) {
                  test_cond = true
                } else {
                  test_cond = false;
                  graph[count_inc]['x'] = this.vfGraphData[index - 1].x
                  graph[count_inc]['y'] = this.vfGraphData[index - 1].y
                  graph[count_inc]['color'] = this.vfGraphData[index - 1].color
                  final_dp = count_inc;
                  count_inc++;
                  if (index == this.vfGraphData.length - 1 && count_inc >= 1 && diffInHoursForLastStart >= 48) {
                    final_dp = count_inc;
                    graph[count_inc]['x'] = this.vfGraphData[index].x
                    graph[count_inc]['y'] = this.vfGraphData[index].y
                    graph[count_inc]['color'] = this.vfGraphData[index].color
                  }
                }
              }
            }
          }
          else {
            if (last90Days <= testTakenDate) {
              if (init2 == 0) {
                var DateOnlyInit = new Date(this.vfGraphData[index].z.slice(0, -10))
                var DateOnlyLast = new Date(this.vfGraphData[this.vfGraphData.length - 1].z.slice(0, -10))
                var diffInTimestampForLast = DateOnlyLast.valueOf() - DateOnlyInit.valueOf()
                var diffInHoursForLastStart = diffInTimestampForLast / 1000 / 60 / 60
              }
              if (diffInHoursForLastStart <= 48) {
                graph[count_inc]['x'] = this.vfGraphData[index].x
                graph[count_inc]['y'] = this.vfGraphData[index].y
                graph[count_inc]['color'] = this.vfGraphData[index].color
                test_cond = true
                count_inc++
              }
              var DateOnly = new Date(this.vfGraphData[index].z.slice(0, -10))
              if (index > 0 && init2 > 0) {
                var DateOnlyPrev = new Date(this.vfGraphData[index - 1].z.slice(0, -10))
                var dateDiff = this.timeDifference(DateOnly, DateOnlyPrev)
                if (index == this.vfGraphData.length - 1 && count_inc >= 1 && diffInHoursForLastStart > 48) {
                  final_dp = count_inc
                  graph[count_inc]['x'] = this.vfGraphData[index].x
                  graph[count_inc]['y'] = this.vfGraphData[index].y
                  graph[count_inc]['color'] = this.vfGraphData[index].color
                }
                if (dateDiff == 0 || diffInHoursForLastStart <= 48) {
                  //Nothing to do
                } else {
                  test_cond = false
                  graph[count_inc]['x'] = this.vfGraphData[index - 1].x
                  graph[count_inc]['y'] = this.vfGraphData[index - 1].y
                  graph[count_inc]['color'] = this.vfGraphData[index - 1].color
                  final_dp = count_inc
                  count_inc++
                  if (index == this.vfGraphData.length - 1 && count_inc >= 1) {
                    final_dp = count_inc
                    graph[count_inc]['x'] = this.vfGraphData[index].x
                    graph[count_inc]['y'] = this.vfGraphData[index].y
                    graph[count_inc]['color'] = this.vfGraphData[index].color
                  }
                }
              }
              init2++
            }
          }
        }
        var beforeDate = null
        var dtArr = []
        var dt = 0
        if (test_cond === true) {
          for (let i = graph.length - 1; i > -1; i--) {
            if (graph[i]['y'] != undefined) {
              dtArr[dt] = graph[i]
              dt++
            }
          }
        } else {
          for (let i = final_dp; i > -1; i--) {
            if (graph[i]['y'] != undefined) {
              dtArr[dt] = graph[i]
              dt++
            }
          }
        }
        if (dtArr.length < 2) {
          $('#vfChartContainer').hide()
          this.showMinimumError = true
          this.loadingMessage = false
        } else {
          $('#vfChartContainer').show()
          this.showMinimumError = false;
        }
        if (test_cond) {
          var chartFor2Days = new CanvasJS.Chart("vfChartContainer",
            {
              toolTip: {
                fontFamily: "'Quicksand', 'sans-serif'",
                borderThickness: "0",
                cornerRadius: 10,
                content: "<span style='\"'color: {color}'\"'>Visceral Fat : {y} kg <br>Date : {x}</span>"
              },
              animationEnabled: true,
              animationDuration: 2000,
              axisX: {
                lineThickness: 0,
                tickThickness: 0,
                gridColor: "Silver",
                valueFormatString: "DD/MMM hh TT",
                labelFontSize: 12,
                labelFontWeight: "bold",
                labelFontColor: "#808080",
                labelFontFamily: "'Quicksand', 'sans-serif'"
              },
              axisY: {
                maximum: 200,
                lineThickness: 0,
                tickThickness: 0,
                gridThickness: 0,
                labelFontSize: 12,
                labelFontWeight: "bold",
                labelFontColor: "#808080",
                labelFontFamily: "'Quicksand', 'sans-serif'",
                includeZero: false
              },
              legend: {
                fontSize: 15,
                fontFamily: "'Quicksand', 'sans-serif'",
                fontColor: "#808080"
              },
              data: [
                {
                  type: "splineArea",
                  showInLegend: true,
                  legendText: "Low",
                  legendMarkerType: "square",
                  legendMarkerColor: "#ff9800",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                {
                  type: "splineArea",
                  showInLegend: true,
                  legendText: "Normal",
                  legendMarkerType: "square",
                  legendMarkerColor: "#43A047",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                {
                  type: "splineArea",
                  showInLegend: true,
                  legendText: "High",
                  legendMarkerType: "square",
                  legendMarkerColor: "#d32f2f",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                {
                  type: "splineArea",
                  lineThickness: 2,
                  lineColor: "#4885ed",
                  fillOpacity: 0.1,
                  markerSize: 10,
                  dataPoints: dtArr
                }
              ]
            })
          setTimeout(() => {
            this.loadingMessage = false
            chartFor2Days.render()
          }, 2000)
        }
        else {
          var vfChart = new CanvasJS.Chart("vfChartContainer",
            {
              toolTip: {
                fontFamily: "'Quicksand', 'sans-serif'",
                borderThickness: "0",
                cornerRadius: 10,
                content: "<span style='\"'color: {color}'\"'>Visceral Fat : {y} kg <br>Date : {x}</span>"
              },
              animationEnabled: true,
              animationDuration: 2000,
              axisX: {
                lineThickness: 0,
                tickThickness: 0,
                gridColor: "Silver",
                valueFormatString: "DD/MMM",
                labelFontSize: 12,
                labelFontWeight: "bold",
                labelFontColor: "#808080",
                labelFontFamily: "'Quicksand', 'sans-serif'"
              },
              axisY: {
                maximum: 200,
                lineThickness: 0,
                tickThickness: 0,
                gridThickness: 0,
                labelFontSize: 12,
                labelFontWeight: "bold",
                labelFontColor: "#808080",
                labelFontFamily: "'Quicksand', 'sans-serif'",
                includeZero: false
              },
              legend: {
                fontSize: 15,
                fontFamily: "'Quicksand', 'sans-serif'",
                fontColor: "#808080"
              },
              data: [
                {
                  type: "splineArea",
                  showInLegend: true,
                  legendText: "Low",
                  legendMarkerType: "square",
                  legendMarkerColor: "#ff9800",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                {
                  type: "splineArea",
                  showInLegend: true,
                  legendText: "Normal",
                  legendMarkerType: "square",
                  legendMarkerColor: "#43A047",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                {
                  type: "splineArea",
                  showInLegend: true,
                  legendText: "High",
                  legendMarkerType: "square",
                  legendMarkerColor: "#d32f2f",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                {
                  type: "splineArea",
                  lineThickness: 2,
                  lineColor: "#4885ed",
                  fillOpacity: 0.1,
                  markerSize: 10,
                  dataPoints: dtArr
                }
              ]
            })
          setTimeout(() => {
            this.loadingMessage = false
            vfChart.render()
          }, 3000)
        }
      }
    }

    if (this.testType == "Protein") {
      if (this.proteinGraphData.length < 2) {
        this.showMinimumError = true
        this.loadingMessage = false
      }
      else {
        this.showMinimumError = false
        for (let index = 0, count_inc = 0, init2 = 0; this.proteinGraphData.length > index; index++) {
          graph[index] = {}
          if (GraphPeriod !== "showAllDays") {
            var testTakenDate = this.proteinGraphData[index].x
          }
          if (index == 0) {
            if (GraphPeriod === "showAllDays") {
              var DateOnlyInit = new Date(this.proteinGraphData[index].z.slice(0, -10))
            }
          }
          if (GraphPeriod === "showAllDays") {
            if (index > 0) {
              var DateOnlyPrev = new Date(this.proteinGraphData[index - 1].z.slice(0, -10))
              var DateOnlyCurrent = new Date(this.proteinGraphData[index].z.slice(0, -10))
              var DateOnlyLast = new Date(this.proteinGraphData[this.proteinGraphData.length - 1].z.slice(0, -10))
              var diffInTimestampForLast = DateOnlyLast.valueOf() - DateOnlyInit.valueOf()
              var diffInHoursForLastStart = diffInTimestampForLast / 1000 / 60 / 60
              if (diffInHoursForLastStart <= 48) {
                graph[index - 1]['x'] = this.proteinGraphData[index - 1].x
                graph[index - 1]['y'] = this.proteinGraphData[index - 1].y
                graph[index - 1]['color'] = this.proteinGraphData[index - 1].color
                graph[index]['x'] = this.proteinGraphData[index].x
                graph[index]['y'] = this.proteinGraphData[index].y
                graph[index]['color'] = this.proteinGraphData[index].color
                test_cond = true
              }
              var dateDiff = this.timeDifference(DateOnlyCurrent, DateOnlyPrev);
              if (index == this.proteinGraphData.length - 1 && count_inc >= 1) {
                final_dp = count_inc;
                graph[count_inc]['x'] = this.proteinGraphData[index].x
                graph[count_inc]['y'] = this.proteinGraphData[index].y
                graph[count_inc]['color'] = this.proteinGraphData[index].color
              }
              if (dateDiff == 0) {
                //Nothing to do
              } else {
                if (diffInHoursForLastStart <= 48) {
                  test_cond = true
                } else {
                  test_cond = false;
                  graph[count_inc]['x'] = this.proteinGraphData[index - 1].x
                  graph[count_inc]['y'] = this.proteinGraphData[index - 1].y
                  graph[count_inc]['color'] = this.proteinGraphData[index - 1].color
                  final_dp = count_inc;
                  count_inc++;
                  if (index == this.proteinGraphData.length - 1 && count_inc >= 1 && diffInHoursForLastStart >= 48) {
                    final_dp = count_inc;
                    graph[count_inc]['x'] = this.proteinGraphData[index].x
                    graph[count_inc]['y'] = this.proteinGraphData[index].y
                    graph[count_inc]['color'] = this.proteinGraphData[index].color
                  }
                }
              }
            }
          }
          else {
            if (last90Days <= testTakenDate) {
              if (init2 == 0) {
                var DateOnlyInit = new Date(this.proteinGraphData[index].z.slice(0, -10))
                var DateOnlyLast = new Date(this.proteinGraphData[this.proteinGraphData.length - 1].z.slice(0, -10))
                var diffInTimestampForLast = DateOnlyLast.valueOf() - DateOnlyInit.valueOf()
                var diffInHoursForLastStart = diffInTimestampForLast / 1000 / 60 / 60
              }
              if (diffInHoursForLastStart <= 48) {
                graph[count_inc]['x'] = this.proteinGraphData[index].x
                graph[count_inc]['y'] = this.proteinGraphData[index].y
                graph[count_inc]['color'] = this.proteinGraphData[index].color
                test_cond = true
                count_inc++
              }
              var DateOnly = new Date(this.proteinGraphData[index].z.slice(0, -10))
              if (index > 0 && init2 > 0) {
                var DateOnlyPrev = new Date(this.proteinGraphData[index - 1].z.slice(0, -10))
                var dateDiff = this.timeDifference(DateOnly, DateOnlyPrev)
                if (index == this.proteinGraphData.length - 1 && count_inc >= 1 && diffInHoursForLastStart > 48) {
                  final_dp = count_inc
                  graph[count_inc]['x'] = this.proteinGraphData[index].x
                  graph[count_inc]['y'] = this.proteinGraphData[index].y
                  graph[count_inc]['color'] = this.proteinGraphData[index].color
                }
                if (dateDiff == 0 || diffInHoursForLastStart <= 48) {
                  //Nothing to do
                } else {
                  test_cond = false
                  graph[count_inc]['x'] = this.proteinGraphData[index - 1].x
                  graph[count_inc]['y'] = this.proteinGraphData[index - 1].y
                  graph[count_inc]['color'] = this.proteinGraphData[index - 1].color
                  final_dp = count_inc
                  count_inc++
                  if (index == this.proteinGraphData.length - 1 && count_inc >= 1) {
                    final_dp = count_inc
                    graph[count_inc]['x'] = this.proteinGraphData[index].x
                    graph[count_inc]['y'] = this.proteinGraphData[index].y
                    graph[count_inc]['color'] = this.proteinGraphData[index].color
                  }
                }
              }
              init2++
            }
          }
        }
        var beforeDate = null
        var dtArr = []
        var dt = 0
        if (test_cond === true) {
          for (let i = graph.length - 1; i > -1; i--) {
            if (graph[i]['y'] != undefined) {
              dtArr[dt] = graph[i]
              dt++
            }
          }
        } else {
          for (let i = final_dp; i > -1; i--) {
            if (graph[i]['y'] != undefined) {
              dtArr[dt] = graph[i]
              dt++
            }
          }
        }
        if (dtArr.length < 2) {
          $('#proteinChartContainer').hide()
          this.showMinimumError = true
          this.loadingMessage = false
        } else {
          $('#proteinChartContainer').show()
          this.showMinimumError = false;
        }
        if (test_cond) {
          var chartFor2Days = new CanvasJS.Chart("proteinChartContainer",
            {
              toolTip: {
                fontFamily: "'Quicksand', 'sans-serif'",
                borderThickness: "0",
                cornerRadius: 10,
                content: "<span style='\"'color: {color}'\"'>Protein : {y} kg <br>Date : {x}</span>"
              },
              animationEnabled: true,
              animationDuration: 2000,
              axisX: {
                lineThickness: 0,
                tickThickness: 0,
                gridColor: "Silver",
                valueFormatString: "DD/MMM hh TT",
                labelFontSize: 12,
                labelFontWeight: "bold",
                labelFontColor: "#808080",
                labelFontFamily: "'Quicksand', 'sans-serif'"
              },
              axisY: {
                maximum: 120,
                lineThickness: 0,
                tickThickness: 0,
                gridThickness: 0,
                labelFontSize: 12,
                labelFontWeight: "bold",
                labelFontColor: "#808080",
                labelFontFamily: "'Quicksand', 'sans-serif'",
                includeZero: false
              },
              legend: {
                fontSize: 15,
                fontFamily: "'Quicksand', 'sans-serif'",
                fontColor: "#808080"
              },
              data: [
                {
                  type: "splineArea",
                  showInLegend: true,
                  legendText: "Low",
                  legendMarkerType: "square",
                  legendMarkerColor: "#ff9800",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                {
                  type: "splineArea",
                  showInLegend: true,
                  legendText: "Normal",
                  legendMarkerType: "square",
                  legendMarkerColor: "#43A047",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                {
                  type: "splineArea",
                  showInLegend: true,
                  legendText: "High",
                  legendMarkerType: "square",
                  legendMarkerColor: "#d32f2f",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                {
                  type: "splineArea",
                  lineThickness: 2,
                  lineColor: "#4885ed",
                  fillOpacity: 0.1,
                  markerSize: 10,
                  dataPoints: dtArr
                }
              ]
            })
          setTimeout(() => {
            this.loadingMessage = false
            chartFor2Days.render()
          }, 2000)
        }
        else {
          var proteinChart = new CanvasJS.Chart("proteinChartContainer",
            {
              toolTip: {
                fontFamily: "'Quicksand', 'sans-serif'",
                borderThickness: "0",
                cornerRadius: 10,
                content: "<span style='\"'color: {color}'\"'>Protein : {y} kg <br>Date : {x}</span>"
              },
              animationEnabled: true,
              animationDuration: 2000,
              axisX: {
                lineThickness: 0,
                tickThickness: 0,
                gridColor: "Silver",
                valueFormatString: "DD/MMM",
                labelFontSize: 12,
                labelFontWeight: "bold",
                labelFontColor: "#808080",
                labelFontFamily: "'Quicksand', 'sans-serif'"
              },
              axisY: {
                maximum: 120,
                lineThickness: 0,
                tickThickness: 0,
                gridThickness: 0,
                labelFontSize: 12,
                labelFontWeight: "bold",
                labelFontColor: "#808080",
                labelFontFamily: "'Quicksand', 'sans-serif'",
                includeZero: false
              },
              legend: {
                fontSize: 15,
                fontFamily: "'Quicksand', 'sans-serif'",
                fontColor: "#808080"
              },
              data: [
                {
                  type: "splineArea",
                  showInLegend: true,
                  legendText: "Low",
                  legendMarkerType: "square",
                  legendMarkerColor: "#ff9800",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                {
                  type: "splineArea",
                  showInLegend: true,
                  legendText: "Normal",
                  legendMarkerType: "square",
                  legendMarkerColor: "#43A047",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                {
                  type: "splineArea",
                  showInLegend: true,
                  legendText: "High",
                  legendMarkerType: "square",
                  legendMarkerColor: "#d32f2f",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                {
                  type: "splineArea",
                  lineThickness: 2,
                  lineColor: "#4885ed",
                  fillOpacity: 0.1,
                  markerSize: 10,
                  dataPoints: dtArr
                }
              ]
            })
          setTimeout(() => {
            this.loadingMessage = false
            proteinChart.render()
          }, 3000)
        }
      }
    }

    if (this.testType == "Basal Metabolic Rate") {
      if (this.bmrGraphData.length < 2) {
        this.showMinimumError = true
        this.loadingMessage = false
      }
      else {
        //Flow works fyn As per requirement hided bmr status - To show color code for low,normal comment for-loop alone 
        //code starts here
        for(let key in this.bmrGraphData){
          this.bmrGraphData[key].color = "#9a9da1";      
        }  
        //code ends here  
        this.showMinimumError = false
        for (let index = 0, count_inc = 0, init2 = 0; this.bmrGraphData.length > index; index++) {
          graph[index] = {}
          if (GraphPeriod !== "showAllDays") {
            var testTakenDate = this.bmrGraphData[index].x
          }
          if (index == 0) {
            if (GraphPeriod === "showAllDays") {
              var DateOnlyInit = new Date(this.bmrGraphData[index].z.slice(0, -10))
            }
          }
          if (GraphPeriod === "showAllDays") {
            if (index > 0) {
              var DateOnlyPrev = new Date(this.bmrGraphData[index - 1].z.slice(0, -10))
              var DateOnlyCurrent = new Date(this.bmrGraphData[index].z.slice(0, -10))
              var DateOnlyLast = new Date(this.bmrGraphData[this.bmrGraphData.length - 1].z.slice(0, -10))
              var diffInTimestampForLast = DateOnlyLast.valueOf() - DateOnlyInit.valueOf()
              var diffInHoursForLastStart = diffInTimestampForLast / 1000 / 60 / 60
              if (diffInHoursForLastStart <= 48) {
                graph[index - 1]['x'] = this.bmrGraphData[index - 1].x
                graph[index - 1]['y'] = this.bmrGraphData[index - 1].y
                graph[index - 1]['color'] = this.bmrGraphData[index - 1].color
                graph[index]['x'] = this.bmrGraphData[index].x
                graph[index]['y'] = this.bmrGraphData[index].y
                graph[index]['color'] = this.bmrGraphData[index].color
                test_cond = true
              }
              var dateDiff = this.timeDifference(DateOnlyCurrent, DateOnlyPrev);
              if (index == this.bmrGraphData.length - 1 && count_inc >= 1) {
                final_dp = count_inc;
                graph[count_inc]['x'] = this.bmrGraphData[index].x
                graph[count_inc]['y'] = this.bmrGraphData[index].y
                graph[count_inc]['color'] = this.bmrGraphData[index].color
              }
              if (dateDiff == 0) {
                //Nothing to do
              } else {
                if (diffInHoursForLastStart <= 48) {
                  test_cond = true
                } else {
                  test_cond = false;
                  graph[count_inc]['x'] = this.bmrGraphData[index - 1].x
                  graph[count_inc]['y'] = this.bmrGraphData[index - 1].y
                  graph[count_inc]['color'] = this.bmrGraphData[index - 1].color
                  final_dp = count_inc;
                  count_inc++;
                  if (index == this.bmrGraphData.length - 1 && count_inc >= 1 && diffInHoursForLastStart >= 48) {
                    final_dp = count_inc;
                    graph[count_inc]['x'] = this.bmrGraphData[index].x
                    graph[count_inc]['y'] = this.bmrGraphData[index].y
                    graph[count_inc]['color'] = this.bmrGraphData[index].color
                  }
                }
              }
            }
          }
          else {
            if (last90Days <= testTakenDate) {
              if (init2 == 0) {
                var DateOnlyInit = new Date(this.bmrGraphData[index].z.slice(0, -10))
                var DateOnlyLast = new Date(this.bmrGraphData[this.bmrGraphData.length - 1].z.slice(0, -10))
                var diffInTimestampForLast = DateOnlyLast.valueOf() - DateOnlyInit.valueOf()
                var diffInHoursForLastStart = diffInTimestampForLast / 1000 / 60 / 60
              }
              if (diffInHoursForLastStart <= 48) {
                graph[count_inc]['x'] = this.bmrGraphData[index].x
                graph[count_inc]['y'] = this.bmrGraphData[index].y
                graph[count_inc]['color'] = this.bmrGraphData[index].color
                test_cond = true
                count_inc++
              }
              var DateOnly = new Date(this.bmrGraphData[index].z.slice(0, -10))
              if (index > 0 && init2 > 0) {
                var DateOnlyPrev = new Date(this.bmrGraphData[index - 1].z.slice(0, -10))
                var dateDiff = this.timeDifference(DateOnly, DateOnlyPrev)
                if (index == this.bmrGraphData.length - 1 && count_inc >= 1 && diffInHoursForLastStart > 48) {
                  final_dp = count_inc
                  graph[count_inc]['x'] = this.bmrGraphData[index].x
                  graph[count_inc]['y'] = this.bmrGraphData[index].y
                  graph[count_inc]['color'] = this.bmrGraphData[index].color
                }
                if (dateDiff == 0 || diffInHoursForLastStart <= 48) {
                  //Nothing to do
                } else {
                  test_cond = false
                  graph[count_inc]['x'] = this.bmrGraphData[index - 1].x
                  graph[count_inc]['y'] = this.bmrGraphData[index - 1].y
                  graph[count_inc]['color'] = this.bmrGraphData[index - 1].color
                  final_dp = count_inc
                  count_inc++
                  if (index == this.bmrGraphData.length - 1 && count_inc >= 1) {
                    final_dp = count_inc
                    graph[count_inc]['x'] = this.bmrGraphData[index].x
                    graph[count_inc]['y'] = this.bmrGraphData[index].y
                    graph[count_inc]['color'] = this.bmrGraphData[index].color
                  }
                }
              }
              init2++
            }
          }
        }
        var beforeDate = null
        var dtArr = []
        var dt = 0
        if (test_cond === true) {
          for (let i = graph.length - 1; i > -1; i--) {
            if (graph[i]['y'] != undefined) {
              dtArr[dt] = graph[i]
              dt++
            }
          }
        } else {
          for (let i = final_dp; i > -1; i--) {
            if (graph[i]['y'] != undefined) {
              dtArr[dt] = graph[i]
              dt++
            }
          }
        }
        if (dtArr.length < 2) {
          $('#bmrChartContainer').hide()
          this.showMinimumError = true
          this.loadingMessage = false
        } else {
          $('#bmrChartContainer').show()
          this.showMinimumError = false;
        }
        if (test_cond) {
          var chartFor2Days = new CanvasJS.Chart("bmrChartContainer",
            {
              toolTip: {
                fontFamily: "'Quicksand', 'sans-serif'",
                borderThickness: "0",
                cornerRadius: 10,
                content: "<span style='\"'color: {color}'\"'>BMR : {y} kg <br>Date : {x}</span>"
              },
              animationEnabled: true,
              animationDuration: 2000,
              axisX: {
                lineThickness: 0,
                tickThickness: 0,
                gridColor: "Silver",
                valueFormatString: "DD/MMM hh TT",
                labelFontSize: 12,
                labelFontWeight: "bold",
                labelFontColor: "#808080",
                labelFontFamily: "'Quicksand', 'sans-serif'"
              },
              axisY: {
                maximum: 2000,
                lineThickness: 0,
                tickThickness: 0,
                gridThickness: 0,
                labelFontSize: 12,
                labelFontWeight: "bold",
                labelFontColor: "#808080",
                labelFontFamily: "'Quicksand', 'sans-serif'",
                includeZero: false
              },
              legend: {
                fontSize: 15,
                fontFamily: "'Quicksand', 'sans-serif'",
                fontColor: "#808080"
              },
              data: [
                {
                  type: "splineArea",
                  showInLegend: false,// false-> hided bmr status in x-axis, true-> will show color code in x-axis
                  legendText: "Low",
                  legendMarkerType: "square",
                  legendMarkerColor: "#d32f2f",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                {
                  type: "splineArea",
                  showInLegend: false,// false-> hided bmr status in x-axis, true-> will show color code in x-axis
                  legendText: "Normal",
                  legendMarkerType: "square",
                  legendMarkerColor: "#43A047",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                {
                  type: "splineArea",
                  lineThickness: 2,
                  lineColor: "#4885ed",
                  fillOpacity: 0.1,
                  markerSize: 10,
                  dataPoints: dtArr
                }
              ]
            })
          setTimeout(() => {
            this.loadingMessage = false
            chartFor2Days.render()
          }, 2000)
        }
        else {
          var bmrChart = new CanvasJS.Chart("bmrChartContainer",
            {
              toolTip: {
                fontFamily: "'Quicksand', 'sans-serif'",
                borderThickness: "0",
                cornerRadius: 10,
                content: "<span style='\"'color: {color}'\"'>BMR : {y} kg <br>Date : {x}</span>"
              },
              animationEnabled: true,
              animationDuration: 2000,
              axisX: {
                lineThickness: 0,
                tickThickness: 0,
                gridColor: "Silver",
                valueFormatString: "DD/MMM",
                labelFontSize: 12,
                labelFontWeight: "bold",
                labelFontColor: "#808080",
                labelFontFamily: "'Quicksand', 'sans-serif'"
              },
              axisY: {
                maximum: 2000,
                lineThickness: 0,
                tickThickness: 0,
                gridThickness: 0,
                labelFontSize: 12,
                labelFontWeight: "bold",
                labelFontColor: "#808080",
                labelFontFamily: "'Quicksand', 'sans-serif'",
                includeZero: false
              },
              legend: {
                fontSize: 15,
                fontFamily: "'Quicksand', 'sans-serif'",
                fontColor: "#808080"
              },
              data: [
                {
                  type: "splineArea",
                  showInLegend: false,// false-> hided bmr status in x-axis, true-> will show color code in x-axis
                  legendText: "Low",
                  legendMarkerType: "square",
                  legendMarkerColor: "#d32f2f",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                {
                  type: "splineArea",
                  showInLegend: false,// false-> hided bmr status in x-axis, true-> will show color code in x-axis
                  legendText: "Normal",
                  legendMarkerType: "square",
                  legendMarkerColor: "#43A047",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                {
                  type: "splineArea",
                  lineThickness: 2,
                  lineColor: "#4885ed",
                  fillOpacity: 0.1,
                  markerSize: 10,
                  dataPoints: dtArr
                }
              ]
            })
          setTimeout(() => {
            this.loadingMessage = false
            bmrChart.render()
          }, 3000)
        }
      }
    }

    // sandip full body BmC Graph plotting ends

    if (this.testType == "WEIGHT") {
      if (this.bmiGraphData.length < 2) {
        this.showMinimumError = true
        this.loadingMessage = false
      }
      else {
        this.showMinimumError = false
        for (let index = 0, count_inc = 0, init2 = 0; this.weightGraphData.length > index; index++) {
          graph[index] = {}
          if (GraphPeriod !== "showAllDays") {
            var testTakenDate = this.weightGraphData[index].x
          }
          if (index == 0) {
            if (GraphPeriod === "showAllDays") {
              var DateOnlyInit = new Date(this.weightGraphData[index].z.slice(0, -10))
            }
          }
          if (GraphPeriod === "showAllDays") {
            if (index > 0) {
              var DateOnlyPrev = new Date(this.weightGraphData[index - 1].z.slice(0, -10))
              var DateOnlyCurrent = new Date(this.weightGraphData[index].z.slice(0, -10))
              var DateOnlyLast = new Date(this.weightGraphData[this.weightGraphData.length - 1].z.slice(0, -10))
              var diffInTimestampForLast = DateOnlyLast.valueOf() - DateOnlyInit.valueOf()
              var diffInHoursForLastStart = diffInTimestampForLast / 1000 / 60 / 60
              if (diffInHoursForLastStart <= 48) {
                graph[index - 1]['x'] = this.weightGraphData[index - 1].x
                graph[index - 1]['y'] = this.weightGraphData[index - 1].y
                graph[index - 1]['color'] = this.weightGraphData[index - 1].color
                graph[index]['x'] = this.weightGraphData[index].x
                graph[index]['y'] = this.weightGraphData[index].y
                graph[index]['color'] = this.weightGraphData[index].color
                test_cond = true
              }
              var dateDiff = this.timeDifference(DateOnlyCurrent, DateOnlyPrev);
              if (index == this.weightGraphData.length - 1 && count_inc >= 1) {
                final_dp = count_inc;
                graph[count_inc]['x'] = this.weightGraphData[index].x
                graph[count_inc]['y'] = this.weightGraphData[index].y
                graph[count_inc]['color'] = this.weightGraphData[index].color
              }
              if (dateDiff == 0) {
                //Nothing to do
              } else {
                if (diffInHoursForLastStart <= 48) {
                  test_cond = true
                } else {
                  test_cond = false;
                  graph[count_inc]['x'] = this.weightGraphData[index - 1].x
                  graph[count_inc]['y'] = this.weightGraphData[index - 1].y
                  graph[count_inc]['color'] = this.weightGraphData[index - 1].color
                  final_dp = count_inc;
                  count_inc++;
                  if (index == this.weightGraphData.length - 1 && count_inc >= 1 && diffInHoursForLastStart >= 48) {
                    final_dp = count_inc;
                    graph[count_inc]['x'] = this.weightGraphData[index].x
                    graph[count_inc]['y'] = this.weightGraphData[index].y
                    graph[count_inc]['color'] = this.weightGraphData[index].color
                  }
                }
              }
            }
          }
          else {
            if (last90Days <= testTakenDate) {
              if (init2 == 0) {
                var DateOnlyInit = new Date(this.weightGraphData[index].z.slice(0, -10))
                var DateOnlyLast = new Date(this.weightGraphData[this.weightGraphData.length - 1].z.slice(0, -10))
                var diffInTimestampForLast = DateOnlyLast.valueOf() - DateOnlyInit.valueOf()
                var diffInHoursForLastStart = diffInTimestampForLast / 1000 / 60 / 60
              }
              if (diffInHoursForLastStart <= 48) {
                graph[count_inc]['x'] = this.weightGraphData[index].x
                graph[count_inc]['y'] = this.weightGraphData[index].y
                graph[count_inc]['color'] = this.weightGraphData[index].color
                test_cond = true
                count_inc++
              }
              var DateOnly = new Date(this.weightGraphData[index].z.slice(0, -10))
              if (index > 0 && init2 > 0) {
                var DateOnlyPrev = new Date(this.weightGraphData[index - 1].z.slice(0, -10))
                var dateDiff = this.timeDifference(DateOnly, DateOnlyPrev)
                if (index == this.weightGraphData.length - 1 && count_inc >= 1 && diffInHoursForLastStart > 48) {
                  final_dp = count_inc
                  graph[count_inc]['x'] = this.weightGraphData[index].x
                  graph[count_inc]['y'] = this.weightGraphData[index].y
                  graph[count_inc]['color'] = this.weightGraphData[index].color
                }
                if (dateDiff == 0 || diffInHoursForLastStart <= 48) {
                  //Nothing to do
                } else {
                  test_cond = false
                  graph[count_inc]['x'] = this.weightGraphData[index - 1].x
                  graph[count_inc]['y'] = this.weightGraphData[index - 1].y
                  graph[count_inc]['color'] = this.weightGraphData[index - 1].color
                  final_dp = count_inc
                  count_inc++
                  if (index == this.weightGraphData.length - 1 && count_inc >= 1) {
                    final_dp = count_inc
                    graph[count_inc]['x'] = this.weightGraphData[index].x
                    graph[count_inc]['y'] = this.weightGraphData[index].y
                    graph[count_inc]['color'] = this.weightGraphData[index].color
                  }
                }
              }
              init2++
            }
          }
        }
        var beforeDate = null
        var dtArr = []
        var dt = 0
        if (test_cond === true) {
          for (let i = graph.length - 1; i > -1; i--) {
            if (graph[i]['y'] != undefined) {
              dtArr[dt] = graph[i]
              dt++
            }
          }
        } else {
          for (let i = final_dp; i > -1; i--) {
            if (graph[i]['y'] != undefined) {
              dtArr[dt] = graph[i]
              dt++
            }
          }
        }
        if (dtArr.length < 2) {
          $('#weightChartContainer').hide()
          this.showMinimumError = true
          this.loadingMessage = false
        } else {
          $('#weightChartContainer').show()
          this.showMinimumError = false;
        }
        if (test_cond) {
          var chartFor2Days = new CanvasJS.Chart("weightChartContainer",
            {
              toolTip: {
                fontFamily: "'Quicksand', 'sans-serif'",
                borderThickness: "0",
                cornerRadius: 10,
                content: "<span style='\"'color: {color}'\"'>Weight : {y} kg <br>Date : {x}</span>"
              },
              animationEnabled: true,
              animationDuration: 2000,
              axisX: {
                lineThickness: 0,
                tickThickness: 0,
                gridColor: "Silver",
                valueFormatString: "DD/MMM hh TT",
                labelFontSize: 12,
                labelFontWeight: "bold",
                labelFontColor: "#808080",
                labelFontFamily: "'Quicksand', 'sans-serif'"
              },
              axisY: {
                maximum: 120,
                lineThickness: 0,
                tickThickness: 0,
                gridThickness: 0,
                labelFontSize: 12,
                labelFontWeight: "bold",
                labelFontColor: "#808080",
                labelFontFamily: "'Quicksand', 'sans-serif'",
                includeZero: false
              },
              legend: {
                fontSize: 15,
                fontFamily: "'Quicksand', 'sans-serif'",
                fontColor: "#808080"
              },
              data: [
                {
                  type: "splineArea",
                  showInLegend: true,
                  legendText: "Normal",
                  legendMarkerType: "square",
                  legendMarkerColor: "#43A047",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                {
                  type: "splineArea",
                  showInLegend: true,
                  legendText: "Low",
                  legendMarkerType: "square",
                  legendMarkerColor: "#ff9800",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                // {
                //   type: "splineArea",
                //   showInLegend: true,
                //   legendText: "OverWeight",
                //   legendMarkerType: "square",
                //   legendMarkerColor: "#ff5722",
                //   fillOpacity: 0,
                //   lineThickness: 0,
                //   markerSize: 0,
                //   dataPoints: dtArr
                // },
                {
                  type: "splineArea",
                  showInLegend: true,
                  legendText: "High",
                  legendMarkerType: "square",
                  legendMarkerColor: "#d32f2f",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                {
                  type: "splineArea",
                  lineThickness: 2,
                  lineColor: "#4885ed",
                  fillOpacity: 0.1,
                  markerSize: 10,
                  dataPoints: dtArr
                }
              ]
            })
          setTimeout(() => {
            this.loadingMessage = false
            chartFor2Days.render()
          }, 2000)
        }
        else {
          var weightChart = new CanvasJS.Chart("weightChartContainer",
            {
              toolTip: {
                fontFamily: "'Quicksand', 'sans-serif'",
                borderThickness: "0",
                cornerRadius: 10,
                content: "<span style='\"'color: {color}'\"'>Weight : {y} kg <br>Date : {x}</span>"
              },
              animationEnabled: true,
              animationDuration: 2000,
              axisX: {
                lineThickness: 0,
                tickThickness: 0,
                gridColor: "Silver",
                valueFormatString: "DD/MMM",
                labelFontSize: 12,
                labelFontWeight: "bold",
                labelFontColor: "#808080",
                labelFontFamily: "'Quicksand', 'sans-serif'"
              },
              axisY: {
                maximum: 120,
                lineThickness: 0,
                tickThickness: 0,
                gridThickness: 0,
                labelFontSize: 12,
                labelFontWeight: "bold",
                labelFontColor: "#808080",
                labelFontFamily: "'Quicksand', 'sans-serif'",
                includeZero: false
              },
              legend: {
                fontSize: 15,
                fontFamily: "'Quicksand', 'sans-serif'",
                fontColor: "#808080"
              },
              data: [
                {
                  type: "splineArea",
                  showInLegend: true,
                  legendText: "Normal",
                  legendMarkerType: "square",
                  legendMarkerColor: "#43A047",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                {
                  type: "splineArea",
                  showInLegend: true,
                  legendText: "Low",
                  legendMarkerType: "square",
                  legendMarkerColor: "#ff9800",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                // {
                //   type: "splineArea",
                //   showInLegend: true,
                //   legendText: "OverWeight",
                //   legendMarkerType: "square",
                //   legendMarkerColor: "#ff5722",
                //   fillOpacity: 0,
                //   lineThickness: 0,
                //   markerSize: 0,
                //   dataPoints: dtArr
                // },
                {
                  type: "splineArea",
                  showInLegend: true,
                  legendText: "High",
                  legendMarkerType: "square",
                  legendMarkerColor: "#d32f2f",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                {
                  type: "splineArea",
                  lineThickness: 2,
                  lineColor: "#4885ed",
                  fillOpacity: 0.1,
                  markerSize: 10,
                  dataPoints: dtArr
                }
              ]
            })
          setTimeout(() => {
            this.loadingMessage = false
            weightChart.render()
          }, 3000)
        }
      }
    }
    if (this.testType === "BMI") {
      if (this.bmiGraphData.length < 2) {
        this.showMinimumError = true
        this.loadingMessage = false
      }
      else {
        this.showMinimumError = false
        for (let index = 0, count_inc = 0, init2 = 0; this.bmiGraphData.length > index; index++) {
          graph[index] = {}
          if (GraphPeriod !== "showAllDays") {
            var testTakenDate = this.bmiGraphData[index].x
          }
          if (index == 0) {
            if (GraphPeriod === "showAllDays") {
              var DateOnlyInit = new Date(this.bmiGraphData[index].z.slice(0, -10))
            }
          }
          if (GraphPeriod === "showAllDays") {
            if (index > 0) {
              var DateOnlyPrev = new Date(this.bmiGraphData[index - 1].z.slice(0, -10))
              var DateOnlyCurrent = new Date(this.bmiGraphData[index].z.slice(0, -10))
              var DateOnlyLast = new Date(this.bmiGraphData[this.weightGraphData.length - 1].z.slice(0, -10))
              var diffInTimestampForLast = DateOnlyLast.valueOf() - DateOnlyInit.valueOf()
              var diffInHoursForLastStart = diffInTimestampForLast / 1000 / 60 / 60
              if (diffInHoursForLastStart <= 48) {
                graph[index - 1]['x'] = this.bmiGraphData[index - 1].x
                graph[index - 1]['y'] = this.bmiGraphData[index - 1].y
                graph[index - 1]['color'] = this.bmiGraphData[index - 1].color
                graph[index]['x'] = this.bmiGraphData[index].x
                graph[index]['y'] = this.bmiGraphData[index].y
                graph[index]['color'] = this.bmiGraphData[index].color
                test_cond = true
              }
              var dateDiff = this.timeDifference(DateOnlyCurrent, DateOnlyPrev);
              if (index == this.bmiGraphData.length - 1 && count_inc >= 1) {
                final_dp = count_inc;
                graph[count_inc]['x'] = this.bmiGraphData[index].x
                graph[count_inc]['y'] = this.bmiGraphData[index].y
                graph[count_inc]['color'] = this.bmiGraphData[index].color
              }
              if (dateDiff == 0) {
                //Nothing to do
              } else {
                if (diffInHoursForLastStart <= 48) {
                  test_cond = true
                } else {
                  test_cond = false;
                  graph[count_inc]['x'] = this.bmiGraphData[index - 1].x
                  graph[count_inc]['y'] = this.bmiGraphData[index - 1].y
                  graph[count_inc]['color'] = this.bmiGraphData[index - 1].color
                  final_dp = count_inc;
                  count_inc++;
                  if (index == this.bmiGraphData.length - 1 && count_inc >= 1 && diffInHoursForLastStart >= 48) {
                    final_dp = count_inc;
                    graph[count_inc]['x'] = this.bmiGraphData[index].x
                    graph[count_inc]['y'] = this.bmiGraphData[index].y
                    graph[count_inc]['color'] = this.bmiGraphData[index].color
                  }
                }
              }
            }
          }
          else {
            if (last90Days <= testTakenDate) {
              if (init2 == 0) {
                var DateOnlyInit = new Date(this.bmiGraphData[index].z.slice(0, -10))
                var DateOnlyLast = new Date(this.bmiGraphData[this.bmiGraphData.length - 1].z.slice(0, -10))
                var diffInTimestampForLast = DateOnlyLast.valueOf() - DateOnlyInit.valueOf()
                var diffInHoursForLastStart = diffInTimestampForLast / 1000 / 60 / 60
              }
              if (diffInHoursForLastStart <= 48) {
                graph[count_inc]['x'] = this.bmiGraphData[index].x
                graph[count_inc]['y'] = this.bmiGraphData[index].y
                graph[count_inc]['color'] = this.bmiGraphData[index].color
                test_cond = true
                count_inc++
              }
              var DateOnly = new Date(this.bmiGraphData[index].z.slice(0, -10))
              if (index > 0 && init2 > 0) {
                var DateOnlyPrev = new Date(this.bmiGraphData[index - 1].z.slice(0, -10))
                var dateDiff = this.timeDifference(DateOnly, DateOnlyPrev)
                if (index == this.bmiGraphData.length - 1 && count_inc >= 1 && diffInHoursForLastStart > 48) {
                  final_dp = count_inc
                  graph[count_inc]['x'] = this.bmiGraphData[index].x
                  graph[count_inc]['y'] = this.bmiGraphData[index].y
                  graph[count_inc]['color'] = this.bmiGraphData[index].color
                }
                if (dateDiff == 0 || diffInHoursForLastStart <= 48) {
                  //Nothing to do
                } else {
                  test_cond = false
                  graph[count_inc]['x'] = this.bmiGraphData[index - 1].x
                  graph[count_inc]['y'] = this.bmiGraphData[index - 1].y
                  graph[count_inc]['color'] = this.bmiGraphData[index - 1].color
                  final_dp = count_inc
                  count_inc++
                  if (index == this.bmiGraphData.length - 1 && count_inc >= 1) {
                    final_dp = count_inc
                    graph[count_inc]['x'] = this.bmiGraphData[index].x
                    graph[count_inc]['y'] = this.bmiGraphData[index].y
                    graph[count_inc]['color'] = this.bmiGraphData[index].color
                  }
                }
              }
              init2++
            }
          }
        }
        var beforeDate = null
        var dtArr = []
        var dt = 0
        if (test_cond === true) {
          for (let i = graph.length - 1; i > -1; i--) {
            if (graph[i]['y'] != undefined) {
              dtArr[dt] = graph[i]
              dt++
            }
          }
        } else {
          for (let i = final_dp; i > -1; i--) {
            if (graph[i]['y'] != undefined) {
              dtArr[dt] = graph[i]
              dt++
            }
          }
        }
        if (dtArr.length < 2) {
          $('#bmiChartContainer').hide()
          this.showMinimumError = true
          this.loadingMessage = false
        } else {
          $('#bmiChartContainer').show()
          this.showMinimumError = false
        }
        if (test_cond) {
          var chartFor2Days = new CanvasJS.Chart("bmiChartContainer",
            {

              toolTip: {
                fontFamily: "'Quicksand', 'sans-serif'",
                borderThickness: "0",
                cornerRadius: 10,
                content: "<div style='\"'color: {color};'\"'>BMI : {y} <br> Date : {x}</div>",
              },
              animationEnabled: true,
              animationDuration: 2000,
              axisX: {
                lineThickness: 0,
                tickThickness: 0,
                gridColor: "Silver",
                valueFormatString: "DD/MMM hh TT",
                labelFontSize: 12,
                labelFontWeight: "bold",
                labelFontColor: "#808080",
                labelFontFamily: "'Quicksand', 'sans-serif'"
              },
              axisY: {
                maximum: 50,
                minimum: 5,
                lineThickness: 0,
                tickThickness: 0,
                gridThickness: 0,
                labelFontSize: 12,
                labelFontWeight: "bold",
                labelFontColor: "#808080",
                labelFontFamily: "'Quicksand', 'sans-serif'"
              },
              legend: {
                fontSize: 15,
                fontFamily: "'Quicksand', 'sans-serif'",
                fontColor: "#808080"
              },
              data: [
                {
                  type: "splineArea",
                  showInLegend: true,
                  legendText: "Normal",
                  legendMarkerType: "square",
                  legendMarkerColor: "#43A047",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                {
                  type: "splineArea",
                  showInLegend: true,
                  legendText: "Low",
                  legendMarkerType: "square",
                  legendMarkerColor: "#ff9800",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                // {
                //   type: "splineArea",
                //   showInLegend: true,
                //   legendText: "OverWeight",
                //   legendMarkerType: "square",
                //   legendMarkerColor: "#ff5722",
                //   fillOpacity: 0,
                //   lineThickness: 0,
                //   markerSize: 0,
                //   dataPoints: dtArr
                // },
                {
                  type: "splineArea",
                  showInLegend: true,
                  legendText: "High",
                  legendMarkerType: "square",
                  legendMarkerColor: "#d32f2f",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                {
                  type: "splineArea",
                  lineThickness: 2,
                  lineColor: "#4885ed",
                  fillOpacity: 0.1,
                  markerSize: 10,
                  dataPoints: dtArr
                }
              ]
            })
          setTimeout(() => {
            this.loadingMessage = false
            chartFor2Days.render()
          }, 2000)
        }
        else {
          var bmiChart = new CanvasJS.Chart("bmiChartContainer",
            {
              toolTip: {
                fontFamily: "'Quicksand', 'sans-serif'",
                borderThickness: "0",
                cornerRadius: 10,
                content: "<div style='\"'color: {color};'\"'>BMI : {y} <br> Date : {x}</div>",
              },
              animationEnabled: true,
              animationDuration: 2000,
              axisX: {
                lineThickness: 0,
                tickThickness: 0,
                gridColor: "Silver",
                valueFormatString: "DD/MMM",
                labelFontSize: 12,
                labelFontWeight: "bold",
                labelFontColor: "#808080",
                labelFontFamily: "'Quicksand', 'sans-serif'"
              },
              axisY: {
                maximum: 50,
                minimum: 5,
                lineThickness: 0,
                tickThickness: 0,
                gridThickness: 0,
                labelFontSize: 12,
                labelFontWeight: "bold",
                labelFontColor: "#808080",
                labelFontFamily: "'Quicksand', 'sans-serif'"
              },
              legend: {
                fontSize: 15,
                fontFamily: "'Quicksand', 'sans-serif'",
                fontColor: "#808080"
              },
              data: [
                {
                  type: "splineArea",
                  showInLegend: true,
                  legendText: "Normal",
                  legendMarkerType: "square",
                  legendMarkerColor: "#43A047",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                {
                  type: "splineArea",
                  showInLegend: true,
                  legendText: "Low",
                  legendMarkerType: "square",
                  legendMarkerColor: "#ff9800",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                // {
                //   type: "splineArea",
                //   showInLegend: true,
                //   legendText: "OverWeight",
                //   legendMarkerType: "square",
                //   legendMarkerColor: "#ff5722",
                //   fillOpacity: 0,
                //   lineThickness: 0,
                //   markerSize: 0,
                //   dataPoints: dtArr
                // },
                {
                  type: "splineArea",
                  showInLegend: true,
                  legendText: "High",
                  legendMarkerType: "square",
                  legendMarkerColor: "#d32f2f",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                {
                  type: "splineArea",
                  lineThickness: 2,
                  lineColor: "#4885ed",
                  fillOpacity: 0.1,
                  markerSize: 10,
                  dataPoints: dtArr
                }
              ]
            })
          setTimeout(() => {
            this.loadingMessage = false
            bmiChart.render()
          }, 2000)
        }
      }
    }
    if (this.testType === "SpO2") {
      if (this.spo2GraphData.length < 2) {
        this.showMinimumError = true
        this.loadingMessage = false
      }
      else {
        this.showMinimumError = false
        for (let index = 0, count_inc = 0, init2 = 0; this.spo2GraphData.length > index; index++) {
          graph[index] = {}
          if (GraphPeriod !== "showAllDays") {
            var testTakenDate = this.spo2GraphData[index].x
          }
          if (index == 0) {
            if (GraphPeriod === "showAllDays") {
              var DateOnlyInit = new Date(this.spo2GraphData[index].z.slice(0, -10))
            }
          }
          if (GraphPeriod === "showAllDays") {
            if (index > 0) {
              var DateOnlyPrev = new Date(this.spo2GraphData[index - 1].z.slice(0, -10))
              var DateOnlyCurrent = new Date(this.spo2GraphData[index].z.slice(0, -10))
              var DateOnlyLast = new Date(this.spo2GraphData[this.spo2GraphData.length - 1].z.slice(0, -10))
              var diffInTimestampForLast = DateOnlyLast.valueOf() - DateOnlyInit.valueOf()
              var diffInHoursForLastStart = diffInTimestampForLast / 1000 / 60 / 60
              if (diffInHoursForLastStart <= 48) {
                graph[index - 1]['x'] = this.spo2GraphData[index - 1].x
                graph[index - 1]['y'] = this.spo2GraphData[index - 1].y
                graph[index - 1]['color'] = this.spo2GraphData[index - 1].color
                graph[index]['x'] = this.spo2GraphData[index].x
                graph[index]['y'] = this.spo2GraphData[index].y
                graph[index]['color'] = this.spo2GraphData[index].color
                test_cond = true
              }
              var dateDiff = this.timeDifference(DateOnlyCurrent, DateOnlyPrev);
              if (index == this.spo2GraphData.length - 1 && count_inc >= 1) {
                final_dp = count_inc;
                graph[count_inc]['x'] = this.spo2GraphData[index].x
                graph[count_inc]['y'] = this.spo2GraphData[index].y
                graph[count_inc]['color'] = this.spo2GraphData[index].color
              }
              if (dateDiff == 0) {
                //Nothing to do
              } else {
                if (diffInHoursForLastStart <= 48) {
                  test_cond = true
                } else {
                  test_cond = false;
                  graph[count_inc]['x'] = this.spo2GraphData[index - 1].x
                  graph[count_inc]['y'] = this.spo2GraphData[index - 1].y
                  graph[count_inc]['color'] = this.spo2GraphData[index - 1].color
                  final_dp = count_inc;
                  count_inc++;
                  if (index == this.spo2GraphData.length - 1 && count_inc >= 1 && diffInHoursForLastStart >= 48) {
                    final_dp = count_inc;
                    graph[count_inc]['x'] = this.spo2GraphData[index].x
                    graph[count_inc]['y'] = this.spo2GraphData[index].y
                    graph[count_inc]['color'] = this.spo2GraphData[index].color
                  }
                }
              }
            }
          }
          else {
            if (last90Days <= testTakenDate) {
              if (init2 == 0) {
                var DateOnlyInit = new Date(this.spo2GraphData[index].z.slice(0, -10))
                var DateOnlyLast = new Date(this.spo2GraphData[this.spo2GraphData.length - 1].z.slice(0, -10))
                var diffInTimestampForLast = DateOnlyLast.valueOf() - DateOnlyInit.valueOf()
                var diffInHoursForLastStart = diffInTimestampForLast / 1000 / 60 / 60
              }
              if (diffInHoursForLastStart <= 48) {
                graph[count_inc]['x'] = this.spo2GraphData[index].x
                graph[count_inc]['y'] = this.spo2GraphData[index].y
                graph[count_inc]['color'] = this.spo2GraphData[index].color
                test_cond = true
                count_inc++
              }
              var DateOnly = new Date(this.spo2GraphData[index].z.slice(0, -10))
              if (index > 0 && init2 > 0) {
                var DateOnlyPrev = new Date(this.spo2GraphData[index - 1].z.slice(0, -10))
                var dateDiff = this.timeDifference(DateOnly, DateOnlyPrev)
                if (index == this.spo2GraphData.length - 1 && count_inc >= 1 && diffInHoursForLastStart > 48) {
                  final_dp = count_inc
                  graph[count_inc]['x'] = this.spo2GraphData[index].x
                  graph[count_inc]['y'] = this.spo2GraphData[index].y
                  graph[count_inc]['color'] = this.spo2GraphData[index].color
                }
                if (dateDiff == 0 || diffInHoursForLastStart <= 48) {
                  //Nothing to do
                } else {
                  test_cond = false
                  graph[count_inc]['x'] = this.spo2GraphData[index - 1].x
                  graph[count_inc]['y'] = this.spo2GraphData[index - 1].y
                  graph[count_inc]['color'] = this.spo2GraphData[index - 1].color
                  final_dp = count_inc
                  count_inc++
                  if (index == this.spo2GraphData.length - 1 && count_inc >= 1) {
                    final_dp = count_inc
                    graph[count_inc]['x'] = this.spo2GraphData[index].x
                    graph[count_inc]['y'] = this.spo2GraphData[index].y
                    graph[count_inc]['color'] = this.spo2GraphData[index].color
                  }
                }
              }
              init2++
            }
          }
        }
        var beforeDate = null
        var dtArr = []
        var dt = 0
        if (test_cond === true) {
          for (let i = graph.length - 1; i > -1; i--) {
            if (graph[i]['y'] != undefined) {
              dtArr[dt] = graph[i]
              dt++
            }
          }
        } else {
          for (let i = final_dp; i > -1; i--) {
            if (graph[i]['y'] != undefined) {
              dtArr[dt] = graph[i]
              dt++
            }
          }
        }
        if (dtArr.length < 2) {
          $('#spo2ChartContainer').hide()
          this.showMinimumError = true
          this.loadingMessage = false
        } else {
          $('#spo2ChartContainer').show()
          this.showMinimumError = false
        }
        if (test_cond) {
          var chartFor2Days = new CanvasJS.Chart("spo2ChartContainer",
            {
              toolTip: {
                fontFamily: "'Quicksand', 'sans-serif'",
                borderThickness: "0",
                cornerRadius: 10,
                content: "<span style='\"'color: {color};'\"'>Oxygen : {y} % <br>Date : {x}</span>"
              },
              animationEnabled: true,
              animationDuration: 2000,
              axisX: {
                lineThickness: 0,
                tickThickness: 0,
                gridColor: "Silver",
                valueFormatString: "DD/MMM hh TT",
                labelFontSize: 12,
                labelFontWeight: "bold",
                labelFontColor: "#808080",
                labelFontFamily: "'Quicksand', 'sans-serif'"
              },
              axisY: {
                minimum: 93,
                maximum: 101,
                interval: 2,
                lineThickness: 0,
                tickThickness: 0,
                gridThickness: 0,
                labelFontSize: 12,
                labelFontWeight: "bold",
                labelFontColor: "#808080",
                labelFontFamily: "'Quicksand', 'sans-serif'"
              },
              legend: {
                fontSize: 15,
                fontFamily: "'Quicksand', 'sans-serif'",
                fontColor: "#808080"
              },
              data: [
                {
                  type: "splineArea",
                  showInLegend: true,
                  legendText: "Normal",
                  legendMarkerType: "square",
                  legendMarkerColor: "#43A047",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  color: "#bfefc4",
                  fontColor: "#bfefc4",
                  dataPoints: dtArr
                },
                {
                  type: "splineArea",
                  showInLegend: true,
                  legendText: "Low",
                  legendMarkerType: "square",
                  legendMarkerColor: "#ff9800",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                // {
                //   type: "splineArea",
                //   showInLegend: true,
                //   legendText: "Low",
                //   legendMarkerType: "square",
                //   legendMarkerColor: "#ff5722",
                //   fillOpacity: 0,
                //   lineThickness: 0,
                //   markerSize: 0,
                //   dataPoints: dtArr
                // },
                // {
                //   type: "splineArea",
                //   showInLegend: true,
                //   legendText: "At-Risk",
                //   legendMarkerType: "square",
                //   legendMarkerColor: "#d32f2f",
                //   fillOpacity: 0,
                //   lineThickness: 0,
                //   markerSize: 0,
                //   dataPoints: dtArr
                // },
                {
                  type: "splineArea",
                  lineThickness: 2,
                  lineColor: "#4885ed",
                  fillOpacity: 0.1,
                  markerSize: 11,
                  dataPoints: dtArr
                }
              ]
            })
          setTimeout(() => {
            this.loadingMessage = false
            chartFor2Days.render()
          }, 2000)
        }
        else {
          var spo2Chart = new CanvasJS.Chart("spo2ChartContainer",
            {
              toolTip: {
                fontFamily: "'Quicksand', 'sans-serif'",
                borderThickness: "0",
                cornerRadius: 10,
                content: "<span style='\"'color: {color};'\"'>Oxygen : {y} % <br>Date : {x}</span>"
              },
              animationEnabled: true,
              animationDuration: 2000,
              axisX: {
                lineThickness: 0,
                tickThickness: 0,
                gridColor: "Silver",
                valueFormatString: "DD/MMM",
                labelFontSize: 12,
                labelFontWeight: "bold",
                labelFontColor: "#808080",
                labelFontFamily: "'Quicksand', 'sans-serif'"
              },
              axisY: {
                minimum: 93,
                maximum: 101,
                interval: 2,
                lineThickness: 0,
                tickThickness: 0,
                gridThickness: 0,
                labelFontSize: 12,
                labelFontWeight: "bold",
                labelFontColor: "#808080",
                labelFontFamily: "'Quicksand', 'sans-serif'"
              },
              legend: {
                fontSize: 15,
                fontFamily: "'Quicksand', 'sans-serif'",
                fontColor: "#808080"
              },
              data: [
                {
                  type: "splineArea",
                  showInLegend: true,
                  legendText: "Normal",
                  legendMarkerType: "square",
                  legendMarkerColor: "#43A047",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  color: "#bfefc4",
                  fontColor: "#bfefc4",
                  dataPoints: dtArr
                },
                // {
                //   type: "splineArea",
                //   showInLegend: true,
                //   legendText: "Acceptable",
                //   legendMarkerType: "square",
                //   legendMarkerColor: "#ff9800",
                //   fillOpacity: 0,
                //   lineThickness: 0,
                //   markerSize: 0,
                //   dataPoints: dtArr
                // },
                {
                  type: "splineArea",
                  showInLegend: true,
                  legendText: "Low",
                  legendMarkerType: "square",
                  legendMarkerColor: "#ff9800",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                // {
                //   type: "splineArea",
                //   showInLegend: true,
                //   legendText: "At-Risk",
                //   legendMarkerType: "square",
                //   legendMarkerColor: "#d32f2f",
                //   fillOpacity: 0,
                //   lineThickness: 0,
                //   markerSize: 0,
                //   dataPoints: dtArr
                // },
                {
                  type: "splineArea",
                  lineThickness: 2,
                  lineColor: "#4885ed",
                  fillOpacity: 0.1,
                  markerSize: 11,
                  dataPoints: dtArr
                }
              ]
            })
          setTimeout(() => {
            this.loadingMessage = false
            spo2Chart.render()
          }, 2000)
        }
      }
    }
    if (this.testType === "TEMPERATURE") {
      if (this.temperatureGraphData.length < 2) {
        this.showMinimumError = true
        this.loadingMessage = false
      }
      else {
        this.showMinimumError = false
        for (let index = 0, count_inc = 0, init2 = 0; this.temperatureGraphData.length > index; index++) {
          graph[index] = {}
          if (GraphPeriod !== "showAllDays") {
            var testTakenDate = this.temperatureGraphData[index].x
          }
          if (index == 0) {
            if (GraphPeriod === "showAllDays") {
              var DateOnlyInit = new Date(this.temperatureGraphData[index].z.slice(0, -10))
            }
          }
          if (GraphPeriod === "showAllDays") {
            if (index > 0) {
              var DateOnlyPrev = new Date(this.temperatureGraphData[index - 1].z.slice(0, -10))
              var DateOnlyCurrent = new Date(this.temperatureGraphData[index].z.slice(0, -10))
              var DateOnlyLast = new Date(this.temperatureGraphData[this.temperatureGraphData.length - 1].z.slice(0, -10))
              var diffInTimestampForLast = DateOnlyLast.valueOf() - DateOnlyInit.valueOf()
              var diffInHoursForLastStart = diffInTimestampForLast / 1000 / 60 / 60
              if (diffInHoursForLastStart <= 48) {
                graph[index - 1]['x'] = this.temperatureGraphData[index - 1].x
                graph[index - 1]['y'] = this.temperatureGraphData[index - 1].y
                graph[index - 1]['color'] = this.temperatureGraphData[index - 1].color
                graph[index]['x'] = this.temperatureGraphData[index].x
                graph[index]['y'] = this.temperatureGraphData[index].y
                graph[index]['color'] = this.temperatureGraphData[index].color
                test_cond = true
              }
              var dateDiff = this.timeDifference(DateOnlyCurrent, DateOnlyPrev);
              if (index == this.temperatureGraphData.length - 1 && count_inc >= 1) {
                final_dp = count_inc;
                graph[count_inc]['x'] = this.temperatureGraphData[index].x
                graph[count_inc]['y'] = this.temperatureGraphData[index].y
                graph[count_inc]['color'] = this.temperatureGraphData[index].color
              }
              if (dateDiff == 0) {
                //Nothing to do
              } else {
                if (diffInHoursForLastStart <= 48) {
                  test_cond = true
                } else {
                  test_cond = false;
                  graph[count_inc]['x'] = this.temperatureGraphData[index - 1].x
                  graph[count_inc]['y'] = this.temperatureGraphData[index - 1].y
                  graph[count_inc]['color'] = this.temperatureGraphData[index - 1].color
                  final_dp = count_inc;
                  count_inc++;
                  if (index == this.temperatureGraphData.length - 1 && count_inc >= 1 && diffInHoursForLastStart >= 48) {
                    final_dp = count_inc;
                    graph[count_inc]['x'] = this.temperatureGraphData[index].x
                    graph[count_inc]['y'] = this.temperatureGraphData[index].y
                    graph[count_inc]['color'] = this.temperatureGraphData[index].color
                  }
                }
              }
            }
          }
          else {
            if (last90Days <= testTakenDate) {
              if (init2 == 0) {
                var DateOnlyInit = new Date(this.temperatureGraphData[index].z.slice(0, -10))
                var DateOnlyLast = new Date(this.temperatureGraphData[this.temperatureGraphData.length - 1].z.slice(0, -10))
                var diffInTimestampForLast = DateOnlyLast.valueOf() - DateOnlyInit.valueOf()
                var diffInHoursForLastStart = diffInTimestampForLast / 1000 / 60 / 60
              }
              if (diffInHoursForLastStart <= 48) {
                graph[count_inc]['x'] = this.temperatureGraphData[index].x
                graph[count_inc]['y'] = this.temperatureGraphData[index].y
                graph[count_inc]['color'] = this.temperatureGraphData[index].color
                test_cond = true
                count_inc++
              }
              var DateOnly = new Date(this.temperatureGraphData[index].z.slice(0, -10))
              if (index > 0 && init2 > 0) {
                var DateOnlyPrev = new Date(this.temperatureGraphData[index - 1].z.slice(0, -10))
                var dateDiff = this.timeDifference(DateOnly, DateOnlyPrev)
                if (index == this.temperatureGraphData.length - 1 && count_inc >= 1 && diffInHoursForLastStart > 48) {
                  final_dp = count_inc
                  graph[count_inc]['x'] = this.temperatureGraphData[index].x
                  graph[count_inc]['y'] = this.temperatureGraphData[index].y
                  graph[count_inc]['color'] = this.temperatureGraphData[index].color
                }
                if (dateDiff == 0 || diffInHoursForLastStart <= 48) {
                  //Nothing to do
                } else {
                  test_cond = false
                  graph[count_inc]['x'] = this.temperatureGraphData[index - 1].x
                  graph[count_inc]['y'] = this.temperatureGraphData[index - 1].y
                  graph[count_inc]['color'] = this.temperatureGraphData[index - 1].color
                  final_dp = count_inc
                  count_inc++
                  if (index == this.temperatureGraphData.length - 1 && count_inc >= 1) {
                    final_dp = count_inc
                    graph[count_inc]['x'] = this.temperatureGraphData[index].x
                    graph[count_inc]['y'] = this.temperatureGraphData[index].y
                    graph[count_inc]['color'] = this.temperatureGraphData[index].color
                  }
                }
              }
              init2++
            }
          }
        }
        var beforeDate = null
        var dtArr = []
        var dt = 0
        if (test_cond === true) {
          for (let i = graph.length - 1; i > -1; i--) {
            if (graph[i]['y'] != undefined) {
              dtArr[dt] = graph[i]
              dt++
            }
          }
        } else {
          for (let i = final_dp; i > -1; i--) {
            if (graph[i]['y'] != undefined) {
              dtArr[dt] = graph[i]
              dt++
            }
          }
        }
        if (dtArr.length < 2) {
          $('#temperatureChartContainer').hide()
          this.showMinimumError = true
          this.loadingMessage = false
        } else {
          $('#temperatureChartContainer').show()
          this.showMinimumError = false
        }
        if (test_cond) {
          var chartFor2Days = new CanvasJS.Chart("temperatureChartContainer",
            {
              toolTip: {
                fontFamily: "'Quicksand', 'sans-serif'",
                borderThickness: "0",
                cornerRadius: 10,
                content: "<span style='\"'color: {color};'\"'>Temperature : {y} °C <br>Date : {x}</span>"
              },
              animationEnabled: true,
              animationDuration: 2000,
              axisX: {
                lineThickness: 0,
                tickThickness: 0,
                gridColor: "Silver",
                valueFormatString: "DD/MMM hh TT",
                labelFontSize: 12,
                labelFontWeight: "bold",
                labelFontColor: "#808080",
                labelFontFamily: "'Quicksand', 'sans-serif'"
              },
              axisY: {
                minimum: 95,
                maximum: 103,
                interval: 1,
                lineThickness: 0,
                tickThickness: 0,
                gridThickness: 0,
                labelFontSize: 12,
                labelFontWeight: "bold",
                labelFontColor: "#808080",
                labelFontFamily: "'Quicksand', 'sans-serif'"
              },
              legend: {
                fontSize: 15,
                fontFamily: "'Quicksand', 'sans-serif'",
                fontColor: "#808080"
              },
              data: [
                {
                  type: "splineArea",
                  showInLegend: true,
                  legendText: "Normal",
                  legendMarkerType: "square",
                  legendMarkerColor: "#43A047",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                {
                  type: "splineArea",
                  showInLegend: true,
                  legendText: "Low",
                  legendMarkerType: "square",
                  legendMarkerColor: "#ff9800",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                // {
                //   type: "splineArea",
                //   showInLegend: true,
                //   legendText: "Fever",
                //   legendMarkerType: "square",
                //   legendMarkerColor: "#ff5722",
                //   fillOpacity: 0,
                //   lineThickness: 0,
                //   markerSize: 0,
                //   dataPoints: dtArr
                // },
                {
                  type: "splineArea",
                  showInLegend: true,
                  legendText: "Very High Fever",
                  legendMarkerType: "square",
                  legendMarkerColor: "#d32f2f",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                {
                  type: "splineArea",
                  lineThickness: 2,
                  lineColor: "#4885ed",
                  fillOpacity: 0.1,
                  markerSize: 11,
                  dataPoints: dtArr
                }
              ]
            })
          setTimeout(() => {
            this.loadingMessage = false
            chartFor2Days.render()
          }, 2000)
        }
        else {
          var temperatureChart = new CanvasJS.Chart("temperatureChartContainer",
            {
              toolTip: {
                fontFamily: "'Quicksand', 'sans-serif'",
                borderThickness: "0",
                cornerRadius: 10,
                content: "<span style='\"'color: {color};'\"'>Temperature : {y} °C <br>Date : {x}</span>"
              },
              animationEnabled: true,
              animationDuration: 2000,
              axisX: {
                lineThickness: 0,
                tickThickness: 0,
                gridColor: "Silver",
                valueFormatString: "DD/MMM",
                labelFontSize: 12,
                labelFontWeight: "bold",
                labelFontColor: "#808080",
                labelFontFamily: "'Quicksand', 'sans-serif'"
              },
              axisY: {
                minimum: 95,
                maximum: 103,
                interval: 1,
                lineThickness: 0,
                tickThickness: 0,
                gridThickness: 0,
                labelFontSize: 12,
                labelFontWeight: "bold",
                labelFontColor: "#808080",
                labelFontFamily: "'Quicksand', 'sans-serif'"
              },
              legend: {
                fontSize: 15,
                fontFamily: "'Quicksand', 'sans-serif'",
                fontColor: "#808080"
              },
              data: [
                {
                  type: "splineArea",
                  showInLegend: true,
                  legendText: "Normal",
                  legendMarkerType: "square",
                  legendMarkerColor: "#43A047",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                {
                  type: "splineArea",
                  showInLegend: true,
                  legendText: "Low",
                  legendMarkerType: "square",
                  legendMarkerColor: "#ff9800",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                // {
                //   type: "splineArea",
                //   showInLegend: true,
                //   legendText: "Fever",
                //   legendMarkerType: "square",
                //   legendMarkerColor: "#ff5722",
                //   fillOpacity: 0,
                //   lineThickness: 0,
                //   markerSize: 0,
                //   dataPoints: dtArr
                // },
                {
                  type: "splineArea",
                  showInLegend: true,
                  legendText: "High",
                  legendMarkerType: "square",
                  legendMarkerColor: "#d32f2f",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                {
                  type: "splineArea",
                  lineThickness: 2,
                  lineColor: "#4885ed",
                  fillOpacity: 0.1,
                  markerSize: 11,
                  dataPoints: dtArr
                }
              ]
            })
          setTimeout(() => {
            this.loadingMessage = false
            temperatureChart.render()
          }, 2000)
        }
      }
    }
    if (this.testType === "Fat Ratio") {
      if (this.bmcGraphData.length < 2) {
        this.showMinimumError = true
        this.loadingMessage = false
      }
      else {
        this.showMinimumError = false

        for (let index = 0, count_inc = 0, init2 = 0; this.bmcGraphData.length > index; index++) {
          graph[index] = {}
          if (GraphPeriod !== "showAllDays") {
            var testTakenDate = this.bmcGraphData[index].x
          }
          if (index == 0) {
            if (GraphPeriod === "showAllDays") {
              var DateOnlyInit = new Date(this.bmcGraphData[index].z.slice(0, -10))
            }
          }
          if (GraphPeriod === "showAllDays") {
            if (index > 0) {
              var DateOnlyPrev = new Date(this.bmcGraphData[index - 1].z.slice(0, -10))
              var DateOnlyCurrent = new Date(this.bmcGraphData[index].z.slice(0, -10))
              var DateOnlyLast = new Date(this.bmcGraphData[this.bmcGraphData.length - 1].z.slice(0, -10))
              var diffInTimestampForLast = DateOnlyLast.valueOf() - DateOnlyInit.valueOf()
              var diffInHoursForLastStart = diffInTimestampForLast / 1000 / 60 / 60
              if (diffInHoursForLastStart <= 48) {
                graph[index - 1]['x'] = this.bmcGraphData[index - 1].x
                graph[index - 1]['y'] = this.bmcGraphData[index - 1].y
                graph[index - 1]['color'] = this.bmcGraphData[index - 1].color
                graph[index]['x'] = this.bmcGraphData[index].x
                graph[index]['y'] = this.bmcGraphData[index].y
                graph[index]['color'] = this.bmcGraphData[index].color
                test_cond = true
              }
              var dateDiff = this.timeDifference(DateOnlyCurrent, DateOnlyPrev);
              if (index == this.bmcGraphData.length - 1 && count_inc >= 1) {
                final_dp = count_inc;
                graph[count_inc]['x'] = this.bmcGraphData[index].x
                graph[count_inc]['y'] = this.bmcGraphData[index].y
                graph[count_inc]['color'] = this.bmcGraphData[index].color
              }
              if (dateDiff == 0) {
                //Nothing to do
              } else {
                if (diffInHoursForLastStart <= 48) {
                  test_cond = true
                } else {
                  test_cond = false;
                  graph[count_inc]['x'] = this.bmcGraphData[index - 1].x
                  graph[count_inc]['y'] = this.bmcGraphData[index - 1].y
                  graph[count_inc]['color'] = this.bmcGraphData[index - 1].color
                  final_dp = count_inc;
                  count_inc++;
                  if (index == this.bmcGraphData.length - 1 && count_inc >= 1 && diffInHoursForLastStart >= 48) {
                    final_dp = count_inc;
                    graph[count_inc]['x'] = this.bmcGraphData[index].x
                    graph[count_inc]['y'] = this.bmcGraphData[index].y
                    graph[count_inc]['color'] = this.bmcGraphData[index].color
                  }
                }
              }
            }
          }
          else {
            if (last90Days <= testTakenDate) {
              if (init2 == 0) {
                var DateOnlyInit = new Date(this.bmcGraphData[index].z.slice(0, -10))
                var DateOnlyLast = new Date(this.bmcGraphData[this.bmcGraphData.length - 1].z.slice(0, -10))
                var diffInTimestampForLast = DateOnlyLast.valueOf() - DateOnlyInit.valueOf()
                var diffInHoursForLastStart = diffInTimestampForLast / 1000 / 60 / 60
              }
              if (diffInHoursForLastStart <= 48) {
                graph[count_inc]['x'] = this.bmcGraphData[index].x
                graph[count_inc]['y'] = this.bmcGraphData[index].y
                graph[count_inc]['color'] = this.bmcGraphData[index].color
                test_cond = true
                count_inc++
              }
              var DateOnly = new Date(this.bmcGraphData[index].z.slice(0, -10))
              if (index > 0 && init2 > 0) {
                var DateOnlyPrev = new Date(this.bmcGraphData[index - 1].z.slice(0, -10))
                var dateDiff = this.timeDifference(DateOnly, DateOnlyPrev)
                if (index == this.bmcGraphData.length - 1 && count_inc >= 1 && diffInHoursForLastStart > 48) {
                  final_dp = count_inc
                  graph[count_inc]['x'] = this.bmcGraphData[index].x
                  graph[count_inc]['y'] = this.bmcGraphData[index].y
                  graph[count_inc]['color'] = this.bmcGraphData[index].color
                }
                if (dateDiff == 0 || diffInHoursForLastStart <= 48) {
                  //Nothing to do
                } else {
                  test_cond = false
                  graph[count_inc]['x'] = this.bmcGraphData[index - 1].x
                  graph[count_inc]['y'] = this.bmcGraphData[index - 1].y
                  graph[count_inc]['color'] = this.bmcGraphData[index - 1].color
                  final_dp = count_inc
                  count_inc++
                  if (index == this.bmcGraphData.length - 1 && count_inc >= 1) {
                    final_dp = count_inc
                    graph[count_inc]['x'] = this.bmcGraphData[index].x
                    graph[count_inc]['y'] = this.bmcGraphData[index].y
                    graph[count_inc]['color'] = this.bmcGraphData[index].color
                  }
                }
              }
              init2++
            }
          }
        }
        var beforeDate = null
        var dtArr = []
        var dt = 0
        if (test_cond === true) {
          for (let i = graph.length - 1; i > -1; i--) {
            if (graph[i]['y'] != undefined) {
              dtArr[dt] = graph[i]
              dt++
            }
          }
        } else {
          for (let i = final_dp; i > -1; i--) {
            if (graph[i]['y'] != undefined) {
              dtArr[dt] = graph[i]
              dt++
            }
          }
        }
        if (dtArr.length < 2) {
          $('#bmcChartContainer').hide()
          this.showMinimumError = true
          this.loadingMessage = false
        } else {
          $('#bmcChartContainer').show()
          this.showMinimumError = false
        }
        if (test_cond) {
          var chartFor2Days = new CanvasJS.Chart("bmcChartContainer",
            {
              toolTip: {
                fontFamily: "'Quicksand', 'sans-serif'",
                borderThickness: "0",
                cornerRadius: 10,
                content: "<span style='\"'color: {color};'\"'>Body Fat : {y}%<br>Date : {x}</span>"
              },
              animationEnabled: true,
              animationDuration: 2000,
              axisX: {
                lineThickness: 0,
                tickThickness: 0,
                gridColor: "Silver",
                valueFormatString: "DD/MMM hh TT",
                labelFontSize: 12,
                labelFontWeight: "bold",
                labelFontColor: "#808080",
                labelFontFamily: "'Quicksand', 'sans-serif'"
              },
              axisY: {
                minimum: 0,
                maximum: 50,
                interval: 10,
                lineThickness: 0,
                tickThickness: 0,
                gridThickness: 0,
                labelFontSize: 12,
                labelFontWeight: "bold",
                labelFontColor: "#808080",
                labelFontFamily: "'Quicksand', 'sans-serif'"
              },
              legend: {
                fontSize: 15,
                fontFamily: "'Quicksand', 'sans-serif'",
                fontColor: "#808080"
              },
              data: [
                {
                  type: "splineArea",
                  showInLegend: true,
                  legendText: "Normal",
                  legendMarkerType: "square",
                  legendMarkerColor: "#43A047",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                {
                  type: "splineArea",
                  showInLegend: true,
                  legendText: "Low",
                  legendMarkerType: "square",
                  legendMarkerColor: "#ff9800",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                // {
                //   type: "splineArea",
                //   showInLegend: true,
                //   legendText: "At-Risk",
                //   legendMarkerType: "square",
                //   legendMarkerColor: "#d32f2f",
                //   fillOpacity: 0,
                //   lineThickness: 0,
                //   markerSize: 0,
                //   dataPoints: dtArr
                // },
                {
                  type: "splineArea",
                  lineThickness: 2,
                  lineColor: "#4885ed",
                  fillOpacity: 0.1,
                  markerSize: 11,
                  dataPoints: dtArr
                }
              ]
            })
          setTimeout(() => {
            this.loadingMessage = false
            chartFor2Days.render()
          }, 2000)
        }
        else {
          var bmcChart = new CanvasJS.Chart("bmcChartContainer",
            {
              toolTip: {
                fontFamily: "'Quicksand', 'sans-serif'",
                borderThickness: "0",
                cornerRadius: 10,
                content: "<span style='\"'color: {color};'\"'>Body Fat : {y}%<br>Date : {x}</span>"
              },
              animationEnabled: true,
              animationDuration: 2000,
              axisX: {
                lineThickness: 0,
                tickThickness: 0,
                gridColor: "Silver",
                valueFormatString: "DD/MMM",
                labelFontSize: 12,
                labelFontWeight: "bold",
                labelFontColor: "#808080",
                labelFontFamily: "'Quicksand', 'sans-serif'"
              },
              axisY: {
                minimum: 0,
                maximum: 50,
                interval: 10,
                lineThickness: 0,
                tickThickness: 0,
                gridThickness: 0,
                labelFontSize: 12,
                labelFontWeight: "bold",
                labelFontColor: "#808080",
                labelFontFamily: "'Quicksand', 'sans-serif'"
              },
              legend: {
                fontSize: 15,
                fontFamily: "'Quicksand', 'sans-serif'",
                fontColor: "#808080"
              },
              data: [
                {
                  type: "splineArea",
                  showInLegend: true,
                  legendText: "Normal",
                  legendMarkerType: "square",
                  legendMarkerColor: "#43A047",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                {
                  type: "splineArea",
                  showInLegend: true,
                  legendText: "Low",
                  legendMarkerType: "square",
                  legendMarkerColor: "#ff9800",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                // {
                //   type: "splineArea",
                //   showInLegend: true,
                //   legendText: "At-Risk",
                //   legendMarkerType: "square",
                //   legendMarkerColor: "#d32f2f",
                //   fillOpacity: 0,
                //   lineThickness: 0,
                //   markerSize: 0,
                //   dataPoints: dtArr
                // },
                {
                  type: "splineArea",
                  lineThickness: 2,
                  lineColor: "#4885ed",
                  fillOpacity: 0.1,
                  markerSize: 11,
                  dataPoints: dtArr
                }
              ]
            })
          setTimeout(() => {
            this.loadingMessage = false
            bmcChart.render()
          }, 2000)
        }
      }
    }
    if (this.testType === "PULSE") {
      if (this.pulseGraphData.length < 2) {
        this.showMinimumError = true
        this.loadingMessage = false
      }
      else {
        this.showMinimumError = false

        for (let index = 0, count_inc = 0, init2 = 0; this.pulseGraphData.length > index; index++) {
          graph[index] = {}
          if (GraphPeriod !== "showAllDays") {
            var testTakenDate = this.pulseGraphData[index].x
          }
          if (index == 0) {
            if (GraphPeriod === "showAllDays") {
              var DateOnlyInit = new Date(this.pulseGraphData[index].z.slice(0, -10))
            }
          }
          if (GraphPeriod === "showAllDays") {
            if (index > 0) {
              var DateOnlyPrev = new Date(this.pulseGraphData[index - 1].z.slice(0, -10))
              var DateOnlyCurrent = new Date(this.pulseGraphData[index].z.slice(0, -10))
              var DateOnlyLast = new Date(this.pulseGraphData[this.pulseGraphData.length - 1].z.slice(0, -10))
              var diffInTimestampForLast = DateOnlyLast.valueOf() - DateOnlyInit.valueOf()
              var diffInHoursForLastStart = diffInTimestampForLast / 1000 / 60 / 60
              if (diffInHoursForLastStart <= 48) {
                graph[index - 1]['x'] = this.pulseGraphData[index - 1].x
                graph[index - 1]['y'] = this.pulseGraphData[index - 1].y
                graph[index - 1]['color'] = this.pulseGraphData[index - 1].color
                graph[index]['x'] = this.pulseGraphData[index].x
                graph[index]['y'] = this.pulseGraphData[index].y
                graph[index]['color'] = this.pulseGraphData[index].color
                test_cond = true
              }
              var dateDiff = this.timeDifference(DateOnlyCurrent, DateOnlyPrev);
              if (index == this.pulseGraphData.length - 1 && count_inc >= 1) {
                final_dp = count_inc;
                graph[count_inc]['x'] = this.pulseGraphData[index].x
                graph[count_inc]['y'] = this.pulseGraphData[index].y
                graph[count_inc]['color'] = this.pulseGraphData[index].color
              }
              if (dateDiff == 0) {
                //Nothing to do
              } else {
                if (diffInHoursForLastStart <= 48) {
                  test_cond = true
                } else {
                  test_cond = false;
                  graph[count_inc]['x'] = this.pulseGraphData[index - 1].x
                  graph[count_inc]['y'] = this.pulseGraphData[index - 1].y
                  graph[count_inc]['color'] = this.pulseGraphData[index - 1].color
                  final_dp = count_inc;
                  count_inc++;
                  if (index == this.pulseGraphData.length - 1 && count_inc >= 1 && diffInHoursForLastStart >= 48) {
                    final_dp = count_inc;
                    graph[count_inc]['x'] = this.pulseGraphData[index].x
                    graph[count_inc]['y'] = this.pulseGraphData[index].y
                    graph[count_inc]['color'] = this.pulseGraphData[index].color
                  }
                }
              }
            }
          }
          else {
            if (last90Days <= testTakenDate) {
              if (init2 == 0) {
                var DateOnlyInit = new Date(this.pulseGraphData[index].z.slice(0, -10))
                var DateOnlyLast = new Date(this.pulseGraphData[this.pulseGraphData.length - 1].z.slice(0, -10))
                var diffInTimestampForLast = DateOnlyLast.valueOf() - DateOnlyInit.valueOf()
                var diffInHoursForLastStart = diffInTimestampForLast / 1000 / 60 / 60
              }
              if (diffInHoursForLastStart <= 48) {
                graph[count_inc]['x'] = this.pulseGraphData[index].x
                graph[count_inc]['y'] = this.pulseGraphData[index].y
                graph[count_inc]['color'] = this.pulseGraphData[index].color
                test_cond = true
                count_inc++
              }
              var DateOnly = new Date(this.pulseGraphData[index].z.slice(0, -10))
              if (index > 0 && init2 > 0) {
                var DateOnlyPrev = new Date(this.pulseGraphData[index - 1].z.slice(0, -10))
                var dateDiff = this.timeDifference(DateOnly, DateOnlyPrev)
                if (index == this.pulseGraphData.length - 1 && count_inc >= 1 && diffInHoursForLastStart > 48) {
                  final_dp = count_inc
                  graph[count_inc]['x'] = this.pulseGraphData[index].x
                  graph[count_inc]['y'] = this.pulseGraphData[index].y
                  graph[count_inc]['color'] = this.pulseGraphData[index].color
                }
                if (dateDiff == 0 || diffInHoursForLastStart <= 48) {
                  //Nothing to do
                } else {
                  test_cond = false
                  graph[count_inc]['x'] = this.pulseGraphData[index - 1].x
                  graph[count_inc]['y'] = this.pulseGraphData[index - 1].y
                  graph[count_inc]['color'] = this.pulseGraphData[index - 1].color
                  final_dp = count_inc
                  count_inc++
                  if (index == this.pulseGraphData.length - 1 && count_inc >= 1) {
                    final_dp = count_inc
                    graph[count_inc]['x'] = this.pulseGraphData[index].x
                    graph[count_inc]['y'] = this.pulseGraphData[index].y
                    graph[count_inc]['color'] = this.pulseGraphData[index].color
                  }
                }
              }
              init2++
            }
          }
        }
        var beforeDate = null
        var dtArr = []
        var dt = 0
        if (test_cond === true) {
          for (let i = graph.length - 1; i > -1; i--) {
            if (graph[i]['y'] != undefined) {
              dtArr[dt] = graph[i]
              dt++
            }
          }
        } else {
          for (let i = final_dp; i > -1; i--) {
            if (graph[i]['y'] != undefined) {
              dtArr[dt] = graph[i]
              dt++
            }
          }
        }
        if (dtArr.length < 2) {
          $('#pulseChartContainer').hide()
          this.showMinimumError = true
          this.loadingMessage = false
        } else {
          $('#pulseChartContainer').show()
          this.showMinimumError = false
        }
        if (test_cond) {
          var chartFor2Days = new CanvasJS.Chart("pulseChartContainer",
            {
              toolTip: {
                fontFamily: "'Quicksand', 'sans-serif'",
                borderThickness: "0",
                cornerRadius: 10,
                content: "<span style='\"'color: {color};'\"'>Pulse : {y} bpm <br>Date : {x}</span>"
              },
              animationEnabled: true,
              animationDuration: 2000,
              axisX: {
                lineThickness: 0,
                tickThickness: 0,
                gridColor: "Silver",
                valueFormatString: "DD/MMM hh TT",
                labelFontSize: 12,
                labelFontWeight: "bold",
                labelFontColor: "#808080",
                labelFontFamily: "'Quicksand', 'sans-serif'"
              },
              axisY: {
                minimum: 50,
                maximum: 120,
                interval: 20,
                lineThickness: 0,
                tickThickness: 0,
                gridThickness: 0,
                labelFontSize: 12,
                labelFontWeight: "bold",
                labelFontColor: "#808080",
                labelFontFamily: "'Quicksand', 'sans-serif'"
              },
              legend: {
                fontSize: 15,
                fontFamily: "'Quicksand', 'sans-serif'",
                fontColor: "#808080"
              },
              data: [
                {
                  type: "splineArea",
                  showInLegend: true,
                  legendText: "Normal",
                  legendMarkerType: "square",
                  legendMarkerColor: "#43A047",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                {
                  type: "splineArea",
                  showInLegend: true,
                  legendText: "High",
                  legendMarkerType: "square",
                  legendMarkerColor: "#d32f2f",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                {
                  type: "splineArea",
                  showInLegend: true,
                  legendText: "Low",
                  legendMarkerType: "square",
                  legendMarkerColor: "#ff9800",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                {
                  type: "splineArea",
                  lineThickness: 2,
                  lineColor: "#4885ed",
                  fillOpacity: 0.1,
                  markerSize: 11,
                  dataPoints: dtArr
                }
              ]
            })
          setTimeout(() => {
            this.loadingMessage = false
            chartFor2Days.render()
          }, 2000)
        }
        else {
          var pulseChart = new CanvasJS.Chart("pulseChartContainer",
            {
              toolTip: {
                fontFamily: "'Quicksand', 'sans-serif'",
                borderThickness: "0",
                cornerRadius: 10,
                content: "<span style='\"'color: {color};'\"'>Pulse : {y} bpm <br>Date : {x}</span>"
              },
              animationEnabled: true,
              animationDuration: 2000,
              axisX: {
                lineThickness: 0,
                tickThickness: 0,
                gridColor: "Silver",
                valueFormatString: "DD/MMM",
                labelFontSize: 12,
                labelFontWeight: "bold",
                labelFontColor: "#808080",
                labelFontFamily: "'Quicksand', 'sans-serif'"
              },
              axisY: {
                minimum: 50,
                maximum: 120,
                interval: 20,
                lineThickness: 0,
                tickThickness: 0,
                gridThickness: 0,
                labelFontSize: 12,
                labelFontWeight: "bold",
                labelFontColor: "#808080",
                labelFontFamily: "'Quicksand', 'sans-serif'"
              },
              legend: {
                fontSize: 15,
                fontFamily: "'Quicksand', 'sans-serif'",
                fontColor: "#808080"
              },
              data: [
                {
                  type: "splineArea",
                  showInLegend: true,
                  legendText: "Normal",
                  legendMarkerType: "square",
                  legendMarkerColor: "#43A047",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                {
                  type: "splineArea",
                  showInLegend: true,
                  legendText: "High",
                  legendMarkerType: "square",
                  legendMarkerColor: "#d32f2f",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                {
                  type: "splineArea",
                  showInLegend: true,
                  legendText: "Low",
                  legendMarkerType: "square",
                  legendMarkerColor: "#ff9800",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                {
                  type: "splineArea",
                  lineThickness: 2,
                  lineColor: "#4885ed",
                  fillOpacity: 0.1,
                  markerSize: 11,
                  dataPoints: dtArr
                }
              ]
            })
          setTimeout(() => {
            this.loadingMessage = false
            pulseChart.render()
          }, 2000)
        }
      }
    }
    if (this.testType == "ECG") {
      if (this.ecgGraphData.length < 2) {
        this.showMinimumError = true
        this.loadingMessage = false
      }
      else {
        this.showMinimumError = false

        for (let index = 0, count_inc = 0, init2 = 0; this.ecgGraphData.length > index; index++) {
          graph[index] = {}
          if (GraphPeriod !== "showAllDays") {
            var testTakenDate = this.ecgGraphData[index].x
          }
          if (index == 0) {
            if (GraphPeriod === "showAllDays") {
              var DateOnlyInit = new Date(this.ecgGraphData[index].z.slice(0, -10))
            }
          }
          if (GraphPeriod === "showAllDays") {
            if (index > 0) {
              var DateOnlyPrev = new Date(this.ecgGraphData[index - 1].z.slice(0, -10))
              var DateOnlyCurrent = new Date(this.ecgGraphData[index].z.slice(0, -10))
              var DateOnlyLast = new Date(this.ecgGraphData[this.ecgGraphData.length - 1].z.slice(0, -10))
              var diffInTimestampForLast = DateOnlyLast.valueOf() - DateOnlyInit.valueOf()
              var diffInHoursForLastStart = diffInTimestampForLast / 1000 / 60 / 60
              if (diffInHoursForLastStart <= 48) {
                graph[index - 1]['x'] = this.ecgGraphData[index - 1].x
                graph[index - 1]['y'] = this.ecgGraphData[index - 1].y
                graph[index - 1]['color'] = this.ecgGraphData[index - 1].color
                graph[index]['x'] = this.ecgGraphData[index].x
                graph[index]['y'] = this.ecgGraphData[index].y
                graph[index]['color'] = this.ecgGraphData[index].color
                if (this.ecgGraphData[index].ecgLeadMode == 3) {
                  graph[index - 1]['ecgLead1'] = this.ecgGraphData[index].ecgLeadOne
                  graph[index - 1]['ecgLead2'] = this.ecgGraphData[index].ecgLeadTwo
                  graph[index - 1]['ecgLead3'] = this.ecgGraphData[index].ecgLeadThree
                  graph[index]['ecgLead1'] = this.ecgGraphData[index].ecgLeadOne
                  graph[index]['ecgLead2'] = this.ecgGraphData[index].ecgLeadTwo
                  graph[index]['ecgLead3'] = this.ecgGraphData[index].ecgLeadThree
                }
                else {
                  graph[index - 1]['ecgLead1'] = this.ecgGraphData[index].ecgLeadOne
                  graph[index - 1]['ecgLead2'] = this.ecgGraphData[index].ecgLeadTwo
                  graph[index - 1]['ecgLead3'] = this.ecgGraphData[index].ecgLeadThree
                  graph[index - 1]['ecgLead4'] = this.ecgGraphData[index].ecgLeadFour
                  graph[index - 1]['ecgLead5'] = this.ecgGraphData[index].ecgLeadFive
                  graph[index - 1]['ecgLead6'] = this.ecgGraphData[index].ecgLeadSix
                  graph[index]['ecgLead1'] = this.ecgGraphData[index].ecgLeadOne
                  graph[index]['ecgLead2'] = this.ecgGraphData[index].ecgLeadTwo
                  graph[index]['ecgLead3'] = this.ecgGraphData[index].ecgLeadThree
                  graph[index]['ecgLead4'] = this.ecgGraphData[index].ecgLeadFour
                  graph[index]['ecgLead5'] = this.ecgGraphData[index].ecgLeadFive
                  graph[index]['ecgLead6'] = this.ecgGraphData[index].ecgLeadSix
                }
                test_cond = true
              }
              var dateDiff = this.timeDifference(DateOnlyCurrent, DateOnlyPrev);
              if (index == this.ecgGraphData.length - 1 && count_inc >= 1) {
                final_dp = count_inc;
                graph[count_inc]['x'] = this.ecgGraphData[index].x
                graph[count_inc]['y'] = this.ecgGraphData[index].y
                graph[count_inc]['color'] = this.ecgGraphData[index].color
                if (this.ecgGraphData[index].ecgLeadMode == 3) {
                  graph[count_inc]['ecgLead1'] = this.ecgGraphData[index].ecgLeadOne
                  graph[count_inc]['ecgLead2'] = this.ecgGraphData[index].ecgLeadTwo
                  graph[count_inc]['ecgLead3'] = this.ecgGraphData[index].ecgLeadThree
                }
                else {
                  graph[count_inc]['ecgLead1'] = this.ecgGraphData[index].ecgLeadOne
                  graph[count_inc]['ecgLead2'] = this.ecgGraphData[index].ecgLeadTwo
                  graph[count_inc]['ecgLead3'] = this.ecgGraphData[index].ecgLeadThree
                  graph[count_inc]['ecgLead4'] = this.ecgGraphData[index].ecgLeadFour
                  graph[count_inc]['ecgLead5'] = this.ecgGraphData[index].ecgLeadFive
                  graph[count_inc]['ecgLead6'] = this.ecgGraphData[index].ecgLeadSix
                }
              }
              if (dateDiff == 0) {
                //Nothing to do
              } else {
                if (diffInHoursForLastStart <= 48) {
                  test_cond = true
                } else {
                  test_cond = false;
                  graph[count_inc]['x'] = this.ecgGraphData[index - 1].x
                  graph[count_inc]['y'] = this.ecgGraphData[index - 1].y
                  graph[count_inc]['color'] = this.ecgGraphData[index - 1].color
                  if (this.ecgGraphData[index - 1].ecgLeadMode == 3) {
                    graph[count_inc]['ecgLead1'] = this.ecgGraphData[index - 1].ecgLeadOne
                    graph[count_inc]['ecgLead2'] = this.ecgGraphData[index - 1].ecgLeadTwo
                    graph[count_inc]['ecgLead3'] = this.ecgGraphData[index - 1].ecgLeadThree
                  }
                  else {
                    graph[count_inc]['ecgLead1'] = this.ecgGraphData[index - 1].ecgLeadOne
                    graph[count_inc]['ecgLead2'] = this.ecgGraphData[index - 1].ecgLeadTwo
                    graph[count_inc]['ecgLead3'] = this.ecgGraphData[index - 1].ecgLeadThree
                    graph[count_inc]['ecgLead4'] = this.ecgGraphData[index - 1].ecgLeadFour
                    graph[count_inc]['ecgLead5'] = this.ecgGraphData[index - 1].ecgLeadFive
                    graph[count_inc]['ecgLead6'] = this.ecgGraphData[index - 1].ecgLeadSix
                  }
                  final_dp = count_inc;
                  count_inc++;
                  if (index == this.ecgGraphData.length - 1 && count_inc >= 1 && diffInHoursForLastStart >= 48) {
                    final_dp = count_inc;
                    graph[count_inc]['x'] = this.ecgGraphData[index].x
                    graph[count_inc]['y'] = this.ecgGraphData[index].y
                    graph[count_inc]['color'] = this.ecgGraphData[index].color
                    if (this.ecgGraphData[index - 1].ecgLeadMode == 3) {
                      graph[count_inc]['ecgLead1'] = this.ecgGraphData[index].ecgLeadOne
                      graph[count_inc]['ecgLead2'] = this.ecgGraphData[index].ecgLeadTwo
                      graph[count_inc]['ecgLead3'] = this.ecgGraphData[index].ecgLeadThree
                    }
                    else {
                      graph[count_inc]['ecgLead1'] = this.ecgGraphData[index].ecgLeadOne
                      graph[count_inc]['ecgLead2'] = this.ecgGraphData[index].ecgLeadTwo
                      graph[count_inc]['ecgLead3'] = this.ecgGraphData[index].ecgLeadThree
                      graph[count_inc]['ecgLead4'] = this.ecgGraphData[index].ecgLeadFour
                      graph[count_inc]['ecgLead5'] = this.ecgGraphData[index].ecgLeadFive
                      graph[count_inc]['ecgLead6'] = this.ecgGraphData[index].ecgLeadSix
                    }
                  }
                }
              }
            }
          }
          else {

            if (last90Days <= testTakenDate) {
              if (init2 == 0) {
                var DateOnlyInit = new Date(this.ecgGraphData[index].z.slice(0, -10))
                var DateOnlyLast = new Date(this.ecgGraphData[this.ecgGraphData.length - 1].z.slice(0, -10))
                var diffInTimestampForLast = DateOnlyLast.valueOf() - DateOnlyInit.valueOf()
                var diffInHoursForLastStart = diffInTimestampForLast / 1000 / 60 / 60
              }
              if (diffInHoursForLastStart <= 48) {
                graph[count_inc]['x'] = this.ecgGraphData[index].x
                graph[count_inc]['y'] = this.ecgGraphData[index].y
                graph[count_inc]['color'] = this.ecgGraphData[index].color
                if (this.ecgGraphData[index].ecgLeadMode == 3) {
                  graph[count_inc]['ecgLead1'] = this.ecgGraphData[index].ecgLeadOne
                  graph[count_inc]['ecgLead2'] = this.ecgGraphData[index].ecgLeadTwo
                  graph[count_inc]['ecgLead3'] = this.ecgGraphData[index].ecgLeadThree
                }
                else {
                  graph[count_inc]['ecgLead1'] = this.ecgGraphData[index].ecgLeadOne
                  graph[count_inc]['ecgLead2'] = this.ecgGraphData[index].ecgLeadTwo
                  graph[count_inc]['ecgLead3'] = this.ecgGraphData[index].ecgLeadThree
                  graph[count_inc]['ecgLead4'] = this.ecgGraphData[index].ecgLeadFour
                  graph[count_inc]['ecgLead5'] = this.ecgGraphData[index].ecgLeadFive
                  graph[count_inc]['ecgLead6'] = this.ecgGraphData[index].ecgLeadSix
                }
                test_cond = true
                count_inc++
              }
              var DateOnly = new Date(this.ecgGraphData[index].z.slice(0, -10))
              if (index > 0 && init2 > 0) {
                var DateOnlyPrev = new Date(this.ecgGraphData[index - 1].z.slice(0, -10))
                var dateDiff = this.timeDifference(DateOnly, DateOnlyPrev)
                if (index == this.ecgGraphData.length - 1 && count_inc >= 1 && diffInHoursForLastStart > 48) {
                  final_dp = count_inc
                  graph[count_inc]['x'] = this.ecgGraphData[index].x
                  graph[count_inc]['y'] = this.ecgGraphData[index].y
                  graph[count_inc]['color'] = this.ecgGraphData[index].color
                  if (this.ecgGraphData[index].ecgLeadMode == 3) {
                    graph[count_inc]['ecgLead1'] = this.ecgGraphData[index].ecgLeadOne
                    graph[count_inc]['ecgLead2'] = this.ecgGraphData[index].ecgLeadTwo
                    graph[count_inc]['ecgLead3'] = this.ecgGraphData[index].ecgLeadThree
                  }
                  else {
                    graph[count_inc]['ecgLead1'] = this.ecgGraphData[index].ecgLeadOne
                    graph[count_inc]['ecgLead2'] = this.ecgGraphData[index].ecgLeadTwo
                    graph[count_inc]['ecgLead3'] = this.ecgGraphData[index].ecgLeadThree
                    graph[count_inc]['ecgLead4'] = this.ecgGraphData[index].ecgLeadFour
                    graph[count_inc]['ecgLead5'] = this.ecgGraphData[index].ecgLeadFive
                    graph[count_inc]['ecgLead6'] = this.ecgGraphData[index].ecgLeadSix
                  }
                }
                if (dateDiff == 0 || diffInHoursForLastStart <= 48) {
                  //Nothing to do
                } else {
                  test_cond = false
                  graph[count_inc]['x'] = this.ecgGraphData[index - 1].x
                  graph[count_inc]['y'] = this.ecgGraphData[index - 1].y
                  graph[count_inc]['color'] = this.ecgGraphData[index - 1].color
                  if (this.ecgGraphData[index - 1].ecgLeadMode == 3) {
                    graph[count_inc]['ecgLead1'] = this.ecgGraphData[index - 1].ecgLeadOne
                    graph[count_inc]['ecgLead2'] = this.ecgGraphData[index - 1].ecgLeadTwo
                    graph[count_inc]['ecgLead3'] = this.ecgGraphData[index - 1].ecgLeadThree
                  }
                  else {
                    graph[count_inc]['ecgLead1'] = this.ecgGraphData[index - 1].ecgLeadOne
                    graph[count_inc]['ecgLead2'] = this.ecgGraphData[index - 1].ecgLeadTwo
                    graph[count_inc]['ecgLead3'] = this.ecgGraphData[index - 1].ecgLeadThree
                    graph[count_inc]['ecgLead4'] = this.ecgGraphData[index - 1].ecgLeadFour
                    graph[count_inc]['ecgLead5'] = this.ecgGraphData[index - 1].ecgLeadFive
                    graph[count_inc]['ecgLead6'] = this.ecgGraphData[index - 1].ecgLeadSix
                  }
                  final_dp = count_inc
                  count_inc++
                  if (index == this.ecgGraphData.length - 1 && count_inc >= 1) {
                    final_dp = count_inc
                    graph[count_inc]['x'] = this.ecgGraphData[index].x
                    graph[count_inc]['y'] = this.ecgGraphData[index].y
                    graph[count_inc]['color'] = this.ecgGraphData[index].color
                    if (this.ecgGraphData[index].ecgLeadMode == 3) {
                      graph[count_inc]['ecgLead1'] = this.ecgGraphData[index].ecgLeadOne
                      graph[count_inc]['ecgLead2'] = this.ecgGraphData[index].ecgLeadTwo
                      graph[count_inc]['ecgLead3'] = this.ecgGraphData[index].ecgLeadThree
                    }
                    else {
                      graph[count_inc]['ecgLead1'] = this.ecgGraphData[index].ecgLeadOne
                      graph[count_inc]['ecgLead2'] = this.ecgGraphData[index].ecgLeadTwo
                      graph[count_inc]['ecgLead3'] = this.ecgGraphData[index].ecgLeadThree
                      graph[count_inc]['ecgLead4'] = this.ecgGraphData[index].ecgLeadFour
                      graph[count_inc]['ecgLead5'] = this.ecgGraphData[index].ecgLeadFive
                      graph[count_inc]['ecgLead6'] = this.ecgGraphData[index].ecgLeadSix
                    }
                  }
                }
              }
              init2++
            }
          }
        }
        var beforeDate = null
        var dtArr = []
        var dt = 0
        if (test_cond === true) {
          for (let i = graph.length - 1; i > -1; i--) {
            if (graph[i]['y'] != undefined) {
              dtArr[dt] = graph[i]
              dt++
            }
          }
        } else {
          for (let i = final_dp; i > -1; i--) {
            if (graph[i]['y'] != undefined) {
              dtArr[dt] = graph[i]
              dt++
            }
          }
        }
        if (dtArr.length < 2) {
          $('#ecgChartContainer').hide()
          this.showMinimumError = true
          this.loadingMessage = false
        } else {
          $('#ecgChartContainer').show()
          this.showMinimumError = false
        }
        if (test_cond) {
          var chartFor2Days = new CanvasJS.Chart("ecgChartContainer",
            {
              title: {
                text: "Select a point to view ECG Graph",
              },
              toolTip: {
                fontFamily: "'Quicksand', 'sans-serif'",
                borderThickness: "0",
                cornerRadius: 10,
                content: "<span style='\"'color: {color}'\"'>ECG : {y} bpm <br>Date : {x}</span>"
              },
              animationEnabled: true,
              animationDuration: 2000,
              responsive: true,
              maintainAspectRatio: false,
              axisX: {
                lineThickness: 0,
                tickThickness: 0,
                gridColor: "Silver",
                valueFormatString: "DD/MMM hh TT",
                labelFontSize: 12,
                labelFontWeight: "bold",
                labelFontColor: "#808080",
                labelFontFamily: "'Quicksand', 'sans-serif'"
              },
              axisY: {
                maximum: 120,
                minimum: 30,
                interval: 20,
                lineThickness: 0,
                tickThickness: 0,
                gridThickness: 0,
                labelFontSize: 12,
                labelFontWeight: "bold",
                labelFontColor: "#808080",
                labelFontFamily: "'Quicksand', 'sans-serif'"
              },
              legend: {
                fontSize: 15,
                fontFamily: "'Quicksand', 'sans-serif'",
                fontColor: "#808080"
              },
              data: [
                {
                  type: "splineArea",
                  showInLegend: true,
                  legendText: "Normal Sinus Rhythm",
                  legendMarkerType: "square",
                  legendMarkerColor: "#43A047",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                {
                  type: "splineArea",
                  showInLegend: true,
                  legendText: "Require Doctor Attention",
                  legendMarkerType: "square",
                  legendMarkerColor: "#d32f2f",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                {
                  type: "splineArea",
                  lineThickness: 2,
                  color: "#4885ed",
                  lineColor: "#4885ed",
                  fillOpacity: 0.1,
                  markerSize: 11,
                  dataPoints: dtArr
                }
              ]
            })
          for (var i = 0; i < ecgChart.options.data.length; i++) {
            ecgChart.options.data[i].click = this.onClick
          }
          setTimeout(() => {
            this.loadingMessage = false
            chartFor2Days.render()
          }, 2000)
        }
        else {
          var ecgChart = new CanvasJS.Chart("ecgChartContainer",
            {
              title: {
                text: "Select a point to view ECG Graph",
                dockInsidePlotArea: true,
                fontFamily: "'Quicksand', 'sans-serif'",
                fontSize: 12,
                horizontalAlign: "right",
                fontColor: "black",
              },
              toolTip: {
                fontFamily: "'Quicksand', 'sans-serif'",
                borderThickness: "0",
                cornerRadius: 10,
                content: "<span style='\"'color: {color}'\"'>ECG : {y} bpm <br>Date : {x}</span>"
              },
              animationEnabled: true,
              animationDuration: 2000,
              responsive: true,
              maintainAspectRatio: false,
              axisX: {
                lineThickness: 0,
                tickThickness: 0,
                gridColor: "Silver",
                valueFormatString: "DD/MMM",
                labelFontSize: 12,
                labelFontWeight: "bold",
                labelFontColor: "#808080",
                labelFontFamily: "'Quicksand', 'sans-serif'"
              },
              axisY: {
                maximum: 120,
                minimum: 30,
                interval: 20,
                lineThickness: 0,
                tickThickness: 0,
                gridThickness: 0,
                labelFontSize: 12,
                labelFontWeight: "bold",
                labelFontColor: "#808080",
                labelFontFamily: "'Quicksand', 'sans-serif'"
              },
              legend: {
                fontSize: 15,
                fontFamily: "'Quicksand', 'sans-serif'",
                fontColor: "#808080"
              },
              data: [
                {
                  type: "splineArea",
                  showInLegend: true,
                  legendText: "Normal Sinus Rhythm",
                  legendMarkerType: "square",
                  legendMarkerColor: "#43A047",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                {
                  type: "splineArea",
                  showInLegend: true,
                  legendText: "Require Doctor Attention",
                  legendMarkerType: "square",
                  legendMarkerColor: "#d32f2f",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                {
                  type: "splineArea",
                  lineThickness: 2,
                  color: "#4885ed",
                  lineColor: "#4885ed",
                  fillOpacity: 0.1,
                  markerSize: 11,
                  dataPoints: dtArr
                }
              ]
            })
          for (var i = 0; i < ecgChart.options.data.length; i++) {
            ecgChart.options.data[i].click = this.onClick
          }
          setTimeout(() => {
            this.loadingMessage = false
            ecgChart.render()
          }, 2000)
        }
      }
    }
    if (this.testType == "Blood Pressure") {
      if (this.bpSystolicGraphData.length < 2) {
        this.showMinimumError = true
        this.loadingMessage = false
      }
      else {
        this.showMinimumError = false

        for (let index = 0, count_inc = 0, init2 = 0; this.bpSystolicGraphData.length > index; index++) {
          graph[index] = {}
          bpDiastolicGraph[index] = {}
          if (GraphPeriod !== "showAllDays") {
            var testTakenDate = this.bpSystolicGraphData[index].x
          }
          if (index == 0) {
            if (GraphPeriod === "showAllDays") {
              var DateOnlyInit = new Date(this.bpSystolicGraphData[index].z.slice(0, -10))
            }
          }
          if (GraphPeriod === "showAllDays") {
            if (index > 0) {
              var DateOnlyPrev = new Date(this.bpSystolicGraphData[index - 1].z.slice(0, -10))
              var DateOnlyCurrent = new Date(this.bpSystolicGraphData[index].z.slice(0, -10))
              var DateOnlyLast = new Date(this.bpSystolicGraphData[this.bpSystolicGraphData.length - 1].z.slice(0, -10))
              var diffInTimestampForLast = DateOnlyLast.valueOf() - DateOnlyInit.valueOf()
              var diffInHoursForLastStart = diffInTimestampForLast / 1000 / 60 / 60
              if (diffInHoursForLastStart <= 48) {
                graph[index - 1]['x'] = this.bpSystolicGraphData[index - 1].x
                graph[index - 1]['y'] = this.bpSystolicGraphData[index - 1].y
                graph[index - 1]['a'] = this.bpSystolicGraphData[index - 1].a
                graph[index - 1]['b'] = this.bpSystolicGraphData[index - 1].b
                graph[index - 1]['color'] = this.bpSystolicGraphData[index - 1].color
                graph[index]['x'] = this.bpSystolicGraphData[index].x
                graph[index]['y'] = this.bpSystolicGraphData[index].y
                graph[index]['a'] = this.bpSystolicGraphData[index].a
                graph[index]['b'] = this.bpSystolicGraphData[index].b
                graph[index]['color'] = this.bpSystolicGraphData[index].color
                bpDiastolicGraph[index - 1]['x'] = this.bpDiastolicGraphData[index - 1].x
                bpDiastolicGraph[index - 1]['y'] = this.bpDiastolicGraphData[index - 1].y
                bpDiastolicGraph[index - 1]['a'] = this.bpDiastolicGraphData[index - 1].a
                bpDiastolicGraph[index - 1]['b'] = this.bpDiastolicGraphData[index - 1].b
                bpDiastolicGraph[index - 1]['color'] = this.bpDiastolicGraphData[index - 1].color
                bpDiastolicGraph[index]['x'] = this.bpDiastolicGraphData[index].x
                bpDiastolicGraph[index]['y'] = this.bpDiastolicGraphData[index].y
                bpDiastolicGraph[index]['a'] = this.bpDiastolicGraphData[index].a
                bpDiastolicGraph[index]['b'] = this.bpDiastolicGraphData[index].b
                bpDiastolicGraph[index]['color'] = this.bpDiastolicGraphData[index].color
                test_cond = true
              }
              var dateDiff = this.timeDifference(DateOnlyCurrent, DateOnlyPrev);
              if (index == this.bpSystolicGraphData.length - 1 && count_inc >= 1) {
                final_dp = count_inc;
                graph[count_inc]['x'] = this.bpSystolicGraphData[index].x
                graph[count_inc]['y'] = this.bpSystolicGraphData[index].y
                graph[count_inc]['a'] = this.bpSystolicGraphData[index].a
                graph[count_inc]['b'] = this.bpSystolicGraphData[index].b
                graph[count_inc]['color'] = this.bpSystolicGraphData[index].color
                bpDiastolicGraph[count_inc]['x'] = this.bpDiastolicGraphData[index].x
                bpDiastolicGraph[count_inc]['y'] = this.bpDiastolicGraphData[index].y
                bpDiastolicGraph[count_inc]['a'] = this.bpDiastolicGraphData[index].a
                bpDiastolicGraph[count_inc]['b'] = this.bpDiastolicGraphData[index].b
                bpDiastolicGraph[count_inc]['color'] = this.bpDiastolicGraphData[index].color
              }
              if (dateDiff == 0) {
                //Nothing to do
              } else {
                if (diffInHoursForLastStart <= 48) {
                  test_cond = true
                } else {
                  test_cond = false;
                  graph[count_inc]['x'] = this.bpSystolicGraphData[index - 1].x
                  graph[count_inc]['y'] = this.bpSystolicGraphData[index - 1].y
                  graph[count_inc]['a'] = this.bpSystolicGraphData[index - 1].a
                  graph[count_inc]['b'] = this.bpSystolicGraphData[index - 1].b
                  graph[count_inc]['color'] = this.bpSystolicGraphData[index - 1].color
                  bpDiastolicGraph[count_inc]['x'] = this.bpDiastolicGraphData[index - 1].x
                  bpDiastolicGraph[count_inc]['y'] = this.bpDiastolicGraphData[index - 1].y
                  bpDiastolicGraph[count_inc]['a'] = this.bpDiastolicGraphData[index - 1].a
                  bpDiastolicGraph[count_inc]['b'] = this.bpDiastolicGraphData[index - 1].b
                  bpDiastolicGraph[count_inc]['color'] = this.bpDiastolicGraphData[index - 1].color
                  final_dp = count_inc;
                  count_inc++;
                  if (index == this.bpSystolicGraphData.length - 1 && count_inc >= 1 && diffInHoursForLastStart >= 48) {
                    final_dp = count_inc;
                    graph[count_inc]['x'] = this.bpSystolicGraphData[index].x
                    graph[count_inc]['y'] = this.bpSystolicGraphData[index].y
                    graph[count_inc]['a'] = this.bpSystolicGraphData[index].a
                    graph[count_inc]['b'] = this.bpSystolicGraphData[index].b
                    graph[count_inc]['color'] = this.bpSystolicGraphData[index].color
                    bpDiastolicGraph[count_inc]['x'] = this.bpDiastolicGraphData[index].x
                    bpDiastolicGraph[count_inc]['y'] = this.bpDiastolicGraphData[index].y
                    bpDiastolicGraph[count_inc]['a'] = this.bpDiastolicGraphData[index].a
                    bpDiastolicGraph[count_inc]['b'] = this.bpDiastolicGraphData[index].b
                    bpDiastolicGraph[count_inc]['color'] = this.bpDiastolicGraphData[index].color
                  }
                }
              }
            }
          }
          else {
            if (last90Days <= testTakenDate) {
              if (init2 == 0) {
                var DateOnlyInit = new Date(this.bpSystolicGraphData[index].z.slice(0, -10))
                var DateOnlyLast = new Date(this.bpSystolicGraphData[this.bpSystolicGraphData.length - 1].z.slice(0, -10))
                var diffInTimestampForLast = DateOnlyLast.valueOf() - DateOnlyInit.valueOf()
                var diffInHoursForLastStart = diffInTimestampForLast / 1000 / 60 / 60
              }
              if (diffInHoursForLastStart <= 48) {
                graph[count_inc]['x'] = this.bpSystolicGraphData[index].x
                graph[count_inc]['y'] = this.bpSystolicGraphData[index].y
                graph[count_inc]['a'] = this.bpSystolicGraphData[index].a
                graph[count_inc]['b'] = this.bpSystolicGraphData[index].b
                graph[count_inc]['color'] = this.bpSystolicGraphData[index].color
                bpDiastolicGraph[count_inc]['x'] = this.bpDiastolicGraphData[index].x
                bpDiastolicGraph[count_inc]['y'] = this.bpDiastolicGraphData[index].y
                bpDiastolicGraph[count_inc]['a'] = this.bpDiastolicGraphData[index].a
                bpDiastolicGraph[count_inc]['b'] = this.bpDiastolicGraphData[index].b
                bpDiastolicGraph[count_inc]['color'] = this.bpDiastolicGraphData[index].color
                test_cond = true
                count_inc++
              }
              var DateOnly = new Date(this.bpSystolicGraphData[index].z.slice(0, -10))
              if (index > 0 && init2 > 0) {
                var DateOnlyPrev = new Date(this.bpSystolicGraphData[index - 1].z.slice(0, -10))
                var dateDiff = this.timeDifference(DateOnly, DateOnlyPrev)
                if (index == this.bpSystolicGraphData.length - 1 && count_inc >= 1 && diffInHoursForLastStart > 48) {
                  final_dp = count_inc
                  graph[count_inc]['x'] = this.bpSystolicGraphData[index].x
                  graph[count_inc]['y'] = this.bpSystolicGraphData[index].y
                  graph[count_inc]['a'] = this.bpSystolicGraphData[index].a
                  graph[count_inc]['b'] = this.bpSystolicGraphData[index].b
                  graph[count_inc]['color'] = this.bpSystolicGraphData[index].color
                  bpDiastolicGraph[count_inc]['x'] = this.bpDiastolicGraphData[index].x
                  bpDiastolicGraph[count_inc]['y'] = this.bpDiastolicGraphData[index].y
                  bpDiastolicGraph[count_inc]['a'] = this.bpDiastolicGraphData[index].a
                  bpDiastolicGraph[count_inc]['b'] = this.bpDiastolicGraphData[index].b
                  bpDiastolicGraph[count_inc]['color'] = this.bpDiastolicGraphData[index].color
                }
                if (dateDiff == 0 || diffInHoursForLastStart <= 48) {
                  //Nothing to do
                } else {
                  test_cond = false
                  graph[count_inc]['x'] = this.bpSystolicGraphData[index - 1].x
                  graph[count_inc]['y'] = this.bpSystolicGraphData[index - 1].y
                  graph[count_inc]['a'] = this.bpSystolicGraphData[index - 1].a
                  graph[count_inc]['b'] = this.bpSystolicGraphData[index - 1].b
                  graph[count_inc]['color'] = this.bpSystolicGraphData[index - 1].color
                  bpDiastolicGraph[count_inc]['x'] = this.bpDiastolicGraphData[index - 1].x
                  bpDiastolicGraph[count_inc]['y'] = this.bpDiastolicGraphData[index - 1].y
                  bpDiastolicGraph[count_inc]['a'] = this.bpDiastolicGraphData[index - 1].a
                  bpDiastolicGraph[count_inc]['b'] = this.bpDiastolicGraphData[index - 1].b
                  bpDiastolicGraph[count_inc]['color'] = this.bpDiastolicGraphData[index - 1].color
                  final_dp = count_inc
                  count_inc++
                  if (index == this.bpSystolicGraphData.length - 1 && count_inc >= 1) {
                    final_dp = count_inc
                    graph[count_inc]['x'] = this.bpSystolicGraphData[index].x
                    graph[count_inc]['y'] = this.bpSystolicGraphData[index].y
                    graph[count_inc]['a'] = this.bpSystolicGraphData[index].a
                    graph[count_inc]['b'] = this.bpSystolicGraphData[index].b
                    graph[count_inc]['color'] = this.bpSystolicGraphData[index].color
                    bpDiastolicGraph[count_inc]['x'] = this.bpDiastolicGraphData[index].x
                    bpDiastolicGraph[count_inc]['y'] = this.bpDiastolicGraphData[index].y
                    bpDiastolicGraph[count_inc]['a'] = this.bpDiastolicGraphData[index].a
                    bpDiastolicGraph[count_inc]['b'] = this.bpDiastolicGraphData[index].b
                    bpDiastolicGraph[count_inc]['color'] = this.bpDiastolicGraphData[index].color
                  }
                }
              }
              init2++
            }
          }
        }
        var beforeDate = null
        var dtArr = []
        var bpDiastolicdtArr = []
        var dt = 0
        if (test_cond === true) {
          for (let i = graph.length - 1; i > -1; i--) {
            if (graph[i]['y'] != undefined) {
              dtArr[dt] = graph[i]
              bpDiastolicdtArr[dt] = bpDiastolicGraph[i]
              dt++
            }
          }
        } else {
          for (let i = final_dp; i > -1; i--) {
            if (graph[i]['y'] != undefined) {
              dtArr[dt] = graph[i]
              bpDiastolicdtArr[dt] = bpDiastolicGraph[i]
              dt++
            }
          }
        }
        if (dtArr.length < 2) {
          $('#bpChartContainer').hide()
          this.showMinimumError = true
          this.loadingMessage = false
        } else {
          $('#bpChartContainer').show()
          this.showMinimumError = false
        }
        if (test_cond) {
          var chartFor2Days = new CanvasJS.Chart("bpChartContainer",
            {
              toolTip: {
                fontFamily: "'Quicksand', 'sans-serif'",
                cornerRadius: 10,
                borderThickness: "0",
                content: "<span style='\"'color: {color}'\"'>Systolic : {a} <br>Diastolic : {b} <br>Date : {x}</span>"
              },
              animationEnabled: true,
              animationDuration: 2000,
              axisX: {
                lineThickness: 0,
                tickThickness: 0,
                gridColor: "Silver",
                valueFormatString: "DD/MMM hh TT",
                labelFontSize: 12,
                labelFontWeight: "bold",
                labelFontColor: "#808080",
                labelFontFamily: "'Quicksand', 'sans-serif'"
              },
              axisY: {
                lineThickness: 0,
                tickThickness: 0,
                gridThickness: 0,
                labelFontSize: 12,
                labelFontWeight: "bold",
                labelFontColor: "#808080",
                labelFontFamily: "'Quicksand', 'sans-serif'"
              },
              legend: {
                fontSize: 15,
                fontFamily: "'Quicksand', 'sans-serif'",
                fontColor: "#808080"
              },
              data: [
                {
                  type: "splineArea",
                  showInLegend: true,
                  legendText: "Normal",
                  legendMarkerType: "square",
                  legendMarkerColor: "#43A047",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                {
                  type: "splineArea",
                  showInLegend: true,
                  legendText: "Acceptable",
                  legendMarkerType: "square",
                  legendMarkerColor: "#ff9800",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                // {
                //   type: "splineArea",
                //   showInLegend: true,
                //   legendText: "Isolated Diastolic",
                //   legendMarkerType: "square",
                //   legendMarkerColor: "#C0CA33",
                //   fillOpacity: 0,
                //   lineThickness: 0,
                //   markerSize: 0,
                //   dataPoints: dtArr
                // },
                // {
                //   type: "splineArea",
                //   showInLegend: true,
                //   legendText: "Isolated Systolic",
                //   legendMarkerType: "square",
                //   legendMarkerColor: "#FFB300",
                //   fillOpacity: 0,
                //   lineThickness: 0,
                //   markerSize: 0,
                //   dataPoints: dtArr
                // },
                // {
                //   type: "splineArea",
                //   showInLegend: true,
                //   legendText: "Low",
                //   legendMarkerType: "square",
                //   legendMarkerColor: "#ff5722",
                //   fillOpacity: 0,
                //   lineThickness: 0,
                //   markerSize: 0,
                //   dataPoints: dtArr
                // },
                {
                  type: "splineArea",
                  showInLegend: true,
                  legendText: "High",
                  legendMarkerType: "square",
                  legendMarkerColor: "#d32f2f",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                {
                  type: "splineArea",
                  lineThickness: 2,
                  lineColor: "#4885ed",
                  fillOpacity: 0.1,
                  markerSize: 11,
                  dataPoints: dtArr
                },
                {
                  type: "splineArea",
                  lineThickness: 2,
                  lineColor: "#D0312D",
                  fillOpacity: 0.1,
                  markerSize: 11,
                  dataPoints: bpDiastolicdtArr
                }
              ]
            })
          setTimeout(() => {
            this.loadingMessage = false
            chartFor2Days.render()
          }, 2000)
        }
        else {
          var bpChart = new CanvasJS.Chart("bpChartContainer",
            {
              toolTip: {
                fontFamily: "'Quicksand', 'sans-serif'",
                cornerRadius: 10,
                borderThickness: "0",
                content: "<span style='\"'color: {color}'\"'>Systolic : {a} <br>Diastolic : {b} <br>Date : {x}</span>"
              },
              animationEnabled: true,
              animationDuration: 2000,
              axisX: {
                lineThickness: 0,
                tickThickness: 0,
                gridColor: "Silver",
                valueFormatString: "DD/MMM",
                labelFontSize: 12,
                labelFontWeight: "bold",
                labelFontColor: "#808080",
                labelFontFamily: "'Quicksand', 'sans-serif'"
              },
              axisY: {
                lineThickness: 0,
                tickThickness: 0,
                gridThickness: 0,
                labelFontSize: 12,
                labelFontWeight: "bold",
                labelFontColor: "#808080",
                labelFontFamily: "'Quicksand', 'sans-serif'"
              },
              legend: {
                fontSize: 15,
                fontFamily: "'Quicksand', 'sans-serif'",
                fontColor: "#808080"
              },
              data: [
                {
                  type: "splineArea",
                  showInLegend: true,
                  legendText: "Normal",
                  legendMarkerType: "square",
                  legendMarkerColor: "#43A047",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                {
                  type: "splineArea",
                  showInLegend: true,
                  legendText: "Acceptable",
                  legendMarkerType: "square",
                  legendMarkerColor: "#ff9800",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                // {
                //   type: "splineArea",
                //   showInLegend: true,
                //   legendText: "Isolated Diastolic",
                //   legendMarkerType: "square",
                //   legendMarkerColor: "#C0CA33",
                //   fillOpacity: 0,
                //   lineThickness: 0,
                //   markerSize: 0,
                //   dataPoints: dtArr
                // },
                // {
                //   type: "splineArea",
                //   showInLegend: true,
                //   legendText: "Isolated Systolic",
                //   legendMarkerType: "square",
                //   legendMarkerColor: "#FFB300",
                //   fillOpacity: 0,
                //   lineThickness: 0,
                //   markerSize: 0,
                //   dataPoints: dtArr
                // },
                // {
                //   type: "splineArea",
                //   showInLegend: true,
                //   legendText: "Low",
                //   legendMarkerType: "square",
                //   legendMarkerColor: "#ff5722",
                //   fillOpacity: 0,
                //   lineThickness: 0,
                //   markerSize: 0,
                //   dataPoints: dtArr
                // },
                {
                  type: "splineArea",
                  showInLegend: true,
                  legendText: "High",
                  legendMarkerType: "square",
                  legendMarkerColor: "#d32f2f",
                  fillOpacity: 0,
                  lineThickness: 0,
                  markerSize: 0,
                  dataPoints: dtArr
                },
                {
                  type: "splineArea",
                  lineThickness: 2,
                  lineColor: "#4885ed",
                  fillOpacity: 0.1,
                  markerSize: 11,
                  dataPoints: dtArr
                },
                {
                  type: "splineArea",
                  lineThickness: 2,
                  lineColor: "#D0312D",
                  fillOpacity: 0.1,
                  markerSize: 11,
                  dataPoints: bpDiastolicdtArr
                }
              ]
            })
          setTimeout(() => {
            this.loadingMessage = false
            bpChart.render()
          }, 2000)
        }
      }
    }
  }

  onClick = (e: any) => {
    this.data = e.dataPoint
    $("#ecgChartContainer").hide()
    if (this.data.ecgLead4 === "" || this.data.ecgLead4 === undefined) {
      this.previousNav = false
      this.nextNav = false
      var x = window.matchMedia("(max-width: 991px)")
      var y = window.matchMedia("(max-width: 479px)")
      if (y.matches) { // If media query matches
        document.getElementById("vitalChart").style.height = "280px";
      }
      else if (x.matches) { // If media query matches
        document.getElementById("vitalChart").style.height = "380px";
      }
      $("#ecgGraphChartContainerLead1").show()
      $("#ecgGraphChartContainerLead2").show()
      $("#ecgGraphChartContainerLead3").show()
      $("#ecgGraphChartContainerLead4").hide()
      $("#ecgGraphChartContainerLead5").hide()
      $("#ecgGraphChartContainerLead6").hide()
    }
    else {
      this.previousNav = false
      this.nextNav = true
      var x = window.matchMedia("(max-width: 991px)")
      var y = window.matchMedia("(max-width: 479px)")
      if (y.matches) { // If media query matches
        document.getElementById("vitalChart").style.height = "540px";
      }
      else if (x.matches) { // If media query matches
        document.getElementById("vitalChart").style.height = "700px";
      }
      $("#ecgGraphChartContainerLead1").show()
      $("#ecgGraphChartContainerLead2").show()
      $("#ecgGraphChartContainerLead3").show()
      $("#ecgGraphChartContainerLead4").show()
      $("#ecgGraphChartContainerLead5").show()
      $("#ecgGraphChartContainerLead6").show()
    }
    if (this.data.ecgLead4 === "" || this.data.ecgLead4 === undefined) {
      var xAxisStripLinesArray = []
      var yAxisStripLinesArray = []
      var dps = []
      var dataPointsArray = new Array()
      var maximumPeak
      var minimumPeak
      var finalPeak
      var ecgLeadIArraySmoothGraph = []
      var ecgLeadIMaximumValue = 0
      var ecgLeadIMinimumValue = 0
      var datapoints_in_string = ""
      var raw_data = this.data.ecgLead1
      datapoints_in_string = raw_data.split(',');
      for (var h = 0; h < datapoints_in_string.length; h++) {
        ecgLeadIArraySmoothGraph.push(parseFloat(datapoints_in_string[h]))
      }
      ecgLeadIMaximumValue = findMaxCealing(ecgLeadIArraySmoothGraph)
      ecgLeadIMinimumValue = findMinCealing(ecgLeadIArraySmoothGraph)
      if ((ecgLeadIMaximumValue) <= 1500 && (ecgLeadIMinimumValue) >= -500) {
        ecgLeadIMaximumValue = 1500
        ecgLeadIMinimumValue = -500
      }
      else if ((ecgLeadIMaximumValue) <= 1000 && (ecgLeadIMinimumValue) >= -1000) {
        ecgLeadIMaximumValue = 1000
        ecgLeadIMinimumValue = -1000
      }
      else if ((ecgLeadIMaximumValue) <= 500 && (ecgLeadIMinimumValue) >= -1500) {
        ecgLeadIMaximumValue = 500
        ecgLeadIMinimumValue = -1500
      }
      var localResultChart = function () {
        $("#ecgChartContainer").hide();
        $("#weightChartContainer").hide();
        $("#bpChartContainer").hide();
        $("#bmiChartContainer").hide();
        var chart = new CanvasJS.Chart("ecgGraphChartContainerLead1",
          {
            backgroundColor: "transparent",
            title: {
              text: "LEAD I",
              fontFamily: "'Quicksand', 'sans-serif'",
              labelFontColor: "#808080"
            },
            axisY: {
              stripLines: yAxisStripLinesArray,
              gridThickness: 2,
              gridColor: "#FABDDA",
              lineColor: "#FABDDA",
              tickThickness: 0,
              labelFontColor: "#FABDDA",
              labelFormatter: function (e) {
                return ""
              }
            },
            axisX: {
              stripLines: xAxisStripLinesArray,
              gridThickness: 2,
              gridColor: "#FABDDA",
              lineColor: "#FABDDA",
              tickThickness: 0,
              labelFontColor: "#FABDDA",
              labelFormatter: function (e) {
                return ""
              }
            },
            data: [
              {
                type: "spline",
                color: "black",
                lineThickness: 1,
                dataPoints: dps
              }]
          })

        for (var h = 0; h < datapoints_in_string.length; h++) {
          dataPointsArray.push(parseFloat(datapoints_in_string[h]))
        }
        addDataPoints(chart)
        addStripLines(chart)
      }
      var xAxisStripLinesArrayLead2 = []
      var yAxisStripLinesArrayLead2 = []
      var dpsLead2 = []
      var dataPointsArrayLead2 = new Array()
      var maximumPeakLead2
      var minimumPeakLead2
      var finalPeakLead2
      var ecgArraySmoothGraphLead2 = []
      var ecgMaximumValueLead2 = 0
      var ecgMinimumValueLead2 = 0
      var datapoints_in_string1 = ""
      var raw_data1 = this.data.ecgLead2
      datapoints_in_string1 = raw_data1.split(',');
      for (var h = 0; h < datapoints_in_string1.length; h++) {
        ecgArraySmoothGraphLead2.push(parseFloat(datapoints_in_string1[h]))
      }
      ecgMaximumValueLead2 = findMaxCealing(ecgArraySmoothGraphLead2)
      ecgMinimumValueLead2 = findMinCealing(ecgArraySmoothGraphLead2)
      if ((ecgMaximumValueLead2) <= 1500 && (ecgMinimumValueLead2) >= -500) {
        ecgMaximumValueLead2 = 1500
        ecgLeadIMinimumValue = -500
      }
      else if ((ecgMaximumValueLead2) <= 1000 && (ecgMinimumValueLead2) >= -1000) {
        ecgMaximumValueLead2 = 1000
        ecgMinimumValueLead2 = -1000
      }
      else if ((ecgMaximumValueLead2) <= 500 && (ecgMinimumValueLead2) >= -1500) {
        ecgMaximumValueLead2 = 500
        ecgMinimumValueLead2 = -1500
      }
      var chart1 = new CanvasJS.Chart("ecgGraphChartContainerLead2",
        {
          backgroundColor: "transparent",
          title: {
            text: "LEAD II",
            fontFamily: "'Quicksand', 'sans-serif'",
            labelFontColor: "#808080"
          },
          axisY: {
            stripLines: yAxisStripLinesArrayLead2,
            gridThickness: 2,
            gridColor: "#FABDDA",
            lineColor: "#FABDDA",
            tickThickness: 0,
            labelFontColor: "#FABDDA",
            labelFormatter: function (e) {
              return ""
            }
          },
          axisX: {
            stripLines: xAxisStripLinesArrayLead2,
            gridThickness: 2,
            gridColor: "#FABDDA",
            lineColor: "#FABDDA",
            tickThickness: 0,
            labelFontColor: "#FABDDA",
            labelFormatter: function (e) {
              return ""
            }
          },
          data: [
            {
              type: "spline",
              color: "black",
              lineThickness: 1,
              dataPoints: dpsLead2
            }]
        })
      for (var h = 0; h < datapoints_in_string1.length; h++) {
        dataPointsArrayLead2.push(parseFloat(datapoints_in_string1[h]))
      }
      addDataPoints1(chart1)
      addStripLines1(chart1)
      var xAxisStripLinesArrayLead3 = []
      var yAxisStripLinesArrayLead3 = []
      var dpsLead3 = []
      var dataPointsArrayLead3 = new Array()
      var maximumPeakLead3
      var minimumPeakLead3
      var finalPeakLead3
      var ecgArraySmoothGraphLead3 = []
      var ecgMaximumValueLead3 = 0
      var ecgMinimumValueLead3 = 0
      var datapoints_in_string3 = ""
      var raw_data3 = this.data.ecgLead3
      datapoints_in_string3 = raw_data3.split(',');
      for (var h = 0; h < datapoints_in_string3.length; h++) {
        ecgArraySmoothGraphLead3.push(parseFloat(datapoints_in_string3[h]))
      }
      ecgMaximumValueLead3 = findMaxCealing(ecgArraySmoothGraphLead3)
      ecgMinimumValueLead3 = findMinCealing(ecgArraySmoothGraphLead3)
      if ((ecgMaximumValueLead3) <= 1500 && (ecgMinimumValueLead3) >= -500) {
        ecgMaximumValueLead3 = 1500
        ecgMinimumValueLead3 = -500
      }
      else if ((ecgMaximumValueLead3) <= 1000 && (ecgMinimumValueLead3) >= -1000) {
        ecgMaximumValueLead3 = 1000
        ecgMinimumValueLead3 = -1000
      }
      else if ((ecgMaximumValueLead3) <= 500 && (ecgMinimumValueLead3) >= -1500) {
        ecgMaximumValueLead3 = 500
        ecgMinimumValueLead3 = -1500
      }
      var chart3 = new CanvasJS.Chart("ecgGraphChartContainerLead3",
        {
          backgroundColor: "transparent",
          title: {
            text: "LEAD III",
            fontFamily: "'Quicksand', 'sans-serif'",
            labelFontColor: "#808080"
          },
          axisY: {
            stripLines: yAxisStripLinesArrayLead3,
            gridThickness: 2,
            gridColor: "#FABDDA",
            lineColor: "#FABDDA",
            tickThickness: 0,
            labelFontColor: "#FABDDA",
            labelFormatter: function (e) {
              return ""
            }
          },
          axisX: {
            stripLines: xAxisStripLinesArrayLead3,
            gridThickness: 2,
            gridColor: "#FABDDA",
            lineColor: "#FABDDA",
            tickThickness: 0,
            labelFontColor: "#FABDDA",
            labelFormatter: function (e) {
              return ""
            }
          },
          data: [
            {
              type: "spline",
              color: "black",
              lineThickness: 1,
              dataPoints: dpsLead3
            }]
        })
      for (var h = 0; h < datapoints_in_string3.length; h++) {
        dataPointsArrayLead3.push(parseFloat(datapoints_in_string3[h]))
      }
      addDataPoints3(chart3)
      addStripLines3(chart3)
    }
    else {
      var xAxisStripLinesArray = []
      var yAxisStripLinesArray = []
      var dps = []
      var dataPointsArray = new Array()
      var maximumPeak
      var minimumPeak
      var finalPeak
      var ecgLeadIArraySmoothGraph = []
      var ecgLeadIMaximumValue = 0
      var ecgLeadIMinimumValue = 0
      var datapoints_in_string = ""
      var raw_data = this.data.ecgLead1

      datapoints_in_string = raw_data.split(',');
      for (var h = 0; h < datapoints_in_string.length; h++) {
        ecgLeadIArraySmoothGraph.push(parseFloat(datapoints_in_string[h]))
      }
      ecgLeadIMaximumValue = findMaxCealing(ecgLeadIArraySmoothGraph)
      ecgLeadIMinimumValue = findMinCealing(ecgLeadIArraySmoothGraph)
      if ((ecgLeadIMaximumValue) <= 1500 && (ecgLeadIMinimumValue) >= -500) {
        ecgLeadIMaximumValue = 1500
        ecgLeadIMinimumValue = -500
      }
      else if ((ecgLeadIMaximumValue) <= 1000 && (ecgLeadIMinimumValue) >= -1000) {
        ecgLeadIMaximumValue = 1000
        ecgLeadIMinimumValue = -1000
      }
      else if ((ecgLeadIMaximumValue) <= 500 && (ecgLeadIMinimumValue) >= -1500) {
        ecgLeadIMaximumValue = 500
        ecgLeadIMinimumValue = -1500
      }
      var localResultChart = function () {
        $("#ecgChartContainer").hide();
        $("#weightChartContainer").hide();
        $("#bpChartContainer").hide();
        $("#bmiChartContainer").hide();
        var chart = new CanvasJS.Chart("ecgGraphChartContainerLead1",
          {
            backgroundColor: "transparent",
            title: {
              text: "LEAD I",
              fontFamily: "'Quicksand', 'sans-serif'",
              labelFontColor: "#808080"
            },
            axisY: {
              stripLines: yAxisStripLinesArray,
              gridThickness: 2,
              gridColor: "#FABDDA",
              lineColor: "#FABDDA",
              tickThickness: 0,
              labelFontColor: "#FABDDA",
              labelFormatter: function (e) {
                return ""
              }
            },
            axisX: {
              stripLines: xAxisStripLinesArray,
              gridThickness: 2,
              gridColor: "#FABDDA",
              lineColor: "#FABDDA",
              tickThickness: 0,
              labelFontColor: "#FABDDA",
              labelFormatter: function (e) {
                return ""
              }
            },
            data: [
              {
                type: "spline",
                color: "black",
                lineThickness: 1,
                dataPoints: dps
              }]
          })

        for (var h = 0; h < datapoints_in_string.length; h++) {
          dataPointsArray.push(parseFloat(datapoints_in_string[h]))
        }
        addDataPoints(chart)
        addStripLines(chart)
      }
      var xAxisStripLinesArrayLead2 = []
      var yAxisStripLinesArrayLead2 = []
      var dpsLead2 = []
      var dataPointsArrayLead2 = new Array()
      var maximumPeakLead2
      var minimumPeakLead2
      var finalPeakLead2
      var ecgArraySmoothGraphLead2 = []
      var ecgMaximumValueLead2 = 0
      var ecgMinimumValueLead2 = 0
      var datapoints_in_string1 = ""
      var raw_data1 = this.data.ecgLead2
      datapoints_in_string1 = raw_data1.split(',');
      for (var h = 0; h < datapoints_in_string1.length; h++) {
        ecgArraySmoothGraphLead2.push(parseFloat(datapoints_in_string1[h]))
      }
      ecgMaximumValueLead2 = findMaxCealing(ecgArraySmoothGraphLead2)
      ecgMinimumValueLead2 = findMinCealing(ecgArraySmoothGraphLead2)
      if ((ecgMaximumValueLead2) <= 1500 && (ecgMinimumValueLead2) >= -500) {
        ecgMaximumValueLead2 = 1500
        ecgLeadIMinimumValue = -500
      }
      else if ((ecgMaximumValueLead2) <= 1000 && (ecgMinimumValueLead2) >= -1000) {
        ecgMaximumValueLead2 = 1000
        ecgMinimumValueLead2 = -1000
      }
      else if ((ecgMaximumValueLead2) <= 500 && (ecgMinimumValueLead2) >= -1500) {
        ecgMaximumValueLead2 = 500
        ecgMinimumValueLead2 = -1500
      }
      var chart1 = new CanvasJS.Chart("ecgGraphChartContainerLead2",
        {
          backgroundColor: "transparent",
          title: {
            text: "LEAD II",
            fontFamily: "'Quicksand', 'sans-serif'",
            labelFontColor: "#808080"
          },
          axisY: {
            stripLines: yAxisStripLinesArrayLead2,
            gridThickness: 2,
            gridColor: "#FABDDA",
            lineColor: "#FABDDA",
            tickThickness: 0,
            labelFontColor: "#FABDDA",
            labelFormatter: function (e) {
              return ""
            }
          },
          axisX: {
            stripLines: xAxisStripLinesArrayLead2,
            gridThickness: 2,
            gridColor: "#FABDDA",
            lineColor: "#FABDDA",
            tickThickness: 0,
            labelFontColor: "#FABDDA",
            labelFormatter: function (e) {
              return ""
            }
          },
          data: [
            {
              type: "spline",
              color: "black",
              lineThickness: 1,
              dataPoints: dpsLead2
            }]
        })
      for (var h = 0; h < datapoints_in_string1.length; h++) {
        dataPointsArrayLead2.push(parseFloat(datapoints_in_string1[h]))
      }
      addDataPoints1(chart1)
      addStripLines1(chart1)
      var xAxisStripLinesArrayLead3 = []
      var yAxisStripLinesArrayLead3 = []
      var dpsLead3 = []
      var dataPointsArrayLead3 = new Array()
      var maximumPeakLead3
      var minimumPeakLead3
      var finalPeakLead3
      var ecgArraySmoothGraphLead3 = []
      var ecgMaximumValueLead3 = 0
      var ecgMinimumValueLead3 = 0
      var datapoints_in_string3 = ""
      var raw_data3 = this.data.ecgLead3
      datapoints_in_string3 = raw_data3.split(',');
      for (var h = 0; h < datapoints_in_string3.length; h++) {
        ecgArraySmoothGraphLead3.push(parseFloat(datapoints_in_string3[h]))
      }
      ecgMaximumValueLead3 = findMaxCealing(ecgArraySmoothGraphLead3)
      ecgMinimumValueLead3 = findMinCealing(ecgArraySmoothGraphLead3)
      if ((ecgMaximumValueLead3) <= 1500 && (ecgMinimumValueLead3) >= -500) {
        ecgMaximumValueLead3 = 1500
        ecgMinimumValueLead3 = -500
      }
      else if ((ecgMaximumValueLead3) <= 1000 && (ecgMinimumValueLead3) >= -1000) {
        ecgMaximumValueLead3 = 1000
        ecgMinimumValueLead3 = -1000
      }
      else if ((ecgMaximumValueLead3) <= 500 && (ecgMinimumValueLead3) >= -1500) {
        ecgMaximumValueLead3 = 500
        ecgMinimumValueLead3 = -1500
      }
      var chart3 = new CanvasJS.Chart("ecgGraphChartContainerLead3",
        {
          backgroundColor: "transparent",
          title: {
            text: "LEAD III",
            fontFamily: "'Quicksand', 'sans-serif'",
            labelFontColor: "#808080"
          },
          axisY: {
            stripLines: yAxisStripLinesArrayLead3,
            gridThickness: 2,
            gridColor: "#FABDDA",
            lineColor: "#FABDDA",
            tickThickness: 0,
            labelFontColor: "#FABDDA",
            labelFormatter: function (e) {
              return ""
            }
          },
          axisX: {
            stripLines: xAxisStripLinesArrayLead3,
            gridThickness: 2,
            gridColor: "#FABDDA",
            lineColor: "#FABDDA",
            tickThickness: 0,
            labelFontColor: "#FABDDA",
            labelFormatter: function (e) {
              return ""
            }
          },
          data: [
            {
              type: "spline",
              color: "black",
              lineThickness: 1,
              dataPoints: dpsLead3
            }]
        })
      for (var h = 0; h < datapoints_in_string3.length; h++) {
        dataPointsArrayLead3.push(parseFloat(datapoints_in_string3[h]))
      }
      addDataPoints3(chart3)
      addStripLines3(chart3)
      var xAxisStripLinesArrayLead4 = []
      var yAxisStripLinesArrayLead4 = []
      var dpsLead4 = []
      var dataPointsArrayLead4 = new Array()
      var maximumPeakLead4
      var minimumPeakLead4
      var finalPeakLead4
      var ecgArraySmoothGraphLead4 = []
      var ecgMaximumValueLead4 = 0
      var ecgMinimumValueLead4 = 0
      var datapoints_in_string4 = ""
      var raw_data4 = this.data.ecgLead4
      datapoints_in_string4 = raw_data4.split(',');
      for (var h = 0; h < datapoints_in_string4.length; h++) {
        ecgArraySmoothGraphLead4.push(parseFloat(datapoints_in_string4[h]))
      }
      ecgMaximumValueLead4 = findMaxCealing(ecgArraySmoothGraphLead4)
      ecgMinimumValueLead4 = findMinCealing(ecgArraySmoothGraphLead4)
      if ((ecgMaximumValueLead4) <= 1500 && (ecgMinimumValueLead4) >= -500) {
        ecgMaximumValueLead4 = 1500
        ecgMinimumValueLead4 = -500
      }
      else if ((ecgMaximumValueLead4) <= 1000 && (ecgMinimumValueLead4) >= -1000) {
        ecgMaximumValueLead4 = 1000
        ecgMinimumValueLead4 = -1000
      }
      else if ((ecgMaximumValueLead4) <= 500 && (ecgMinimumValueLead4) >= -1500) {
        ecgMaximumValueLead4 = 500
        ecgMinimumValueLead4 = -1500
      }
      var chart4 = new CanvasJS.Chart("ecgGraphChartContainerLead4",
        {
          backgroundColor: "transparent",
          title: {
            text: "LEAD AVR",
            fontFamily: "'Quicksand', 'sans-serif'",
            labelFontColor: "#808080"
          },
          axisY: {
            stripLines: yAxisStripLinesArrayLead4,
            gridThickness: 2,
            gridColor: "#FABDDA",
            lineColor: "#FABDDA",
            tickThickness: 0,
            labelFontColor: "#FABDDA",
            labelFormatter: function (e) {
              return ""
            }
          },
          axisX: {
            stripLines: xAxisStripLinesArrayLead4,
            gridThickness: 2,
            gridColor: "#FABDDA",
            lineColor: "#FABDDA",
            tickThickness: 0,
            labelFontColor: "#FABDDA",
            labelFormatter: function (e) {
              return ""
            }
          },
          data: [
            {
              type: "spline",
              color: "black",
              lineThickness: 1,
              dataPoints: dpsLead4
            }]
        })
      for (var h = 0; h < datapoints_in_string4.length; h++) {
        dataPointsArrayLead4.push(parseFloat(datapoints_in_string4[h]))
      }
      addDataPoints4(chart4)
      addStripLines4(chart4)
      var xAxisStripLinesArrayLead5 = []
      var yAxisStripLinesArrayLead5 = []
      var dpsLead5 = []
      var dataPointsArrayLead5 = new Array()
      var maximumPeakLead5
      var minimumPeakLead5
      var finalPeakLead5
      var ecgArraySmoothGraphLead5 = []
      var ecgMaximumValueLead5 = 0
      var ecgMinimumValueLead5 = 0
      var datapoints_in_string5 = ""
      var raw_data5 = this.data.ecgLead5
      datapoints_in_string5 = raw_data5.split(',');
      for (var h = 0; h < datapoints_in_string5.length; h++) {
        ecgArraySmoothGraphLead5.push(parseFloat(datapoints_in_string5[h]))
      }
      ecgMaximumValueLead5 = findMaxCealing(ecgArraySmoothGraphLead5)
      ecgMinimumValueLead5 = findMinCealing(ecgArraySmoothGraphLead5)
      if ((ecgMaximumValueLead5) <= 1500 && (ecgMinimumValueLead5) >= -500) {
        ecgMaximumValueLead5 = 1500
        ecgMinimumValueLead5 = -500
      }
      else if ((ecgMaximumValueLead5) <= 1000 && (ecgMinimumValueLead5) >= -1000) {
        ecgMaximumValueLead5 = 1000
        ecgMinimumValueLead5 = -1000
      }
      else if ((ecgMaximumValueLead5) <= 500 && (ecgMinimumValueLead5) >= -1500) {
        ecgMaximumValueLead5 = 500
        ecgMinimumValueLead5 = -1500
      }
      var chart5 = new CanvasJS.Chart("ecgGraphChartContainerLead5",
        {
          backgroundColor: "transparent",
          title: {
            text: "LEAD AVF",
            fontFamily: "'Quicksand', 'sans-serif'",
            labelFontColor: "#808080"
          },
          axisY: {
            stripLines: yAxisStripLinesArrayLead5,
            gridThickness: 2,
            gridColor: "#FABDDA",
            lineColor: "#FABDDA",
            tickThickness: 0,
            labelFontColor: "#FABDDA",
            labelFormatter: function (e) {
              return ""
            }
          },
          axisX: {
            stripLines: xAxisStripLinesArrayLead5,
            gridThickness: 2,
            gridColor: "#FABDDA",
            lineColor: "#FABDDA",
            tickThickness: 0,
            labelFontColor: "#FABDDA",
            labelFormatter: function (e) {
              return ""
            }
          },
          data: [
            {
              type: "spline",
              color: "black",
              lineThickness: 1,
              dataPoints: dpsLead5
            }]
        })
      for (var h = 0; h < datapoints_in_string5.length; h++) {
        dataPointsArrayLead5.push(parseFloat(datapoints_in_string5[h]))
      }
      addDataPoints5(chart5)
      addStripLines5(chart5)
      var xAxisStripLinesArrayLead6 = []
      var yAxisStripLinesArrayLead6 = []
      var dpsLead6 = []
      var dataPointsArrayLead6 = new Array()
      var maximumPeakLead6
      var minimumPeakLead6
      var finalPeakLead6
      var ecgArraySmoothGraphLead6 = []
      var ecgMaximumValueLead6 = 0
      var ecgMinimumValueLead6 = 0
      var datapoints_in_string6 = ""
      var raw_data6 = this.data.ecgLead6
      datapoints_in_string6 = raw_data6.split(',');
      for (var h = 0; h < datapoints_in_string6.length; h++) {
        ecgArraySmoothGraphLead6.push(parseFloat(datapoints_in_string6[h]))
      }
      ecgMaximumValueLead6 = findMaxCealing(ecgArraySmoothGraphLead6)
      ecgMinimumValueLead6 = findMinCealing(ecgArraySmoothGraphLead6)
      if ((ecgMaximumValueLead6) <= 1500 && (ecgMinimumValueLead6) >= -500) {
        ecgMaximumValueLead6 = 1500
        ecgMinimumValueLead6 = -500
      }
      else if ((ecgMaximumValueLead6) <= 1000 && (ecgMinimumValueLead6) >= -1000) {
        ecgMaximumValueLead6 = 1000
        ecgMinimumValueLead6 = -1000
      }
      else if ((ecgMaximumValueLead6) <= 500 && (ecgMinimumValueLead6) >= -1500) {
        ecgMaximumValueLead6 = 500
        ecgMinimumValueLead6 = -1500
      }
      var chart6 = new CanvasJS.Chart("ecgGraphChartContainerLead6",
        {
          backgroundColor: "transparent",
          title: {
            text: "LEAD AVL",
            fontFamily: "'Quicksand', 'sans-serif'",
            labelFontColor: "#808080"
          },
          axisY: {
            stripLines: yAxisStripLinesArrayLead6,
            gridThickness: 2,
            gridColor: "#FABDDA",
            lineColor: "#FABDDA",
            tickThickness: 0,
            labelFontColor: "#FABDDA",
            labelFormatter: function (e) {
              return ""
            }
          },
          axisX: {
            stripLines: xAxisStripLinesArrayLead6,
            gridThickness: 2,
            gridColor: "#FABDDA",
            lineColor: "#FABDDA",
            tickThickness: 0,
            labelFontColor: "#FABDDA",
            labelFormatter: function (e) {
              return ""
            }
          },
          data: [
            {
              type: "spline",
              color: "black",
              lineThickness: 1,
              dataPoints: dpsLead6
            }]
        })
      for (var h = 0; h < datapoints_in_string6.length; h++) {
        dataPointsArrayLead6.push(parseFloat(datapoints_in_string6[h]))
      }
      addDataPoints6(chart6)
      addStripLines6(chart6)
    }
    function addDataPoints(chart) {
      for (var i = 0; i < dataPointsArray.length; i++) {
        dps.push({ y: dataPointsArray[i] })
      }
      chart.render()
      maximumPeak = ecgLeadIMaximumValue
      minimumPeak = ecgLeadIMinimumValue
      if (maximumPeak < 0) {
        maximumPeak = maximumPeak * -1
      } else {
        maximumPeak = ecgLeadIMaximumValue
      }
      if (minimumPeak < 0) {
        minimumPeak = minimumPeak * -1
      } else {
        minimumPeak = ecgLeadIMinimumValue
      }
      if (maximumPeak == minimumPeak) {
        finalPeak = maximumPeak + minimumPeak
        chart.axisX[0].set("interval", (chart.axisX[0].get("maximum") - chart.axisX[0].get("minimum")) / 30) //Show 30 major grids in axisX
        chart.axisY[0].set("maximum", maximumPeak)
        chart.axisY[0].set("minimum", -(minimumPeak))
        chart.axisY[0].set("interval", finalPeak / 4)
      } else if (maximumPeak > minimumPeak) {
        minimumPeak = maximumPeak
        finalPeak = maximumPeak + minimumPeak
        chart.axisX[0].set("interval", (chart.axisX[0].get("maximum") - chart.axisX[0].get("minimum")) / 30) //Show 30 major grids in axisX
        chart.axisY[0].set("maximum", maximumPeak)
        chart.axisY[0].set("minimum", -(minimumPeak))
        chart.axisY[0].set("interval", finalPeak / 4)
      } else {
        maximumPeak = minimumPeak
        finalPeak = maximumPeak + minimumPeak
        chart.axisX[0].set("interval", (chart.axisX[0].get("maximum") - chart.axisX[0].get("minimum")) / 30) //Show 30 major grids in axisX
        chart.axisY[0].set("maximum", maximumPeak)
        chart.axisY[0].set("minimum", -(minimumPeak))
        chart.axisY[0].set("interval", finalPeak / 4)
      }
    }
    function addStripLines(chart) {
      for (var i = chart.axisY[0].minimum; i <= chart.axisY[0].maximum; i = i + (chart.axisY[0].interval / 5)) {
        if (i % chart.axisY[0].interval != 0)
          yAxisStripLinesArray.push({ value: i, thickness: 1, color: "#FABDDA" })
      }
      for (var i = chart.axisX[0].minimum; i <= chart.axisX[0].maximum; i = i + (chart.axisX[0].interval / 5)) {
        if (i % chart.axisX[0].interval != 0)
          xAxisStripLinesArray.push({ value: i, thickness: 1, color: "#FABDDA" })
      }
      chart.render()
    }
    function addDataPoints1(chart1) {
      for (var i = 0; i < dataPointsArrayLead2.length; i++) {
        dpsLead2.push({ y: dataPointsArrayLead2[i] })
      }
      chart1.render()
      maximumPeakLead2 = ecgMaximumValueLead2
      minimumPeakLead2 = ecgMinimumValueLead2
      if (maximumPeakLead2 < 0) {
        maximumPeakLead2 = maximumPeakLead2 * -1
      } else {
        maximumPeakLead2 = ecgMaximumValueLead2
      }
      if (minimumPeakLead2 < 0) {
        minimumPeakLead2 = minimumPeakLead2 * -1
      } else {
        minimumPeakLead2 = ecgMinimumValueLead2
      }
      if (maximumPeakLead2 == minimumPeakLead2) {
        finalPeakLead2 = maximumPeakLead2 + minimumPeakLead2
        chart1.axisX[0].set("interval", (chart1.axisX[0].get("maximum") - chart1.axisX[0].get("minimum")) / 30) //Show 30 major grids in axisX
        chart1.axisY[0].set("maximum", maximumPeakLead2)
        chart1.axisY[0].set("minimum", -(minimumPeakLead2))
        chart1.axisY[0].set("interval", finalPeakLead2 / 4)
      } else if (maximumPeakLead2 > minimumPeakLead2) {
        minimumPeakLead2 = maximumPeakLead2
        finalPeakLead2 = maximumPeakLead2 + minimumPeakLead2
        chart1.axisX[0].set("interval", (chart1.axisX[0].get("maximum") - chart1.axisX[0].get("minimum")) / 30) //Show 30 major grids in axisX
        chart1.axisY[0].set("maximum", maximumPeakLead2)
        chart1.axisY[0].set("minimum", -(minimumPeakLead2))
        chart1.axisY[0].set("interval", finalPeakLead2 / 4)
      } else {
        maximumPeakLead2 = minimumPeakLead2
        finalPeakLead2 = maximumPeakLead2 + minimumPeakLead2
        chart1.axisX[0].set("interval", (chart1.axisX[0].get("maximum") - chart1.axisX[0].get("minimum")) / 30) //Show 30 major grids in axisX
        chart1.axisY[0].set("maximum", maximumPeakLead2)
        chart1.axisY[0].set("minimum", -(minimumPeakLead2))
        chart1.axisY[0].set("interval", finalPeakLead2 / 4)
      }
    }
    function addStripLines1(chart1) {
      for (var i = chart1.axisY[0].minimum; i <= chart1.axisY[0].maximum; i = i + (chart1.axisY[0].interval / 5)) {
        if (i % chart1.axisY[0].interval != 0)
          yAxisStripLinesArrayLead2.push({ value: i, thickness: 1, color: "#FABDDA" })
      }
      for (var i = chart1.axisX[0].minimum; i <= chart1.axisX[0].maximum; i = i + (chart1.axisX[0].interval / 5)) {
        if (i % chart1.axisX[0].interval != 0)
          xAxisStripLinesArrayLead2.push({ value: i, thickness: 1, color: "#FABDDA" })
      }
      chart1.render()
    }
    function addDataPoints3(chart3) {
      for (var i = 0; i < dataPointsArrayLead3.length; i++) {
        dpsLead3.push({ y: dataPointsArrayLead3[i] })
      }
      chart3.render()
      maximumPeakLead3 = ecgMaximumValueLead3
      minimumPeakLead3 = ecgMinimumValueLead3
      if (maximumPeakLead3 < 0) {
        maximumPeakLead3 = maximumPeakLead3 * -1
      } else {
        maximumPeakLead3 = ecgMaximumValueLead3
      }
      if (minimumPeakLead3 < 0) {
        minimumPeakLead3 = minimumPeakLead3 * -1
      } else {
        minimumPeakLead3 = ecgMinimumValueLead3
      }
      if (maximumPeakLead3 == minimumPeakLead3) {
        finalPeakLead3 = maximumPeakLead3 + minimumPeakLead3
        chart3.axisX[0].set("interval", (chart3.axisX[0].get("maximum") - chart3.axisX[0].get("minimum")) / 30) //Show 30 major grids in axisX
        chart3.axisY[0].set("maximum", maximumPeakLead3)
        chart3.axisY[0].set("minimum", -(minimumPeakLead3))
        chart3.axisY[0].set("interval", finalPeakLead3 / 4)
      } else if (maximumPeakLead3 > minimumPeakLead3) {
        minimumPeakLead3 = maximumPeakLead3
        finalPeakLead3 = maximumPeakLead3 + minimumPeakLead3
        chart3.axisX[0].set("interval", (chart3.axisX[0].get("maximum") - chart3.axisX[0].get("minimum")) / 30) //Show 30 major grids in axisX
        chart3.axisY[0].set("maximum", maximumPeakLead3)
        chart3.axisY[0].set("minimum", -(minimumPeakLead3))
        chart3.axisY[0].set("interval", finalPeakLead3 / 4)
      } else {
        maximumPeakLead3 = minimumPeakLead3
        finalPeakLead3 = maximumPeakLead3 + minimumPeakLead3
        chart3.axisX[0].set("interval", (chart3.axisX[0].get("maximum") - chart3.axisX[0].get("minimum")) / 30) //Show 30 major grids in axisX
        chart3.axisY[0].set("maximum", maximumPeakLead3)
        chart3.axisY[0].set("minimum", -(minimumPeakLead3))
        chart3.axisY[0].set("interval", finalPeakLead3 / 4)
      }
    }
    function addStripLines3(chart3) {
      for (var i = chart3.axisY[0].minimum; i <= chart3.axisY[0].maximum; i = i + (chart3.axisY[0].interval / 5)) {
        if (i % chart3.axisY[0].interval != 0)
          yAxisStripLinesArrayLead3.push({ value: i, thickness: 1, color: "#FABDDA" })
      }
      for (var i = chart3.axisX[0].minimum; i <= chart3.axisX[0].maximum; i = i + (chart3.axisX[0].interval / 5)) {
        if (i % chart3.axisX[0].interval != 0)
          xAxisStripLinesArrayLead3.push({ value: i, thickness: 1, color: "#FABDDA" })
      }
      chart3.render()
    }
    function addDataPoints4(chart4) {
      for (var i = 0; i < dataPointsArrayLead4.length; i++) {
        dpsLead4.push({ y: dataPointsArrayLead4[i] })
      }
      chart4.render()
      maximumPeakLead4 = ecgMaximumValueLead4
      minimumPeakLead4 = ecgMinimumValueLead4
      if (maximumPeakLead4 < 0) {
        maximumPeakLead4 = maximumPeakLead4 * -1
      } else {
        maximumPeakLead4 = ecgMaximumValueLead4
      }
      if (minimumPeakLead4 < 0) {
        minimumPeakLead4 = minimumPeakLead4 * -1
      } else {
        minimumPeakLead4 = ecgMinimumValueLead4
      }
      if (maximumPeakLead4 == minimumPeakLead4) {
        finalPeakLead4 = maximumPeakLead4 + minimumPeakLead4
        chart4.axisX[0].set("interval", (chart4.axisX[0].get("maximum") - chart4.axisX[0].get("minimum")) / 30) //Show 30 major grids in axisX
        chart4.axisY[0].set("maximum", maximumPeakLead4)
        chart4.axisY[0].set("minimum", -(minimumPeakLead4))
        chart4.axisY[0].set("interval", finalPeakLead4 / 4)
      } else if (maximumPeakLead4 > minimumPeakLead4) {
        minimumPeakLead4 = maximumPeakLead4
        finalPeakLead4 = maximumPeakLead4 + minimumPeakLead4
        chart4.axisX[0].set("interval", (chart4.axisX[0].get("maximum") - chart4.axisX[0].get("minimum")) / 30) //Show 30 major grids in axisX
        chart4.axisY[0].set("maximum", maximumPeakLead4)
        chart4.axisY[0].set("minimum", -(minimumPeakLead4))
        chart4.axisY[0].set("interval", finalPeakLead4 / 4)
      } else {
        maximumPeakLead4 = minimumPeakLead4
        finalPeakLead4 = maximumPeakLead4 + minimumPeakLead4
        chart4.axisX[0].set("interval", (chart4.axisX[0].get("maximum") - chart4.axisX[0].get("minimum")) / 30) //Show 30 major grids in axisX
        chart4.axisY[0].set("maximum", maximumPeakLead4)
        chart4.axisY[0].set("minimum", -(minimumPeakLead4))
        chart4.axisY[0].set("interval", finalPeakLead4 / 4)
      }
    }
    function addStripLines4(chart4) {
      for (var i = chart4.axisY[0].minimum; i <= chart4.axisY[0].maximum; i = i + (chart4.axisY[0].interval / 5)) {
        if (i % chart4.axisY[0].interval != 0)
          yAxisStripLinesArrayLead4.push({ value: i, thickness: 1, color: "#FABDDA" })
      }
      for (var i = chart4.axisX[0].minimum; i <= chart4.axisX[0].maximum; i = i + (chart4.axisX[0].interval / 5)) {
        if (i % chart4.axisX[0].interval != 0)
          xAxisStripLinesArrayLead4.push({ value: i, thickness: 1, color: "#FABDDA" })
      }
      chart4.render()
    }

    function addDataPoints5(chart5) {
      for (var i = 0; i < dataPointsArrayLead5.length; i++) {
        dpsLead5.push({ y: dataPointsArrayLead5[i] })
      }
      chart5.render()
      maximumPeakLead5 = ecgMaximumValueLead5
      minimumPeakLead5 = ecgMinimumValueLead5
      if (maximumPeakLead5 < 0) {
        maximumPeakLead5 = maximumPeakLead5 * -1
      } else {
        maximumPeakLead5 = ecgMaximumValueLead5
      }
      if (minimumPeakLead5 < 0) {
        minimumPeakLead5 = minimumPeakLead5 * -1
      } else {
        minimumPeakLead5 = ecgMinimumValueLead5
      }
      if (maximumPeakLead5 == minimumPeakLead5) {
        finalPeakLead5 = maximumPeakLead5 + minimumPeakLead5
        chart5.axisX[0].set("interval", (chart5.axisX[0].get("maximum") - chart5.axisX[0].get("minimum")) / 30) //Show 30 major grids in axisX
        chart5.axisY[0].set("maximum", maximumPeakLead5)
        chart5.axisY[0].set("minimum", -(minimumPeakLead5))
        chart5.axisY[0].set("interval", finalPeakLead5 / 4)
      } else if (maximumPeakLead5 > minimumPeakLead5) {
        minimumPeakLead5 = maximumPeakLead5
        finalPeakLead5 = maximumPeakLead5 + minimumPeakLead5
        chart5.axisX[0].set("interval", (chart5.axisX[0].get("maximum") - chart5.axisX[0].get("minimum")) / 30) //Show 30 major grids in axisX
        chart5.axisY[0].set("maximum", maximumPeakLead5)
        chart5.axisY[0].set("minimum", -(minimumPeakLead5))
        chart5.axisY[0].set("interval", finalPeakLead5 / 4)
      } else {
        maximumPeakLead5 = minimumPeakLead5
        finalPeakLead5 = maximumPeakLead5 + minimumPeakLead5
        chart5.axisX[0].set("interval", (chart5.axisX[0].get("maximum") - chart5.axisX[0].get("minimum")) / 30) //Show 30 major grids in axisX
        chart5.axisY[0].set("maximum", maximumPeakLead5)
        chart5.axisY[0].set("minimum", -(minimumPeakLead5))
        chart5.axisY[0].set("interval", finalPeakLead5 / 4)
      }
    }
    function addStripLines5(chart5) {
      for (var i = chart5.axisY[0].minimum; i <= chart5.axisY[0].maximum; i = i + (chart5.axisY[0].interval / 5)) {
        if (i % chart5.axisY[0].interval != 0)
          yAxisStripLinesArrayLead5.push({ value: i, thickness: 1, color: "#FABDDA" })
      }
      for (var i = chart5.axisX[0].minimum; i <= chart5.axisX[0].maximum; i = i + (chart5.axisX[0].interval / 5)) {
        if (i % chart5.axisX[0].interval != 0)
          xAxisStripLinesArrayLead5.push({ value: i, thickness: 1, color: "#FABDDA" })
      }
      chart5.render()
    }
    function addDataPoints6(chart4) {
      for (var i = 0; i < dataPointsArrayLead6.length; i++) {
        dpsLead6.push({ y: dataPointsArrayLead6[i] })
      }
      chart6.render()
      maximumPeakLead6 = ecgMaximumValueLead6
      minimumPeakLead6 = ecgMinimumValueLead6
      if (maximumPeakLead6 < 0) {
        maximumPeakLead6 = maximumPeakLead6 * -1
      } else {
        maximumPeakLead6 = ecgMaximumValueLead6
      }
      if (minimumPeakLead6 < 0) {
        minimumPeakLead6 = minimumPeakLead6 * -1
      } else {
        minimumPeakLead6 = ecgMinimumValueLead6
      }
      if (maximumPeakLead6 == minimumPeakLead6) {
        finalPeakLead6 = maximumPeakLead6 + minimumPeakLead6
        chart6.axisX[0].set("interval", (chart6.axisX[0].get("maximum") - chart6.axisX[0].get("minimum")) / 30) //Show 30 major grids in axisX
        chart6.axisY[0].set("maximum", maximumPeakLead6)
        chart6.axisY[0].set("minimum", -(minimumPeakLead6))
        chart6.axisY[0].set("interval", finalPeakLead6 / 4)
      } else if (maximumPeakLead6 > minimumPeakLead6) {
        minimumPeakLead6 = maximumPeakLead6
        finalPeakLead6 = maximumPeakLead6 + minimumPeakLead6
        chart6.axisX[0].set("interval", (chart6.axisX[0].get("maximum") - chart6.axisX[0].get("minimum")) / 30) //Show 30 major grids in axisX
        chart6.axisY[0].set("maximum", maximumPeakLead6)
        chart6.axisY[0].set("minimum", -(minimumPeakLead6))
        chart6.axisY[0].set("interval", finalPeakLead6 / 4)
      } else {
        maximumPeakLead6 = minimumPeakLead6
        finalPeakLead6 = maximumPeakLead6 + minimumPeakLead6
        chart6.axisX[0].set("interval", (chart6.axisX[0].get("maximum") - chart6.axisX[0].get("minimum")) / 30) //Show 30 major grids in axisX
        chart6.axisY[0].set("maximum", maximumPeakLead6)
        chart6.axisY[0].set("minimum", -(minimumPeakLead6))
        chart6.axisY[0].set("interval", finalPeakLead6 / 4)
      }
    }
    function addStripLines6(chart6) {
      for (var i = chart6.axisY[0].minimum; i <= chart6.axisY[0].maximum; i = i + (chart6.axisY[0].interval / 5)) {
        if (i % chart6.axisY[0].interval != 0)
          yAxisStripLinesArrayLead6.push({ value: i, thickness: 1, color: "#FABDDA" })
      }
      for (var i = chart6.axisX[0].minimum; i <= chart6.axisX[0].maximum; i = i + (chart6.axisX[0].interval / 5)) {
        if (i % chart6.axisX[0].interval != 0)
          xAxisStripLinesArrayLead6.push({ value: i, thickness: 1, color: "#FABDDA" })
      }
      chart6.render()
    }
    function arrayMin(arr) {
      return arr.reduce(function (p, v) {
        return (p < v ? p : v)
      })
    }
    function arrayMax(arr) {
      return arr.reduce(function (p, v) {
        return (p > v ? p : v)
      })
    }
    function findMaxCealing(dataPoint) {
      var maxnum = arrayMax(dataPoint)
      var clealedmax = Math.ceil(maxnum / 500) * 500
      if (clealedmax < maxnum) {
        clealedmax = clealedmax + 500
      } else {
        clealedmax = clealedmax
      }
      return clealedmax
    }
    function findMinCealing(dataPoint) {
      var minnum = arrayMin(dataPoint)
      var clealedmin = Math.ceil(minnum / 500) * 500
      if (clealedmin > minnum) {
        clealedmin = clealedmin - 500
      } else {
        clealedmin = clealedmin
      }
      return clealedmin
    }
    localResultChart()
  }
  showAugmentedGraphs() {
    this.previousNav = true
    this.nextNav = false
    $("#ecgGraphChartContainerLead1").hide()
    $("#ecgGraphChartContainerLead2").hide()
    $("#ecgGraphChartContainerLead3").hide()
    $("#ecgGraphChartContainerLead4").show()
    $("#ecgGraphChartContainerLead5").show()
    $("#ecgGraphChartContainerLead6").show()
  }
  showPreviousGraphs() {
    this.previousNav = false
    this.nextNav = true
    $("#ecgGraphChartContainerLead1").show()
    $("#ecgGraphChartContainerLead2").show()
    $("#ecgGraphChartContainerLead3").show()
    $("#ecgGraphChartContainerLead4").hide()
    $("#ecgGraphChartContainerLead5").hide()
    $("#ecgGraphChartContainerLead6").hide()
  }
  showDashboard() {
    this.loadingMessage = true
    this.loadSpo2Graph = false
    this.loadBmiGraph = false
    this.loadBmcGraph = false
    this.loadTemperatureGraph = false
    this.loadBpGraph = false
    this.loadEcgGraph = false
    this.loadWeightGraph = false
    this.loadPulseGraph = false
    this.loadpbfGraph = false
    this.loadbcmGraph = false
    this.loadecwGraph = false
    this.loadicwGraph = false
    this.loadmineralGraph = false
    this.loadbfmGraph = false
    this.loadproteinGraph = false
    this.loadbmctGraph = false
    this.loadsmmGraph = false
    this.loadwhprGraph = false
    this.loadvfGraph = false
    this.loadbmrGraph = false
    this.loadwhtrGraph = false
    this.showMinimumError = false
    $("#vital-stats-info").hide()
    $("#vital-stats-board").show()
    $("#dashboardBannerImg").show()
  }
}
