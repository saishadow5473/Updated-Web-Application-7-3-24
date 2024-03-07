import { Component, NgZone, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { TeleConsultService } from '../../services/tele-consult.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TeleconsultationCrossbarService, Channel } from 'src/app/services/tele-consult-crossbar.service';
import { ConstantsService } from 'src/app/services/constants.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ModalComponent } from '../modal/modal.component';
import { EventEmitterService } from 'src/app/services/event-emitter.service';
import { PublishToChannelOptions } from '../../services/tele-consult-crossbar.service';
import { PaymentDetails } from '../../classes/payment-details';
import { PaymentDetailsService } from '../../services/payment-details.service';
import { CollectPaymentDetails } from '../../contracts/collect-payment-details';
import { MockPaymentResponseData } from '../../contracts/mock-payment-response-data';
import { MedicalDocumentService } from 'src/app/services/medical-document.service';
import { GlobalCdnService } from '../../services/global-cdn.service';
import { FireStoreService } from '../../services/firestore.service';
import { jsPDF } from "jspdf";
import { interval } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-teleconsult-confirm-visit',
  templateUrl: './teleconsult-confirm-visit.component.html',
  styleUrls: ['./teleconsult-confirm-visit.component.css']
})
export class TeleconsultConfirmVisitComponent implements OnInit {
  @ViewChild('invoicePdf', { static: false }) el!: ElementRef;
  contactDetailsEmail: string = '';
  contactDetailsHeight: string = '';
  contactDetailsMobileNumber: string = '';
  contactDetailsDateOfBirth: string = '';
  contactDetailsAddress: string = '';
  contactDetailsArea: string = '';
  contactDetailsCity: string = '';
  contactDetailsState: string = '';
  contactDetailsPincode: string = '';
  paymentTransactionId: string = null;
  printInvoiceNumber: string = null;
  // contactDetailsFormControl:any;
  reasonForVisitPlaceholder: string = '';
  past1WeekKioskData: any = [];
  past3MonthsKioskData: any = [];
  doctorFees: any = 0;
  pincode_details: any = [];
  rzp1: any = null;
  userData: any = null;
  reasonForVisit: string = "";
  healthAssesmentSurveyData: any = [];
  isLastcheckinDisabled: boolean = true;
  pastKioskVitalData: any = {};
  isLoading: boolean = false;
  appointmentStartTime: string = "";
  alergies: any = ["Corn allergy", "Fish allergy", "Egg allergy", "Wheat allergy ( gluten )", "Milk Intolerance ( Lactose intolerant)",
    "Meat allergy", "Pea-nut allergy", "Mushroom allergy", "Soybean allergy", "Tree-nuts", "Others"];
  _isDirectCall: boolean = false;
  states: any = ["Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jammu & Kashmir",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttarakhand",
    "Uttar Pradesh",
    "West Bengal",
    "Andaman & Nicobar",
    "Chandigarh",
    "Dadra & Nagar Haveli",
    "Daman & Diu",
    "Delhi",
    "Lakshadweep",
    "Puducherry"]
  // @ViewChild('allergyValue') allergyValue: any;    
  @ViewChild('kioskVitalsCheckBox') kioskVitalsCheckBox: any;
  @ViewChild('kioskVitalsCheckBox2') kioskVitalsCheckBox2: any;
  book: any = {};
  addressError: boolean = false;
  allergyValue = new FormControl('');
  // allergyValue: any;
  areaError: boolean = false;
  cityError: boolean = false;
  stateError: boolean = false;
  pincodeError: boolean = false;
  reasonForVisitErr: boolean = false;
  showInvoice: boolean = false;
  subscription: any;
  userName: any;
  userAddress: any;
  userMobNumber: any;
  userMail: any;
  doctorName: any;
  state: any;
  deductedIgstAmt: any;
  igstAmt: any;
  sgstAmt: any;
  appoinmentDate: any;
  billObj: any;
  appointmentOn: any;
  consultationFees: any;
  paymentMode: any;
  totalAmount: any;
  intervalSubscription: any;
  couponDiscountAmount: any = '';
  givenCouponNumber: any = '';
  userLastCheckinWeight: any = '';
  actualFeeConsultant: any = '';
  addressdetailslist: any;
  input_field_name: string;

  ihlToken = 'hZH2vKcf1BPjROFM/DY0XAt89wo/09DXqsAzoCQC5QHYpXttcd5DNPOkFuhrPWcyT57DFFR9MnAdRAXoVw1j5yupkl+ps7+Z1UoM6uOrTxUBAA==';
  constructor(private router: Router,
    private http: HttpClient,
    private authService: AuthService,
    private _teleConsultService: TeleConsultService,
    private snackBar: MatSnackBar,
    public _constant: ConstantsService,
    public dialog: MatDialog,
    private eventEmitterService: EventEmitterService,
    private teleConsultCrossbarService: TeleconsultationCrossbarService,
    private paymentDetailsService: PaymentDetailsService,
    private zone: NgZone,
    private globalCdn: GlobalCdnService,
    private medicalDocumentService: MedicalDocumentService,
    private fireStoreService: FireStoreService) { }

  ngOnInit() {

    this.globalCdn.load('razorPay');

    console.log(this._constant.appointmentDetails);
    //return 0;
    this.isLoading = true;
    this.authService.getApiKeyForConfirmVisit().subscribe((data: any) => {
      console.log(data);
      if (data["ApiKey"] == undefined || data["ApiKey"] == null) {
        this.isLoading = false;
        this.snackBar.open("We regret! Not able to fetch your personal details.", '', {
          duration: 1000 * 6,
          panelClass: ['error'],
        });
        this.router.navigate(['/teleconsultation']);
        return 0;
      }
      this.isLoading = false;
      localStorage.setItem('apiKey', data["ApiKey"]);

      if (this._constant.appointmentDetails == undefined) {
        this.zone.run(() => {
          //this.router.navigate(['/teleconsultation']);
        });
        return;
      } else {
        if (this._constant.teleconsultationFlowSelected == "affiliate") {
          //offer price if affiliation selected.
          let offerPrice = this._constant.appointmentDetails.affilation_excusive_data.affilation_array[0].affilation_price;
          try {
            if (offerPrice == undefined || offerPrice == null || String(offerPrice).trim().length == 0) throw "Invalid OfferPrice";
          } catch (err) {
            // offerPrice = this._constant.appointmentDetails.affilation_excusive_data.affilation_array[0].affilation_mrp;
            offerPrice = this._constant.appointmentDetails.affilation_excusive_data.affilation_array[0].affilation_price;
          }

          this.doctorFees = Number(offerPrice) * 100;
          this.actualFeeConsultant = this.doctorFees;
          this._constant.consultationFee = this.doctorFees;
        } else {
          this.doctorFees = this._constant.appointmentDetails.consultation_fees * 100;
          this.actualFeeConsultant = this.doctorFees;
          this._constant.consultationFee = this.doctorFees;
        }

      }

      if ('apiKey' in localStorage) {
        let apiKey = localStorage.getItem('apiKey');
        this.authService.fetchUser(this.authService.getIhlUserId(), apiKey).subscribe((data: any) => {
          console.log(data);
          if (data != undefined && data != null) {
            if (data['user'] != undefined && data['user'] != null) {
              if (data['user']['healthData'] != undefined && data['user']['healthData'] != null) {
                let healthData = data['user']['healthData'];
                //this.initializePastKioskData(healthData);
                this.retriveLastCheckinData(healthData);
              } else {
                let healthData = [];
                //this.initializePastKioskData(healthData);
                this.retriveLastCheckinData(healthData);
              }
            } else {
              let healthData = [];
              //this.initializePastKioskData(healthData);
              this.retriveLastCheckinData(healthData);
            }
          } else {
            let healthData = [];
            //this.initializePastKioskData(healthData);
            this.retriveLastCheckinData(healthData);
          }

        });
      }
      if (this._constant.reachingVideoCallPageFrom && this._constant.reachingVideoCallPageFrom == 'BookAppointment') {
        this.initializeCrossbarConnection();
      } else {
        this.initializeContactDetails();
      }
      this.reasonForVisitPlaceholder = (this._constant.teleConsultType == 'Medical Consultation') ? 'Example: Fever, Cold, Cough.' : 'Example: Weight Loss, Weight Gain.';
    }, (error: any) => {
      console.log(error);
      this.isLoading = false;
      this.snackBar.open("We regret! Not able to fetch your personal details.", '', {
        duration: 1000 * 6,
        panelClass: ['error'],
      });
      this.router.navigate(['/teleconsultation']);
      return 0;
    });
    this.subscription = this.authService.on('callConfirmAppointment').subscribe(() => this.callConfirmAppointment(true));
    if(this.router.url === '/teleconsult-confirm-visit'){
      this.subscription = this.authService.on('downloadInvoice').subscribe(() => this.downloadInvoice());
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  useDataArr(dataArr) {
    let pincode_details = []
    pincode_details = dataArr[0]['PostOffice'][0];
    this.contactDetailsArea = pincode_details['Name'];
    this.contactDetailsCity = pincode_details['District'];
    this.contactDetailsState = pincode_details['State'];
  }

  hasAddressError(inputValue: string, inputFieldName: string) {
    let length = inputValue.length;
    if (inputFieldName === 'pincode') {
      var pincode_details: any[] = [];

      $.ajax({
        url: 'http://localhost/get_repo/user_portal_azure_v12/server/pincode.php',
        method: 'GET',
        data: { 'pincode_value': inputValue },
        success: (response: any) => {
          const dataArr = JSON.parse(response);
          this.useDataArr(dataArr); // Call the private method
        },
        error: (error: any) => {
          console.error(error, 'Failure');
        }
      });
    }

    switch (inputFieldName) {
      case 'address': if (length < 6) this.addressError = true; else this.addressError = false; break;
      case 'area': if (length < 3) this.areaError = true; else this.areaError = false; break;
      case 'city': if (length < 3) this.cityError = true; else this.cityError = false; break;
      case 'state': if (length < 3) this.stateError = true; else this.stateError = false; break;
      case 'pincode': if (length !== 6) this.pincodeError = true; else this.pincodeError = false; break;
    }
  }
  reasonForVisitError(inputValue: string) {
    let length = inputValue.length;
    if (length < 3) return this.reasonForVisitErr = true;
    else return this.reasonForVisitErr = false;
  }

  initializeCrossbarConnection() {
    // No channels Subscription is required here, only publish events are used here
    this.teleConsultCrossbarService.on_connection_established = () => { this.initializeContactDetails(); }
    this.teleConsultCrossbarService.user_id = JSON.parse(this._constant.aesDecryption('userData'))['id'];

    if (this.teleConsultCrossbarService.is_connected == true) {
      this.teleConsultCrossbarService.on_connection_established();
    } else {
      this.teleConsultCrossbarService.connect({});
    }
  }



  initializeContactDetails() {
    if ('userData' in localStorage) {
      this.userData = JSON.parse(this._constant.aesDecryption('userData'));
      if ('heightMeters' in this.userData)
        this.contactDetailsHeight = ((parseFloat(this.userData['heightMeters']) * 100).toFixed(1)).toString();

      this.contactDetailsEmail = this.userData['email'] || '';
      this.contactDetailsMobileNumber = this.userData['mobileNumber'] || '';
      let dateOfBirth = (this.userData['dateOfBirth']).toString() || '';
      if (dateOfBirth != '') {
        let formControl = new FormControl(new Date(dateOfBirth));
        this.contactDetailsDateOfBirth = formControl.value;
      }

      this.contactDetailsAddress = this.userData['address'] || '';
      this.contactDetailsArea = this.userData['area'] || '';
      this.contactDetailsCity = this.userData['city'] || '';
      this.contactDetailsState = this.userData['state'] || '';
      this.contactDetailsPincode = this.userData['pincode'] || '';

      this.initializeHealthAssesmentSurveyData();
    }
    else {
      this.contactDetailsEmail = this._constant.aesDecryption('email') || '';
      if ('height' in localStorage)
        this.contactDetailsHeight = ((parseFloat(this._constant.aesDecryption('height')) * 100).toFixed(1)).toString();
    }
  }

  initializeHealthAssesmentSurveyData() {
    if (this.userData == undefined || this.userData == '' || this.userData['user_score'] == undefined) return;

    this._teleConsultService.getHealthAssesmentSurveyQuestion().subscribe(questions_object => {
      // return type of subscribe is Object; Convert it to Array
      let questions = [];
      for (var i in questions_object) questions.push(questions_object[i]);

      let temp_ = [];
      for (var question_id in this.userData['user_score']) {
        if (this.userData['user_score'][question_id] != 0) {

          let question = questions.find(question_ => {
            return question_['q_id'] == question_id;
          });
          if (question == undefined) continue;
          let answer = '';

          question['option'].every(option => {
            // If option has score, compare with it
            if ('score' in option) {
              if (option['score'] == this.userData['user_score'][question_id]) {
                answer = option['status'];
                return false;
              }
              return true;
            }
            // If option do not has score, check for its sub options
            if (option['status'] in question) {
              question[option['status']].forEach(option_2 => {
                if (option_2['score'] == this.userData['user_score'][question_id]) answer = option_2['status'];
              })
              if (answer != '') return false;
            }
            return true;
          });

          temp_.push({
            "q_id": question_id,
            "name": question['name'],
            "Answer": answer,
          });
        }
      }
      this.healthAssesmentSurveyData = temp_;
      console.log(this.healthAssesmentSurveyData);
    });

  }

  initializePastKioskData(healthDataList) {
    let date_now: any = new Date();
    let milliseconds1Week = (8.64e+7) * 7; // 8.64e+7 is milliseconds in 1 day
    let milliseconds3Months = (8.64e+7) * 90; // 8.64e+7 is milliseconds in 1 day

    healthDataList.forEach(healthData => {
      let cur_date: any = new Date(healthData['vitals']['dateTime']);
      if ((date_now - cur_date) <= milliseconds3Months) {
        this.past3MonthsKioskData.push(healthData);

        if ((date_now - cur_date) <= milliseconds1Week) {
          this.past1WeekKioskData.push(healthData);
        }
      }

    });

  }

  retriveLastCheckinData(healthData: any): void {
    console.log(healthData);
    if (healthData.length > 0) {
      if (healthData.length > 1) {
        let vitalDataSort = healthData.sort((a, b) => {
          let timeA = new Date(a['vitals']['dateTime']).getTime();
          let timeB = new Date(b['vitals']['dateTime']).getTime();
          return timeB - timeA;
        });
        console.log(vitalDataSort);
        console.log(localStorage.getItem('weight'));
        let count = 0;
        let found = false;
        for (let i = 0; i < vitalDataSort.length; i++) {
          if (vitalDataSort[i]['vitals']['weight'] && vitalDataSort[i]['vitals']['weight'] > 0) {
            this.userLastCheckinWeight = vitalDataSort[i]['vitals']['weight'];
            console.log(vitalDataSort[i]['vitals']['weight']);
            found = true;
          }
          count++;
          if (count == 5 || found) {
            break;
          }
        }
        let lastCheckinVital = vitalDataSort[0];
        this.filteredVitalData(lastCheckinVital);
      } else {
        let lastCheckinVital = healthData[0];
        this.filteredVitalData(lastCheckinVital);
      }
    } else {
      let lastCheckin = {};
      this.pastKioskVitalData = lastCheckin;
      this.isLastcheckinDisabled = true;
    }
  }

  filteredVitalData(lastCheckinVital: any) {
    let lastCheckin = {};
    //console.log(lastCheckinVital);
    let vitalDataToShare = {
      bmi: '',
      bmiClass: '',
      dateTime: '',
      diastolic: '',
      ecgBpm: '',
      fatRatio: '',
      height: '',
      lead2Status: '',
      pulseBpm: '',
      spo2: '',
      systolic: '',
      temperature: '',
      weight: '',
      body_fat_mass: '',
      percent_body_fat: '',
      skeletal_muscle_mass: '',
      body_cell_mass: '',
      visceral_fat: '',
      bone_mineral_content: '',
      protien: '',
      mineral: '',
      intra_cellular_water: '',
      extra_cellular_water: '',
      waist_hip_ratio: '',
      waist_height_ratio: '',
      basal_metabolic_rate: ''
    };

    if ("weight" in lastCheckinVital['vitals'] && lastCheckinVital['vitals']["weight"] != null && lastCheckinVital['vitals']["weight"] != undefined && !isNaN(lastCheckinVital['vitals']["weight"])) {
      lastCheckinVital['vitals']["weight"] = Math.round(+lastCheckinVital['vitals']["weight"]);
    } else if (this.userLastCheckinWeight != '') {
      lastCheckinVital['vitals']["weight"] = Math.round(+this.userLastCheckinWeight);
    } else if (localStorage.getItem('weight') != undefined) {
      lastCheckinVital['vitals']["weight"] = Math.round(+localStorage.getItem('weight'));
    }
    if ("height" in lastCheckinVital['vitals'] && lastCheckinVital['vitals']["height"] != null && lastCheckinVital['vitals']["height"] != undefined && !isNaN(lastCheckinVital['vitals']["height"])) {
      lastCheckinVital['vitals']["height"] = Math.round(+lastCheckinVital['vitals']["height"]);
    }
    if ("temperature" in lastCheckinVital['vitals'] && lastCheckinVital['vitals']["temperature"] != null && lastCheckinVital['vitals']["temperature"] != undefined && lastCheckinVital['vitals']["temperature"].toString().trim().length > 0 && !isNaN(lastCheckinVital['vitals']["temperature"])) {
      lastCheckinVital['vitals']["temperature"] = (parseFloat(lastCheckinVital['vitals']["temperature"]) * 9 / 5 + 32).toFixed(1);
    }
    for (let key in vitalDataToShare) {
      if (key in lastCheckinVital['vitals']) {
        if (lastCheckinVital['vitals'][key] != undefined && lastCheckinVital['vitals'][key] != null && lastCheckinVital['vitals'][key] != Number.isNaN && lastCheckinVital['vitals'][key] != "-" && lastCheckinVital['vitals'][key] != "") {
          lastCheckin[key] = lastCheckinVital['vitals'][key];
        }
      }
    }
    this.pastKioskVitalData = lastCheckin;
    if (Object.keys(this.pastKioskVitalData).length > 0) {
      console.log(this.pastKioskVitalData);
      this.isLastcheckinDisabled = false;
    }
  }

  choosePayment() {
    // this.AddressValidate();
    /*Enable for coupon Entry Modal Popup*/
    if (this.doctorFees > 0) {
      this._constant.showPaymentSelect = true;
      this.dialog.open(ModalComponent).afterClosed().subscribe(res => {
        console.log(res);
        if (res != undefined) {
          // if(res == 'couponNotApplied' || res == ''){
          //   this.AddressValidate();
          // }else{
          //   this.doctorFees = res*100;
          //   this.AddressValidate();
          // }
          if (res['payableAmount'] !== undefined) {
            this.givenCouponNumber = res['couponCode'];
            this.couponDiscountAmount = res['discountAmount'];
            this.doctorFees = res['payableAmount'] * 100;
            this.AddressValidate();
          } else if (res == 'couponNotApplied') {
            this.givenCouponNumber = '';
            this.couponDiscountAmount = '';
            this.doctorFees = this.actualFeeConsultant;
            this.AddressValidate();
          } else {
            this.givenCouponNumber = '';
            this.couponDiscountAmount = '';
          }
        } else {
          this.givenCouponNumber = '';
          this.couponDiscountAmount = '';
        }
      });
    } else {
      this.givenCouponNumber = '';
      this.couponDiscountAmount = '';
      this.AddressValidate();
    }
  }

  changeAllergy(event) {
    this.allergyValue = event.value;
  }

  changeState(event) {
    this.allergyValue = event.value;
  }

  AddressValidate() {
    if (this.addressError || this.areaError || this.cityError || this.stateError) {
      this.snackBar.open('Address field requires min. number of letters', '', { duration: 1000 * 10, panelClass: ['error'] });
      return 0;
    } else if (this.pincodeError) {
      this.snackBar.open('Invalid pincode! Please check it.', '', { duration: 1000 * 10, panelClass: ['error'] });
      return 0;
    } else if (this.reasonForVisitErr) {
      this.snackBar.open('Reason for visit field requires min. number of letters', '', { duration: 1000 * 10, panelClass: ['error'] });
      return 0;
    }
    if (this.contactDetailsAddress == "" || this.contactDetailsArea == "" || this.contactDetailsCity == "" || this.contactDetailsState == "" || this.contactDetailsPincode == "") {
      this.snackBar.open("Please fill the 'Address Details'. It is required for provide prescription ", '', {
        duration: 1000 * 10,
        panelClass: ['error'],
      });
      return 0;
    } else {



      let jsontext = JSON.parse(this._constant.aesDecryption("userData"));
      var apiKey = localStorage.getItem('apiKey')
      var IHLUserToken = localStorage.getItem('id_token')
      var IHLUserId = jsontext.id;

      jsontext.address = this.contactDetailsAddress;
      jsontext.area = this.contactDetailsArea;
      jsontext.city = this.contactDetailsCity;
      jsontext.state = this.contactDetailsState;
      jsontext.pincode = this.contactDetailsPincode.toString();

      console.log(JSON.stringify(jsontext));
      if (this.kioskVitalsCheckBox._checked != undefined) {
        if (this.kioskVitalsCheckBox._checked) {
          this._constant.checkinHistory = this.pastKioskVitalData;
        } else {
          this._constant.checkinHistory = {
            "weightKG": this.pastKioskVitalData['weight'] || "",
            "heightMeters": jsontext['heightMeters'] || "", // lastcheckin height has not been upto date so got from userData
            "bmi": this.pastKioskVitalData['bmi'] || ""
          }
        }
      }
      // show load model box 
      this.isLoading = true;
      let stringifiedData = JSON.stringify(jsontext);
      setTimeout(() => {
        this.authService.postEditProfieInput(apiKey, IHLUserToken, IHLUserId, stringifiedData).subscribe((data: any) => {
          console.log(data);
          if (data == 'updated') {
            localStorage.setItem("userData", this._constant.aesEncryption(stringifiedData));
            this.paymentFlowCheck();
          }

        });
      }, 1000);
    }
  }

  paymentFlowCheck() {
    console.log(this.reasonForVisit);
    // alert((this.reasonForVisit).trim());
    // alert(( (this.reasonForVisit).trim()).length);
    if (((this.reasonForVisit).trim()).length == 0) {


      this.snackBar.open("Please fill the 'Reason for Visit' info ", '', {
        duration: 1000 * 10,
        panelClass: ['error'],
      });
      this.isLoading = false;
      return 0;
    }

    var checkinHistory = this._constant.checkinHistory;
    console.log(checkinHistory);

    let startDateTime: string = "";
    if (this._constant.startCallFlow === true) {
      let appointmentBookedOn = this._constant.appointmentDetails['bookTime'];//2020-12-11 15:21:00
      let splitDateAndTime = appointmentBookedOn.split(" ");
      let splitDate = splitDateAndTime[0].split("-");
      let dateStart = splitDate[1] + "/" + splitDate[2] + "/" + splitDate[0];
      let timeStart = this.ConvertTo12Hrs(splitDateAndTime[1]);
      startDateTime = `${dateStart} ${timeStart}`;
      console.log(startDateTime);
      this._isDirectCall = true;
      //return;
    } else {
      let appointmentBookedOn = this._constant.appointmentDetails['bookTime'];//2020-12-11 03:21 PM
      let splitDateAndTime = appointmentBookedOn.split(" ");
      let splitDate = splitDateAndTime[0].split("-");
      let dateStart = splitDate[1] + "/" + splitDate[2] + "/" + splitDate[0];
      let timeStart = splitDateAndTime[1] + " " + splitDateAndTime[2];
      // let timeStart = this.ConvertTo12Hrs(splitDateAndTime[1]);
      startDateTime = `${dateStart} ${timeStart}`;
      console.log(startDateTime);
    }

    let splittedStartDate = startDateTime.split(' ')[0].split('/');
    this.appointmentStartTime = `${splittedStartDate[2]}-${splittedStartDate[0]}-${splittedStartDate[1]} ${startDateTime.split(' ')[1]} ${startDateTime.split(' ')[2]}`;

    let affiliteUniqueName;
    if (this._constant.teleconsultationFlowSelected == "affiliate") {
      if (this._constant.appointmentDetails.affilation_excusive_data != undefined && this._constant.appointmentDetails.affilation_excusive_data != null) {
        if (this._constant.appointmentDetails.affilation_excusive_data.affilation_array[0] != undefined && this._constant.appointmentDetails.affilation_excusive_data.affilation_array[0] != null) {
          affiliteUniqueName = this._constant.appointmentDetails.affilation_excusive_data.affilation_array[0].affilation_unique_name;
        }
      }
    }

    console.log(this.userData);

    console.log("this.doctorFees ", this.doctorFees, " this.doctorFees/100 ", this.doctorFees / 100);
    // alert("Fee check");

    this.book = {
      "user_ihl_id": this.userData['id'],
      "name": this.userData['firstName'] + ' ' + this.userData['lastName'],
      "consultant_name": this._constant.appointmentDetails['name'],
      "vendor_consultant_id": this._constant.appointmentDetails['vendor_consultant_id'],
      "ihl_consultant_id": this._constant.appointmentDetails['ihl_consultant_id'],
      "vendor_id": this._constant.appointmentDetails["vendor_id"],
      "specality": this._constant.appointmentDetails['consultant_speciality'].toString(),
      "consultation_fees": this.doctorFees / 100,
      "mode_of_payment": "online",
      "alergy": this.allergyValue,
      "kiosk_checkin_history": checkinHistory,
      "appointment_start_time": startDateTime,
      "appointment_end_time": this.getEndDateTime(startDateTime),
      "appointment_duration": "30 Min",
      "vendor_name": this._constant.appointmentDetails["vendor_id"],
      "appointment_model": "appointment",
      "reason_for_visit": this.reasonForVisit,
      "direct_call": this._isDirectCall,
      "notes": "",
      "document_id": this.medicalDocumentService.getselectedDocumentedId(),
      "kiosk_id": "",
      "affiliation_unique_name": affiliteUniqueName || "global_services"
    };

    /* if (this._constant.teleSpecalityType != null || this._constant.teleSpecalityType != undefined) {
      this.book["specality"] = this._constant.teleSpecalityType;
    } else {
      this.book["specality"] = this._constant.appointmentDetails['consultant_speciality'][0];
    } */
    this.book["specality"] = this._constant.appointmentDetails['consultant_speciality'][0];

    if (this._constant.confirmAppointment == true) {
      this.book["appointment_status"] = "Requested";
    } else {
      this.book["appointment_status"] = "Approved";
    }

    console.log(this.book);
    //debugger;
    if (this.doctorFees == 0) { // check doctor consultation fees. If doctor fees is N/A,  
      //skip the payment flow... move to video call directly
      //this.callConfirmAppointment(); 
      let response: MockPaymentResponseData<string> = {
        razorpay_order_id: "",
        razorpay_payment_id: "",
        razorpay_signature: ""
      }
      this.storePaymentTransactionDetails(response);
    } else {
      // go to payment flow
      /*var jsonData = { "ihl_id": this.userData.id, "total_amount": this.doctorFees/100, "payment_status": "initiated", "payment_for": "teleconsultation", "MobileNumber": this.contactDetailsMobileNumber, ...this.receiveAppointmentDataForPaymentTransaction(this.book) };  
      console.log(jsonData);
      //debugger;
      this._teleConsultService.paymentTransInit(jsonData).subscribe(data=>{
        console.log(data);
        debugger;
        this.getDoctorFees();
        this.paymentTransactionId = data['transactionId'];
        this.printInvoiceNumber = data['invoice_number'];
      });*/
      this.getDoctorFees();
    }
  }

  getDoctorFees() {
    let ihlID = this.userData.id;
    let requestID = this._teleConsultService.paymentRequestIdGenerate("web", ihlID);
    this._teleConsultService.getPaymentOrderID(requestID, this.doctorFees).subscribe(data => {
      console.log(data);
      //debugger;
      if (data['status'] == "success") {
        this.paymentProcessINitiate(data['order'], data['key']);
      } else {
        alert("something went wrong");
        this.isLoading = false;
      }
    });
  }

  paymentProcessINitiate(order_id, key) {

    const options: any = {
      "key": key, // Enter the Key ID generated from the Dashboard    
      "amount": this.doctorFees / 100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise    
      "currency": "INR",
      "name": "India Health Link",
      "description": "Teleconsultation",
      "image": "assets/img/ihl-plus.png",
      "order_id": order_id,
      "prefill": {
        "name": this.authService.getUser(),
        "email": this.userData.email,
        "contact": this.userData.mobileNumber
      },
      "notes": {
        "address": "Razorpay Corporate Office"
      },
      "theme": {
        "color": "#5081ce"
      }
    };

    options.handler = ((response, error) => {
      options.response = response;
      console.log(response);
      console.log(options);
      //debugger;
      if (response.razorpay_payment_id != undefined && response.razorpay_payment_id.length > 0) {
        this.zone.run(() => { this.isLoading = true; });
        this.storePaymentTransactionDetails(response);
      } else {
        alert("something went wrong");
        this.zone.run(() => { this.isLoading = false; });
      }
      // call your backend api to verify payment signature & capture transaction
    });

    var rzp1 = new this._teleConsultService.nativeWindow.Razorpay(options);
    rzp1.open();
    //hide load model box
    this.isLoading = false;
  }

  storePaymentTransactionDetails(razorPayResponse: any): void {
    let [razorpay_order_id, razorpay_payment_id, razorpay_signature]: [string, string, string] = [razorPayResponse.razorpay_order_id, razorPayResponse.razorpay_payment_id, razorPayResponse.razorpay_signature];
    console.log(this.book);
    let usageType = '';
    let principalAmt = '';
    let gstAmt = '';
    let state = this.userData['state'] ? this.userData['state'].replace(/\s/g, '').toLowerCase() : '';
    let discountAmt = '';
    let accountName = '';
    if ((this.doctorFees / 100) == 0 && this.givenCouponNumber == '') {
      usageType = "FREE";
    } else if (this.givenCouponNumber != '') {
      usageType = "coupon";
      if ((this.doctorFees / 100) == 0) discountAmt = (this._constant.consultationFee / 100).toString();
      else discountAmt = this.couponDiscountAmount.toString();
    }

    if ((this.doctorFees / 100) > 0) {
      principalAmt = ((this.doctorFees / 100) / 1.18).toFixed(2).toString();
      gstAmt = ((Number(principalAmt) * 18) / 100).toFixed(2).toString();
    }
    if (this._constant.appointmentDetails['account_name'] != undefined && this._constant.appointmentDetails['account_name'] != "") accountName = this._constant.appointmentDetails['account_name'];
    var jsonData = {
      "user_email": this.userData.email,
      "user_mobile_number": this.userData.mobileNumber,
      "user_ihl_id": this.userData.id,
      "total_amount": this.doctorFees / 100,
      "payment_for": "teleconsultation",
      "MobileNumber": this.contactDetailsMobileNumber,
      ...this.receiveAppointmentDataForPaymentTransaction(this.book, razorpay_order_id, razorpay_payment_id, razorpay_signature),
      "vendor_name": this._constant.appointmentDetails["vendor_id"],
      // "account_name": "default account",
      "account_name": accountName,
      "service_provided_date": this.appointmentStartTime,
      "AffilationUniqueName": this.book['affiliation_unique_name'],
      "OrganizationCode": "",
      "UsageType": usageType,
      // "Discounts": this.couponDiscountAmount.toString(), // shows coupon amt as default 
      "Discounts": discountAmt, // shows calculation of how much amt has been used as discount
      "DiscountType": this.couponDiscountAmount != '' ? 'discount' : '',
      "CouponNumber": this.couponDiscountAmount != '' ? this.givenCouponNumber.toString() : '',
      //"Discounts": this.couponDiscountAmount != 0.0 ? (this.couponDiscountAmount.toString().contains(".0") ? this.couponDiscountAmount.toFixed(0).toString() : this.couponDiscountAmount.toString()) : ""
      "principal_amount": principalAmt,
      "gst_amount": gstAmt,
      "state": state,
    };
    console.log(jsonData);
    if (this.doctorFees == 0) { jsonData["payment_status"] = "completed" }
    console.log(jsonData);
    this._teleConsultService.paymentTransInit(jsonData).subscribe(data => {
      console.log(data);
      //debugger;
      this.paymentTransactionId = data['transaction_id'];
      this.printInvoiceNumber = data['invoice_number'];

      if (this._constant.confirmAppointment) {
        this.callConfirmAppointment();
      }
      else {
        if (this.doctorFees != 0) {
          this.zone.run(() => {
            this.dialog.open(ModalComponent);
          });
          this._constant.showLiveCallModal = true;
        } else {
          this.callConfirmAppointment(true);
          return;
        }
        const numbers = interval(20000);
        this.intervalSubscription = numbers.subscribe(
          // value => console.log("Subscriber: " + value)
          value => {
            this._constant.showLiveCallModal = false;
            if (this._constant.newAppointmentID == null)
              this.callConfirmAppointment(true);
          }
        );
      }
    });
  }


  callConfirmAppointment(subcription = false) {
    console.log('CallAppointment');
    // if (subcription)
    //   this.intervalSubscription.unsubscribe();
    this.zone.run(() => {
      // var  jsonDataUpdate = {"user_ihl_id": this.userData.id,"total_amount": this.doctorFees/100, "payment_status": "completed",  "transactionId": this.paymentTransactionId, "payment_for": "teleconsultation", "MobileNumber":this.contactDetailsMobileNumber,  "payment_mode":"Online"  };
      var jsonDataUpdate = { "user_ihl_id": this.userData.id, "total_amount": this.doctorFees / 100, "payment_status": "completed", "transactionId": this.paymentTransactionId, "payment_for": "teleconsultation", "MobileNumber": this.contactDetailsMobileNumber };
      if ((this.doctorFees / 100) > 0) jsonDataUpdate["payment_mode"] = "Online";
      this._teleConsultService.paymentTransUpdate(jsonDataUpdate).subscribe(res => {
        console.log(res);
      });
    });

    var appointmentBook = this._constant.confirmAppointment;


    // open model box 
    setTimeout(() => {
      if (appointmentBook == true) {
        this._constant.bookAppointmentProcess = true;
        this.zone.run(() => {
          this.dialog.open(ModalComponent);
        });
      } else {
        this.book["appointment_status"] = "approved";
        this._constant.liveAppointmentProcess = true;
        this.zone.run(() => {
          this.dialog.open(ModalComponent);
        });
      }
    }, 150);

    /** 
    @description Below code is commented because it is moved to paymentFlowCheck method
    */
    /*var checkinHistory = {};
    if (this.kioskVitalsCheckBox._checked) {
      checkinHistory = this.pastKioskVitalData;
    }*/

    // if(this.kioskVitalsCheckBox2._checked){
    //   vitalData = this.past3MonthsKioskData;
    // }

    //alert(this._constant.appointmentDetails['bookTime']);
    /*let startDateTime: string = "";
    if(this._constant.startCallFlow === true){
      let appointmentBookedOn = this._constant.appointmentDetails['bookTime'];//2020-12-11 15:21:00
      let splitDateAndTime = appointmentBookedOn.split(" ");
      let splitDate = splitDateAndTime[0].split("-");
      let dateStart = splitDate[1] + "/" + splitDate[2] + "/" + splitDate[0];
      let timeStart = this.ConvertTo12Hrs(splitDateAndTime[1]);
      startDateTime = `${dateStart} ${timeStart}`;
      console.log(startDateTime);
      this._isDirectCall = true;
      //return;
    }else{
      let appointmentBookedOn = this._constant.appointmentDetails['bookTime'];//2020-12-11 03:21 PM
      let splitDateAndTime = appointmentBookedOn.split(" ");
      let splitDate = splitDateAndTime[0].split("-");
      let dateStart = splitDate[1] + "/" + splitDate[2] + "/" + splitDate[0];
      let timeStart = splitDateAndTime[1] + " " + splitDateAndTime[2];
      startDateTime = `${dateStart} ${timeStart}`;
      console.log(startDateTime);
    }
    

    var book={
          "user_ihl_id": this.userData['id'],
          "consultant_name": this._constant.appointmentDetails['name'],
          "vendor_consultant_id": this._constant.appointmentDetails['vendor_consultant_id'],
          "ihl_consultant_id": this._constant.appointmentDetails['ihl_consultant_id'],
          "vendor_id": this._constant.appointmentDetails["vendor_id"],
          "specality": this._constant.appointmentDetails['consultant_speciality'].toString(),
          "consultation_fees": this.doctorFees/100,
          "mode_of_payment": "online",
          "alergy": "",
          "kiosk_checkin_history": checkinHistory,
          "appointment_start_time":  startDateTime,
          "appointment_end_time": this.getEndDateTime(startDateTime),
          "appointment_duration": "30 Min",            
          "vendor_name": this._constant.appointmentDetails["vendor_id"],   
          "appointment_model":"appointment",
          "reason_for_visit": this.reasonForVisit,
          "direct_call": this._isDirectCall,
          "notes": ""
    };

    if(this._constant.teleSpecalityType != null || this._constant.teleSpecalityType != undefined){
      book["specality"] = this._constant.teleSpecalityType;
    } else {
      book["specality"] = this._constant.appointmentDetails['consultant_speciality'][0];
    }
    

    if(appointmentBook == true) {   
      book["appointment_status"] = "Requested";
    } else {
      book["appointment_status"] = "Approved";
    }

    console.log(book);*/
    //return;
    // console.log(this._constant.reachingVideoCallPageFrom == 'BookAppointment', this.teleConsultCrossbarService.is_connected == true);
    // if(this._constant.reachingVideoCallPageFrom == 'BookAppointment' && this.teleConsultCrossbarService.is_connected == true){
    //   console.log('In sending crossbar event');
    //   // Sending event to host about new Appointment
    //   let _data = {
    //     'cmd':'GenerateNotification',
    //     'notification_domain':'BookAppointment',
    //   };
    //   let receiver_id = this._constant.appointmentDetails['ihl_consultant_id'];
    //   console.log(receiver_id);
    //   if(receiver_id != undefined){
    //     let _options:PublishToChannelOptions = {
    //       receiver_ids:[receiver_id],
    //     };
    //     this.teleConsultCrossbarService.publishToChannel('ihl_send_data_to_doctor_channel',_data,_options);
    //   }
    // }
    // return;
    var resObj
    this.authService.bookAppointment(this.book).subscribe(data => {
      resObj = data;
      var initialRes = JSON.parse(resObj.replace(/&quot;/g, '"'));
      console.log(initialRes);
      console.log(initialRes['status_message']);
      this._constant.newAppointmentID = initialRes['appointment_id'];
      this._constant.vendorAppointmentId = initialRes['vendor_appointment_id'];
      // close model box 
      this.zone.run(() => {
        this._constant.bookAppointmentProcess = false;
        this._constant.liveAppointmentProcess = false;
        this.eventEmitterService.onModalClose();
      });
      if (initialRes['status_message'] == "Successfully Booked Appointment" || initialRes['status_message'] == "Sucessfully booked appointment") {

        this.zone.run(() => {
          // var  jsonDataUpdate = {"appointment_id": initialRes['appointment_id'], "ihl_id": this.userData.id,"total_amount": this.doctorFees/100, "payment_status": "completed",  "transactionId": this.paymentTransactionId, "payment_for": "teleconsultation", "MobileNumber":this.contactDetailsMobileNumber,  "payment_mode":"Online" };
          var jsonDataUpdate = { "appointment_id": initialRes['appointment_id'], "ihl_id": this.userData.id, "total_amount": this.doctorFees / 100, "payment_status": "completed", "transactionId": this.paymentTransactionId, "payment_for": "teleconsultation", "MobileNumber": this.contactDetailsMobileNumber };
          if ((this.doctorFees / 100) > 0) jsonDataUpdate["payment_mode"] = "Online";
          console.log(jsonDataUpdate);
          //debugger;
          this._teleConsultService.paymentTransUpdate(jsonDataUpdate).subscribe(res => {
            console.log(res);
            //debugger;
            //alert(this.paymentTransactionId);
          });
        });
        this.book["appointment_id"] = initialRes['appointment_id'];
        //this._constant.consultationUserData.appointments[this._constant.consultationUserData.appointments.length] = this.book;

        if (this._constant.reachingVideoCallPageFrom == 'BookAppointment') {
          console.log('In sending crossbar event');
          // Sending event to host about new Appointment
          let _data = {
            'cmd': 'GenerateNotification',
            'notification_domain': 'BookAppointment',
          };
          let receiver_id = this._constant.appointmentDetails['ihl_consultant_id'];
          console.log(receiver_id);

          if (this._constant.fireStore) {
            let obj = {
              'data': { cmd: 'GenerateNotification', notification_domain: 'BookAppointment' },
              'receiver_ids': [receiver_id],
              'sender_id': this.userData['id'],
              'published': true
            };

            this.fireStoreService.create(initialRes['appointment_id'], this._constant.teleConsultationCollectionName, obj);
          } else if (this.teleConsultCrossbarService.is_connected == true) {
            if (receiver_id != undefined) {
              let _options: PublishToChannelOptions = {
                receiver_ids: [receiver_id],
              };
              this.teleConsultCrossbarService.publishToChannel('ihl_send_data_to_doctor_channel', _data, _options);
            }
          }
        }
        //console.log(this._constant.consultationUserData.appointments);            

        if (appointmentBook == true) {
          // this.snackBar.open("Your Appointment Booked successfully!", '',{
          //   duration: 6000,
          //   panelClass: ['success'],
          // });
          if (this.doctorFees != 0) {
            this.zone.run(() => {
              this.dialog.open(ModalComponent);
            });
            this._constant.showAppointmentModal = true;
          } else {
            this.router.navigate(['/myappointment']);
          }
          // this.zone.run(() => {
          //   this.router.navigate(['/myappointment']);
          // });
        } else {
          this.zone.run(() => {
            this._constant.transactionIdForTeleconsultation = (this.paymentTransactionId != undefined) ? this.paymentTransactionId : "";
            this._constant.printInvoiceNumberForTeleconsultation = (this.printInvoiceNumber != undefined) ? this.printInvoiceNumber : "";
            if (this._constant.appointmentDetails['vendor_id'] != undefined && this._constant.appointmentDetails['vendor_id'] != null) {
              if (this._constant.appointmentDetails['vendor_id'] == "GENIX") {
                this.router.navigate(['/genixConsultation']);
              } else {
                this._constant.directCallfind = true;
                this.router.navigate(['/teleconsult-video-call']);
              }
            } else {
              this._constant.directCallfind = true;
              this.router.navigate(['/teleconsult-video-call']);
            }

          });
        }
      } else {
        this.isLoading = false;
        if (this.doctorFees == 0) {
          this.snackBar.open("Sorry something went wrong.. Please try again..", '', {
            duration: 8000,
            panelClass: ['error'],
          });
        } else {
          this.snackBar.open("Sorry something went wrong.Your money will be refund within 2 days!", '', {
            duration: 8000,
            panelClass: ['error'],
          });
        }

        this.zone.run(() => {
          this.router.navigate(['/teleconsult-doctors']);
        });
      }
    },
      (error: any) => {
        this.isLoading = false;
        this.zone.run(() => {
          this._constant.bookAppointmentProcess = false;
          this._constant.liveAppointmentProcess = false;
          this.eventEmitterService.onModalClose();
          this.snackBar.open("Sorry something went wrong.. Please try again..", '', {
            duration: 4000,
            panelClass: ['error'],
          });
        });
      });
  }

  getEndDateTime(startTime) {
    let a = new Date(startTime);
    let b = a.getTime() + 30 * 60 * 1000;
    let c = new Date(b);
    let date_string = (c.getMonth() + 1) + '/' + c.getDate() + '/' + c.getFullYear();
    let time_string = '';
    if (c.getHours() < 10) time_string = '0' + c.getHours();
    else time_string = '' + c.getHours();
    time_string += ':';
    if (c.getMinutes() < 10) time_string += '0' + c.getMinutes();
    else time_string += c.getMinutes();
    time_string += ':00';
    //return  date_string + ' ' + time_string    
    return date_string + ' ' + this.ConvertTo12Hrs(time_string);

    // let dateTime = startTime.split(" ");
    // let endTime = this.addTimes('0:'+ 30, dateTime[1]);    
    // return dateTime[0]+ " "+ this._getEndTime(dateTime[1] + ' ' + dateTime[2], 30);
  }

  ConvertTo12Hrs(time) {
    // Check correct time format and split into components
    time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    if (time.length > 1) { // If time format correct
      time = time.slice(1);  // Remove full string match value
      time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    console.log(time.join(''));
    let assableTime = (time.join('')).split(":"); // return adjusted time or original string    

    let hrs = assableTime[0];
    let min = assableTime[1];
    console.log(min);
    console.log(assableTime);
    if (assableTime[0].length == 1) {
      hrs = "0" + hrs;
    }
    if (assableTime[1].length == 1) {
      min = "0" + min;
    }
    return hrs + ":" + min + " " + time[5];
  }


  // addTimes(t0, t1) {
  //   return this.secsToTime(this.timeToSecs(t0) + this.timeToSecs(t1));
  // }  
  // // Convert time in H[:mm[:ss]] format to seconds
  // timeToSecs(time) {
  //   let [h, m, s] = time.split(':');
  //   return h*3600 + (m|0)*60 + (s|0)*1;
  // }  
  // // Convert seconds to time in H:mm:ss format
  // secsToTime(seconds) {
  //   let z = n => (n<10? '0' : '') + n; 
  //   return (seconds / 3600 | 0) + ':' +
  //        z((seconds % 3600) / 60 | 0) + ':' +
  //         z(seconds % 60);
  // }

  _getEndTime(time_in_12hr_format, offset_in_mins = 0): string {
    let [hh, mm] = this._getTimeInHours(time_in_12hr_format);
    let now_date = new Date();
    now_date.setHours(hh);
    now_date.setMinutes(mm);
    now_date.setSeconds(0);
    now_date.setMilliseconds(0);
    let new_date = new Date(now_date.getTime() + offset_in_mins * 60 * 1000);
    let hours = new_date.getHours(); // gives the value in 24 hours format
    let AmOrPm = hours >= 12 ? 'PM' : 'AM';
    hours = (hours % 12) || 12;
    let hrs_string = hours.toString();
    if (hrs_string.length == 1) hrs_string = '0' + hrs_string;
    let minutes = new_date.getMinutes();
    let min_string = minutes.toString();
    if (min_string.length == 1) min_string = '0' + min_string;
    return hrs_string + ':' + min_string + ' ' + AmOrPm;
  }


  /**
   * @param time_string 
   * @description Converts HH:MM AM/PM To 24 hrs format
   */
  _getTimeInHours(time_string): [number, number] {
    let is_pm = false;
    if (time_string.includes('AM') == false) is_pm = true;
    let [hh, mm] = ((time_string.split(' '))[0]).split(':').map((item: string) => { return parseInt(item) });
    if (is_pm == false) {
      if (hh == 12) hh = 0;
    }
    if (is_pm == true) {
      if (hh != 12)
        hh += 12;
    }
    return [hh, mm];
  }

  showTeleDoctorList() {
    if (this._constant.teleconsultationFlowSelected == "affiliate") { // back button functionality of 4 pillar category
      this.router.navigate(['/affiliated-users']);// redirecting to affiliate selection page to avoid {ct: "",st:""} pblm while loading consultant & class 
    }
    else { // back button functionality of normal flow
      this.router.navigate(['/teleconsult-doctors']);
    }
    // this.router.navigate(['/teleconsult-doctors']);
  }

  receiveAppointmentDataForPaymentTransaction(book: Object, ...razorpayTransactionDetails: string[]): any {
    let MRPCost: string;
    let TotalAmount: string;
    let Discounts: string;
    let ConsultantID: string; //(ihl_consultant_id, course id)
    let ConsultantName: string;
    let ClassName: string;
    let PurposeDetails: string; //(string of book appointment object, string of course object)    
    let AppointmentID: string;
    let AffilationUniqueName: string;
    let SourceDevice: string;
    let appointmentDetail = this._constant.appointmentDetails;
    let bookAppointmentObject = book;
    let Service_Provided = "false";
    let purpose = "teleconsult";
    let [razorpay_order_id, razorpay_payment_id, razorpay_signature]: [string, string, string] = [razorpayTransactionDetails[0], razorpayTransactionDetails[1], razorpayTransactionDetails[2]];

    if (this._constant.teleconsultationFlowSelected == "affiliate") {
      // MRPCost = this._constant.appointmentDetails.affilation_excusive_data.affilation_array[0].affilation_mrp;
      // Discounts = Number(this._constant.appointmentDetails.affilation_excusive_data.affilation_array[0].affilation_mrp - this._constant.appointmentDetails.affilation_excusive_data.affilation_array[0].affilation_price).toString();
      if (this._constant.appointmentDetails.affilation_excusive_data.affilation_array[0].affilation_price == 0) {
        MRPCost = "FREE";
      } else {
        MRPCost = this._constant.appointmentDetails.affilation_excusive_data.affilation_array[0].affilation_price;
      }
      Discounts = "";
      TotalAmount = this._constant.appointmentDetails.affilation_excusive_data.affilation_array[0].affilation_price;
      ConsultantID = this._constant.appointmentDetails.ihl_consultant_id;
      ConsultantName = this._constant.appointmentDetails.name;
      ClassName = "";
      PurposeDetails = JSON.stringify(bookAppointmentObject);
      AppointmentID = (this._constant.newAppointmentID != null && this._constant.newAppointmentID != undefined) ? this._constant.newAppointmentID : "";
      // AffilationUniqueName = this._constant.appointmentDetails.affilation_excusive_data.affilation_array[0].affilation_unique_name;
      SourceDevice = "portal";
    } else {
      if (this._constant.appointmentDetails.consultation_fees == 0) {
        MRPCost = "FREE";
      } else {
        MRPCost = this._constant.appointmentDetails.consultation_fees;
      }
      // MRPCost = this._constant.appointmentDetails.consultation_fees;
      Discounts = "";
      // AffilationUniqueName = "global_services";
      TotalAmount = this._constant.appointmentDetails.consultation_fees;
      // Discounts = "0";
      ConsultantID = this._constant.appointmentDetails.ihl_consultant_id;
      ConsultantName = this._constant.appointmentDetails.name;
      ClassName = "";
      PurposeDetails = JSON.stringify(bookAppointmentObject);
      AppointmentID = (this._constant.newAppointmentID != null && this._constant.newAppointmentID != undefined) ? this._constant.newAppointmentID : "";
      // AffilationUniqueName = "";
      SourceDevice = "portal";
    }
    let PaymentDetail: PaymentDetails<string> = new PaymentDetails<string>(MRPCost, TotalAmount, Discounts, ConsultantID, ConsultantName, ClassName, PurposeDetails, AppointmentID, AffilationUniqueName, SourceDevice, Service_Provided, purpose, razorpay_order_id, razorpay_payment_id, razorpay_signature);
    return PaymentDetail;
    //let paymentTransactionDetailsFunction: CollectPaymentDetails<string> = this.paymentTransactionDetails;
    //paymentTransactionDetailsFunction(MRPCost, TotalAmount, Discounts, ConsultantID, ConsultantName, ClassName, PurposeDetails, AppointmentID, AffilationUniqueName, SourceDevice);

  }

  downloadInvoice() {

    console.log('Invoice Call');
    console.log(this._constant.appointmentDetails);
    this.billObj = this._constant.appointmentDetails;

    this.doctorName = this.billObj.consultant_name;
    if (this.billObj.consultation_fees == 0) {
      this.consultationFees = 'Free Call';
      this.paymentMode = 'Nil';
      this.totalAmount = 'Free of Charges';
      this.deductedIgstAmt = 0;
    }
    else {
      // this.consultationFees = this.billObj.consultation_fees;
      this.consultationFees = this.doctorFees / 100 + this.couponDiscountAmount;
      this.paymentMode = 'UPI / Card / Net Banking';

      this.deductedIgstAmt = 0;
      this.igstAmt = 0;
      this.sgstAmt = 0;
      this.totalAmount = 0;

      if (this.consultationFees != 0 && this.consultationFees != 'N/A') {
        this.deductedIgstAmt = ((this.consultationFees - this.couponDiscountAmount) / 1.18).toFixed(2);
        this.igstAmt = (this.deductedIgstAmt * 18 / 100).toFixed(2);
        this.sgstAmt = (this.deductedIgstAmt * 9 / 100).toFixed(2);
        this.totalAmount = (this.consultationFees - this.couponDiscountAmount).toFixed(2);
        this.couponDiscountAmount = Number(this.couponDiscountAmount).toFixed(2)
        this.consultationFees = Number(this.consultationFees).toFixed(2);
      }
    }
    let apmtDate = (new Date(this.appointmentStartTime).toLocaleString()).split(',');
    this.appoinmentDate = apmtDate[0];
    let userDetail = JSON.parse(this._constant.aesDecryption('userData'));
    console.log(userDetail);
    this.userName = `${userDetail.firstName} ${userDetail.lastName}`;
    // this.userAddress = `${userDetail.address} ${userDetail.city} ${userDetail.state} ${userDetail.pincode}`;
    if (userDetail.address != undefined && userDetail.area != undefined && userDetail.city != undefined && userDetail.state != undefined && userDetail.pincode != undefined)
      this.userAddress = userDetail.address + "<br>" + userDetail.area + "<br>" + userDetail.city + "<br>" + userDetail.state + " - " + userDetail.pincode;
    if (userDetail.state != undefined)
      this.state = userDetail.state.toLowerCase();
    this.userMobNumber = (userDetail.mobileNumber !== undefined && userDetail.mobileNumber !== null && userDetail.mobileNumber.trim().length === 10) ? userDetail.mobileNumber : "NA";
    this.userMail = (userDetail.email !== undefined && userDetail.email !== null && userDetail.email.trim().length > 0) ? userDetail.email : "NA";
    let apmtTime = this.appointmentStartTime.split(" ");
    this.appointmentOn = apmtTime[1] + ' ' + apmtTime[2];
    this.showInvoice = true;

    setTimeout(() => {
      let pdf = new jsPDF('p', 'pt', 'a3');
      pdf.html(this.el.nativeElement, {
        callback: (pdf) => {
          pdf.save("DownloadInvoice.pdf");
          this.showInvoice = false;
        }
      });

      if (this._constant.startCallFlow)
        this.callConfirmAppointment(true);
      else
        this.router.navigate(['/myappointment']);
    }, 3000);
  }

  /*async paymentTransactionDetails<T>(MRPCost: T, TotalAmount: T, Discounts: T, ConsultantID: T, ConsultantName: T, ClassName: T, PurposeDetails: T, AppointmentID: T, AffilationUniqueName: T, SourceDevice: T): Promise<void>{
    PaymentDetailsService.collectPaymentDetails<T>(MRPCost, TotalAmount, Discounts, ConsultantID, ConsultantName, ClassName, PurposeDetails, AppointmentID, AffilationUniqueName, SourceDevice);
  }*/
}

enum vitalToShare {
  'bmi' = '',
  'bmiClass' = '',
  'dateTime' = '',
  'diastolic' = '',
  'ecgBpm' = '',
  'fatRatio' = '',
  'height' = '',
  'lead2Status' = '',
  'pulseBpm' = '',
  'spo2' = '',
  'systolic' = '',
  'temperature' = '',
  'weight' = ''
}
