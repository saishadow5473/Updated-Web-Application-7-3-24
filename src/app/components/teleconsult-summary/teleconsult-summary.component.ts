import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ModalComponent } from '../modal/modal.component';
import { ConstantsService } from 'src/app/services/constants.service';
import { TeleConsultService } from 'src/app/services/tele-consult.service';
import { EventEmitterService } from 'src/app/services/event-emitter.service';
import { Observable } from 'rxjs';
import { resolve } from 'url';

// import html2canvas from 'html2canvas';
// import  jsPDF  from 'jsPdf';
// (window as any).html2canvas = html2canvas;

@Component({
    selector: 'app-teleconsult-summary',
    templateUrl: './teleconsult-summary.component.html',
    styleUrls: ['./teleconsult-summary.component.css']
})
export class TeleconsultSummaryComponent implements OnInit {

    constructor(private router: Router,
        private dialog: MatDialog,
        public _constant: ConstantsService,
        private _teleConsultService: TeleConsultService,
        private eventEmitterService: EventEmitterService,) {}

    public consultantName: string;
    public consultantType: string;
    public consultantSpeciality: string;
    public consultantFee: number;
    public consultantInstruction: string;
    public appointmentDuration: any;
    public vendorName: string;
    public vendorID: any;
    public appointmentMode: any;
    public paymentMode: string;
    public appointmentDate: any;
    public startTime: any;
    public endTime: any;
    public followupAvailability: any;
    public diagnosis: string;
    public isLoading: boolean = false;
    public userData:any = JSON.parse(this._constant.aesDecryption('userData'));
    public address:string;
    public area:string;
    public city:string;
    public state:string;
    public pincode:string;
    public userName:string;
    public userMail:string;
    public userAge:any;
    public userGender:any;
    public userMobNumber:any;
    public reasonForVisit : any;
    public appointment_duration : any;
    public call_type : any;
    public vendor_id : any;
    public appointment_start_time : any;
    public appointment_end_time : any;
    public consultation_fees : any;
    public mode_of_payment : any;
    public consultation_advice_notes : any;
    public medication: Array<any> = [];
    public doctor_notes:  Array<any> = [];
    consultantDegree: string = "";
    consultantEmail: string = "";
    consultantMobile: string = "";
    doctorSignature:string = "";
    public medicalAppointmentDate = new Date();
    public doctorDetail:any;
    public prescriptionDataFetch:boolean = false;
    public deductedIgstAmt:any;
    public igstAmt:any;
    public sgstAmt:any;
    public printPrescriptionPage: boolean = false;
    public labTests:any = [];
    public radiologies:any = [];
    public patientDiagnosis: any = [];
    public appointmentId: string | number = "";
    public vitalData: any = undefined;
    public accountId: string | number = "";
    public logoURLForMedPrint: string | number = "";

    //calculate date - getting user friendly date format
    formatDate(start_time, end_time) {
        //calculate startTime & appointmentDate
        let splitDateTime = start_time.toString().split(' ');
        this.appointmentDate = splitDateTime[2] + "-" + splitDateTime[1] + "-" + splitDateTime[3];
        this.startTime = start_time.toLocaleString('en-IN', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        });
        //calculate endTime
        this.endTime = end_time.toLocaleString('en-IN', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        });
        console.log(start_time);
    }

    ngOnInit() {

        this._constant.selectedDoctor = undefined;
        
        setTimeout(() => {
            this._constant.prescriptionPreparation = true;
            this.dialog.open(ModalComponent);
        }, 150);
        this.isLoading = true;
        this._teleConsultService.getConsultationCallSummary().subscribe(async (data) => {
            let parseData = data.replace(/(&quot\;)/g,"\"");
            if(parseData == ""){
                this._constant.prescriptionPreparation = false;
                this.eventEmitterService.onModalClose();
                this.router.navigate(['/teleconsultation']);
                return 0;
            }
            let receivedData = JSON.parse(parseData);
            this.logoURLForMedPrint = "";
            if(receivedData.message.vendor_id == "GENIX"){
                if (receivedData.consultant_details.account_id != null && receivedData.consultant_details.account_id != undefined && receivedData.consultant_details.account_id.trim().length > 0 ) {
                    console.log(receivedData);
                    this.accountId = receivedData.consultant_details.account_id;
                    await (this.PrescriptionLogoUrl()).then((val: any)=>{
                        this.logoURLForMedPrint = val;
                    });
                }
            }

            this._teleConsultService.getDoctorSignature(receivedData.message.ihl_consultant_id).subscribe(data => {
                this.prescriptionDataFetch = true;
                if(data.trim().length > 0){
                    let imageDataObj = JSON.parse(data.replace(/(&quot\;)/g,"\""));
                    //console.log(imageDataObj);
                    this.doctorSignature = "data:"+imageDataObj.ContentType+";base64,"+ imageDataObj.Content;
                    //console.log(this.doctorSignature);
                    if(receivedData.message.vendor_id == "GENIX"){
                        this.getbase64PdfData();
                        this.getbase64PdfLabTemplate();
                    };
                }else{
                    if(receivedData.message.vendor_id == "GENIX"){
                        this.getbase64PdfData();
                        this.getbase64PdfLabTemplate();
                    };
                }
            },
            error => {
                this.prescriptionDataFetch = true;
                console.log(error);
                this.doctorSignature = '';
                if(receivedData.message.vendor_id == "GENIX"){
                    this.getbase64PdfData();
                    this.getbase64PdfLabTemplate();
                };
            });

            let appointmentStart = receivedData.message.appointment_start_time.split(' ');
            let appointmentEnd = receivedData.message.appointment_end_time.split(' ');
            let appointmentStartDateSplit = appointmentStart[0].split('-');
            let appointmentEndDateSplit = appointmentEnd[0].split('-');
            let appointmentStartDateTime = appointmentStartDateSplit[1]+"/"+appointmentStartDateSplit[2]+"/"+appointmentStartDateSplit[0]+" "+appointmentStart[1]+" "+appointmentStart[2];
            let appointmentEndDateTime = appointmentEndDateSplit[1]+"/"+appointmentEndDateSplit[2]+"/"+appointmentEndDateSplit[0]+" "+appointmentEnd[1]+" "+appointmentEnd[2];
            receivedData.message.appointment_start_time = appointmentStartDateTime;
            receivedData.message.appointment_end_time = appointmentEndDateTime;

            console.log(receivedData)
            this.consultantName = receivedData.message.consultant_name;
            this.consultantType = receivedData.message.consultant_type;
            this.consultantSpeciality = receivedData.message.specality;
            this.consultantFee = receivedData.message.consultation_fees;
            this.consultantInstruction = receivedData.message.consultation_advice_notes;
            this.appointmentDuration = receivedData.message.appointment_duration;
            this.vendorName = receivedData.message.vendor_name;
            this.vendorID = receivedData.message.vendor_id;
            this.appointmentMode = receivedData.message.appointment_model;
            this.paymentMode = receivedData.message.mode_of_payment;
            this.followupAvailability = receivedData.message.followup_availablity_till_date;
            this.diagnosis = receivedData.message.diagnosis;
            this.formatDate(new Date(receivedData.message.appointment_start_time), new Date(receivedData.message.appointment_end_time));
            this.isLoading = false;
            this.reasonForVisit = receivedData.message.reason_for_visit;
            this.appointment_duration = this.callDuration(receivedData.message.call_start_time, receivedData.message.call_end_time);
            this.call_type = receivedData.message.call_type;
            this.vendor_id = receivedData.message.vendor_id;
            this.appointment_start_time = receivedData.message.appointment_start_time;
            this.appointment_end_time = receivedData.message.appointment_end_time;
            this.consultation_fees = receivedData.message.consultation_fees;
            this.mode_of_payment = receivedData.message.mode_of_payment;
            this.consultation_advice_notes = receivedData.message.consultation_advice_notes;
            this.consultantDegree = receivedData.consultant_details.education;
            this.consultantEmail = receivedData.consultant_details.consultant_email;
            this.consultantMobile = receivedData.consultant_details.consultant_mobile;
            if(receivedData.message.prescription !== undefined && receivedData.message.prescription !== null && receivedData.message.prescription.length > 0){
                this.medication = receivedData.message.prescription;
                //console.log(this.medication);
            }
            if (receivedData.message.notes != undefined && receivedData.message.notes != null && receivedData.message.notes != "" && receivedData.message.notes.trim().length > 0) {
                //doctor_notes
                //let notes = (receivedData.message.notes).replaceAll(/'\'/g, '.');
                this.doctor_notes = JSON.parse(receivedData.message.notes);
            }
            if(receivedData.message.vendor_id == "GENIX"){
                if (receivedData.message.lab_tests != null && receivedData.message.lab_tests != undefined && receivedData.message.lab_tests.trim().length > 0 ) {
                    if ((JSON.parse(receivedData.message.lab_tests)).length > 0) {
                        this.labTests = JSON.parse(receivedData.message.lab_tests);
                    }
                }
                if (receivedData.message.radiology != null && receivedData.message.radiology != undefined && receivedData.message.radiology.trim().length > 0 ) {
                    if ((JSON.parse(receivedData.message.radiology)).length > 0) {
                        this.radiologies = JSON.parse(receivedData.message.radiology);
                    }
                }
                if (receivedData.message.kiosk_checkin_history != null && receivedData.message.kiosk_checkin_history != undefined && receivedData.message.kiosk_checkin_history.trim().length > 0 ) {
                    let checkin_history = JSON.parse(receivedData.message.kiosk_checkin_history);

                    if (Object.keys(checkin_history).length > 0) {
                        this.vitalData = checkin_history;
                    }
                }
                if (receivedData.med_lab_partner_details.partner_med_name != undefined && receivedData.med_lab_partner_details.partner_med_name != null && receivedData.med_lab_partner_details.partner_med_logo_url != null && receivedData.med_lab_partner_details.partner_med_logo_url != undefined) {
                    this._constant.medicationPartnerDetails = {
                        name: receivedData.med_lab_partner_details.partner_med_name,
                        logo: receivedData.med_lab_partner_details.partner_med_logo_url
                    };
                }else{
                    this._constant.medicationPartnerDetails = {
                        name: "1mg",
                        logo: "assets/img/1mg-logo-large.png"
                    };
                }
                if (receivedData.med_lab_partner_details.partner_lab_name != undefined && receivedData.med_lab_partner_details.partner_lab_name != null && receivedData.med_lab_partner_details.partner_lab_logo_url != null && receivedData.med_lab_partner_details.partner_lab_logo_url != undefined) {
                    this._constant.labPartnerDetails = {
                        name: receivedData.med_lab_partner_details.partner_lab_name,
                        logo: receivedData.med_lab_partner_details.partner_lab_logo_url
                    };
                }else{
                    this._constant.labPartnerDetails = {
                        name: "Astra",
                        logo: "assets/img/astra_logo.jpg"
                    };
                }
                this.patientDiagnosis = receivedData['message'].patient_diagnosis;
            }
            this.appointmentId = receivedData['message'].appointment_id;
            this.medicalAppointmentDate = new Date(receivedData.message.appointment_start_time);
            if (receivedData.message.ihl_consultant_id != null && receivedData.message.ihl_consultant_id!= undefined)  {

               let filterMedicalConsultation = this._constant.consultationPlatformData.consult_type.map(obj => {
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
                            return Obj.ihl_consultant_id == receivedData.message.ihl_consultant_id;
                        }
                    });

                    if (consultantForThisAppointment != undefined) {
                        this.doctorDetail = consultantForThisAppointment;
                    }
                }

                console.log(this.doctorDetail);

            }

        });
        this.loadUserData();
    }

    loadUserData() {
        let firstName = this.userData.firstName;
        let lastName = this.userData.lastName;
        this.userName = `${firstName} ${lastName}`;
        this.address = this.userData.address;
        this.area = this.userData.area;
        this.city = this.userData.city;
        this.state = this.userData.state;
        this.pincode = this.userData.pincode;
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
    }

    calculateAge(birthYear) {
        let currentDate = new Date();
        let currentYear = currentDate.getFullYear();
        this.userAge = currentYear - birthYear;
    }

    buyMedicine() {
        this._constant.buyMedicineOnline = true;
        this.dialog.open(ModalComponent);
    }

    labOrder() {
        this._constant.getLabOrder = true;
        this.dialog.open(ModalComponent);
    }

    printAdvice(value: string) {
        switch(value){
            case 'prescription':{
                this.printPrescriptionPage = true;
                break;
            }
            case 'invoice':{
                this.printPrescriptionPage = false;
                if (this.vendorName != 'IHL' ) {
                    this.deductedIgstAmt = (this.consultantFee / 1.18).toFixed(2);
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

    printPrescription() {
        // let html_template = document.getElementById('prescriptionContent');
        // html2canvas(html_template).then(canvas=>{
        //   let contentDataUrl = canvas.toDataURL('image/png');
        //   let pdf = new jsPdf();
        //   pdf.addImage(contentDataUrl,'PNG',0,0);
        //   console.log('Starting');
        //   // pdf.addHTML(html_template, function save(){
        //   //   console.log('Printing');
        //   //   pdf.output("dataurlnewwindow");
        //   //   console.log('Done');
        //   // });
        //   // pdf.html(html_template,{
        //   //   callback:function(){
        //   //     console.log('Printing');
        //       (window as any).PDF_ = pdf;
        //       pdf.setProperties({
        //         title: 'Perscription',
        //         subject: 'Info about PDF',
        //         author: 'IHL',
        //         keywords: 'perscription',
        //         creator: 'IHL'
        //       });
        //       window.open(URL.createObjectURL(pdf.output('blob')));
        //     // },
        //   // });
        //   // pdf.output("dataurlnewwindow");
        //   // window.open(URL.createObjectURL(pdf.output("blob")))
        // });

        // html2canvas(html_template).then((canvas)=>{
        //    var img=canvas.toDataURL("image/png");
        //    var doc = new jsPDF();
        //       (window as any).PDF_ = doc;
        //    doc.addImage(img,'JPEG',20,20);
        //    // doc.output('dataurlnewwindow');
        //     window.open(URL.createObjectURL(doc.output("blob")))

        //    });

        // // let pdf = new jsPdf();
        // (window as any).PDF_ = pdf;

        // pdf.fromHTML(html_template,0,0,{width:100});
        // window.open(URL.createObjectURL(pdf.output('blob')));
        // // pdf.output('blob');
        setTimeout(() => {
            window.print();
        }, 1000);
    }
    showTeleDashboard(){
        if(this._constant.teleconsultationFlowSelected == 'affiliate'){
            this.router.navigate(['/affiliated-users']);
        }else{
            this.router.navigate(['/teleconsultation']);
        }
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

    callDuration(start, end){
        if(this._constant.ihlBaseurl != "https://azureapi.indiahealthlink.com/"){
            //allign date format to support all browsers & get milliseconds to calculate call duration
            try{
                if(start == undefined || start == null || end == undefined || end == null) throw "N/A";
            }catch(err){
                return err;
            }

            if (start.indexOf(',') > -1 || end.indexOf(',') > -1 ||  start.search(/am/i) > -1 || start.search(/pm/i) > -1 || end.search(/am/i) > -1  || end.search(/pm/i) > -1 || start.indexOf('/') > -1 || end.indexOf('/') > -1) {
                return "N/A";
            }
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
        if(this.appointment_start_time != undefined && this.appointment_start_time != null){
            return new Date(this.appointment_start_time).getTime();
        }else{
            return 'N/A';
        }
    }

    async getbase64PdfData(){
        let content = document.getElementById('genixPrescriptionShareSummaryContainer').innerHTML;
        let html_template = "<!DOCTYPE html><html><body style='box-sizing: border-box;'>" + content + "</body></html>";
        let jsonData: any = {
            "htmlstring": html_template
        };
        jsonData = JSON.stringify(jsonData);
        const promise_base64 = ()=> {
            return new Promise((resolve, reject)=>{
                this._teleConsultService.getbase64Pdf(jsonData).subscribe((data)=>{
                    console.log(data);
                    this._constant.prescriptionObjectFor1mg = data;
                    this._constant._is_base64_pdf_available = true;
                    resolve("success_base64");
                },
                (error)=>{
                    this._constant.prescriptionObjectFor1mg = "";
                    this._constant._is_base64_pdf_available = false;
                    resolve("error_base64");
                })
            });
        }
        await promise_base64().then(val=>{
            console.log(val);
            this.sharePerscription();
        })
    };

    getbase64PdfLabTemplate(){
        let content = document.getElementById('genixLabOrderShareSummaryContainer').innerHTML;
        let html_template = "<!DOCTYPE html><html><body style='box-sizing: border-box;'>" + content + "</body></html>";
        let jsonData: any = {
            "htmlstring": html_template
        };
        jsonData = JSON.stringify(jsonData);

        this._teleConsultService.getbase64Pdf(jsonData).subscribe((data)=>{
          console.log(data);
          this._constant.labObjectFor1mg = data;
          this._constant._is_base64_lab_pdf_available = true;
        },
        (error)=>{
          this._constant.labObjectFor1mg = "";
          this._constant._is_base64_lab_pdf_available = false;
        })
    }

    PrescriptionLogoUrl(){
        let account_id = this.accountId || "123456";
        let logo = this._constant.externalBaseURL+"affiliate_logo/ihl-plus.png";
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
            this._teleConsultService.getPrescriptionLogoUrl(account_id.toString()).subscribe((data) => {
                success(data);
            },(err) => {
                error(err);
            },
            ()=>{
                console.log("log0 arrived");
            });
        })
    }

    sharePerscription(){
        let prescriptionObject = this._constant.prescriptionObjectFor1mg;
        let userDetails = JSON.parse(this._constant.aesDecryption("userData"));
        let salt = "f1nd1ngn3m0";

        let patientFirstName = "";
        let patientLastName = "";
        let patientEmail = "";
        let patientMobileNumber = "";

        patientFirstName = (userDetails.firstName != undefined && userDetails.firstName != null && userDetails.firstName.trim().length > 0) ? userDetails.firstName : "";
        patientLastName =  (userDetails.lastName != undefined && userDetails.lastName != null && userDetails.lastName.trim().length > 0) ? userDetails.lastName : "";
        patientEmail = (userDetails.email != undefined && userDetails.email != null && userDetails.email.trim().length > 0) ? userDetails.email : "";
        patientMobileNumber = (userDetails.mobileNumber != undefined && userDetails.mobileNumber != null && userDetails.mobileNumber.trim().length == 10) ? userDetails.mobileNumber : "";

        let dataToFindHash = patientEmail + patientMobileNumber + salt;

        let encodedPrescription = prescriptionObject;
        let stringHash = this.SHA256(dataToFindHash);
        //console.log(encodedPrescription);
        //console.log(stringHash);

        let affiliteUniqueName;
        if (this._constant.teleconsultationFlowSelected && this._constant.teleconsultationFlowSelected == "affiliate") {
          if (this._constant.appointmentDetails != undefined && this._constant.appointmentDetails != null) {
            if (this._constant.appointmentDetails.affilation_excusive_data != undefined && this._constant.appointmentDetails.affilation_excusive_data != null) {
              if (this._constant.appointmentDetails.affilation_excusive_data.affilation_array[0] != undefined && this._constant.appointmentDetails.affilation_excusive_data.affilation_array[0] != null) {
                affiliteUniqueName = this._constant.appointmentDetails.affilation_excusive_data.affilation_array[0].affilation_unique_name;
              }
            }
          }
        }

        let prescriptionObjectWithDetails = {
          "first_name": patientFirstName,
          "last_name": patientLastName,
          "email": patientEmail,
          "mobile": patientMobileNumber,
          "prescription_number": this._constant.printInvoiceNumberForTeleconsultation || "N/A",
          "prescription_base64": encodedPrescription.toString(),
          "security_hash": stringHash.toString(),
          "kiosk_id": "",
          "affiliation_unique_name": affiliteUniqueName || "global_services",
          "order_type": "user",
          "affiliation_code": ""
        }

        console.log(prescriptionObjectWithDetails);
        //debugger;
        this._teleConsultService.sharePrescriptionTo1mg(JSON.stringify(prescriptionObjectWithDetails)).subscribe((data)=>{
          console.log(data);
        },
        (err)=>{
          console.log(err);
        })
    }

    //code of SHA256 function
    SHA256 = function(s){
        var chrsz=8;var hexcase=0;function safe_add(x,y){var lsw=(x&0xFFFF)+(y&0xFFFF);var msw=(x>>16)+(y>>16)+(lsw>>16);return(msw<<16)|(lsw&0xFFFF);}
        function S(X,n){return(X>>>n)|(X<<(32-n));}
        function R(X,n){return(X>>>n);}
        function Ch(x,y,z){return((x&y)^((~x)&z));}
        function Maj(x,y,z){return((x&y)^(x&z)^(y&z));}
        function Sigma0256(x){return(S(x,2)^S(x,13)^S(x,22));}
        function Sigma1256(x){return(S(x,6)^S(x,11)^S(x,25));}
        function Gamma0256(x){return(S(x,7)^S(x,18)^R(x,3));}
        function Gamma1256(x){return(S(x,17)^S(x,19)^R(x,10));}
        function core_sha256(m,l){var K=new Array(0x428A2F98,0x71374491,0xB5C0FBCF,0xE9B5DBA5,0x3956C25B,0x59F111F1,0x923F82A4,0xAB1C5ED5,0xD807AA98,0x12835B01,0x243185BE,0x550C7DC3,0x72BE5D74,0x80DEB1FE,0x9BDC06A7,0xC19BF174,0xE49B69C1,0xEFBE4786,0xFC19DC6,0x240CA1CC,0x2DE92C6F,0x4A7484AA,0x5CB0A9DC,0x76F988DA,0x983E5152,0xA831C66D,0xB00327C8,0xBF597FC7,0xC6E00BF3,0xD5A79147,0x6CA6351,0x14292967,0x27B70A85,0x2E1B2138,0x4D2C6DFC,0x53380D13,0x650A7354,0x766A0ABB,0x81C2C92E,0x92722C85,0xA2BFE8A1,0xA81A664B,0xC24B8B70,0xC76C51A3,0xD192E819,0xD6990624,0xF40E3585,0x106AA070,0x19A4C116,0x1E376C08,0x2748774C,0x34B0BCB5,0x391C0CB3,0x4ED8AA4A,0x5B9CCA4F,0x682E6FF3,0x748F82EE,0x78A5636F,0x84C87814,0x8CC70208,0x90BEFFFA,0xA4506CEB,0xBEF9A3F7,0xC67178F2);var HASH=new Array(0x6A09E667,0xBB67AE85,0x3C6EF372,0xA54FF53A,0x510E527F,0x9B05688C,0x1F83D9AB,0x5BE0CD19);var W=new Array(64);var a,b,c,d,e,f,g,h,i,j;var T1,T2;m[l>>5]|=0x80<<(24-l % 32);m[((l+64>>9)<<4)+15]=l;for(let i=0;i<m.length;i+=16){a=HASH[0];b=HASH[1];c=HASH[2];d=HASH[3];e=HASH[4];f=HASH[5];g=HASH[6];h=HASH[7];for(let j=0;j<64;j++){if(j<16)W[j]=m[j+i];else W[j]=safe_add(safe_add(safe_add(Gamma1256(W[j-2]),W[j-7]),Gamma0256(W[j-15])),W[j-16]);T1=safe_add(safe_add(safe_add(safe_add(h,Sigma1256(e)),Ch(e,f,g)),K[j]),W[j]);T2=safe_add(Sigma0256(a),Maj(a,b,c));h=g;g=f;f=e;e=safe_add(d,T1);d=c;c=b;b=a;a=safe_add(T1,T2);}
        HASH[0]=safe_add(a,HASH[0]);HASH[1]=safe_add(b,HASH[1]);HASH[2]=safe_add(c,HASH[2]);HASH[3]=safe_add(d,HASH[3]);HASH[4]=safe_add(e,HASH[4]);HASH[5]=safe_add(f,HASH[5]);HASH[6]=safe_add(g,HASH[6]);HASH[7]=safe_add(h,HASH[7]);}
        return HASH;}
        function str2binb(str){var bin=Array();var mask=(1<<chrsz)-1;for(var i=0;i<str.length*chrsz;i+=chrsz){bin[i>>5]|=(str.charCodeAt(i/chrsz)&mask)<<(24-i % 32);}
        return bin;}
        function Utf8Encode(string){string=string.replace(/\r\n/g,'\n');var utftext='';for(var n=0;n<string.length;n++){var c=string.charCodeAt(n);if(c<128){utftext+=String.fromCharCode(c);}
        else if((c>127)&&(c<2048)){utftext+=String.fromCharCode((c>>6)|192);utftext+=String.fromCharCode((c&63)|128);}
        else{utftext+=String.fromCharCode((c>>12)|224);utftext+=String.fromCharCode(((c>>6)&63)|128);utftext+=String.fromCharCode((c&63)|128);}}
        return utftext;}
        function binb2hex(binarray){var hex_tab=hexcase?'0123456789ABCDEF':'0123456789abcdef';var str='';for(var i=0;i<binarray.length*4;i++){str+=hex_tab.charAt((binarray[i>>2]>>((3-i % 4)*8+4))&0xF)+
        hex_tab.charAt((binarray[i>>2]>>((3-i % 4)*8))&0xF);}
        return str;}
        s=Utf8Encode(s);return binb2hex(core_sha256(str2binb(s),s.length*chrsz));
    }

}
