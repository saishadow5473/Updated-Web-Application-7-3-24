import { Injectable } from '@angular/core';
import * as contracts from "../contracts/joint-account-contracts";
import * as CryptoJS from 'crypto-js';
import { empty } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConstantsService {
  public openModal: any
  public processingContent: any
  public selectedProgram: any
  public userPassword: any
  public wrongInformation: any
  public programIsWaiting: any
  public loggedInMetricsObject:any
  // public affiliatedUsersOverAllDatas: any
  // public affiliatedUsersLastCheckinDatas: any
  // public affiliatedUsersMeasurementOverAllDatas: any
  // public affiliatedUsersMinimumMaximumOverAllDatas: any
  public userChangedProgram: number = null;
  public userSelectedOldProgram: any
  public teleConsultaionAgree: boolean = false;
  public programIsCancelled: boolean = false;
  public takeSurveyScore: any = null;
  public takeSurveyScoreShow: boolean;
  public userFirstName: string = null;
  public userLastName: string = null;
  public userGender: string = null;
  public basicInfoNeed:boolean = false;
  public notShowMetrics:boolean = false;
  public changedAffiliation:any = null;
  public dashboardBmiCalculDone:boolean = false;
  public externalBaseURL = "https://dashboard.indiahealthlink.com/";
  //public ihlBaseurl = "https://scanningapi.indiahealthlink.com/";
  // public ihlBaseurl = "https://devserver.indiahealthlink.com/";                             // this is for developement server url
  public ihlBaseurl = "https://azureapi.indiahealthlink.com/";                           // this is for live server url
  // public ihlBaseurl = "https://azureapiv2.indiahealthlink.com/";                           // this is for VAPT
  public ihlCrossbarWS = "wss://testing.indiahealthlink.com:9080/ws";
  //public ihlCrossbarWS = "wss://scanning.indiahealthlink.com:9080/ws";
  public ihlCrossbarRealm = "crossbardemo";
  // public ihlDemouserID = "qlB49eY3k02PqrH4qgPElw";
  public ihlDemouserID = "yClW1ufbk0KGOxWZ1vLlfA";
  public riskInfoAlerts: boolean = false;
  public riskInfoTitle: any = null;
  public riskInfoSubTitle: any = null;
  public notShowMetricsTitle: any = "programs";
  public prescriptionPreparation: boolean = false;
  public buyMedicineOnline: boolean = false;
  public getTeleConsulationHistory:any = null;
  public confirmAppointment: boolean = false;

  public userProfilePic: any = null;
  public userProfilePicType: any = null;

  public generateCouponCode:boolean = false;
  public videoWindow:boolean = false;
  public videoCallStart:boolean = false;
  public videoCallExpandStyle:boolean = true;

  public consultationPlatformData:any = null;
  public teleConsultPageFlow:any = [];
  public healthBlogsData:any = null;
  public appointmentDetails:any
  public newAppointmentID:any = null;
  public newConsultantID:any = null;
  public consultationUserData:any = null;
  // Global variable to pass the doctor details from doctor list page to video call page
  public selectedDoctor:any = undefined;
  public teleconsultCrossbarServiceData:any = {};
  public reachingVideoCallPageFrom:string = '';
  public genixVideoCallURL:string = "";
  public genixAppointmentDetais: any = {};
  public doctorPrescribedData:any = {};
  public noDoctorIsAvailable:boolean = false;
  public noCourseIsAvailable:boolean = false;
  public startCallFlow: boolean = false;
  public genixIframeOpened: boolean = false;
  public teleConsultType:any = null;
  public teleSpecalityType:any = null;
  public teleConsultBackBtnClick:boolean = false;
  public bookAppointmentProcess:boolean = false;
  public liveAppointmentProcess:boolean = false;
  public createSubscriptionProcess:boolean = false;
  public teleconsultMobileValidate:boolean = false;
  public teleconsultAddMobileNumber:boolean = false;
  public teleconsultMyAppointmentCancelButton:boolean = false;
  public cancelAndRefundAppointment:boolean = false;
  public cancelAndRefundModelBoxBtn:boolean = true;
  public cancelAndRefundModelBoxInput:boolean = true;
  public teleconsultMySubscriptionCancelButton: boolean = false;
  public teleconsultMySubscriptionRefundCancelButton: boolean = false;
  public consultantDataForReview:any;
  public platformDataFailedToLoad: boolean = false;
  public directCallfind: boolean = false;
  public initUITour:boolean = false;
  public challenge_welcomeWindow:boolean = false;
  public challenge_numberOfDays:any;
  public razorpayMode:boolean = false;
  public newSubscriptionId: any = null;
  public isOnlineClassEnded:boolean = false;
  public liveCallCourseObj:any = {};
  public challenge_programName:string = '';
  public isAffiliatedRouterLink:boolean = false;
  public tourDoneShowHbuddy:boolean = false;
  public teleconsultationFlowSelected: string = "genric";//genric //affiliate
  public teleconsultationAffiliationSelectedName: string = "";//persistent //dimention //Dimention Gym
  public isAffiliatedUser:boolean = false;
  public teleconsultationAffiliationSelectedCompanyImg:string = "";
  public affiliatedCompanies:any[] = [];
  public showAffDeleteModal:boolean = false;
  public affilate_unique_name:string = '';
  public affilate_company_name:string = '';
  public telePlatformDataFirstTimeCall:boolean = false;
  public fitnessDashboardObj:object = {};
  public transactionIdForTeleconsultation: (string | number) = "";
  public printInvoiceNumberForTeleconsultation: (string | number) = "";
  public teleConsultaionAgreeFlow : boolean = false;
  public orgUserConsentForm : boolean = false;
  public orgUserData = {};

  public refundInfo:boolean = false;
  public showConsultantRefundInfo:boolean = false;
  public showClassRefundInfo:boolean = false;
  public refundConsultantInfoArr:object[] = [
    {cancellation_time:'x_hours',cancellation_refund:'_'},
    {cancellation_time:'refund_perenct_before_x_hours',cancellation_refund:'50%'},
    {cancellation_time:'refund_perenct_after_x_hours',cancellation_refund:'30%'},
    {cancellation_time:'refund_perenct_for_customer_noshow',cancellation_refund:'0%'},
    {cancellation_time:'refund_perenct_for_consultant_cancel_before_appointment',cancellation_refund:'100%'},
    {cancellation_time:'refund_percent_for_consultant_no_show',cancellation_refund:'100%'}
  ];
  public refundClassInfoArr:object[] = [
    {cancellation_time:'x_percent_of_course_completed',cancellation_refund:'20%'},
    {cancellation_time:'y_percent_of_course_completed',cancellation_refund:'50%'},
    {cancellation_time:'z_percent_of_course_completed',cancellation_refund:'70%'},
    {cancellation_time:'refund_perenct_before_x_percent_of_course_completed',cancellation_refund:'60%'},
    {cancellation_time:'refund_perenct_after_x_and_before_y_percent_of_course_completed',cancellation_refund:'30%'},
    {cancellation_time:'refund_perenct_after_y_and_before_z_percent_of_course_completed',cancellation_refund:'10%'},
    {cancellation_time:'refund_perenct_after_z_percent_of_course_completed',cancellation_refund:'0%'}
  ];
  public genixSuperAdminDoctorId :string = "c55b08329ec34ca9a049723bd3fe0231";
  public affiliationListReceived:boolean = false;
  public cancelAppointmentModelBoxTitle:string = '';
  public prescriptionObjectFor1mg: any = "";
  public _is_base64_pdf_available: any = false;
  public checkinHistory = {};
  public vendorAppointmentId = "";
  public medicationPartnerDetails: any = null;
  public labPartnerDetails: any = null;
  public getLabOrder: boolean = false;
  public teleconsultationAffiliationCode: any = undefined;
  public _is_base64_lab_pdf_available: any =false;
  public labObjectFor1mg: any = "";
  public documentToShare: any[] = [];
  public jointAccountTermsAndConditions: boolean = false;
  public affiliatedFirstLoginModelBox: boolean = false;
  public userProfileData: any = null;
  public unlinkJointUserConfirmationPopUp: boolean = false;
  public mainUserAccountCredentials = {} as contracts.MainUserAccountCredentials;
  public _isDependentUserAccount: boolean = false;
  public _isDiagnosticConsultantSelected: boolean = false;
  public jointUserTermsConditionsPopUp: boolean = false;
  public jointuserSelectMyself:boolean = false;
  public jointuserSelectMyselforOthers = false;
  public jointuserSelectothers = true;
  public teleflowjoinuser :any = [];
  public requestedjoinuser : boolean = false;
  public requestacceptance : boolean = false;
  public requested_users : any ;
  public unsendJointUserrequestconfirmation : boolean = false;
  public caretakerlistAccount : boolean = false;
  public caretakeracceptance : boolean = false;
  public unsendCareUserrequestconfirmation : boolean = false;
  public unlinkJointAccountPopUp: boolean = false;
  public renameFilePopUp: boolean = false;
  public medicalDocumentsList: Array<any> = [];
  public currentUploadedFileName: any = null;
  public modifiedMedicalFileName: any = null;
  public saveFile: boolean = true;
  public currentUserId: string = '';
  public requestedlistAccount : boolean = false;
  public ihlEncKey : string = 'IHL@22';
  public encryption : boolean = true;
  public affiliatedData: any = {};
  public affiliatedEmail: string = '';
  public affiliatedUser: boolean = false;
  public persistentSpecialityArrList:any; 
  public updateAppointmentID: any = null;
  public consultationAppointmentInfo: any = {};
  public fireStore: boolean = false;
  public teleConsultationNewFlow: boolean = false;
  public showLiveCallModal: boolean = false;
  public showAppointmentModal: boolean = false;
  public showPaymentSelect: boolean = false;
  public consultationFee: any = '0'; 
  public showSubscriptionModal: boolean = false;
  public showSubscriptionDownloadInvoice: boolean = false;
  public selectedCourseConsultantId:any = '';
  public selectedCourseId:any = '';
  public isAffiliated:boolean = false;
  public overAllCourseList:Object[] = [];
  public showAffCourseWithoutCategory: boolean = false;
  public filteredConsultantList:Object[] = [];
  public filteredCoursesList:Object[] = [];
  public isShowDoctorList:boolean = false;
  public isShowCourseList:boolean = false;
  public isLoading:boolean = false;
  public teleConsultationCollectionName: string = '/testteleconsultationServices';
  public consultantOnlineCollectionName: string = '/testconsultantOnlineStatus';
  public subscriptionCollectionName: string = '/testsubscriptionServices';
  public ihlAccountExistModal:boolean = false;
  public ihlAccountNotExistModal:boolean = false;
  public ihlAccountErrModal: boolean = false;
  public isConvertSSoToIHLSuccessModal: boolean = false;

  //All this is for VAPT //
  public vaptEnabled: boolean = false;
  public ihlEncIvForVapt: string = "Aetx7Ayc-SYW#uBZ";
  public ihlEncKeyForVapt : string = "SC+1'6-kBVkN>#nxkD%x%)M^5]egQc@]";
  public changePasswordData = {};
  public changePasswordModel:boolean = false;
  public sessionActiveLogout:boolean = null;
  public otpValidReg:boolean = false;
  public otpValidProfile:boolean = false;
  public regMailMobileOTP:any;
  //All this is for VAPT //

  constructor() {
    if(this.ihlBaseurl == "https://azureapi.indiahealthlink.com/"){
      this.razorpayMode = true;
      this.genixSuperAdminDoctorId = "b82fd0384bba473086aaae70a7222a55";
      this.teleConsultationCollectionName = '/teleconsultationServices';
      this.consultantOnlineCollectionName = '/consultantOnlineStatus';
      this.subscriptionCollectionName = '/subscriptionServices';
    }
  }

  aesEncryption(value) {
    if (this.encryption) {
      if (typeof(value) != 'number') {
        var Encrypted = CryptoJS.AES.encrypt(value, this.ihlEncKey);
        return Encrypted.toString();
      }
    }
    return value;
  }

  aesDecryption(key) {
    let encryptData = localStorage.getItem(key);
    if (encryptData != null) {
      let decrypted = CryptoJS.AES.decrypt(encryptData, this.ihlEncKey);
      return decrypted.toString(CryptoJS.enc.Utf8);
    }
    return encryptData;
  }

  aesEncryptionForVAPT(value) {
    if (this.encryption) {
      if (typeof(value) != 'number') {
        let key = CryptoJS.enc.Utf8.parse(this.ihlEncKeyForVapt);
        let iv = CryptoJS.enc.Utf8.parse(this.ihlEncIvForVapt);

        let encrypted = CryptoJS.AES.encrypt(value, key,
            {
                iv:iv,
                mode:CryptoJS.mode.CBC,
                padding:CryptoJS.pad.Pkcs7
            }
        )
        return encrypted.toString();
      }
    }
    return value;
  }

  aesDecryptionForVAPT(key) {
    let encryptData = localStorage.getItem(key);
    if (encryptData != null) {
      let key = CryptoJS.enc.Utf8.parse(this.ihlEncKeyForVapt);
      let iv = CryptoJS.enc.Utf8.parse(this.ihlEncIvForVapt);

      let decrypted = CryptoJS.AES.decrypt(encryptData, key,
          {
              iv: iv,
              mode:CryptoJS.mode.CBC,
              padding:CryptoJS.pad.Pkcs7
          }
      );
      return decrypted.toString(CryptoJS.enc.Utf8);
    }
    return encryptData;
  }

}
