import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TeleConsultService } from '../../services/tele-consult.service';
import { ConstantsService } from '../../services/constants.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ModalComponent } from '../modal/modal.component';
import { Subject } from 'rxjs';
import { MedicalDocumentService } from 'src/app/services/medical-document.service';
import { GlobalCdnService } from 'src/app/services/global-cdn.service';

@Component({
  selector: 'app-teleconsultdashboard',
  templateUrl: './teleconsultdashboard.component.html',
  styleUrls: ['./teleconsultdashboard.component.css']
})
export class TeleconsultdashboardComponent implements OnInit {
  start_index = 1;
  end_index = 20;
  loaderSpinConHistory = false;
  conHistoryListFull = false;
  consultationHistory: any[] = []
  consultationDashboard: boolean = false;
  consultationHistoryDashboard: boolean = false;
  apiResponseCount: number = 0;
  isLoading: boolean = true;
  consultationPlatformData: any;
  errorResponseCount: number = 0;
  isUserAndConsultantDataRetrived: boolean = false;
  headerName: string = 'Tele Consultation';
  brand_image_url_exist: boolean = false;
  brand_image_url: string = '';
  subscription: any;
  teleConsultTrigger = new Subject<any>();

  constructor(private router: Router,
    private _teleConsultService: TeleConsultService,
    private _constantsService: ConstantsService,
    private dialog: MatDialog,
    private medicalDocumentService: MedicalDocumentService,
    private globalCdn: GlobalCdnService
    ) { }

  ngOnInit() {

    this._constantsService.selectedDoctor = undefined;

    this.globalCdn.load('autobahn');
   
    this.subscription = this._teleConsultService.on('terms-condition-agree').subscribe(() => this.allowUserToTeleConsult());
    this._constantsService.prescriptionObjectFor1mg = "";
    this._constantsService.labObjectFor1mg = "";
    this._constantsService._is_base64_pdf_available = false;
    this._constantsService.documentToShare = [];
    this.medicalDocumentService.selectedDocumentedId(this._constantsService.documentToShare);
    
    this.afterInit();
    if(this._constantsService.teleconsultationFlowSelected == 'affiliate') {
      //this.headerName = this._constantsService.teleconsultationAffiliationSelectedName+' - Health Consultation';
      if(this._constantsService.teleconsultationAffiliationSelectedCompanyImg != '') {
        this.brand_image_url_exist = true;
        this.brand_image_url = this._constantsService.teleconsultationAffiliationSelectedCompanyImg;
      }
      this.headerName = 'Affiliate Tele Consultation';
    } else {
      this.headerName = 'Tele Consultation';
    }
  }

  onScroll(event: Event){
    const element = event.target as HTMLElement;
    if(element.scrollHeight - element.scrollTop === element.clientHeight && !this.conHistoryListFull){
      this.loaderSpinConHistory = true;
      this.start_index += 20;
      this.end_index += 20;
      this.consultationHistoryApiCall();
    }
  }

  async afterInit(){
    // this.consultationHistory = 0;
    // this.consultationDashboard = true;
    // this.consultationHistoryDashboard = false;
    // this.consultationHistory = ["1","2"];
    //  'teleconsult-type'
    //   'teleconsult-speciality'
    //   'teleconsult-doctors'

    //make the browser tab reload if platform data is failed & it got success(do not remove the variable);
    if (this._constantsService.platformDataFailedToLoad == true) {
      //alert("browser in load");
      this._constantsService.platformDataFailedToLoad = false;
      location.reload();
    }
      
    //let userData = JSON.parse(localStorage.getItem("userData"));
    // this._teleConsultService.getTeleConsultUserData(userData.id).subscribe(
    //   data=>{
    //     data['appointments'].forEach(element => {//appointment_start_time: "2020-12-15 07:00 PM" appointment_end_time: "2020-12-15 07:30 PM"
    //       let appointmentStart = element.appointment_start_time.split(' ');
    //       let appointmentEnd = element.appointment_end_time.split(' ');
    //       let appointmentStartDateSplit = appointmentStart[0].split('-');
    //       let appointmentEndDateSplit = appointmentEnd[0].split('-');
    //       let appointmentStartDateTime = appointmentStartDateSplit[1]+"/"+appointmentStartDateSplit[2]+"/"+appointmentStartDateSplit[0]+" "+appointmentStart[1]+" "+appointmentStart[2];
    //       let appointmentEndDateTime = appointmentEndDateSplit[1]+"/"+appointmentEndDateSplit[2]+"/"+appointmentEndDateSplit[0]+" "+appointmentEnd[1]+" "+appointmentEnd[2];
    //       element.appointment_start_time = appointmentStartDateTime;
    //       element.appointment_end_time = appointmentEndDateTime;
    //     });

    //     data['consultation_history'].forEach(element => {//appointment_start_time: "2020-12-15 07:00 PM" appointment_end_time: "2020-12-15 07:30 PM"
    //       let appointmentStart = element.appointment_details.appointment_start_time.split(' ');
    //       let appointmentEnd = element.appointment_details.appointment_end_time.split(' ');
    //       let appointmentStartDateSplit = appointmentStart[0].split('-');
    //       let appointmentEndDateSplit = appointmentEnd[0].split('-');
    //       let appointmentStartDateTime = appointmentStartDateSplit[1]+"/"+appointmentStartDateSplit[2]+"/"+appointmentStartDateSplit[0]+" "+appointmentStart[1]+" "+appointmentStart[2];
    //       let appointmentEndDateTime = appointmentEndDateSplit[1]+"/"+appointmentEndDateSplit[2]+"/"+appointmentEndDateSplit[0]+" "+appointmentEnd[1]+" "+appointmentEnd[2];
    //       element.appointment_details.appointment_start_time = appointmentStartDateTime;
    //       element.appointment_details.appointment_end_time = appointmentEndDateTime;
    //     });


    //     console.log(data);
    //     this._constantsService.consultationUserData = data;
    //     let sortedArray = data['consultation_history'];
    //     // sortedArray.sort((a,b) => {
    //     //   if(b.appointment_details.appointment_start_time.toString() > 
    //     //     a.appointment_details.appointment_start_time.toString()) return 1;
    //     //   if(a.appointment_details.appointment_start_time.toString() >
    //     //     b.appointment_details.appointment_start_time.toString()) return -1;
    //     //   return 0;
    //     // });
    //     if (sortedArray.length > 1) {
    //       sortedArray.sort((a,b) => {
    //         let sortA = new Date(a.appointment_details.appointment_start_time).getTime();
    //         let sortB = new Date(b.appointment_details.appointment_start_time).getTime();
    //         return sortB - sortA;
    //       });
    //     }

    //     this.consultationHistory = sortedArray
    //     if(this.consultationHistory.length > 0){
    //       this.consultationHistoryDashboard = true;
    //       this.consultationDashboard = false;
    //     } else {
    //       this.consultationHistoryDashboard = false;
    //       this.consultationDashboard = true;
    //     }
    //     // this.apiResponseCount++;
    //     // if(this.apiResponseCount == 2){
    //     //   this.isLoading = false;
    //     // }

    //     this._teleConsultService.getTeleConsultUserPlatformData(userData.id).subscribe(
    //       data=>{
    //         console.log(data);
    //         this._constantsService.consultationPlatformData = data;

    //         let consultationTypes = this._constantsService.consultationPlatformData.consult_type.filter(obj =>{
    //           return obj['consultation_type_name'] === "Fitness Class";
    //         });
    //         console.log(consultationTypes);
    //         this.consultationPlatformData = consultationTypes;

    //         // this.apiResponseCount++;
    //         // if(this.apiResponseCount == 2){
    //         //   this.isLoading = false;
    //         // }
    //         this.isLoading = false;
    //       },
    //       (error: any) => {
    //         console.log("Platform data error");
    //         if (this.errorResponseCount <= 2) {
    //           this.afterInit();
    //           this.errorResponseCount++;
    //         }else{
    //           this.isLoading = false;
    //           this.consultationHistoryDashboard = false;
    //           this.consultationDashboard = false;
    //           this.isUserAndConsultantDataRetrived = true;
              
    //           //make the boolean value true if platform data is failed(do not remove this below valriable)
    //           this._constantsService.platformDataFailedToLoad = true;
    //         }
    //       }
    //     );
    //   },
    //   (error: any) => {
    //     console.log("user data error");
    //     if (this.errorResponseCount <= 2) {
    //       this.afterInit();
    //       this.errorResponseCount++;
    //     }else{
    //       this.isLoading = false;
    //       this.consultationHistoryDashboard = false;
    //       this.consultationDashboard = false;
    //       this.isUserAndConsultantDataRetrived = true;

    //       //make the boolean value true if platform data is failed(do not remove this below valriable)
    //       this._constantsService.platformDataFailedToLoad = true;
    //     }
    //   }
    // ); 

    if(this._constantsService.telePlatformDataFirstTimeCall === false) {
      await this.callTeleConsultDashboardAPIs();
    }
    else {
      // this.sortConsultationHistory(this._constantsService.consultationUserData);
      await this.callTeleConsultDashboardAPIs();
      this.isLoading = false;
    } 



  

    /* this._teleConsultService.getTeleConsultData().subscribe(data=>{
      console.log(data);
      this._constantsService.consultationPlatformData = data['consultation_platfrom_data'];

      this._constantsService.consultationUserData = data['consultation_user_data'];

      this.consultationHistory = data['consultation_user_data']['consultation_history'];
      if(this.consultationHistory.length > 0){
        this.consultationHistoryDashboard = true;
        this.consultationDashboard = false;
      } else{
        this.consultationHistoryDashboard = false;
        this.consultationDashboard = false;
      }
    }); */
    this._constantsService.startCallFlow = false;  // reset the value
    this._constantsService.teleConsultType = null; //reset the value
    this._constantsService.teleSpecalityType = null; // reset the value
    this._constantsService.teleconsultAddMobileNumber = false;  // reset the value
    //this._constantsService.genixIframeOpened = false; // reset the value  

    if(this._constantsService.aesDecryption('isjointuserlogin')){
      if(this._constantsService.aesDecryption('teleflow')){
        let flowcheck = this._constantsService.aesDecryption('teleflow');
        if(flowcheck == 'consult'){
          this.termsAndConditionAgree('now'); //once entered into this condition it directly goes to this functuon

        }else {
          this.termsAndConditionAgree('book');
        }
      }
    }

    if(this._constantsService.aesDecryption('addlinkanotheracc')){
      if(this._constantsService.aesDecryption('teleflow')){
        let flowcheck = this._constantsService.aesDecryption('teleflow');
        if(flowcheck == 'consult'){
          this.termsAndConditionAgree('now'); //once entered into this condition it directly goes to this functuon
        }else{
          this.termsAndConditionAgree('book');
        }
      }
    }
  }

  ngOnDestroy() {
    this.teleConsultTrigger.unsubscribe();
  }

  /* APIcallsFlow(){
    //alert("test");
    if(this._constantsService.telePlatformDataFirstTimeCall === false) {
      this.callTeleConsultDashboardAPIs();
    }
    else {
      this.sortConsultationHistory(this._constantsService.consultationUserData);
      this.callTeleConsultDashboardAPIs();
      this.isLoading = false;
    } 
    
    this._constantsService.startCallFlow = false;  // reset the value
    this._constantsService.teleConsultType = null; //reset the value
    this._constantsService.teleSpecalityType = null; // reset the value
    this._constantsService.teleconsultAddMobileNumber = false;  // reset the value
    //this._constantsService.genixIframeOpened = false; // reset the value  
  } */


  termsAndConditionAgree(flow) {
  this._constantsService.teleconsultationFlowSelected = "genric";
  this._constantsService.teleconsultationAffiliationSelectedName = "";  
  let userData = JSON.parse(this._constantsService.aesDecryption('userData'));
    let activestatus = false;
    console.log("userData : ", userData);
    if (userData != undefined && userData != null && userData.joint_user_detail_list != undefined && userData.joint_user_detail_list != null) {
      console.log(userData.joint_user_detail_list);
       
      for (let key in userData.joint_user_detail_list) {
        if (userData.joint_user_detail_list[key]['status'] == "active") {
          activestatus = true;
          break;
        }
      }
    }

    if(flow == "now"){
      this._constantsService.teleConsultationNewFlow = true;
      this._constantsService.startCallFlow = true;
      localStorage.setItem('teleflow', this._constantsService.aesEncryption("consult"));
    }else{
      localStorage.setItem('teleflow', this._constantsService.aesEncryption("book"));
      this._constantsService.startCallFlow = false;
    }

    if(this._constantsService.aesDecryption('user')){
      localStorage.removeItem('isjointuserlogin');
      localStorage.removeItem('user');
      this.allowUserToTeleConsult();
      return;
    }

    if(this._constantsService.aesDecryption('addlinkanotheracc')){
      localStorage.removeItem('teleflow');
      localStorage.removeItem('addlinkanotheracc');
      this.allowUserToTeleConsult();
      return;
    }

    if((userData.isTeleMedPolicyAgreed == undefined || userData.isTeleMedPolicyAgreed == false) && activestatus == false){// user not agree the terms & condition
      this._constantsService.teleConsultaionAgree = true;
      this.dialog.open(ModalComponent);
    }else if(activestatus == true){
      this._constantsService.jointUserTermsConditionsPopUp = true;
      this._constantsService.jointuserSelectothers = false;
      this.dialog.open(ModalComponent);
    }else{  /*T&C for caretaker account alone available*/
      this._constantsService.teleConsultaionAgree = true;   
      this.dialog.open(ModalComponent);
     // this.router.navigate(['/teleconsult-type']);
    }
  }

allowUserToTeleConsult(){
  console.log('call');
  if (this._constantsService.teleConsultationNewFlow)
    this.router.navigate(['/teleconsult-speciality']);
  else
    this.router.navigate(['/teleconsult-type']);
}

/* startConsultNow(){
  this._constantsService.startCallFlow = true;
  this.router.navigate(['/teleconsult-type']);
}

bookAppointment(){
  this.router.navigate(['/teleconsult-type']);
} */

selectDoctors(){
  this.router.navigate(['/teleconsult-doctors']);
}

myAppointment(){
  this.router.navigate(['/myappointment']);
}

followUp(){
  this.router.navigate(['/followup']);
}

summary(){
  this.router.navigate(['/consult-summary']);
}

MySubscriptions() {
  this.router.navigate(['/mysubscription']);
}

MedicalFiles() {
  this.router.navigate(['/medical']);
}

extractDate(js_datetime){
  if (js_datetime == undefined || js_datetime == '') return '';
  let a = new Date(js_datetime);
  return a.getDate() + '-' + a.toLocaleString('default', { 'month': 'short' }) + '-' + a.getFullYear();
}

extractTime(js_datetime){
  if (js_datetime == undefined || js_datetime == '') return '';
  let a = new Date(js_datetime);
  return a.toLocaleTimeString('default', { 'hour': 'numeric', hour12: true, 'minute': 'numeric' })
}

getDuration(start_date, end_date){
  if (start_date == undefined || start_date == '') return '';
  if (end_date == undefined || end_date == '') return '';
  start_date = new Date(start_date);
  end_date = new Date(end_date);

  return (end_date - start_date) / (1000 * 60) + ' min';
}

consultationDetails(index){
  console.log(this.consultationHistory[index]);
  this._constantsService.getTeleConsulationHistory = this.consultationHistory[index];
  // localStorage.setItem("historyDetail", JSON.stringify(this.consultationHistory[index]));
  this.router.navigate(['/consultation-details-view']);
}

iFrameOpen(): void {
  //this.router.navigate(['/genixConsultation']);
  //this._constantsService.genixIframeOpened = true;
  //this._constantsService.buyMedicineOnline = true;
  //this.dialog.open(ModalComponent);
}

selectSpeciality(consultation_type_name){
  this._constantsService.teleConsultType = consultation_type_name; //reset the value
  this._constantsService.teleConsultPageFlow.push(consultation_type_name);
  var consultantObj = { "ct": consultation_type_name, "st": "" };
  localStorage.setItem("consultantDataObj", this._constantsService.aesEncryption(JSON.stringify(consultantObj)));
  this.router.navigate(['/teleconsult-speciality']);
}

callDuration(start, end){
  // console.log(start, end);
  if (this._constantsService.ihlBaseurl != "https://azureapi.indiahealthlink.com/") {
    //allign date format to support all browsers & get milliseconds to calculate call duration
    try {
      if (start == undefined || start == null || end == undefined || end == null) throw "N/A";
    } catch (err) {
      return err;
    }

    // if (start.indexOf(',') > -1 || end.indexOf(',') > -1 || start.search(/am/i) > -1 || start.search(/pm/i) > -1 || end.search(/am/i) > -1 || end.search(/pm/i) > -1 || start.indexOf('/') > -1 || end.indexOf('/') > -1) {
    //   return "N/A";
    // }
    let startTimeSplit = start.split(' ');
    let endTimeSplit = end.split(' ');
    let startDateSplit = startTimeSplit[0].split('-');
    let endDateSplit = endTimeSplit[0].split('-');
    let startDateFormat = startDateSplit[2] + "-" + startDateSplit[1] + "-" + startDateSplit[0];
    let endDateFormat = endDateSplit[2] + "-" + endDateSplit[1] + "-" + endDateSplit[0];
    let TimeDifference = new Date(endDateFormat + ' ' + endTimeSplit[1]).getTime() - new Date(startDateFormat + ' ' + startTimeSplit[1]).getTime();

    //Convert milliseconds to minutes & seconds.
    let minutes = Math.floor(TimeDifference / 60000).toString();
    let seconds = ((TimeDifference % 60000) / 1000).toFixed(0);
    ///return minutes + ":" + ((seconds < 10) ? '0' : '') + seconds;
    return `${minutes.padStart(2, '0')}m ${seconds.padStart(2, '0')}s`;
  } else {
    try {
      if (start == undefined || start == null || end == undefined || end == null) throw "N/A";
    } catch (err) {
      return err;
    }
    let TimeDifference = new Date(end).getTime() - new Date(start).getTime();

    //Convert milliseconds to minutes & seconds.
    let minutes = Math.floor(TimeDifference / 60000).toString();
    let seconds = ((TimeDifference % 60000) / 1000).toFixed(0);
    ///return minutes + ":" + ((seconds < 10) ? '0' : '') + seconds;
    return `${minutes.padStart(2, '0')}m ${seconds.padStart(2, '0')}s`;

  }
}

async callTeleConsultDashboardAPIs() {
  let userData = JSON.parse(this._constantsService.aesDecryption("userData"));
  this.start_index = 1;
  this.end_index = 20;
  this.consultationHistoryApiCall();

  this._teleConsultService.getTeleConsultUserPlatformData(userData.id).subscribe(
    data => {
      console.log(data);
      this._constantsService.consultationPlatformData = data;

      let consultationTypes = this._constantsService.consultationPlatformData.consult_type.filter(obj => {
        return obj['consultation_type_name'] === "Fitness Class";
      });
      console.log(consultationTypes);
      this.consultationPlatformData = consultationTypes;

      // this.apiResponseCount++;
      // if(this.apiResponseCount == 2){
      //   this.isLoading = false;
      // }
      if (this._constantsService._isDiagnosticConsultantSelected) {
        this._constantsService.teleConsultPageFlow = [];
        this._constantsService.teleSpecalityType = null;
        this._constantsService.startCallFlow = true;
        this._constantsService.teleConsultType = "Health Consultation";
        this._constantsService.teleConsultPageFlow.push("Health Consultation");
        this._constantsService.teleSpecalityType = "Diagnostic Services";
        var consultantObj = { "ct": "Health Consultation", "st": "Diagnostic Services" };
        localStorage.setItem("consultantDataObj", this._constantsService.aesEncryption(JSON.stringify(consultantObj)));
        this._constantsService._isDiagnosticConsultantSelected = false;
        this.isLoading = false;
        this._constantsService.telePlatformDataFirstTimeCall = true;
        this.router.navigate(['/teleconsult-doctors']);
        return;
      }
      this.isLoading = false;
      this._constantsService.telePlatformDataFirstTimeCall = true;
    },
    (error: any) => {
      console.log("Platform data error");
      if (this.errorResponseCount <= 2) {
        this.afterInit();
        this.errorResponseCount++;
      } else {
        this.isLoading = false;
        this.consultationHistoryDashboard = false;
        this.consultationDashboard = false;
        // this.isUserAndConsultantDataRetrived = true;

        //make the boolean value true if platform data is failed(do not remove this below valriable)
        this._constantsService.platformDataFailedToLoad = true;
      }
    }
  );

}

consultationHistoryApiCall(){
  this._teleConsultService.viewConsultationHistoryPagination(this.start_index, this.end_index).subscribe(
    data => {
      console.log(data);
      // data['appointments'].forEach(element => {//appointment_start_time: "2020-12-15 07:00 PM" appointment_end_time: "2020-12-15 07:30 PM"
      //   let appointmentStart = element.appointment_start_time.split(' ');
      //   let appointmentEnd = element.appointment_end_time.split(' ');
      //   let appointmentStartDateSplit = appointmentStart[0].split('-');
      //   let appointmentEndDateSplit = appointmentEnd[0].split('-');
      //   let appointmentStartDateTime = appointmentStartDateSplit[1] + "/" + appointmentStartDateSplit[2] + "/" + appointmentStartDateSplit[0] + " " + appointmentStart[1] + " " + appointmentStart[2];
      //   let appointmentEndDateTime = appointmentEndDateSplit[1] + "/" + appointmentEndDateSplit[2] + "/" + appointmentEndDateSplit[0] + " " + appointmentEnd[1] + " " + appointmentEnd[2];
      //   element.appointment_start_time = appointmentStartDateTime;
      //   element.appointment_end_time = appointmentEndDateTime;
      // });

      data['consultation_history'].forEach(element => {//appointment_start_time: "2020-12-15 07:00 PM" appointment_end_time: "2020-12-15 07:30 PM"
        let appointmentStart = element.appointment_details.appointment_start_time.split(' ');
        let appointmentEnd = element.appointment_details.appointment_end_time.split(' ');
        let appointmentStartDateSplit = appointmentStart[0].split('-');
        let appointmentEndDateSplit = appointmentEnd[0].split('-');
        let appointmentStartDateTime = appointmentStartDateSplit[1] + "/" + appointmentStartDateSplit[2] + "/" + appointmentStartDateSplit[0] + " " + appointmentStart[1] + " " + appointmentStart[2];
        let appointmentEndDateTime = appointmentEndDateSplit[1] + "/" + appointmentEndDateSplit[2] + "/" + appointmentEndDateSplit[0] + " " + appointmentEnd[1] + " " + appointmentEnd[2];
        element.appointment_details.appointment_start_time = appointmentStartDateTime;
        element.appointment_details.appointment_end_time = appointmentEndDateTime;
      });


      // console.log(data);
      // this._constantsService.consultationUserData = data;

      if(data['consultation_history'].length < 20) this.conHistoryListFull = true;
      this.sortConsultationHistory(data);
      this.loaderSpinConHistory = false;

      // this.apiResponseCount++;
      // if(this.apiResponseCount == 2){
      //   this.isLoading = false;
      // }
    },
    (error: any) => {
      console.log("user data error");
      if (this.errorResponseCount <= 2) {
        this.afterInit();
        this.errorResponseCount++;
      } else {
        this.isLoading = false;
        this.consultationHistoryDashboard = false;
        this.consultationDashboard = false;
        this.isUserAndConsultantDataRetrived = true;

        //make the boolean value true if platform data is failed(do not remove this below valriable)
        // this._constantsService.platformDataFailedToLoad = true;
      }
    }
  );
}

sortConsultationHistory(data: object) {
  let sortedArray = data['consultation_history'] ? data['consultation_history'] : '';
  // sortedArray.sort((a,b) => {
  //   if(b.appointment_details.appointment_start_time.toString() > 
  //     a.appointment_details.appointment_start_time.toString()) return 1;
  //   if(a.appointment_details.appointment_start_time.toString() >
  //     b.appointment_details.appointment_start_time.toString()) return -1;
  //   return 0;
  // });
  if (sortedArray.length > 1) {
    sortedArray.sort((a, b) => {
      let sortA = new Date(a.appointment_details.appointment_start_time).getTime();
      let sortB = new Date(b.appointment_details.appointment_start_time).getTime();
      return sortB - sortA;
    });
  }

  this.consultationHistory = this.consultationHistory.concat(sortedArray);
  if (this.consultationHistory.length > 0) {
    this.consultationHistoryDashboard = true;
    this.consultationDashboard = false;
  } else {
    this.consultationHistoryDashboard = false;
    this.consultationDashboard = true;
  }
}

goToAffiliationDashboard() { 
 
  this.router.navigate(['/affiliated-users']); }

}
