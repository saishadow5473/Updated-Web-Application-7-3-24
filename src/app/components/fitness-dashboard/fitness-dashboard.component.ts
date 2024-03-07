import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TeleConsultService } from '../../services/tele-consult.service';
import { ConstantsService } from '../../services/constants.service';
import { GlobalCdnService } from '../../services/global-cdn.service'

@Component({
  selector: 'app-fitness-dashboard',
  templateUrl: './fitness-dashboard.component.html',
  styleUrls: ['./fitness-dashboard.component.css']
})
export class FitnessDashboardComponent implements OnInit {
  
  consultationHistory: any
  consultationDashboard: boolean = false;
  consultationHistoryDashboard: boolean = false;
  apiResponseCount:number = 0;
  isLoading:boolean = true;
  consultationPlatformData:any;
  errorResponseCount: number = 0;
  isUserAndConsultantDataRetrived: boolean = false;
  brand_image_url_exist:boolean = false;
  brand_image_url:string = '';
  headerName:string = 'Wellness Care E-Marketplace';

  constructor(
    private router: Router, 
    private _teleConsultService: TeleConsultService,
    private _constantsService: ConstantsService,
    private globalCdn: GlobalCdnService
  ) { }

  ngOnInit() {

    this.globalCdn.load('autobahn');

    if(this._constantsService.teleconsultationFlowSelected == 'affiliate') {
      //this.headerName = this._constantsService.teleconsultationAffiliationSelectedName+' - Health Consultation';
      if(this._constantsService.teleconsultationAffiliationSelectedCompanyImg != '') {
        this.brand_image_url_exist = true;
        this.brand_image_url = this._constantsService.teleconsultationAffiliationSelectedCompanyImg;
      }
      this.headerName = 'Affiliate Wellness Care E-Marketplace';
    } else {
      this.headerName = 'Wellness Care E-Marketplace';
    }
    this.afterInit();
  }

  afterInit(){
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
      
    let userData = JSON.parse(this._constantsService.aesDecryption("userData"));
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
      this.callTeleConsultDashboardAPIs();
    }
    else {
      // this.sortConsultationHistory(this._constantsService.consultationUserData);
      this.callTeleConsultDashboardAPIs();
      // this.isLoading = false;
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
  }

  MySubscriptions() {
    this.router.navigate(['/mysubscription']);
  }

  selectSpeciality(consultation_type_name){
    this._constantsService.teleConsultType = consultation_type_name; //reset the value
    this._constantsService.teleConsultPageFlow.push(consultation_type_name);
    var consultantObj = {"ct":consultation_type_name , "st":""};
    localStorage.setItem("consultantDataObj" , this._constantsService.aesEncryption(JSON.stringify(consultantObj)));
    this.router.navigate(['/teleconsult-speciality']);
  }

  selectKtAndFunSpeciality(){
    this._constantsService.teleConsultType = 'Fitness Class'; //reset the value
    this._constantsService.teleConsultPageFlow.push('Fitness Class');
    var consultantObj = {"ct":'Fitness Class' , "st":"Corporate Wellness"};
    localStorage.setItem("consultantDataObj" , this._constantsService.aesEncryption(JSON.stringify(consultantObj)));
    this.router.navigate(['/subscribe-online-classes']);
  }

  callTeleConsultDashboardAPIs() {
    let userData = JSON.parse(this._constantsService.aesDecryption("userData"));
    this._teleConsultService.getTeleConsultUserData(userData.id).subscribe(
      data=>{
        data['appointments'].forEach(element => {//appointment_start_time: "2020-12-15 07:00 PM" appointment_end_time: "2020-12-15 07:30 PM"
          let appointmentStart = element.appointment_start_time.split(' ');
          let appointmentEnd = element.appointment_end_time.split(' ');
          let appointmentStartDateSplit = appointmentStart[0].split('-');
          let appointmentEndDateSplit = appointmentEnd[0].split('-');
          let appointmentStartDateTime = appointmentStartDateSplit[1]+"/"+appointmentStartDateSplit[2]+"/"+appointmentStartDateSplit[0]+" "+appointmentStart[1]+" "+appointmentStart[2];
          let appointmentEndDateTime = appointmentEndDateSplit[1]+"/"+appointmentEndDateSplit[2]+"/"+appointmentEndDateSplit[0]+" "+appointmentEnd[1]+" "+appointmentEnd[2];
          element.appointment_start_time = appointmentStartDateTime;
          element.appointment_end_time = appointmentEndDateTime;
        });

        data['consultation_history'].forEach(element => {//appointment_start_time: "2020-12-15 07:00 PM" appointment_end_time: "2020-12-15 07:30 PM"
          let appointmentStart = element.appointment_details.appointment_start_time.split(' ');
          let appointmentEnd = element.appointment_details.appointment_end_time.split(' ');
          let appointmentStartDateSplit = appointmentStart[0].split('-');
          let appointmentEndDateSplit = appointmentEnd[0].split('-');
          let appointmentStartDateTime = appointmentStartDateSplit[1]+"/"+appointmentStartDateSplit[2]+"/"+appointmentStartDateSplit[0]+" "+appointmentStart[1]+" "+appointmentStart[2];
          let appointmentEndDateTime = appointmentEndDateSplit[1]+"/"+appointmentEndDateSplit[2]+"/"+appointmentEndDateSplit[0]+" "+appointmentEnd[1]+" "+appointmentEnd[2];
          element.appointment_details.appointment_start_time = appointmentStartDateTime;
          element.appointment_details.appointment_end_time = appointmentEndDateTime;
        });


        console.log(data);
        this._constantsService.consultationUserData = data;

        // this.sortConsultationHistory(data);

        // this.apiResponseCount++;
        // if(this.apiResponseCount == 2){
        //   this.isLoading = false;
        // }

        this._teleConsultService.getTeleConsultUserPlatformData(userData.id).subscribe(
          data=>{
            this._constantsService.consultationPlatformData = data;
      
            let consultationTypes = this._constantsService.consultationPlatformData.consult_type.filter(obj =>{
              return obj['consultation_type_name'] === "Fitness Class";
            });
            console.log(consultationTypes);
            this.consultationPlatformData = consultationTypes;
            this._constantsService.fitnessDashboardObj = consultationTypes;
            // this.apiResponseCount++;
            // if(this.apiResponseCount == 2){
            //   this.isLoading = false;
            // }
            this.isLoading = false;
            this._constantsService.telePlatformDataFirstTimeCall = true;
          },
          (error: any) => {
            console.log("Platform data error");
            if (this.errorResponseCount <= 2) {
              this.afterInit();
              this.errorResponseCount++;
            }else{
              this.isLoading = false;
              this.consultationHistoryDashboard = false;
              this.consultationDashboard = false;
              this.isUserAndConsultantDataRetrived = true;
              
              //make the boolean value true if platform data is failed(do not remove this below valriable)
              this._constantsService.platformDataFailedToLoad = true;
            }
          }
        );
      },
      (error: any) => {
        console.log("user data error");
        if (this.errorResponseCount <= 2) {
          this.afterInit();
          this.errorResponseCount++;
        }else{
          this.isLoading = false;
          this.consultationHistoryDashboard = false;
          this.consultationDashboard = false;
          this.isUserAndConsultantDataRetrived = true;

          //make the boolean value true if platform data is failed(do not remove this below valriable)
          this._constantsService.platformDataFailedToLoad = true;
        }
      }
    );
  }

  sortConsultationHistory(data:object) {
    let sortedArray = data['consultation_history'];
    // sortedArray.sort((a,b) => {
    //   if(b.appointment_details.appointment_start_time.toString() > 
    //     a.appointment_details.appointment_start_time.toString()) return 1;
    //   if(a.appointment_details.appointment_start_time.toString() >
    //     b.appointment_details.appointment_start_time.toString()) return -1;
    //   return 0;
    // });
    if (sortedArray.length > 1) {
      sortedArray.sort((a,b) => {
        let sortA = new Date(a.appointment_details.appointment_start_time).getTime();
        let sortB = new Date(b.appointment_details.appointment_start_time).getTime();
        return sortB - sortA;
      });
    }

    this.consultationHistory = sortedArray
    if(this.consultationHistory.length > 0){
      this.consultationHistoryDashboard = true;
      this.consultationDashboard = false;
    } else {
      this.consultationHistoryDashboard = false;
      this.consultationDashboard = true;
    }
  }


}
