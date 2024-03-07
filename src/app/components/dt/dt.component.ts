import { Component, ViewChild, OnInit, OnDestroy, HostListener,ElementRef, ViewChildren } from '@angular/core';
import { CommonModule, DatePipe } from "@angular/common";
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service'
import { AuthServiceLogin } from '../../services/auth.service.login'
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
// import { DataTableDirective } from 'angular-datatables';
import {ActivatedRoute} from "@angular/router";
import {MatSnackBar} from '@angular/material/snack-bar';
import { MatRadioButton, MatRadioChange } from '@angular/material/radio';
import {MatMenuModule} from '@angular/material/menu';
import {MatMenuTrigger}from '@angular/material/menu';
import {MatSelectModule, MatSelectChange} from '@angular/material/select';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConstantsService } from 'src/app/services/constants.service';
import { EventEmitterService } from 'src/app/services/event-emitter.service';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxImageCompressService } from 'ngx-image-compress';
import { ModalComponent } from '../modal/modal.component';

import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FormGroup, FormControl, NgForm } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
// import { format } from 'util';
import { UniqueEmailValidatorDirective } from 'src/app/directive/unique-email-validator.directive';

@Component({
  selector: 'app-dt',
  templateUrl: './dt.component.html',
  styleUrls: ['./dt.component.css']
})
export class DtComponent implements OnInit , OnDestroy{
  public affiliated_data_table:string[] = ['affilate_name','affilate_delete'];
  public hasError = false;
  public editprofileinProgress = false;
  public editpasswrdinProgress = false;
  public inProgress = false;
  public passforDelete = false;
  public wrongpassforDelete = false;
  public wrongpassforchange = false;
  public unit:string = 'CMs';
  public imgLoading: boolean = false;
  
  changeUnit(unit) {
    this.unit = unit.value;
    console.log(this.unit);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if(window.innerWidth < 501)
    {
      this.showSideNav = true
      this.showHeaderSideMenu = false
    }
    else{
      this.showHeaderSideMenu = true
      this.showSideNav = false
    }
  }
  @ViewChildren(UniqueEmailValidatorDirective) uniqueEV:UniqueEmailValidatorDirective;
  // @ViewChild(DataTableDirective)
  // datatableElement: DataTableDirective;
  @ViewChild(MatMenuTrigger)
  trigger: MatMenuTrigger;
  @ViewChild('passwordBox')
  public createpasswordBox: NgForm;
  //@ViewChild('user_cms_edit') user_cms_edit: ElementRef;
  proimg: string;
  //@ViewChild('user_cms_edit') user_feet_edit: ElementRef;
  health = []
  dtOptions: any = {};
  dtTrigger = new Subject<any>();
  showSideNav = false
  showHeaderSideMenu = false
  userScore: any
  oldPwd:any
  newPwd:any
  confPwd:any
  userid:any
  firstname:any
  vaptEnabled = this._constant.vaptEnabled;
  mobileTxNo : string;
  mobileExistResponse: string;
  fn:any
  ln:any
  lastname:any
  mobile: any;
  mobilenum: any;
  email: any;
  mail: any;
  jointEmail: any;
  jmail: any;
  jointMobileNumber: any;
  jmobile: any;
  dob:any;
  birthday:any;
  newbirthDate:any
  formattedDOB:any
  gender:any
  height:any
  currentHeight:any
  heightValid:boolean =true;
  heightinmtrs:any
  heightCentimeter:any
  heightCm: any
  heightFeet:any
  radioBtSelectedValue:any
  selectedGender:any
  selectedAffiliation:any
  affiliate:any
  genderHint:boolean = false;
  editProCard:boolean = true;
  delProCard: boolean = false;
  delAcc: boolean = true;
  Rbutton: boolean =true;
  isEnabled:boolean = true;
  loading:boolean = false;
  nt_loading:boolean = true;
  EdtPro_nt_loading:boolean = true;
  EdtPro_loading:boolean = false;
  delPro_nt_loading:boolean = true;
  delPro_loading:boolean = false;
  show_affiliation_del_ui:boolean = false;
  showEmailBox:boolean = false;
  showJAccEmailBox:boolean = false;
  showJAccMobileBox:boolean = false;
  showMobileBox:boolean = false;
  disableJointBtn:boolean = false;
  disableUnlinkBtn:boolean = false;
  disableMenuBtn:boolean = false;
  disableDeleteAccountBtn:boolean = false;
  //basicInfoNeed:boolean = false;
  surveyComplete:boolean = false;
  throwMobileError = "*Invalid Mobile Number";
  userDataList: any = this._constant.aesDecryption("userData");
  dobForm : FormGroup;
  changePasswordSection: boolean = false;
  startDate = new Date(1990, 0, 1);
  //thirthteenyearsago:any
  pageloading = true;
  weightInputShow = false;
  weightCheckins: any;
  aadhaar:any;
  updatedWeight: any;
  userInputWeight:any;
  userDOBdt:any;
  subscription: any;
  imageType: any;
  compressedImg: any;
  //isDisable:boolean = true;
  retrievedLoginType: any;

  constructor(
    private datepipe:DatePipe,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    public _constant: ConstantsService,
    private eventEmitterService: EventEmitterService,
    private authServiceLogin: AuthServiceLogin,
    private router: Router,
    private httpClient: HttpClient,
    private sanitizer: DomSanitizer,
    private imageCompress: NgxImageCompressService) {

    userDob: new FormControl()
    /* this.authService.fetchUser(this.authService.getUser()).subscribe(data => {
      (data["user"]["healthData"]).forEach(element => {
        const vitals = element["vitals"]
        this.health.push({
          bloodType: vitals["bloodType"],
          age: vitals["age"],
          weight: vitals["weight"],
          height: vitals["height"],
          bmi: vitals["bmi"],
          flightsClimbed: vitals["flightsClimbed"],
          steps: vitals["steps"],
          fatRatio: vitals["fatRatio"],
          heartRate: vitals["heartRate"],
        })
      });
      this.dtTrigger.next()
    }) */
  }


  ngOnInit(): void {

    this.subscription = this.authServiceLogin.on('basic-info-update').subscribe(() => this.basicInfoUpdate());

    if(window.innerWidth < 501)
    {
      this.showSideNav = true
      this.showHeaderSideMenu = false
    }
    else{
      this.showHeaderSideMenu = true
      this.showSideNav = false
    }

    var AllUserData = JSON.parse(this.userDataList);

    if(AllUserData != undefined){

      this.pageloading = false;

      //this.userScore = AllUserData.higiScore;
      this.userid = AllUserData.id;
      this.firstname = AllUserData.firstName;
      this.fn = this.firstname;
      this.lastname = AllUserData.lastName;
      this.ln = this.lastname;
      this.email = AllUserData.email;
      this.mail = this.email;
      this.mobile = AllUserData.mobileNumber;
      this.mobilenum = this.mobile;
      this.jointEmail = AllUserData.email;
      this.jmail = this.jointEmail;
      this.jointMobileNumber = AllUserData.mobileNumber == undefined ? "" : AllUserData.mobileNumber;
      this.jmobile = this.jointMobileNumber;
      this.dob = AllUserData.dateOfBirth;
      this.birthday = this.dob;
      this.gender = AllUserData.gender;
      this.heightinmtrs = AllUserData.heightMeters;
      this.affiliate = AllUserData.affiliate;
      this.userInputWeight = AllUserData.userInputWeightInKG;
      this.heightCentimeter = (this.heightinmtrs * 100).toFixed();
      this.heightCm = this.heightCentimeter;
      this.height = this.heightCentimeter;
      this.heightFeet = (this.heightinmtrs / 0.3048).toFixed(2)

      this._constant.userFirstName = this.firstname;
      this._constant.userLastName = this.lastname;
      this._constant.userGender = this.gender;
      this._constant.userProfilePic = AllUserData.photo;
      console.log(this._constant.userProfilePic);
      this._constant.userProfilePic = AllUserData.photo;
      this._constant.userProfilePicType = "image/" + AllUserData.photofmt; // {image/jpg}

      if(this._constant.affiliatedCompanies.length == 0) {
        let affiliate_data = JSON.parse(this.userDataList);
        if(affiliate_data['user_affiliate'] != null) {
          for(const property in affiliate_data['user_affiliate']) {
            if(affiliate_data['user_affiliate'][property] != null) {
              this._constant.affiliatedCompanies.push(affiliate_data['user_affiliate'][property]);
            }
          }
        }
        this._constant.affiliatedCompanies = this._constant.affiliatedCompanies.filter(company => {
          if(company['affilate_name'] != "") {
            return company;
          }
        });
      }

      let userData = JSON.parse(this._constant.aesDecryption('userData'));
      if(userData.hasOwnProperty('care_taker_details_list') == false) {
        this.disableMenuBtn = true;
      }

      this.retrievedLoginType = localStorage.getItem('loginType');
      if(this.retrievedLoginType == 'onLogin') {
        this.disableDeleteAccountBtn = true;
        this.changePasswordSection = false;
      }else{
        this.disableDeleteAccountBtn = false;
        this.changePasswordSection = true;
      }

      if('joint_user_detail_list' in AllUserData && (Object.values(AllUserData['joint_user_detail_list'])).filter((item: any)=>((item.status.toLowerCase() == 'active'))).length >= 1) {
        this.disableUnlinkBtn = true;
      }

      // var vaals = Object.keys(AllUserData['joint_user_detail_list']);
      // console.log(vaals['status'] == 'active');

      // console.log("Total Active & Requested Joint users " + (Object.values(AllUserData['joint_user_detail_list'])).filter((item: any)=>((item.status.toLowerCase() == 'active'))).length + (Object.values(AllUserData['joint_user_detail_list'])).filter((item: any)=>((item.status.toLowerCase() == 'requested'))).length);

      if('joint_user_detail_list' in AllUserData && (Object.values(AllUserData['joint_user_detail_list'])).filter((item: any)=>((item.status.toLowerCase() == 'active'))).length + (Object.values(AllUserData['joint_user_detail_list'])).filter((item: any)=>((item.status.toLowerCase() == 'requested'))).length == 15) {
        this.disableJointBtn = true;
      }

      if((this._constant.userProfilePic == undefined)||(this._constant.userProfilePic == null)){

          if(this.gender == "m" || this.gender == "male"){
            this.cardImageBase64 = "assets/img/avatar-male.png"
          }
          else{
            this.cardImageBase64 = "assets/img/avatar-female.png"
          }

        /*this.authService.getIhlProfilePhoto(this.userid).subscribe((baseImage:any)=>{
          console.log(baseImage);
        })
        */
      }
      else{
        this.cardImageBase64 = "data:image/" + AllUserData.photofmt + ";base64," + AllUserData.photo;
      }

      if (this._constant.changedAffiliation == null || this._constant.changedAffiliation == undefined) {
        if(this.affiliate == undefined || this.affiliate == "" || this.affiliate == null){
          this.affiliate = "None";
        }

        if(this.affiliate == "dimension" || this.affiliate == "Dimension"){
          this.affiliate = 'dimension';
        }
      }else if (this._constant.changedAffiliation !== null && this._constant.changedAffiliation !== undefined) {
        if(this._constant.changedAffiliation == undefined || this._constant.changedAffiliation == "" || this._constant.changedAffiliation == null){
          this.affiliate = "None";
        }

        if(this._constant.changedAffiliation == "dimension" || this._constant.changedAffiliation == "Dimension"){
          this.affiliate = 'dimension';
        }
      }


      if(this.dob == undefined || this.dob == "" || this.dob == null){
        var dateFormat1 = "" ;
        this.formattedDOB = dateFormat1[0]+"/"+dateFormat1[1]+"/"+dateFormat1[2];
        this.userDOBdt = new Date(this.formattedDOB.replace( /(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3"))
      }else{
        var dateFormat = this.dob.split('/') ;
        this.formattedDOB = dateFormat[0]+"/"+dateFormat[1]+"/"+dateFormat[2];
        this.userDOBdt = new Date(this.formattedDOB.replace( /(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3"))

      }

      //var validDate = new Date((new Date().getTime() - (365 * 13 * 24 * 60 * 60 * 1000)));
      //this.thirthteenyearsago =  validDate.toLocaleDateString();
      //console.log(this.thirthteenyearsago)

      this.dobForm = new FormGroup({
        userDob:new FormControl(this.userDOBdt),
        userHeight:new FormControl(this.heightCentimeter),
      })

      if(this.gender == "male" || this.gender == "m"){
        this.gender = 'm';
      }else if(this.gender == "female" || this.gender == "f"){
        this.gender = "f";
      }
      this.gender = AllUserData.gender;
      this.heightinmtrs = AllUserData.heightMeters;
    }

    if(this.email == ""){
      this.showEmailBox = false;
      this.showMobileBox = true;
    }else if(this.email != ""){
      this.showEmailBox = true;
      this.showMobileBox = false;
    }

    if(this.jmail == ""){
      this.showJAccEmailBox = false;
      // this.showJAccMobileBox = true;
    }else if(this.jmail != "") {
      this.showJAccMobileBox = false;
      this.showJAccEmailBox = true;
    }

    // if(this.userData.hasOwnProperty('care_taker_details_list') == true) {
    //   if(this.email == ""){
    //     this.showEmailBox = false;
    //     this.showMobileBox = true;
    //   }else if(this.email != ""){
    //     this.showEmailBox = true;
    //     this.showMobileBox = false;
    //   }
    // }

    var AllLastCheckinData = [];
    AllLastCheckinData = this.authService.LastCheckin;
    console.log(AllLastCheckinData);

    if(AllLastCheckinData.length > 0){
      for(var i = 0; i < AllLastCheckinData.length; i++){
         if(AllLastCheckinData[i].name == "weightKG"){
           if(AllLastCheckinData[i].val == "-"){
            this.weightInputShow = true;
            this.weightCheckins = this.userInputWeight;
           }
         }
      }
    } else if(AllLastCheckinData.length == 0){
      this.weightInputShow = true;
      this.weightCheckins = this.userInputWeight;
    }

    /* console.log(this.userid);
    console.log(this.firstname);
    console.log(this.lastname);
    console.log(this.email);
    console.log(this.mobile);
    console.log(this.dob);
    console.log(this.gender);
    console.log(this.heightinmtrs);
    console.log(this.heightCentimeter);
    console.log(this.heightFeet);
    console.log(this.affiliate);
    console.log(this.weightCheckins);
    console.log(this.userInputWeight); */


    this.surveyComplete = false;

    if(this._constant.basicInfoNeed == true){
      //this.basicInfoNeed = true;
      this._constant.dashboardBmiCalculDone = false;
      setTimeout(() => {
        //this.basicInfoNeed = false;
        this.snackBar.open("Please enter the basic info ", '',{
          duration: 1000 * 10,
          panelClass: ['error'],
        });
     },1000 * 1);
    }
    console.log(this);

    let scoreFetch = this.authServiceLogin.scoreFetch();
  /* this.userScore = scoreFetch.score;
  this.surveyComplete = scoreFetch.questionComptionStatus; */
  if(this._constant.takeSurveyScore != null){
    this.userScore = this._constant.takeSurveyScore;
    this.surveyComplete =  this._constant.takeSurveyScoreShow;
  } else {
    this.userScore = scoreFetch.score;
    this.surveyComplete = scoreFetch.questionComptionStatus;
  }

    this.dtOptions = {
      "pagingType": "full_numbers",
      "language": {
        "emptyTable": "No health data, yet!"
      },
      "order": [[ 0, 'desc' ], [ 1, 'asc' ]],
      dom: 'Bfrtip',
      // Configure the buttons
      buttons: [
        'columnsToggle',
        'colvis',
        'copy',
        'print',
        'excel'
      ]
    };

    let userData = JSON.parse(this.userDataList)
    if(userData['joint_user_detail_list'] != undefined && userData['joint_user_detail_list']!=null && Object.values(userData.joint_user_detail_list).filter((item:any)=>(item.status.toLowerCase() == 'requested'))){
      //console.log(Object.values(userData['joint_user_detail_list']).filter((item:any)=>(item.status.toLowerCase() == 'requested')));
      this._constant.requestedlistAccount = true;
    }
    // else{    //uncomment when switched jointaccount user have menu for enable caretaker account list
    //   if(userData['care_taker_detail_list']!= undefined && userData['care_taker_detail_list']!=null && Object.values(userData.care_taker_detail_list).filter((item:any)=>(item.is_joint_account == true))){
    //     this._constant.caretakerlistAccount = true;
    //   }
    // }
  }

  basicInfoUpdate(){
    var AllUserData = JSON.parse(this.userDataList);
    this.fn = this.firstname;
    this.ln = this.lastname;
    this.mobilenum = this.mobile;
    this.mail = this.email;
    this.jmail = this.jointEmail;
    this.jmobile = this.jointMobileNumber;
    this.birthday = this.dob;
    this.heightCm = this.heightCentimeter;
    this.gender = this._constant.userGender;
    if(this._constant.userProfilePic == null)
    {
      if(this.gender == "m" || this.gender == "male"){
        this.cardImageBase64 = "assets/img/avatar-male.png"
      }
      else{
        this.cardImageBase64 = "assets/img/avatar-female.png"
      }
    }

  }

  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    //alert(`${type}: ${event.value}`);
    this.newbirthDate = event.value.toLocaleDateString();
    console.log(this.newbirthDate);
  }

  scoreUpdate(){
    this.userScore = this._constant.takeSurveyScore;
    this.surveyComplete =  this._constant.takeSurveyScoreShow;
  } updatedHeight(hght){
    if(this.radioBtSelectedValue == "cm"){
    this.heightCentimeter = hght.value;
    }

    if(this.radioBtSelectedValue == "ft"){
    this.heightFeet = hght.value;
    }
  }

  redirectToSurvey(){
    this.router.navigate(['takesurvey']);
  }

  GenonChange(mrChange: MatRadioChange) {
    console.log(mrChange.value);

      this.selectedGender = mrChange.value;
      console.log("selectedGender  "  + this.selectedGender);

  }

  AffonChange(msChange:MatSelectChange){
    console.log(msChange.value);

      this.selectedAffiliation = msChange.value;
      console.log("selectedAFFiliation  "  + this.selectedAffiliation);
  }



  imageError: string;
    isImageSaved: boolean;
    cardImageBase64: any ;

    private base64textString:String="";
    private imgType = "";
    private imgBase64Path:any;

  profileChangeEvent(fileInput: any) {
    if(this._constant.ihlDemouserID != this.userid) {

    //this.isDisable  = false;
    this.imageError = null;
    if (fileInput.target.files && fileInput.target.files[0]) {
        // Size Filter Bytes
        this.imgType = fileInput.target.files[0].type;
        if (fileInput.target.files[0]) {
          let reader = new FileReader();
          //let max_size = 3097152;
          let max_size = 2000000;
          if (fileInput.target.files[0].size >= max_size) {

            this.snackBar.open("Image file size is greater than 1.5 MB. Unable to upload!", '',{
              duration: 1000 * 10,
              panelClass: ['error'],
            });



            /* reader.onload = (e:any)=>{
              this.imgLoading = true;
              const image = new Image();
              image.src = e.target.result;
              image.onload = (rs: any) => {
                  // First time compression, if size again greater than 3MB then again compress, if again then show message to user
                  const imgBase64Path = e.target.result;

                  this.imageCompress.compressFile(imgBase64Path, null, 50, 50).then(
                    result => {

                      this.compressedImg = result;

                        if(this.imageCompress.byteCount(result) > 3097152){
                            this.imgLoading = false;
                            this.snackBar.open("Image size is too large. Image size should be less than 3MB", '',{
                              duration: 10000,
                              panelClass: ['error'],
                            });
                            return;
                          }
                        else{
                        this.base64textString = result.split(',')[1];
                        this.profilePhotoEdit();
                        console.log(this.base64textString);
                      }
                    }
                  );
              };
            };*/
            console.log(fileInput.target.files[0].size);
            reader.readAsDataURL(fileInput.target.files[0]);
          } else {
            if (this.vaptEnabled) {
              let fileFormat = (fileInput.target.files[0].name.substr(fileInput.target.files[0].name.lastIndexOf('.')).split(".")[1]).toLowerCase();
              let imageFormat = ['JPEG', 'jpeg', 'JPG', 'jpg', 'PNG', 'png' ];
              if (imageFormat.includes(fileFormat)) {
                reader.onload =this._handleReaderLoaded.bind(this);
                reader.readAsBinaryString(fileInput.target.files[0]);
              } else {
                this.snackBar.open("Please select JPEG or PNG image file", '',{
                  duration: 6000,
                  panelClass: ['error'],
                });
              }
            } else {
              reader.onload =this._handleReaderLoaded.bind(this);
              reader.readAsBinaryString(fileInput.target.files[0]);
            }
          }
      }
        /* const max_size = 3097152; // below 3MB only allowed for image upload.
        const allowed_types = ['image/png', 'image/jpg', 'image/gif', 'image/jpeg'];
        const max_height = 15200;
        const max_width = 25600;
        this.imageType = fileInput.target.files[0].type;
        console.log(this.imageType);
        if (fileInput.target.files[0].size > max_size) {
            this.imageError =
                'Maximum size allowed is ' + max_size / 1000 + 'Mb';

            return false;
        }
        console.log(fileInput.target.files[0]);

        const reader = new FileReader();
        reader.onload = (e: any) => {
            const image = new Image();
            image.src = e.target.result;
            image.onload = (rs: any) => {
                const img_height = rs.currentTarget['height'];
                const img_width = rs.currentTarget['width'];

                console.log(img_height, img_width);


                if (img_height > max_height && img_width > max_width) {
                    this.imageError =
                        'Maximum dimentions allowed ' +
                        max_height +
                        '*' +
                        max_width +
                        'px';
                    return false;
                } else {
                    const imgBase64Path = e.target.result;
                      // Compressing the file
                     console.log("Size of image before compression is: ",this.imageCompress.byteCount(imgBase64Path)/(1024*1024)," MB");
                      this.imageCompress.compressFile(imgBase64Path, null, 50, 50).then(
                        result => {
                          this.compressedImg = result;
                          console.log("Size of image after compression is: ",this.imageCompress.byteCount(result)/(1024*1024)," MB");
                        }
                      );
                      console.log(this.compressedImg);
                      var allUserData = JSON.parse(this.userDataList);
                      console.log(allUserData);
                      //allUserData.push({ photo : this.compressedImg});
                      //allUserData = Object.assign(allUserData, {photo : this.compressedImg});
                      console.log(allUserData);
                      allUserData["photo"] = this.compressedImg;
                      allUserData['photofmt'] = this.imageType.split("/").pop();
                      localStorage.setItem('userData',JSON.stringify(allUserData));
                      this.cardImageBase64 = this.compressedImg;
                      this.isImageSaved = true;
                      this._constant.userProfilePic = this.cardImageBase64;
                      this._constant.userProfilePicType = this.imageType;
                      this.authServiceLogin.publish('profile-photo-update');
                    // this.previewImagePath = imgBase64Path;
                }
            };
        };

        reader.readAsDataURL(fileInput.target.files[0]); */
    }
    }else{
    this.snackBar.open("This scope has not been given to demo user account due to some management reason!", '',{
      duration: 6000,
     panelClass: ['success'],
  });
  }
   // this.profilePhotoEdit();
  }

  _handleReaderLoaded(readerEvt) {
      console.log(readerEvt);
      var binaryString = readerEvt.target.result;
      this.base64textString= btoa(binaryString);
      this.profilePhotoEdit();
      console.log("btoa")
      console.log(this.base64textString)
   }

   countDecimals(ft) {
    if(Math.floor(ft)==ft) return 0;
    return ft.toString().split(".")[1].length || 0;
  }

  heightonChange(mrChange: MatRadioChange) {
    console.log(mrChange.value);
    if(mrChange.value == undefined){
      mrChange.value = this.heightCentimeter;
    }
    this.radioBtSelectedValue = mrChange.value;

    if(this.radioBtSelectedValue == "cm"){
    if(this.heightFeet != "" || this.heightFeet != 0){
        if(this.heightFeet >= 3.0 && this.heightFeet <= 8.2){
            //this.heightCentimeter = (this.heightFeet * 30.48).toFixed(0);
                                if(this.heightFeet.toString().split(".")[1]>11) {
                                this.snackBar.open("your height input is invalid!", '',{
                                    duration: 5000,
                                    panelClass: ['error'],
                                });
                                this.heightValid = false;
                                this.height = 0;
                                }
                                else {
                                    if(this.countDecimals(this.heightFeet)==1) {
                                      var inch = this.heightFeet%Math.floor(this.heightFeet);
                                      var actualInch = inch*10;
                                      var equivalentCm = actualInch*2.54;
                                      this.heightCentimeter = Math.floor(this.heightFeet)/0.032808 + equivalentCm;
                                }
                                else {
                                var inch = this.heightFeet%Math.floor(this.heightFeet);
                                if(inch <= 0.099) {
                                    var actualInch = inch;
                                }
                                else {
                                    var actualInch = inch*100;
                                }
                                    var equivalentCm = actualInch*2.54;
                                    this.heightCentimeter = Math.floor(this.heightFeet)/0.032808 + equivalentCm;
                                }
                                  this.heightValid = true;
                                  this.height = this.heightCentimeter.toFixed(0);
                                }
        } else {
              this.snackBar.open("your height input is invalid!", '',{
                duration: 5000,
                panelClass: ['error'],
              });

            this.heightValid = false;
            this.height = 0;
        }
    } else {
        this.heightCentimeter = this.heightinmtrs * 100;
        this.heightFeet = (this.heightinmtrs / 0.3048).toFixed(1);
        this.heightValid = true;
        this.height = this.heightCentimeter;
    }

    }else if(this.radioBtSelectedValue == "ft"){
     if(this.heightCentimeter != "" || this.heightCentimeter != 0){
        if(this.heightCentimeter >= 90 && this.heightCentimeter <= 250){
            //this.heightFeet = (this.heightCentimeter / 30.48).toFixed(1);
                                var inches = this.heightCentimeter/2.54;
                                var feet = inches/12;
                                var finalFtVal = Math.floor(feet);
                                var balanceInchVal = inches%12;
                                if(balanceInchVal < 9) {
                                    if(balanceInchVal >= 1 && balanceInchVal < 2) {
                                        var finalInchVal = 0.1
                                    }
                                  else {
                                        var finalInchVal = balanceInchVal/10;
                                    }
                                    var fixedFtInch = finalFtVal+finalInchVal;
                                    this.heightFeet = fixedFtInch.toFixed(1);
                               }
                               else if(balanceInchVal >= 9 && balanceInchVal <= 11) {
                                    if(balanceInchVal >= 9 && balanceInchVal < 10) {
                                        var finalInchVal = 0.10;
                                    }
                                    else {
                                        var finalInchVal = balanceInchVal/100;
                                    }
                                    var fixedFtInch = finalFtVal+finalInchVal;
                                    this.heightFeet = fixedFtInch.toFixed(2);
                               }
                                else {
                                    var finalInchVal = 1;
                                    this.heightFeet = finalFtVal+finalInchVal;
                                }
            this.heightValid = true;
            this.height = this.heightFeet;
        } else {
              this.snackBar.open("your height input is invalid!", '',{
                duration: 5000,
                panelClass: ['error'],
              });

            this.heightValid = false;
            this.height = 0;
        }
    } else {
        this.heightCentimeter = this.heightinmtrs * 100;
        this.heightFeet = (this.heightinmtrs / 0.3048).toFixed(1);
        this.heightValid = true;
        this.height = this.heightFeet;
    }

    }
  }

  ngOnDestroy() {
    this.dtTrigger.unsubscribe();
  }

  unLinkJointAccountDialog(): void {
    // this.unLinkUserDetail = detail;
    this._constant.unlinkJointAccountPopUp = true;
    this.dialog.open(ModalComponent);
  }

  ShowDeleteProfile(){
    if (this._constant.ihlDemouserID != this.userid) {
      this.delProCard =true
      this.editProCard = false
      this.show_affiliation_del_ui = false;
    } else {
      this.snackBar.open("This scope has not been given to demo user account due to some management reason!", '',{
        duration: 5000,
       panelClass: ['success'],
      });
    }
  }

  showDeleteAffiliation() {
    if (this._constant.ihlDemouserID != this.userid) {
      this.delProCard = false;
      this.editProCard = false;
      this.show_affiliation_del_ui = true;
    }
    else {
      this.snackBar.open("This scope has not been given to demo user account due to some management reason!", '',{
        duration: 5000,
       panelClass: ['success'],
      });
    }
  }

  ShowEditProfile(){
    this.delProCard =false
    this.editProCard = true
    this.show_affiliation_del_ui = false;
  }

  openDeleteAffiliationModal(affilate_unique_name, affilate_company_name) {
    this._constant.affilate_unique_name = affilate_unique_name;
    this._constant.affilate_company_name = affilate_company_name;
    this._constant.showAffDeleteModal = true;
    this.dialog.open(ModalComponent);
  }

  onClickDeleteProfile(pass){
    console.log(pass.value)
    var pwdForDel = pass.value;
    var emailforDel = this.email;
    if(this.email == ""){
      emailforDel = this.mobile;
    }

    var apiKey = localStorage.getItem('apiKey')
    var IHLUserToken = localStorage.getItem('id_token')
    var IHLUserId = this.userid;


    if((pwdForDel).length > 0){
      if((pwdForDel).length > 5){
        this.passforDelete = false;
        this.delPro_nt_loading = false;
        this.delPro_loading= true;

        //var jsontext = '{"password":"' + pwdForDel + '"}';

        setTimeout(() => {
           this.authService.deleteProfieInput(apiKey,IHLUserToken,IHLUserId,emailforDel,pwdForDel).subscribe((data: any) =>{
            console.log(data);
            if(data == 'deleted'){
                this.delPro_nt_loading = true;
                this.delPro_loading = false;
                window.location.href = "../index.html";
                localStorage.clear();
            }else if(data=="wrong old password"){
                this.wrongpassforDelete =true;
                this.delPro_loading = false;
                this.delPro_nt_loading = true;
                this.snackBar.open("Your password is Incorrect", '',{
                duration: 5000,
                panelClass: ['error'],
              });
             }
          },(error: Response) => {
            console.log(error);
            console.log(error.status);
            if (error.status == 417) {
              this.delPro_nt_loading = true;
              this.delPro_loading = false;
              window.location.href = "../index.html";
              localStorage.clear();
            }else{
              this.delPro_loading = false;
              this.delPro_nt_loading = true;
              this.snackBar.open("Could not connect to the server.Please try after sometime.", '',{
              duration: 5000,
              panelClass: ['error'],
              });
            }

          });
        },1000);

     }else{
          this.passforDelete = true;
          this.snackBar.open("Password field should be atleast 6 character!", '',{
          duration: 5000,
          panelClass: ['error'],
          });
        }
     }else{
          this.passforDelete = true;
          this.snackBar.open("Password field cannot be empty!!", '',{
          duration: 5000,
          panelClass: ['error'],
          });
        }


  }

  changeOP(oldPwd){
    this.oldPwd = oldPwd.value;
    //console.log(this.oldPwd)

    if(this.oldPwd != ""){
      if(this.oldPwd.length >= 6){
        oldPwd.required = false;
      }else
      {
      oldPwd.required = true;
    }
  }
  }

  changeNP(newPwd){
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
  changeCP(confPwd){
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

  profilePhotoEdit(){
    this.imgLoading = true;
    var apiKey = localStorage.getItem('apiKey');
    var IHLUserToken = localStorage.getItem('id_token');
    var IHLUserId = this.userid;
    //var base64 = btoa(this.cardImageBase64);
    var jsontext = {"photo_data":this.base64textString };

    this.authService.postEditProfilePic(apiKey, IHLUserToken, IHLUserId, jsontext).subscribe((data: any) =>{
      //console.log(data);
      this.imgLoading = false;
      //this.isDisable  = true;
      let allUserData = JSON.parse(this.userDataList);
      allUserData["photo"] = this.base64textString;
      this._constant.userProfilePic = this.base64textString;
      this._constant.userProfilePicType = this.imgType;
      localStorage.setItem('userData', this._constant.aesEncryption(JSON.stringify(allUserData)));
      // localStorage.setItem('userData', JSON.stringify(allUserData));
      this.authServiceLogin.publish('profile-photo-update');
      this.cardImageBase64 = "data:" + this.imgType + ";base64," + this.base64textString;
      this._constant.userProfileData.photo = this._constant.userProfilePic;
    });
  }

  onClickPasswordChange(oldPwd,newPwd,confPwd){
    if (this._constant.ihlDemouserID != this.userid) {
      var apiKey = localStorage.getItem('apiKey');
      var IHLUserToken = localStorage.getItem('id_token');
      if(this.newPwd != undefined && this.confPwd != undefined) {
        if(this.newPwd.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/)){
              if(this.confPwd.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/)){
                  if((this.newPwd).length > 5 && (this.confPwd).length > 5){
                      if(this.newPwd === this.confPwd) {
                          this.loading = true;
                          this.nt_loading = false;
                          confPwd.required = false;
                          this.wrongpassforchange =false;

                          var jsontext = '{"password":"' + this.newPwd + '","email":"' + this.email + '","oldPassword":"' + this.oldPwd + '"}';

                          setTimeout(() => {
                            this.authService.postNewPasswordInput(apiKey,IHLUserToken,jsontext).subscribe((data: any) =>{
                            console.log(data);
                            data = data.replace(/"/g, "");
                            console.log(data);
                            if(data == 'success' || data == 'fail'){
                              oldPwd.value = '';
                              newPwd.value = '';
                              confPwd.value = '';
                              this.logout();
                              this.loading = false;
                              this.nt_loading = true;
                              this.snackBar.open("Your password has been changed successfully! Your account will LOGOUT with in 10 seconds. Please LOGIN again", '',{
                              duration: 10000, 
                              panelClass: ['success'],
                              });
                            }else if(data=="wrong old password"){
                            this.wrongpassforchange =true;
                            this.loading = false;
                            this.nt_loading = true;
                            this.snackBar.open("Your old password is Incorrect", '',{
                              duration: 5000,
                              panelClass: ['error'],
                            });
                            }
                          },error => {
                            this.loading = false;
                              this.nt_loading = true;
                            this.snackBar.open("Could not connect to the server.Please try after sometime.", '',{
                            duration: 5000,
                            panelClass: ['error'],
                            });
                        });
                        },1000);
                          }else{   
                            if(confPwd.required == false){
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
    } else {
      this.snackBar.open("This scope has not been given to demo user account due to some management reason!", '',{
        duration: 5000,
       panelClass: ['success'],
      });
    }
  }

  logout(){
    this.authService.globalVariableReset();
    setTimeout(() => {       
      if(this._constant.aesDecryption("loginValue") != undefined){
      localStorage.clear();
      this.authService.LastCheckin = [];
      window.location.href="../index.html";
    } else {
      localStorage.clear();
      this.authService.LastCheckin = [];
      this.router.navigate(['/']);
      
    }
   },1000 * 10);
  }

  changeFN(fname){
    var firstName = fname.value;
    //alert(firstName)
    if(isNaN(firstName)){
    if((firstName).length >= 2){
     /// alert("matched")
      fname.required = false;
    }else{
      fname.required = true;
    }
    }else{
      fname.required = true;
    }
   }

  changeLN(lname){
    var lastName = lname.value;
   // alert(lastName)
    if(isNaN(lastName)){
    if(lastName.length >= 2){
     // alert("matched")
      lname.required = false;
    }else{
      lname.required = true;
    }
    }else{
      lname.required = true;
    }
  }

  changeMN(mobilenum){
    var mobileNumber = mobilenum.value;
   // alert(mobileNumber)
    if(!isNaN(mobileNumber)){
      if(mobileNumber.length == 10){
        //alert("matched")
        mobilenum.required = false;
      }else{
        mobilenum.required = true;
      }
    }else{
      mobilenum.required = true;
    }
    
  }


  changeEA(emailadd){
    var mailid = emailadd.value;
    //alert(mailid)
    if(mailid.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)){
      //alert("matched")
      emailadd.required = false;
    }else{
      emailadd.required = true;
      // this.email = mailid;
    }
  }

  changeJEA(jEmailAd){
    var jmailid = jEmailAd.value;
    //alert(mailid)
    if(jmailid.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)){
      alert("matched");
      alert(jmailid);
      // emailadd.required = false;
      this.jmail = jmailid;
      alert(this.jmail);
    }else{
      // emailadd.required = true;
      // this.jointEmail = jmailid;
    }
  }

  changeHght(hght){
    
    if(hght.value >= 90 && hght.value <= 250){
      hght.required= false;
    }else{
      hght.required =true;
    }
  }

  changeAadhaar(aadhaar){

    if((aadhaar.value).length == 12){
      aadhaar.required= false;
      this.aadhaar = aadhaar.value;
      console.log(this.aadhaar);
    }else{
      aadhaar.required =true;
    }
  }

  changeWght(wght){

    if(wght.value >= 20 && wght.value <= 150){
      wght.required= false;
      this.updatedWeight = wght.value;
      console.log(this.updatedWeight)
    }else{
      wght.required =true;
    }
  }

  onClickMobileCheck(fname,lname,emailadd,jEmailAd,picker,mobilenum,jMobileNum,hght){
    if(this.vaptEnabled){
      if (this._constant._isDependentUserAccount == true) {
        // var jAccEmail = (<HTMLInputElement>document.getElementById("jntMail")).value;
        // var jAccMobile = (<HTMLInputElement>document.getElementById("jntMobile")).value;
        this.onClickUpdateProfileJointUser(fname,lname,jEmailAd,picker,jMobileNum,hght);
      }else{
      var qlogMobileNum = this._constant.aesDecryption('editMobile');
      var inputBoxMobileNum = mobilenum.value;
      //alert(typeof inputBoxMobileNum);
      if(inputBoxMobileNum !== ""){
        if(inputBoxMobileNum == qlogMobileNum){
          console.log(qlogMobileNum);
          console.log(inputBoxMobileNum);
          this.onClickUpdateProfile(fname,lname,emailadd,picker,mobilenum,hght);
        }else if(inputBoxMobileNum !== qlogMobileNum){
          if(inputBoxMobileNum.length == 10){
            this.EdtPro_nt_loading = false;
            this.EdtPro_loading = true;
            console.log(qlogMobileNum);
            console.log(inputBoxMobileNum);
            var emailIsThis = "";
            var mobileIsThis = inputBoxMobileNum;
            var aadhaarIsThis = "";
            if(localStorage.getItem('apiKey') !== undefined && localStorage.getItem('apiKey') !== null){
              // this.authServiceLogin.checkMobileExist(mobileIsThis).subscribe((data: any) =>{
                console.log(this.mobileExistResponse);
                if (this.mobileExistResponse != undefined) {
                  if(this.mobileExistResponse == "mobile already exists"){
                    mobilenum.required = true;
                    this.throwMobileError = "*Mobile number already exists";
                    this.EdtPro_nt_loading = true;
                    this.EdtPro_loading = false;
                    setTimeout(() => {
                      mobilenum.required = false;
                      this.throwMobileError = "*Invalid Mobile Number";
                    }, 2000);
                  }else if(this.mobileExistResponse.includes('mobile_txn_id')){
                    this.mobileTxNo = this.mobileExistResponse.split(':')[1];
                    this.EdtPro_nt_loading = true;
                    this.EdtPro_loading = false;
                    this.onClickUpdateProfile(fname,lname,emailadd,picker,mobilenum,hght);
                    localStorage.setItem('editMobile' , this._constant.aesEncryption(mobilenum.value));
                    localStorage.setItem('affiliatemobileNumber', this._constant.aesEncryption(mobilenum.value));
                  }
                } else {
                  this.onClickUpdateProfile(fname,lname,emailadd,picker,mobilenum,hght);
                  localStorage.setItem('editMobile' , this._constant.aesEncryption(mobilenum.value));
                  localStorage.setItem('affiliatemobileNumber', this._constant.aesEncryption(mobilenum.value));
                }
              // });
            }else{
              this.authServiceLogin.getAPItokenKey().subscribe(data =>  {
                let apiKey = data["ApiKey"]
                localStorage.setItem('apiKey', data["ApiKey"]);
  
                // this.authServiceLogin.checkMobileExist(mobileIsThis).subscribe((data: any) =>{
                  console.log(this.mobileExistResponse);
                  if (this.mobileExistResponse != undefined) {
                    if(this.mobileExistResponse == "mobile already exists"){
                      mobilenum.required = true;
                      this.throwMobileError = "*Mobile number already exists";
                      this.EdtPro_nt_loading = true;
                      this.EdtPro_loading = false;
                      setTimeout(() => {
                        mobilenum.required = false;
                        this.throwMobileError = "*Invalid Mobile Number";
                      }, 2000);
                    }else if(this.mobileExistResponse.includes('mobile_txn_id')){
                      this.mobileTxNo = this.mobileExistResponse.split(':')[1];
                      this.EdtPro_nt_loading = true;
                      this.EdtPro_loading = false;
                      this.onClickUpdateProfile(fname,lname,emailadd,picker,mobilenum,hght);
                      localStorage.setItem('editMobile' , this._constant.aesEncryption(mobilenum.value));
                      localStorage.setItem('affiliatemobileNumber', this._constant.aesEncryption(mobilenum.value));
                    }
                  } else {
                    this.onClickUpdateProfile(fname,lname,emailadd,picker,mobilenum,hght);
                    localStorage.setItem('editMobile' , this._constant.aesEncryption(mobilenum.value));
                    localStorage.setItem('affiliatemobileNumber', this._constant.aesEncryption(mobilenum.value));
                  }
                // });
              })
            }
          }else if(inputBoxMobileNum.length !== 10){
            mobilenum.required = true;
            this.throwMobileError = "*Invalid Mobile Number";
            setTimeout(() => {
              mobilenum.required = false;
            }, 2000);
          }
  
        }
      }else if(inputBoxMobileNum == ""){
        mobilenum.required = true;
        this.throwMobileError = "*Invalid Mobile Number";
        setTimeout(() => {
          mobilenum.required = false;
        }, 2000);
      }
    }
    }else{
      if (this._constant._isDependentUserAccount == true) {
        // var jAccEmail = (<HTMLInputElement>document.getElementById("jntMail")).value;
        // var jAccMobile = (<HTMLInputElement>document.getElementById("jntMobile")).value;
        this.onClickUpdateProfileJointUser(fname,lname,jEmailAd,picker,jMobileNum,hght);
      }else{
      var qlogMobileNum = this._constant.aesDecryption('editMobile');
      var inputBoxMobileNum = mobilenum.value;
      //alert(typeof inputBoxMobileNum);
      if(inputBoxMobileNum !== ""){
        if(inputBoxMobileNum == qlogMobileNum){
          console.log(qlogMobileNum);
          console.log(inputBoxMobileNum);
          this.onClickUpdateProfile(fname,lname,emailadd,picker,mobilenum,hght);
        }else if(inputBoxMobileNum !== qlogMobileNum){
          if(inputBoxMobileNum.length == 10){
            this.EdtPro_nt_loading = false;
            this.EdtPro_loading = true;
            console.log(qlogMobileNum);
            console.log(inputBoxMobileNum);
            var emailIsThis = "";
            var mobileIsThis = inputBoxMobileNum;
            var aadhaarIsThis = "";
            if(localStorage.getItem('apiKey') !== undefined && localStorage.getItem('apiKey') !== null){
              this.authServiceLogin.checkMobileExistsOrNot(emailIsThis,mobileIsThis,aadhaarIsThis,localStorage.getItem('apiKey')).subscribe((data: any) =>{
                console.log(data);
                if(data == "Mobile Number already exists"){
                  mobilenum.required = true;
                  this.throwMobileError = "*Mobile number already exists";
                  this.EdtPro_nt_loading = true;
                  this.EdtPro_loading = false;
                  setTimeout(() => {
                    mobilenum.required = false;
                    this.throwMobileError = "*Invalid Mobile Number";
                  }, 2000);
                }else if(data == ""){
                  this.EdtPro_nt_loading = true;
                  this.EdtPro_loading = false;
                  this.onClickUpdateProfile(fname,lname,emailadd,picker,mobilenum,hght);
                  localStorage.setItem('editMobile' , this._constant.aesEncryption(mobilenum.value));
                  localStorage.setItem('affiliatemobileNumber', this._constant.aesEncryption(mobilenum.value));
                }
              });
            }else{
              this.authServiceLogin.getAPItokenKey().subscribe(data =>  {
                let apiKey = data["ApiKey"]
                localStorage.setItem('apiKey', data["ApiKey"]);
          
                this.authServiceLogin.checkMobileExistsOrNot(emailIsThis,mobileIsThis,aadhaarIsThis,apiKey).subscribe((data: any) =>{
                console.log(data);
                if(data == "Mobile Number already exists"){
                  mobilenum.required = true;
                  this.throwMobileError = "*Mobile number already exists";
                  this.EdtPro_nt_loading = true;
                  this.EdtPro_loading = false;
                  setTimeout(() => {
                    mobilenum.required = false;
                    this.throwMobileError = "*Invalid Mobile Number";
                  }, 2000);
                }else if(data == ""){
                  this.EdtPro_nt_loading = true;
                  this.EdtPro_loading = false;
                  this.onClickUpdateProfile(fname,lname,emailadd,picker,mobilenum,hght);
                  localStorage.setItem('editMobile' , this._constant.aesEncryption(mobilenum.value));
                  localStorage.setItem('affiliatemobileNumber', this._constant.aesEncryption(mobilenum.value));
                }
              });
              })
            }
          }else if(inputBoxMobileNum.length !== 10){
            mobilenum.required = true;
            this.throwMobileError = "*Invalid Mobile Number";
            setTimeout(() => {
              mobilenum.required = false;
            }, 2000);
          }
          
        }
      }else if(inputBoxMobileNum == ""){
        mobilenum.required = true;
        this.throwMobileError = "*Invalid Mobile Number";
        setTimeout(() => {
          mobilenum.required = false;
        }, 2000);
      }
    }
  }
    
  }
  

  onClickUpdateProfile(fname,lname,emailadd,picker,mobilenum,hght){
  if(this._constant.ihlDemouserID != this.userid) {
    //alert(this._constant.ihlDemouserID);
    //alert(IHLUserId);
    /* console.log(this.selectedGender);
    console.log(fname.value);
    console.log(lname.value);
    console.log(emailadd.value);
    console.log(mobilenum.value);
    console.log(hght.value);
    console.log(this.weightCheckins);
    console.log(this.selectedAffiliation); */
   
    //this.selectedAffiliation = this.affiliate;

    if(this.selectedGender == undefined){
      this.selectedGender = this.gender;
    }

    if(this.weightCheckins == undefined){
       this.weightCheckins = "";
    } else if(this.updatedWeight != undefined){
      this.weightCheckins = this.updatedWeight;
    } 

    // if(this.selectedAffiliation == undefined || this.selectedAffiliation == "None"){
    //   this.selectedAffiliation = "";
    // }
    
    var firstname= fname.value; 
    var lastname= lname.value;
    var emailaddress = emailadd.value;
    var mobile = mobilenum.value;
    var userGender;
    if(this.selectedGender == "male"){
      userGender = 'm';
    } else if(this.selectedGender == "female") {
      userGender = 'f';
    } else {
      userGender = this.selectedGender;
    }
    var userHeight= hght.value;
    this.heightCentimeter = userHeight;
    var userWeight = this.weightCheckins;
    var userAffliation;
    if(this.selectedAffiliation !== undefined && this.selectedAffiliation !== null && this.selectedAffiliation !== "None"){
      userAffliation = this.selectedAffiliation;
    }else if((this.selectedAffiliation == undefined || this.selectedAffiliation == null || this.selectedAffiliation == "None") && (this.affiliate == null || this.affiliate == undefined || this.affiliate == "None" || this.affiliate == "")){
      userAffliation = "";
    }else if((this.selectedAffiliation == undefined || this.selectedAffiliation == null || this.selectedAffiliation == "None") && (this.affiliate !== null && this.affiliate !== undefined && this.affiliate !== "None" && this.affiliate !== "")){
      userAffliation = this.affiliate;
    }

    var apiKey = localStorage.getItem('apiKey')
    var IHLUserToken = localStorage.getItem('id_token')
    var IHLUserId = this.userid;

    if(firstname.length >= 2){
      if(lastname.length >= 2){
        if(emailaddress.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)){
         if(this.dob != "" && this.dob != undefined && this.dob != null || this.newbirthDate != undefined && this.newbirthDate != null && this.newbirthDate != ""){
           if(this.gender != "" && this.gender != undefined && this.gender != null || this.selectedGender != undefined && this.selectedGender != null && this.selectedGender != ""){
            if(mobile.length == 10){
             if(userHeight >= 90 && userHeight <= 250){
              fname.required = false;
              lname.required = false;
              emailadd.required = false;
              mobilenum.required = false;
              hght.required= false; 
              this.genderHint = false;
              picker.required = false;

              if (this.newbirthDate == undefined) 
              {
                this.newbirthDate = this.formattedDOB; 
              } 
              var dob = this.newbirthDate.split('/');
              let userProfile_dateofbirth = dob[0]+'/'+dob[1]+'/'+dob[2];
              this.dob = userProfile_dateofbirth;
              var todayTimes = new Date();
              todayTimes.setFullYear(todayTimes.getFullYear() - 13);
              if (new Date(userProfile_dateofbirth) > todayTimes || new Date(userProfile_dateofbirth) == todayTimes) {
                picker.required = true;
                setTimeout(() => {
                  picker.required = false;
                }, 2000);
                return false;
              }
              this.EdtPro_nt_loading = false;
              this.EdtPro_loading = true;

              var jsontext = '{"email": "' + emailaddress  + '","mobileNumber": "' + mobile  + '","dateOfBirth": "' + userProfile_dateofbirth  + '","heightMeters": "' + userHeight/100 + '","gender": "' + userGender + '","firstName": "' + firstname + '","encryptionVersion":null,"lastName": "' + lastname + '","userInputWeightInKG": "' + userWeight + '","affiliate": "'+userAffliation+'"}';
              // var jsontext = '{"email": "' + emailaddress  + '","mobileNumber": "' + mobile  + '","dateOfBirth": "' + userProfile_dateofbirth  + '","heightMeters": "' + userHeight/100 + '","gender": "' + userGender + '","firstName": "' + firstname + '","encryptionVersion":null,"lastName": "' + lastname + '","userInputWeightInKG": "' + userWeight + '","affiliate": "'+userAffliation+'","aadhaarNumber": "' + this.aadhaar + '"}';
              if(this.vaptEnabled){
                let getUserData = JSON.parse(this._constant.aesDecryption("userData"));
              jsontext = JSON.parse(jsontext);

              if(this._constant.regMailMobileOTP != undefined){
                if(this._constant.regMailMobileOTP['mobileOtp'] != undefined && this._constant.regMailMobileOTP['mobileOtp'] != ""){
                  jsontext['mobileNumber'] = this.mobileTxNo;
                  jsontext['mobile_otp'] = this._constant.regMailMobileOTP['mobileOtp'];
                  this._constant.regMailMobileOTP = {};
                }  else {
                  delete jsontext['mobileNumber'];
                }
              } else {
                delete jsontext['mobileNumber'];
              }

              if(getUserData.email == emailaddress){
                delete jsontext['email'];
              }
              }
              console.log(IHLUserId);
              setTimeout(() => {
                  this.authService.postEditProfieInput(apiKey,IHLUserToken,IHLUserId,jsontext).subscribe((data: any) =>{
                    console.log(data);
                    if(data == 'updated'){
                        this.EdtPro_nt_loading = true;
                        this.EdtPro_loading = false;
                        if(this._constant.aesDecryption('teleCall') ==  'true'){
                          localStorage.removeItem('teleCall');
                          this.router.navigate(['/teleconsultation']);
                        }
                        this.snackBar.open("Your Profile has been updated successfully!", '',{ 
                        duration: 5000,
                        panelClass: ['success'],
                      });
                    }
	                  this._constant.userFirstName = this.firstname;
	                  this._constant.userLastName = this.lastname;
	                  this._constant.userGender = this.gender;
                    this._constant.userProfileData.firstName = this.firstname;
                    this._constant.userProfileData.lastName = this.lastname;
                    this._constant.userProfileData.gender = this.gender;
                    this._constant.userProfileData.mobileNumber = mobile;
	                  this.authServiceLogin.publish('basic-info-update');
	                  let userData = JSON.parse(this.userDataList);
	                  userData['firstName'] = this._constant.userFirstName;
	                  userData['lastName'] = this._constant.userLastName;
                    userData['gender'] = this._constant.userGender;
                    userData['mobileNumber'] = mobile;
                    userData['dateOfBirth'] = userProfile_dateofbirth;
                    userData['heightMeters'] = userHeight/100;
                    userData['userInputWeightInKG'] = userWeight;
                    localStorage.setItem("userData", this._constant.aesEncryption(JSON.stringify(userData)));
                    localStorage.setItem("weight", userWeight);
                    this._constant.basicInfoNeed = false;
                    
                    if(userAffliation !== undefined && userAffliation !== null && userAffliation !== ""){
                      localStorage.setItem("affiliateProgram", this._constant.aesEncryption(userAffliation));
                      this._constant.notShowMetrics = false;
                      this._constant.notShowMetricsTitle = "programs";
                    }else if(userAffliation == undefined || userAffliation == null || userAffliation == ""){
                      //localStorage.setItem("affiliateProgram", userAffliation);
                      this._constant.notShowMetrics = true;
                      this._constant.notShowMetricsTitle = "The program feature is disabled";
                    }
                    this._constant.changedAffiliation = userAffliation;
                    this._isTeleconsultationFlow();
                  })/* ,error => {
                    this.EdtPro_loading = false;
                    this.EdtPro_nt_loading = true;
                    this.snackBar.open("Could not connect to the server.Please try after sometime.", '',{
                    duration: 5000,
                    panelClass: ['error'],
                    });
                }); */
                },1000);
              /* }else{
                wght.required= true;
                this.EdtPro_nt_loading = true;
                this.EdtPro_loading = false;
                this.snackBar.open("Invalid Weight!", '',{ 
                duration: 5000,
                panelClass: ['error'],
              });
             } */
              }else{
                  hght.required= true;
                  this.EdtPro_nt_loading = true;
                  this.EdtPro_loading = false;
                  this.snackBar.open("Invalid Height", '',{ 
                  duration: 5000,
                  panelClass: ['error'],
                });
               }
                }else{
                  mobilenum.required = true;
                  this.EdtPro_nt_loading = true;
                  this.EdtPro_loading = false;
                  this.snackBar.open("Invalid Mobile Number!", '',{
                  duration: 5000,
                  panelClass: ['error'],
              });
              }
            }else{
              this.genderHint = true;
              this.EdtPro_nt_loading = true;
              this.EdtPro_loading = false;
              this.snackBar.open("Invalid! Gender cant be empty", '',{
              duration: 5000,
              panelClass: ['error'],
           });
          }
             }else{
                 picker.required = true;
                 this.EdtPro_nt_loading = true;
                 this.EdtPro_loading = false;
                 this.snackBar.open("Invalid! Date of Birth cant be empty", '',{
                 duration: 5000,
                 panelClass: ['error'],
              });
             }
           }else{
                emailadd.required = true;
                this.EdtPro_nt_loading = true;
                this.EdtPro_loading = false;
                this.snackBar.open("Invalid Email!", '',{
                duration: 5000,
                panelClass: ['error'],
            });
           } 
         }else{
              lname.required = true;
              this.EdtPro_nt_loading = true;
              this.EdtPro_loading = false;
              this.snackBar.open("Invalid lastname!", '',{
              duration: 5000,
             panelClass: ['error'],
          });
         }    
     }else{
         fname.required = true;
         this.EdtPro_nt_loading = true;
         this.EdtPro_loading = false;
         this.snackBar.open("Invalid firstname!", '',{
         duration: 5000,
         panelClass: ['error'],
      });
     }
    }else{
      //alert("cant be edited");
      this.snackBar.open("This scope has not been given to demo user account due to some management reason!", '',{
        duration: 5000,
       panelClass: ['success'],
    });
    }
  }

  onClickUpdateProfileJointUser(fname,lname,jEmailAd,picker,jMobileNum,hght){
    console.log(this._constant.ihlDemouserID);
    console.log(this.userid);
    if(this._constant.ihlDemouserID != this.userid) {
      //alert(this._constant.ihlDemouserID);
      //alert(IHLUserId);
      /* console.log(this.selectedGender);
      console.log(fname.value);
      console.log(lname.value);
      console.log(emailadd.value);
      console.log(mobilenum.value);
      console.log(hght.value);
      console.log(this.weightCheckins);
      console.log(this.selectedAffiliation); */
     
      //this.selectedAffiliation = this.affiliate;
  
      if(this.selectedGender == undefined){
        this.selectedGender = this.gender;
      }
  
      if(this.weightCheckins == undefined){
         this.weightCheckins = "";
      } else if(this.updatedWeight != undefined){
        this.weightCheckins = this.updatedWeight;
      } 
  
      // if(this.selectedAffiliation == undefined || this.selectedAffiliation == "None"){
      //   this.selectedAffiliation = "";
      // }
      
      var firstname= fname.value; 
      var lastname= lname.value;
      var emailaddress = jEmailAd.value;
      var mobile = jMobileNum.value;
      var userGender;
      if(this.selectedGender == "male"){
        userGender = 'm';
      } else if(this.selectedGender == "female") {
        userGender = 'f';
      } else {
        userGender = this.selectedGender;
      }
      var userHeight= hght.value;
      this.heightCentimeter = userHeight;
      var userWeight = this.weightCheckins;
      var userAffliation;
      if(this.selectedAffiliation !== undefined && this.selectedAffiliation !== null && this.selectedAffiliation !== "None"){
        userAffliation = this.selectedAffiliation;
      }else if((this.selectedAffiliation == undefined || this.selectedAffiliation == null || this.selectedAffiliation == "None") && (this.affiliate == null || this.affiliate == undefined || this.affiliate == "None" || this.affiliate == "")){
        userAffliation = "";
      }else if((this.selectedAffiliation == undefined || this.selectedAffiliation == null || this.selectedAffiliation == "None") && (this.affiliate !== null && this.affiliate !== undefined && this.affiliate !== "None" && this.affiliate !== "")){
        userAffliation = this.affiliate;
      }
  
      var apiKey = localStorage.getItem('apiKey')
      var IHLUserToken = localStorage.getItem('id_token')
      var IHLUserId = this.userid;
  
      if(firstname.length >= 2){
        if(lastname.length >= 2){
          if(emailaddress.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/) || emailaddress == ""){
           if(this.dob != "" && this.dob != undefined && this.dob != null || this.newbirthDate != undefined && this.newbirthDate != null && this.newbirthDate != ""){
             if(this.gender != "" && this.gender != undefined && this.gender != null || this.selectedGender != undefined && this.selectedGender != null && this.selectedGender != ""){
              if(mobile.length == 10 || mobile == ""){
               if(userHeight >= 0 && userHeight <= 250){
                fname.required = false;
                lname.required = false;
                jEmailAd.required = false;
                jMobileNum.required = false;
                hght.required= false; 
                this.genderHint = false;
                picker.required = false;
  
                if (this.newbirthDate == undefined) 
                {
                  this.newbirthDate = this.formattedDOB; 
                } 
                var dob = this.newbirthDate.split('/');
                let userProfile_dateofbirth = dob[0]+'/'+dob[1]+'/'+dob[2];
                this.dob = userProfile_dateofbirth;
                var todayTimes = new Date();
                todayTimes.setFullYear(todayTimes.getFullYear() - 13);
                // if (new Date(userProfile_dateofbirth) > todayTimes || new Date(userProfile_dateofbirth) == todayTimes) {
                //   picker.required = true;
                //   setTimeout(() => {
                //     picker.required = false;
                //   }, 2000);
                //   return false;
                // }
                this.EdtPro_nt_loading = false;
                this.EdtPro_loading = true;
  
                // var jsontext = '{"email": "' + emailaddress  + '","mobileNumber": "' + mobile  + '","dateOfBirth": "' + userProfile_dateofbirth  + '","heightMeters": "' + userHeight/100 + '","gender": "' + userGender + '","firstName": "' + firstname + '","encryptionVersion":null,"lastName": "' + lastname + '","userInputWeightInKG": "' + userWeight + '","affiliate": "'+userAffliation+'"}';
                // var jsontext = '{"dateOfBirth": "' + userProfile_dateofbirth  + '","heightMeters": "' + userHeight/100 + '","gender": "' + userGender + '","firstName": "' + firstname + '","lastName": "' + lastname + '","userInputWeightInKG": "' + userWeight + '","affiliate": "'+userAffliation+'"}';
                //console.log(jsontext);

                let userDataUpdate = JSON.parse(this._constant.aesDecryption('userData'));
                userDataUpdate['email'] = emailaddress;
                userDataUpdate['mobileNumber'] = mobile;
                userDataUpdate['dataOfBirth'] = userProfile_dateofbirth;
                userDataUpdate['heightMeters'] = userHeight/100;
                userDataUpdate['gender'] = userGender;
                userDataUpdate['firstName'] = firstname;
                userDataUpdate['lastName'] = lastname;
                userDataUpdate['userInputWeightInKG'] = userWeight;
                userDataUpdate['affiliate'] = this.affiliate;
                //localStorage.setItem('userData', JSON.stringify(userDataUpdate));
                var jsontext = "{'User': " + JSON.stringify(userDataUpdate) + "}";

                setTimeout(() => {
                    this.authService.postEditProfieInput(apiKey,IHLUserToken,IHLUserId,jsontext).subscribe((data: any) =>{
                      console.log(data);
                      if(data == 'updated'){
                          this.EdtPro_nt_loading = true;
                          this.EdtPro_loading = false;
                          if(this._constant.aesDecryption('teleCall') ==  'true'){
                            localStorage.removeItem('teleCall');
                            this.router.navigate(['/teleconsultation']);
                          }
                          this.snackBar.open("Your Profile has been updated successfully!", '',{ 
                          duration: 5000,
                          panelClass: ['success'],
                        });
                      }
                      this._constant.userFirstName = this.firstname;
                      this._constant.userLastName = this.lastname;
                      this._constant.userGender = this.gender;
                      this.authServiceLogin.publish('basic-info-update');
                      let userData = JSON.parse(this.userDataList);
                      userData['firstName'] = this._constant.userFirstName;
                      userData['lastName'] = this._constant.userLastName;
                      userData['gender'] = this._constant.userGender;
                      userData['email'] = emailaddress;
                      userData['mobileNumber'] = mobile;
                      userData['dateOfBirth'] = userProfile_dateofbirth;
                      userData['heightMeters'] = userHeight/100;
                      userData['userInputWeightInKG'] = userWeight;
                      localStorage.setItem("userData", this._constant.aesEncryption(JSON.stringify(userData)));
                      localStorage.setItem("weight", userWeight);
                      this._constant.basicInfoNeed = false;
                      
                      if(userAffliation !== undefined && userAffliation !== null && userAffliation !== ""){
                        localStorage.setItem("affiliateProgram", this._constant.aesEncryption(userAffliation));
                        this._constant.notShowMetrics = false;
                        this._constant.notShowMetricsTitle = "programs";
                      }else if(userAffliation == undefined || userAffliation == null || userAffliation == ""){
                        //localStorage.setItem("affiliateProgram", userAffliation);
                        this._constant.notShowMetrics = true;
                        this._constant.notShowMetricsTitle = "The program feature is disabled";
                      }
                      this._constant.changedAffiliation = userAffliation;
                      this._isTeleconsultationFlow();
                    })/* ,error => {
                      this.EdtPro_loading = false;
                      this.EdtPro_nt_loading = true;
                      this.snackBar.open("Could not connect to the server.Please try after sometime.", '',{
                      duration: 5000,
                      panelClass: ['error'],
                      });
                  }); */
                  },1000);
                /* }else{
                  wght.required= true;
                  this.EdtPro_nt_loading = true;
                  this.EdtPro_loading = false;
                  this.snackBar.open("Invalid Weight!", '',{ 
                  duration: 5000,
                  panelClass: ['error'],
                });
               } */
                }else{
                    hght.required= true;
                    this.EdtPro_nt_loading = true;
                    this.EdtPro_loading = false;
                    this.snackBar.open("Invalid Height", '',{ 
                    duration: 5000,
                    panelClass: ['error'],
                  });
                 }
                  }else{
                    jMobileNum.required = true;
                    this.EdtPro_nt_loading = true;
                    this.EdtPro_loading = false;
                    this.snackBar.open("Invalid Mobile Number!", '',{
                    duration: 5000,
                    panelClass: ['error'],
                });
                }
              }else{
                this.genderHint = true;
                this.EdtPro_nt_loading = true;
                this.EdtPro_loading = false;
                this.snackBar.open("Invalid! Gender cant be empty", '',{
                duration: 5000,
                panelClass: ['error'],
             });
            }
               }else{
                   picker.required = true;
                   this.EdtPro_nt_loading = true;
                   this.EdtPro_loading = false;
                   this.snackBar.open("Invalid! Date of Birth cant be empty", '',{
                   duration: 5000,
                   panelClass: ['error'],
                });
               }
             }else{
                  jEmailAd.required = true;
                  this.EdtPro_nt_loading = true;
                  this.EdtPro_loading = false;
                  this.snackBar.open("Invalid Email!", '',{
                  duration: 5000,
                  panelClass: ['error'],
              });
              jEmailAd.required = false;
             }
           }else{
                lname.required = true;
                this.EdtPro_nt_loading = true;
                this.EdtPro_loading = false;
                this.snackBar.open("Invalid lastname!", '',{
                duration: 5000,
               panelClass: ['error'],
            });
           }    
       }else{
           fname.required = true;
           this.EdtPro_nt_loading = true;
           this.EdtPro_loading = false;
           this.snackBar.open("Invalid firstname!", '',{
           duration: 5000,
           panelClass: ['error'],
        });
       }
      }else{
        //alert("cant be edited");
        this.snackBar.open("This scope has not been given to demo user account due to some management reason!", '',{
          duration: 5000,
         panelClass: ['success'],
        });
      }
  }

  _isTeleconsultationFlow(): any{
    if (this._constant.teleconsultAddMobileNumber === true) {
      this.router.navigate(['/teleconsultation']);
      this._constant.teleconsultAddMobileNumber = false;
    }
    return;
  }

  joinuserrequest() {
    this._constant.jointUserTermsConditionsPopUp = false;
    this._constant.unsendJointUserrequestconfirmation = false;
    this._constant.requestedjoinuser = true;
    this._constant.requestacceptance = false;
    let userData = JSON.parse(this.userDataList);
    let requested_user = Object.values(userData.joint_user_detail_list).filter((item: any) => (item.status.toLowerCase() == 'requested'))
    console.log("requested_user : ", requested_user);
    this._constant.requested_users = requested_user; //assign requested users list globally
    this.dialog.open(ModalComponent);
  }

  /* caretakerdetails() {
    console.log("caretaker details");
    // this._constant.unsendJointUserrequestconfirmation = false;
    this._constant.requestedjoinuser = true;
    this._constant.requestacceptance = true;
    this._constant.caretakeracceptance = true;
    // this._constant.requestacceptance = false;
    let userData = JSON.parse(this.userDataList);
    //  console.log("user_request : ",userData);
    let caretakerdetail = Object.values(userData.care_taker_details_list).filter((item: any) => (item.is_joint_account == true))
    console.log(caretakerdetail)
    // console.log("caretaker : ", caretakerdetail['caretaker_ihl_id']);
    
    let user;
    let fullName;
    let uniqueid;
    let CurrentCareTakerId;
    // let Length = userData.care_taker_details_list.length;
    // console.log("length : ", Length)
    let tempArr;
      for (let key in userData.care_taker_details_list) {

        if (userData.care_taker_details_list[key]['is_joint_account'] === true) {
          console.log("key : ", userData.care_taker_details_list[key]['caretaker_ihl_id'])
          user = userData.care_taker_details_list[key]['caretaker_ihl_id']
          console.log(user)
          uniqueid = "{'id' : '" + user + "'}";
          CurrentCareTakerId = user;
        }

        this.authServiceLogin.getAPItokenKey().subscribe((data) => {
          let apiKey = data["ApiKey"];
          localStorage.setItem('apiKey', data["ApiKey"])

          console.log(uniqueid);
          this.authServiceLogin.authenticateIhlId(uniqueid, apiKey).subscribe((data) => {

            console.log("data : ", data)



            fullName = data['User']['firstName'] + data['User']['lastName'];
            console.log(fullName)
          
            let CaretakerUser_Credentials = { caretakenUserDetails: { 'id': CurrentCareTakerId, 'fullName': fullName } };
             localStorage.setItem('CaretakerUserCredential', JSON.stringify(CaretakerUser_Credentials));
            let storeddata = JSON.parse(localStorage.getItem('CaretakerUserCredential'));
           
            console.log(storeddata)
          });
         
        });
        console.log(tempArr)
      }
      console.log(tempArr)
           tempArr=tempArr.filter((obj)=>{console.log(obj)})
              //console.log(caretaker_list)
            // console.log(this._constant.requested_users)
    this.dialog.open(ModalComponent);

  } */

}
