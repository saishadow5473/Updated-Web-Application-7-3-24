import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ConstantsService } from '../../services/constants.service';
import { TeleConsultService } from '../../services/tele-consult.service';
import { TeleconsultationCrossbarService, Channel, PublishToChannelOptions } from '../../services/tele-consult-crossbar.service';
import { TeleconsultationJitsiService , JitsiInitInterface} from '../../services/tele-consult-jitsi.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ModalComponent } from '../modal/modal.component';
import { FireStoreService } from '../../services/firestore.service';
import { map } from 'rxjs/operators';

const USER_RING_TIME = 50 * 1000; // 50 seconds
const WAIT_TIME_FOR_PERSCRIPTION_STATUS_TO_RECEIVE = 1*60*1000 + 10*1000;// 1 minute + 10 secs( 10 secs for network delay)
const WAIT_TIME_FOR_PERSCRIPTION_TO_RECEIVE = 5*60*1000; //5 Minutes 
const WAIT_TIME_FOR_END_CALL_CROSSBAR_EVENT_TO_RECEIVE = 1*60*1000; // 1 Minute

@Component({
  selector: 'app-teleconsult-video-call',
  templateUrl: './teleconsult-video-call.component.html',
  styleUrls: ['./teleconsult-video-call.component.css']
})
export class TeleconsultVideoCallComponent implements OnInit, OnDestroy {
  /**
   * @description Describe how user can reach this page
   */
  private get ValidPageFlowList():string[]{
    return ['LiveAppointemnt', 'BookAppointment', 'FitnessClass'];
  }
  private _flowType:string = '';

  private _selectedDoctor = undefined;
  private _selectedDoctorId = undefined;
  
  /**
   * Only used in Live call
   */
  private _selectedDoctorSessionId = undefined;
  private _doctorStatus = 'unavailable';
  /**
   * Name of the current Logged in User; Required to display in jitsi video call and crossbar communication in live call. Required, must be non empty
   */
  private _user_name:string = '';
  private _appointment_id:string|number = undefined;

  /**
   * @deprecated No need now. Remove from HTML and component file
   */
  displayMessage = 'Connecting to server';

  private _isOngoingCall = false;
  private _callAcceptTimer = undefined;

  private _isCallEndedByDoctor:boolean = false;

  /**
   * @description: Boolean variable, true if the call process goes normally and can be marked as completed. 
   * False, if due to some issues like internet issues, no further call status change is made
   */
  private _isOngoingCallValid:boolean = false;
  
  // /**
  //  * @description Boolean field. True if doctor will give aditional information and user has to wait for prescription before moving to summary page
  //  *               False if doctor will not provide additional information and user can move to summary page
  //  */
  // private _isWaitForPrescription:boolean = false;

  private _isWaitForPrescriptionTimer = undefined;
  /**
   * @description: Timer for waiting the crossbar event after the participant has left the call
   */
  private _isWaitForEndCallCrossbarEventTimer = undefined;


  appointment_call_status:string;

  constructor(private router:Router,
              private _teleConsultService:TeleConsultService,
              private teleconsultCrossbarService:TeleconsultationCrossbarService,
              private teleconsultJitsiService:TeleconsultationJitsiService,
              public _constant: ConstantsService,
              public fireStoreService: FireStoreService, 
              private dialog: MatDialog) { }

  ngOnInit() {
    this._flowType = this._constant.reachingVideoCallPageFrom || undefined;
    if(this._flowType == undefined || this._flowType == null || this._flowType.length == 0){
      this.router.navigate(['/teleconsultation']);
      return;
    }
    if(this.ValidPageFlowList.find(item=>{return item == this._flowType}) == undefined){
      this.router.navigate(['/teleconsultation']);
      return;
    }    
    // Extract User name; Mandatory
    try{
      let userData = JSON.parse(this._constant.aesDecryption('userData'));
      this._user_name = userData['firstName'] + ' ' + userData['lastName']; 
    }catch(err){
      this.router.navigate(['/teleconsultation']);
      return;
    }
    if(this._constant.selectedDoctor == undefined || this._constant.selectedDoctor == null || this._constant.selectedDoctor['ihl_consultant_id'] == undefined){
      this.router.navigate(['/teleconsultation']);
      return;
    }
    this._selectedDoctor = this._constant.selectedDoctor;
    this._selectedDoctorId = this._selectedDoctor['ihl_consultant_id'];

    // TODO: Handle appointment id and flow type extraction
    // this._appointment_id = '772ed8e5c59b4fa2926222eaf6e5b11f';
    if(this._constant.newAppointmentID != null){
      this._appointment_id = this._constant.newAppointmentID;
    } else {
      this.router.navigate(['/teleconsultation']);
      return;
    }

    if(this._appointment_id == undefined || this._appointment_id == null || this._appointment_id == ''){
      this.router.navigate(['/teleconsultation']);
      return;
    }
    // Crossbar is required for direct call flow
    if(this._flowType == 'LiveAppointemnt' && this.teleconsultCrossbarService.is_connected == false && !this._constant.fireStore){
      this.router.navigate(['/teleconsultation']);
      return;
    }

    if (this._constant.fireStore)
      this.initializeFireStore();
    else
      this.initializeCrossbar();
  }

  ngOnDestroy(){
    console.log('Component destroyed');
    if (!this._constant.fireStore) {
      (async ()=>{await Promise.all(
          this.CHANNEL_LIST.map(item=>{this.teleconsultCrossbarService.unSubscribeToChannel(item.channel_name)})
      ).then(res=>{
        console.log(res);
        console.log('Unsubscribed');
      })})();
      console.log('After unsubscribed');
      // this.CHANNEL_LIST.forEach((item:Channel) => {
      //   this.teleconsultCrossbarService.unSubscribeToChannel(item.channel_name).then(res=>{console.log(item.channel_name, res)});
      // });
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

  initializeFireStore() {
    this.validateDoctorStatus();

    let callCmd = ['CallAcceptedByDoctor', 'CallDeclinedByDoctor', 'CallEndedByDoctor', 'AfterCallPrescriptionStatus', 'AfterCallPrescription'];

    let userId = JSON.parse(this._constant.aesDecryption('userData'))['id'];

    this.fireStoreService.getAll('/testteleconsultationServices').snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      console.log(data);
      data.forEach((res) => {
        // const res = doc.data();
        console.log(res);
        console.log(this._appointment_id);

        if ('data' in res && ('cmd' in res['data'])) {
            if (res['receiver_ids'][0] == userId && res['id'] == this._appointment_id) {
              this.messageFromSendDataToUserSubscription(res['data'], res['sender_id'], '');
              return;
            }
        }
      });
    });
  }

  crossbarConnected():void{
    console.log('Server connected');
    console.log(this.teleconsultCrossbarService.getChannelList());
    this.displayMessage = 'Validating Doctor';
    // Check if doctor is online using API call
    this.validateDoctorStatus();
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

  validateDoctorStatus():void{
    this.showModal('Checking Online Status',true);
    this._get_doctor_status([this._selectedDoctorId]).then(async res=>{
      let _doctor_status = this._extractDoctorStatusFromApi(res);
      console.log(_doctor_status);
      if(_doctor_status != 'Offline'){
        if(this._flowType == 'BookAppointment'){
          this.initiateBookAppointmentCall();
          return;
        }
        if(this._flowType == 'FitnessClass'){
          this.initiateFitnessClassAppointment();
          return;
        }
        if(_doctor_status == 'Online'){
          this._doctorStatus = 'Online';
          this.initiateLiveAppointmentCall();
          return;
        }
        
      }else{
        this._doctorStatus = _doctor_status;
        // Doctor is not online; TODO
        this.displayMessage = 'Host is Offline';
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
        }, 3000);
      }
    }).catch(err=>{
      console.log('Error validating doctor');
    });
  }

  async initiateLiveAppointmentCall():Promise<void>{
    if(this._isOngoingCall == true) return;
    if(this._doctorStatus != 'Online') return;
    if(this._appointment_id == undefined || this._appointment_id == null) return;
    if(this._callAcceptTimer != undefined) return;
    this._isOngoingCall = true;
    this._isCallEndedByDoctor = false;
    this.showLoadingModalContent = 'Initating call';
    
    // Send Message to doctor about call throught crossbar

    if (this._constant.fireStore) {
      let senderId = JSON.parse(this._constant.aesDecryption('userData'))['id'];
      let obj = {
        'data': {cmd: 'NewLiveAppointment', appointment_id: this._appointment_id, username: this._user_name},
        'receiver_ids': [this._selectedDoctorId],
        'sender_id': senderId,
        'published': true
      };
      console.log(obj);
      this.fireStoreService.create(this._appointment_id, 'testteleconsultationServices', obj);
    } else {
      let _data = {
        'cmd':'NewLiveAppointment',
        'appointment_id': this._appointment_id,
        'username':this._user_name
      }
      this.teleconsultCrossbarService.publishToChannel('ihl_send_data_to_doctor_channel',_data,{receiver_ids:[this._selectedDoctorId]});
    }    
    
    this._callAcceptTimer = setTimeout(()=>{
      // Handle no response
      this._callAcceptTimer = undefined;
      this.noResponseFromCall();
    }, USER_RING_TIME);
    this.displayMessage = 'Waiting for doctor response';
    this.showLoadingModalContent = 'Waiting for consultant response';
  }

  noResponseFromCall():void{
    console.log('No response of the call');
    this._isOngoingCall = false;
    this._doctorStatus = 'unavailable';
    this.displayMessage = 'No response from doctor';
    this.showLoadingModalSpinner = false;
    this.showLoadingModalContent = 'No response from consultant. Try after sometime. Redirecting to Dashboard';
    setTimeout(async ()=>{
      await this.updateAppointmentCallStatus(this._appointment_id, 'Missed');
      await this._teleConsultService.consultationAppointmentAccept_Reject({'appointment_id': this._appointment_id, 'appointment_status':'Approved'}).subscribe(_res=>{
        this.hideModal();
        this.router.navigate(['/teleconsultation']);
        return;
      });
      
    }, 5000);
  }

  messageFromSendDataToUserSubscription(param, sender_id, sender_session_id){
    if(sender_id != this._selectedDoctorId) return;
    // this._selectedDoctorId = sender_session_id;
    this._selectedDoctorSessionId = sender_session_id;
    if('cmd' in param){
      switch(param['cmd']){
        case 'CallAcceptedByDoctor': this.callAcceptedByDoctor(param); break;
        case 'CallDeclinedByDoctor': this.callDeclinedByDoctor(param); break;
        case 'CallEndedByDoctor': this.callEndedByDoctor(param); break;
        case 'AfterCallPrescriptionStatus': this.afterCallPerscriptionStatus(param); break;
        case 'AfterCallPrescription': this.afterCallPerscriptionReceived(param); break;
      }
    }
  }
  
  callEndedByDoctor(param):void{
    console.log(param);
    console.log("this._isOngoingCall "+this._isOngoingCall);
    console.log("'vid' in param "+'vid' in param);
    console.log("'vid_type' in param "+'vid_type' in param);
    console.log("param['vid']  "+param['vid'] + "this._appointment_id  "+this._appointment_id); 
    console.log("this._flowType  "+this._flowType + "param['vid_type']  "+param['vid_type']);
      

    if(this._isOngoingCall == false) return;
    if('vid' in param == false) return;
    if('vid_type' in param == false) return;
    if(param['vid'] != this._appointment_id) return;
    if(this._flowType == 'FitnessClass' && param['vid_type'] != 'SubscriptionClassCall') return;
    if(this._flowType == 'LiveAppointemnt' && param['vid_type'] != 'LiveAppointmentCall' && param['vid_type'] != 'BookAppointmentCall') return;
    if(this._flowType == 'BookAppointment' && param['vid_type'] != 'BookAppointmentCall') return;
    this._isOngoingCall = false;
    if(this._isWaitForEndCallCrossbarEventTimer) {
      clearTimeout(this._isWaitForEndCallCrossbarEventTimer);
      this._isWaitForEndCallCrossbarEventTimer = undefined;
    }
    this.displayMessage = 'Call ended by doctor';
    console.log('Call ended by doctor. End jiti');
    this._isCallEndedByDoctor = true;
    this._isOngoingCallValid = true; // Marking the call as valid, beacuse sometimes due to traffic or slow internet, event may be recieved slow
    this.teleconsultJitsiService.endJitsiCall();
  }

  async callAcceptedByDoctor(param):Promise<void>{
    console.log(this._callAcceptTimer);
    console.log(this._isOngoingCall);
    console.log(param);

    if(this._callAcceptTimer == undefined) return;
    if(this._isOngoingCall == false) return;
    if(('room_id' in param) == false || ('doctor_id' in param) == false) return;
    clearTimeout(this._callAcceptTimer);
    this.showLoadingModalContent = 'Starting call';
    // Update appointment Status as ongoing
    await this.updateAppointmentCallStatus(this._appointment_id, 'on_going');
    this.hideModal();
    this._callAcceptTimer = undefined;
    this.displayMessage = 'Call accepted by doctor';
    console.log('Call accepted by doctor');
    this.initiateLiveCallJitsi(param['room_id']);
  }
  
  callDeclinedByDoctor(param):void{
    console.log('call decline from doctor');
    if(this._callAcceptTimer == undefined) return;
    if(this._isOngoingCall == false) return;
     clearTimeout(this._callAcceptTimer);
    this.displayMessage = 'Doctor declined call';
    this._isOngoingCall = false;
    this._callAcceptTimer = undefined;
    
    this.showLoadingModalSpinner = false;
    this.showLoadingModalContent = 'Call Declined by consultant.Redirecting to Dashboard.If you made any payment it will be refund within 48 hours';
    setTimeout(async ()=>{
      let res = await this.updateAppointmentCallStatus(this._appointment_id, 'Missed');
      let _res = await this._teleConsultService.consultationAppointmentAccept_Reject({'appointment_id': this._appointment_id, 'appointment_status':'Rejected'}).subscribe(__res=>{
        this.hideModal();
        this.router.navigate(['/teleconsultation']);
        return;
      });
    }, 1000 * 10);
  }

  /**
   * @param room_id : Room to join
   * @description Function for dealing jtisi communications during Live call. All the assumptions here are based on the fact that atmost 2 users will be joining the call
   * 
   * If only single participant, he ends the call, videoConferenceLeft then Hangup event is fired only
   * If more than one pariticipants (n other users), when i cut call, n times participant event is fired each with nth user id, then videoConferenceleft, then hangup
   * If more than partiicpants (n other users), when other cut call, its participant left event is fired.
   */
  initiateLiveCallJitsi(room_id:string):void{
    this._constant.videoWindow = true;
    this._constant.videoCallStart = true;
    this._isOngoingCallValid = true;
    this.teleconsultJitsiService._jitsi_onHangup = async ()=>{
      console.log(this._isOngoingCallValid);
      if(this._isWaitForEndCallCrossbarEventTimer){
        clearTimeout(this._isWaitForEndCallCrossbarEventTimer);
        this._isWaitForEndCallCrossbarEventTimer = undefined;
      }
      if(this._isOngoingCallValid == false){
        // Not marked as completed
        this.showModal('Call ended abornamlly. If within time, you can reconnect from My Appointments page. Sorry for Inconvenience', false);
        setTimeout(()=>{
          console.log(this.teleconsultJitsiService.jitsiMeetExternalAPI);
          if(this.teleconsultJitsiService.jitsiMeetExternalAPI != undefined){
            this.teleconsultJitsiService.jitsiMeetExternalAPI.dispose();
          }          
          this.router.navigate(['/myappointment']);
          return;
        },1000 * 6)
        return;
      }
      console.log('Call ended by User and informing to doctor');
      if(this._isCallEndedByDoctor == false){
        // Update to doctor
        let _data = {
          'cmd':'CallEndedByUser',
          'vid':this._appointment_id,
          'vid_type':'LiveAppointmentCall',
        };
        let _options:PublishToChannelOptions = {
          'receiver_ids':[this._selectedDoctorId],
          //'eligible': [this._selectedDoctorSessionId]
          'eligible': []
        }

        if (this._constant.fireStore) {
          let senderId = JSON.parse(this._constant.aesDecryption('userData'))['id'];
          let _data = {
            'data': {'cmd': 'CallEndedByUser',  'vid':this._appointment_id, 'vid_type':'LiveAppointmentCall'},
            'receiver_ids': [this._selectedDoctorId],
            'sender_id': senderId,
          };
          this.fireStoreService.update(this._appointment_id, _data, 'testteleconsultationServices');
          this.updateCallLog('user', senderId, 'exit', this._appointment_id);
        } else {
          this.teleconsultCrossbarService.publishToChannel('ihl_send_data_to_doctor_channel', _data, _options);
          this.updateCallLog('user', this.teleconsultCrossbarService.user_id, 'exit', this._appointment_id);
        }
      }
      await this.updateAppointmentCallStatus(this._appointment_id, 'completed');
      if(this._constant.transactionIdForTeleconsultation != undefined && this._constant.transactionIdForTeleconsultation != ""){
        this.updateServiceProvidedStatus();
      }
      this.initiateAfterCallEndPerscriptionFlow();
      this._isOngoingCallValid = false;
      if (this.teleconsultJitsiService.jitsiMeetExternalAPI != undefined) { 
        this.teleconsultJitsiService.jitsiMeetExternalAPI.dispose();
      }
    }
    // Some times fired twice for each set of users...like  n events for n users, then again repeated n events for n users
    this.teleconsultJitsiService._jitsi_onParticipantLeft = async (res)=>{
      // Set timeout for crossbar event for call cut from other side
      if(this._isWaitForEndCallCrossbarEventTimer == undefined){
        this._isWaitForEndCallCrossbarEventTimer = setTimeout(()=>{
          // No hangup event from other side is received. Consider other user has abnormally left the call. Now do not mark the call as completed.
          // Call completed only if this user is still in call and other re joins the call (need to be handled)
          // Call completed if both the users joins the call again
          // If this user lefts the call, call will be still on_going
          this._isWaitForEndCallCrossbarEventTimer = undefined;
          if(this._isCallEndedByDoctor == false){ // Double check for receiving crossbar event
            if(this.teleconsultJitsiService._is_videoConferenceLeftFired == true){
              // This is the device which is facing some issues
              this.showModal('Looks like Network Issue. If within time, You can rejoin from My Appointments page', false);
              // alert('Looks like Network Issue. If within time, You can rejoin from My Appointments page');
              this.teleconsultJitsiService.jitsiMeetExternalAPI.dispose();
              setTimeout(()=>{
                this.hideModal();
                this._constant.videoWindow = false;
                this._constant.videoCallStart = false;
                this.router.navigate(['/teleconsultation']);
                this.resetJitsiService();
                return;
              }, 7000);
              return;
            }
            this._isOngoingCallValid = false;
            if(this._constant.directCallfind == true){
              this.showModal('Other side seems to face some technical issue. If within time, You can rejoin from My Appointments page', false, {hideButton:false});
                setTimeout(()=>{           
                  this.hideModal();       
                  this._constant.videoWindow = false;
                  this._constant.videoCallStart = false;
                  this.router.navigate(['/myappointment']);
                  this.resetJitsiService();
                }, 1000 * 6);              
            } else {
              this.showModal('Other side seems to face some technical issue. Please wait for sometime', false, {hideButton:true});  
            }
            //this.showModal('Other side seems to face some technical issue. Please wait for sometime', false, {hideButton:true});
            // alert('Other side seems to face some technical issue. Please wait for sometime');
          }
        },
        WAIT_TIME_FOR_END_CALL_CROSSBAR_EVENT_TO_RECEIVE)
      }
    }
    this.teleconsultJitsiService._jitsi_onParticipantJoined = async (res)=>{
      if(this.teleconsultJitsiService.getNumberOfParticipants() == 2){
        this._isOngoingCallValid = true;
      }
    }
    this.teleconsultJitsiService._jitsi_onVideoConferenceJoined = async (res)=>{
      //alert("user joined");
      this.updateCallLog('user', this.teleconsultCrossbarService.user_id, 'join', this._appointment_id);
      this.teleconsultJitsiService._jitsi_onParticipantJoined();
    }
    let _options:JitsiInitInterface = {
      room_id:room_id,
      displayName:this._user_name,
    }
    setTimeout(()=>this.teleconsultJitsiService.init(_options), 500);
  }

  initiateBookAppointmentCall():void{
    if(this._isOngoingCall == true) return;
    // if(this._doctorStatus != 'Online') return;
    if(this._appointment_id == undefined || this._appointment_id == null) return;
    
    if(this._callAcceptTimer != undefined) return;
    this._isOngoingCall = true;
    this._isCallEndedByDoctor = false;
    this._isOngoingCallValid = true;
    if(this._isWaitForEndCallCrossbarEventTimer != undefined){
      clearTimeout(this._isWaitForEndCallCrossbarEventTimer);
      this._isWaitForEndCallCrossbarEventTimer = undefined;
    }
    // this.updateAppointmentCallStatus(this._appointment_id,'requested');
    this.hideModal();    
    let room_id = 'IHLTeleConsult' + this._appointment_id;
    this._constant.videoWindow = true;
    this._constant.videoCallStart = true;
    this.teleconsultJitsiService._jitsi_onHangup = async ()=>{
      if(this._isWaitForEndCallCrossbarEventTimer){
        clearTimeout(this._isWaitForEndCallCrossbarEventTimer);
        this._isWaitForEndCallCrossbarEventTimer = undefined;
      }
      if(this.appointment_call_status == 'on_going'){
        
        if(this._isOngoingCallValid == false){
          // Not marked as completed
          this.showModal('Call ended abornamlly. If within time, you can reconnect from My Appointments page. Sorry for Inconvenience', false);
          setTimeout(()=>{
            if(this.teleconsultJitsiService.jitsiMeetExternalAPI != undefined){
              this.teleconsultJitsiService.jitsiMeetExternalAPI.dispose();
            }            
            this.router.navigate(['/myappointment']);
            return;
          },1000 * 6);
          return;
        }
        if(this._isCallEndedByDoctor == false){

          if (this._constant.fireStore) {
            let senderId = JSON.parse(this._constant.aesDecryption('userData'))['id'];
            let _data = {
              'data': {'cmd': 'CallEndedByUser',  'vid':this._appointment_id, 'vid_type':'BookAppointmentCall'},
              'receiver_ids': [this._selectedDoctorId],
              'sender_id': senderId,
            };
            this.fireStoreService.update(this._appointment_id, _data, 'testteleconsultationServices');
            this.updateCallLog('user', senderId, 'exit', this._appointment_id);
          } else {
            // Update to doctor
            let _data = {
              'cmd':'CallEndedByUser',
              'vid': this._appointment_id,
              'vid_type': 'BookAppointmentCall',
            };
            let _options:PublishToChannelOptions = {
              'receiver_ids':[this._selectedDoctorId],
              'eligible': []
            }
            this.teleconsultCrossbarService.publishToChannel('ihl_send_data_to_doctor_channel', _data, _options);
            this.updateCallLog('user', this.teleconsultCrossbarService.user_id, 'exit', this._appointment_id);
          }
        }
        await this.updateAppointmentCallStatus(this._appointment_id,'completed');
        if(this._constant.transactionIdForTeleconsultation != undefined && this._constant.transactionIdForTeleconsultation != ""){
          this.updateServiceProvidedStatus();
        }
        this.initiateAfterCallEndPerscriptionFlow();
        this.teleconsultJitsiService.jitsiMeetExternalAPI.dispose();
      }else{
        this.showModal('Call Ended. Redirecting to Dashboard', false);
          setTimeout(()=>{
            this.hideModal();
            this.router.navigate(['/teleconsultation']);
            return;
          }, 3000);
      }
      
    }
    
    this.teleconsultJitsiService._jitsi_onParticipantJoined = async (res)=>{
      console.error('--- in paritipant joined ', res, await this.teleconsultJitsiService.getNumberOfParticipants());
      if(await this.teleconsultJitsiService.getNumberOfParticipants() == 2){
        // Updating status as Ongoing
        this.updateAppointmentCallStatus(this._appointment_id,'on_going');
        this._isOngoingCallValid = true;
        this.hideModal();
      }
    }
    this.teleconsultJitsiService._jitsi_onVideoConferenceJoined = async (res)=>{
      //alert("user joined");
      this.updateCallLog('user', this.teleconsultCrossbarService.user_id, 'join', this._appointment_id);
      console.error(' ---- in video conference event joined', this.teleconsultJitsiService.getNumberOfParticipants());
      this.showModal('Consultant is not joined the call. please wait for sometime to consultant join the call.', false, {hideButton:true});
      if(this.teleconsultJitsiService.getNumberOfParticipants() == 2){
        // Another User already in call, but from also firin an API to update the status
        this.updateAppointmentCallStatus(this._appointment_id, 'on_going');
        this._isOngoingCallValid = true;
        this.hideModal();
      }
      else{
        // Here it will return 1. So wait for other to join and ParticipantJoined will update the status to on_going
      }
    }
    this.teleconsultJitsiService._jitsi_onParticipantLeft = async (res)=>{
      // Set timeout for crossbar event for call cut from other side
      if(this._isWaitForEndCallCrossbarEventTimer == undefined){
        this._isWaitForEndCallCrossbarEventTimer = setTimeout(()=>{
          if(this._isCallEndedByDoctor == false){ // Double check for receiving crossbar event
            if(this.teleconsultJitsiService._is_videoConferenceLeftFired == true){
              // This is the device which is facing some issues
              this.showModal('Looks like Network Issue. If within time, You can rejoin from My Appointments page', false);
              // alert('Looks like Network Issue. If within time, You can rejoin from My Appointments page');
              this.teleconsultJitsiService.jitsiMeetExternalAPI.dispose();
              setTimeout(()=>{
                this.hideModal();
                this._constant.videoWindow = false;
                this._constant.videoCallStart = false;
                this.router.navigate(['/teleconsultation']);
                this.resetJitsiService();
                return;
              },7000);
              return;
            }
            this._isOngoingCallValid = false;
            this._constant.directCallfind = false;
            this.showModal('Other side seems to face some technical issue. Please wait for sometime', false, {hideButton:true});
            // alert('Other side seems to face some technical issue. Please wait for sometime');
          }
          this._isWaitForEndCallCrossbarEventTimer = undefined;
        },
        WAIT_TIME_FOR_END_CALL_CROSSBAR_EVENT_TO_RECEIVE)
      }
    }
    let _options:JitsiInitInterface = {
      room_id:room_id,
      displayName:this._user_name,
    }
    setTimeout(()=>this.teleconsultJitsiService.init(_options), 0);

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
        this.appointment_call_status = new_status;
        resolve(true);
      })
    })
  }

  showLoadingModalSpinner:boolean = false;
  showLoadingModalContent:string = '';
  showLoadingModal:boolean = false;
  showLoadingModalHideButton:boolean = false;
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
  }


  async initiateAfterCallEndPerscriptionFlow():Promise<void>{
    this.showModal('Waiting for prescription or additional information', true);
    this._isWaitForPrescriptionTimer = setTimeout(()=>{
      this.afterCallPerscriptionStatus({'perscription_status':false});
    }, WAIT_TIME_FOR_PERSCRIPTION_STATUS_TO_RECEIVE);
  }

  async afterCallPerscriptionStatus(param = {}):Promise<void>{
    console.log("prescription status in param is ");
    console.log(param);
    console.log(`this._isWaitForPrescriptionTimer is ${this._isWaitForPrescriptionTimer}`);
    if('perscription_status' in param == false) return;
    if(this._isWaitForPrescriptionTimer == undefined) return;
    clearInterval(this._isWaitForPrescriptionTimer);
    this._isWaitForPrescriptionTimer = undefined;
    if(param['perscription_status'] == true){
      this.showLoadingModalContent = 'Consultant/Doctor is providing some prescription or vital information. Please wait few minutes';
      this._isWaitForPrescriptionTimer = setTimeout(()=>{
        this.showLoadingModalContent = 'Sorry for Inconvenience. Prescription will be updated as it is received. You can also view from Consultation History page';
        setTimeout(()=>{
          this.hideModal();
          this.router.navigate(['/teleconsultation']);
          return;
        }, 5000);
      }, WAIT_TIME_FOR_PERSCRIPTION_TO_RECEIVE);
    }
    if(param['perscription_status'] == false){
      this.showLoadingModalContent = 'No prescription to be provided. Redirecting to Dashboard';
      setTimeout(()=>{
        this.hideModal();
        this.router.navigate(['/teleconsultation']);
        return;
      }, 5000);
      return;
    }
  }

  async afterCallPerscriptionReceived(param):Promise<void>{
    if(this._isWaitForPrescriptionTimer != undefined){
      clearTimeout(this._isWaitForPrescriptionTimer);
    }
    let perscription_obj = param['perscription_obj'];
    this._constant.doctorPrescribedData = perscription_obj;

    this.showModal('Prescription or additional information received. Redirecting to Call Summary page', false);
    setTimeout(()=>{
      this.hideModal();
      this.router.navigate(['/consult-summary']);
      return;
    }, 3000);
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

  private get CHANNEL_LIST():Channel[]{
    return [
      {
        'channel_name':'ihl_send_data_to_user_channel',
        'subscription_handler':(param, sender_id, sender_session_id)=>{this.messageFromSendDataToUserSubscription(param, sender_id, sender_session_id);}
      }
    ];
  }
  

  initiateFitnessClassAppointment():void{
    if(this._isOngoingCall == true) return;
    // if(this._doctorStatus != 'Online') return;
    if(this._appointment_id == undefined || this._appointment_id == null) return;
    if(this._callAcceptTimer != undefined) return;
    this._isOngoingCall = true;
    this._isCallEndedByDoctor = false;
    // this.updateAppointmentCallStatus(this._appointment_id,'requested');
    this.hideModal();    
    //alert("class started/ended");
    let room_id = 'IHLTeleConsultClass' + this._appointment_id;
    this._constant.videoWindow = true;
    this._constant.videoCallStart = true;
    this.teleconsultJitsiService._jitsi_onHangup = async ()=>{
      console.log('Call ended');
      this.displayMessage = 'Call ended';
      // if(this._isCallEndedByDoctor == false){
        // Update to doctor
        // let _data = {
          // 'cmd':'CallEndedByUser'
        // };
        // let _options:PublishToChannelOptions = {
          // 'receiver_ids':[this._selectedDoctorId],
          // 'eligible': []
        // }
        // this.teleconsultCrossbarService.publishToChannel('ihl_send_data_to_doctor_channel', _data, _options);
        // await this.updateAppointmentCallStatus(this._appointment_id,'completed');
        // this.initiateAfterCallEndPerscriptionFlow();
        if(this._isCallEndedByDoctor == true){
          this.showModal('Thanks for joining the class. Redirecting to Dashboard');
          setTimeout(() => {
            this._constant.isOnlineClassEnded = true;
            this.dialog.open(ModalComponent);
          }, 5000);
        
        }else{
          this.showModal('Call Ended. Redirecting to Dashboard', false);
          this.updateCallLog('user', this.teleconsultCrossbarService.user_id, 'exit', this._constant.newSubscriptionId);
          setTimeout(() => {
            this._constant.isOnlineClassEnded = true;
            this.dialog.open(ModalComponent);
          }, 5000);
        }
        setTimeout(()=>{
          this.hideModal();
          //this.router.navigate(['/teleconsultation']);
          this.router.navigate(['/fitnessPage']);
          return;
        }, 3000);
      // }
    }
    
    // this.teleconsultJitsiService._jitsi_onParticipantJoined = async (res)=>{
    //   if(await this.teleconsultJitsiService.getNumberOfParticipants() == 2){
    //     // Updating status as Ongoing
    //     this.updateAppointmentCallStatus(this._appointment_id,'on_going');
    //   }
    // }
    let _options:JitsiInitInterface = {
      room_id:room_id,
      displayName:this._user_name,
    }
    setTimeout(()=>this.teleconsultJitsiService.init(_options), 0);

    this.isIframeLoaded().then((data) => {
      this.updateCallLog('user', this.teleconsultCrossbarService.user_id, 'join', this._constant.newSubscriptionId);
    })
    
  }

  resetJitsiService(){
    this.teleconsultJitsiService._is_connected = false;
    this.teleconsultJitsiService.jitsiMeetExternalAPI = undefined;
    this.teleconsultJitsiService.displayName = '';

    // Events
    this.teleconsultJitsiService._jitsi_onload = undefined;
    this.teleconsultJitsiService._jitsi_onHangup = undefined;
    this.teleconsultJitsiService._jitsi_onParticipantJoined = ()=>{};
    this.teleconsultJitsiService._jitsi_onVideoConferenceJoined = ()=>{};
    this.teleconsultJitsiService._jitsi_onParticipantLeft = ()=>{};
    
    this.teleconsultJitsiService._is_videoConferenceLeftFired = false;
    
    this._constant.directCallfind = false;
  }

  async updateCallLog(host: string, hostId: (string | number | any), action: string, refId: (string  | number | any), courseId?: any){
    let [hostParam, hostIdParam, actionParam, refIdParam, courseIdParam] = [host, hostId, action, refId, courseId];
    if (courseIdParam == undefined || courseIdParam == null) {
      courseIdParam = '';
    }
    let logObj: callLogObj = {
      "host": hostParam,
      "hostId": hostIdParam,
      "action": actionParam,
      "refId": refIdParam,
      "courseId": courseIdParam
    }
    console.log(logObj);
    this._teleConsultService.updateCallLogDetails(logObj).subscribe(data=>{
      console.log(data);
    });
  }

  isIframeLoaded = async() => {
    var data = document.getElementsByTagName("iframe");; 
    return data; 
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

}

interface callLogObj{
  host: string;
  hostId: string | number;
  action: string;
  refId: string | number;
  courseId?: any;
}

