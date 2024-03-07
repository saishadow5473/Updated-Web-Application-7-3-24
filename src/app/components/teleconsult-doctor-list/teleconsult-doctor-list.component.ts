import { Component, OnInit, OnDestroy,ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { AuthServiceLogin } from 'src/app/services/auth.service.login';
import { AuthService } from 'src/app/services/auth.service';
import { TeleConsultService } from 'src/app/services/tele-consult.service';
import { ConstantsService } from 'src/app/services/constants.service';
import { TeleconsultationCrossbarService, Channel } from 'src/app/services/tele-consult-crossbar.service';
import moment from 'moment';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { data } from 'jquery';
import {MatSnackBar} from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { ModalComponent } from '../modal/modal.component';
import { DragScrollComponent } from 'ngx-drag-scroll';
import { throwError, fromEvent } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, switchMap, catchError, filter } from 'rxjs/operators';
import { FireStoreService } from '../../services/firestore.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-teleconsult-doctor-list',
  templateUrl: './teleconsult-doctor-list.component.html',
  styleUrls: ['./teleconsult-doctor-list.component.css']
})
export class TeleconsultDoctorListComponent implements OnInit, OnDestroy {

  // disableSelect = new FormControl(false);
  // cardExpendDynamic: string = "col-md-6 col-lg-4 col-xl-4";
  cardExpendDiv:boolean = false;
  doctorProfileView:boolean = false;
  bookAppointmentView:boolean = false;
  consultanttype: string
  specialityName: string
  doctorList: any[] = [];
  consultantList: any;
  selectedDoctor: string = "";
  selectedSlot: number = 0;
  dateTitle: any
  doctorSlotMorning: any
  doctorSlotAfternoon: any
  doctorSlotEvening: any
  doctorSlotNight: any
  selectedAppointmentIndex: any = null
  slotAllocation: any
  confirmButton:boolean = true;
  nextDoctorSlotIndex: any
  nextDoctorSlotTitle: any
  nextDoctorSlotMorning: any
  nextDoctorSlotAfternoon: any
  nextDoctorSlotEvening: any
  nextDoctorSlotNight: any
  doctorsLanguage: any
  disableLanguage:boolean = false;
  headerName: string = "Select Consultant";
  dropdownHidden: boolean = false;
  liveRatingStars: number[] = [1, 2, 3, 4, 5];
  liveRatingStarValue: number;
  docListIndex:number = 0;
  hideCallBtn:boolean = false;
  offlineDoctorCount:number = 0;
  noDoctorAvaTxt:boolean = false;
  doctor_ids;
  stars = [];
  iconClass = {
    0: 'far fa-star',
    0.5: 'fas fa-star-half-alt star_checked',
    1: 'fas fa-star star_checked'
  }
  showLoadingModal:boolean = false;
  showLoadingModalContent:string = '';
  showLoadingModalSpinner:boolean = false;
  selectedStar:number = 0;
  rateArray:number[] = [0,0,0,0,0];
  sendReview:boolean = false;
  searchResult:any = {};
  searchErrorMsg:any;
  @ViewChild('reviewField') reviewField: any;
  @ViewChild('dragScroll', {read: DragScrollComponent}) dragScroll: DragScrollComponent;
  // doctorStatusMappingList:{ihl_consultant_id:string|number,doctor_status:string,session_id:number}[] = [];
  doctorStatusMappingList = {};
  isDoctorOnline: boolean = true;
  consultantImagesById: any = {};
  brand_image_url_exist:boolean = false;
  brand_image_url:string = '';
  onlineArrList = [];
  offlineArrList = [];
  doctorListNewArr = [];
  todayAppointmentArr: Array<any> = [];
  constructor(private router: Router,
    private teleConsultService: TeleConsultService,
    private teleConsultCrossbarService: TeleconsultationCrossbarService,
    private _dialog: MatDialog,
    public _constant: ConstantsService,
    private AuthServiceLogin: AuthServiceLogin,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private sanitizer:DomSanitizer,
    private fireStoreService: FireStoreService) {
      this.hideCallBtn = this._constant.startCallFlow;
    }

  ngOnInit() {
    this.searchConsultant();
    // var consultantObject = this._constant.aesDecryption('consultantDataObj');
    localStorage.setItem("consultantDataObj",this._constant.aesEncryption(JSON.stringify(null)));
    var consultantObject = JSON.parse(this._constant.aesDecryption("consultantDataObj"));
    if (consultantObject != null) {
      var parsedConsultantObject = JSON.parse(consultantObject);
      this.consultanttype = parsedConsultantObject.ct;
      this.specialityName = parsedConsultantObject.st;
    } else {
      this.specialityName = this._constant.teleSpecalityType;
    }

    if(this._constant.consultationPlatformData == undefined || this._constant.consultationPlatformData == null){
      let userData = JSON.parse(this._constant.aesDecryption("userData"));
      this.teleConsultService.getTeleConsultUserPlatformData(userData.id).subscribe(data=>{
        console.log(data);
        this._constant.consultationPlatformData = data;
        this.getDoctorList(this._constant.consultationPlatformData);
        this.populatedoctorStatusMappingList();
      });
      this.router.navigate(['/teleconsultation']);
      /* this.teleConsultService.getTeleConsultData().subscribe(data=>{
        this._constant.consultationPlatformData = data['consultation_platfrom_data'];
        this.getDoctorList(this._constant.consultationPlatformData);
        this.populatedoctorStatusMappingList();
      }); */
    }else{
      this.getDoctorList(this._constant.consultationPlatformData);
      this.populatedoctorStatusMappingList();
    }
  }

  async ngOnDestroy(){
    // TODO: Shift this to another functions
    console.log('ng on destroy');
    await Promise.all(
      [
        this.teleConsultCrossbarService.unSubscribeToChannel('ihl_update_doctor_status_channel')
      ]
    ).then(res=>{
      console.log(res);
      console.log('Unsubscribed');
    });
    console.log('After unsubscribed');
  }

  populatedoctorStatusMappingList():void{
    if(this.doctorList == undefined || this.doctorList.length == 0) return;
    this.doctorList.forEach(doctor=>{
      if(doctor['ihl_consultant_id'] == undefined || doctor['ihl_consultant_id'] == '') return;
      this.doctorStatusMappingList[doctor.ihl_consultant_id] = 'Offline';
      this.doctorStatusMappingList[doctor.ihl_consultant_id+"_NxtAvail"] = "Checking Availability" ;
    });

    if (this._constant.fireStore) {
        this.initializeFireStoreConnection();
    } else {
      this.initializeCrossbarConnection();
    }

    this.getDoctorStatusFromApi();
    this.checkCallHistory();
  }

  checkCallHistory() {
    if(this._constant.consultationUserData && this._constant.consultationUserData.consultation_history){
      let consultation_history = this._constant.consultationUserData['consultation_history'];
      let consultation_history_ids = [];
      consultation_history_ids = consultation_history.map(id => id['consultant_details']['ihl_consultant_id']);
      this.doctorList.map(doctor => {
        if(consultation_history_ids.includes(doctor['ihl_consultant_id'])) {
          doctor.hadConsultHistory = true;
        }
        else {
          doctor.hadConsultHistory = false;
        }
      });

    }else{
      this.doctorList.map(doctor => {
        doctor.hadConsultHistory = false;
      });
    }
  };

  initializeFireStoreConnection() {
    this.fireStoreService.getAll(this._constant.consultantOnlineCollectionName).snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      data.forEach((val) => {
          let _doctor = this.doctorStatusMappingList[val['consultantId']];
          if (_doctor != undefined)
            this.doctorStatusMappingList[val['consultantId']] = val['status'];
      });
    });
  }

  initializeCrossbarConnection(){
    // Important: Unsubscribe to channels in ngOnDestroy
    let options = {
      'subscription_channels_list':[
        {
          'channel_name':'ihl_update_doctor_status_channel',
          'subscription_handler':(param, sender_id, sender_session_id)=>{this.updateDoctorStatus(param, sender_id, sender_session_id);},
        },
      ],
    };
    if(this._constant.startCallFlow) this.showModal('Checking available consultants. Please wait...', true);
    this.teleConsultCrossbarService.on_connection_established = ()=>{this.onConnectionEstablished();}
    this.teleConsultCrossbarService.user_id = JSON.parse(this._constant.aesDecryption('userData'))['id'];

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
      });

    }else{
      this.teleConsultCrossbarService.connect(options);
    }
  }

  onConnectionEstablished(){
    // let channel_name = 'ihl_get_doctor_status_channel';
    // let _data = {
    // };
    // let doctor_ids = this.doctorStatusMappingList.map(item=>{return item.ihl_consultant_id});
    // let _options = {
    //   'receiver_ids':doctor_ids,
    //   'exclude':[],
    //   'eligible':[],
    // };
    // this.teleConsultCrossbarService.publishToChannel(channel_name, _data, _options);
    console.log('Crossbar connected');
  }
  getDoctorStatusFromApi():void{
    // let doctor_ids = this.doctorStatusMappingList.map(item=>{return item.ihl_consultant_id});
    this.doctor_ids = Object.keys(this.doctorStatusMappingList);
    if(this.doctor_ids.length == 0) return;
    this.teleConsultService.getDoctorStatus(this.doctor_ids).subscribe(res=>{
      let _res = {'data':JSON.parse((res as string).replace(/(&quot\;)/g,"\""))};
      this.updateDoctorStatusListFromApi(_res['data']);
      // console.log(_res);
    });
  }
  updateDoctorStatusListFromApi(api_res):void{
    this.hideModal();
    // load the doctors ,odel box and show no doctor avalailable text in back end
    console.log(api_res);
    let n = api_res.length;
    for(let i=0; i<n; i++){
      try{

        //if(count the offline status === doctors length && strat call now flow) {show no doctor avaliable text}
        if(this._constant.startCallFlow == true){
          // console.log("this._constant.startCallFlow");
          // console.log(api_res[i]['status']);
          if(api_res[i]['status'] == 'Offline' || api_res[i]['status'] == null){
            this.offlineDoctorCount++;
          }
          if(this.offlineDoctorCount == n){
            this.noDoctorAvaTxt = true;
          } else {
            this.noDoctorAvaTxt = false;
          }
        }

        let _api_date:any = new Date(api_res[i]['timestamp']);
        let cur_date:any = new Date();
        if((cur_date - _api_date) >= (15*60*1000)) continue;
        let doctor_id = api_res[i]['consultant_id'];
        // let doctor_obj = this.doctorStatusMappingList.find(item=>{return item.ihl_consultant_id == doctor_id});
        let doctor_obj = this.doctorStatusMappingList[doctor_id];
        if(doctor_obj != undefined){
          let _status = api_res[i]['status'];
          if(_status == undefined || _status == null || _status == 'M') _status = 'Offline';
          // doctor_obj.doctor_status = api_res[i]['status'];
          this.doctorStatusMappingList[doctor_id] = _status;

        }
      }catch(err){
        continue;
      }
    }
    //hide load doctoe model box

    // Doctor Availability

    for(let [docId, status] of Object.entries(this.doctorStatusMappingList)){
      // console.log(docId, status);
      let vendorId='';
      Object.values(this.doctorList).forEach(data=> {
        if(data['ihl_consultant_id'] == docId){
          vendorId=data.vendor_id;
        }
      })
      if(status == 'null') status = 'Offline';
      if(status == 'Offline' || status == 'Busy'){
       /*  this.teleConsultService.doctorNextAvailability(docId, vendorId, status).subscribe(data =>{
          if(data['responce'] != null){
            let availTime = data['responce'];
            let time = availTime.split(' ')[1]+" "+availTime.split(' ')[2];
            // console.log(availTime);
            if(availTime == 'no slot found'){
              this.doctorStatusMappingList[docId+"_NxtAvail"] = "No slot for today" ;
            }else{
              if(availTime.split(' ')[0] == 'Today'){
                var today = new Date();
                var hours = today.getHours();
                var minutes = today.getMinutes();
                var ampm = hours >= 12 ? 'PM' : 'AM';
                hours = hours % 12;
                var anhours = hours ? hours : 12; // the hour '0' should be '12'
                let anhours_hr = anhours < 10 ? '0'+anhours : anhours;
                var anminutes = minutes < 10 ? '0'+minutes : minutes;
                var strTime = anhours_hr + ':' + anminutes;
                const currentTime = new Date('2022-01-01 '+ strTime);
                const cameTime = new Date('2022-01-01 ' + availTime.split(' ')[1]);
                // console.log(strTime);
                if(availTime.split(' ')[2] == ampm){
                  if(currentTime.getTime() > cameTime.getTime()){
                    this.doctorStatusMappingList[docId+"_NxtAvail"] = "Available from"+ " " + time +" "+ "-" +" "+"Yet to be arrived";
                  }else{
                    this.doctorStatusMappingList[docId+"_NxtAvail"] = "Available at"+ " " + time;
                  }
                  // this.doctorStatusMappingList[docId+"_NxtAvail"] = "Available from"+ " " + time +" "+ "-" +" "+"Yet to be arrived";
                }else if(availTime.split(' ')[2] == 'AM' && ampm == 'PM'){
                  this.doctorStatusMappingList[docId+"_NxtAvail"] = "Available from"+ " " + time +" "+ "-" +" "+"Yet to be arrived";
                }else if(availTime.split(' ')[2] == 'PM' && ampm == 'AM'){
                  this.doctorStatusMappingList[docId+"_NxtAvail"] = "Available at"+ " " + time;
                }
              }else{
                this.doctorStatusMappingList[docId+"_NxtAvail"] = "Available on"+ " " + availTime.split(' ')[0] + " " + time;
              }
            }
          }
        }); */

        /* IMPLEMENT NEW API FOR CHECKING DOCTOR NEXT AVAILABILITY */
        
        this.teleConsultService.doctorNextAvailabilityNew(docId, vendorId, status).subscribe(data=>{
          //console.log(typeof data);
          if(typeof data == "object") {
            //{  "responce": "no slot found"}
            if(data.hasOwnProperty('responce')) {
              if(data['responce'] == "no slot found") {
                this.doctorStatusMappingList[docId+"_NxtAvail"] = "No slot Available";
              } else {
                this.doctorStatusMappingList[docId+"_NxtAvail"] = "Not Available";
              }
            } else if(data.hasOwnProperty('previous_slot')) {
              if(data['previous_slot'] == 'NA' && data['next_slot'] == 'NA'){
                this.doctorStatusMappingList[docId+"_NxtAvail"] = "Not Available";
              } else if(data['previous_slot'].includes('Today') && data['next_slot'].includes('Today')){
                let currentTimestamp = Date.now();
                const date = new Date();
                let day = date.getDate();
                let month = date.getMonth() + 1;
                let year = date.getFullYear();
                let todayDate = `${month}-${day}-${year}`;
                console.log(todayDate);
                let getPrvSlotStartTime  = data['previous_slot'].split(" ");
                let prvSlotStartDateTime = todayDate + " " + getPrvSlotStartTime[1] + " " + getPrvSlotStartTime [2];
                console.log("todayDateTime = "+ prvSlotStartDateTime);
                const prvSlotStartTimestamp = new Date(prvSlotStartDateTime).getTime(); //'09/19/2022 12:58 PM';
                console.log("prvSlotStartTimestamp = " + prvSlotStartTimestamp);
                const prvSlotEndTimestamp = new Date(prvSlotStartDateTime).getTime() + 30*60*1000;
                console.log("prvSlotEndTimestamp = " + prvSlotEndTimestamp);
                let getNxtSlotStartTime  = data['next_slot'].split(" ");
                let nxtSlotStartDateTime = todayDate + " " + getNxtSlotStartTime[1] + " " + getNxtSlotStartTime [2];
                const nxtSlotEndTimestamp = new Date(nxtSlotStartDateTime).getTime() + 30*60*1000;
                console.log("nxtSlotEndTimestamp = " + nxtSlotEndTimestamp);

                if((prvSlotStartTimestamp < currentTimestamp && prvSlotEndTimestamp >= currentTimestamp) || (nxtSlotEndTimestamp < currentTimestamp)){                  // yet to be arrive
                  this.doctorStatusMappingList[docId+"_NxtAvail"] = "Yet to be arrived";
                } else {
                  this.doctorStatusMappingList[docId+"_NxtAvail"] = "Available at " + data['next_slot'];
                }
              }else {
                this.doctorStatusMappingList[docId+"_NxtAvail"] = "Available at " + data['next_slot'];
              }
            } else {
              this.doctorStatusMappingList[docId+"_NxtAvail"] = "Not Available";
            }
          } else {
            this.doctorStatusMappingList[docId+"_NxtAvail"] = "Not Available";
          }
        })
      }else if(status == 'Online'){
        this.doctorStatusMappingList[docId+"_NxtAvail"] = "Available Now";
      }else{
        this.doctorStatusMappingList[docId+"_NxtAvail"] = "Not Available";
      }
    }
 
    for(let i=0; i<this.doctorList.length; i++){
      if(this.doctorList[i]['ihl_consultant_id'] == api_res[i]['consultant_id']){
        let newArr = Object.assign(this.doctorList[i],api_res[i]);
        this.doctorListNewArr.push(newArr);
      }
    }

    //Display online Doctor at the top using api
    for(let key in this.doctorListNewArr){
      /* old code commenetd due to issue starts here
      if(this.doctorListNewArr[key]['status'] == 'Offline' || this.doctorListNewArr[key]['status'] == 'Busy' || this.doctorListNewArr[key]['status'] == null){
        this.offlineArrList.push(this.doctorListNewArr[key]);
      }
      if(this.doctorListNewArr[key]['status'] == 'Online'){
        let _api_date:any = new Date(api_res[key]['timestamp']);
        let cur_date:any = new Date();
        if((cur_date - _api_date) >= (15*60*1000)) continue;
        this.onlineArrList.push(this.doctorListNewArr[key]);
      } old code commenetd due to issue ends here */ 

      if(this.doctorListNewArr[key]['status'] != 'Online') { //  || this.doctorListNewArr[key]['status'] == 'Busy' || this.doctorListNewArr[key]['status'] == null){
        this.offlineArrList.push(this.doctorListNewArr[key]);
      } else { 
        let _api_date:any = new Date(api_res[key]['timestamp']);
        let cur_date:any = new Date();
        if((cur_date - _api_date) >= (15*60*1000)) {  //checking to online doctors based on no appointment within next 15 min - shows 'Online' if not shows as 'offline'
          this.onlineArrList.push(this.doctorListNewArr[key]);
        } else {
          this.offlineArrList.push(this.doctorListNewArr[key]);
        }
      }
    }   
    this.doctorList = this.onlineArrList.concat(this.offlineArrList);
    //getting doctor status for showing no doctors avaiable online in start call flow
    if(this._constant.startCallFlow === true){
      let doctorsStatus = Object.values(this.doctorStatusMappingList);
      // console.log(doctorsStatus);
      let isAnyDoctorOnline = doctorsStatus.some(val => {
        return val == 'Online';
      });
      // console.log(isAnyDoctorOnline);

      if (isAnyDoctorOnline === true) {
        this.isDoctorOnline = true;
      }else if (isAnyDoctorOnline === false) {
        this.isDoctorOnline = false;
      }
    }
  }
  updateDoctorStatus(param, sender_id, sender_session_id){
    if('status' in param == false) return;
    // let _doctor = this.doctorStatusMappingList.find(item=>{return item.ihl_consultant_id == sender_id});
    let _doctor = this.doctorStatusMappingList[sender_id];
    if(_doctor != undefined){
      this.doctorStatusMappingList[sender_id] = param['status'];
      let vendorId = '';
      Object.values(this.doctorList).forEach(data=> {
        if(data['ihl_consultant_id'] == sender_id){
          if(param['status'] == 'Online'){
            data['status'] = 'Online'; 
          }
          if(param['status'] == 'Offline'){
            data['status'] = 'Offline'; 
          } 
          vendorId=data.vendor_id;
        }
      })
      
      //Display Online Doctor at the top 
      this.onlineArrList = [];
      this.offlineArrList = [];
      for(let i = 0; i < this.doctorList.length; i++){
        if(this.doctorList[i]['status'] == 'Online'){
          this.onlineArrList.push(this.doctorList[i]);
        }
        if(this.doctorList[i]['status'] == 'Offline' || this.doctorList[i]['status'] == null){
          this.offlineArrList.push(this.doctorList[i]);
        }
      }
      this.doctorList = [];
      this.doctorList = this.onlineArrList.concat(this.offlineArrList);

      // Doctor Availability

      if(param['status'] == 'null') param['status'] = 'Offline';
      if(param['status'] == 'Offline' || param['status'] == 'Busy'){
        /* this.teleConsultService.doctorNextAvailability(sender_id, vendorId, param['status']).subscribe(data =>{
          if(data['responce'] != null){
            let availTime = data['responce'];
            let time = availTime.split(' ')[1];
            if(availTime == 'no slot found'){
              this.doctorStatusMappingList[sender_id+"_NxtAvail"] = "No slot for today" ;
            }else{
              var today = new Date();
              var hours = today.getHours();
              var minutes = today.getMinutes();
              var ampm = hours >= 12 ? 'PM' : 'AM';
              hours = hours % 12;
              var anhours = hours ? hours : 12; // the hour '0' should be '12'
              var anminutes = minutes < 10 ? '0'+minutes : minutes;
              var strTime = anhours + ':' + anminutes + ' ' + ampm;
              if(strTime > time){
                this.doctorStatusMappingList[sender_id+"_NxtAvail"] = "Available from"+ " " +time.split(':')[0]+':'+time.split(':')[1]+availTime.split(' ')[2]+" "+ "-" +" "+"Yet to be arrived";
              }else{
                this.doctorStatusMappingList[sender_id+"_NxtAvail"] = "Available at"+ " " +time.split(':')[0]+':'+time.split(':')[1]+availTime.split(' ')[2];
              }
            }
          }
        }); */

        /* IMPLEMENT NEW API FOR CHECKING DOCTOR NEXT AVAILABILITY */

        this.teleConsultService.doctorNextAvailabilityNew(sender_id, vendorId, status).subscribe(data=>{
          //console.log(typeof data);
          if(typeof data == "object") {
            //{  "responce": "no slot found"}
            if(data.hasOwnProperty('responce')) {
              if(data['responce'] == "no slot found") {
                this.doctorStatusMappingList[sender_id+"_NxtAvail"] = "No slot Available";
              } else {
                this.doctorStatusMappingList[sender_id+"_NxtAvail"] = "Not Available";
              }
            } else if(data.hasOwnProperty('previous_slot')) {
              if(data['previous_slot'] == 'NA' && data['next_slot'] == 'NA'){
                this.doctorStatusMappingList[sender_id+"_NxtAvail"] = "Not Available";
              } else if(data['previous_slot'].includes('Today') && data['next_slot'].includes('Today')){
                let currentTimestamp = Date.now();
                const date = new Date();
                let day = date.getDate();
                let month = date.getMonth() + 1;
                let year = date.getFullYear();
                let todayDate = `${month}-${day}-${year}`;
                console.log(todayDate);
                let getPrvSlotStartTime  = data['previous_slot'].split(" ");
                let prvSlotStartDateTime = todayDate + " " + getPrvSlotStartTime[1] + " " + getPrvSlotStartTime [2];
                console.log("todayDateTime = "+ prvSlotStartDateTime);
                const prvSlotStartTimestamp = new Date(prvSlotStartDateTime).getTime(); //'09/19/2022 12:58 PM';
                console.log("prvSlotStartTimestamp = " + prvSlotStartTimestamp);
                const prvSlotEndTimestamp = new Date(prvSlotStartDateTime).getTime() + 30*60*1000;
                console.log("prvSlotEndTimestamp = " + prvSlotEndTimestamp);
                let getNxtSlotStartTime  = data['next_slot'].split(" ");
                let nxtSlotStartDateTime = todayDate + " " + getNxtSlotStartTime[1] + " " + getNxtSlotStartTime [2];
                const nxtSlotEndTimestamp = new Date(nxtSlotStartDateTime).getTime() + 30*60*1000;
                console.log("nxtSlotEndTimestamp = " + nxtSlotEndTimestamp);

                if((prvSlotStartTimestamp < currentTimestamp && prvSlotEndTimestamp >= currentTimestamp) || (nxtSlotEndTimestamp < currentTimestamp)){                  // yet to be arrive
                  this.doctorStatusMappingList[sender_id+"_NxtAvail"] = "Yet to be arrived";
                } else {
                  this.doctorStatusMappingList[sender_id+"_NxtAvail"] = "Available at " + data['next_slot'];
                }
              }else {
                this.doctorStatusMappingList[sender_id+"_NxtAvail"] = "Available at " + data['next_slot'];
              }
            } else {
              this.doctorStatusMappingList[sender_id+"_NxtAvail"] = "Not Available";
            }
          } else {
            this.doctorStatusMappingList[sender_id+"_NxtAvail"] = "Not Available";
          }
        })
      }else if(param['status'] == 'Online'){
        this.doctorStatusMappingList[sender_id+"_NxtAvail"] = "Available Now";
      }else{
        this.doctorStatusMappingList[sender_id+"_NxtAvail"] = "Not Available";
      }
      // _doctor.doctor_status = param['status'];
      // _doctor.session_id = sender_session_id;

      //get doctor status and check anyone of the doctor status is online breck the for loop
      // offline doctors length and doctors length is equal then show the available doctors
      if(this._constant.startCallFlow == true){
        this.teleConsultService.getDoctorStatus(this.doctor_ids).subscribe(res=>{
          let _res = {'data':JSON.parse((res as string).replace(/(&quot\;)/g,"\""))};
          let apiOfflineCount = 0;
          for(let i = 0; i<_res['data'].length; i++){
            if(_res['data'][i].status == "Offline" || _res['data'][i].status == null){
              apiOfflineCount++;
              if(apiOfflineCount == _res['data'].length){
                this.noDoctorAvaTxt = true;
              } else {
                this.noDoctorAvaTxt = false;
              }
            }
          }
        });
      }

    }

    //getting doctor status for showing no doctors avaiable online in start call flow
    if(this._constant.startCallFlow === true){
      let doctorsStatus = Object.values(this.doctorStatusMappingList);
      // console.log(doctorsStatus);
      let isAnyDoctorOnline = doctorsStatus.some(val => {
        return val == 'Online';
      });
      // console.log(isAnyDoctorOnline);

      if (isAnyDoctorOnline === true) {
        this.isDoctorOnline = true;
      }else if (isAnyDoctorOnline === false) {
        this.isDoctorOnline = false;
      }
    }
  }

  // getDoctorStatus(doctor_id){
  //   return this.doctorStatusMappingList.find(item=>{
  //     return item.ihl_consultant_id == doctor_id;
  //   }).doctor_status;
  // }

  expendCardAppointment(id, idx, avail, doctor){
    // this.cardExpendDynamic = "col-md-12";
    //console.log(id);
    this._constant.startCallFlow = false;
    this.headerName = "Book Appointment";
    this.cardExpendDiv = true;
    this.bookAppointmentView = true;
    this.doctorProfileView = false;
    this.selectedDoctor = id;
    this.selectedSlot = 0;
    this.selectedAppointmentIndex = null;
    this.slotAllocation = null;
    this.confirmButton = true;
    this.disableLanguage = true;
    this.dropdownHidden = true;
    this.liveRatingStarValue = null;
    //console.log("doctor index  "+i);
    this.doctorList[idx].everyDaySlot = [];
    this.doctorList[idx].avail = undefined;
    let selectedConsultantIndex: any = idx;
    let selectedConsultant:any = doctor;
    let dataToRetriveSlots: ConsultantBelongsTo;

    if (selectedConsultant['vendor_id'] === "IHL") {
      dataToRetriveSlots = {consultantId: selectedConsultant['ihl_consultant_id'], vendorId: "IHL"};
      console.log(selectedConsultant);
      console.log(dataToRetriveSlots);
    }else if (selectedConsultant['vendor_id'] === "GENIX") {
      dataToRetriveSlots = {consultantId: selectedConsultant['ihl_consultant_id'], vendorId: "GENIX"};
    }else{
      console.log("Invalid vendor name");
    }

    this.authService.getLiveDoctorStatus(dataToRetriveSlots).subscribe(data => {
      console.log(data);
      if(data['staatus'] == 'genix error occured'){
        this.snackBar.open("We regret! Some technical issue is occur in third party server.", '',{
          duration: 9000,
          panelClass: ['error'],
        });
        return 0;
      }
      for(let key in data){
        if ("today" in data[key]) {
          let todayTimings = data[key].today;
          let availableTime = [];
          if (todayTimings.length > 0) {
            todayTimings.forEach(times => {
              let todayDate = new Date();
              let a = new Date();
              let b = new Date((todayDate.getMonth()+1)+'/'+todayDate.getDate()+'/'+todayDate.getFullYear()+" "+times);
              if(b.getTime() > a.getTime()){
                availableTime.push(times);
              }
            });
          }
          data[key].today = availableTime;
          break;
        }
      }
      selectedConsultant['consultant_next_30_days_availablity'] = data;
      this.getFinetunedDoctorList(selectedConsultant,selectedConsultantIndex);
    });

  }

  shrinkCardAppointment(id){
   // console.log(id);
    //this.cardExpendDynamic = "col-md-4";
    // this.cardExpendDynamic = "col-md-6 col-lg-4 col-xl-4";
    this.headerName = "Select Consultant";
    this.cardExpendDiv = false;
    this.bookAppointmentView = false;
    this.doctorProfileView = false;
    this.selectedDoctor = id;
    this.selectedAppointmentIndex = null
    this.dateTitle = null;
    this.slotAllocation = null;
    this.confirmButton = true;
    this.disableLanguage = false;
    this.dropdownHidden = false;
    this.liveRatingStarValue = null;
  }

  expendCardProfile(id, doctorList){
    //console.log(id);
    // this.cardExpendDynamic = "col-md-12";
    this.headerName = "Book Appointment";
    this.cardExpendDiv = true;
    this.bookAppointmentView = false;
    this.doctorProfileView = true;
    this.selectedDoctor = id;
    this.selectedAppointmentIndex = null;
    this.dateTitle = null;
    this.slotAllocation = null;
    this.confirmButton = true;
    this.disableLanguage = true;
    this.dropdownHidden = true;
    this.liveRatingStarValue = null;
    this.selectedStar = 0;
    this.rateArray = [0,0,0,0,0];
    this.sendReview = false;
  }

  shrinkCardProfile(id){
    //console.log(id);
    // this.cardExpendDynamic = "col-md-6 col-lg-4 col-xl-4";
    this.headerName = "Select Consultant";
    this.cardExpendDiv = false;
    this.bookAppointmentView = false;
    this.doctorProfileView = false;
    this.selectedDoctor = id;
    this.selectedAppointmentIndex = null;
    this.dateTitle = null;
    this.slotAllocation = null;
    this.confirmButton = true;
    this.disableLanguage = false;
    this.dropdownHidden = false;
    this.liveRatingStarValue = null;
  }


  goHome(){
    if (this._constant.teleConsultationNewFlow && this.cardExpendDiv) {
      this.cardExpendDiv = false;
      return;
    } else {
      this.router.navigate(['/teleconsult-speciality']);
      return;
    }

    if(!this.dropdownHidden){
	   if(this._constant.aesDecryption("consultantDataObj") != undefined){
	      let consultantDataObj = JSON.parse(this._constant.aesDecryption("consultantDataObj"));
	      let consult_type = consultantDataObj.ct;
	      console.log(this._constant.consultationPlatformData.consult_type.length);
	      for(let i = 0; i < this._constant.consultationPlatformData.consult_type.length; i++){
	        console.log(this._constant.consultationPlatformData.consult_type[i]);
	        console.log(this._constant.consultationPlatformData.consult_type[i].consultation_type_name);
	        if(this._constant.consultationPlatformData.consult_type[i].consultation_type_name == consult_type){
	          console.log(this._constant.consultationPlatformData.consult_type[i].specality);
	          if(this._constant.consultationPlatformData.consult_type[i].specality.length == 1){
	            this.router.navigate(['/teleconsult-type']);
	            break;
	          } else {
	            this.router.navigate(['/teleconsult-speciality']);
	            break;
	          }
	        }
	      }
	    }

    } else {
      this.headerName = "Select Consultant";
      this.cardExpendDiv = false;
      this.bookAppointmentView = false;
      this.doctorProfileView = false;
      //this.selectedDoctor = id;
      this.selectedAppointmentIndex = null
      this.dateTitle = null;
      this.slotAllocation = null;
      this.confirmButton = true;
      this.disableLanguage = false;
      this.dropdownHidden = false;
      this.liveRatingStarValue = null;
    }
  }

  getDoctorList(consultType){
    let consultations = consultType;
    let consultantType = ["Medical Consultation", "Health Consultation", "Alternative Therapy"];


    if (this.specialityName == undefined || this.specialityName == null || this.specialityName == "" ) {
      if (consultations !== undefined && consultations !== null) {
        for (let z = 0; z < consultations.consult_type.length; z++) {

          if (this._constant.teleConsultationNewFlow) {
            this.consultanttype = consultantType.find(temp=>temp == consultations.consult_type[z].consultation_type_name);
          }
          console.log(this.consultanttype);
          console.log(consultations.consult_type[z].consultation_type_name);
          console.log(consultations.consult_type[z].specality);

          if (consultations.consult_type[z].consultation_type_name == this.consultanttype) {
            if (consultations.consult_type[z].specality.length != 0 && consultations.consult_type[z].specality !== undefined && consultations.consult_type[z].specality !== null) {
              this.specialityName = consultations.consult_type[z].specality[0].specality_name;
            }
          }
        }
      }
    }

    if (consultations !== undefined && consultations !== null && consultations.consult_type != undefined) {
      for (let i = 0; i < consultations.consult_type.length; i++) {

        if (this._constant.teleConsultationNewFlow) {
          this.consultanttype = consultantType.find(temp=>temp == consultations.consult_type[i].consultation_type_name);
        }
        console.log(this.consultanttype);

        if (consultations.consult_type[i].consultation_type_name == this.consultanttype) {
          if (consultations.consult_type[i].specality !== undefined && consultations.consult_type[i].specality !== null) {
            for (let j = 0; j < consultations.consult_type[i].specality.length; j++) {
              if (consultations.consult_type[i].specality[j].specality_name == this.specialityName) {
                if (consultations.consult_type[i].specality[j].consultant_list !== undefined && consultations.consult_type[i].specality[j].consultant_list !== null) {
                  this.consultantList =  consultations.consult_type[i].specality[j].consultant_list;
                  if(this.consultantList !== undefined && this.consultantList !== null && this.consultantList !== "" && (Array.isArray(this.consultantList) && this.consultantList.length > 0) ){
                    //this.getFinetunedDoctorList();
                    console.log(this.consultantList);
                    if(this._constant.startCallFlow == true){
                      this.doctorList = [];
                      for (let k = 0; k < this.consultantList.length; k++) {
                        if(this.consultantList[k]['live_call_allowed'] == true){
                          this.doctorList[this.docListIndex] = {};
                          this.doctorList[this.docListIndex] = this.consultantList[k];
                          this.docListIndex++;
                        }
                      }
                      //this.fillStars();
                      //this.languageArrayFilter();
                    } else {
                      this.doctorList = this.consultantList;
                      //this.fillStars();
                      //this.languageArrayFilter();
                    }
                    if(this.doctorList.length == 0){
                      this.noDoctorAvaTxt = true;
                    } else {
                      this.noDoctorAvaTxt = false;
                    }
                    console.log(this.doctorList);
                    //Fetch consultant Image
                    if (this.doctorList.length > 0) {
                      this.seperateDoctorListBasedOnAffiliation(this.doctorList);
                      //this.retrieveConsultantImage(this.doctorList);
                    }
                    break;
                  }
                }else{
                  console.log("consultant list not available");
                  break;
                }
              }
            }
          }
        }
      }
    }else{
      console.log("consultation type undefined");
    }

  }

  getFinetunedDoctorList(selectedConsultant, selectedConsultantIndex){
    let consultantList = [];
    consultantList.push(selectedConsultant);
    var morning1 = "12:00 AM";
    var morning2 = "11:59 AM";

    var afternoon1 = "12:00 PM";
    var afternoon2 = "3:59 PM";

    var evening1 = "4:00 PM";
    var evening2 = "6:59 PM";

    var night1 = "7:00 PM";
    var night2 = "11:59 PM";
    console.log(consultantList.length);
    for (let p = 0; p < consultantList.length; p++) {
      if(consultantList[p].consultant_next_30_days_availablity !== undefined && consultantList[p].consultant_next_30_days_availablity !== null && consultantList[p].consultant_next_30_days_availablity !== "" && consultantList[p].consultant_next_30_days_availablity.length !== 0){
        //this.consultantList[p].consultant_next_30_days_availablity = this.consultantList[p].consultant_next_30_days_availablity;
        var doctorSlot = consultantList[p].consultant_next_30_days_availablity;
        consultantList[p].everyDaySlot = [];
        var slotIndex = 0;
        for (let q = 0; q < doctorSlot.length; q++) {
          consultantList[p].everyDaySlot[slotIndex] = {};
          //consultantList[p].everyDaySlot[slotIndex].title =Object.keys(doctorSlot[q]).toString()
          consultantList[p].everyDaySlot[slotIndex].title = Object.values(Object.keys(doctorSlot[q]))[0];
          consultantList[p].everyDaySlot[slotIndex].subTitle = Object(Object.values(Object.values(doctorSlot[q])[0])).length + " Slots available";

          var timings = Object(Object.values(Object.values(doctorSlot[q])[0]));
          if (timings !== undefined && timings !== null && timings !== "" && timings.length !== 0) {
            consultantList[p].everyDaySlot[slotIndex].morning = [];
            consultantList[p].everyDaySlot[slotIndex].afternoon = [];
            consultantList[p].everyDaySlot[slotIndex].evening = [];
            consultantList[p].everyDaySlot[slotIndex].night = [];
            consultantList[p].everyDaySlot[slotIndex].selectedDayAvail = true;
            for (let r = 0; r < timings.length; r++) {
              if((moment(timings[r] , "HH:mm a") >= moment(morning1 , "HH:mm a")) && (moment(timings[r] , "HH:mm a") <= moment(morning2 , "HH:mm a"))){
                consultantList[p].everyDaySlot[slotIndex].morning.push(timings[r]);
              }else if((moment(timings[r] , "HH:mm a") >= moment(afternoon1 , "HH:mm a")) && (moment(timings[r] , "HH:mm a") <= moment(afternoon2 , "HH:mm a"))){
                consultantList[p].everyDaySlot[slotIndex].afternoon.push(timings[r]);
              }else if((moment(timings[r] , "HH:mm a") >= moment(evening1 , "HH:mm a")) && (moment(timings[r] , "HH:mm a") <= moment(evening2 , "HH:mm a"))){
                consultantList[p].everyDaySlot[slotIndex].evening.push(timings[r]);
              }else if((moment(timings[r] , "HH:mm a") >= moment(night1 , "HH:mm a")) && (moment(timings[r] , "HH:mm a") <= moment(night2 , "HH:mm a"))){
                consultantList[p].everyDaySlot[slotIndex].night.push(timings[r]);
              }else{
               console.log("undefined");
              }

            }
          }else if(timings == undefined || timings == null || timings == "" && timings.length == 0){
            consultantList[p].everyDaySlot[slotIndex].selectedDayAvail = false;
          }

          slotIndex++
        }
        this.doctorList[selectedConsultantIndex].everyDaySlot = consultantList[p].everyDaySlot;
        this.doctorList[selectedConsultantIndex].avail = true;
        this.dateTitle = this.doctorList[selectedConsultantIndex].everyDaySlot[0].title;
        this.doctorSlotMorning = this.doctorList[selectedConsultantIndex].everyDaySlot[0].morning;
        this.doctorSlotAfternoon = this.doctorList[selectedConsultantIndex].everyDaySlot[0].afternoon;
        this.doctorSlotEvening = this.doctorList[selectedConsultantIndex].everyDaySlot[0].evening;
        this.doctorSlotNight = this.doctorList[selectedConsultantIndex].everyDaySlot[0].night;
        if (this.doctorList[selectedConsultantIndex].everyDaySlot[0].subTitle == "0 Slots available") {
          this.doctorsNextAvailability(0 , selectedConsultantIndex);
        }
        break;
      }else{
        //consultantList[p].avail = false;
        this.doctorList[selectedConsultantIndex].avail = false;
        break;
        //this.consultantList[p].consultant_next_30_days_availablity = "No slots AVAILABLE"
      }

    }

  }

  fillStars(){
    for (let k = 0; k < this.doctorList.length; k++) {
      this.stars[k] = [0, 0, 0, 0, 0]; //five empty stars
      var ratethis = this.doctorList[k].ratings;
      if (ratethis !== undefined && ratethis !== null && ratethis !== "") {
        let rating = Number(ratethis);
        //var starsToFill = Math.round(rating * 2)/2; //round to nearest 0.5
        var starsToFill = rating;
        var i = 0;
        while(starsToFill > 0.5){
          this.stars[k][i] = 1;
          i++;
          starsToFill--;
        }

        if(starsToFill >= 0.1 && starsToFill <= 0.5){
          this.stars[k][i] = 0.5;
        }

      }

    }
  }

  fillRatingStars(ratingValue: any){
    let defaultValue: number[] = [0, 0, 0, 0, 0];
    if (ratingValue != undefined && ratingValue != null && String(ratingValue).trim().length != 0) {
      if (ratingValue != 0) {
        let roundedRatings = Math.floor(Number(ratingValue));
        let pointRatings = (Number(ratingValue) % 1).toFixed(1);
        if (roundedRatings <= 5) {
          let i = 0;
          for( ; i < roundedRatings; i++){
            defaultValue[i] = 1;
          }

          if(Number(pointRatings) >= 0.1){
            defaultValue[i] = 0.5;
          }
          return defaultValue;
        }else{
          return defaultValue;
        }
      }else{
        return defaultValue;
      }
    }else{
      return defaultValue;
    }

  }

  getSlotTimings(title:any , selectedIndex:number , selectedDoctorsIndex:number , eachdaySubTitle:any){
    // console.log(title);
    // console.log("particular doctor index  "+selectedDoctorsIndex);
    // console.log("slots index of this doctor  "+selectedIndex);
    this.confirmButton = true;
    this.selectedSlot = selectedIndex;
    this.dateTitle = title;
    this.doctorSlotMorning = this.doctorList[selectedDoctorsIndex].everyDaySlot[selectedIndex].morning;
    this.doctorSlotAfternoon = this.doctorList[selectedDoctorsIndex].everyDaySlot[selectedIndex].afternoon;
    this.doctorSlotEvening = this.doctorList[selectedDoctorsIndex].everyDaySlot[selectedIndex].evening;
    this.doctorSlotNight = this.doctorList[selectedDoctorsIndex].everyDaySlot[selectedIndex].night;
    this.selectedAppointmentIndex = null;
    this.slotAllocation = null;

    if(eachdaySubTitle === "0 Slots available"){
      //alert(eachdaySubTitle);
      this.doctorsNextAvailability(selectedIndex , selectedDoctorsIndex );
    }
  }

  doctorsNextAvailability(selectedIndex , selectedDoctorsIndex){
    var fromindex = selectedIndex;
    for (let t = fromindex; t < this.doctorList[selectedDoctorsIndex].everyDaySlot.length; t++) {
      if (this.doctorList[selectedDoctorsIndex].everyDaySlot[t].subTitle !== "0 Slots available") {
        // console.log(this.doctorList[selectedDoctorsIndex].everyDaySlot[t]);
        this.confirmButton = false;
        this.nextDoctorSlotIndex = t;
        this.nextDoctorSlotTitle = this.doctorList[selectedDoctorsIndex].everyDaySlot[t].title;
        this.nextDoctorSlotMorning = this.doctorList[selectedDoctorsIndex].everyDaySlot[t].morning;
        this.nextDoctorSlotAfternoon = this.doctorList[selectedDoctorsIndex].everyDaySlot[t].afternoon;
        this.nextDoctorSlotEvening = this.doctorList[selectedDoctorsIndex].everyDaySlot[t].evening;
        this.nextDoctorSlotNight = this.doctorList[selectedDoctorsIndex].everyDaySlot[t].night;
        break;
      }

    }

  }

  gettingDoctorsNextAvailability(){
    this.selectedSlot = this.nextDoctorSlotIndex;
    this.dateTitle = this.nextDoctorSlotTitle;
    this.doctorSlotMorning = this.nextDoctorSlotMorning;
    this.doctorSlotAfternoon = this.nextDoctorSlotAfternoon;
    this.doctorSlotEvening = this.nextDoctorSlotEvening;
    this.doctorSlotNight = this.nextDoctorSlotNight;
    this.confirmButton = true;
  }

  getAppointmentTimings(a,b,c,slotBookedTime){
    if (''+a+b+c+'' === this.selectedAppointmentIndex) {
      this.selectedAppointmentIndex = null;
      this.slotAllocation = null;
      return;
    }else{
      this.selectedAppointmentIndex = ''+a+b+c+'';
      console.log(this.selectedAppointmentIndex);
      this.slotAllocation = slotBookedTime;
      console.log(this.slotAllocation);
      let end_time = this._getEndTime(this.slotAllocation, 30);
      console.log(end_time);
    }
  }

  _getEndTime(time_in_12hr_format, offset_in_mins=0):string{
    let [hh,mm] = this._getTimeInHours(time_in_12hr_format);
    let now_date = new Date();
    now_date.setHours(hh);
    now_date.setMinutes(mm);
    now_date.setSeconds(0);
    now_date.setMilliseconds(0);
    let new_date = new Date(now_date.getTime() + offset_in_mins*60*1000);
    let hours = new_date.getHours() ; // gives the value in 24 hours format
    let AmOrPm = hours >= 12 ? 'PM' : 'AM';
    hours = (hours % 12) || 12;
    let hrs_string = hours.toString();
    if(hrs_string.length == 1) hrs_string = '0' + hrs_string;
    let minutes = new_date.getMinutes() ;
    let min_string = minutes.toString();
    if(min_string.length == 1) min_string = '0' + min_string;
    return hrs_string + ':' + min_string + ' ' + AmOrPm;
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

  appointmentConfirmation(doctorDetails){
    if(this.dateTitle !== undefined && this.dateTitle !== null && this.dateTitle !== "" && this.slotAllocation !== undefined && this.slotAllocation !== null && this.slotAllocation !== ""){
      //alert("Appointment confirmed to meet  " + `${doctorName} ` + "at " + this.dateTitle.toString() +","+ this.slotAllocation.toString());
      let bookedDateTime = null;
      if(this.dateTitle == 'today'){
        bookedDateTime = this.getTodayDate("today")+" "+this.slotAllocation;

        //check whether the time is expired or not
        let dateNow: number = new Date().getTime();
        let todayDate: Date = new Date();
        let startDate = (todayDate.getDate() < 10) ? "0"+(todayDate.getDate()) : todayDate.getDate();
        let startMonth = (todayDate.getMonth()+1 < 10) ? "0"+(todayDate.getMonth()+1) :todayDate.getMonth() + 1;
        let dateBooked: number = new Date(startMonth+'/'+startDate+'/'+todayDate.getFullYear()+" "+this.slotAllocation).getTime();
        console.log(dateBooked);
        console.log(dateNow);
        if (dateBooked <= dateNow ) {
          this.snackBar.open("The selected slot is expired.", '',{
            duration: 3000
          });
          return;
        }
      } else if(this.dateTitle == "tomorrow"){
        bookedDateTime = this.getTodayDate("tomorrow")+" "+this.slotAllocation;
      } else {
        let date = this.dateTitle.split(" ");
        let getDate = date[0].split(/(\d+)/)
        let bookDate =  getDate[1];
        let monthArr = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
        let month = monthArr.indexOf((date[1].toLowerCase()).substring(0, 3)) + 1;
        let bookMonth = "";
        if(month <= 9){
          bookMonth = "0"+month;
        } else {
          bookMonth = month.toString();
        }
        let d = new Date();
        let year = d.getFullYear();
        bookedDateTime = year+"-"+bookMonth+"-"+bookDate+" "+this.slotAllocation;
      }

      /* let date = this.dateTitle.split(" ");
      let getDate = date[0].split(/(\d+)/)
      let bookDate =  getDate[1];
      let monthArr = ["jan", "feb", "mar", "Apr", "may", "jun", "jly", "aug", "sep", "oct", "nov", "dec"];
      let month = monthArr.indexOf((date[1].toLowerCase()).substring(0, 3)) + 1;
      let bookMonth = "";
      if(month <= 9){
        bookMonth = "0"+month;
      } else {
        bookMonth = month.toString();
      }
      let d = new Date();
      let year = d.getFullYear();
      let time = this.getConvertTime12to24(this.slotAllocation);
      //console.log(year+"-"+bookMonth+"-"+bookDate+" "+time);
      let bookedDateTime = year+"-"+bookMonth+"-"+bookDate+" "+time; */
      console.log(bookedDateTime);
      this._constant.appointmentDetails = Object.assign(doctorDetails , {'bookTime': bookedDateTime});
      console.log(this.dateTitle);
      console.log(this.slotAllocation);
      this._constant.confirmAppointment = true;
      this._constant.reachingVideoCallPageFrom = 'BookAppointment';
      this.router.navigate(['/teleconsult-confirm-visit']);
    }else if(this.dateTitle == undefined || this.dateTitle == null || this.dateTitle == "" || this.slotAllocation == undefined || this.slotAllocation == null || this.slotAllocation == ""){
     // alert("please select apppropriate date and time to book appointment");
      this.snackBar.open("Time is require for appointment booking.", '',{
        duration: 2000
      });
    }
  }
  /* getConvertTime12to24(getTime12h){
    const convertTime12to24 = (time12h) => {
      const [time, modifier] = time12h.split(' ');
      let [hours, minutes] = time.split(':');
      if (hours === '12') {
        hours = '00';
      }
      if (modifier === 'PM') {
        hours = parseInt(hours, 10) + 12;
      }
      return `${hours}:${minutes}`;
    }
    return convertTime12to24(getTime12h);
  } */

  getTodayDate(getDay){
    var d, month, day, year;
    if(getDay == "today"){
      d = new Date(),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();
    } else {
      d = new Date(Date.now() + 24 * 60 * 60 * 1000),
      month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
    }
      if (month.length < 2)
          month = '0' + month;
      if (day.length < 2)
          day = '0' + day;

      return [year, month, day].join('-');
  }

  languageArrayFilter(){
    var allLanguages = [];

    for (let v = 0; v < this.doctorList.length; v++) {

     if (this.doctorList[v].languages_spoken !== undefined && this.doctorList[v].languages_spoken !== null && this.doctorList[v].languages_spoken !== "" && this.doctorList[v].languages_spoken.length !== 0) {
      for (let w = 0; w < this.doctorList[v].languages_spoken.length; w++) {
        allLanguages.push(this.doctorList[v].languages_spoken[w]);
      }
     }

    }

    if (allLanguages !== undefined && allLanguages !== null && allLanguages.length !== 0) {
      const lang = allLanguages;

      let x = (lang) => lang.filter((y,z) => lang.indexOf(y) === z)
      var doctorAvailableLanguage = x(lang);
      this.doctorsLanguage = doctorAvailableLanguage;
    }
  }

  onChange(newValue) {
    this.doctorList = this.consultantList;
    //console.log(this.consultantList);
    if(newValue !== "All" && newValue !== "" && newValue !== "None" && newValue !== undefined && newValue !== null){
      var res = this.doctorList.filter(x => x.languages_spoken.some(y => y == newValue));
      //console.log(res);
      this.doctorList = res;
      //this.fillStars();
      //this.shrinkCardAppointment(id);
    }else if(newValue === "All"){
      this.doctorList = this.consultantList;
      //this.fillStars();
    }
  }

  countStars(value) {
    if(this.selectedStar == value){
      this.selectedStar -= 1;
    }else{
      this.selectedStar = value;
    }
    this.rateArray = [0,0,0,0,0];
    for (let i = 0; i < this.selectedStar; i++) {
      this.rateArray[i] = 1;
    }
    console.log(this.selectedStar);
    console.log(this.rateArray);
    //return s;
  }

  feedBack(doctorInfo){
    let selectedDoctor =  doctorInfo;
    let userId =JSON.parse(this._constant.aesDecryption('userData'))['id'].toString();
    let doctorRates = this.selectedStar.toString();
    let doctorText = this.reviewField.nativeElement.value.toString();

    if(doctorRates == '0' && doctorText == ''){
      this.snackBar.open("Please fill the rating and comments",'',{
        panelClass: ['error'],
        duration:4500,
      });
      return 0;
    }

    this.sendReview = true;
    let obj = {
                "user_ihl_id": userId,
                "consultant_name": selectedDoctor['name'],
                "ihl_consultants_id": selectedDoctor['ihl_consultant_id'],
                "vendor_consultatation_id": selectedDoctor['vendor_consultant_id'],
                "ratings":doctorRates,
                "review_text":doctorText,
                "vendor_name":selectedDoctor['vendor_name'],
                "provider": (selectedDoctor['provider'] != undefined && selectedDoctor['provider'] != null) ? selectedDoctor['provider'] : '',
                "appointment_id": ""
            };
    console.log(obj);
    this.authService.postDoctorReview(obj).subscribe(data=>{
      console.log(data);
      if (typeof (data) === "object"){
        this.snackBar.open("Thanks for your review.",'',{
          duration:3000
        });
        // let todayTime =  new Date().getTime();
        // let updatedReviewTimeStamp =`"/Date("${todayTime}")/"`;
        let userData = JSON.parse(this._constant.aesDecryption("userData"));
        // let userName = `${userData.firstName} ${userData.lastName}`;

        // let updatedReview:reviewObj = {rating_text:doctorText, user_rating: this.selectedStar, time_stamp: updatedReviewTimeStamp, user_name: userName};

        // doctorInfo.ratings = ( Number(doctorInfo.ratings) + this.selectedStar) / 2;
        // doctorInfo.text_reviews_data.push(updatedReview);

        this.reviewField.nativeElement.value = "";
        this.rateArray = [0,0,0,0,0];
        this.selectedStar = 0;
        this.sendReview = false;

        this.teleConsultService.getTeleConsultUserPlatformData(userData.id);
      }else{
        this.snackBar.open("Something went wrong.",'',{
          duration:3000
        });
        this.sendReview = false;
      }

    });

  }

  newDateOrderReviews(reviews: Array<any>): any{
    if (reviews.length > 1) {
      let sortedReviews = reviews.sort((a,b)=>{
        let timeSplitA = a.time_stamp.match(/\d+/);
        let timeSplitB = b.time_stamp.match(/\d+/);
        let millisecondsA =  Number(timeSplitA);
        let millisecondsB =  Number(timeSplitB);
        let sortA = new Date(millisecondsA);
        let sortB = new Date(millisecondsB);
        return sortB.getTime() - sortA.getTime();
      });
      //console.log(sortedReviews);
      return sortedReviews;
    }else{
      return reviews;
    }
  }

  addToFavourite(i){
    this.doctorList[i].favouriteDoctor = true;
  }

  removeFromFavourite(i){
    this.doctorList[i].favouriteDoctor = false;
  }

  showModal(message:string = '', spinner:boolean = true){
    this.showLoadingModalSpinner = spinner;
    this.showLoadingModalContent = message;
    this.showLoadingModal = true;
  }
  hideModal(){
    this.showLoadingModal = false;
    this.showLoadingModalSpinner = false;
    this.showLoadingModalContent = '';
  }

  reasonForVisit(doctor_id,selected_id, startIndex = 1, endIndex = 10){
    console.log(doctor_id);
    this._constant.newConsultantID = doctor_id;
    if(this.doctorStatusMappingList[doctor_id] == undefined || this.doctorStatusMappingList[doctor_id] == null) return;
    if(this.doctorStatusMappingList[doctor_id] != 'Online'){
      this.showModal('Doctor is ' + this.doctorStatusMappingList[doctor_id] + '. Please try after sometime', false);
      setTimeout(()=>{this.hideModal();}, 2000);
      return;
    }
    // if(this.doctorStatusMappingList.filter((item)=>{return item.ihl_consultant_id == doctor_id && item.doctor_status == 'Online'}).length == 0){
    //   this.showModal('Doctor is not Online', false);
    //   setTimeout(()=>{this.hideModal();}, 2000);
    //   return;
    // }
    let selectedDoctor = this.doctorList.find(item=>{return item.ihl_consultant_id == doctor_id});
    if(selectedDoctor == undefined) return;
    // TODO: Validate Doctor Status from API
    this.showModal('Checking consultant slot ...');
    this.teleConsultService.appointmentConsultantDataList(doctor_id, startIndex, endIndex).subscribe(data =>{
      //var res= JSON.parse(data.replace(/&quot;/g,'"'));
      var res = JSON.parse(data.json.replaceAll("\\\\\\&quot;",'').replaceAll("\\&quot;",'"').replaceAll("&quot;",''));
      let appointmentArray = [];
      let todayDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');
      let loopRepeat = false;
      let findPreviosDateAppointment = false;
      this.todayAppointmentArr = [];

      res.forEach(function(val, key) {
        //appointmentArray.push(JSON.parse(res[key]));

        /*CHECK TODAY APPOINTMENT */
        let appointmentDateTime = val['Book_Apointment']['appointment_start_time'];

        if (appointmentDateTime.includes(todayDate))
          appointmentArray.push(val);

        if (appointmentDateTime.includes(todayDate) && key == 9)
          loopRepeat = true;
      });

      this.todayAppointmentArr = this.todayAppointmentArr.concat(appointmentArray);

      appointmentArray = this.todayAppointmentArr;

      if (this.todayAppointmentArr.length != 0 && !loopRepeat) {
        appointmentArray = appointmentArray.map(item=>{return item['Book_Apointment'];})
        
        // AppointmentArray contains appointment which are about to happen or are happening or are confirmed to happen

        appointmentArray = appointmentArray.filter(item=>{
          if(item.call_status == null || item.call_status == undefined) item['call_status'] = 'requested';
          if(item.call_status.toLowerCase() == 'completed') return false;
          if(item.appointment_status == undefined || item.appointment_status == null) return false;
          if(item.appointment_status.toLowerCase() == 'approved'){
            return true;
          }
          return false;
        });
        let can_make_call = true;
        const TIME_INTERVAL = 15*60*1000;
        let _len = appointmentArray.length;
        let now_time = (new Date()).getTime();
        for(let i=0; i<_len; ++i){
          let end_date = (new Date(appointmentArray[i].appointment_end_time)).getTime();
          if(end_date <= now_time) continue;
          let start_date = (new Date(appointmentArray[i].appointment_start_time)).getTime();
          if(start_date <= now_time){
            can_make_call = false;
            break;
          }
          if(start_date >= now_time && (start_date-now_time) < TIME_INTERVAL){
            can_make_call = false;
            break;
          }
          if(appointmentArray[i].call_status != undefined && appointmentArray[i].call_status.toLowerCase() == 'on_going'){
            console.log('Ongoing' , appointmentArray[i]);
            can_make_call = false;
            break;
          }
        }

        if(can_make_call == false){
          this.showLoadingModalSpinner = false;
          this.showLoadingModalContent = 'Consultant/Doctor is busy. Please try after sometime or book an appointment';
          setTimeout(()=>{
            this.hideModal();
          }, 3500);
          return;
        }
        else{
          console.log('Slot avaliable');
          this.hideModal();
          this._constant.selectedDoctor = selectedDoctor;
          this._constant.reachingVideoCallPageFrom = 'LiveAppointemnt';
          var d = new Date();
          d = new Date(d.getTime());
          var date_format_str = d.getFullYear().toString()+"-"+((d.getMonth()+1).toString().length==2?(d.getMonth()+1).toString():"0"+(d.getMonth()+1).toString())+"-"+(d.getDate().toString().length==2?d.getDate().toString():"0"+d.getDate().toString())+" "+(d.getHours().toString().length==2?d.getHours().toString():"0"+d.getHours().toString())+":"+(((d.getMinutes())).toString().length==2?((d.getMinutes())).toString():"0"+((d.getMinutes())).toString())+":00";
          this._constant.appointmentDetails = Object.assign(selectedDoctor , {'bookTime':date_format_str});
          this.router.navigate(['/teleconsult-confirm-visit']);
        }
      } else {
        if (startIndex == 1) {
          this.hideModal();
          this._constant.selectedDoctor = selectedDoctor;
          this._constant.reachingVideoCallPageFrom = 'LiveAppointemnt';
          var d = new Date();
          d = new Date(d.getTime());
          var date_format_str = d.getFullYear().toString()+"-"+((d.getMonth()+1).toString().length==2?(d.getMonth()+1).toString():"0"+(d.getMonth()+1).toString())+"-"+(d.getDate().toString().length==2?d.getDate().toString():"0"+d.getDate().toString())+" "+(d.getHours().toString().length==2?d.getHours().toString():"0"+d.getHours().toString())+":"+(((d.getMinutes())).toString().length==2?((d.getMinutes())).toString():"0"+((d.getMinutes())).toString())+":00";
          this._constant.appointmentDetails = Object.assign(selectedDoctor , {'bookTime':date_format_str});
          this.router.navigate(['/teleconsult-confirm-visit']);
          return;
        }
        startIndex = startIndex + 10;
        endIndex = endIndex + 10;
        this.reasonForVisit(doctor_id, '', startIndex, endIndex);
      }
    });
    // this._constant.selectedDoctor = selectedDoctor;
    // this._constant.teleconsultCrossbarServiceData['selectedDoctorSessionId'] = this.doctorStatusMappingList.find(item=>{
      // return item.ihl_consultant_id = doctor_id;
    // }).session_id;
    // this._constant.reachingVideoCallPageFrom = 'LiveAppointemnt';
    // var d = new Date();
    // d = new Date(d.getTime());
    // var date_format_str = d.getFullYear().toString()+"-"+((d.getMonth()+1).toString().length==2?(d.getMonth()+1).toString():"0"+(d.getMonth()+1).toString())+"-"+(d.getDate().toString().length==2?d.getDate().toString():"0"+d.getDate().toString())+" "+(d.getHours().toString().length==2?d.getHours().toString():"0"+d.getHours().toString())+":"+(((d.getMinutes())).toString().length==2?((d.getMinutes())).toString():"0"+((d.getMinutes())).toString())+":00";

    // this._constant.appointmentDetails = Object.assign(selectedDoctor , {'bookTime':date_format_str});
    // this.router.navigate(['/teleconsult-confirm-visit']);
  }

  showTeleST(){
    this.router.navigate(['/teleconsult-speciality']);
  }

  seperateDoctorListBasedOnAffiliation: Function = (doctorsObj: any[]): void => {
    console.log(doctorsObj);
    let doctors: any[] = doctorsObj;
    if (doctors.length > 0) { // Prefix name is given wrong (eg: Dr..) while creating the doctor in genix portal.
      doctors.forEach((element,index) => {
        let name = ((element.name).trim()).split(" ");
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
        doctors[index].name = doctorName;
        //console.log(doctorName);
      });


      if (this._constant.teleconsultationFlowSelected == "genric") {

        //step:1--> Filter exclusive false and undefined, null.
        this.doctorList = this.doctorList.filter(obj => {
          return obj.exclusive_only != true;
        });

        //step:2--> Invoke consutant image if doctor list not empty.
        if(this.doctorList.length > 0){
          this.retrieveConsultantImage(this.doctorList);
        }else{
          this.doctorList = [];
        }
      }else if (this._constant.teleconsultationFlowSelected == "affiliate") {

        //affiliated company image
        if(this._constant.teleconsultationAffiliationSelectedCompanyImg != '') {
          this.brand_image_url_exist = true;
          this.brand_image_url = this._constant.teleconsultationAffiliationSelectedCompanyImg;
        }

        //step:1--> Filter only exclusive true doctors.
        let exclusiveDoctors = doctors.filter(obj => {
          //return obj.exclusive_only == true;
          return obj;
        });
        console.log(exclusiveDoctors);

        if (exclusiveDoctors.length > 0) {

          //step:2--> Remove empty and undefined affiliation
          let validAffiliatedDoctors = exclusiveDoctors.filter(obj => {

            return (obj.affilation_excusive_data != undefined && obj.affilation_excusive_data != null && obj.affilation_excusive_data.affilation_array !=undefined && obj.affilation_excusive_data.affilation_array != null && obj.affilation_excusive_data.affilation_array.length > 0);
          });
          console.log(validAffiliatedDoctors);


          if(validAffiliatedDoctors.length > 0){

            //step:3--> Check whether the selected affiliate present & return selected affilited doctors.
            let selectedAffiliatedDoctors = validAffiliatedDoctors.filter(obj => {
              let verifyAffiliatePresent = obj.affilation_excusive_data.affilation_array.some(element => {

                if (element.affilation_unique_name != undefined && element.affilation_unique_name != null && element.affilation_unique_name.trim().length > 0) {
                  return element.affilation_unique_name == this._constant.teleconsultationAffiliationSelectedName;
                }else{
                  return false;
                }
              });

              return verifyAffiliatePresent == true;
            });
            console.log(selectedAffiliatedDoctors);

            //step:4--> Remove other affiliation from affiliation array.
            if (selectedAffiliatedDoctors.length > 0) {
              let retriveOnlySelectedAfilliation = selectedAffiliatedDoctors.map((element, index, arr) => {

                let removeNonMatchAffiliates = element.affilation_excusive_data.affilation_array.filter(obj=> {
                  return  obj.affilation_unique_name ==  this._constant.teleconsultationAffiliationSelectedName;
                });
                element.affilation_excusive_data.affilation_array =  removeNonMatchAffiliates;

                return element;
              });
              console.log(retriveOnlySelectedAfilliation);

              this.doctorList = retriveOnlySelectedAfilliation;
              if (this.doctorList.length > 0) {
                this.retrieveConsultantImage(this.doctorList);
              }

            }else{
              this.doctorList = [];
            }

          }else{
            this.doctorList = [];
          }
        }else{
          this.doctorList = [];
        }
      }
    }
  };

  retrieveConsultantImage(consultantObj: Array<any>): void{
    let consultantId  = consultantObj.map(obj  => {
      if (obj.vendor_id == "IHL") {
        this.consultantImagesById[obj.ihl_consultant_id] = Base64Image.base_64;
      } else {
        this.consultantImagesById[obj.vendor_consultant_id] = Base64Image.base_64;
      }
      return obj;
    });

    let ihlConsultantList = consultantObj.filter(obj  => {
      return obj.vendor_id === "IHL";
    });

    ihlConsultantList = ihlConsultantList.map(obj  => {
      return obj.ihl_consultant_id;
    });

    let genixConsultantList = consultantObj.filter(obj  => {
      return obj.vendor_id === "GENIX";
    });

    genixConsultantList = genixConsultantList.map(obj  => {
      return obj.vendor_consultant_id;
    });

    let consultantIdValue: consultantIdObj<(string | number)[]> = {
      consultantIdList: ihlConsultantList,
      vendorIdList:  genixConsultantList
    }

    let promise = new Promise((resolve, reject) => {
      this.teleConsultService.getConsultantImage(JSON.stringify(consultantIdValue)).subscribe(
        res => {
          resolve(res);
        },
        (error: any) => {
          reject("error while fetching consultant image");
        }
      );
    });

    promise.then(res => {
      this.updateConsultantImage(res);
    }).catch(res => {
      console.error(res);
    });

  }

  async updateConsultantImage(res: any): Promise<void> {
    let objIhlList = res.ihlbase64list.filter(obj => {
      return obj.base_64.trim().length > 0;
    });

    let objGenixList = res.genixbase64list.filter(obj => {
      return obj.base_64.trim().length > 0;
    });


    if (objIhlList.length > 0) {
      let ihlConsultantWithImages = objIhlList.map(obj => {
        if(obj.base_64.split(",")[1].length > 0){
          this.consultantImagesById[obj.consultant_ihl_id] = obj.base_64;
          return obj;
        }else{
          return "not valid image";
        }
      });
    }

    if (objGenixList.length > 0) {
      let genixConsultantWithImages = objGenixList.map(obj => {
        if(obj.base_64.split(",")[1].length > 0){
          this.consultantImagesById[obj.consultant_ihl_id] = obj.base_64;
          return obj;
        }else{
          return "not valid image";
        }
      });
    }

  }

  imageConverter(baseimage){
    return this.sanitizer.bypassSecurityTrustResourceUrl(baseimage);
  }

  _isLanguageArrayEmpty(val: string): number{
    return val.trim().length;
  }

  //refund modal window
  refundInfo() {
    this._dialog.open(ModalComponent);
    this._constant.refundInfo = true;
    this._constant.showConsultantRefundInfo = true;
  }

  /**
   * @description The below Functionality is to fine tune the doctor name and qulaification because qualification also added with doctor name
   * @param doctorname - name of the doctor.
   * @param qualification - qualification of doctor.
   */
  doctorNameAndQualification(doctorname: string, qualification: string): string{
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

  moveLeft() {
    this.dragScroll.moveLeft();
  }

  moveRight() {
    this.dragScroll.moveRight();
  }

  //search consultant functionality implementation
  searchConsultant() {
    const searchTerm = fromEvent(document.getElementById('searchTerm'), 'keyup');
    const searchResult = searchTerm.pipe(
      //filter(e => e['target']['value'] != ''),
      debounceTime(1000),
      distinctUntilChanged(),
      switchMap(term => {
        if(term['target']['value'] == '') {
          this.ngOnInit();
          return;
        }
        this.showModal();
        let searchObj = {"key_word": term['target']['value']};
        if(this._constant.teleconsultationFlowSelected == "affiliate") {
          searchObj["is_affliated"] = true;
          searchObj["affliation_name"] = this._constant.teleconsultationAffiliationSelectedName;
        } else {
          searchObj["is_affliated"] = false;
          searchObj["affliation_name"] = "";
        }
        return this.teleConsultService.searchTrainerOrConsultant(JSON.stringify(searchObj));
      }),
      catchError(e => {
        this.hideModal();
        this.searchErrorMsg = e.message;
        console.log(this.searchErrorMsg);
        this.ngOnInit();
        return throwError(e);
      })
    );
    searchResult.subscribe(result => {
      this.hideModal();
      console.log(result);
      this.searchResult = result;
      this.displaySearchResults();
    });
  }

  displaySearchResults() {
    if(this.searchResult['name_filter_list'].length != 0) this.doctorList = this.searchResult['name_filter_list'];
    else if(this.searchResult['speciality_filter_list'].length != 0) this.doctorList = this.searchResult['speciality_filter_list'];
    else if(this.searchResult['language_filter_list'].length != 0) this.doctorList = this.searchResult['language_filter_list'];
    else this.doctorList.length = 0;

    console.log(this.doctorList);
  }

}

interface ConsultantBelongsTo {
  consultantId: String | number;
  vendorId: String | number;
}

interface reviewObj{
  rating_text: string;
  user_rating: number;
  time_stamp: string;
  user_name: string;
}

type consultantIdObj<T> = {
  consultantIdList: T,
  vendorIdList: T
};

enum Base64Image{
  base_64 = "data:image/jpeg;base64,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+mm/8MY//XR9u5/1f/j3/wBal1P/AJZ/j/SqRoAufbsD/Vf+PUfYRn/W8/7v/wBeqfatnvQBSFjn/lr/AOO//Xpf+PL/AKab/wAMYq4OnWqOqsERHOcAHoPpQG42S9eQiCJNrsPvbvuj1p6KqIEUYUDAqGzhaNC8n+tflvb0H4VPSRUtNEFFFFMkKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAK8Q/asdvsugx/wAPmSt+OBXt9eMftVQFtD0S5A+5dSIT9Uz/AEoA+fqKKKACiiigAooooAKKKKACiiigAooooAKKKKACiitXwxoGpeItSWy06EueskhHyRj1JqZSUVzSeg4xcnZFjwT4avPE+spZW4KQr8082OI1/wAT2FfR2iaXZ6PpkOn2EQigiGAB1J7k+pNUvB3hyy8NaOljaDc55mlPWRu5+ntWzXy2OxjxE7L4V/Vz38JhlRjd7sWikpa4DrEpaKKAPHf2hwPtuktjny3GfxFeU16j+0NJ/wATnSosni2Zv/HsV5dX1uXL/Zo/11PncZ/HkFFFFdpzH0t+zHN5nw7njJ5i1GQAexSM/wAya9SryL9ltyfB2pp2W/yPxjX/AAr12gAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKQyNCTIoyMfMP60tFA0xPt3/AEy/8epPsP8A01/8dqrKnluR/Cfu/wCFa9ANFL7F/wBNf/Hf/r0ufsWf+Wm/8MY//XVzqetU9T/5Z+vP9KBB9vP/ADy/8eo+3f8ATL/x6qX+NGaALn2H/pr/AOO0fYv+mn/jv/16ujpR6c0AUjZY6y/+O/8A16KunH+cUUAOApKxqPpQBd1P/ln+P9KpVd0z/lp+H9aue1AGNW1Te3XvWPjnrQBsjmqNzie6UdVhPPu3/wBaqLltoRMb34X6+tXYY1iiWNeQB19fekUtFcfRRRTJCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAry79pqDzfh5DNjJhvoz+BVgf6V6jXBfH6HzvhdqRxkxtG4/BwP60AfKlFFFABRRRQAUUUUAFFFFABRSorO21FLH0AzV610bV7ogW+mXkuem2FqTklu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pr/47/8AXpPsP/TU8/7P/wBeruPalyKBFIWP/TT/AMcoq4RnsKKAHUnb1rGooAt6su8wxdd7EH6cZp1VLUbrhz2QAfif8/rVukU9EkFFFFMkKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAK5nV4/Lv5BjhvmHNdNWP4ji/1cw/3TXm5rT56F+x3ZfPlq27mNRRRXy57oUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUtABRSUUALRRSUAFLRRQAUd6SloAKSlooAK6TR4/LsE45b5jXOwoZZUjHViBXWouxFUdhivayaneUp9tDzMynaKiLRRRX0B44UUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAVDdLlQ3of0qagjIoGi3n2oOaxsetFAjZx6ZorGNFAC0HgEngVd+w/8ATX/x2obuzKQHEmSxCj5fU4oGld2EsVK24Y53OS5z79P0wPwqegAAADoOlFCBu7uFFFFAgooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAqvqMP2i0ePvjI+tWKKmcFOLi9mVGTjJSRx5GDg0ldDe6XFO5kRjGx68cGmR6PAq5kdnOPpXzUsqrqVlt3PbWYUuW73MGinOAHYDoCabXms7gooopAFFFFABRRRQAUUUUAFFFFABS0lFABRS0UAJRS0lAC0lFLQAlFLRQAUVo6RYxXUcjShuDhSDVn+xE8zPnnZ6Y5rup5fXqQU4rRnLPGUoScZPYr6DAXuTMR8qdPrW9UdvDHbxCOMYUVJX0WDw/wBXpKHXqeNia3tqnN0Ciiiuo5wooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAqTriVuODzTO1W3iEsiDdtzkdM0v2H/pr1/2aBsqD60Vb+wg/8tR+VFAi8Kq3Z3TxJ/dy5+vQfzNWxVFyWuZTzxhf0/8Ar0mVHqxaKKKZIUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQByl8pW8lBGPmPFQ1c1lSuoSZ74IqnXxeIjy1ZLzZ9PRfNTi/IKKKKxNAooooAKKKKACiiigAooooAWikooAWkpaKACkpaKACikpaAEpaKO9AG/4fUrZFv7zEitGqmjoE0+LHcZq3X2WEjy0ILyR81iHerJ+YUUUV0GIUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFAAcjkdQc1cBBGR396p1PCcxDOScY6UD6Ehyemfzoo59f0ooEY5OKns122yE9W+Y/jzVaU/uz78VeUbVCjoBil1K+yLRRRTJCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAMDxCgW8Vs/eSs2tnxInyxSADgkE1jV8lmEOXESPocHLmoxCiiiuI6gooooAKKKKACiiigAooooAKWkpaACkopaACikooAWiikoAKWkp8K75kTOMsBmmld2E3ZXOptFC2sSgY+UcVLQBgAUV9xFcqSPlpO7uFFFFMQUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABVW4XEp9+etWqguhyrY9s0DRAaKUUUCJ7m18sxnfnLjgjr3qanXZBuIUI5AZwfyH/s1NpFPZBRRRTJCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAKOtx+ZYMQASpzXOV18qCSNkPRhiuTmQxStGeqnFfPZxStONTvoexltS8XDsMooorxj0wooooAKKKKACiiigAooooAWkpaKACiikoAWkpaKAEpaKKACrmjx+ZfpxwvzHiqVbfh2AhHnYfe4WuzAUvaV4rtr9xz4upyUmzWooor64+cCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACmyRiTavTnr6U6kJAGScAck/SgaD7Bn/lr/AOO//Xoq4fb+VFAipNzeOQQQEUD2OTn+lFVrEf61wfvP/IAVZpIqW4UUUUyQooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigArG160OftKDjo9bNIyh1KsMg9a58Th416bgzahWdGakjj6K0NV09rdjJECYz+lZ9fJVqM6M3Ca1PoqdSNSPNEKKKKyLCiiigAooooAKKKKACiiloAKKKKACiiigBKWinRRvLIERcsaaTbsgbSV2OtoXnmWJByTz7CupgjWKJY1HCjFV9NsktI8nBkbqat19Rl2D+rw5pfEzwcZifbStHZBRRRXonEFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFBGRg9D1oooAsxMxjUnAJANFZThgxB65NFA2S2IAhLA5DOT/AJ/Kp6itUMcAQ9mb/wBCNS0lsOXxMKKKKZIUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAI6h1KsAQeoNc/quntbsZIxmI/pXQ0jKrKVYZB6iuXFYSGJhZ79GdGHxEqMrrY4+ipNQMMWpzWqfKVwQD3yM1HXyU4OEnF9D6GMuaKkuoUUUVBQUUUUAFFFFABS0lFABRS0UAJRS02R1jQu5AUdzQBJDG8sgjjUsxrotNsUtUycNIeppuixRLYRTIOZUDEnryKvV9Nl+BjSSqS1b/AAPExmLdRuEdEFFFFeoeeFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQBUkBEjZ7nNFTNbmV2bfjnHT2FFIpodbNut4m9UB/Sn1Hajbawr6RqP0qShbBL4mFFFFMkKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigDz3xFI51y5Yscq+AfTFSWN6JcRykB+x9ar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"
}
