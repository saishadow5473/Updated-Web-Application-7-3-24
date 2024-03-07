import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { Router } from '@angular/router';
import { TeleConsultService } from '../../services/tele-consult.service';
import { ConstantsService } from '../../services/constants.service';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-consultation-details-view',
  templateUrl: './consultation-details-view.component.html',
  styleUrls: ['./consultation-details-view.component.css']
})
export class ConsultationDetailsViewComponent implements OnInit  {
  userName: any;
  userMail: any;
  userMobNumber: any;
  userGender: any;
  userAge: any;
  public address:string;
  public area:string;
  public city:string;
  public state:string;
  public pincode:string;
  doctorSignature:string = "";
  consultantSignatureResponse: boolean = false;
  public deductedIgstAmt:any;
  public igstAmt:any;
  public sgstAmt:any;
  public printPrescriptionPage: boolean = false;
  public labTests:any = [];
  public radiologies:any = [];
  public symptoms: any = [];
  public consultant_email:any = '';
  public patientDiagnosis:any = [];
  public appointmentId: string | number = "";
  public vitalData: any = undefined;
  public accountId: string | number = "";
  public logoURLForMedPrint: string | number = "";
  public doctor_notes:  Array<any> = [];
  public genixFooter:boolean = false;

  constructor(private router: Router,
    private _teleConsultService: TeleConsultService,
    private _constantsService: ConstantsService,
    private dialog: MatDialog) { }

    consultDetail:any = null;
    userData: any;
    doctorDetail: any;
    medicalAppointmentDate: any;

  ngOnInit() {
    // console.log(this._constantsService.getTeleConsulationHistory);
    this.userData = JSON.parse(this._constantsService.aesDecryption('userData'));
    //this._constantsService.getTeleConsulationHistory = JSON.parse(localStorage.getItem("historyDetail"));
    if(this._constantsService.getTeleConsulationHistory == null){
      this.router.navigate(['/teleconsultation']);
    } else {
      // data bind logic
      this.consultDetail = this._constantsService.getTeleConsulationHistory;
      if (this.consultDetail.consultant_details.vendor_id != 'IHL') {

        if (this.consultDetail.lab != null && this.consultDetail.lab != undefined && this.consultDetail.lab.length > 0 ) {
          this.labTests = this.consultDetail.lab;
        }

        if (this.consultDetail.consultant_details.consultant_details.email != null && this.consultDetail.consultant_details.consultant_details.email != undefined && this.consultDetail.consultant_details.consultant_details.email.length > 0 ) {
          if(this.consultDetail.consultant_details.consultant_details.email.match(/^w+([.-]?w+)*@w+([.-]?w+)*(.w{2,3})+$/)){
            this.consultant_email = this.consultDetail.consultant_details.consultant_details.email;
          }
        }

        if (this.consultDetail.radiology != null && this.consultDetail.radiology != undefined && this.consultDetail.radiology.length > 0 ) {
          this.radiologies = this.consultDetail.radiology;
        }

        if (this.consultDetail.consultant_notes.symptoms != null && this.consultDetail.consultant_notes.symptoms != undefined && this.consultDetail.consultant_notes.symptoms.length > 0 ) {
          this.symptoms = this.consultDetail.consultant_notes.symptoms;
        }

        if (this.consultDetail.diagnosis != null && this.consultDetail.diagnosis != undefined && this.consultDetail.diagnosis.length > 0 ) {
          this.patientDiagnosis = this.consultDetail.diagnosis;
        }

        if (this.consultDetail.user_data.kiosk_checkin_history != null && this.consultDetail.user_data.kiosk_checkin_history != undefined && this.consultDetail.user_data.kiosk_checkin_history.length > 0 ) {
          let checkin_history = JSON.parse(this.consultDetail.user_data.kiosk_checkin_history);

          if (Object.keys(checkin_history).length > 0) {
              this.vitalData = checkin_history;
          }
        }

        if (this.consultDetail.consultant_notes.notes != undefined && this.consultDetail.consultant_notes.notes != null && this.consultDetail.consultant_notes.notes.toString().trim().length >0) {
          this.doctor_notes = JSON.parse(this.consultDetail.consultant_notes.notes.replace(/&quot;/g, '"'));
        }

        this.logoURLForMedPrint = "";
        if (this.consultDetail.consultant_details != undefined && this.consultDetail.consultant_details != null) {
          if (this.consultDetail.consultant_details.consultant_details != undefined && this.consultDetail.consultant_details.consultant_details != null) {

            if (this.consultDetail.consultant_details.consultant_details.account_id != null && this.consultDetail.consultant_details.consultant_details.account_id != undefined && this.consultDetail.consultant_details.consultant_details.account_id.length > 0 ) {
              this.accountId = this.consultDetail.consultant_details.consultant_details.account_id;
              (async () => {
                await (this.PrescriptionLogoUrl()).then((val: any)=>{
                  this.logoURLForMedPrint = val;
                });
              })();
            }
          }
        }
      }

      this.appointmentId = this.consultDetail.appointment_id;
      this.medicalAppointmentDate = new Date(this.consultDetail.appointment_details.appointment_start_time);
      if (this.consultDetail.consultant_details.ihl_consultant_id != null && this.consultDetail.consultant_details.ihl_consultant_id != undefined)  {

        let filterMedicalConsultation = this._constantsService.consultationPlatformData.consult_type.map(obj => {
          if (obj.consultation_type_name == "Medical Consultation" || obj.consultation_type_name == "Health Consultation") {
            return obj.specality;
          }
        });
        if (filterMedicalConsultation.length > 0) {
          let mergeFilterMedicalConsultation =  [].concat.apply([], filterMedicalConsultation);

          let overAllMedicalConsultantList =  mergeFilterMedicalConsultation.map(Obj => {
            if (Obj != undefined) {
              return Obj.consultant_list;
            }
          });

          let mergedOverAllMedicalConsultantList = [].concat.apply([], overAllMedicalConsultantList);

          let consultantForThisAppointment = mergedOverAllMedicalConsultantList.find(Obj => {
            if (Obj != undefined) {
              return Obj.ihl_consultant_id == this.consultDetail.consultant_details.ihl_consultant_id;
            }
          });

          if (consultantForThisAppointment != undefined) {
            this.doctorDetail = consultantForThisAppointment;
          }
        }

        console.log(this.doctorDetail);

        this._teleConsultService.getDoctorSignature(this.consultDetail.consultant_details.ihl_consultant_id).subscribe(data => {
          // console.log(data);
          this.consultantSignatureResponse = true;
          if(data.trim().length > 0){
            let imageDataObj = JSON.parse(data.replace(/(&quot\;)/g,"\""));
            //console.log(imageDataObj);
            this.doctorSignature = "data:"+imageDataObj.ContentType+";base64,"+ imageDataObj.Content;
            //console.log(this.doctorSignature);
            if(this.consultDetail.consultant_details.vendor_id == "GENIX"){
              //alert(this.consultDetail.consultant_details.vendor_id);
              this.getbase64PdfData();
            };
          }else{
            if(this.consultDetail.consultant_details.vendor_id == "GENIX"){
              //alert(this.consultDetail.consultant_details.vendor_id);
              this.getbase64PdfData();
            };
          }
        }, error => {
          console.log(error);
          this.doctorSignature = '';
          this.consultantSignatureResponse = true;
          if(this.consultDetail.consultant_details.vendor_id == "GENIX"){
            //alert(this.consultDetail.consultant_details.vendor_id);
            this.getbase64PdfData();
          }
        });

      }
    }
    this.loadUserData();
  }

  loadUserData() {
    let firstName = this.userData.firstName;
    let lastName = this.userData.lastName;
    this.userName = `${firstName} ${lastName}`;
    this.userMail = this.userData.email;
    this.userMobNumber = this.userData.mobileNumber;
    let birthYear = this.userData.dateOfBirth.split('/')[2];
    this.calculateAge(parseInt(birthYear));
    if(this.userData.gender == 'm') {
        this.userGender = 'Male';
    }
    else if(this.userData.gender == 'f') {
        this.userGender = 'Female';
    }
    this.address = this.userData.address;
    this.area = this.userData.area;
    this.city = this.userData.city;
    this.state = this.userData.state;
    this.pincode = this.userData.pincode;
  }

  calculateAge(birthYear) {
      let currentDate = new Date();
      let currentYear = currentDate.getFullYear();
      this.userAge = currentYear - birthYear;
  }

  transform(time: any): any {
    let hour = (time.split(':'))[0]
    let min = (time.split(':'))[1]
    let part = hour > 12 ? 'pm' : 'am';
    min = (min+'').length == 1 ? `0${min}` : min;
    hour = hour > 12 ? hour - 12 : hour;
    hour = (hour+'').length == 1 ? `0${hour}` : hour;
    return `${hour}:${min} ${part}`
  }

  printAdvice(value: string) {
    switch(value){
      case 'prescription':{
        this.printPrescriptionPage = true;
        break;
      }
      case 'invoice':{
        this.printPrescriptionPage = false;
        if (this.consultDetail.consultant_details.vendor_id != 'IHL' ) {
          this.deductedIgstAmt = (this.consultDetail.call_details.consultation_fees / 1.18).toFixed(2);
          this.igstAmt =  (this.deductedIgstAmt * 18 / 100).toFixed(2);
          this.sgstAmt = (this.deductedIgstAmt * 9 / 100).toFixed(2);
        }
        break;
      }
      default:{
        console.log("No case matches to print");
        return 0;
      }
    }
    setTimeout(() => {
      window.print();
    }, 1000);
  }

  onBack(): void {
    this.router.navigate(['/teleconsultation']);
  }

  callDuration(start, end){
    if(this._constantsService.ihlBaseurl != "https://azureapi.indiahealthlink.com/"){
      //allign date format to support all browsers & get milliseconds to calculate call duration
      try{
        if(start == undefined || start == null || end == undefined || end == null) throw "N/A";
      }catch(err){
        return err;
      }

      // if (start.indexOf(',') > -1 || end.indexOf(',') > -1 ||  start.search(/am/i) > -1 || start.search(/pm/i) > -1 || end.search(/am/i) > -1  || end.search(/pm/i) > -1 || start.indexOf('/') > -1 || end.indexOf('/') > -1) {
      //   console.log('N/A');
      //   return "N/A";
      // }
      let startTimeSplit = start.split(' ');
      let endTimeSplit = end.split(' ');
      let startDateSplit = startTimeSplit[0].split('-');
      let endDateSplit = endTimeSplit[0].split('-');
      let startDateFormat = startDateSplit[2]+"-"+startDateSplit[1]+"-"+startDateSplit[0];
      let endDateFormat =endDateSplit[2]+"-"+endDateSplit[1]+"-"+endDateSplit[0];
      let TimeDifference = new Date(endDateFormat+' '+endTimeSplit[1]).getTime() - new Date(startDateFormat+' '+startTimeSplit[1]).getTime();

      //Convert milliseconds to minutes & seconds.
      let minutes = Math.floor(TimeDifference / 60000).toString();
      let seconds = ((TimeDifference % 60000) / 1000).toFixed(0);
      ///return minutes + ":" + ((seconds < 10) ? '0' : '') + seconds;
      return `${minutes.padStart(2,'0')}m ${seconds.padStart(2,'0')}s`;
    }else{
      try{
      if(start == undefined || start == null || end == undefined || end == null) throw "N/A";
      }catch(err){
      return err;
      }
      let TimeDifference = new Date(end).getTime() - new Date(start).getTime();

      //Convert milliseconds to minutes & seconds.
      let minutes = Math.floor(TimeDifference / 60000).toString();
      let seconds = ((TimeDifference % 60000) / 1000).toFixed(0);
      ///return minutes + ":" + ((seconds < 10) ? '0' : '') + seconds;
      return `${minutes.padStart(2,'0')}m ${seconds.padStart(2,'0')}s`;
    }
  }

  parseConsultationNotes(value: string): Array<any>{
    let parsedValue: any = JSON.parse(value.replace(/&quot;/g, '"'));
    return parsedValue;
  }

  parseConsultationComplaints(value: string): Array<any>{
    let parsedValue: any = JSON.parse(value.toString().replace(/&quot;/g, '"'));
    return parsedValue;
  }

  buyMedicine() {
    this._constantsService.buyMedicineOnline = true;
    this.dialog.open(ModalComponent);
  }

  /**
  * @description The below Functionality is to fine tune the doctor name and qulaification because qualification also added with doctor name
  * @param doctorname - name of the doctor.
  * @param qualification - qualification of doctor.
  */
  doctorNameAndQualification(doctorname: string, qualification: string): string{

    let name = ((doctorname).trim()).split(" ");
    let prefix = name[0];
    if(prefix.substr(0, 2) == "Dr") {
      prefix = "Dr.";
    } else {
      prefix = name[0];
    }
    let doctorName = "";
    for(let i = 0; name.length > i; i++ ) {
      if(i == 0){
        doctorName = prefix;
      }  else {
        doctorName = doctorName + " " + name[i];
      }
    }
    doctorname = doctorName;

    if (qualification != undefined && qualification != null) {
      if(qualification.trim().length > 0){
        if (doctorname.indexOf(qualification) > -1) {
          return `${doctorname}`;
        }else{
          return `${doctorname} ${qualification}`;
        }
      }else{
        return `${doctorname}`;
      }
    }else{
      return `${doctorname}`;
    }
  }

  /**
  * @description Splitting Appointment Date for print invoice
  * @returns
  */
  appoinmentDate(): (string | number){
    if(this.consultDetail.appointment_details.appointment_start_time != undefined && this.consultDetail.appointment_details.appointment_start_time != null){
      return new Date(this.consultDetail.appointment_details.appointment_start_time).getTime();
    }else{
      return 'N/A';
    }
  }

  getbase64PdfData(){
    let content = document.getElementById('genixPrescriptionShareContainer').innerHTML;
    let html_template = "<!DOCTYPE html><html><body style=' box-sizing: border-box;'>" + content + "</body></html>";
    let jsonData: any = {
        "htmlstring": html_template
    };
    jsonData = JSON.stringify(jsonData);

    this._teleConsultService.getbase64Pdf(jsonData).subscribe((data)=>{

      this._constantsService.prescriptionObjectFor1mg = data;
      this._constantsService._is_base64_pdf_available = true;
    },
    (error)=>{
      this._constantsService.prescriptionObjectFor1mg = "";
      this._constantsService._is_base64_pdf_available = false;
    })
  };

  PrescriptionLogoUrl(){
    let account_id = this.accountId || "123456";
    let logo = this._constantsService.externalBaseURL+"affiliate_logo/ihl-plus.png";
    return new Promise((resolve, reject)=>{
        let success = (res) =>{
            //console.log(res);
            if (res == "invalid accountId") {
              resolve(logo);
            }else{
              resolve(res);
            }
        }

        let error = (err) =>{
            //console.log(err);
            resolve(logo);
        }

        if(this.consultDetail.consultant_details.vendor_id == 'GENIX'){
          if(account_id == '499935c5-01a7-4b39-b7e2-bf08b5e787eb'){
            this.genixFooter = true;
          }else{
            this.genixFooter = false;
          }
          this._teleConsultService.getgenixPrescriptionLogoUrl(account_id.toString()).subscribe((data)=>{
            data = data.logo_list[0];
            var image = new Image();
            image.src = 'data:image/png;base64,'+data;
            success(image.src);
          },(err)=>{
            error(err);
          },
          ()=>{
            console.log("log0 arrived");
          });
        }else{
          this._teleConsultService.getPrescriptionLogoUrl(account_id.toString()).subscribe((data) => {
            success(data);
          },(err) => {
             error(err);
          },
          ()=>{
            console.log("log1 arrived");
          });
        }     
    })
  }

}

