import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { TeleConsultService } from '../../services/tele-consult.service';
import { ConstantsService } from '../../services/constants.service';
import { Router } from '@angular/router';
import { AuthServiceLogin } from 'src/app/services/auth.service.login';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ModalComponent } from '../modal/modal.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EventEmitterService } from 'src/app/services/event-emitter.service';
import { TeleconsultationCrossbarService, Channel } from 'src/app/services/tele-consult-crossbar.service';
import { PublishToChannelOptions } from '../../services/tele-consult-crossbar.service';
import { IfStmt } from '@angular/compiler';
import { FireStoreService } from '../../services/firestore.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-teleconsult-myappointment',
  templateUrl: './teleconsult-myappointment.component.html',
  styleUrls: ['./teleconsult-myappointment.component.css']
})
export class TeleconsultMyappointmentComponent implements OnInit, OnDestroy {
  consultationHistory: any = [];
  consultationAppointments:any = [];
  userName: any;
  userAddress: any;
  userMobNumber: any;
  userMail: any;
  doctorName: any;
  state:any;
  deductedIgstAmt:any;
  igstAmt:any;
  sgstAmt:any;
  appoinmentDate: any;
  couponDiscount:any = 0;
  billObj: any;
  appointmentOn: any;
  consultationFees: any;
  paymentMode:any;
  totalAmount:any;
  isLoading:boolean = true;
  userDataReceived: boolean = false;
  userApiTriggerCount: number = 0;
  cancelButton:boolean = false;
  printInvoiceNumber: any;
  appointmentArray: any[] = [];
  joinCallBtnLoad:boolean = false;
    /**
   * To map trainer/consultant id with current status
   */
  consultantStatusMapping = {};
  /**
   * Maps the active subscription id with its corresponding trainer/consultant id
   */
  appointmentIdMappingWithConsultantId = {};
  transactionIdArray: Array<any> = [];
  constructor(private _teleConsultService:TeleConsultService,
              private teleConsultCrossbarService:TeleconsultationCrossbarService,
              private router: Router,
              private _constantsService: ConstantsService,
              private authServiceLogin: AuthServiceLogin,
              private authService: AuthService,
              private dialog: MatDialog,
              private snackBar: MatSnackBar,
              private eventEmitterService: EventEmitterService,
              private fireStoreService: FireStoreService) { }

  ngOnInit() {
    this.ngAfterOnInit();
  }

  async ngAfterOnInit(){
    this.isLoading = true;
    // this.consultationAppointment = ["Appointment request pending" , "Appointment request approved"];
    this._constantsService.confirmAppointment = false;
    this._constantsService.transactionIdForTeleconsultation = "";
    this._constantsService.printInvoiceNumberForTeleconsultation = "";
    let userData = JSON.parse(this._constantsService.aesDecryption("userData"));
    this.getTransactionId(userData.id);
    await this.appointStatusLoop();
  }

  async getAppointmentStatus(start: number, end: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this._teleConsultService.viewAppointmentStatusPagination(start, end).subscribe((data:any) => {
        console.log(data);
        resolve(data);
      },
      (error: any): void => {
        reject(error);
      }
      );
    })
  }

  async appointStatusLoop(){
    var start_index = 1;
    var end_index = 20;
    this.joinCallBtnLoad = true;
    while (true) {  // Keep a conditoin for satisfying while loop.
      try {
        var data = await this.getAppointmentStatus(start_index, end_index);
        data['Appointments'].forEach(element => {//appointment_start_time: "2020-12-15 07:00 PM" appointment_end_time: "2020-12-15 07:30 PM"
          let appointmentStart = element.appointment_start_time.split(' ');
          let appointmentEnd = element.appointment_end_time.split(' ');
          let appointmentStartDateSplit = appointmentStart[0].split('-');
          let appointmentEndDateSplit = appointmentEnd[0].split('-');
          let appointmentStartDateTime = appointmentStartDateSplit[1]+"/"+appointmentStartDateSplit[2]+"/"+appointmentStartDateSplit[0]+" "+appointmentStart[1]+" "+appointmentStart[2];
          let appointmentEndDateTime = appointmentEndDateSplit[1]+"/"+appointmentEndDateSplit[2]+"/"+appointmentEndDateSplit[0]+" "+appointmentEnd[1]+" "+appointmentEnd[2];
          element.appointment_start_time = appointmentStartDateTime;
          element.appointment_end_time = appointmentEndDateTime;
        });
  
        // Commented on 18/12/2023.
        // data['consultation_history'].forEach(element => {//appointment_start_time: "2020-12-15 07:00 PM" appointment_end_time: "2020-12-15 07:30 PM"
        //   let appointmentStart = element.appointment_details.appointment_start_time.split(' ');
        //   let appointmentEnd = element.appointment_details.appointment_end_time.split(' ');
        //   let appointmentStartDateSplit = appointmentStart[0].split('-');
        //   let appointmentEndDateSplit = appointmentEnd[0].split('-');
        //   let appointmentStartDateTime = appointmentStartDateSplit[1]+"/"+appointmentStartDateSplit[2]+"/"+appointmentStartDateSplit[0]+" "+appointmentStart[1]+" "+appointmentStart[2];
        //   let appointmentEndDateTime = appointmentEndDateSplit[1]+"/"+appointmentEndDateSplit[2]+"/"+appointmentEndDateSplit[0]+" "+appointmentEnd[1]+" "+appointmentEnd[2];
        //   element.appointment_details.appointment_start_time = appointmentStartDateTime;
        //   element.appointment_details.appointment_end_time = appointmentEndDateTime;
        // });
        this.appointmentArray = this.appointmentArray.concat(data['Appointments']);

        // check for value available. break. show info.

        this.getFinetunedAppointmentList(this.appointmentArray);
        this.getFinetunedPastHistoryList(this.appointmentArray);
        // this._constantsService.consultationUserData = data;
        this.isLoading = false;
        this.userDataReceived = true;
        if (this._constantsService.fireStore)
          this.initiateFireStore();
        else
          this.initiateCrossbar();
        this.generateJoinCallButtonSequence(this.consultationAppointments);

        if(data['Appointments'].length < 20){
          this.joinCallBtnLoad = false;
          break;
        }

        start_index += 20;
        end_index += 20;

      } catch(error) {
        console.log("user data error");
          if (this.userApiTriggerCount <= 2) {
            this.ngAfterOnInit();
            this.userApiTriggerCount++;
          }else{
            this.isLoading = false;
            this.userDataReceived = false;
          }
        break;  
      }
    }
  }

  joinCall(appointmentID, ihl_consultant_id, selectedAppointment){
    console.log('in here');
    console.log(appointmentID);
    console.log(ihl_consultant_id);
    console.log(selectedAppointment);
    this._constantsService.consultantDataForReview = selectedAppointment;
    this._constantsService.reachingVideoCallPageFrom = 'BookAppointment';
    if (this.transactionIdArray.length > 0) {
      let uniqueTransactionId = this.transactionIdArray.find(Obj => {
        return Obj.ihl_appointment_id == selectedAppointment.appointment_id;
      });
      this._constantsService.transactionIdForTeleconsultation = (uniqueTransactionId != undefined)? uniqueTransactionId.transaction_id :  "";
      this._constantsService.printInvoiceNumberForTeleconsultation = (uniqueTransactionId != undefined)? uniqueTransactionId.invoice_number :  "";
    }
    if (selectedAppointment.vendor_id === "GENIX") {
      this.router.navigate(['/genixConsultation']);
    }else{
      // for(var i = 0; i < this._constantsService.consultationPlatformData.consult_type.length; i++){
      //   //console.log("consutnat type = "+ i);
      //   if(this._constantsService.consultationPlatformData.consult_type[i].consultation_type_name != "Fitness Classes"){
      //     for(var j = 0; j < this._constantsService.consultationPlatformData.consult_type[i].specality.length; j++ ){
      //       //console.log("consutnat type = "+ i + "specality = "+ j);
      //       for(var k = 0; k < this._constantsService.consultationPlatformData.consult_type[i].specality[j].consultant_list.length; k++){
      //         //console.log("consutnat type = "+ i + "specality = "+ j + "consultant_list = " + k);
      //         if(this._constantsService.consultationPlatformData.consult_type[i].specality[j].consultant_list[k].ihl_consultant_id == ihl_consultant_id){
      //           this._constantsService.selectedDoctor = this._constantsService.consultationPlatformData.consult_type[i].specality[j].consultant_list[k];
      //         }
      //       }
      //     }
      //   }
      // }
      this._constantsService.selectedDoctor = {};
      this._constantsService.selectedDoctor['ihl_consultant_id'] = ihl_consultant_id;
      this._constantsService.newAppointmentID = appointmentID;
      this._constantsService.newConsultantID = ihl_consultant_id;
      this._constantsService.reachingVideoCallPageFrom = 'BookAppointment';
      console.log(appointmentID);
      console.log(this._constantsService.selectedDoctor);
      this._constantsService.consultantDataForReview = selectedAppointment;
      this.router.navigate(['/teleconsult-video-call']);
    }
  }


  extractDate(js_datetime){
    if(js_datetime == undefined || js_datetime == '') return '';
    let a = new Date(js_datetime);
    return a.getDate() + '-' + a.toLocaleString('default',{'month':'short'}) + '-'+a.getFullYear();
  }

  extractTime(js_datetime){
    if(js_datetime == undefined || js_datetime == '') return '';
    let a = new Date(js_datetime);
    return a.toLocaleTimeString('default',{'hour':'numeric',hour12:true,'minute':'numeric'})
  }

  getDuration(start_date,end_date){
    if(start_date == undefined || start_date == '') return '';
    if(end_date == undefined || end_date == '') return '';
    start_date = new Date(start_date);
    end_date = new Date(end_date);
    return (end_date-start_date)/(1000*60) + ' min';
  }

  consultationDetails(index){
    console.log(this.consultationHistory[index]);
    this._constantsService.getTeleConsulationHistory = this.consultationHistory[index];
    this.router.navigate(['/consultation-details-view']);
  }

  refundBtnShow(req) {
    let callStatus, appointmentStatus = "";
    let res = false;

    if(req.call_status != undefined)
      callStatus = req.call_status.toLowerCase();

    if(req.appointment_status != undefined)
      appointmentStatus = req.appointment_status.toLowerCase();

      // appointmentStatus != "rejected" To hide the refund initiate button when the doctor/user rejected the call/appointment
    if(callStatus != 'completed' && appointmentStatus != "rejected" && appointmentStatus != "canceled" && req.consultation_fees != "0"){
      res = true;
    }

    //console.log("callStatus ="+ callStatus + " ; appointmentStatus = " + appointmentStatus +";  req.consultation_fees = "+ req.consultation_fees)

    return res;
  }

  showRefundModelbox(consultationAppointment){
     this._constantsService.cancelAndRefundModelBoxBtn = false;
    this._constantsService.cancelAndRefundModelBoxInput = true;
    this._constantsService.teleconsultMyAppointmentCancelButton = true;
    this.dialog.open(ModalComponent).afterClosed().subscribe(response=>{
      console.log(response);
      let reason = "";
      if (response.reason.trim().length == 0) {
        reason = response.usersReason;
      }else if (response.usersReason == undefined) {
        reason = response.reason;
      }else{
        reason = `${response.reason}, ${response.usersReason}`
      }
      console.log(reason);
      this._constantsService.teleconsultMyAppointmentCancelButton = false;
      if(response.cancel_appointment == true){
        //return 0;
        //this.cancelAppointmentAndRefund(consultationAppointment);
        this.showCancelAppointmentDialog(consultationAppointment.appointment_id, consultationAppointment, reason);
      }
    });
  }

  showCancelandRefundModelBox(apmt_id, consultationAppointment){
    this._constantsService.cancelAppointmentModelBoxTitle = 'Tele Consultation';
    this._constantsService.cancelAndRefundModelBoxBtn = true;
    if(this.appointmentJoinCallButtonStatusMapping[consultationAppointment.appointment_id] == true) {
        this._constantsService.cancelAndRefundModelBoxInput = true;
    } else {
      this._constantsService.cancelAndRefundModelBoxInput = false;
    }

    this._constantsService.teleconsultMyAppointmentCancelButton = true;
    this.dialog.open(ModalComponent).afterClosed().subscribe(response=>{
      console.log(response);
      this._constantsService.teleconsultMyAppointmentCancelButton = false;
      this.cancelButton = true;
      if(response.cancel_appointment == true){
        //return 0;
        //this.cancelAppointmentAndRefund(consultationAppointment);
        console.log(consultationAppointment);
        this.showCancelAppointmentDialog(apmt_id, consultationAppointment, response.reason);
      }else{
        this.cancelButton = false;
      }
    });
  }

  cancelAppointmentAndRefund(consultationAppointment){
    this.authService.cancelAppointment(consultationAppointment['appointment_id']).subscribe(data => {
      console.log(data);
      this._constantsService.processingContent = false;
      this.eventEmitterService.onModalClose();
      if (data.status === "cancel_success" || data == "Database Updated") {
        this._constantsService.consultationUserData.appointments.find(obj =>{
          if (obj['appointment_id'] === consultationAppointment['appointment_id']){
            return obj['appointment_status'] = 'canceled';
          }
        });
        this.getFinetunedAppointmentList(this._constantsService.consultationUserData.appointments);
        this.getFinetunedPastHistoryList(this._constantsService.consultationUserData.appointments);

        this._constantsService.cancelAndRefundAppointment = true;
        this.dialog.open(ModalComponent);

        setTimeout(() => {
          this._constantsService.cancelAndRefundAppointment = false;
          this.eventEmitterService.onModalClose();
        }, 1000 * 6);
      }else {
        this.snackBar.open("Something went wrong.. Please try again later", '',{
          duration: 6000,
          panelClass: ['error'],
        });
      }
    })
  }



  showCancelAppointmentDialog(apmt_id, consultationAppointment, response){
    // canceled status share to consulatant using crossbar
    let cancel_appointment: CancelAppointmentParameters = {
      ihl_appointment_id : apmt_id,
      canceled_by: "user", //user or consultant
      reason: response //consultant_no_show or any other reason
    };
    let url: string = "";
    console.log(consultationAppointment);
    console.log(cancel_appointment);
    if (consultationAppointment['consultation_fees'] != undefined && consultationAppointment['consultation_fees'] == "0") {
      //alert("0 fees");
      this._constantsService.processingContent = true;
      this.dialog.open(ModalComponent);
      this.authService.cancelAppointment(consultationAppointment['appointment_id']).subscribe(data => {
        console.log(data);
        this._constantsService.processingContent = false;
        this.eventEmitterService.onModalClose();
        console.log(this._constantsService.consultationUserData);
        if ( data == "Database Updated") {
          this._constantsService.consultationUserData.appointments.find(obj =>{
            if (obj['appointment_id'] === consultationAppointment['appointment_id']){
              return obj['appointment_status'] = 'canceled';
            }
          });
          this.getFinetunedAppointmentList(this._constantsService.consultationUserData.appointments);
          this.getFinetunedPastHistoryList(this._constantsService.consultationUserData.appointments);

          this.cancelButton = false;
          this.snackBar.open("Appointment cancelled", '',{
            duration: 4000
          });

          if (this._constantsService.fireStore) {
            let userData = JSON.parse(this._constantsService.aesDecryption("userData"));
            let obj = {
              'data': {cmd: 'GenerateNotification', notification_domain: 'CancelAppointment'},
              'receiver_ids': consultationAppointment['ihl_consultant_id'],
              'sender_id': userData['id'],
              'published': true
            };

            this.fireStoreService.update(consultationAppointment['appointment_id'], obj, this._constantsService.teleConsultationCollectionName);
          } else {
            if(this.teleConsultCrossbarService.is_connected == true){
              console.log('In sending crossbar event');
              // Sending event to host about cancel Appointment
              let _data = {
                'cmd':'GenerateNotification',
                'notification_domain':'CancelAppointment',
              };
              let receiver_id = consultationAppointment['ihl_consultant_id'];
              console.log(receiver_id);
              if(receiver_id != undefined){
                let _options:PublishToChannelOptions = {
                  receiver_ids:[receiver_id],
                };
                this.teleConsultCrossbarService.publishToChannel('ihl_send_data_to_doctor_channel',_data,_options);
              }
            } else {
              this.cancelButton = false;
              console.log("crossbar connection fail");
            }
          }
        }else {
          this.cancelButton = false;
          this.snackBar.open("Something went wrong.. Please try again later", '',{
            duration: 6000,
            panelClass: ['error'],
          });
        }
      })

      return;
    }

    if (consultationAppointment.vendor_id != undefined && consultationAppointment.vendor_id != null) {

      if (consultationAppointment.vendor_id == "GENIX" || consultationAppointment.vendor_id == "APOLLO") {
        cancel_appointment = {
          appointment_id : apmt_id,
          canceled_by: "user", //user or consultant
          reason: response //consultant_no_show or any other reason
        };
        url = CancelAppointmentUrl.genix;
      }else{
        url = CancelAppointmentUrl.ihl;
      }
    }else{
      url = CancelAppointmentUrl.ihl;
    }

    this.authService.cancelAppointmentWithRefund(cancel_appointment, url).subscribe(data => {
      console.log(data);
      if(data.status == "no_such_appointment_id" || data.status == "ihl_appointment_id_is_blank"){
        this.cancelButton = false;
        this.snackBar.open("Something went wrong.. Please try again later", '',{
          duration: 1000 * 6,
          panelClass: ['error'],
        });
        return 0;
      } else if(data.status == "already_canceled_or_rejected"){
        this.cancelButton = false;
        this.snackBar.open("Your refund process is already initiated", '',{
          duration: 1000 * 6,
          panelClass: ['error'],
        });
        return 0;
      } else {
        this._constantsService.cancelAndRefundAppointment = true;

        console.log(this._constantsService.consultationUserData);
        this._constantsService.consultationUserData.appointments.find(obj =>{
          if (obj['appointment_id'] === consultationAppointment['appointment_id']){
            return obj['appointment_status'] = 'canceled';
          }
        });
        this.getFinetunedAppointmentList(this._constantsService.consultationUserData.appointments);
        this.getFinetunedPastHistoryList(this._constantsService.consultationUserData.appointments);

        //initiate refund
        let localUserData = JSON.parse(this._constantsService.aesDecryption("userData"));
        this._teleConsultService.getTransactionIdDetails(localUserData.id).subscribe(data => {
          console.log(data);
          let obj = data.filter(obj => {if(obj.ihl_appointment_id === consultationAppointment.appointment_id) return obj});
          console.log(obj);
          console.log(consultationAppointment.appointment_id)
          this._teleConsultService.initiatePayment(obj[0].transaction_id).subscribe(res => console.log(res), error => console.log(error));
        });

        this.cancelButton = false;
        this.dialog.open(ModalComponent);
        setTimeout(() => {
          this._constantsService.cancelAndRefundAppointment = false;
          this.eventEmitterService.onModalClose();
        }, 1000 * 6);

        if (this._constantsService.fireStore) {
          let userData = JSON.parse(this._constantsService.aesDecryption("userData")); 
          let obj = {
            'data': {cmd: 'GenerateNotification', notification_domain: 'CancelAppointment'},
            'receiver_ids': consultationAppointment['ihl_consultant_id'],
            'sender_id': userData['id'],
            'published': true
          };
          this.fireStoreService.update(consultationAppointment['appointment_id'], obj, this._constantsService.teleConsultationCollectionName);
        } else {
          if(this.teleConsultCrossbarService.is_connected == true){
            console.log('In sending crossbar event');
            // Sending event to host about cancel Appointment
            let _data = {
              'cmd':'GenerateNotification',
              'notification_domain':'CancelAppointment',
            };
            let receiver_id = consultationAppointment['ihl_consultant_id'];
            console.log(receiver_id);
            if(receiver_id != undefined){
              let _options:PublishToChannelOptions = {
                receiver_ids:[receiver_id],
              };
              this.teleConsultCrossbarService.publishToChannel('ihl_send_data_to_doctor_channel',_data,_options);
            }
          } else {
            console.log("crossbar connection fail");
          }
        }
      }
    }, (error: any )=>{
      this.cancelButton = false;
      this.snackBar.open("Something went wrong.. Please try again later", '',{
        duration: 1000 * 3,
        panelClass: ['error'],
      });
      return 0;
    });
  }

 /*  cancelAppointment(apmt_id, consultationAppointment){
    let id = apmt_id;
    this._constantsService.processingContent = true;
    this.dialog.open(ModalComponent);
    this.authService.cancelAppointment(id).subscribe(data => {
      console.log(data);
      this._constantsService.processingContent = false;
      this.eventEmitterService.onModalClose();
      if (data.status === "cancel_success" || data == "Database Updated") {
        this._constantsService.consultationUserData.appointments.find(obj =>{
          if (obj['appointment_id'] === consultationAppointment['appointment_id']){
            return obj['appointment_status'] = 'canceled';
          }
        });
        this.getFinetunedAppointmentList(this._constantsService.consultationUserData.appointments);
        this.getFinetunedPastHistoryList(this._constantsService.consultationUserData.appointments);
        // canceled status share to consulatant using crossbar

        // refund api call here

        this.snackBar.open("Your Apppointment is cancelled successfully!", '',{
          duration: 6000,
        });
      }else {
        this.snackBar.open("Something went wrong.. Please try again later", '',{
          duration: 6000,
        });
      }
    })
  } */



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
    await this.resetJoinCallButtonSequenceTimer();
    this._resetJoinCallButtonAssociatedObjects();
  }

  initiateFireStore() {

    // Prepare the consultant Ids
    if(this.consultationAppointments == undefined || this.consultationAppointments == null || this.consultationAppointments.length == 0) return;
    this.consultationAppointments.forEach(item=>{
      this.consultantStatusMapping[item.ihl_consultant_id] = 'Offline';
      this.appointmentIdMappingWithConsultantId[item.appointment_id] = item.ihl_consultant_id;
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
          if ('other_data' in val && val['other_data']['vid'] != '')
            this.appointmentJoinCallButtonStatusMapping[val['other_data']['vid']] = true;
          this.updateDoctorStatusFromCrossbar(val, val['consultantId'], '');
      });
    });
  }

  initiateCrossbar():void{
    // Prepare the consultant Ids
    if(this.consultationAppointments == undefined || this.consultationAppointments == null || this.consultationAppointments.length == 0) return;
    this.consultationAppointments.forEach(item=>{
      this.consultantStatusMapping[item.ihl_consultant_id] = 'Offline';
      this.appointmentIdMappingWithConsultantId[item.appointment_id] = item.ihl_consultant_id;
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
          'subscription_handler':(param, sender_id, sender_session_id)=>{this.upcomingAppointmentStatus(param, sender_id, sender_session_id);},
        }
      ],
    };

    // let callStatus = {
    //   'subscription_channels_list':[
    //     {
    //       'channel_name':'IHL_CALL_AND_CLASS_STATUS',
    //       'subscription_handler':(param, sender_id, sender_session_id)=>{this.upcomingAppointmentStatus(param, sender_id, sender_session_id);},
    //     },
    //   ],
    // };

    this.teleConsultCrossbarService.on_connection_established = ()=>{
      this.getConsultantStatusFromApi();
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
        //this.teleConsultCrossbarService.subscribeToChannel("IHL_CALL_AND_CLASS_STATUS", callStatus['subscription_channels_list'][0].subscription_handler);
      });
    }else{
      this.teleConsultCrossbarService.connect(options);
      // this.teleConsultCrossbarService.on_connection_established = ()=>{
      //   this.teleConsultCrossbarService.subscribeToChannel("IHL_CALL_AND_CLASS_STATUS", callStatus['subscription_channels_list'][0].subscription_handler);
      // }
    }
  }

  upcomingAppointmentStatus(param, sender_id, sender_session_id){
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/myappointment']);
  });

  }
  updateDoctorStatusFromCrossbar(param, sender_id, sender_session_id){
    if('status' in param == false) return;
    let _doctor = this.consultantStatusMapping[sender_id];
    if(_doctor != undefined){
      if(param['status'] == 'Busy' && 'other_data' in param && (param['other_data']['vid_type'] == 'BookAppointmentCall' || param['other_data']['vid_type'] == 'LiveAppointmentCall') && this.appointmentIdMappingWithConsultantId[param['other_data']['vid']] == sender_id){
        param['status'] = 'Online';
      }
      this.consultantStatusMapping[sender_id] = param['status'];
    }
  }

  getConsultantStatusFromApi(){
    let _consultant_ids = Object.keys(this.consultantStatusMapping);
    if(_consultant_ids.length == 0) return;
    this._teleConsultService.getDoctorStatus(_consultant_ids).subscribe(res=>{
      let _res = {'data':JSON.parse((res as string).replace(/(&quot\;)/g,"\""))};
      this.updateTrainerStatusListFromApi(_res['data']);
    });
  }

  updateTrainerStatusListFromApi(api_res):void{
    let n = api_res.length;
    let cur_date:any = new Date();
    let busy_ids = [];
    for(let i=0; i<n; i++){
      try{
        if(api_res[i]['status'] == 'Offline') continue;
        let _api_date:any = new Date(api_res[i]['timestamp']);
        if((cur_date - _api_date) >= (15*60*1000)) continue;
        let doctor_id = api_res[i]['consultant_id'];
        let doctor_obj = this.consultantStatusMapping[doctor_id];
        if(doctor_obj != undefined){
          let _status = api_res[i]['status'];
          if(_status == undefined || _status == null) _status = 'Offline';
          if(_status == 'Busy') busy_ids.push(doctor_id);
          this.consultantStatusMapping[doctor_id] = _status;
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

  updateAppointmentJoinCallButtonSequenceTimer = undefined;

  /**
   * @description Contains mapping of join call button enable/disable with expected time
   */
  private joinCallButtonEnableDisableSequenceList:JoinCallBUttonSequenceFormat[] = [];

  /**
   * @description Contains mapping of appointment id with join call button enable/disabled boolean value; Dict with key as appointment id and value as boolean
   */
  private appointmentJoinCallButtonStatusMapping = {};



  /**
   * @description Generates the join call enable/disable sequence.
   *             Join call button will be enabled only when appointment_end_time is yet to occur and appointment_status is approved and call_status is not completed
   */
  async generateJoinCallButtonSequence(appointment_list:any[]):Promise<void>{
    await this.resetJoinCallButtonSequenceTimer();
    this._resetJoinCallButtonAssociatedObjects();

    if(appointment_list.length == 0) return;
    // console.log(appointment_list);

    // Temporary Purpose; add call_status
    // appointment_list.forEach(item=>{item['call_status'] = 'requested';});

    try{
      // Filter the appointment list; Remove the past or un-approved appointments or completed appointments
      let now_date:number = (new Date()).getTime();
      let filtered_appointment_list = appointment_list.filter((appointment)=>{ return this._isAppointmentObjectValidForSequence(appointment, now_date);});
      // console.log(filtered_appointment_list);
      if(filtered_appointment_list.length == 0) return;

      let filtered_sequence_list:JoinCallBUttonSequenceFormat[] = [];
      filtered_appointment_list.forEach((appointment)=>{
        // Start Time
        filtered_sequence_list.push({
          appointment_id:appointment.appointment_id,
          show_join_call_button:true,
          at_time: (new Date(appointment.appointment_start_time)).getTime(),
        });
        // End Time
        filtered_sequence_list.push({
          appointment_id:appointment.appointment_id,
          show_join_call_button: false,
          at_time: (new Date(appointment.appointment_end_time)).getTime()
        });

        this.appointmentJoinCallButtonStatusMapping[appointment.appointment_id] = false;
      });

      // Sort the list by at_time
      filtered_sequence_list.sort((a,b)=>{
        return a.at_time - b.at_time;
      });

      this.joinCallButtonEnableDisableSequenceList = filtered_sequence_list;
      // console.log(this.joinCallButtonEnableDisableSequenceList);
      // Start the sequence
      this.executeJoinCallButtonEnableDisableSequence();

    }catch(err){
      console.error(err);
    }
  }

  /**
   * @description Executes the Sequence
   */
  executeJoinCallButtonEnableDisableSequence():void{

    if(this.joinCallButtonEnableDisableSequenceList.length == 0){
      this.resetJoinCallButtonSequenceTimer();
      return;
    }
    let now_date:number = (new Date()).getTime();
    let appointment_obj = this.joinCallButtonEnableDisableSequenceList[0];

    let time_diff = appointment_obj.at_time - now_date;
    /**
     * time_diff if positive or zero: event is yet to happen
     * time_diff if negative or zero: ongoing event
     */

    // Handling scenario to enable the join call button before 5 mins of upcomming appointment and no previous appointment before that slot or previous appointment slot has been completed
    if(time_diff > 0 && appointment_obj.show_join_call_button == true){
      this.joinCallButtonEnableDisableSequenceList[0].at_time -= 5*60*1000; // 5 mins prior
      appointment_obj = this.joinCallButtonEnableDisableSequenceList[0];
      time_diff = appointment_obj.at_time - now_date;
    }

    // Moving forward the execution of sequence list
    if(time_diff <= 0){
      this.appointmentJoinCallButtonStatusMapping[appointment_obj.appointment_id] = appointment_obj.show_join_call_button;
      // Remove the ongoing event
      this.joinCallButtonEnableDisableSequenceList.shift();
      if(this.joinCallButtonEnableDisableSequenceList.length == 0) return;
      time_diff = this.joinCallButtonEnableDisableSequenceList[0].at_time - (new Date()).getTime();
      if(time_diff <= 0){
        console.error("Error; Due to wrong lis formation or error values Aborting the process sequence execution");
        this.executeJoinCallButtonEnableDisableSequence();
        return;
      }
      this.updateAppointmentJoinCallButtonSequenceTimer = setTimeout(()=>{
        this.executeJoinCallButtonEnableDisableSequence();
      }, time_diff);
      return;
    }
    else{
      // Event yet to happen
      this.updateAppointmentJoinCallButtonSequenceTimer = setTimeout(()=>{
        this.executeJoinCallButtonEnableDisableSequence();
      }, time_diff);

      return;
    }

  }

  /**
   * @param appointment Appointment Obj
   * @description Helper function to Validate sequence
   * @returns Returns true if object is valid for to be put into Sequence List
   */
  _isAppointmentObjectValidForSequence(appointment, now_date:number):Boolean{
    if(appointment.appointment_status == undefined || appointment.appointment_status == null) return false;
    if(appointment.appointment_status.toLowerCase() != 'approved') return false;
    // if(appointment.call_status == undefined) return false;
    if(appointment.call_status == null || appointment.call_status == undefined) appointment['call_status'] = 'Requested';
    if(appointment.call_status.toLowerCase() == 'completed') return false;
    if(appointment.appointment_end_time == undefined || appointment.appointment_end_time == null || appointment.appointment_start_time == undefined || appointment.appointment_start_time == null) return false;
    let cur_end_date:Date = new Date(appointment.appointment_end_time);
    if(now_date - cur_end_date.getTime() >= 0) return false;
    return true;
  }

  /**
   * @description Resets Timer and set undefined to updateAppointmentJoinCallButtonSequenceTimer
   */
  async resetJoinCallButtonSequenceTimer():Promise<void>{
    if(this.updateAppointmentJoinCallButtonSequenceTimer != undefined){
      clearTimeout(this.updateAppointmentJoinCallButtonSequenceTimer);
      this.updateAppointmentJoinCallButtonSequenceTimer = undefined;
    }
  }

  /**
   * @description Helper function to reset the objects
   */
  _resetJoinCallButtonAssociatedObjects():void{
    this.appointmentJoinCallButtonStatusMapping = {};
    this.joinCallButtonEnableDisableSequenceList = [];
  }

  getFinetunedAppointmentList(data){
    //let dataHistoryFilter = data;
    // console.log(data);
    let userAppointmentDetail = data.filter(obj => {
      return obj.appointment_status === "Requested" || obj.appointment_status === "Approved" || obj.appointment_status === "approved" || obj.appointment_status === "requested";
    });
    
    let updatedAppointment = [];
    if (userAppointmentDetail.length > 0 && userAppointmentDetail !== undefined && userAppointmentDetail !== null) {
      userAppointmentDetail.forEach(element => {
        // console.log(element);
        if (element.appointment_end_time !== "NaN-NaN-NaN NaN:NaN undefined" && element.appointment_end_time !== undefined && element.appointment_end_time !== null) {
          // console.log(element.appointment_end_time);
          let todayDate = new Date();
          let bookedDate = new Date(element.appointment_end_time);
          if (bookedDate.getTime() > todayDate.getTime()) {
            // console.log(element);
            updatedAppointment.push(element);
          }
        }
      });
    }
    this.consultationAppointments = updatedAppointment;
    // Sort the list by start date
    if(this.consultationAppointments.length > 1){
      this.consultationAppointments.sort((a,b)=>{
        let sortA = new Date(a.appointment_start_time);
        let sortB = new Date(b.appointment_start_time);
        return sortB.getTime() - sortA.getTime()
      });
    }
    // console.log(this.consultationAppointments);
  }

  showTeleDashboard(){
    if(this._constantsService.teleconsultationFlowSelected == "affiliate"){ // back button functionality of affilation page for 4 pillar concept
      this.router.navigate(['/affiliated-users']);
    }else{ // back button functionality of normal flow
      this.router.navigate(['/teleconsultation']);
    }
  }

  getFinetunedPastHistoryList(data){
    let historyObject = [];
    if (data.length > 0 && data !== undefined && data !== null) {
      data.forEach(element => {
        //console.log(element);
        if (element.appointment_status === "Requested" || element.appointment_status === "requested" || element.appointment_status === "Approved" || element.appointment_status === "approved" || element.call_status ===  "completed" || element.call_status ===  "Completed") {
          if (element.appointment_end_time !== "NaN-NaN-NaN NaN:NaN undefined" && element.appointment_end_time !== undefined && element.appointment_end_time !== null) {
            let todayDate = new Date();
            let bookedDate = new Date(element.appointment_end_time);
            if ((bookedDate.getTime() < todayDate.getTime()) || element.call_status === "Completed" || element.call_status === "completed" ) {
              historyObject.push(element);
            }
            /* if(element.call_status ===  "completed" || element.call_status ===  "Completed"){
              historyObject.push(element);
            } */
          }
        }else if (element.appointment_status === "Rejected" || element.appointment_status === "rejected") {
          historyObject.push(element);
        }else if (element.appointment_status === "canceled" || element.appointment_status === "Canceled" ||  element.appointment_status === "Cancelled" || element.appointment_status === "cancelled") {
          historyObject.push(element);
        }
      });
    }

    // console.log(historyObject);
    this.consultationHistory = historyObject;
    // Sort the list by start date
    if(this.consultationHistory.length > 1){
      this.consultationHistory.sort((a,b)=>{
        let sortA = new Date(a.appointment_start_time);
        let sortB = new Date(b.appointment_start_time);
        return sortB.getTime() - sortA.getTime()
      });
    }
  }

  printBill(billContents: any) {
    console.log(billContents);
    this.billObj = billContents;
    let ihlConsultantId = billContents.appointment_id;
    this.doctorName = this.billObj.consultant_name;
    if(this.billObj.consultation_fees == 0) {
      this.consultationFees = 'Free Call';
      this.paymentMode = 'Nil';
      this.totalAmount = 'Free of Charges';
      this.deductedIgstAmt = 0;
    }
    else {
      // console.log(ihlConsultantId);
      let transactionDetails = Object.values(this.transactionIdArray).filter((value) => value.ihl_appointment_id == ihlConsultantId);
      console.log(transactionDetails);
      console.log(transactionDetails[0]['discount']);
      if(Number(transactionDetails[0]['discount']) > 0) this.couponDiscount = Number(transactionDetails[0]['discount']);
      this.consultationFees = Number(this.billObj.consultation_fees) + this.couponDiscount;
      this.paymentMode = 'UPI / Card / Net Banking';
      this.deductedIgstAmt = ((this.consultationFees - this.couponDiscount) / 1.18).toFixed(2);
      console.log(this.deductedIgstAmt);
	    this.igstAmt =  (this.deductedIgstAmt * 18 / 100).toFixed(2);
	    this.sgstAmt = (this.deductedIgstAmt * 9 / 100).toFixed(2);
      this.totalAmount = (this.consultationFees - this.couponDiscount).toFixed(2);
      this.couponDiscount = Number(this.couponDiscount).toFixed(2);
      this.consultationFees = Number(this.consultationFees).toFixed(2);
    }
    let apmtDate = (new Date(this.billObj.appointment_start_time).toLocaleString()).split(',');
    this.appoinmentDate = apmtDate[0];
    let userDetail = JSON.parse(this._constantsService.aesDecryption('userData'));
    this.userName = `${userDetail.firstName} ${userDetail.lastName}`;
    if (userDetail.address != undefined && userDetail.area != undefined && userDetail.city != undefined && userDetail.state != undefined && userDetail.pincode != undefined)
      this.userAddress = userDetail.address+"<br>"+userDetail.area+"<br>"+userDetail.city+"<br>"+userDetail.state+" - "+userDetail.pincode;
    if (userDetail.state != undefined)
      this.state = userDetail.state.toLowerCase();
    this.userMobNumber = (userDetail.mobileNumber !== undefined && userDetail.mobileNumber !== null && userDetail.mobileNumber.trim().length === 10) ? userDetail.mobileNumber : "NA";
    this.userMail = (userDetail.email !== undefined && userDetail.email !== null && userDetail.email.trim().length > 0) ? userDetail.email : "NA";
    let apmtTime = this.billObj.appointment_start_time.split(" ");
    this.appointmentOn = apmtTime[1]+' '+apmtTime[2];
    this.transactionIdArray.forEach(element=>{
      if(this.billObj['appointment_id'] == element['ihl_appointment_id']){
        this.printInvoiceNumber = element['ihl_invoice_numbers'];
      }
    })
    setTimeout(() => {
      window.print();
      this.couponDiscount = 0;
    }, 1000);
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

  getTransactionId(userId: (string | number)): void{
    this._teleConsultService.getTransactionIdDetails(userId).subscribe(data => {
      this.transactionIdArray = data;
      // console.log(this.transactionIdArray);
    },(error: any)=>{
      console.error("error fetching transaction id details");
    });
  }

  showMedicalFiles(consultationAppointment) {
    this.router.navigate(['/medical-doc']);
    this._constantsService.updateAppointmentID = consultationAppointment.appointment_id;
    this._constantsService.consultationAppointmentInfo = consultationAppointment;
  }

}

// import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

// @Component({
//   selector: 'dialog-overview-example-dialog',
//   template: 'Some HTMl will be here',
// })
// export class MyAppointmentDialogBox {

//   constructor(
//     public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
//     @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

//   onNoClick(): void {
//     this.dialogRef.close();
//   }

// }

interface JoinCallBUttonSequenceFormat{
  appointment_id:string|number;
  show_join_call_button:boolean;
  at_time:number;
}

enum CancelAppointmentUrl{
  genix = "consult/cancel_appointment_from_doctor",
  ihl = "consult/cancel_appointment"
}

interface CancelAppointmentParameters{
  appointment_id ?: string | number;
  ihl_appointment_id ?: string | number;
  canceled_by: string;
  reason: any;
}
