import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceLogin } from 'src/app/services/auth.service.login';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ModalComponent } from '../modal/modal.component';
import { ConstantsService } from 'src/app/services/constants.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import { EventEmitterService } from 'src/app/services/event-emitter.service';
import { filter } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import * as CanvasJS from '../../../assets/canvasjs.min'

@Component({
  selector: 'app-metrices',
  templateUrl: './metrices.component.html',
  styleUrls: ['./metrices.component.css'],
  providers: [DatePipe]
})
export class MetricesComponent implements OnInit {
 // @ViewChild('myDiv') myDiv: ElementRef;
 //@ViewChild('metrics_measurement') nameInputRef: ElementRef;

  affiliateOrganisation: string
  program: []
  selectedIndex: number = null;
  loading = true
  public containerShow = "";
  metrics: boolean = false;
  userProgram: boolean = false;
  home: boolean = true;
  metricsObject: any
  metricsSubObject: any
  totalMetricesNumber : any
  metricesInputFields: any
  addScores: object = {}
  loginUserProgram: []
  affiliateOverallData: any
  affiliateLastcheckinData: any
  noMetricsDashboard = false;
  metricsGraphSection = false;
  metricsDashboardSection = false;
  graphCardTitle: any
  graphCardValue: any
  graphCardUnit: any
  graphCardColor: any
  chartAllDays = false;
  chart90Days = false;
  chart30Days = false;
  chart7Days = false;
  noMinimumpoints: any
  chartAllDaysShow = false;
  chart90DaysShow = false;
  chart30DaysShow = false;
  chart7DaysShow = false;
  chartforAllDay = null;
  chartfor90Day = null;
  chartfor30Day = null;
  chartfor7Day = null;
  graphCardTitleHistory: any
  graphCardUnitHistory: any
  metricsAllMeasure: any
  metricsMinMaxAvg: any
  graphCardTitleMinMax: any
  graphCardUnitMinMax: any
  minimumMetricsValue: any
  maximumMetricsValue: any
  averageMetricsValue: any
  homeMetricsObject: any
  homeTotalMetricesNumber: any
  homeMetricesInputFields: any
  homeTotalMetricesInput: any
  affiliatedUsersOverAllDatas = null;
  affiliatedUsersLastCheckinDatas = null;
  affiliatedUsersMeasurementOverAllDatas = null;
  affiliatedUsersMinimumMaximumOverAllDatas = null;
  notWorking: boolean = false;
  inputNotWorking: boolean = false;
  totalMetricesNumberInput: any
  //newUser: boolean
  //noUser: boolean = false;
  
  programNameGet: any = this._constant.aesDecryption("affiliateProgramName");
  programApprovalGet: any = this._constant.aesDecryption("affliateProgramApproval");
  affiliateProgram: any = this._constant.aesDecryption("affiliateProgram");
  affiliateEmail: any = this._constant.aesDecryption("email");
  lastCheckin: any = this._constant.aesDecryption("healthData");
  userDataList: any = this._constant.aesDecryption("userData");
  AFFILIATEDATAThis = JSON.parse(this._constant.aesDecryption("AFFILIATEDATA"));
  AffiliateHistoryThis = JSON.parse(this._constant.aesDecryption("AffiliateHistory"));
  AffiliateMinMaxThis = JSON.parse(this._constant.aesDecryption("AffiliateMinMax"));
  dob = this._constant.aesDecryption('usersDateOfBirth');
  constructor( 
    private authServiceLogin: AuthServiceLogin,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    public _constant: ConstantsService,
    private eventEmitterService: EventEmitterService,
    private datepipe: DatePipe) {
      
    }
  
  ngOnInit(){
    this.authService.basicInfoCheck();
    
    if (this.affiliateProgram !== undefined && this.affiliateProgram !== null && this.affiliateProgram !== "") {
      
      if(this.affiliatedUsersOverAllDatas == undefined || this.affiliatedUsersOverAllDatas == null || this.affiliatedUsersLastCheckinDatas == undefined || this.affiliatedUsersLastCheckinDatas == null || this.affiliatedUsersMeasurementOverAllDatas == undefined || this.affiliatedUsersMeasurementOverAllDatas == null || this.affiliatedUsersMinimumMaximumOverAllDatas == undefined || this.affiliatedUsersMinimumMaximumOverAllDatas == null){
        if (JSON.parse(this._constant.aesDecryption("AFFILIATESTHIS")) == undefined || JSON.parse(this._constant.aesDecryption("AFFILIATESTHIS")) == null || JSON.parse(this._constant.aesDecryption("AFFILIATESHistoryThis")) == undefined || JSON.parse(this._constant.aesDecryption("AFFILIATESHistoryThis")) == null || JSON.parse(this._constant.aesDecryption("AFFILIATESMinMaxThis")) == undefined || JSON.parse(this._constant.aesDecryption("AFFILIATESMinMaxThis")) == null) {
          localStorage.setItem("AFFILIATESTHIS" , this._constant.aesEncryption(JSON.stringify(this.AFFILIATEDATAThis)));
          localStorage.setItem("AFFILIATESHistoryThis" , this._constant.aesEncryption(JSON.stringify(this.AffiliateHistoryThis)));
          localStorage.setItem("AFFILIATESMinMaxThis" , this._constant.aesEncryption(JSON.stringify(this.AffiliateMinMaxThis)));
        }
        this.formatOverallDatas();
      }

      if (this.programNameGet == undefined || this.programNameGet == null || this.programNameGet == "") {
        //this.noUser = false;
        if (this.affiliateProgram == "Dimension") {
          this.affiliateProgram = "dimension";
        }else{
          this.affiliateProgram = this._constant.aesDecryption("affiliateProgram");
        }
  
        this.affiliateOrganisation = '{"affiliate_name": "'+this.affiliateProgram+'"}'
  
        this.authServiceLogin.getAffiliateProgram(this.affiliateOrganisation).subscribe((data : any) =>  {
          console.log(data);
          //this.loading = false;
          var re = /&quot;/g; 
          var obj = data;
          var res = obj.replace(re,'"');
          var programsData = JSON.parse(res);
          console.log(programsData);
          this.program = programsData.programs;
          //this.program = ['GOLD Program','Body Builder','Silver Program','Diamond Program','Platinum Program','Other Program'];
          console.log(this.program);
          //this.newUser = true;
          this.containerShow = "program";
        });
      }else if(this.programNameGet !== undefined && this.programNameGet !== null && this.programNameGet !== "" && this.programApprovalGet == "True"){
        //this.newUser = false;
        //this.noUser = false;
        setTimeout(() => {
          if(JSON.parse(this._constant.aesDecryption("finalAny")) == undefined || JSON.parse(this._constant.aesDecryption("finalAny")) == null || JSON.parse(this._constant.aesDecryption("finalAny")) == ""){
            if (this.affiliatedUsersLastCheckinDatas !== undefined && this.affiliatedUsersLastCheckinDatas !== null && this.affiliatedUsersLastCheckinDatas !== "") {
              this.affiliateLastcheckinData = this.affiliatedUsersLastCheckinDatas;
            }
        
            var regUserPrograms
            if (this.affiliateProgram == "Dimension") {
              regUserPrograms = "dimension";
            }else{
              regUserPrograms = this._constant.aesDecryption("affiliateProgram");
            }
        
            var jsontexts = '{"affiliate_name": "'+regUserPrograms+'","affiliate_program_name": "'+this.programNameGet+'"}';
        
            this.authServiceLogin.getMetricsInput(jsontexts).subscribe((data: any) =>{
        
              var jsonStrs = JSON.parse(data.replace(/&quot;/g,'"'));
              
              this.homeMetricsObject = jsonStrs;
              
        
              if (this.homeMetricsObject != null && this.homeMetricsObject != undefined) {
                if (this.homeMetricsObject.content != null && this.homeMetricsObject.content != undefined) {
                  if (this.homeMetricsObject.content.Metrices != null && this.homeMetricsObject.content.Metrices != undefined) {
                    this.homeTotalMetricesNumber = this.homeMetricsObject.content.Metrices;
                  }
                }
              }
              var homeCompletePlaceholder = [];
              for (let i = 0; i < this.homeTotalMetricesNumber.length; i++) {
                var homeNewPlaceHolder = [];
                for (let j = 0; j < this.homeTotalMetricesNumber[i].Metrices_list.length; j++) {
                  homeNewPlaceHolder[j] =  this.homeMetricsObject.content.Metrices[i].Metrices_list[j].replace(/_/g, " ");
                }
                homeCompletePlaceholder[i] = homeNewPlaceHolder;
                this.homeMetricsObject.content.Metrices[i].Metrices_list = homeNewPlaceHolder;
              }
              this.homeMetricesInputFields = homeCompletePlaceholder;
            });
        
            setTimeout(() => {
              console.log(this.homeTotalMetricesNumber);
              console.log(this.affiliateLastcheckinData);
              var dashBoardMetricesList  = [];
              var dashBoardMetricesType  = [];
              var dashBoardMetricesUnit  = [];
              var dashBoardHighReferenceRange  = [];
              var dashBoardLowReferenceRange  = [];
              var dashBoardMetricesvalue = [];
              var dashBoardMetricesColor = [];
              if(this.homeTotalMetricesNumber !== undefined && this.homeTotalMetricesNumber !== null){
                interface IMyEntity {
                  dashBoard_Metrices_list: any;
                  dashBoard_Metrices_type: any;
                  dashBoard_Metrices_unit: any;  
                  dashBoard_high_reference_range: any;  
                  dashBoard_low_reference_range: any;
                }
                
                for (let s = 0; s < this.homeTotalMetricesNumber.length; s++) {
                  for (let v = 0; v < this.homeTotalMetricesNumber[s].Metrices_list.length; v++) {
                    if(this.homeTotalMetricesNumber[s].Metrices_type[v] !== "string" && this.homeTotalMetricesNumber[s].Metrices_type[v] !== "NA" && this.homeTotalMetricesNumber[s].Metrices_type[v] !== ""){
                      if(this.homeTotalMetricesNumber[s].Metrices_list[v] !== undefined && this.homeTotalMetricesNumber[s].Metrices_list[v] !== null){
                        dashBoardMetricesList.push(this.homeTotalMetricesNumber[s].Metrices_list[v]);
                      }else{
                        dashBoardMetricesList.push("NA");
                      }
                      
                      if(this.homeTotalMetricesNumber[s].Metrices_type[v] !== undefined && this.homeTotalMetricesNumber[s].Metrices_type[v] !== null){
                        dashBoardMetricesType.push(this.homeTotalMetricesNumber[s].Metrices_type[v]);
                      }else{
                        dashBoardMetricesType.push("NA");
                      }
                      
                      if (this.homeTotalMetricesNumber[s].Metrices_unit[v] !== undefined && this.homeTotalMetricesNumber[s].Metrices_unit[v] !== null) {
                        dashBoardMetricesUnit.push(this.homeTotalMetricesNumber[s].Metrices_unit[v]);
                      }else{
                        dashBoardMetricesUnit.push("NA");
                      }
        
                      if (this.homeTotalMetricesNumber[s].high_reference_range[v] !== undefined && this.homeTotalMetricesNumber[s].high_reference_range[v] !== null) {
                        dashBoardHighReferenceRange.push(this.homeTotalMetricesNumber[s].high_reference_range[v]);
                      }else{
                        dashBoardHighReferenceRange.push("NA");
                      }
                      
                      if(this.homeTotalMetricesNumber[s].low_reference_range[v] !== undefined && this.homeTotalMetricesNumber[s].low_reference_range[v] !== null){
                        dashBoardLowReferenceRange.push(this.homeTotalMetricesNumber[s].low_reference_range[v]);
                      }else{
                        dashBoardLowReferenceRange.push("NA");
                      }
                    }
                  }
                }
        
                var lastCheckinValueObj;
                if (this.affiliateLastcheckinData !== undefined && this.affiliateLastcheckinData !== null) {
                  lastCheckinValueObj = [];
                  for (let x = 0; x < this.affiliateLastcheckinData.length; x++) {
                    lastCheckinValueObj[this.affiliateLastcheckinData[x].Title] = this.affiliateLastcheckinData[x].Value;
                  }
                  console.log(lastCheckinValueObj);
                }
        
                var contentOrderBy = [
                  { dashBoard_Metrices_list: dashBoardMetricesList, dashBoard_Metrices_type: dashBoardMetricesType, dashBoard_Metrices_unit: dashBoardMetricesUnit, dashBoard_high_reference_range: dashBoardHighReferenceRange, dashBoard_low_reference_range: dashBoardLowReferenceRange}
                ];
              
                var myContent : IMyEntity[] = contentOrderBy;
                console.log(myContent);
        
                if (myContent !== undefined && myContent !== null) {
                  if(myContent[0].dashBoard_Metrices_list !== undefined && myContent[0].dashBoard_Metrices_list !== null){
                    if(lastCheckinValueObj !== undefined && lastCheckinValueObj !== null){
                      for (let w = 0; w < myContent[0].dashBoard_Metrices_list.length; w++) {
                        if (lastCheckinValueObj[myContent[0].dashBoard_Metrices_list[w]]) {
                          dashBoardMetricesvalue.push(lastCheckinValueObj[myContent[0].dashBoard_Metrices_list[w]]);
                          if (myContent[0].dashBoard_high_reference_range[w] !== undefined && myContent[0].dashBoard_high_reference_range[w] !== null && myContent[0].dashBoard_low_reference_range[w] !== undefined && myContent[0].dashBoard_low_reference_range[w] !== null) {
                            if (myContent[0].dashBoard_high_reference_range[w] !== "NA" && myContent[0].dashBoard_low_reference_range[w] !== "NA") {
                              if (Number(lastCheckinValueObj[myContent[0].dashBoard_Metrices_list[w]]) > Number(myContent[0].dashBoard_low_reference_range[w]) && Number(lastCheckinValueObj[myContent[0].dashBoard_Metrices_list[w]]) < Number(myContent[0].dashBoard_high_reference_range[w])) {
                                dashBoardMetricesColor.push("green");
                              }else if(Number(lastCheckinValueObj[myContent[0].dashBoard_Metrices_list[w]]) <= Number(myContent[0].dashBoard_low_reference_range[w])){
                                dashBoardMetricesColor.push("orange");
                              }else if(Number(lastCheckinValueObj[myContent[0].dashBoard_Metrices_list[w]]) >= Number(myContent[0].dashBoard_high_reference_range[w])){
                                dashBoardMetricesColor.push("red");
                              }
                            }else if(myContent[0].dashBoard_high_reference_range[w] == "NA" || myContent[0].dashBoard_low_reference_range[w] == "NA"){
                              dashBoardMetricesColor.push("#4885ed");
                            }
                          }
                        }else{
                          dashBoardMetricesvalue.push("--");
                          dashBoardMetricesColor.push("#4885ed");
                          myContent[0].dashBoard_Metrices_unit[w] = "";
                        }
                      }
                    }else{
                      console.log("no last checkin");
                      for (let y = 0; y < myContent[0].dashBoard_Metrices_list.length; y++) {
                        dashBoardMetricesvalue.push("--");
                        dashBoardMetricesColor.push("#4885ed");
                        myContent[0].dashBoard_Metrices_unit[y] = "";
                      }
                    }
                    
                  }
                }
        
                interface finalEntity {
                  dashBoard_Metrices_list: any;
                  dashBoard_Metrices_type: any;
                  dashBoard_Metrices_unit: any;  
                  dashBoard_high_reference_range: any;  
                  dashBoard_low_reference_range: any;
                  dashBoard_metrices_value: any;
                  dashBoard_metrices_color: any;
                }
        
                var finalContentOrder = [
                  { dashBoard_Metrices_list: dashBoardMetricesList, dashBoard_Metrices_type: dashBoardMetricesType, dashBoard_Metrices_unit: dashBoardMetricesUnit, dashBoard_high_reference_range: dashBoardHighReferenceRange, dashBoard_low_reference_range: dashBoardLowReferenceRange, dashBoard_metrices_value: dashBoardMetricesvalue,dashBoard_metrices_color:dashBoardMetricesColor}
                ];
              
                var finalMyContent : finalEntity[] = finalContentOrder;
                console.log(finalMyContent);
                
                
                var finalMetricesDashboardContent;
                if(finalMyContent.length > 0){
                  finalMetricesDashboardContent = finalMyContent;
                  localStorage.setItem("finalAny" , this._constant.aesEncryption(JSON.stringify(finalMetricesDashboardContent)));
                }
              }
            },7000);
            setTimeout(() => {
              this.containerShow = "metrice";
              this.homeInput();
            },8000);
          }else{
            this.containerShow = "metrice";
            this.homeInput();
          }
        },150);
      }else if (this.programNameGet !== undefined && this.programNameGet !== null && this.programNameGet !== "" && this.programApprovalGet == "Waiting") {
        this._constant.programIsWaiting = true;
        this.dialog.open(ModalComponent);

        setTimeout(() => {
          this._constant.programIsWaiting = false;
          this.eventEmitterService.onModalClose();
          this.router.navigate(['/dashboard'])
        },4000);
      }else if(this.programNameGet !== undefined && this.programNameGet !== null && this.programNameGet !== "" && this.programApprovalGet == "False"){
        this._constant.programIsCancelled = true;
        this.dialog.open(ModalComponent);

        setTimeout(() => {
          this._constant.programIsCancelled = false;
          this.eventEmitterService.onModalClose();
          this.router.navigate(['/dashboard'])
        },4000);
      }
    }else{
      //this.noUser = true;
      //this.newUser = false;
      this.containerShow = "empty";
    }
  }

  programSelectFunction(program: any,index: number) {
    this.selectedIndex = index;
    console.log(program);
    this._constant.openModal = true;
    this._constant.selectedProgram = program;
    const dialogRef = this.dialog.open(ModalComponent);

    // dialogRef.afterClosed().subscribe(result => {
    //   if(result) {
    //     console.log('Yes clicked');
    //     // DO SOMETHING
    //   }
    // });
  }

  metricsInput(){
    this.userProgram = false;
    this.home = false;
    this.metrics = true;
    var regUserProgram;
    if (JSON.parse(this._constant.aesDecryption("totalMetricesNumber")) == undefined || JSON.parse(this._constant.aesDecryption("totalMetricesNumber")) ==  null || JSON.parse(this._constant.aesDecryption("totalMetricesNumber")) == "") {
      this.inputNotWorking = true;
      if (this.affiliateProgram == "Dimension") {
        regUserProgram = "dimension";
      }else{
        regUserProgram = this._constant.aesDecryption("affiliateProgram");
      }
  
      var jsontext = '{"affiliate_name": "'+regUserProgram+'","affiliate_program_name": "'+this.programNameGet+'"}';
  
      this.authServiceLogin.getMetricsInput(jsontext).subscribe((data: any) =>{
  
        var jsonStr = JSON.parse(data.replace(/&quot;/g,'"'));
        var jsonStr2 = JSON.parse(data.replace(/&quot;/g,'"'));
        var jsonStr3 = JSON.parse(data.replace(/&quot;/g,'"'));
         
        console.log(jsonStr);
        this.metricsObject = jsonStr;
        this.metricsSubObject = jsonStr2;
  
        if (this.metricsObject != null && this.metricsObject != undefined) {
          if (this.metricsObject.content != null && this.metricsObject.content != undefined) {
            if (this.metricsObject.content.Metrices != null && this.metricsObject.content.Metrices != undefined) {
              this.totalMetricesNumber = this.metricsObject.content.Metrices;
              console.log(this.totalMetricesNumber);
            }
          }
        }
        var completePlaceholder = [];
        for (let i = 0; i < this.totalMetricesNumber.length; i++) {
          var newPlaceHolder = [];
          for (let j = 0; j < this.totalMetricesNumber[i].Metrices_list.length; j++) {
            newPlaceHolder[j] =  this.metricsObject.content.Metrices[i].Metrices_list[j].replace(/_/g, " ");
          }
          completePlaceholder[i] = newPlaceHolder;
          this.metricsObject.content.Metrices[i].Metrices_list = newPlaceHolder;
        }
        this.metricesInputFields = completePlaceholder;
        console.log(this.metricsObject);
        console.log(completePlaceholder)
        this.inputNotWorking = false;
        localStorage.setItem("totalMetricesNumber" , this._constant.aesEncryption(JSON.stringify(this.totalMetricesNumber)));
        console.log(JSON.parse(this._constant.aesDecryption("totalMetricesNumber")));
        this.totalMetricesNumberInput = JSON.parse(this._constant.aesDecryption("totalMetricesNumber"));
      });
    }else{
      this.inputNotWorking = false;
      this.totalMetricesNumberInput = JSON.parse(this._constant.aesDecryption("totalMetricesNumber"));
    }

  }
  
  change(inputField,term){
    console.log(inputField);
    console.log(term);
    for (var i = 0; i < this.metricsObject.content.Metrices.length; i++) {
      for (var j = 0; j < this.metricsObject.content.Metrices[i].Metrices_list.length; j++) {
        if (this.metricsObject.content.Metrices[i].Metrices_type[j] != "string" && this.metricsObject.content.Metrices[i].Metrices_type[j] != "NA") {
          if (this.metricsObject.content.Metrices[i].Metrices_list[j] == inputField) {
            if (term.value != "") {
              if(isNaN(term.value)){
                term.required = true;
              }else if(!isNaN(term.value)){
                term.required = false;
                var oldPlaceholderInput = this.metricsSubObject.content.Metrices[i].Metrices_list[j];
                console.log(oldPlaceholderInput);
                this.addScores[oldPlaceholderInput] =  term.value;
              }
            }else if(term.value == ""){
              term.required = false;
              var oldPlaceholderInput = this.metricsSubObject.content.Metrices[i].Metrices_list[j];
              this.addScores[oldPlaceholderInput] =  "";
            }
          }
        }else if (this.metricsObject.content.Metrices[i].Metrices_type[j] == "string" || this.metricsObject.content.Metrices[i].Metrices_type[j] == "NA") {
          if (this.metricsObject.content.Metrices[i].Metrices_list[j] == inputField) {
            if (term.value != "") {
              term.required = false;
              var oldPlaceholderInput = this.metricsSubObject.content.Metrices[i].Metrices_list[j];
              this.addScores[oldPlaceholderInput] = term.value;
            }else if(term.value == ""){
              term.required = false;
              var oldPlaceholderInput = this.metricsSubObject.content.Metrices[i].Metrices_list[j];
              this.addScores[oldPlaceholderInput] = "";
            }
          }
        }
      }
    } 
  }

  onMetricsSubmit(){
    this._constant.processingContent = true;
    this.dialog.open(ModalComponent);
   
    var affiliatename = this.metricsSubObject.Affliate_Name.charAt(0).toLowerCase() + this.metricsSubObject.Affliate_Name.slice(1);
    var lastData = JSON.parse(this.lastCheckin);
    var userEntireData =  JSON.parse(this.userDataList);
    var emailIsThis= this.affiliateEmail;
    var passThis = this._constant.userPassword;
    var machindIdthis;
    var dateOfBirthhis;
    var IHLUserIdThis;
    if (lastData !== undefined && lastData !== null && lastData !=="") {
      if (lastData.IHLMachineId == null || lastData.IHLMachineId == undefined || lastData.IHLMachineId == "") {
        machindIdthis = "";
      }else if(lastData.IHLMachineId != undefined && lastData.IHLMachineId != null && lastData.IHLMachineId != ""){
        machindIdthis = lastData.IHLMachineId;
      }else{
        machindIdthis = "";
      }
    }else{
      machindIdthis = "";
    }

    if(this.dob != undefined && this.dob != null && this.dob != ""){
      dateOfBirthhis = this.dob;
    }else{
      dateOfBirthhis = "";
    }

    if(userEntireData.id != undefined && userEntireData.id != null && userEntireData.id != ""){
      IHLUserIdThis = userEntireData.id;
    }else{
      IHLUserIdThis = "";
    }

    var jsontextLogin = {"password":passThis,"email":emailIsThis};
    var checkin ={[affiliatename]:{"id":IHLUserIdThis},"IHLMachineId":machindIdthis,"dateOfBirth":dateOfBirthhis};
    console.log(this.addScores);

    for (let i = 0; i < this.metricsSubObject.content.Metrices.length; i++) {
     var newAffiliateName = this.metricsSubObject.content.Metrices[i].Metrices_Name;
     var array = this.metricsSubObject.content.Metrices[i].Metrices_list;
     var object = this.addScores;
     var newSelect = this.valueselect(array, object);
     console.log(newSelect);
     
      if (Object.keys(newSelect).length !== 0) {
        checkin[affiliatename][newAffiliateName] =  newSelect;
      }   
    }
    console.log(checkin);
    
    var apiKey = localStorage.getItem('apiKey')
    var IHLUserToken = localStorage.getItem('id_token');
    var IHLUserId = IHLUserIdThis;
    var stringCheckin = JSON.stringify(checkin);
    setTimeout(() => {
      this.authServiceLogin.postMetricsInput(apiKey,IHLUserToken,IHLUserId,emailIsThis,stringCheckin).subscribe((data: any) =>{
        console.log(data);
        if(data == '0' || data == 0){
          this._constant.processingContent = false;
          this.eventEmitterService.onModalClose();
          this.snackBar.open("Your data is submitted successfully!", '',{
            duration: 5000,
            panelClass: ['success'],
          });
        }
      },err => {
        this._constant.processingContent = false;
          this.eventEmitterService.onModalClose();
          this.snackBar.open("Your data is submitted", '',{
            duration: 5000,
            panelClass: ['success'],
          });
      });
    },1000);
  }

  valueselect(array, object){
    for (var k in object) {
        return array.reduce((o, c) => {
            if (object.hasOwnProperty(c)) {
                o[c] = object[c] 
            }
            return o
        }, {})
    }
  }

  userProgramInput(){
    this.metrics = false;
    this.home = false;
    this.userProgram = true;
    var userAffiliateProgram;
    this._constant.userChangedProgram = null;
    this._constant.userSelectedOldProgram = this.programNameGet;
    if (JSON.parse(this._constant.aesDecryption("affiliatedProgramNames")) == undefined || JSON.parse(this._constant.aesDecryption("affiliatedProgramNames")) == null || JSON.parse(this._constant.aesDecryption("affiliatedProgramNames")) == "") {
      this.notWorking = true;
      if (this.affiliateProgram == "Dimension") {
        userAffiliateProgram = "dimension";
      }else{
        userAffiliateProgram = this._constant.aesDecryption("affiliateProgram");
      }
  
      this.affiliateOrganisation = '{"affiliate_name": "'+userAffiliateProgram+'"}'
  
      this.authServiceLogin.getAffiliateProgram(this.affiliateOrganisation).subscribe((data : any) =>  {
        console.log(data);
        //this.loading = false;
        var response = /&quot;/g; 
        var objt = data;
        var responseFinal = objt.replace(response,'"');
        var userProgramsData = JSON.parse(responseFinal);
        this.notWorking = false;
        //this.loginUserProgram = userProgramsData.programs;
        localStorage.setItem("affiliatedProgramNames", this._constant.aesEncryption(JSON.stringify(userProgramsData.programs)));
        //this.loginUserProgram = ['GOLD Program','Body Builder','Silver Program','Diamond Program','Platinum Program','Other Program'];
        this.loginUserProgram = JSON.parse(this._constant.aesDecryption("affiliatedProgramNames"));
      }); 
    }else{
      this.notWorking = false;
      this.loginUserProgram = JSON.parse(this._constant.aesDecryption("affiliatedProgramNames"));
    }
    
  }

  userProgramSelectFunction(program: any,index: number) {
    this._constant.userSelectedOldProgram = "";
    this._constant.userChangedProgram = index;
    if (this.programNameGet != undefined && this.programNameGet != null && this.programApprovalGet == "True") {
      if(program == this.programNameGet){
        this._constant.wrongInformation = true;
        this.dialog.open(ModalComponent);
        setTimeout(() => {
          this._constant.wrongInformation = false;
          this.eventEmitterService.onModalClose();
        },3000)
      }else if(program != this.programNameGet){
        this._constant.openModal = true;
        this._constant.selectedProgram = program;
        this.dialog.open(ModalComponent, {
          data:this.programNameGet,
        });
      }
    }
  }

  homeInput(){
    this.userProgram = false;
    this.metrics = false;
    this.home = true;
    this.metricsDashboardSection = true;
    this.metricsGraphSection = false;
    this.noMetricsDashboard = false;
    this.affiliateOverallData = this.affiliatedUsersOverAllDatas;
    this.homeTotalMetricesInput = JSON.parse(this._constant.aesDecryption("finalAny"));
    console.log(this.homeTotalMetricesInput);
    // if (this._constant.affiliatedUsersLastCheckinDatas !== undefined && this._constant.affiliatedUsersLastCheckinDatas !== null && this._constant.affiliatedUsersLastCheckinDatas !== "") {
    //   this.affiliateLastcheckinData = this._constant.affiliatedUsersLastCheckinDatas;
      
    // }else {
    // this.noMetricsDashboard = true;
    // }
  }
  
  metricsGraphFunction(Title,Value,Unit,Color){
    if(Value !== "--" && Value !== null && Value !== undefined){
      this.metricsDashboardSection = false;
      this.metricsGraphSection = true;
      this.graphCardTitle = Title;
      this.graphCardValue = Value;
      this.graphCardUnit = Unit;
      this.graphCardColor = Color;
      this.graphCardTitleHistory = Title + " history";
      this.graphCardUnitHistory = Unit;
      this.graphCardUnitMinMax = Unit;
      this.graphCardTitleMinMax = Title + " minmax";
      if (this.chartforAllDay !== null) {
        this.chartforAllDay.destroy();
        this.chartforAllDay = null;
      }
  
      if (this.chartfor30Day !== null) {
        this.chartfor30Day.destroy();
        this.chartfor30Day = null;
      }
  
      if (this.chartfor90Day !== null) {
        this.chartfor90Day.destroy();
        this.chartfor90Day = null;
      }
  
      if (this.chartfor7Day !== null) {
        this.chartfor7Day.destroy();
        this.chartfor7Day = null;
      }
  
      this.metricsMeasurementHistoryFunction();
      this.metricsMinimumMaximumAvgFunction();
      setTimeout(() => {
        this.graphAllDays();
      },300);
    }else{
      console.log("no appropriate values available to show graph and history");
    }

  }


  graphAllDays(){
    this.chartAllDays = true;
    this.chart90Days = false;
    this.chart30Days = false;
    this.chart7Days = false;
    this.noMinimumpoints = false;
    this.chartAllDaysShow = false;
    this.chart30DaysShow = false;
    this.chart90DaysShow = false;
    this.chart7DaysShow = false;
    this.graphCardTitle;
    this.graphCardValue;
    let graphData;

    if (this.chartfor30Day !== null) {
      this.chartfor30Day.destroy();
      this.chartfor30Day = null;
    }

    if (this.chartfor90Day !== null) {
      this.chartfor90Day.destroy();
      this.chartfor90Day = null;
    }

    if (this.chartfor7Day !== null) {
      this.chartfor7Day.destroy();
      this.chartfor7Day = null;
    }

    if(this.affiliateOverallData !== undefined && this.affiliateOverallData !== null && this.affiliateOverallData !== ""){
      if (this.graphCardTitle !== undefined && this.graphCardTitle !== null && this.graphCardTitle !== "") {
        for (let n = 0; n < Object.keys(this.affiliateOverallData).length; n++) {
          if (Object.keys(this.affiliateOverallData)[n] ==  this.graphCardTitle) {
            graphData = Object.values(this.affiliateOverallData)[n];
          }
        }
      }
    }else{
      alert(this.affiliateOverallData);
    }

    if(graphData != undefined && graphData != null && graphData != ""){
      for (let p = 0; p < graphData.length; p++) {
        graphData[p].dateTimeFormatted = this.datepipe.transform(graphData[p].dateTimeFormatted, 'MM-dd-yyyy');
      }
    }

    let graphAllDaysData = graphData;

    var date1;
    var datelength = 0;
    var updatedAllDaysGraph  = []
    if (graphAllDaysData !== undefined && graphAllDaysData !== null)  {
      if (graphAllDaysData.length > 0 ) {
        for (let q = 0; q < graphAllDaysData.length; q++) {
          if (q == 0) {
            date1 = graphAllDaysData[0];
          }else{
            date1 = graphAllDaysData[q];
          }
          
          if (graphAllDaysData[q+1] !== undefined && date1.dateTimeFormatted == graphAllDaysData[q+1].dateTimeFormatted) {
            updatedAllDaysGraph[datelength] = graphAllDaysData[q+1]
          }else{
            updatedAllDaysGraph[datelength] = graphAllDaysData[q];
            datelength++;
          }
        }
      }
     
    }
    
    console.log(updatedAllDaysGraph);
    let objectAllDays = [];
    var objLen = 0;
    if (updatedAllDaysGraph.length >= 2) {
      for (let r = 0; r < updatedAllDaysGraph.length; r++) {
        var pointColors;
        if (updatedAllDaysGraph[r].higher_reference_range !== undefined && updatedAllDaysGraph[r].higher_reference_range !== null && updatedAllDaysGraph[r].lower_reference_range !== undefined && updatedAllDaysGraph[r].lower_reference_range !== null) {
          if (updatedAllDaysGraph[r].higher_reference_range !== "NA" && updatedAllDaysGraph[r].lower_reference_range !== "NA") {
            if (Number(updatedAllDaysGraph[r].Value) > Number(updatedAllDaysGraph[r].lower_reference_range) && Number(updatedAllDaysGraph[r].Value) < Number(updatedAllDaysGraph[r].higher_reference_range)) {
              pointColors = "green";
            }else if(Number(updatedAllDaysGraph[r].Value) <= Number(updatedAllDaysGraph[r].lower_reference_range)){
              pointColors = "orange";
            }else if(Number(updatedAllDaysGraph[r].Value) >= updatedAllDaysGraph[r].higher_reference_range){
              pointColors = "red";
            }
          }else if(updatedAllDaysGraph[r].higher_reference_range == "NA" || updatedAllDaysGraph[r].lower_reference_range !== "NA"){
            pointColors = "#4885ed";
          }
        }else{
          pointColors = "#4885ed";
        }
        objectAllDays[objLen] = {x: new Date(updatedAllDaysGraph[r].dateTimeFormatted) , y: Number(updatedAllDaysGraph[r].Value) , color: pointColors}
        objLen++;
      }
      this.chartAllDaysShow = true;
      this.graphAreaAllDays(objectAllDays);
      
    }else{
      this.graphAreaAllDays(objectAllDays);
    }
  }

  graphAreaAllDays(objectAllDays){
    if (this.chartAllDaysShow == true) {
      this.chartforAllDay = new CanvasJS.Chart("chartforAllDays", {
        toolTip: {
          fontFamily: "'Quicksand', 'sans-serif'",
          borderThickness: "0",
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
          labelFontFamily: "'Quicksand', 'sans-serif'",
          scaleBreaks: {
            autoCalculate: true,
            type:null
          }
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
            legendText: "High",
            legendMarkerType: "square",
            legendMarkerColor: "red",
            fillOpacity: 0,
            lineThickness: 0,
            markerSize: 0,
            dataPoints: objectAllDays
          },
          {
            type: "splineArea",
            showInLegend: true,
            legendText: "Low",
            legendMarkerType: "square",
            legendMarkerColor: "orange",
            fillOpacity: 0,
            lineThickness: 0,
            markerSize: 0,
            dataPoints: objectAllDays
          },
          {
            type: "splineArea",
            showInLegend: true,
            legendText: "Normal",
            legendMarkerType: "square",
            legendMarkerColor: "Green",
            fillOpacity: 0,
            lineThickness: 0,
            markerSize: 0,
            dataPoints: objectAllDays
          },
          {
            type: "splineArea",
            lineThickness: 2,
            lineColor: "#4885ed",
            fillOpacity: 0.1,
            markerSize: 10,
            dataPoints: objectAllDays
          }]
      });
      this.chartforAllDay.render();
    }else{

      this.noMinimumpoints = true;
      this.chartAllDaysShow = false;
    }
  }

  graph90Days(){
    this.chartAllDays = false;
    this.chart90Days = true;
    this.chart30Days = false;
    this.chart7Days = false;
    this.noMinimumpoints = false;
    this.chartAllDaysShow = false;
    this.chart30DaysShow = false;
    this.chart90DaysShow = false;
    this.chart7DaysShow = false;
    this.graphCardTitle;
    this.graphCardValue;
    let graphData;

    if (this.chartforAllDay !== null) {
      this.chartforAllDay.destroy();
      this.chartforAllDay = null;
    }

    if (this.chartfor30Day !== null) {
      this.chartfor30Day.destroy();
      this.chartfor30Day = null;
    }

    if (this.chartfor7Day !== null) {
      this.chartfor7Day.destroy();
      this.chartfor7Day = null;
    }

    if(this.affiliateOverallData !== undefined && this.affiliateOverallData !== null && this.affiliateOverallData !== ""){
      if (this.graphCardTitle !== undefined && this.graphCardTitle !== null && this.graphCardTitle !== "") {
        for (let n = 0; n < Object.keys(this.affiliateOverallData).length; n++) {
          if (Object.keys(this.affiliateOverallData)[n] ==  this.graphCardTitle) {
            graphData = Object.values(this.affiliateOverallData)[n];
          }
        }
      }
    }else{
      alert(this.affiliateOverallData);
    }

    if(graphData != undefined && graphData != null && graphData != ""){
      for (let p = 0; p < graphData.length; p++) {
        graphData[p].dateTimeFormatted = this.datepipe.transform(graphData[p].dateTimeFormatted, 'MM-dd-yyyy');
      }
    }

    var currentDay = new Date();
    var currentDayDate =this.datepipe.transform(currentDay, 'MM-dd-yyyy');
    console.log(currentDayDate);

    var before90Days = new Date(Date.now() - (90 * 24 * 60 * 60 * 1000));
    var last90Days = new Date(before90Days);
   
    var last90DaysDate =this.datepipe.transform(last90Days, 'MM-dd-yyyy');
    console.log(last90DaysDate);
    console.log(graphData);
    
    let users: any[] = graphData;
    let start_Date = new Date(last90DaysDate);
    let end_Date = new Date(currentDayDate);
    console.log(start_Date);
    console.log(end_Date);
    let graph90DaysData = users.filter(f => new Date(f.dateTimeFormatted) >= start_Date && new Date(f.dateTimeFormatted) <= end_Date);
    console.log(graph90DaysData);

    var date1;
    var datelength = 0;
    var updated90DaysGraph  = []
    if (graph90DaysData !== undefined && graph90DaysData !== null)  {
      if (graph90DaysData.length > 0 ) {
        for (let q = 0; q < graph90DaysData.length; q++) {
          if (q == 0) {
            date1 = graph90DaysData[0];
          }else{
            date1 = graph90DaysData[q];
          }
          
          if (graph90DaysData[q+1] !== undefined && date1.dateTimeFormatted == graph90DaysData[q+1].dateTimeFormatted) {
            updated90DaysGraph[datelength] = graph90DaysData[q+1]
          }else{
            updated90DaysGraph[datelength] = graph90DaysData[q];
            datelength++;
          }
        }
      }
     
    }
    console.log(updated90DaysGraph);
    let object90Days = [];
    var objLen = 0;
    if (updated90DaysGraph.length >= 2) {
      for (let r = 0; r < updated90DaysGraph.length; r++) {
        var pointColors;
        if (updated90DaysGraph[r].higher_reference_range !== undefined && updated90DaysGraph[r].higher_reference_range !== null && updated90DaysGraph[r].lower_reference_range !== undefined && updated90DaysGraph[r].lower_reference_range !== null) {
          if (updated90DaysGraph[r].higher_reference_range !== "NA" && updated90DaysGraph[r].lower_reference_range !== "NA") {
            if (Number(updated90DaysGraph[r].Value) > Number(updated90DaysGraph[r].lower_reference_range) && Number(updated90DaysGraph[r].Value) < Number(updated90DaysGraph[r].higher_reference_range)) {
              pointColors = "green";
            }else if(Number(updated90DaysGraph[r].Value) <= Number(updated90DaysGraph[r].lower_reference_range)){
              pointColors = "orange";
            }else if(Number(updated90DaysGraph[r].Value) >= updated90DaysGraph[r].higher_reference_range){
              pointColors = "red";
            }
          }else if(updated90DaysGraph[r].higher_reference_range == "NA" || updated90DaysGraph[r].lower_reference_range !== "NA"){
            pointColors = "#4885ed";
          }
        }else{
          pointColors = "#4885ed";
        }
        object90Days[objLen] = {x: new Date(updated90DaysGraph[r].dateTimeFormatted) , y: Number(updated90DaysGraph[r].Value) , color: pointColors}
        objLen++;
      }
      this.chart90DaysShow = true;
      this.graphArea90Days(object90Days);
      
    }else{
      this.graphArea90Days(object90Days);
    }
  }

  graphArea90Days(object90Days){
    if (this.chart90DaysShow == true) {
      this.chartfor90Day = new CanvasJS.Chart("chartfor90Days", {
        toolTip: {
          fontFamily: "'Quicksand', 'sans-serif'",
          borderThickness: "0",
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
          labelFontFamily: "'Quicksand', 'sans-serif'",
          scaleBreaks: {
            autoCalculate: true,
            type:null
          }
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
            legendText: "High",
            legendMarkerType: "square",
            legendMarkerColor: "red",
            fillOpacity: 0,
            lineThickness: 0,
            markerSize: 0,
            dataPoints: object90Days
          },
          {
            type: "splineArea",
            showInLegend: true,
            legendText: "Low",
            legendMarkerType: "square",
            legendMarkerColor: "orange",
            fillOpacity: 0,
            lineThickness: 0,
            markerSize: 0,
            dataPoints: object90Days
          },
          {
            type: "splineArea",
            showInLegend: true,
            legendText: "Normal",
            legendMarkerType: "square",
            legendMarkerColor: "Green",
            fillOpacity: 0,
            lineThickness: 0,
            markerSize: 0,
            dataPoints: object90Days
          },
          {
            type: "splineArea",
            lineThickness: 2,
            lineColor: "#4885ed",
            fillOpacity: 0.1,
            markerSize: 10,
            dataPoints: object90Days
          }]
      });
      this.chartfor90Day.render();
    }else{

      this.noMinimumpoints = true;
      this.chart90DaysShow = false;
    }
  }

  graph30Days(){
    this.chartAllDays = false;
    this.chart90Days = false;
    this.chart30Days = true;
    this.chart7Days = false;
    this.noMinimumpoints = false;
    this.chartAllDaysShow = false;
    this.chart30DaysShow = false;
    this.chart90DaysShow = false;
    this.chart7DaysShow = false;
    this.graphCardTitle;
    this.graphCardValue;
    let graphData;

    if (this.chartforAllDay !== null) {
      this.chartforAllDay.destroy();
      this.chartforAllDay = null;
    }

    if (this.chartfor90Day !== null) {
      this.chartfor90Day.destroy();
      this.chartfor90Day = null;
    }

    if (this.chartfor7Day !== null) {
      this.chartfor7Day.destroy();
      this.chartfor7Day = null;
    }

    if(this.affiliateOverallData !== undefined && this.affiliateOverallData !== null && this.affiliateOverallData !== ""){
      if (this.graphCardTitle !== undefined && this.graphCardTitle !== null && this.graphCardTitle !== "") {
        for (let n = 0; n < Object.keys(this.affiliateOverallData).length; n++) {
          if (Object.keys(this.affiliateOverallData)[n] ==  this.graphCardTitle) {
            graphData = Object.values(this.affiliateOverallData)[n];
          }
        }
      }
    }else{
      alert(this.affiliateOverallData);
    }

    if(graphData != undefined && graphData != null && graphData != ""){
      for (let p = 0; p < graphData.length; p++) {
        graphData[p].dateTimeFormatted = this.datepipe.transform(graphData[p].dateTimeFormatted, 'MM-dd-yyyy');
      }
    }

    var currentDay = new Date();
    var currentDayDate =this.datepipe.transform(currentDay, 'MM-dd-yyyy');
    console.log(currentDayDate);

    var before30Days = new Date(Date.now() - (30 * 24 * 60 * 60 * 1000));
    var last30Days = new Date(before30Days);
   
    var last30DaysDate =this.datepipe.transform(last30Days, 'MM-dd-yyyy');
    console.log(last30DaysDate);
    console.log(graphData);

    let users: any[] = graphData;
    let start_Date = new Date(last30DaysDate);
    let end_Date = new Date(currentDayDate);
    console.log(start_Date);
    console.log(end_Date);
    let graph30DaysData = users.filter(f => new Date(f.dateTimeFormatted) >= start_Date && new Date(f.dateTimeFormatted) <= end_Date);
    console.log(graph30DaysData);
    
    var date1;
    var datelength = 0;
    var updated30DaysGraph  = []
    if (graph30DaysData !== undefined && graph30DaysData !== null)  {
      if (graph30DaysData.length > 0 ) {
        for (let q = 0; q < graph30DaysData.length; q++) {
          if (q == 0) {
            date1 = graph30DaysData[0];
          }else{
            date1 = graph30DaysData[q];
          }
          
          if (graph30DaysData[q+1] !== undefined && date1.dateTimeFormatted == graph30DaysData[q+1].dateTimeFormatted) {
            updated30DaysGraph[datelength] = graph30DaysData[q+1]
          }else{
            updated30DaysGraph[datelength] = graph30DaysData[q];
            datelength++;
          }
        }
      }
     
    }

    console.log(updated30DaysGraph);
    let object30Days = [];
    var objLen = 0;
    if (updated30DaysGraph.length >= 2) {
      for (let r = 0; r < updated30DaysGraph.length; r++) {
        var pointColors;
        if (updated30DaysGraph[r].higher_reference_range !== undefined && updated30DaysGraph[r].higher_reference_range !== null && updated30DaysGraph[r].lower_reference_range !== undefined && updated30DaysGraph[r].lower_reference_range !== null) {
          if (updated30DaysGraph[r].higher_reference_range !== "NA" && updated30DaysGraph[r].lower_reference_range !== "NA") {
            if (Number(updated30DaysGraph[r].Value) > Number(updated30DaysGraph[r].lower_reference_range) && Number(updated30DaysGraph[r].Value) < Number(updated30DaysGraph[r].higher_reference_range)) {
              pointColors = "green";
            }else if(Number(updated30DaysGraph[r].Value) <= Number(updated30DaysGraph[r].lower_reference_range)){
              pointColors = "orange";
            }else if(Number(updated30DaysGraph[r].Value) >= updated30DaysGraph[r].higher_reference_range){
              pointColors = "red";
            }
          }else if(updated30DaysGraph[r].higher_reference_range == "NA" || updated30DaysGraph[r].lower_reference_range !== "NA"){
            pointColors = "#4885ed";
          }
        }else{
          pointColors = "#4885ed";
        }
        object30Days[objLen] = {x: new Date(updated30DaysGraph[r].dateTimeFormatted) , y: Number(updated30DaysGraph[r].Value) , color: pointColors}
        objLen++;
      }
      this.chart30DaysShow = true;
      this.graphArea30Days(object30Days);
      
    }else{
      this.graphArea30Days(object30Days);
    }
  }

  graphArea30Days(object30Days){
    if (this.chart30DaysShow == true) {
      this.chartfor30Day = new CanvasJS.Chart("chartfor30Days", {
        toolTip: {
          fontFamily: "'Quicksand', 'sans-serif'",
          borderThickness: "0",
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
          labelFontFamily: "'Quicksand', 'sans-serif'",
          scaleBreaks: {
            autoCalculate: true,
            type:null
          }
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
            legendText: "High",
            legendMarkerType: "square",
            legendMarkerColor: "red",
            fillOpacity: 0,
            lineThickness: 0,
            markerSize: 0,
            dataPoints: object30Days
          },
          {
            type: "splineArea",
            showInLegend: true,
            legendText: "Low",
            legendMarkerType: "square",
            legendMarkerColor: "orange",
            fillOpacity: 0,
            lineThickness: 0,
            markerSize: 0,
            dataPoints: object30Days
          },
          {
            type: "splineArea",
            showInLegend: true,
            legendText: "Normal",
            legendMarkerType: "square",
            legendMarkerColor: "Green",
            fillOpacity: 0,
            lineThickness: 0,
            markerSize: 0,
            dataPoints: object30Days
          },
          {
            type: "splineArea",
            lineThickness: 2,
            lineColor: "#4885ed",
            fillOpacity: 0.1,
            markerSize: 10,
            dataPoints: object30Days
          }]
      });
      this.chartfor30Day.render();
    }else{

      this.noMinimumpoints = true;
      this.chart30DaysShow = false;
    }
  }

  graph7Days(){
    this.chartAllDays = false;
    this.chart90Days = false;
    this.chart30Days = false;
    this.chart7Days = true;
    this.noMinimumpoints = false;
    this.chartAllDaysShow = false;
    this.chart30DaysShow = false;
    this.chart7DaysShow = false;
    this.chart90DaysShow = false;
    this.graphCardTitle;
    this.graphCardValue;
    let graphData;
    
    if (this.chartforAllDay !== null) {
      this.chartforAllDay.destroy();
      this.chartforAllDay = null;
    }
    
    if (this.chartfor90Day !== null) {
      this.chartfor90Day.destroy();
      this.chartfor90Day = null;
    }

    if (this.chartfor30Day !== null) {
      this.chartfor30Day.destroy();
      this.chartfor30Day = null;
    }

    if(this.affiliateOverallData !== undefined && this.affiliateOverallData !== null && this.affiliateOverallData !== ""){
      if (this.graphCardTitle !== undefined && this.graphCardTitle !== null && this.graphCardTitle !== "") {
        for (let n = 0; n < Object.keys(this.affiliateOverallData).length; n++) {
          if (Object.keys(this.affiliateOverallData)[n] ==  this.graphCardTitle) {
            graphData = Object.values(this.affiliateOverallData)[n];
          }
        }
      }
    }else{
      alert(this.affiliateOverallData);
    }

    if(graphData != undefined && graphData != null && graphData != ""){
      for (let p = 0; p < graphData.length; p++) {
        graphData[p].dateTimeFormatted = this.datepipe.transform(graphData[p].dateTimeFormatted, 'MM-dd-yyyy');
      }
    }

    var currentDay = new Date();
    var currentDayDate =this.datepipe.transform(currentDay, 'MM-dd-yyyy');
    console.log(currentDayDate);

    var before7Days = new Date(Date.now() - (7 * 24 * 60 * 60 * 1000));
    var last7Days = new Date(before7Days);
   
    var last7DaysDate =this.datepipe.transform(last7Days, 'MM-dd-yyyy');
    console.log(last7DaysDate);
    console.log(graphData);
    
    let users: any[] = graphData;
    let start_Date = new Date(last7DaysDate);
    let end_Date = new Date(currentDayDate);
    console.log(start_Date);
    console.log(end_Date);
    let graph7DaysData = users.filter(f => new Date(f.dateTimeFormatted) >= start_Date && new Date(f.dateTimeFormatted) <= end_Date);
    console.log(graph7DaysData);

    var date1;
    var datelength = 0;
    var updated7DaysGraph  = []
    if (graph7DaysData !== undefined && graph7DaysData !== null)  {
      if (graph7DaysData.length > 0 ) {
        for (let q = 0; q < graph7DaysData.length; q++) {
          if (q == 0) {
            date1 = graph7DaysData[0];
          }else{
            date1 = graph7DaysData[q];
          }
          
          if (graph7DaysData[q+1] !== undefined && date1.dateTimeFormatted == graph7DaysData[q+1].dateTimeFormatted) {
            updated7DaysGraph[datelength] = graph7DaysData[q+1]
          }else{
            updated7DaysGraph[datelength] = graph7DaysData[q];
            datelength++;
          }
        }
      }
     
    }

    console.log(updated7DaysGraph);
    let object7Days = [];
    var objLen = 0;
    if (updated7DaysGraph.length >= 2) {
      for (let r = 0; r < updated7DaysGraph.length; r++) {
        var pointColors;
        if (updated7DaysGraph[r].higher_reference_range !== undefined && updated7DaysGraph[r].higher_reference_range !== null && updated7DaysGraph[r].lower_reference_range !== undefined && updated7DaysGraph[r].lower_reference_range !== null) {
          if (updated7DaysGraph[r].higher_reference_range !== "NA" && updated7DaysGraph[r].lower_reference_range !== "NA") {
            if (Number(updated7DaysGraph[r].Value) > Number(updated7DaysGraph[r].lower_reference_range) && Number(updated7DaysGraph[r].Value) < Number(updated7DaysGraph[r].higher_reference_range)) {
              pointColors = "green";
            }else if(Number(updated7DaysGraph[r].Value) <= Number(updated7DaysGraph[r].lower_reference_range)){
              pointColors = "orange";
            }else if(Number(updated7DaysGraph[r].Value) >= updated7DaysGraph[r].higher_reference_range){
              pointColors = "red";
            }
          }else if(updated7DaysGraph[r].higher_reference_range == "NA" || updated7DaysGraph[r].lower_reference_range !== "NA"){
            pointColors = "#4885ed";
          }
        }else{
          pointColors = "#4885ed";
        }
        object7Days[objLen] = {x: new Date(updated7DaysGraph[r].dateTimeFormatted) , y: Number(updated7DaysGraph[r].Value) , color: pointColors}
        objLen++;
      }
      this.chart7DaysShow = true;
      this.graphArea7Days(object7Days);
      
    }else{
      this.graphArea7Days(object7Days);
    }

  }

  graphArea7Days(object7Days){
    if (this.chart7DaysShow == true) {
      this.chartfor7Day = new CanvasJS.Chart("chartfor7Days", {
        toolTip: {
          fontFamily: "'Quicksand', 'sans-serif'",
          borderThickness: "0",
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
          labelFontFamily: "'Quicksand', 'sans-serif'",
          scaleBreaks: {
            autoCalculate: true,
            type:null
          }
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
            legendText: "High",
            legendMarkerType: "square",
            legendMarkerColor: "red",
            fillOpacity: 0,
            lineThickness: 0,
            markerSize: 0,
            dataPoints: object7Days
          },
          {
            type: "splineArea",
            showInLegend: true,
            legendText: "Low",
            legendMarkerType: "square",
            legendMarkerColor: "orange",
            fillOpacity: 0,
            lineThickness: 0,
            markerSize: 0,
            dataPoints: object7Days
          },
          {
            type: "splineArea",
            showInLegend: true,
            legendText: "Normal",
            legendMarkerType: "square",
            legendMarkerColor: "Green",
            fillOpacity: 0,
            lineThickness: 0,
            markerSize: 0,
            dataPoints: object7Days
          },
          {
            type: "splineArea",
            lineThickness: 2,
            lineColor: "#4885ed",
            fillOpacity: 0.1,
            markerSize: 10,
            dataPoints: object7Days
          }]
      });
      this.chartfor7Day.render();
    }else{

      this.noMinimumpoints = true;
      this.chart7DaysShow = false;
    }
  }

  metricsMeasurementHistoryFunction(){
   this.metricsAllMeasure = null;
   var met_titles = this.graphCardTitleHistory;
  
    var metricsOverallMeasurementData = this.affiliatedUsersMeasurementOverAllDatas;
    let metricsCurrrentObjectHistory;
    console.log(metricsOverallMeasurementData);
    if (metricsOverallMeasurementData !== undefined && metricsOverallMeasurementData !== null ) {
      if(met_titles !== undefined && met_titles !== null){
        for (let t = 0; t <  Object.keys(metricsOverallMeasurementData).length; t++) {
          if (Object.keys(metricsOverallMeasurementData)[t] ==  met_titles) {
            metricsCurrrentObjectHistory = Object.values(metricsOverallMeasurementData)[t];
          }
        }
        for (let u = 0; u < metricsCurrrentObjectHistory.length; u++) {
          metricsCurrrentObjectHistory[u].dateTime_history = this.datepipe.transform(metricsCurrrentObjectHistory[u].dateTime_history, 'MMM d, h:mm a');
        }
      }
      
      this.metricsAllMeasure = metricsCurrrentObjectHistory;

      console.log(this.metricsAllMeasure);
      console.log(typeof this.metricsAllMeasure);
      console.log(this.metricsAllMeasure.length);
    }
  }

  metricsMinimumMaximumAvgFunction(){
    this.metricsMinMaxAvg = null;
    this.minimumMetricsValue = null;
    this.maximumMetricsValue = null;
    this.averageMetricsValue = null;
    var met_min_max = this.graphCardTitleMinMax;

    var metricsMinimumMaximumAverageData = this.affiliatedUsersMinimumMaximumOverAllDatas;
    let metricsCurrrentObjectMinMax;
    if (metricsMinimumMaximumAverageData !== undefined && metricsMinimumMaximumAverageData !== null ) {
      if(met_min_max !== undefined && met_min_max !== null){
        for (let t = 0; t <  Object.keys(metricsMinimumMaximumAverageData).length; t++) {
          if (Object.keys(metricsMinimumMaximumAverageData)[t] ==  met_min_max) {
            metricsCurrrentObjectMinMax = Object.values(metricsMinimumMaximumAverageData)[t];
          }
        }
        for (let u = 0; u < metricsCurrrentObjectMinMax.length; u++) {
          metricsCurrrentObjectMinMax[u].dateTime_min_max = this.datepipe.transform(metricsCurrrentObjectMinMax[u].dateTime_min_max, 'MM-dd-yyyy');
        }
      }
      
      //this.metricsAllMeasure = metricsCurrrentObjectMinMax;

      var currentDays = new Date();
      var currentDayDates =this.datepipe.transform(currentDays, 'MM-dd-yyyy');

      var before30Day = new Date(Date.now() - (30 * 24 * 60 * 60 * 1000));
      var last30Day = new Date(before30Day);
    
      var last30DayDate =this.datepipe.transform(last30Day, 'MM-dd-yyyy');
      console.log(last30DayDate);
      console.log(metricsCurrrentObjectMinMax);

      let userss: any[] = metricsCurrrentObjectMinMax;
      let start_Dates = new Date(last30DayDate);
      let end_Dates = new Date(currentDayDates);
      let minmax30DaysData = userss.filter(f => new Date(f.dateTime_min_max) >= start_Dates && new Date(f.dateTime_min_max) <= end_Dates);
      
      if(minmax30DaysData !== undefined && minmax30DaysData !== null){
        let minMaxValueArray = [];
        for (let v = 0; v < minmax30DaysData.length; v++) {
          minMaxValueArray.push(Number(minmax30DaysData[v].Value_min_max))
        }
        this.metricsMinMaxAvg = minMaxValueArray;
      }

      if(this.metricsMinMaxAvg.length > 1){

        var metricsMinMaxLength  = this.metricsMinMaxAvg.length;

        var highestmetrics = Math.max.apply(null,this.metricsMinMaxAvg);
        var lowestmetrics  = Math.min.apply(null,this.metricsMinMaxAvg);

        this.maximumMetricsValue = highestmetrics.toFixed(2);
        this.minimumMetricsValue = lowestmetrics.toFixed(2);
          
        var sumOfMinMax  = this.metricsMinMaxAvg.reduce((a, b) => a + b, 0);
        var averagemetrics = sumOfMinMax / metricsMinMaxLength;
          
        this.averageMetricsValue = averagemetrics.toFixed(2);

      }else{
        this.maximumMetricsValue = '--';
        this.minimumMetricsValue = '--';
        this.averageMetricsValue = '--';
        this.graphCardUnitMinMax = "";
      }
      
    }

  }

  formatOverallDatas(){
    let AFFILIATEDATA =  JSON.parse(this._constant.aesDecryption("AFFILIATESTHIS"));;
    let AffiliateHistory = JSON.parse(this._constant.aesDecryption("AFFILIATESHistoryThis"));
    let AffiliateMinMax = JSON.parse(this._constant.aesDecryption("AFFILIATESMinMaxThis"));
    let metricsLastCheckin = [];
    if (AFFILIATEDATA == undefined || AFFILIATEDATA == null) {
      AFFILIATEDATA = [];
    }
    if (AffiliateHistory == undefined || AffiliateHistory == null) {
      AffiliateHistory = [];
    }
    if (AffiliateMinMax == undefined || AffiliateMinMax == null) {
      AffiliateMinMax = [];
    }

    let outJSON = AFFILIATEDATA
    var groupBy = function(xs, key) {
      return xs.reduce(function(rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
      }, []);
    };
    var seperatedMetricsData = groupBy(outJSON, 'Title');
    if(Object.keys(seperatedMetricsData).length === 0){
      console.log("seperated metrics data is not available");
    }else{
      console.log(seperatedMetricsData);
      this.affiliatedUsersOverAllDatas = seperatedMetricsData;
      for (let l = 0; l < Object.keys(seperatedMetricsData).length; l++) {
        metricsLastCheckin.push(Object(Object.values(seperatedMetricsData)[l][Object.values(Object.values(seperatedMetricsData)[l]).length-1]));
      }
      console.log(metricsLastCheckin);
      this.affiliatedUsersLastCheckinDatas = metricsLastCheckin;
    }

    let outJSONHistory = AffiliateHistory
    var groupByHistory = function(xs, key) {
      return xs.reduce(function(rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
      }, []);
    };
    var seperatedMetricsDataHistory = groupByHistory(outJSONHistory, 'Title_history');

    if(Object.keys(seperatedMetricsDataHistory).length === 0){
      console.log("seperated metrics data history is not available");
    }else{
      console.log(seperatedMetricsDataHistory);
      this.affiliatedUsersMeasurementOverAllDatas = seperatedMetricsDataHistory;
    }

    let outJSONMinMax = AffiliateMinMax
    var groupByMinMax = function(xs, key) {
      return xs.reduce(function(rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
      }, []);
    };
    var seperatedMetricsDataMinimumMaximum = groupByMinMax(outJSONMinMax, 'Title_min_max');

    if(Object.keys(seperatedMetricsDataMinimumMaximum).length === 0){
      console.log("seperated metrics data MinimumMaximum is not available");
    }else{
      console.log(seperatedMetricsDataMinimumMaximum);
      this.affiliatedUsersMinimumMaximumOverAllDatas = seperatedMetricsDataMinimumMaximum;
    }
  }
}