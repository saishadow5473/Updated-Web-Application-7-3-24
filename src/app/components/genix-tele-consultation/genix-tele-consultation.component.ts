import { Component, ElementRef, OnInit, HostListener, ViewChild, OnDestroy, DoCheck, AfterViewChecked, AfterViewInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ConstantsService } from '../../services/constants.service';
import { WindowState } from '@progress/kendo-angular-dialog';
import { TeleConsultService } from 'src/app/services/tele-consult.service';
import { Router } from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import { AuthServiceLogin } from 'src/app/services/auth.service.login';
import { AuthService } from 'src/app/services/auth.service';
import { TeleconsultationCrossbarService, Channel, PublishToChannelOptions } from '../../services/tele-consult-crossbar.service';
import { TeleconsultationJitsiService , JitsiInitInterface} from '../../services/tele-consult-jitsi.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ModalComponent } from '../modal/modal.component';

const WAIT_TIME_FOR_PERSCRIPTION_STATUS_TO_RECEIVE = 1*60*1000 + 10*1000;// 1 minute + 10 secs( 10 secs for network delay)
const WAIT_TIME_FOR_PERSCRIPTION_TO_RECEIVE = 5*60*1000; //5 Minutes

@Component({
  selector: 'app-genix-tele-consultation',
  templateUrl: './genix-tele-consultation.component.html',
  styleUrls: ['./genix-tele-consultation.component.css']
})
export class GenixTeleConsultationComponent implements OnInit, OnDestroy {
  WindowState: WindowState = 'maximized';
  i_frame_class = "i_frame_max";
  url: string = "";
  //url: string = "https://youtube.com/embed/CptYICtnKkY";
  urlSafe: SafeResourceUrl;
  topAlign: string = "kendo_frame_pos";
  top: number = 0;
  left: number = 0;
  showLoadingModalSpinner:boolean = false;
  showLoadingModalContent:string = '';
  showLoadingModal:boolean = false;
  showLoadingModalHideButton:boolean = false;
  private _appointment_id: any;
  private _appointment_details: any;
  userData: any;
  @ViewChild('mainWindow') mainWindow;
  private _flowType: string;
  private _isWaitForPrescriptionTimer = undefined;
  private _selectedDoctorId = undefined;
  checkAttempt: number;
  initiatingNetworkCheck: NodeJS.Timer;
  exitConfirm: boolean = false;
  afterPrescriptionEndCall: boolean = false;
  prescriptionArrivedStatus: boolean = false;
  @ViewChild('genix_teleconsultation_iframe') genix_teleconsultation_iframe: ElementRef;
  genixSignalRScriptRun = false;
  genixSignalRScriptRunUrl = "";
  vendorAppointmentId = "";
  liveCallAcceptTimer = undefined;
  sanitizer: any;
  signalRSanitizer: any;
  signalRSafeResourceUrl: SafeResourceUrl;

  constructor(
    public domSanitizer: DomSanitizer,
    public _constant: ConstantsService,
    protected hostElement: ElementRef,
    private _teleConsultService: TeleConsultService,
    private router:Router,
    private snackBar: MatSnackBar,
    private authServiceLogin: AuthServiceLogin,
    private authService: AuthService,
    private teleconsultCrossbarService:TeleconsultationCrossbarService,
    private teleconsultJitsiService:TeleconsultationJitsiService,
    private dialog: MatDialog
  ) {
    this.sanitizer = domSanitizer;
    this.signalRSanitizer = domSanitizer;
  }

  ngOnInit(): void {

    this.showModal('Please wait you are redirecting...',true);
    this._flowType = this._constant.reachingVideoCallPageFrom || undefined;
    if(this._flowType == undefined || this._flowType == null || this._flowType.length == 0){
      this.router.navigate(['/teleconsultation']);
      return;
    }

    if (this._flowType == 'LiveAppointemnt') {
      if(this._constant.newAppointmentID != null && this._constant.newAppointmentID != undefined && this._constant.vendorAppointmentId != null && this._constant.vendorAppointmentId != undefined){
        this._appointment_id = this._constant.newAppointmentID;
        this.vendorAppointmentId =  this._constant.vendorAppointmentId;
      } else {
        this.hideModal();
        this.router.navigate(['/teleconsultation']);
        return;
      }

      if(this._constant.appointmentDetails != undefined && this._constant.appointmentDetails != null){
        this._appointment_details = this._constant.appointmentDetails;
      }else{
        this.hideModal();
        this.router.navigate(['/teleconsultation']);
        return;
      }

      try{
        this.userData = JSON.parse(this._constant.aesDecryption('userData'));
      }catch(err){
        this.hideModal();
        this.router.navigate(['/teleconsultation']);
        return;
      }
      this._selectedDoctorId = this._appointment_details['ihl_consultant_id'];
    }else if (this._flowType == 'BookAppointment') {
      if(this._constant.consultantDataForReview != undefined && this._constant.consultantDataForReview != null){
        try{
          this.userData = JSON.parse(this._constant.aesDecryption('userData'));
        }catch(err){
          this.hideModal();
          this.router.navigate(['/teleconsultation']);
          return;
        }
        this._selectedDoctorId = this._constant.consultantDataForReview['ihl_consultant_id'];
      }else{
        this.hideModal();
        this.router.navigate(['/teleconsultation']);
        return;
      }
    }else{
      this.hideModal();
      this.router.navigate(['/teleconsultation']);
      return;
    }
    this.initializeCrossbar();
  }

  ngOnDestroy(){
    console.log('Component destroyed');
    (async ()=>{await Promise.all(
        this.CHANNEL_LIST.map(item=>{this.teleconsultCrossbarService.unSubscribeToChannel(item.channel_name)})
    ).then(res=>{
      console.log(res);
      console.log('Unsubscribed');
    })})();
    console.log('After unsubscribed');

    if (this.initiatingNetworkCheck != undefined) {
      clearInterval(this.initiatingNetworkCheck);
    }
  }

  initializeCrossbar(){
    this.teleconsultCrossbarService.on_connection_established = ()=>{this.crossbarConnected();}
    this.teleconsultCrossbarService.user_id = JSON.parse(this._constant.aesDecryption('userData'))['id'];
    if(this.teleconsultCrossbarService.user_id == undefined) return;

    if(this.teleconsultCrossbarService.is_connected == true){
      console.log('Connected already exist');

      let _channels_to_subscribe:any = [];
      // Updating Handlers
      this.CHANNEL_LIST.forEach((item:Channel)=>{
        if(this.teleconsultCrossbarService.updateSubscriptionFunctionHandler(item.channel_name, item.subscription_handler) == false){
          _channels_to_subscribe.push(this.teleconsultCrossbarService.subscribeToChannel(item.channel_name, item.subscription_handler));
        }
      });

      Promise.all(_channels_to_subscribe).then(res=>{
        this.teleconsultCrossbarService.on_connection_established();
      });
    }
    else{
      console.log('Connecting to crossbar');
      let _options = {};
      _options['subscription_channels_list'] = this.CHANNEL_LIST;
      this.teleconsultCrossbarService.connect(_options);
    }
  }

  crossbarConnected():void{
    console.log('Server connected');
    console.log(this.teleconsultCrossbarService.getChannelList());
    this.validateDoctorStatus();
  }

  private get CHANNEL_LIST():Channel[]{
    return [
      {
        'channel_name': 'ihl_send_data_to_doctor_channel',
        'subscription_handler': (param, sender_id, sender_session_id, receiver_ids) => {  this.ihlSendDataToDoctorChannelSubscription(param, sender_id, sender_session_id, receiver_ids); }
      },
      {
        'channel_name':'ihl_send_data_to_user_channel',
        'subscription_handler':(param, sender_id, sender_session_id, receiver_ids, cmd)=>{this.messageFromSendDataToUserSubscription(param, sender_id, sender_session_id, receiver_ids, cmd);}
      }
    ];
  }

  validateDoctorStatus():void{
    this.showModal('Checking Online Status',true);
    this._get_doctor_status([this._selectedDoctorId]).then(async res=>{
      let _doctor_status = this._extractDoctorStatusFromApi(res);
      console.log(_doctor_status);
      if(_doctor_status != 'Offline'){
        if(_doctor_status == 'Online'){
          if (this._flowType == 'LiveAppointemnt') {
            this.genixSignalRScriptRunUrl = this._constant.externalBaseURL+"signalr/index.html?vendor_consultant_id="+this._appointment_details.vendor_consultant_id+"&vendor_appointment_id="+this.vendorAppointmentId+"&vendor_user_name="+this._appointment_details.user_name;
            this.genixSignalRTrustSrcUrl(this.genixSignalRScriptRunUrl);
            this.genixSignalRScriptRun = true;
            setTimeout(()=>{
              this.doctorResponseTimeInitiate();
            }, 2000);
            return;
          }
          if (this._flowType == 'BookAppointment') {
            this.initiateBookAppointmentCallFlow(this._constant.consultantDataForReview);
            return;
          }
        }
      }else{
        this.showLoadingModalContent = 'Host is Offline. Try after sometime';
        this.showLoadingModalSpinner = false;
        if(this._flowType == 'LiveAppointemnt'){
          await this.updateAppointmentCallStatus(this._appointment_id, 'Missed');
          await this._teleConsultService.consultationAppointmentAccept_Reject({'appointment_id': this._appointment_id, 'appointment_status':'Approved'}).subscribe(_res=>{});
        }
        setTimeout(()=>{
          this.hideModal();
          this.router.navigate(['/teleconsultation']);
          return;
        }, 4 * 1000);
      }
    }).catch(err=>{
      console.log('Error validating doctor');
    });
  }

  private _get_doctor_status(_ids:(string|number)[]):Promise<Object>{
    if(_ids.length == 0) return Promise.resolve({});
    return new Promise((resolve, reject)=>{
      this._teleConsultService.getDoctorStatus(_ids).subscribe(
        res=>{
          console.log((res as string).replace(/(&quot\;)/g,"\""));
          let _res = {'data':JSON.parse((res as string).replace(/(&quot\;)/g,"\""))};
          resolve(_res['data']);
        },
        err=>{
          console.error(err);
          reject(err);
        });
    });
  }

  private _extractDoctorStatusFromApi(api_res):string{
    try{
      if(api_res.length != 1 ) return 'Offline';
      if(api_res[0]['consultant_id'] != this._selectedDoctorId) return 'Offline';
      if(api_res[0]['status'] == null || api_res[0]['status'] == undefined || api_res[0]['status'] == 'Offline') return 'Offline';
      let _api_date:any = new Date(api_res[0]['timestamp']);
      let cur_date:any = new Date();
      if((cur_date - _api_date) >= (15*60*1000)) return 'Offline';
      return api_res[0]['status'];
    }catch(err){
      return 'Offline';
    }
  }

  initiateLiveCallFlow(): void{
    this.showModal('Connecting to doctor.Please wait...',true);
    this._teleConsultService.genixBookAppointemtVideoCallUrl(this._appointment_id).subscribe(urlResponse => {
      let res = urlResponse.replaceAll("&quot;", '"');
      let parseResponse = JSON.parse(res);
      try{
        if ("Message" in parseResponse) {
          if (parseResponse["Message"] == "The request is invalid.") {
            throw "The request is invalid.";
          }
        }
      }catch(err){
        //this.genixAbnormalDirectVideoCallUrlGenerateFunction(selectedAppointment);
        this.snackBar.open("Sorry something went wrong.. Please try again..", '',{
          duration: 8000,
          panelClass: ['error'],
        });
        this.hideModal();
        this.router.navigate(['/teleconsultation']);
        return 0;
      }
      if (Array.isArray(parseResponse)) {
        let url = parseResponse.filter(obj => {
          return obj.Type == "Participant";
        });
        if (url.length > 0) {
          this.url = url[0]['URL'];
          this._constant.genixAppointmentDetais = this._constant.appointmentDetails;
          this._constant.doctorPrescribedData = {
            appointment_id : this._appointment_id,
          };
          this.hideModal();
          setTimeout(() => {
            this._constant.genixIframeOpened = true;
            this.iframeSrc();
          },300);
        }else{
          this.snackBar.open("Sorry something went wrong.. Please try again..", '',{
            duration: 8000,
            panelClass: ['error'],
          });
          this.hideModal();
          this.router.navigate(['/teleconsultation']);
          return;
        }
      }else{
        this.snackBar.open("Sorry something went wrong.. Please try again..", '',{
          duration: 8000,
          panelClass: ['error'],
        });
        this.hideModal();
        this.router.navigate(['/teleconsultation']);
        return;
      }
    },(err)=>{
      console.log(err);
      this.snackBar.open("Sorry something went wrong.. Please try again..", '',{
        duration: 8000,
        panelClass: ['error'],
      });
      this.hideModal();
      this.router.navigate(['/teleconsultation']);
      return;
    });
  };

  doctorResponseTimeInitiate(){
    this.liveCallAcceptTimer = setTimeout(()=>{
      this.noResponseFromCall();
    }, 60 * 1000);
    this.showModal('Waiting for doctor response',true);
  };

  noResponseFromCall() {
    this.showModal('Doctor is not picking the call. If within time you can join from my appointments page of IHL user portal/mobile application.',false);
    this.genixSignalRScriptRun = false;
    this.genixSignalRScriptRunUrl = "";
    setTimeout(async ()=>{
      await (this.updateAppointmentCallStatus(this._appointment_id, 'Missed')).catch(err=>{});
      await (this._teleConsultService.consultationAppointmentAccept_Reject({'appointment_id': this._appointment_id, 'appointment_status':'Approved'}).subscribe(_res=>{}));
      this.hideModal();
      this.router.navigate(['/teleconsultation']);
    }, 8 * 1000);
  };

  callAcceptedByDoctor = async (param) => {
    if(this.liveCallAcceptTimer == undefined) return;
    if(('room_id' in param) == false || ('doctor_id' in param) == false) return;

    clearTimeout(this.liveCallAcceptTimer);
    this.liveCallAcceptTimer = undefined;

    // Update appointment Status as ongoing
    await (this.updateAppointmentCallStatus(this._appointment_id, 'on_going'));

    this.showModal('Call accepted by doctor',true);
    //console.log('Call accepted by doctor');
    this.genixSignalRScriptRun = false;
    this.genixSignalRScriptRunUrl = "";
    this.initiateLiveCallFlow();
  };

  callDeclinedByDoctor = (param) => {
    if(this.liveCallAcceptTimer == undefined) return;

    clearTimeout(this.liveCallAcceptTimer);
    this.liveCallAcceptTimer = undefined;

    this.showModal('Doctor declined call',false);
    this.genixSignalRScriptRun = false;
    this.genixSignalRScriptRunUrl = "";
    setTimeout(async ()=>{
      let res = await (this.updateAppointmentCallStatus(this._appointment_id, 'Missed'));
      let _res = await (this._teleConsultService.consultationAppointmentAccept_Reject({'appointment_id': this._appointment_id, 'appointment_status':'Rejected'}).subscribe(_res=>{}));
      this.hideModal();
      this.router.navigate(['/teleconsultation']);
    }, 5000);
  };

  initiateBookAppointmentCallFlow(selectedAppointment){
    console.log(selectedAppointment);
    this._constant.doctorPrescribedData = {
      appointment_id : selectedAppointment.appointment_id.toString(),
    };
    this._appointment_id = selectedAppointment.appointment_id.toString();

    this._teleConsultService.genixBookAppointemtVideoCallUrl(this._appointment_id).subscribe(response => {
      console.log(response);
      let urls = JSON.parse(response.replaceAll("&quot;", '"'));
      try{
        if ("Message" in urls) {
          if (urls["Message"] == "The request is invalid.") {
            throw "The request is invalid.";
          }
        }
      }catch(err){
        //this.genixAbnormalDirectVideoCallUrlGenerateFunction(selectedAppointment);
        this.snackBar.open("Sorry something went wrong.. Please try again..", '',{
          duration: 8000,
          panelClass: ['error'],
        });
        this.hideModal();
        this.router.navigate(['/teleconsultation']);
        return 0;
      }
      console.log(urls);
      if (Array.isArray(urls)) {
        let patientUrl = urls.filter(obj => {
          return obj.Type == "Participant"
        });

        if (patientUrl.length > 0) {
          this.url = patientUrl[0].URL;
          this._constant.genixAppointmentDetais = selectedAppointment;
          this.hideModal();
          setTimeout(() => {
            this._constant.genixIframeOpened = true;
            this.iframeSrcBookApmt();
          },300);
        }else{
          this.snackBar.open("Sorry something went wrong.. Please try again..", '',{
            duration: 8000,
            panelClass: ['error'],
          });
          this.hideModal();
          this.router.navigate(['/teleconsultation']);
          return;
        }
      }else{
        this.snackBar.open("Sorry something went wrong.. Please try again..", '',{
          duration: 8000,
          panelClass: ['error'],
        });
        this.hideModal();
        this.router.navigate(['/teleconsultation']);
        return;
      }
    },
    (error: any) => {
      console.log(error);
      this.snackBar.open("Sorry something went wrong.. Please try again..", '',{
        duration: 8000,
        panelClass: ['error'],
      });
      this.hideModal();
      this.router.navigate(['/teleconsultation']);
      return;
    })
  }

  messageFromSendDataToUserSubscription(param: any, sender_id: any, sender_session_id: any, receiver_ids: any, cmd: any){
    console.log(param);
    console.log(sender_id);
    console.log(receiver_ids);
    console.log(cmd);

    if(this._selectedDoctorId == undefined || this.userData['id'] == undefined) return;
    if('receiver_ids' in param == false || 'ihl_consultant_id' in param == false) return;
    if (param.receiver_ids != this.userData['id']) return;
    if (param.ihl_consultant_id != this._selectedDoctorId) return;
    if(sender_id != this._selectedDoctorId) return;
    if (cmd && cmd != "" && cmd == "AfterCallPrescriptionStatus") {
      this.afterCallPerscriptionStatus(param);
    }
  }

  ihlSendDataToDoctorChannelSubscription =  (param: any, sender_id: any, sender_session_id: any, receiver_ids: any) => {
    console.log(param);
    console.log(sender_id);
    console.log(receiver_ids);

    if(this._appointment_details['ihl_consultant_id'] == undefined || this.userData['id'] == undefined) return;
    if('doctor_id' in param == false) return;
    if (Array.isArray(receiver_ids) == false) return;
    if (param.doctor_id != this._appointment_details['ihl_consultant_id']) return;
    if (receiver_ids[0] != this.userData['id']) return;
    if(sender_id != this._appointment_details['ihl_consultant_id']) return;

    if('cmd' in param){
      switch(param['cmd']){
        case 'CallAcceptedByDoctor': this.callAcceptedByDoctor(param); break;
        case 'CallDeclinedByDoctor': this.callDeclinedByDoctor(param); break;
      }
    }
  };

  async afterCallPerscriptionStatus(param = {}):Promise<void>{
    if('perscription_status' in param == false) return;
    if(param['perscription_status'] == 'true'){
      this.exitConfirm = false;
      this.afterPrescriptionEndCall = true;
      await this.updateAppointmentCallStatus(this._appointment_id, 'completed');
      if(this._constant.transactionIdForTeleconsultation != undefined && this._constant.transactionIdForTeleconsultation != ""){
       await this.updateServiceProvidedStatus();
      }
      this.prescriptionArrivedStatus = true;
      this.showModal('Doctor has provided some prescription. Please wait...', false);
      setTimeout(()=>{
        this.router.navigate(['/consult-summary']);
      }, 3 * 1000);
      return;
    }
    if(param['perscription_status'] == 'false'){
      this.exitConfirm = false;
      this.afterPrescriptionEndCall = true;
      await this.updateAppointmentCallStatus(this._appointment_id, 'completed');
      if(this._constant.transactionIdForTeleconsultation != undefined && this._constant.transactionIdForTeleconsultation != ""){
       await this.updateServiceProvidedStatus();
      }
      this.prescriptionArrivedStatus = false;
      this.showModal('No prescription has been provided by doctor. Thank you...', false);
      setTimeout(()=>{
        this.router.navigate(['/teleconsultation']);
      }, 3 * 1000);
      return;
    }
  }

  /**
   * @param appointment_id Id of the appointment
   * @param new_status Status to be updated
   * @description Async; Update appointment status; Returns Boolean Promise
  */
  updateAppointmentCallStatus(appointment_id:string|number, new_status:string):Promise<boolean>{
    return new Promise((resolve, reject)=>{

      this._teleConsultService.consultantAppointmentCallStatusUpdate(appointment_id, new_status).subscribe(res=>{
        console.log(res);
        // if(res != "Database Updated") resolve(false);
        //this.appointment_call_status = new_status;
        resolve(true);
      })
    })
  }

  /**
   * @description Async; update Service Provided Status;
  */
  async updateServiceProvidedStatus():Promise<any>{
    let transactionId: (string | number) = this._constant.transactionIdForTeleconsultation;
    return new Promise((resolve, reject)=>{

      this._teleConsultService.updateTeleconsultServiceProvidedStatus(transactionId).subscribe(res=>{
        console.log(" service provider updated");
        console.log(res);
        resolve(res);
      },(error: any)=>{
        console.error("error while updating service provider api");
        resolve("error while updating service provider api");
      });
    })
  }

  closeGenixTeleconsultation(){
    if (this.afterPrescriptionEndCall == true) {
      this.hideModal();
      this._constant.genixIframeOpened = false;
      if (this.prescriptionArrivedStatus == true) {
        this.router.navigate(['/consult-summary']);
        return;
      }

      if (this.prescriptionArrivedStatus == false) {
        this.router.navigate(['/teleconsultation']);
        return;
      }
    }else{
      this.exitConfirm = true;
      this.showModal('Your consultation will be ended. Are you sure want to exit?', false);
    }
  }

  forceExitConfirmation(msg: string){
    if (msg == "yes_exit") {
      this.exitConfirm = false;
      this.showModal('Call ended abornamlly. If within time, you can reconnect from My Appointments page. Sorry for Inconvenience', false);
      this._constant.genixIframeOpened = false;

      setTimeout(()=>{
        this.hideModal();
        this.router.navigate(['/myappointment']);
        return;
      },1000 * 6);
    }

    if(msg == "no"){
      this.hideModal();
    }
  }

  showModal(message:string = '', spinner:boolean = true, others:{hideButton:boolean} = {'hideButton': false}){
    this.showLoadingModalSpinner = spinner;
    this.showLoadingModalContent = message;
    this.showLoadingModalHideButton = others.hideButton;
    this.showLoadingModal = true;
  }

  hideModal(){
    this.showLoadingModal = false;
    this.showLoadingModalSpinner = false;
    this.showLoadingModalContent = '';
    this.showLoadingModalHideButton = false;
    this.exitConfirm = false;
  }

  iframeSrc(){
    this.url = this.url.replace("watch?v=", "embed/");
    console.log("getURL=" + this.url)
    setTimeout(() => {
      this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
      this.updateAppointmentCallStatus(this._appointment_id, 'on_going');
    },500);

    setTimeout(() => {
      this.checkNetworkAvailability();
    },5000);
  }

  iframeSrcBookApmt(){
    console.log("getURL=" + this.url);
    setTimeout(() => {
      this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
      this.updateAppointmentCallStatus(this._appointment_id, 'on_going');

    },500);

    setTimeout(() => {
      this.checkNetworkAvailability();
    },5000);
  }

  genixSignalRTrustSrcUrl(url: any): any{
    this.signalRSafeResourceUrl =  this.signalRSanitizer.bypassSecurityTrustResourceUrl(url);
  }

  async checkNetworkAvailability(){

    this.initiatingNetworkCheck =  setInterval( ()=>{
      let online = window.navigator.onLine;
      console.log("online status "+ online);
      if (!online){
        if (this.checkAttempt > 2) {
          this.checkAttempt = 0;
          this._constant.genixIframeOpened = false;
          this.showModal('Looks like Network Issue. If within time, You can rejoin from My Appointments page', false);
          setTimeout(()=>{
            this.hideModal();
            this._constant.videoWindow = false;
            this._constant.videoCallStart = false;
            this.router.navigate(['/teleconsultation']);
            return;
          }, 7000);
        }else{
          this.checkAttempt++;
        }
      }else{
        this.checkAttempt = 0;
      }
    },15 * 1000);
  }

}
