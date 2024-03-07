import { Component, OnInit, OnDestroy } from '@angular/core';
import { TeleConsultService } from '../../services/tele-consult.service';
import { ConstantsService } from '../../services/constants.service';
import { TeleconsultationCrossbarService, Channel } from '../../services/tele-consult-crossbar.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EventEmitterService } from 'src/app/services/event-emitter.service';
import { AuthServiceLogin } from 'src/app/services/auth.service.login';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ModalComponent } from '../modal/modal.component';
import { GlobalCdnService } from 'src/app/services/global-cdn.service';
import { FireStoreService } from '../../services/firestore.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-teleconsult-mysubscription',
  templateUrl: './teleconsult-mysubscription.component.html',
  styleUrls: ['./teleconsult-mysubscription.component.css']
})
export class TeleconsultMySubscriptionComponent implements OnInit, OnDestroy {
  resultArray: any[] = [];
  joinCallBtnClassLoad:boolean = false;
  consultationHistory: any = [];
  consultationActiveSubscriptions:any = [];  
  billObj: any;
  isLoading:boolean = true;
  course_duration:any;
  title:any;
  provider:any;
  course_fees:any;
  userName:any;
  userMobNumber:any;
  userMail:any;
  todayDate:Date = new Date();
  userDataReceived: boolean = false;
  userApiTriggerCount: number = 0;
  deductedIgstAmt: any = 0;
  igstAmt: any = 0;
  sgstAmt: any = 0;
  state: any;
  /**
   * To map trainer/consultant id with current status
   */
  trainerStatusMapping = {};
  /**
   * Maps the active subscription id with its corresponding trainer/consultant id 
   */
  subscriptionIdMappingWithTrainerId = {};
  noActiveSubscription: boolean = false;


  constructor(private _teleConsultService:TeleConsultService,
              private teleConsultCrossbarService:TeleconsultationCrossbarService,
              private router: Router,
              private _constantsService: ConstantsService,
              private authServiceLogin: AuthServiceLogin,
              private authService: AuthService,
              private dialog: MatDialog,
              private snackBar: MatSnackBar,
              private eventEmitterService: EventEmitterService,
              private globalCdn: GlobalCdnService,
              private fireStoreService: FireStoreService) { }

  ngOnInit() {
    this.globalCdn.load('autobahn');
    this.ngAfterOnInit();
  }

  async ngAfterOnInit(){
    // let userData = JSON.parse(this._constantsService.aesDecryption("userData"));
    // this.authService.viewAllSubscriptionsPagination().subscribe(data => {
    //   console.log(data);
    //   this.populateData(data);
    //   this.userDataReceived = true;
    // },
    // (error: any): void => {
    //   console.log("user data error");
    //   if (this.userApiTriggerCount <= 2) {
    //     this.ngAfterOnInit();
    //     this.userApiTriggerCount++;
    //   }else{
    //     this.isLoading = false;
    //     this.userDataReceived = false;
    //   }
    // });
    // var resultArray = [];
    await this.viewAllSubsLoop();
  }

  async viewAllSubsAPICall(startIndex: number, endIndex: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this._teleConsultService.viewAllSubscriptionsPagination(startIndex, endIndex).subscribe(
        (data: any) => {
          console.log(data);
          resolve(data);
        },
        (error: any): void => {
          console.log("user data error");
          reject(error);
        }
      );
    });
  }

  async viewAllSubsLoop() {
    var startIndex = 1;
    var endIndex = 20;
    this.joinCallBtnClassLoad = true;

    while (true) {
      try {
        var methodResult = await this.viewAllSubsAPICall(startIndex, endIndex);

        console.log(methodResult);
        this.resultArray = this.resultArray.concat(methodResult.subscriptions);
        console.log(this.resultArray);
        this.populateData({subscriptions: this.resultArray});
        this.userDataReceived = true;

        if (methodResult.subscriptions.length < 20) {
          this.joinCallBtnClassLoad = false;
          break;
        }

        startIndex += 20;
        endIndex += 20;
      } catch (error) {
        if (this.userApiTriggerCount <= 2) {
          this.ngAfterOnInit();
          this.userApiTriggerCount++;
        } else {
          this.isLoading = false;
          this.userDataReceived = false;
          break;
        }
      }
    }
  }

  async ngOnDestroy(){
    console.log('ng on destroy');
    await Promise.all(
      [
        this.teleConsultCrossbarService.unSubscribeToChannel('ihl_update_doctor_status_channel'),
        this.teleConsultCrossbarService.unSubscribeToChannel('IHL_CALL_AND_CLASS_STATUS')
      ]
    ).then(res=>{
      console.log(res);
      console.log('Unsubscribed');
    });
    console.log('After unsubscribed');
    this.resetJoinCallButtonSequenceTimer();
    this.resetJoinCallButtonAssociatedObjects();
  }

  populateData(platform_data):void{
    // if('my_subscriptions_history' in  platform_data){
    //     this.consultationHistory = platform_data['my_subscriptions_history'];
    // }
    if('subscriptions' in platform_data){
      platform_data['subscriptions'].forEach(element => {
        let splitDate = element.course_duration.split(' ');
        let startDateSplit = splitDate[0].split('-');
        let endDateSplit = splitDate[2].split('-');
        let startDate = startDateSplit[1]+"/"+startDateSplit[2]+"/"+startDateSplit[0];
        let endDate = endDateSplit[1]+"/"+endDateSplit[2]+"/"+endDateSplit[0];
        element['course_duration'] = startDate+" - "+endDate;
      });
      console.log(platform_data['subscriptions']);
      //this.consultationActiveSubscriptions = platform_data['my_subscriptions'];
      let activeSubscriptions = [];
      let expiredSubscriptions = [];
      let overAllSubscriptionDetails = platform_data['subscriptions'];
      if (overAllSubscriptionDetails.length > 0 && overAllSubscriptionDetails !== null && overAllSubscriptionDetails !== undefined) {
        let filterAcceptedData = overAllSubscriptionDetails.filter(obj => {
          return (obj.approval_status === "Accepted" || obj.approval_status === "accepted" || obj.approval_status === null || obj.approval_status.toLowerCase() == "requested" || obj.approval_status === "Approved" || obj.approval_status === "approved") && obj.class_detail !== 'not available';
        });

        console.log(filterAcceptedData.length);
        if (filterAcceptedData.length > 0 && filterAcceptedData !== null) {
          filterAcceptedData.forEach(element => {
            element.course_duration = element.course_duration.replace(/undefined\//g, '');
            let course_duration = element.course_duration.split(" ");
            let course_timings = element.course_time.split("-");
            let todayDate = new Date();
            let durationDate = new Date(course_duration[2] + course_timings[1]);
            if (durationDate.getTime() >= todayDate.getTime()) {
              activeSubscriptions.push(element);
            }
          });
        }

        let historyData = overAllSubscriptionDetails;
        historyData.forEach(element => {
          if ((element.approval_status === "Accepted" || element.approval_status === "accepted" || element.approval_status === null || element.approval_status.toLowerCase() == "requested" || element.approval_status === "Approved" || element.approval_status === "approved") && element.class_detail !== "not available") {
            element.course_duration = element.course_duration.replace(/undefined\//g, '');
            let course_duration = element.course_duration.split(" ");
            let course_timings = element.course_time.split("-");
            let todayDate = new Date();
            let bookedDate = new Date(course_duration[2] + course_timings[1]);
            if (bookedDate.getTime() < todayDate.getTime()) {
              expiredSubscriptions.push(element);
            }
          }else if ((element.approval_status === "Rejected" || element.approval_status === "rejected") && element.class_detail !== "not available") {
            expiredSubscriptions.push(element);
          }else if ((element.approval_status === "canceled" || element.approval_status === "Canceled" ||  element.approval_status === "Cancelled" || element.approval_status === "cancelled") && element.class_detail !== "not available") {
            expiredSubscriptions.push(element);
          }
        });
        
      }
      console.log(activeSubscriptions);
      this.isLoading = false;
      this.consultationActiveSubscriptions = activeSubscriptions;
      setTimeout(() => {
        if(this.consultationActiveSubscriptions.length == 0){
          this.noActiveSubscription = true;
        }else{
          this.noActiveSubscription = false;
        }
      }, 10000);
      this.consultationHistory = expiredSubscriptions;
      if (this._constantsService.fireStore)
        this.initiateFireStore();
      else
        this.initiateCrossbar();
      this.generateJoinCallStatusSequence(this.consultationActiveSubscriptions);
    }
  }

  /* populateData(platform_data):void{
    if('consultation_user_data' in  platform_data){
      if('my_subscriptions_history' in platform_data['consultation_user_data']){
        this.consultationHistory = platform_data['consultation_user_data']['my_subscriptions_history'];
      }
      if('my_subscriptions' in platform_data['consultation_user_data']){
        this.consultationActiveSubscriptions = platform_data['consultation_user_data']['my_subscriptions'];
      }
    }
  } */

  renewCourse(course):void{
    console.log(course);
    this.snackBar.open("Feature is coming soon", '',{
      duration: 3000,
    });
  }

  isCourseLive(course):Boolean{
    //console.log(course.approval_status);
    if(course.approval_status == null) return false;
    if(course['approval_status'].toLowerCase() == 'accepted') return true;
    return false;    
  }

  cancelCourseWithoutReason(course){
    let newObj = course;
    this._constantsService.teleconsultMySubscriptionCancelButton = true;
    this.dialog.open(ModalComponent).afterClosed().subscribe(response=>{
      this._constantsService.teleconsultMySubscriptionCancelButton = false;
      console.log(response);
      if (response != undefined && response != null) {
        this.cancelCourse(newObj, response);
      }
    });
  }

  cancelCourseWithReason(course){
    let newObj = course;
    this._constantsService.teleconsultMySubscriptionRefundCancelButton = true;
    this.dialog.open(ModalComponent).afterClosed().subscribe(response=>{
      this._constantsService.teleconsultMySubscriptionRefundCancelButton = false;
      console.log(response);
      if (response != undefined && response != null) {
        this.cancelCourse(newObj, response);
      }
    });
  }

  cancelCourse(course, response){
    this._constantsService.cancelAppointmentModelBoxTitle = 'Wellness Care E-Marketplace';
    console.log(course);

    let JsonReq = {
      subscription_id: course['subscription_id'],     
      canceled_by: "user",// or trainer
      reason: response
    }
    console.log(JsonReq);
    this._constantsService.processingContent = true;
    this.dialog.open(ModalComponent);
    if(course['course_fees'] != undefined && course['course_fees'] == "0"){
      //alert("zero fees");
      var appointmentStat ={
        "company_name": course['provider'],
        "subscription_id": course['subscription_id'],
        "subscription_status": "Cancelled"
      };

      this.authService.appointmentDatAccept_Reject(appointmentStat).subscribe(data =>  {
        console.log(data);
        this._constantsService.processingContent  = false;
        this.eventEmitterService.onModalClose();
        if (data === "Database Updated") {
          this.consultationActiveSubscriptions.find(obj =>{
            if (obj['subscription_id'] === course['subscription_id']) {
              return obj['approval_status'] = 'Cancelled';
            }
          });
          this.consultationActiveSubscriptions = this.consultationActiveSubscriptions.filter(obj =>{
            //alert( obj['approval_status']);
            return obj['approval_status'] !== "Cancelled";
          });
          this.consultationHistory.push(course);
          console.log(this.consultationActiveSubscriptions);
          console.log(this.consultationHistory);
          this.snackBar.open("Subscription cancelled", '',{
            duration: 4000,
          });
                  
        }else if (data === "Not Updated") {
          this._constantsService.processingContent  = false;
          this.eventEmitterService.onModalClose();
          this.snackBar.open("Sorry something went wrong", '',{
            duration: 4000,
          });
        }
      });
      return;
    }
    this.authService.cancelSubscriptionWithRefund(JsonReq).subscribe(jsonRes => {
      console.log(jsonRes);      
      var appointmentStat ={
        "company_name": course['provider'],
        "subscription_id": course['subscription_id'],
        "subscription_status": "Cancelled"
      };

      this.authService.appointmentDatAccept_Reject(appointmentStat).subscribe(data =>  {
        console.log(data);
        this._constantsService.processingContent  = false;
        this.eventEmitterService.onModalClose();
        if (data === "Database Updated") {
          this.consultationActiveSubscriptions.find(obj =>{
            if (obj['subscription_id'] === course['subscription_id']) {
              return obj['approval_status'] = 'Cancelled';
            }
          });
          this.consultationActiveSubscriptions = this.consultationActiveSubscriptions.filter(obj =>{
            //alert( obj['approval_status']);
            return obj['approval_status'] !== "Cancelled";
          });
          this.consultationHistory.push(course);
          console.log(this.consultationActiveSubscriptions);
          console.log(this.consultationHistory);

          
        this._constantsService.cancelAndRefundAppointment = true;        
        this.dialog.open(ModalComponent);  
        
        setTimeout(() => { 
          this._constantsService.cancelAndRefundAppointment = false;
          this.eventEmitterService.onModalClose();
        }, 1000 * 6);     
          /* setTimeout(()=>{
            this.snackBar.open("unsubscribed the class successfully", '',{
              duration: 4000,
            });
          },1000) */
        }else if (data === "Not Updated") {
          this._constantsService.processingContent  = false;
          this.eventEmitterService.onModalClose();
          this.snackBar.open("Sorry something went wrong", '',{
            duration: 4000,
          });
        }
      });

    });
  }
  
  printBill(billContents: any) {
    console.log(billContents);
    this.billObj = billContents;
    this.course_duration = billContents.course_duration;
    this.title = billContents.title;
    this.provider = billContents.provider;
    this.course_fees = billContents.course_fees;    
    let userDetail = JSON.parse(this._constantsService.aesDecryption('userData'));
    this.state = userDetail.state.toLowerCase();
    this.userName = `${userDetail.firstName} ${userDetail.lastName}`;
    this.userMobNumber = (userDetail.mobileNumber !== undefined && userDetail.mobileNumber !== null && userDetail.mobileNumber.trim().length === 10) ? userDetail.mobileNumber : "NA";
    this.userMail = (userDetail.email !== undefined && userDetail.email !== null && userDetail.email.trim().length > 0) ? userDetail.email : "NA";
    
    if(billContents.course_fees > 0) {
      this.deductedIgstAmt = (Number(billContents.course_fees) / 1.18).toFixed(2);
	    this.igstAmt =  (Number(this.deductedIgstAmt) * 18 / 100).toFixed(2);
	    this.sgstAmt = (Number(this.deductedIgstAmt) * 9 / 100).toFixed(2);
    }
    setTimeout(() => {
      window.print(); 
    }, 1000);
  }

  joinCall(course){
    console.log(course);

  ///////////////// External URL Link code ///////////////

  if(course.external_url != '' && course.external_url != undefined){
    console.log(course.external_url);
    window.open(course.external_url, '_blank');
  }
  else{
    // TODO: check if host is online and button is enabled
    this._constantsService.liveCallCourseObj = course;
    this._constantsService.reachingVideoCallPageFrom = 'FitnessClass';
    this._constantsService.selectedDoctor = {'ihl_consultant_id':course.consultant_id}; // trainer id
    this._constantsService.newAppointmentID = course.course_id; // course id
    this._constantsService.newSubscriptionId = course.subscription_id; // subscription id
    this.router.navigate(['/teleconsult-video-call']);
  }
  }

  initiateFireStore() {
    // Prepare the consultant Ids
    if(this.consultationActiveSubscriptions == undefined || this.consultationActiveSubscriptions == null || this.consultationActiveSubscriptions.length == 0) return;
    this.consultationActiveSubscriptions.forEach(item=>{
      this.trainerStatusMapping[item.consultant_id] = 'Offline';
      this.subscriptionIdMappingWithTrainerId[item.course_id] = item.consultant_id;
    });

    this.fireStoreService.getAll(this._constantsService.consultantOnlineCollectionName).snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      data.forEach((val) => {
          //this.updateDoctorStatus(val, val['consultantId'], '');
          console.log(val);
          this.updateDoctorStatusFromCrossbar(val, val['consultantId'], '');
      });
    });
  }

  initiateCrossbar():void{
    // Prepare the consultant Ids
    if(this.consultationActiveSubscriptions == undefined || this.consultationActiveSubscriptions == null || this.consultationActiveSubscriptions.length == 0) return;
    this.consultationActiveSubscriptions.forEach(item=>{
      this.trainerStatusMapping[item.consultant_id] = 'Offline';
      this.subscriptionIdMappingWithTrainerId[item.course_id] = item.consultant_id;
    });
    
    // Important: Unsubscribe to channels in ngOnDestroy
    let options = {
      'subscription_channels_list':[
        {
          'channel_name':'ihl_update_doctor_status_channel',
          'subscription_handler':(param, sender_id, sender_session_id)=>{this.updateDoctorStatusFromCrossbar(param, sender_id, sender_session_id);},
        },
        {
          'channel_name':'IHL_CALL_AND_CLASS_STATUS',
          'subscription_handler':(param, sender_id, sender_session_id)=>{this.activeSubscriptionStatus(param, sender_id, sender_session_id);},
        }
      ],
    };
    // let classStatus = {
    //   'subscription_channels_list':[
    //     {
    //       'channel_name':'IHL_CALL_AND_CLASS_STATUS',
    //       'subscription_handler':(param, sender_id, sender_session_id)=>{this.activeSubscriptionStatus(param, sender_id, sender_session_id);},
    //     },
    //   ],
    // };

    this.teleConsultCrossbarService.on_connection_established = ()=>{
      //alert("connection established")
      this.getTrainerStatusFromApi();
    }
    this.teleConsultCrossbarService.user_id = JSON.parse(this._constantsService.aesDecryption('userData'))['id'];
    
    if(this.teleConsultCrossbarService.is_connected == true){
      let _channels_to_subscribe = [];
      // Updating Handlers
      options['subscription_channels_list'].forEach((item:Channel)=>{
        if(this.teleConsultCrossbarService.updateSubscriptionFunctionHandler(item.channel_name, item.subscription_handler) == false){
          _channels_to_subscribe.push(this.teleConsultCrossbarService.subscribeToChannel(item.channel_name, item.subscription_handler));
        }
      });

      Promise.all(_channels_to_subscribe).then(res=>{
        this.teleConsultCrossbarService.on_connection_established();
        //this.teleConsultCrossbarService.subscribeToChannel("IHL_CALL_AND_CLASS_STATUS", classStatus['subscription_channels_list'][0].subscription_handler);
      });

    }else{
      this.teleConsultCrossbarService.connect(options);
      // this.teleConsultCrossbarService.on_connection_established = ()=>{
      //   this.teleConsultCrossbarService.subscribeToChannel("IHL_CALL_AND_CLASS_STATUS", classStatus['subscription_channels_list'][0].subscription_handler);
      // }   
    }

  }

  activeSubscriptionStatus(param, sender_id, sender_session_id){
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/mysubscription']);
    });
  }

  updateDoctorStatusFromCrossbar(param, sender_id, sender_session_id){
    if('status' in param == false) return;
    let _doctor = this.trainerStatusMapping[sender_id];
    if(_doctor != undefined){
      if(param['status'] == 'Busy' && 'other_data' in param && param['other_data']['vid_type'] == 'SubscriptionClassCall' && this.subscriptionIdMappingWithTrainerId[param['other_data']['vid']] == sender_id){
        param['status'] = 'Online';
      }
      this.trainerStatusMapping[sender_id] = param['status'];
    }
  }

  getTrainerStatusFromApi(){
    let _consultant_ids = Object.keys(this.trainerStatusMapping);
    if(_consultant_ids.length == 0) return;
    this._teleConsultService.getDoctorStatus(_consultant_ids).subscribe(res=>{
      let _res = {'data':JSON.parse((res as string).replace(/(&quot\;)/g,"\""))};
      this.updateTrainerStatusListFromApi(_res['data']);
    });
  }

  updateTrainerStatusListFromApi(api_res):void{
    console.log(api_res);
    let n = api_res.length;
    let cur_date:any = new Date();
    let busy_ids = [];
    for(let i=0; i<n; i++){
      try{
        if(api_res[i]['status'] == 'Offline') continue;
        let _api_date:any = new Date(api_res[i]['timestamp']);
        if((cur_date - _api_date) >= (15*60*1000)) continue;
        let doctor_id = api_res[i]['consultant_id'];
        let doctor_obj = this.trainerStatusMapping[doctor_id];
        if(doctor_obj != undefined){
          let _status = api_res[i]['status'];
          if(_status == undefined || _status == null) _status = 'Offline';
          if(_status == 'Busy') busy_ids.push(doctor_id);
          this.trainerStatusMapping[doctor_id] = _status;
        }
      }catch(err){
        continue;
      }
    }
    if(busy_ids.length == 0) return;
    // Crossbar event to busy ids
    
    let channel_name = 'ihl_get_doctor_status_channel';
    let _data = {
    };
    let _options = {
      'receiver_ids':busy_ids,
      'exclude':[],
      'eligible':[],
    };
    this.teleConsultCrossbarService.publishToChannel(channel_name, _data, _options);
  }
    /**
   * Contains mapping of class/course id with boolean value whether to enable the join call button or not
   */
  joinClassButtonShowMapping = {};

  joinClassButtonSequence = [];
  joinClassButtonSequenceTimer = undefined;


  resetJoinCallButtonAssociatedObjects(){
    this.joinClassButtonSequence = [];
    this.joinClassButtonShowMapping = {};
  }

  resetJoinCallButtonSequenceTimer(){
    if(this.joinClassButtonSequenceTimer != undefined){
      clearTimeout(this.joinClassButtonSequenceTimer);
    }
    this.joinClassButtonSequenceTimer = undefined;
  }


  
  generateJoinCallStatusSequence(classList:any[]){
    this.resetJoinCallButtonSequenceTimer();
    this.resetJoinCallButtonAssociatedObjects();
    let valid_class_list = [];
    valid_class_list = classList.filter(_class=>{ return this._isValidClass(_class) });
    console.log(valid_class_list);

    let now_date:Date = new Date();
    // let now_date_hh = now_date.getHours();
    // let now_date_min = now_date.getMinutes();
    // let now_time = (now_date_hh*100 + now_date_min);

    let sequence_list:ClassSequenceInterface[] = [];
    valid_class_list.forEach(_class=>{
      
      let [start_time_arr, end_time_arr] = this._extractStartTimeAndEndTime(_class.course_time);
      let end_date = new Date();
      end_date.setHours(end_time_arr[0]);
      end_date.setMinutes(end_time_arr[1]);
      if(end_date <= now_date) return;
      let start_date = new Date();
      start_date.setHours(start_time_arr[0]);
      start_date.setMinutes(start_time_arr[1]);
      sequence_list.push({class_id:_class.subscription_id, show_join_call_button:true, at_time:start_date.getTime()}); // Replace it with subscription id
      sequence_list.push({class_id:_class.subscription_id, show_join_call_button:false, at_time:end_date.getTime()}); // Replace it with subscription id
    
      
      // _class.course_time.forEach(_class_time=>{
      //   let [start_time_arr, end_time_arr] = this._extractStartTimeAndEndTime(_class_time);
      //   let end_date = new Date();
      //   end_date.setHours(end_time_arr[0]);
      //   end_date.setMinutes(end_time_arr[1]);
      //   if(end_date <= now_date) return;
      //   let start_date = new Date();
      //   start_date.setHours(start_time_arr[0]);
      //   start_date.setMinutes(start_time_arr[1]);
      //   sequence_list.push({class_id:_class.course_id, show_join_call_button:true, at_time:start_date.getTime()});
      //   sequence_list.push({class_id:_class.course_id, show_join_call_button:false, at_time:end_date.getTime()});
      // });
    });
    console.log(sequence_list);
    
    if(sequence_list.length == 0) return;

    // Sort by time
    sequence_list.sort((a,b)=>{return a.at_time - b.at_time});
    
    // execute the sequence
    this.joinClassButtonSequence = sequence_list;
    this.executeJoinCallButtonEnableDisableSequence();
  }

  
  /**
   * @description Executes the Sequence
   */
  executeJoinCallButtonEnableDisableSequence():void{
    if(this.joinClassButtonSequence.length == 0){
      this.resetJoinCallButtonSequenceTimer();
      return;
    }
    let now_date:Date = new Date();
    // let now_date_hh = now_date.getHours();
    // let now_date_min = now_date.getMinutes();
    // let now_time = (now_date_hh*100 + now_date_min);
    let class_obj:ClassSequenceInterface = this.joinClassButtonSequence[0];
    console.log(class_obj.at_time, now_date);
    let time_diff = class_obj.at_time - now_date.getTime(); // diff in milliseconds
    /**
     * time_diff if positive or zero: event is yet to happen 
     * time_diff if negative or zero: ongoing event 
     */

    // Handling scenario to enable the join call button before 5 mins of upcomming appointment and no previous appointment before that slot or previous appointment slot has been completed
    if(time_diff > 0 && class_obj.show_join_call_button == true){
      this.joinClassButtonSequence[0].at_time -= 5*60*1000; // 5 mins prior
      class_obj = this.joinClassButtonSequence[0];
      time_diff = class_obj.at_time - now_date.getTime();
    }

    // Moving forward the execution of sequence list
    if(time_diff <= 0){ 
      this.joinClassButtonShowMapping[class_obj.class_id] = class_obj.show_join_call_button;
      // Remove the ongoing event
      this.joinClassButtonSequence.shift();
      if(this.joinClassButtonSequence.length == 0) return;
      let now_date:Date = new Date();
      time_diff = this.joinClassButtonSequence[0].at_time - now_date.getTime();
      if(time_diff <= 0){
        // console.error("Error; Due to wrong lis formation or error values Aborting the process sequence execution");
        this.executeJoinCallButtonEnableDisableSequence();
        return;
      } 
      this.joinClassButtonSequenceTimer = setTimeout(()=>{
        this.executeJoinCallButtonEnableDisableSequence();
      }, time_diff);
      return;
    }
    else{
      // Event yet to happen
      this.joinClassButtonSequenceTimer = setTimeout(()=>{
        this.executeJoinCallButtonEnableDisableSequence();
      }, time_diff);

      return;
    }

  }



  _isValidClass(_class):boolean{
    // Validate by Week day
    if(this._isValidWeekDay(_class) == false) return false;
    // Validate by Date
    if(this._isValidDate(_class) == false) return false;
    return true;
  }

  _isValidDate(_class):boolean{
    try{
      //let [start_date_arr, end_date_arr] = _class.course_duration.split(' - ').map(item=>{return item.trim();}).map(item=>{ return item.split('-'); });
      let [start_date_arr, end_date_arr] = _class.course_duration.split(' - ').map(item=>{return item.trim();}).map(item=>{ return item.split('/'); });
      // date, month, year
      //let start_date = new Date(start_date_arr[0],start_date_arr[1]-1,start_date_arr[2]);
      //let end_date = new Date(end_date_arr[0],end_date_arr[1]-1,end_date_arr[2], 23, 59,59);
      let start_date = new Date(start_date_arr[2],start_date_arr[0]-1,start_date_arr[1]);
      let end_date = new Date(end_date_arr[2],end_date_arr[0]-1,end_date_arr[1], 23, 59,59);
      let now_date = new Date();
      if(now_date >= start_date && now_date <= end_date){
        return true;
      }
      return false;
    }catch(err){
      console.log(err);
      return false;
    }
  }

  _isValidWeekDay(_class):boolean{
    if(_class.course_type == "Daily"){
      return true;
    }
    try{
      const DAY_MAPPING = {0:"Sunday",1:"Monday",2:"Tuesday",3:"Wednesday",4:"Thursday",5:"Friday",6:"Saturday"};
      let now_date:Date = new Date();
      let today_day = now_date.getDay();
      return _class.course_on.find(item=>{ return item == DAY_MAPPING[today_day]; }) != undefined;
    }catch(err){
      return false;
    }
  }

  /**
   * @param time_string string in format: "HH:MM AM/PM - HH:MM AM/PM"
   * @description Validate time
   * @returns boolean
   */
  _extractStartTimeAndEndTime(time_string):[[number,number],[number,number]]{
    let [start_time, end_time] = time_string.split(" - ").map(item=>{return item.trim();}).map(item=>{return this._getTimeInHours(item);});
    return [start_time, end_time];
  }

  /**
   * @param time_string 
   * @description Converts HH:MM AM/PM To 24 hrs format
   */
  _getTimeInHours(time_string):[number,number]{
    let is_pm = false;
    if(time_string.includes('AM') == false) is_pm = true;
    let [hh,mm] = ((time_string.split(' '))[0]).split(':').map((item:string)=>{return parseInt(item)});
    if(is_pm == false){
      if(hh == 12) hh = 0;
    }
    if(is_pm == true){
      if(hh != 12)
        hh += 12;
    }
    return [hh,mm];
  }
  
  showTeleDashboard(){
    //this.router.navigate(['/teleconsultation']);
    if(this._constantsService.teleconsultationFlowSelected == "affiliate"){ // back button functionality of affilation page for 4 pillar concept
      this.router.navigate(['/affiliated-users']);
    }else{ // back button functionality of normal flow
      this.router.navigate(['/fitnessPage']);
    }
  }

}

interface ClassSequenceInterface{
  class_id: number|string;
  show_join_call_button: boolean;
  at_time: number;
}