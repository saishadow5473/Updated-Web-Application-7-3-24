import { Component, OnInit, Input, Inject, ViewChild, ElementRef, SimpleChanges, ChangeDetectorRef, Output, EventEmitter, OnDestroy, OnChanges } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as contract from "../../contracts/joint-account-contracts";
import { ConstantsService } from 'src/app/services/constants.service';
import { AuthServiceLogin } from 'src/app/services/auth.service.login';
import { AuthService } from 'src/app/services/auth.service';
import { TeleConsultService } from 'src/app/services/tele-consult.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { EventEmitterService } from 'src/app/services/event-emitter.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
// import { TourService, IStepOption } from 'ngx-ui-tour-ngx-bootstrap';
import { JoyrideService } from 'ngx-joyride';
import { JointAccountService } from '../../services/joint-account.service';
// import { NgOtpInputComponent } from 'ng-otp-input';
import { TeleconsultationCrossbarService } from '../../services/tele-consult-crossbar.service';

//import { TeleconsultdashboardComponent } from '../teleconsultdashboard/teleconsultdashboard.component';
export type bool = boolean;

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit, OnDestroy, OnChanges {
  imageUrl: any
  messageContent: any
  loading: boolean = false;
  generateCouponCodeBtn:boolean = true;
  couponCode1mg:string = null;
  //success: boolean = false;
  selectedStar:number = 0;
  rateArray:number[] = [0,0,0,0,0];
  sendReview:boolean = false;
  userReason: string;
  isUserReasonEmpty: boolean = false;
  teleconsultationMyAppointmentsCancel:any = {};
  subcriptionForm:FormGroup;
  subcriptionRefundForm:FormGroup;
  otpForm = new FormGroup({
    otpValue: new FormControl(),
  });
  isUserReasonEmpties: boolean = false;
  userData : any;
  public _UnLinkButtonClicked: boolean = false;
  orgUserJson = {};
  orgUserShared = "";
  paymentSelectShow:boolean = true;
  couponNumber:any = "";
  isCouponCodeValidated:boolean = false;
  discountAmountCalShow:boolean = false;
  discountAmount:any = '';
  payableAmount:any = -1;
  subscription: any;
  selectedOrgIsValid = false;
  feedBackInfoTxt: boolean = false;

  @ViewChild('reviewField') reviewField: any;
  @ViewChild('courseReviewField') courseReviewField:any;
  @ViewChild('termsServiceContent') termsServiceContent: ElementRef;
  @ViewChild('termsServiceContentLabOrder') termsServiceContentLabOrder: ElementRef;
  @Input('userDetails') public receivedUserDetails: any;
  @Output() public onEmptyUserList: EventEmitter<any> = new EventEmitter();
  refundInfoTableHeader:string[] = ['cancellation_time','cancellation_refund'];
  showRefundTable:boolean = false;
  public colors: Array<string> = contract.colorPalettes;
  refundModalType:string = '';
  prescriptionTermsConditions: boolean = false;
  purshaseMedicineContainer: boolean = true;
  termsContent: any = "";
  _isVisibleShareMedicine: bool = true;
  labOrderTermsConditions: boolean = false;
  purchaseLabOrderReportContainer: boolean = true;
  termsContentLabOrder: any = "";
  _isVisibleShareLabOrder: bool = true;
  public _isDisabledUserDetailBtn: boolean = false;
  private unLinkUserSubscription = undefined;
  public unLinkUserDetail: any = "";
  public showJointUserList: boolean = true;
  jointUserList: Array<any> = [];
  _disableacceptdeny : bool = false;
  jointuserparameter :any;
  _hidetermsandcondition : bool = false;
  _ischecked :any;
  jointuserrequest : any = this._constant.requested_users;
  unSendReqUserDetail: any = "";
  _hideuserrequestlist : bool = false;
  _userrequest :any;
  _userData = JSON.parse(this._constant.aesDecryption('userData'));
  _updatedrequsers :any;
  CaretakerUserCredentials :any;
  fullName: any;
  uploadedFileName: any = null;
  errorHintMedFile: string = "";
 //jointUserRequestmodified :any = Object.values(this._userData.joint_user_detail_list).filter((item:any)=>(item.status.toLowerCase() == 'requested'));
 //_jointUserRequestmodified :any = this.jointUserRequestmodified;
 affiliatedUserModal: boolean = true;
 affiliatedUserOtpModal: boolean = false;
 affiliatedRegisterModal: boolean = false;

 otpSubmit: boolean = false;
 otpMissing:boolean = true;
 sentOTP: number = 0;
 OTPMsg: string = '';
 resendOTPButton: boolean = false;
 eMailOtp:any = '';
 mobileOtp:any = '';
 oldPwd:any
 newPwd:any
 confPwd:any
 nt_loading:boolean = true;
 isloading: boolean = false;
 isFileNameExist: boolean = false;
 public wrongpassforchange = false;

 /* OTP FORM */

  otp: number = -1;
  showOtpComponent = true;
  @ViewChild('ng-otp-input', {static: false}) ngOtpInput:any;
  config  = {
    allowNumbersOnly: true,
    length: 6,
    // isPasswordInput: false,
    // disableAutoFocus: false,
    placeholder: '',
    inputStyles: {
      'width': '50px',
      'height': '50px'
    }
  };

  onOtpChange(otp) {
    this.otp = otp;
    if (this.otp == this.sentOTP)
        this.otpSubmit = true;
    else
      this.otpSubmit = false;

    if (otp == '')
      this.otp = -1;
  }

  setVal(val) {
    this.ngOtpInput.setValue(this.sentOTP);
  }

 constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA) public message: string,
    public _constant: ConstantsService,
    private authServiceLogin: AuthServiceLogin,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private eventEmitterService: EventEmitterService,
    private _formBuilder: FormBuilder,
    private router: Router,
    private _teleConsultService : TeleConsultService,
    // public tourService: TourService,
    private readonly  joyrideService: JoyrideService,
    private jointAccountService: JointAccountService,
    private eventEmitter: EventEmitterService,
    // private _constants: ConstantsService,
    private cdRef: ChangeDetectorRef,
    private dialog: MatDialog,
    private teleConsultCrossbarService: TeleconsultationCrossbarService
    ) {
      dialogRef.disableClose = true;
    }

  ngOnInit() {
    this.uploadedFileName = this._constant.currentUploadedFileName;
    this.errorHintMedFile = "File name should not empty or already Exist";
    this.orgUserJson = this._constant.orgUserData;
    this.otpForm.controls['otpValue'].valueChanges.subscribe(
      (selectedValue) => {
        console.log(selectedValue);
        console.log(this.otpForm.get('otpValue').value);
      }
  );

    //this.subscription = this.authServiceLogin.on('terms-condition-agree').subscribe(() => this.test());

    if (this.eventEmitterService.subsVar==undefined) {
      this.eventEmitterService.subsVar = this.eventEmitterService.
      invokeCloseModalFunction.subscribe((name:string) => {
        this.closeModal();
      });
    }

    if (this.unLinkUserSubscription == undefined) {
      this.unLinkUserSubscription = this.eventEmitter._isUnLinkJointUser.subscribe((msg: any) => {
        if (msg && msg._isUnLink != undefined && msg._isUnLink == true) {
          this.unLinkUser(this.unLinkUserDetail);
          this.unLinkUserDetail = "";
        }
      });
    }

    // this.teleconsultationMyAppointmentsCancel.formControl = new FormGroup({
    //   doctor_not_join_call: new FormControl(false),
    //   technical_issue_in_user_side: new FormControl(false),
    //   technical_issue_in_doctor_side: new FormControl(false),
    //   other_reason: new FormControl(''),
    // });
    this.teleconsultationMyAppointmentsCancel = {};
    if(this._constant.teleconsultMyAppointmentCancelButton){
      this.initialiseMyAppointmentCancelButtonModal();
    }

    if (this._constant.teleconsultMySubscriptionCancelButton == true) {
      this.subcriptionForm = this._formBuilder.group({
        reason_for_cancel:['',Validators.required]
      });
    }

    if (this._constant.teleconsultMySubscriptionRefundCancelButton == true) {
      this.subcriptionRefundForm = this._formBuilder.group({
        option_for_cancel:[''],
        other_reason:['']
      });
    }

    if (this.affiliatedUserOtpModal) {
      this.otpForm = this._formBuilder.group({
        otpValue:['',Validators.required]
      });
    }

    this.eventEmitterService.subsVar = undefined;
    // console.log(this._userData);
    // if(this.jointuserrequest == this._jointUserRequestmodified ){
    //   this.jointuserrequest = this._constant.requested_users;
    // }else{
    //   this.jointuserrequest = this._jointUserRequestmodified;
    // }
  }

  public hasErrors = (controlName: string, errorName: string) =>{
    return this.subcriptionForm.controls[controlName].hasError(errorName);
  }

  initialiseMyAppointmentCancelButtonModal(){
    this.teleconsultationMyAppointmentsCancel.doctor_not_join_call = false;
    this.teleconsultationMyAppointmentsCancel.technical_issue_in_user_side = false;
    this.teleconsultationMyAppointmentsCancel.technical_issue_in_doctor_side = false;
    if (this._constant.cancelAndRefundModelBoxInput === true) {
      this.teleconsultationMyAppointmentsCancel.reason = new FormControl('');
    }else{
      this.teleconsultationMyAppointmentsCancel.reason = new FormControl('',
      {
        validators: [Validators.required]
      });
    }


    this.teleconsultationMyAppointmentsCancel.cancel_appointment = (res:boolean)=>{
      if(res == false){
        let data = {
          // doctor_not_join_call: false,
          // technical_issue_in_doctor_side: false,
          // technical_issue_in_user_side: false,
          usersReason:undefined,
          reason: '',
          cancel_appointment: false,
        };
        this._constant.teleconsultMyAppointmentCancelButton = false;
        this.dialogRef.close(data);
      }
      if(res == true){
        if(this._constant.cancelAndRefundModelBoxInput == true){
            if (this.userReason == undefined && this.teleconsultationMyAppointmentsCancel.reason.value.trim().length == 0) {
              this.isUserReasonEmpty = true;
              setTimeout(() => {
                this.isUserReasonEmpty = false;
              }, 3000);
              return;
            }else{
              console.log(this.userReason);
              console.log(this.teleconsultationMyAppointmentsCancel.reason.value);
            }
        } else {
          if(this.teleconsultationMyAppointmentsCancel.reason.valid == false){
            this.teleconsultationMyAppointmentsCancel.reason.markAsTouched();
            return;
          }
        }


        let data = {
          //doctor_not_join_call: this.teleconsultationMyAppointmentsCancel.doctor_not_join_call,
          //technical_issue_in_doctor_side: this.teleconsultationMyAppointmentsCancel.technical_issue_in_user_side,
          //technical_issue_in_user_side: this.teleconsultationMyAppointmentsCancel.technical_issue_in_doctor_side,
          usersReason:this.userReason,
          reason: this.teleconsultationMyAppointmentsCancel.reason.value,
          cancel_appointment: true,
        };
        this._constant.teleconsultMyAppointmentCancelButton = false;
        this.dialogRef.close(data);
      }
    }

  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('receivedUserDetails' in changes) {
      this.userData = changes['receivedUserDetails']['currentValue'];
      console.log(this.userData);
    }
  }

  ngOnDestroy(): void {
    this.unLinkUserSubscription.unsubscribe();
    this.unLinkUserSubscription = undefined;
    this.unLinkUserDetail = "";
  }

  public initialBackground(): any {
    return this.colors[Math.floor(Math.random() * 16)];
  }


  onNoClick(): void {
     this.dialogRef.close();
     this._constant.openModal = false;
     this._constant.processingContent = false;
     this._constant.userChangedProgram = null;
     this._constant.userSelectedOldProgram = this.message;
  }

  onYesClick(): void{
    this._constant.openModal = false;
    this._constant.processingContent = true;
    //this.imageUrl = "assets/img/metrice.gif";
    this.messageContent =  "Processing please wait...";
    var usersAge;
    var dob = this._constant.aesDecryption('usersDateOfBirth');
    if(dob !== undefined && dob !== null && dob !== ""){
      var res = dob.split("/" );
      var today_date = new Date();
      var today_year = today_date.getFullYear();
      var today_month = today_date.getMonth();
      var today_day = today_date.getDate();
      var birth_month = Number(res[0]);
      var birth_date = Number(res[1]);
      var birth_year = Number(res[2]);

      var ages = today_year - birth_year;

      if ( today_month < (birth_month - 1))
      {
        usersAge = ages--;
        console.log(usersAge);
      }
      if (((birth_month - 1) == today_month) && (today_day < birth_date))
      {
        usersAge = ages--;
        console.log(usersAge);
      }

    }

    var programEmail = this._constant.aesDecryption("email");
    var programfirstName = this._constant.aesDecryption("firstName");
    var programlastName = this._constant.aesDecryption("lastName");
    var programage = usersAge;
    var programmobileNumber = this._constant.aesDecryption("affiliatemobileNumber");
    var programSelect = this._constant.selectedProgram;

    var email;
    var firstName;
    var lastName;
    var age;
    var mobileNumber;

    if (programEmail != undefined && programEmail != null && programEmail != "") {
      email = programEmail;
    }else{
      email = "NA";
    }

    if (programfirstName != undefined && programfirstName != null && programfirstName != "") {
      firstName = programfirstName;
    }else{
      firstName = "NA";
    }

    if (programlastName != undefined && programlastName != null && programlastName != "") {
      lastName = programlastName;
    }else{
      lastName = "";
    }

    if (programage != undefined && programage != null && programage != "") {
      age = programage;
    }else{
      age = "NA";
    }

    if (programmobileNumber != undefined && programmobileNumber != null && programmobileNumber != "") {
      mobileNumber = programmobileNumber;
    }else{
      mobileNumber = "NA";
    }

    this.authServiceLogin.postSelectedProgram(email,firstName,lastName,age,programSelect,mobileNumber).subscribe((data : any) =>  {
      console.log(data);
      if(data == "success"){
          this.dialogRef.close();
          this._constant.openModal = false;
          this._constant.processingContent = false;
          this.snackBar.open("Your data is saved successfully!", '',{
            duration: 5000,
            panelClass: ['success'],
          });
          //this.success = true;
          //this.imageUrl = "assets/img/success-icon-10.png";
          //this.messageContent =  "Your data is saved successfully";


        // setTimeout(() => {
        //   this.success = false;
        //   this._constant.openModal = false;
        //   this._constant.processingContent = false;
        //   this.dialogRef.close();
        // },5000)
      }
    });
  }

  closeModal(): void {
    this.dialogRef.close();
  }

  /* termsAccepted(val){ // doctor care (GINEX) 247 portal redirection old logic

   if(val == "true"){
      this._constant.teleConsultaionAgree = false;
      this.loading = true;
      this.authService.teleCallRedirection().subscribe(data =>  {
        console.log(data);
        if(data !== undefined && data !== null){
          window.location.href = data;
          setTimeout(() => {
            this.loading = false;
            this.dialogRef.close();
          }, 1500);
        }else{
          this.loading = false;
          this.dialogRef.close();
        }
      });
    }else{
      this._constant.teleConsultaionAgree = false;
      this.dialogRef.close();
    }
  } */

  termsAccepted(val){
    if(val == "true"){
      /*
      step 1 : api call for terms & condition agree
      step 2 : tele consultation  dashboard page - APIcallsFlow function call
      */




      let jsontext = JSON.parse(this._constant.aesDecryption("userData"));
      var apiKey = localStorage.getItem('apiKey')
      var IHLUserToken = localStorage.getItem('id_token')
      var IHLUserId = jsontext.id;

      jsontext.isTeleMedPolicyAgreed = true;

      //console.log(JSON.stringify(jsontext));

      this.authService.postEditProfieInput(apiKey,IHLUserToken,IHLUserId,JSON.stringify(jsontext)).subscribe((data: any) =>{
        console.log(data);

        if(data == 'updated'){
            localStorage.setItem("userData", this._constant.aesEncryption(JSON.stringify(jsontext)));
        }
      });



      if(this._constant.teleconsultationFlowSelected == "affiliate"){
        //publish channedl for 4 pillar category Logic
        this._teleConsultService.publish('terms-condition-agree-category');
      }else{
        //publish channel for normal
        this._teleConsultService.publish('terms-condition-agree');
      }
      this._constant.teleConsultaionAgree = false;
      this.dialogRef.close();
    } else {
        this._constant.teleConsultaionAgree = false;
        this.dialogRef.close();
        //this.router.navigate(['/teleconsultation']);
    }
  }

  onRiskYesClick(){
    this._constant.riskInfoAlerts = false;
    //this.loading = true;
    //this._constant.teleConsultaionAgree = true;

    this._constant.processingContent = true;

    this.authService.teleCallRedirection().subscribe(data =>  {
      console.log(data);
      if(data !== undefined && data !== null){
        this._constant.processingContent = false;
        window.location.href = data;
      }

      this.dialogRef.close();
    });
  }

  onRiskNoClick(){
    this._constant.riskInfoAlerts = false;
    this._constant.riskInfoTitle = null;
    this._constant.riskInfoSubTitle = null;
    this.dialogRef.close();
  }

  closeReview(){
    this._constant.prescriptionPreparation = false;
    this._constant.isOnlineClassEnded = false;
    this._constant.consultantDataForReview = undefined;
    this.dialogRef.close();
  }

  purchaseMedicine(){
    this._isVisibleShareMedicine = false;
    this.sharePerscription();
    // this.snackBar.open("Thank You.  1mg will contact you to confirm the order.",'',{
    //   duration:1000 * 6,
    //   panelClass: ['success']
    // });
    // this._constant.buyMedicineOnline = false;
    // this.dialogRef.close();
  }

  purchaseLabOrder(){
    this._isVisibleShareLabOrder = false;
    this.shareLabOrder();
  }

  generateCouponCode1mg(){
    this.generateCouponCodeBtn = false;
    this.couponCode1mg = "CoupenCode";
  }
  closeGenerateCoupon(){
    this._constant.generateCouponCode = false;
    this.dialogRef.close();
  }
  copyCouponCode(inputElement) {
    console.log(inputElement);
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
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

  feedBack(){
    let selectedDoctor: any = {};
    if(((this.reviewField.nativeElement.value.toString()).trim()).length == 0 && this.selectedStar == 0){
      this.feedBackInfoTxt = true;
      setTimeout(() => {
        this.feedBackInfoTxt = false
      }, 5 * 1000);
      return 0;
    }

    if (this._constant.appointmentDetails === null || this._constant.appointmentDetails === undefined) {
      selectedDoctor =  this._constant.consultantDataForReview;
    }else{
      selectedDoctor =  this._constant.appointmentDetails;
    }

    let userId =JSON.parse(this._constant.aesDecryption('userData'))['id'].toString();
    let doctorRates = this.selectedStar.toString();
    let doctorText = this.reviewField.nativeElement.value.toString();
    this.sendReview = true;
    let obj = {
                "user_ihl_id": userId,
                "consultant_name": (selectedDoctor['name'] !== undefined && selectedDoctor['name'] !== null) ? selectedDoctor['name'] : selectedDoctor['consultant_name'],
                "ihl_consultants_id": selectedDoctor['ihl_consultant_id'],
                "vendor_consultatation_id": selectedDoctor['vendor_consultant_id'],
                "ratings":doctorRates,
                "review_text":doctorText,
                "vendor_name":(selectedDoctor['vendor_name'] !== undefined && selectedDoctor['vendor_name'] !== null) ? selectedDoctor['vendor_name'] : selectedDoctor['vendor_id'],
                "provider": (selectedDoctor['provider'] != undefined && selectedDoctor['provider'] != null) ? selectedDoctor['provider'] : '',
                "appointment_id" : ''
            };
    console.log(obj);
    //debugger;
    this.authService.postDoctorReview(obj).subscribe(data=>{
      console.log(data);
      if (typeof (data) === "object"){
        this.snackBar.open("Thanks for your review.",'',{
          duration:4000
        });
        this.reviewField.nativeElement.value = "";
        this.rateArray = [0,0,0,0,0];
        this.selectedStar = 0;
        this.sendReview = false;
        this.closeReview();
      }else {
        this.sendReview = false;
      }
    });

  }

  submitCourseReview(){
    if(((this.courseReviewField.nativeElement.value.toString()).trim()).length == 0 && this.selectedStar == 0){
      this.feedBackInfoTxt = true;
      setTimeout(() => {
        this.feedBackInfoTxt = false
      }, 5 * 1000);
      return 0;
    }
    let course = this._constant.liveCallCourseObj;
    let userId =JSON.parse(this._constant.aesDecryption('userData'))['id'].toString();
    let ratings = this.selectedStar.toString();
    let review = this.courseReviewField.nativeElement.value.toString();

    this.sendReview = true;
    let obj = {
      "user_ihl_id": userId,
      "ihl_consultant_id": course['consultant_id'],
      "course_name": course['title'],
      "course_id": course['course_id'],
      "review_text": review,
      "trainer_name": course['consultant_name'],
      "vendor_name": course['provider'],
      "ratings": ratings,
    };
    console.log(obj);
    this.authService.postCourseReview(obj).subscribe(data=>{
      console.log(data);
      if (typeof (data) === "object"){
        this.snackBar.open("Thanks for your review.",'',{
          duration:3000
        });
        this.courseReviewField.nativeElement.value = "";
        this.rateArray = [0,0,0,0,0];
        this.selectedStar = 0;
        this.sendReview = false;
        this.closeReview();
      }else{
        this.snackBar.open("Something went wrong, Try again later.",'',{
          duration:3000
        });
        this.sendReview = false;
      }

    });
  }

  addMobileNumber(value: string): void{
    this._constant.teleconsultMobileValidate = false;
    this.dialogRef.close();
    if (value === 'add') {
      this._constant.teleconsultAddMobileNumber = true;
      this.router.navigate(['/export']);
    }
  }

  subscriptionCancel(){
    if (this.subcriptionForm.valid === false){
      return;
    }else if (this.subcriptionForm.value.reason_for_cancel.trim().length == 0) {
      return;
    }else{
      this.dialogRef.close(this.subcriptionForm.value.reason_for_cancel.toString());
      this._constant.teleconsultMySubscriptionCancelButton = false;
    }
  }

  reasonForSubscriptionRefund(){
    let obj = this.subcriptionRefundForm.value
    if (obj.option_for_cancel.length == 0 && obj.other_reason.trim().length == 0) {
      this.isUserReasonEmpties = true;
      setTimeout(() => {
        this.isUserReasonEmpties = false;
      }, 3000);
      return;
    }else{
      let reason = "";
      if (obj.option_for_cancel.length == 0) {
        reason = obj.other_reason;
      }else if (obj.other_reason.trim().length  == 0) {
        reason = obj.option_for_cancel.toString();
      }else{
        reason = `${obj.option_for_cancel.toString()}, ${obj.other_reason}`
      }
      this.dialogRef.close(reason);
      this._constant.teleconsultMySubscriptionRefundCancelButton = false;
    }
  }

  closeWindow() {
    this.closeModal();
    this._constant.initUITour = false;
    this._constant.challenge_welcomeWindow = false;
    // setTimeout(() => {
    //   window['$crisp'].push(["do", "message:show", ["text", "Ask us your Questions"]]);
    // }, 30000);
  }

    initUITourGuide() {
    this.closeModal();
    this._constant.initUITour = false;
    if(this._constant.isAffiliatedUser) {
      this.joyrideService.startTour(
        { steps: ['profile_ui_walk@export', 'dashboard_ui_walk@dashboard', 'affiliated_ui_walk@affiliated-users', 'teleconsult_ui_walk@teleconsultation', 'fitnessClass_ui_walk@fitnessPage', 'challenge_ui_walk@challenges'],
          themeColor:'#4885ed',
        });
    } else {
      this.joyrideService.startTour(
        { steps: ['profile_ui_walk@export', 'dashboard_ui_walk@dashboard', 'teleconsult_ui_walk@teleconsultation', 'fitnessClass_ui_walk@fitnessPage', 'challenge_ui_walk@challenges'],
          themeColor:'#4885ed',
        });
    }
    let userLocalData = JSON.parse(this._constant.aesDecryption('userData'));
    userLocalData.introDone = true;
    this._constant.tourDoneShowHbuddy = true;
    this.authService.postIntroIsDone(userLocalData).subscribe(data => {
      console.log(data);
    });
  }

  closeDeleteAffModal() {
    this.closeModal();
    this._constant.showAffDeleteModal = false;
  }

  deleteAffiliation() {
    let affilate_unique_name = this._constant.affilate_unique_name;
    this._constant.showAffDeleteModal = false;
    this._constant.processingContent = true;
    this._constant.affiliatedCompanies = this._constant.affiliatedCompanies.filter(company => {
      if(company['affilate_unique_name'] !== affilate_unique_name) {return company;}
    });
    this.updateLocalAffData(affilate_unique_name);
  }

  updateLocalAffData(affilate_unique_name:string) {
      let userData = JSON.parse(this._constant.aesDecryption('userData'));
      if('user_affiliate' in userData) {
        if(userData['user_affiliate'].af_no1 != null && userData['user_affiliate'].af_no1.affilate_unique_name == affilate_unique_name) {
          userData['user_affiliate'].af_no1.affilate_name="";
          userData['user_affiliate'].af_no1.affilate_email="";
          userData['user_affiliate'].af_no1.affilate_mobile="";
          userData['user_affiliate'].af_no1.affliate_identifier_id="";
          userData['user_affiliate'].af_no1.affilate_unique_name="";
        }
        else if(userData['user_affiliate'].af_no2 != null && userData['user_affiliate'].af_no2.affilate_unique_name == affilate_unique_name) {
          userData['user_affiliate'].af_no2.affilate_name="";
          userData['user_affiliate'].af_no2.affilate_email="";
          userData['user_affiliate'].af_no2.affilate_mobile="";
          userData['user_affiliate'].af_no2.affliate_identifier_id="";
          userData['user_affiliate'].af_no2.affilate_unique_name="";
        }
        else if(userData['user_affiliate'].af_no3 != null && userData['user_affiliate'].af_no3.affilate_unique_name == affilate_unique_name) {
          userData['user_affiliate'].af_no3.affilate_name="";
          userData['user_affiliate'].af_no3.affilate_email="";
          userData['user_affiliate'].af_no3.affilate_mobile="";
          userData['user_affiliate'].af_no3.affliate_identifier_id="";
          userData['user_affiliate'].af_no3.affilate_unique_name="";
        }
        else if(userData['user_affiliate'].af_no4 != null && userData['user_affiliate'].af_no4.affilate_unique_name == affilate_unique_name) {
          userData['user_affiliate'].af_no4.affilate_name="";
          userData['user_affiliate'].af_no4.affilate_email="";
          userData['user_affiliate'].af_no4.affilate_mobile="";
          userData['user_affiliate'].af_no4.affliate_identifier_id="";
          userData['user_affiliate'].af_no4.affilate_unique_name="";
        }
        else if(userData['user_affiliate'].af_no5 != null && userData['user_affiliate'].af_no5.affilate_unique_name == affilate_unique_name) {
          userData['user_affiliate'].af_no5.affilate_name="";
          userData['user_affiliate'].af_no5.affilate_email="";
          userData['user_affiliate'].af_no5.affilate_mobile="";
          userData['user_affiliate'].af_no5.affliate_identifier_id="";
          userData['user_affiliate'].af_no5.affilate_unique_name="";
        }
        else if(userData['user_affiliate'].af_no6 != null && userData['user_affiliate'].af_no6.affilate_unique_name == affilate_unique_name) {
          userData['user_affiliate'].af_no6.affilate_name="";
          userData['user_affiliate'].af_no6.affilate_email="";
          userData['user_affiliate'].af_no6.affilate_mobile="";
          userData['user_affiliate'].af_no6.affliate_identifier_id="";
          userData['user_affiliate'].af_no6.affilate_unique_name="";
        }
        else if(userData['user_affiliate'].af_no7 != null && userData['user_affiliate'].af_no7.affilate_unique_name == affilate_unique_name) {
          userData['user_affiliate'].af_no7.affilate_name="";
          userData['user_affiliate'].af_no7.affilate_email="";
          userData['user_affiliate'].af_no7.affilate_mobile="";
          userData['user_affiliate'].af_no7.affliate_identifier_id="";
          userData['user_affiliate'].af_no7.affilate_unique_name="";
        }
        else if(userData['user_affiliate'].af_no8 != null && userData['user_affiliate'].af_no8.affilate_unique_name == affilate_unique_name) {
          userData['user_affiliate'].af_no8.affilate_name="";
          userData['user_affiliate'].af_no8.affilate_email="";
          userData['user_affiliate'].af_no8.affilate_mobile="";
          userData['user_affiliate'].af_no8.affliate_identifier_id="";
          userData['user_affiliate'].af_no8.affilate_unique_name="";
        }
        else if(userData['user_affiliate'].af_no9 != null && userData['user_affiliate'].af_no9.affilate_unique_name == affilate_unique_name) {
          userData['user_affiliate'].af_no9.affilate_name="";
          userData['user_affiliate'].af_no9.affilate_email="";
          userData['user_affiliate'].af_no9.affilate_mobile="";
          userData['user_affiliate'].af_no9.affliate_identifier_id="";
          userData['user_affiliate'].af_no9.affilate_unique_name="";
        } else {
          for(const property in userData['user_affiliate']) {
            if(userData['user_affiliate'][property] != null) {
              if(userData['user_affiliate'][property]['affilate_unique_name'] === affilate_unique_name) {
                userData['user_affiliate'][property] = "";
              }
            }
          }
        }
      }
      this.postUpdatedAffiliationData(userData['email'], userData);
  }

  postUpdatedAffiliationData(email:string, userData:object) {
    let userObj = userData;
    let user_affiliate = userObj['user_affiliate'];
    console.log(user_affiliate);

    const user = {
      email,
      password: this._constant.userPassword,
      encryptionVersion: null,
    }
    let apiKey = localStorage.getItem('apiKey');
    this.authServiceLogin.authenticateIhl(user, apiKey).subscribe(res =>  {
      let data = JSON.parse(JSON.stringify(res));
      console.log(data);
      if(data != null) {
        data['User']['user_affiliate'] = user_affiliate;
      } else {
        this._constant.processingContent = false;
        this.closeModal();
        this.snackBar.open(`Something went wrong! Please try again later.`,'', {
          duration: 5000,
          panelClass:['error']
        });
        setTimeout(() => {window.location.reload();}, 1000);
        return;
      }
      this.authService.updateDeletedAffiliation(data, apiKey).subscribe(update_res => {
        console.log(update_res);
        if(update_res == 'updated') {
          this._constant.processingContent = false;
          this.closeModal();
          this.snackBar.open(`The ${this._constant.affilate_company_name} affiliation is deleted successfully!`,'', {
            duration: 5000,
            panelClass:['success']
          });
          localStorage.setItem('userData', this._constant.aesEncryption(JSON.stringify(data['User'])));
          this._constant.affiliatedCompanies = this._constant.affiliatedCompanies.filter(company => {
            if(company['affilate_name'] != "") {
              return company;
            }
          });
          if(this._constant.affiliatedCompanies.length == 0) {
            this._constant.isAffiliatedUser = false;
            setTimeout(() => {this.redirectTo('export');}, 1000);
          }
        } else {
          this.snackBar.open(`Something went wrong! Please try again later.`,'', {
            duration: 5000,
            panelClass:['error']
          });
          this._constant.processingContent = false;
          this.closeModal();
          setTimeout(() => {window.location.reload();}, 1000);
          return;
        }
      },
      (error:any) => {
        this.snackBar.open(`Something went wrong! Please try again later.`,'', {
          duration: 5000,
          panelClass:['error']
        });
        this._constant.processingContent = false;
        this.closeModal();
        setTimeout(() => {window.location.reload();}, 1000);
        return;
      });
    },
    (error:any) => {
      this.snackBar.open(`Something went wrong! Please try again later.`,'', {
        duration: 5000,
        panelClass:['error']
      });
      this._constant.processingContent = false;
      this.closeModal();
      setTimeout(() => {window.location.reload();}, 1000);
      return;
    });
  }

  redirectTo(uri:string){
    this.router.navigateByUrl('/', {skipLocationChange: false}).then(() => {
      this.router.navigate([uri]);
    });
  }

  refundInfo(refundModalType:string) {
    if(refundModalType === 'bookAppoinment') this._constant.showConsultantRefundInfo = true;
    else this._constant.showClassRefundInfo = true;
    this.refundModalType = refundModalType;
    this.showRefundTable = true;
    this._constant.refundInfo = true;
    this._constant.teleconsultMySubscriptionRefundCancelButton = false;
    this._constant.teleconsultMySubscriptionCancelButton = false;
    this._constant.teleconsultMyAppointmentCancelButton = false;
  }

  closeRefundInfo() {
    this._constant.refundInfo = false;
    this._constant.showConsultantRefundInfo = false;
    this._constant.showClassRefundInfo = false;
    if(this.showRefundTable) {
      if(this.refundModalType === 'beforeSubscription') this._constant.teleconsultMySubscriptionCancelButton = true;
      else if(this.refundModalType === 'afterSubscription') this._constant.teleconsultMySubscriptionRefundCancelButton = true;
      else if(this.refundModalType === 'bookAppoinment') this._constant.teleconsultMyAppointmentCancelButton = true;
      else this.closeModal();
    } else {
      this.closeModal();
    }
  }

  closePrescriptionSharing(){
    this._constant.buyMedicineOnline = false;
    this.closeModal();
  }

  showPurshaseMedicineContainer(){
    this.purshaseMedicineContainer = !this.purshaseMedicineContainer;
    if (this.termsServiceContent != undefined && this.termsServiceContent != null && this.purshaseMedicineContainer == false) {
      this.termsContent = this.termsServiceContent.nativeElement.innerHTML;
    }

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
      "order_type": "medication",
      "affiliation_code": ""
    }

    console.log(prescriptionObjectWithDetails);
    //debugger;
    this._teleConsultService.sharePrescriptionTo1mg(JSON.stringify(prescriptionObjectWithDetails)).subscribe((data)=>{
      console.log(data);
      this.snackBar.open(`Thank You.  ${this._constant.medicationPartnerDetails.name} will contact you to confirm the order.`,'',{
        duration:1000 * 6,
        panelClass: ['success']
      });
      this._constant.buyMedicineOnline = false;
      this.dialogRef.close();
    },
    (err)=>{
      console.log(err);
      this.snackBar.open("Sorry something went wrong.",'',{
        duration:1000 * 6,
        panelClass: ['error']
      });
      this._constant.buyMedicineOnline = false;
      this.dialogRef.close();
    })
  }

  closeLabOrderReportSharing(){
    this._constant.getLabOrder = false;
    this.closeModal();
  }

  showPurchaseLabOrderReportContainer(){
    this.purchaseLabOrderReportContainer = !this.purchaseLabOrderReportContainer;
    if (this.termsServiceContentLabOrder != undefined && this.termsServiceContentLabOrder != null && this.purchaseLabOrderReportContainer == false) {
      this.termsContentLabOrder = this.termsServiceContentLabOrder.nativeElement.innerHTML;
    }

  }

  shareLabOrder(){
    let prescriptionObject = this._constant.labObjectFor1mg;
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

    let labObjectWithDetails = {
      "first_name": patientFirstName,
      "last_name": patientLastName,
      "email": patientEmail,
      "mobile": patientMobileNumber,
      "prescription_number": this._constant.printInvoiceNumberForTeleconsultation || "N/A",
      "prescription_base64": encodedPrescription.toString(),
      "security_hash": stringHash.toString(),
      "kiosk_id": "",
      "affiliation_unique_name": affiliteUniqueName || "global_services",
      "order_type": "lab",
      "affiliation_code": ""
    }

    console.log(labObjectWithDetails);
    //debugger;
    this._teleConsultService.sharePrescriptionTo1mg(JSON.stringify(labObjectWithDetails)).subscribe((data)=>{
      console.log(data);
      this.snackBar.open(`Thank You.  ${this._constant.labPartnerDetails.name} will contact you to confirm the order.`,'',{
        duration:1000 * 6,
        panelClass: ['success']
      });
      this._constant.getLabOrder = false;
      this.dialogRef.close();
    },
    (err)=>{
      console.log(err);
      this.snackBar.open("Sorry something went wrong.",'',{
        duration:1000 * 6,
        panelClass: ['error']
      });
      this._constant.getLabOrder = false;
      this.dialogRef.close();
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

  closeConsultantAvailabilityPopup(){
    this._constant.noCourseIsAvailable = false;
    this._constant.noDoctorIsAvailable = false;
  }

  closeJointAccountTermsAndConditions(){
    this._constant.jointAccountTermsAndConditions = false;
    this.dialogRef.close();
  }

  installMobileApp() {
    window.open('https://play.google.com/store/apps/details?id=com.indiahealthlink.ihlhealth','_blank');
    this.closeModal();
    this._constant.affiliatedFirstLoginModelBox = false;
    localStorage.setItem('affiliated-user-first-login', this._constant.aesEncryption('false'));
  }

  closeInstallAppWindow() {
    this.closeModal();
    this._constant.affiliatedFirstLoginModelBox = false;
    localStorage.setItem('affiliated-user-first-login', this._constant.aesEncryption('false'));
  }

//   unLinkJointUserAccount(value: string){

//     switch(value){
//       case 'yes': {
//         this.jointAccountService.onUnLinkGuestUserConfirmation({_isUnLink:true});
//         this._constant.unlinkJointUserConfirmationPopUp = false;
//         this.dialogRef.close();
//         break;
//       }
//       case 'no': {
//         this._constant.unlinkJointUserConfirmationPopUp = false;
//         this.dialogRef.close();
//         break;
//       }
//       default: {
//         this._constant.unlinkJointUserConfirmationPopUp = false;
//         this.dialogRef.close();
//         break;
//       }

//     }
//   }

// }

  unLinkJointUserAccount(value: string){

    switch(value){
      case 'yes': {
        this.jointAccountService.onUnLinkGuestUserConfirmation({_isUnLink:true});
        // console.log("Switch" + this.unLinkUser(this.unLinkUserDetail));
        this.unLinkUser(this.unLinkUserDetail);


        //this.showJointUserList = false;
        this._UnLinkButtonClicked = true;
        // this.dialogRef.close();
        break;
      }
      case 'no': {
        //this._constant.unlinkJointUserConfirmationPopUp = false;
        //this._constant.unlinkJointAccountPopUp = true;
        this.showJointUserList = true;
        //this.dialogRef.close();
        break;
      }
      default: {
        this._constant.unlinkJointUserConfirmationPopUp = false;
        this._constant.unlinkJointAccountPopUp = false;
        this.showJointUserList = true;
        this.dialogRef.close();
        break;
      }

    }
  }

// public userProfileImage(): string {
//   if (this.userData) {
//     if (this.userData['photo'] && this.userData['photo'].length > 0) {
//       return `data:${this._constants.userProfilePicType};base64,${this.userData['photo']}`;
//     } else {
//       if (this.userData['gender'] && (this.userData['gender'].toLowerCase() == 'm' || this.userData['gender'].toLowerCase() == 'male')) {
//         return "assets/img/avatar-male.png";
//       } else {
//         return "assets/img/avatar-female.png";
//       }
//     }
//   } else {
//     return "assets/img/avatar-male.png";
//   }
// }


  public trackByFn(index: number, detail: any): any {
    return detail.value['ihl_user_id'];
  }

  public _LinkedJointAccounts(): any {

    let userData = this._constant.aesDecryption('userData') ? JSON.parse(this._constant.aesDecryption('userData')) : undefined;
    if (userData) {
      this.userData = userData;
      if ('joint_user_detail_list' in userData && userData['joint_user_detail_list'] != undefined && userData['joint_user_detail_list'] != null && Object.keys(userData['joint_user_detail_list']).length > 0) {
        let obj: any = Object.entries(userData['joint_user_detail_list']).some((item)=>{
          return item[1]["status"] == "active";
        });
        if (obj) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  public unlinkUserName:string = null;

  openJointConfirmationDialog(detail, index, userName): void {
    //alert("openConfirmationDialog");
    //alert(userName)
    this.unlinkUserName = userName;
    //return;
    //alert("afeter return");

    console.log(detail);
    console.log(detail.key);
    console.log(detail.value);
    this.unLinkUserDetail = detail;
    this.showJointUserList = false;
    //this._constant.unlinkJointUserConfirmationPopUp = true;
    //this._constant.unlinkJointAccountPopUp = false;
    //this.dialog.open(ModalComponent);
  }

  public unLinkUser(detail): void {
    let userDetail = detail;
    this._isDisabledUserDetailBtn = true;
    // console.log(this.userData.joint_user_detail_list['joint_user10']['status']);
    this.userData.joint_user_detail_list[userDetail.key]["status"] = "inactive";
    let data = {
      joint_user_detail_list: this.userData.joint_user_detail_list
    };
    this.jointAccountService.updateMainAccountUser(JSON.stringify(data), this.userData.id).subscribe(
      (response: any) => {
        console.log(response);
        if (response == "updated") {
          console.log(this.userData);

          this.snackBar.open("User unlink is successful", '', {
            duration: 2 * 1000,
            panelClass: ['success'],
          });
          this._constant.unlinkJointAccountPopUp = false;
          this._constant.unlinkJointUserConfirmationPopUp = false;
          this.dialogRef.close();
          this._constant.userProfileData.joint_user_detail_list = this.userData.joint_user_detail_list;
          localStorage.setItem('userData', this._constant.aesEncryption(JSON.stringify(this._constant.userProfileData)))
          console.log(this._constant.userProfileData.joint_user_detail_list);
          this._isDisabledUserDetailBtn = false;
        } else {
          this._isDisabledUserDetailBtn = false;
          this.snackBar.open("Something went wrong", '', {
            duration: 2 * 1000,
            panelClass: ['error'],
          });
        }
      },
      (err) => {
        this._isDisabledUserDetailBtn = false;
        this.snackBar.open("Something went wrong", '', {
          duration: 2 * 1000,
          panelClass: ['error'],
        });
      },
      () => {
      }
    );

    if ('joint_user_detail_list' in this.userData && this.userData['joint_user_detail_list'] != undefined && this.userData['joint_user_detail_list'] != null && Object.keys(this.userData['joint_user_detail_list']).length == 0) {
      this.onEmptyUserList.emit(false);
    }
  }

  unlinkJointAccountPopUpClose() {
    this._constant.unlinkJointUserConfirmationPopUp = false;
    this._constant.unlinkJointAccountPopUp = false;
    this.dialogRef.close();
  }

  /* Myself or joint user for tele & Unsending requested user request */

  jointuserSelectMyself() {
    this._constant.jointUserTermsConditionsPopUp = false;
    this._constant.teleConsultaionAgree = true;
  }

  jointuserSelectOthers() {
    let data = JSON.parse(this._constant.aesDecryption("userData"));
    let jointUserList = Object.values(data.joint_user_detail_list).filter((item: any) => (item.status.toLowerCase() == "active"));
    this.jointUserList = jointUserList;
    console.log(this.jointUserList);
    this._constant.jointuserSelectothers = true;
  }

  listusers(user:any): void {
    console.log("selectedusers : ",user);
    this.jointuserparameter = user;
    this._ischecked = user.key;
  }

  switchUser(): void {
    let user = this.jointuserparameter;
    localStorage.setItem('user', this._constant.aesEncryption(JSON.stringify(user)));
    let teleflow = JSON.parse(this._constant.aesDecryption('user'));
    this.jointAccountService.initiateSwitchUserAccount({ id: user.value['ihl_user_id'] });
    this.dialogRef.close();
  }

  EnableCheckboxTermsAndCondition() {
    this._constant.jointUserTermsConditionsPopUp = false;
    this._disableacceptdeny = true;
    this._constant.teleConsultaionAgree = true;
  }

  closeModaltc() {
    this._constant.teleConsultaionAgree = false;
    if(this._userData.joint_user_detail_list){
    this._constant.jointUserTermsConditionsPopUp = true;
    } else {
      this.dialogRef.close();
    }
  }

  closeModalcf() {
    localStorage.removeItem("orgUser");
    this._constant.orgUserConsentForm = false;
    this.dialogRef.close();
  }

  selectedOrg(orgName){
    this.selectedOrgIsValid = false;
    this.orgUserShared = orgName;
  }

  consentFormAccepted(userConsent){
    if(userConsent == "true"){
      if(this.orgUserShared == ""){
        this.selectedOrgIsValid = true;
      } else {
        let orgUserData = JSON.parse(this._constant.aesDecryption('orgUser'));
        var data_share_consent = {
          "organization": orgUserData.orgCode,
          "shared_to": this.orgUserShared,
        };

        let userData = JSON.parse(this._constant.aesDecryption('userData'));

        if (userData.data_sharing_consent  != null && userData.data_sharing_consent.length < 9) {
          if (userData.data_sharing_consent.dsc_1 == null || userData.data_sharing_consent.dsc_1.organization == "" || userData.data_sharing_consent.dsc_1.organization == data_share_consent.organization) {
            userData.data_sharing_consent.dsc_1 = data_share_consent;
          } else if (userData.data_sharing_consent.dsc_2 == null || userData.data_sharing_consent.dsc_2.organization == "" || userData.data_sharing_consent.dsc_2.organization == data_share_consent.organization) {
            userData.data_sharing_consent.dsc_2 = data_share_consent;
          } else if (userData.data_sharing_consent.dsc_3 == null || userData.data_sharing_consent.dsc_3.organization == "" || userData.data_sharing_consent.dsc_3.organization == data_share_consent.organization) {
            userData.data_sharing_consent.dsc_3 = data_share_consent;
          } else if (userData.data_sharing_consent.dsc_4 == null || userData.data_sharing_consent.dsc_4.organization == "" || userData.data_sharing_consent.dsc_4.organization == data_share_consent.organization) {
            userData.data_sharing_consent.dsc_4 = data_share_consent;
          } else if (userData.data_sharing_consent.dsc_5 == null || userData.data_sharing_consent.dsc_5.organization == "" || userData.data_sharing_consent.dsc_5.organization == data_share_consent.organization) {
            userData.data_sharing_consent.dsc_5 = data_share_consent;
          } else if (userData.data_sharing_consent.dsc_6 == null || userData.data_sharing_consent.dsc_6.organization == "" || userData.data_sharing_consent.dsc_6.organization == data_share_consent.organization) {
            userData.data_sharing_consent.dsc_6 = data_share_consent;
          } else if (userData.data_sharing_consent.dsc_7 == null || userData.data_sharing_consent.dsc_7.organization == "" || userData.data_sharing_consent.dsc_7.organization == data_share_consent.organization) {
            userData.data_sharing_consent.dsc_7 = data_share_consent;
          } else if (userData.data_sharing_consent.dsc_8 == null || userData.data_sharing_consent.dsc_8.organization == "" || userData.data_sharing_consent.dsc_8.organization == data_share_consent.organization) {
            userData.data_sharing_consent.dsc_8 = data_share_consent;
          } else if (userData.data_sharing_consent.dsc_9 == null || userData.data_sharing_consent.dsc_9.organization == "" || userData.data_sharing_consent.dsc_9.organization == data_share_consent.organization) {
            userData.data_sharing_consent.dsc_9 = data_share_consent;
          } else {
            console.log("data share limit exisits");
          }
        } else {
          userData.data_sharing_consent = {
            "dsc_1": data_share_consent
          };
        }
        console.log(userData);
        let IHLUserToken = localStorage.getItem("id_token");
        let apiKey = localStorage.getItem("apiKey");
        this._constant.orgUserConsentForm = false;
        this.dialogRef.close();
        if(this._constant.aesDecryption('isIntroDoneLocalData') == "true"){
          this._constant.initUITour = true;
          this.dialog.open(ModalComponent);
        }
        this.authService.postEditProfieInput(apiKey, IHLUserToken, userData.id, userData).subscribe((data: any) => {
          localStorage.removeItem("orgUser");
          localStorage.setItem("userData", this._constant.aesEncryption(JSON.stringify(userData)));
          //console.log(this._constant.aesDecryption("userData"));
        });
      }
    } else {
      localStorage.removeItem("orgUser");
      this._constant.orgUserConsentForm = false;
      this.dialogRef.close();
      if(this._constant.aesDecryption('isIntroDoneLocalData') == "true"){
        this._constant.initUITour = true;
        this.dialog.open(ModalComponent);
      }
    }


  }

  _isDisableJointAccountOption(): any {
    let userData = JSON.parse(this._constant.aesDecryption('userData'));
    let activelength = Object.values(userData.joint_user_detail_list).filter((item : any) => (item.status.toLowerCase() == 'active')).length
    let requestedlength =Object.values(userData.joint_user_detail_list).filter((item : any) => (item.status.toLowerCase() == 'requested')).length
    if (userData){
      if((activelength + requestedlength) > 15){
        return true;
      }else{
        return false;
      }
    }else{
      return true;
    }
  }

  addlinkanotheracc(){
    this.dialogRef.close();
    localStorage.setItem('addlinkanotheracc', this._constant.aesEncryption('true'));
  }

  openReqConfirmationDialog(detail): void {
    console.log("selecteduserrequest : ", detail);
    this._userrequest = detail; //assigning user_request to a global variable
    this._hideuserrequestlist = true; //hide content of requested users
    this._constant.requestacceptance = true;
    this._constant.unsendJointUserrequestconfirmation = true; // for unsend once selected users
  }

  // opencaretakerConfirmationDialog(detail): void {
  //   console.log("selectedcaretakerrequest : ", detail);
  //   this._userrequest = detail; //assigning user_request to a global variable
  //   console.log(this._userrequest)
  //   this._hideuserrequestlist = true; //hide content of requested users
  //   //  this._constant.requestacceptance = true;
  //    this._constant.caretakeracceptance = true;
  //   this._constant.unsendCareUserrequestconfirmation = true; // for unsend once selected users
  // }

  unsenduserrequest(){
    let _userreq = this._userrequest; //assigning global variable(globally has value of selected requested user member) to block variable
    _userreq.value['status'] =  'inactive' //changes the status of active into inactive
    let reqid = _userreq.value['ihl_user_id']
    // let change_status = _userreq.value['status']  //assign block variable to store the changed status(i.e inactive)

    for(let keys in this._userData.joint_user_detail_list){
        if(this._userData.joint_user_detail_list[keys]['ihl_user_id'] == reqid){ //id matching to change the status this._userData.joint_user_detail_list[keys]['status'] = 'inactive'
          this._userData.joint_user_detail_list[keys]['status'] = "inactive" ;
          this._updatedrequsers = this._userData.joint_user_detail_list[keys]['status'];
        }
    }
    let data = {
      joint_user_detail_list: this._userData.joint_user_detail_list
    };
    this.jointAccountService.updateMainAccountUser(JSON.stringify(data), this._userData.id).subscribe(
      (response: any) => {
        console.log(response);
        if (response == "updated") {
          console.log(this._userData);
          this.snackBar.open("Unsend request is successful", '', {
            duration: 2 * 1000,
            panelClass: ['success'],
          });
          this._constant.userProfileData.joint_user_detail_list = this._userData.joint_user_detail_list;
          console.log(this._constant.userProfileData)
          console.log("updated : ",this._constant.userProfileData.joint_user_detail_list)
          localStorage.setItem('userData', this._constant.aesEncryption(JSON.stringify(this._constant.userProfileData)))
        } else {
          this.snackBar.open("Something went wrong", '', {
            duration: 2 * 1000,
            panelClass: ['error'],
          });
        }
      },
      (err) => {
        this.snackBar.open("Something went wrong", '', {
          duration: 2 * 1000,
          panelClass: ['error'],
        });
      },
      () => {
      }
    );
    this.dialogRef.close();
  }

  // unsendcareuserrequest() {
  //   let _userreq = this._userrequest;
  //   console.log(_userreq);
  // }

  nounsenduserrequest() {
    console.log("Unsend request has been cancelled");
    this._constant.requestedjoinuser = false;
    this.dialogRef.close();
  }

  closerequsers() {
    this._constant.requestedjoinuser = false;
    this._constant.requestacceptance = false;
    this._constant.unsendJointUserrequestconfirmation = false;
    this.dialogRef.close();
  }

  onSubmit(formObj: any): void {
    const newFileName = formObj.value;
    this._constant.modifiedMedicalFileName = newFileName;
    console.log(this._constant.modifiedMedicalFileName);
    this.authService.publish('newFile-Name');
    this._constant.renameFilePopUp = false;
    this.dialogRef.close();
  }

  renameFilePopUpClose() {
    this._constant.renameFilePopUp = false;
    this.dialogRef.close();
  }

  changeFileName(newFileName) {
    var new_filename = newFileName.value
    let isFileNameAlreadyExists = this._constant.medicalDocumentsList.some(item => {
      console.log(item.document_name.substr(0, item.document_name.indexOf('.')));
      return new_filename == item.document_name.substr(0, item.document_name.indexOf('.'));
    });
    if(isFileNameAlreadyExists == true || new_filename < 1){
      newFileName.exist = true;
    }
    else {
      newFileName.exist = false;
      this._constant.saveFile = true;
    }
  }

  showDeclinedAffWindow() {
    this.affiliatedUserModal = false;
    this.router.navigate(['/register']);
    this.dialogRef.close();
  }

  sendOtpViaSmsAndEmail() {
    this.affiliatedUserModal = false;
    this.affiliatedUserOtpModal = true;
    this.resendOTPButton = true;

    this.authServiceLogin.sendOtpViaSmsAndEmail(this._constant.affiliatedData['email'], this._constant.affiliatedData['mobile']).subscribe((data: any) => {
      if (data['status'] == "sent_sucess") {
        this.sentOTP = data['OTP'];
        let mobile = this._constant.affiliatedData['mobile'].slice(6,10);
        let email = this._constant.affiliatedData['email'].split('@');
        this.OTPMsg = 'OTP has been sent to your reg. mobile number: xxxxxx'+ mobile +' & e-mail ID: '+email [0].slice(0,2)+'xxxxx@'+email[1]+'.';
      }
    });
  }

  resendOTP() {
    let countDownDate:any = new Date();
    var d = new Date();
    countDownDate.setMinutes(d.getMinutes() + 1);
    countDownDate.getTime();
    this.resendOTPButton = false;

    var x = setInterval(() => {
      var now = new Date().getTime();
      var distance = countDownDate - now;
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);
      this.OTPMsg = "Resend OTP in "+seconds+" sec.";

      if (seconds < 5) {
        this.sendOtpViaSmsAndEmail();
        clearInterval(x);
        this.OTPMsg = "";
        return;
      }
    }, 1000);
  }

  showAuthenticateModal() {
    this.affiliatedUserOtpModal = false;

    this.authServiceLogin.checkEmailExist(this._constant.affiliatedData['email']).subscribe((data: any) => {
      if (data != '') {
        this.router.navigate(['/']);
      }
      else {
        this.router.navigate(['/register']);
        this.authServiceLogin.publish('affiliatedData');
      }
      this.dialogRef.close();
    });
  }

  showRegisterPage() {
    this.dialogRef.close();
    this.affiliatedRegisterModal = false;
    this.router.navigate(['/register']);
    this.authServiceLogin.publish('affiliatedData');
  }

  /* JOIN CALL AND DOWNLOAD INVOICE FUNCTIONALITY START */

  joinCall() {
    this.dialogRef.close();
    this._constant.showLiveCallModal = false;
    this.authService.publish('callConfirmAppointment');
  }

  viewMyAppointments() {
    this._constant.showAppointmentModal = false;
    this.router.navigate(['/myappointment']);
  }

  viewMySubscriptions() {
    this._constant.showSubscriptionModal = false;
    this._constant.showSubscriptionDownloadInvoice = false;
    this.router.navigate(['/mysubscription']);
  }

  downloadInvoice() {
    this.dialogRef.close();
    this._constant.showLiveCallModal = false;
    this._constant.showAppointmentModal = false;
    this._constant.showSubscriptionModal = false;
    this._constant.showSubscriptionDownloadInvoice = false;
    this.authService.publish('downloadInvoice');
  }

  /* JOIN CALL AND DOWNLOAD INVOICE FUNCTIONALITY END */

  closePaymentSelectMethod(){
    this._constant.showPaymentSelect = false;
    this.dialogRef.close();
  }

  collectCoupon(cop:any){
    console.log(cop.value);
    this.couponNumber = cop.value;
  }

  selectedPaymentMethod(){
    this.paymentSelectShow = false;
  }

  proceedTopay(){
    this._constant.showPaymentSelect = false;
    console.log(this.payableAmount);
    if(this.payableAmount != -1){
      this.dialogRef.close({'payableAmount' : this.payableAmount, 'discountAmount' : this.discountAmount, 'couponCode' : this.couponNumber});
      this._constant.selectedCourseConsultantId = '';
      this._constant.selectedCourseId = '';
      this.payableAmount = -1;
      this.discountAmount = '';
      this.couponNumber = '';
    }else if(this.payableAmount == 0){
      this.dialogRef.close({'payableAmount' : this.payableAmount, 'discountAmount' : this.discountAmount, 'couponCode' : this.couponNumber});
      this._constant.selectedCourseConsultantId = '';
      this._constant.selectedCourseId = '';
      this.payableAmount = -1;
      this.discountAmount = '';
      this.couponNumber = '';
    }else {
      this.dialogRef.close('couponNotApplied');
      this._constant.selectedCourseConsultantId = '';
      this._constant.selectedCourseId = '';
    }
  }

  clearCoupon(){
    this.isCouponCodeValidated = false;
    this.discountAmount = '';
    this.payableAmount = -1;
    this.discountAmountCalShow = false;
  }

  checkCoupon(){
    if(this.couponNumber){
      this.authService.couponCheck(this.couponNumber).subscribe((res) => {
        console.log(res);
        if(res['status'] == "access_allowed"){
          this.isCouponCodeValidated = true;
          if(res['discount_percentage'] != undefined){            
            console.log(res['discount_percentage']);
            this.discountAmount = this._constant.consultationFee/100 * res['discount_percentage']/100;
            console.log(this.discountAmount);
            let calculatedAmount = this._constant.consultationFee/100 - this.discountAmount;
            if(calculatedAmount < 0){
              this.payableAmount = 0;
            }else{
              this.payableAmount = calculatedAmount;
            }
          }else if(res['amount'] != undefined){
            console.log(res['amount']);
            this.discountAmount = res['amount'];
            let calculatedAmount = this._constant.consultationFee/100 - this.discountAmount;
            if(calculatedAmount < 0){
              this.payableAmount = 0;
            }else{
              this.payableAmount = calculatedAmount;
            }
          }else{
            this.snackBar.open("Something went wrong", '', {
              duration: 2 * 1000,
              panelClass: ['error'],
            });  
          }
          this.discountAmountCalShow = true;
        }else if(res['status'] == "access_denied"){
          this.snackBar.open("Invalid Coupon", '', {
            duration: 2 * 1000,
            panelClass: ['error'],
          });
        }else{
          this.snackBar.open("Invalid Coupon", '', {
            duration: 2 * 1000,
            panelClass: ['error'],
          });
        }
      })
    }
  }

  convertToSSOYes() {
    this.dialogRef.close();
    this._constant.ihlAccountExistModal = false;
    this.authService.publish('showSSOAlternativeEmailSection');
  }

  convertToSSONo() {
    this.dialogRef.close();
    this._constant.ihlAccountExistModal = false;
  }

  convertSSOToIHLYes() {
    this.dialogRef.close();
    this._constant.ihlAccountErrModal = false;
  }

  convertSSOToIHLNo() {
    this.dialogRef.close();
    this._constant.ihlAccountErrModal = false;
    this.authService.publish('showSSOAlternativeEmailSection');
  }

  navigateToLogin() {
    this.dialogRef.close();
    this._constant.isConvertSSoToIHLSuccessModal = false;
    this.authService.publish('resetLoginPage');
  }

  closeIhlAccountNotExistModal() {
    this.dialogRef.close();
    this._constant.ihlAccountNotExistModal = false;
  }

  reLoginRequest(userEmail){ // logout
    //let userID = "teste"
    if(userEmail == null){
      userEmail = this._constant.changePasswordData['email'];
    }
    this.authServiceLogin.logOut(userEmail).subscribe((data) => {
      if(data == "all sessions cleared" || data == "portal sessions cleared" || data == "no active sessions"){
        // console.log(data);
        this._constant.sessionActiveLogout = false;
        this.dialogRef.close();
        this.teleConsultCrossbarService.closeConnection();
        delete  this._teleConsultService.nativeWindow.CRISP_TOKEN_ID;
        this._teleConsultService.nativeWindow.$crisp.push(["do", "session:reset"]);
        this.authService.globalVariableReset();
        setTimeout(() => {
          localStorage.clear();
          this.authService.LastCheckin = [];
          this.router.navigate(['/']);
       },1000 * 10);
      }
    })
  }

  sendOTP(event: any){
    if(this.mobileOtp != '' && this.eMailOtp != ''){
      this.otpMissing = true;
      const regOTP = {
        eMailOtp: this.eMailOtp,
        mobileOtp: this.mobileOtp
      }
      // console.log(regOTP);
      this._constant.regMailMobileOTP = regOTP;
      this.authServiceLogin.publish('mailMobile-OTP');
      this._constant.otpValidReg = false;
      this.dialogRef.close();
    }else{
      this.otpMissing = false;
    }
    // event.preventDefault();
  }
  sendMobOTP(event: any){
    if(this.mobileOtp != ''){
      this.otpMissing = true;
      const regOTP = {
        eMailOtp: "",
        mobileOtp: this.mobileOtp
      }
      // console.log(regOTP);
      this._constant.regMailMobileOTP = regOTP;
      // this.authServiceLogin.publish('mobile-OTP');
      this._constant.otpValidProfile = false;
      this.dialogRef.close();
    }else{
      this.otpMissing = false;
    }
    // event.preventDefault();
  }

  onEmailOtpChange(otp) {
    if (otp.length == 6)
      this.eMailOtp = otp;
    else
      this.eMailOtp = '';
  }

  onMobileOtpChange(otp) {
    if (otp.length == 6)
      this.mobileOtp = otp;
    else
      this.mobileOtp = '';
  }

  
  closeModalMobileOTP() {
    this._constant.otpValidProfile = false;
    this.dialogRef.close();
  }

  closeModalOTP() {
    this._constant.otpValidReg = false;
    this.dialogRef.close();
  }

  changeNP(newPwd) {
    this.newPwd = newPwd.value;
    //console.log(this.newPwd)

    if (this.newPwd != "") {
      if(this.newPwd.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/)){
        newPwd.required = false;
      }else{
        newPwd.required = true;
      }
    }else{
      newPwd.required = false;
    }

  }
  changeCP(confPwd) {
    this.confPwd = confPwd.value;
    //console.log(this.confPwd)

    if(this.confPwd != ""){
      if(this.confPwd === this.newPwd){
        confPwd.required = false;
      }else{
        confPwd.required = true;
      }
    }else{
      confPwd.required = false;
    }
  }

  onClickPasswordChange(newPass,confirmPwd) {
    this.oldPwd = this._constant.changePasswordData['oldPwd'];
    this.newPwd = newPass.value;
    this.confPwd = confirmPwd.value;
    var apiKey = localStorage.getItem('apiKey');
    var IHLUserToken = localStorage.getItem('api_header_token');
      // console.log(this.newPwd);
      // console.log(this.confPwd);
    if(this.newPwd != undefined && this.confPwd != undefined) {
      if(this.newPwd.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/)){
            if(this.confPwd.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/)){
                if((this.newPwd).length > 5 && (this.confPwd).length > 5){
                  // console.log(this.newPwd);
                  // console.log(this.confPwd);
                    if(this.newPwd === this.confPwd) {
                        this.isloading = true;
                        this.nt_loading = false;
                        confirmPwd.required = false;
                        this.wrongpassforchange =false;

                        var jsontext = '{"password":"' + this._constant.aesEncryptionForVAPT(this.newPwd) + '","email":"' + this._constant.changePasswordData['email'] + '","oldPassword":"' + this._constant.aesEncryptionForVAPT(this.oldPwd) + '"}';
                        console.log(jsontext);
                        //setTimeout(() => {
                          this.authService.postNewPasswordInput(apiKey,IHLUserToken,jsontext).subscribe((data: any) =>{
                          console.log(data);
                          data = data.replace(/"/g, "");
                          // console.log(data);
                          if(data == 'success' || data == 'fail'){
                            this.reLoginRequest(this._constant.changePasswordData['email']);
                            this.isloading = false;
                            this.nt_loading = true;
                            this.snackBar.open("Your password has been changed successfully! Your account will LOGOUT with in 10 seconds. Please LOGIN again", '',{
                            duration: 10000,
                            panelClass: ['success'],
                            });

                          this._constant.changePasswordModel = false;
                          this.dialog.closeAll();
                          }else if(data=="wrong old password"){
                          this.wrongpassforchange =true;
                          this.isloading = false;
                          this.nt_loading = true;
                          this.snackBar.open("Your old password is Incorrect", '',{
                            duration: 5000,
                            panelClass: ['error'],
                          });
                          }
                        },error => {
                          this.isloading = false;
                            this.nt_loading = true;
                          this.snackBar.open("Could not connect to the server.Please try after sometime.", '',{
                          duration: 5000,
                          panelClass: ['error'],
                          });
                      });
                      //},1000);
                        }else{
                          if(confirmPwd.required == false){
                              this.snackBar.open("Your New entered password format is invalid!", '',{
                              duration: 5000,
                              panelClass: ['error'],
                            });
                          } else {
                            this.snackBar.open("Password mismatched!", '',{
                              duration: 5000,
                              panelClass: ['error'],
                            });
                          }
                        }
                  }else{
                    this.snackBar.open("Password field should be atleast 6 character!", '',{
                        duration: 5000,
                        panelClass: ['error'],
                    });
                  }
              }else{
                this.snackBar.open("Password format invalid!", '',{
                  duration: 5000,
                  panelClass: ['error'],
                });
                }
          }else{
            this.snackBar.open("Password format invalid!", '',{
              duration: 5000,
              panelClass: ['error'],
            });
            }
    } else{

    }
  }
}
