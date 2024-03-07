import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { Router } from '@angular/router';
import { AbstractControl, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthServiceLogin } from '../../services/auth.service.login';
import { AuthService } from '../../services/auth.service';
import { ConstantsService } from 'src/app/services/constants.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { bool, ModalComponent } from '../modal/modal.component';
import { JointAccountService } from '../../services/joint-account.service';
import { User } from '../../models/user';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MsalService } from '@azure/msal-angular';
import { AuthenticationResult } from '@azure/msal-browser';
import { TeleConsultService } from '../../services/tele-consult.service';

@Component({
  selector: 'app-register-account',
  templateUrl: './register-account.component.html',
  styleUrls: ['./register-account.component.css']
})
export class RegisterAccountComponent implements OnInit {
  @ViewChild(MatAutocomplete) autocomplete: MatAutocomplete;
  @ViewChild('valid_date_picker') valid_date_picker: any;
  @ViewChild("ngOtpInput", { static: false }) ngOtpInput: any; config = { allowNumbersOnly: true, length: 6, isPasswordInput: false, disableAutoFocus: false, placeholder: "", inputStyles: { width: "50px", height: "50px", }, }; 
  affiliationUniqueName: any;
  ssoLoading: boolean;
  regEmail: any;
  regMobile: any;
  otpValidate: boolean = false;
  dobInValid: any;
  open_valid() {
    this.valid_date_picker.open();
  }
  vaptEnabled = this._constants.vaptEnabled;
  userModal = new User();
  ssoUserModal = new User();
  isDisabled = false;
  isLoading = false;
  affiliatedCompany: string = '';
  affiliatedMail: string = '';
  affiliatedMobile: any = '';
  // startDate = new Date(1990, 0, 1);
  privacyChecked: boolean = false;
  showAffiliatedInfo: boolean = false;
  isInValidHeight: boolean = false;
  isInValidWeight: boolean = false;
  isInvalidAge: boolean = false;
  isEmailExist: boolean = false;
  isMobileExist: boolean = false;
  isRegistrationSuccess: boolean = false;
  isPrivacyChecked: boolean = true;
  complete: boolean = false;
  today = new Date();
  subscription: any;
  viewMode = 'tab1';
  ssoRegistrationSection: boolean = true;
  ssoOrgName: Object;
  selectedSsoOrg: string = ''; 
  isSsoRegiserLoading: boolean = false;;
  ssoOrgControl = new FormControl();
  ssoSelectedOrg: any;
  selectedSsoOption: string;
  ssoRegisterButton: boolean = false;
  ssoEmail: string; 
  ssoUserIhlId: any;
  userIdExist: boolean = false;
  domainNameExistInEmail: boolean = false;
  ssoAlternativeEmailErr: boolean = false;
  emailValid: boolean = false;
  ssoAlternativeEmailSection: boolean = false;
  ssoAlternativeEmail: string;
  isEmailLoading: boolean = false;
  ssoAlternativeEmailOTP: any;
  ssoMobileNumber: any;
  validateOtp: boolean = false;
  ssoOTPSection: boolean = false;
  ssoOtpServerError: boolean = false;
  ssoAlternativeEmailOTPEntered: any;
  ssoAlternativeEmailInvalidOTP: boolean = false;
  ssoAlternativeEmailOTPLoading: boolean = false;
  ssoAlternativeEmailOTPMsg: string;
  showOtpComponent:boolean = true;
  basicInfoSection:boolean = false;
  sso_token: any;
  ssoSsoRegisterSubmitLoading:boolean = false;

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private authService: AuthServiceLogin,
    private authServiceFile: AuthService,
    private _constants: ConstantsService,
    private dialog: MatDialog,
    private _jointAccountService: JointAccountService,
    private msalService: MsalService,
    private teleService: TeleConsultService
  ) { }


  async ngOnInit() {
    this.subscription = this.authService.on('mailMobile-OTP').subscribe(() => this.onRegisterSubmit());
    if ("orgUser" in localStorage) {
      let tempStore = localStorage.getItem("orgUser");
      localStorage.clear();
      localStorage.setItem("orgUser", tempStore);
    } else {
      localStorage.clear();
    }

    this.windowUrlBasedAction();
    this.subscription = this.authService.on('affiliatedData').subscribe(() => this.appendAffiliateUserInfo());

    let apiKey = await this.authServiceFile.getApiHeaderToken().toPromise();
    localStorage.setItem('api_header_token', apiKey);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  appendAffiliateUserInfo() {
    this.showAffiliatedInfo = true;
    this.userModal['firstName'] = this._constants.affiliatedData['first_name'];
    this.userModal['lastName'] = this._constants.affiliatedData['last_name'];
    this.userModal['email'] = this._constants.affiliatedData['email'];
    this.userModal['mobileNumber'] = this._constants.affiliatedData['mobile'];
    this.affiliatedCompany = this._constants.affiliatedData['affilate_name'];
    this.affiliatedMail = this._constants.affiliatedData['email'];
    this.affiliatedMobile = this._constants.affiliatedData['mobile'];
  }

  windowUrlBasedAction() {
    var url = document.location.href;
    if (url.includes('code')) { // check the affiliate user flow
      var param = url.split('?')[1];
      var key = param.split('=')[0];
      var value = param.split('code=')[1];

      var affiliateURL = '';

      if (Number(value))
        affiliateURL = '/login/getAffilateIncrementalInfo?inc_id=';
      else
        affiliateURL = '/login/get_affliation_user_data?hash=';

      this.authService.getAffiliateUserDetails(affiliateURL + value).subscribe((data: any) => {
        this._constants.affiliatedData = data;

        if (this._constants.affiliatedData.hasOwnProperty('affilate_name') && this._constants.affiliatedData['affilate_name'] !== undefined) {
          this.affiliateModalOpen();
        } else {
          this.router.navigate(['/register']);
        }
      });
    } else if(url.includes('org')){
    /******************************
     * user redirect from SMC org
     * url = "https://dashboard.indiahealthlink.com/register?orgName=Santiniketan-Medical-college&orgCode=SMC&cmd=dataAccessPermission"
    *******************************/
     let params = (new URL(url)).searchParams;
     let orgCode = params.get("orgCode");
     let orgName = (params.get("orgName")).split('-').join(' ');
     let cmd = params.get("cmd");
     let JsonData = {"orgCode": orgCode, "orgName":orgName, "cmd" : cmd};
     localStorage.setItem("orgUser",this._constants.aesEncryption(JSON.stringify(JsonData)));
     this.router.navigate(['/']);
    }
  }

  affiliateModalOpen() {
    this._constants.affiliatedUser = true;
    this.dialog.open(ModalComponent);
  }

  setAll(isChecked: boolean) {
    this.privacyChecked = isChecked;

    if (isChecked)
      this.isPrivacyChecked = true;
    else
      this.isPrivacyChecked = false;
  }

  onTermsConditionsCheck(){
    this._constants.jointAccountTermsAndConditions = true;
    this.dialog.open(ModalComponent);
  }

  checkEmailExist() {
    if(this.vaptEnabled){
      if (this.userModal['email'].match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
        this.authService.checkEmailExistForVapt(this.userModal['email']).subscribe((data: any) => {
          // console.log(data);
          if (data == 'email already exists'){
            this.isEmailExist = true;
          } else {
            this.regEmail = data.split(':')[1];
            this.isEmailExist = false;
          }
        });
      }
    }else{
      this.authService.checkEmailExist(this.userModal['email']).subscribe((data: any) => {
        if (data != '')
          this.isEmailExist = true;
        else
          this.isEmailExist = false;
      });
    }
  }

  checkMobileExist() {
    if(this.vaptEnabled){
      if (!isNaN(this.userModal['mobileNumber'])) {
        this.authService.checkMobileExistForVapt(this.userModal['mobileNumber']).subscribe((data: any) => {
          // console.log(data);
          if (data == 'mobile already exists'){
            this.isMobileExist = true;
          } else {
            this.regMobile = data.split(':')[1];
            this.isMobileExist = false;
          }
        });
      }
    }else{
      this.authService.checkMobileExist(this.userModal['mobileNumber']).subscribe((data: any) => {
        if (data != '')
          this.isMobileExist = true;
        else
          this.isMobileExist = false;
      });
    }
  }

  validateHeight() {
    this.isInValidHeight = false;

    if (this.userModal.height == 0 ||this.userModal.height < 90 || this.userModal.height > 250)
      this.isInValidHeight = true;
  }

  validateWeight() {
    this.isInValidWeight = false;

    if (this.userModal.weight == 0 ||this.userModal.weight < 20 || this.userModal.weight > 150)
      this.isInValidWeight = true;
  }

  calculateAge(event) {
    if(this.vaptEnabled){
      var dateOfBirth = event.value;
      const date = dateOfBirth.toLocaleDateString();
      const [month, day, year] = date.split("/");
      this.dobInValid = `${month}/${day}/${year}`;
      var today = new Date();
      var age = today.getFullYear() - dateOfBirth.getFullYear();
      this.isInvalidAge = false;
  
      if (age < 13)
        this.isInvalidAge = true;
    }else{
      var dateOfBirth = event.value;
      var today = new Date();
      var age = today.getFullYear() - dateOfBirth.getFullYear();
      this.isInvalidAge = false;

      if (age < 13)
        this.isInvalidAge = true;
    }
  }

  ssoFromRegister(){
    console.log("Register Page");
    const ssoObj = {
      userFrom: 'register',
      ssoLogin: false,
      ssoRegister: true
    }
    localStorage.setItem('orgSign', this._constants.aesEncryption(JSON.stringify(ssoObj)));
  }

  onRegisterOTP(){
    // console.log("this.isEmailExist = " + this.isEmailExist + "; this.isMobileExist = " + this.isMobileExist);
    if(this.isEmailExist && this.isMobileExist) return 0;
    if(!this.privacyChecked){ this.isPrivacyChecked = false; return 0;}

    this._constants.otpValidReg = true;
    this.dialog.open(ModalComponent);
  }

  onRegisterSubmit() {
    if(this.vaptEnabled){
      let otp = this._constants.regMailMobileOTP;
      // console.log(otp);
      let eMailOtp = otp.eMailOtp;
      let mobileOtp = otp.mobileOtp;

      let gender = null;
      if(this.userModal['gender'] == 'f' || this.userModal['gender'] == 'm'){
        gender = this.userModal['gender'];
      }

      if (!this.privacyChecked)
          this.isPrivacyChecked = false;

      if (!this.isEmailExist && !this.isMobileExist && !this.isInValidHeight && !this.isInValidWeight && !this.isInvalidAge && this.privacyChecked) {

        var heightMeters = this.userModal['height'] / 100;

        var jsontext = '{"user":{"email":"' + this.regEmail + '", "email_otp":"' + eMailOtp + '", "mobile_otp":"' + mobileOtp + '", "mobileNumber":"' + this.regMobile + '", "userInputWeightInKG":"' + this.userModal['weight'] + '", "firstName":"' + this.userModal['firstName'] + '", "lastName":"' + this.userModal['lastName'] + '", "aadhaarNumber":"", "dateOfBirth":"' + this.dobInValid + '", "gender":"' + gender + '", "heightMeters":"' + heightMeters + '", "fingerprint":"","affiliate":"' + "" + '", "terms":{"termsFileName":"termsofuse_v9_01122016"}},"password":"' + this._constants.aesEncryption(this.userModal['password']) + '","encryptionVersion":null}';
        this.isLoading = true;

        this.authService.getAPItokenKey().subscribe(data => {
          let apiKey = data["ApiKey"]
          localStorage.setItem('apiKey', data["ApiKey"]);

          this.authService.getCToken(apiKey).subscribe(res => {
            if ('token' in res) {
              let CToken = res.token;

              this.authService.registerAccountForVapt(jsontext, CToken).subscribe(data => {

                if (data != null && data['status'] == "invalid input format") {
                  this.isLoading = false;
                  this.otpValidate = true;
                  setTimeout(function() {
                    this.otpValidate = false;
                  }, 5 * 1000);
                  return 0;
                }

                if (data != null && data['status'] != 'failed') {
                  this.isRegistrationSuccess = true;
                  var json3 = JSON.parse(JSON.stringify(data));
                  localStorage.setItem("ihlId", this._constants.aesEncryption(json3.id));
        
                  var user = {
                    email: this.userModal['email'],
                    password: this._constants.aesEncryption(this.userModal['password']),
                    encryptionVersion: null,
                    login_source: "portal"
                  }

                  this.authService.getCToken(apiKey).subscribe(response => {
                    // let apiKey = data["ApiKey"]
                    // localStorage.setItem('apiKey', data["ApiKey"]);
                    if ('token' in response) {
                      let AuthCToken = response.token;
                      this.authService.authenticateIhlForVapt(user, apiKey, AuthCToken).subscribe(data => {
                        if (data !== null) {
                          var json2 = data;
          
                          /* CHECK USER AFFILIATED DATA FUNCTIONALITY START */
          
                          if (this._constants.affiliatedUser) {
                            let affiliationData = {
                              "affilate_unique_name": this._constants.affiliatedData['affilate_unique_name'],
                              "affilate_name": this._constants.affiliatedData['affilate_name'],
                              "affilate_email": this._constants.affiliatedData['email'],
                              "affilate_mobile": this._constants.affiliatedData['mobile'],
                              "affliate_identifier_id": this._constants.affiliatedData['affliate_identifier_id']
                            };
          
                            let addUserAffiliated = true;
          
                            if (json2.User.user_affiliate != null) {
                              if (json2.User.user_affiliate.af_no1 == null || json2.User.user_affiliate.af_no1.affilate_unique_name == "" || json2.User.user_affiliate.af_no1.affilate_unique_name == affiliationData.affilate_unique_name) {
                                json2.User.user_affiliate.af_no1 = affiliationData;
                              }
                              else if (json2.User.user_affiliate.af_no2 == null || json2.User.user_affiliate.af_no2.affilate_unique_name == "" || json2.User.user_affiliate.af_no2.affilate_unique_name == affiliationData.affilate_unique_name) {
                                json2.User.user_affiliate.af_no2 = affiliationData;
                              }
                              else if (json2.User.user_affiliate.af_no3 == null || json2.User.user_affiliate.af_no3.affilate_unique_name == "" || json2.User.user_affiliate.af_no3.affilate_unique_name == affiliationData.affilate_unique_name) {
                                json2.User.user_affiliate.af_no3 = affiliationData;
                              }
                              else if (json2.User.user_affiliate.af_no4 == null || json2.User.user_affiliate.af_no4.affilate_unique_name == "" || json2.User.user_affiliate.af_no4.affilate_unique_name == affiliationData.affilate_unique_name) {
                                json2.User.user_affiliate.af_no4 = affiliationData;
                              }
                              else if (json2.User.user_affiliate.af_no5 == null || json2.User.user_affiliate.af_no5.affilate_unique_name == "" || json2.User.user_affiliate.af_no5.affilate_unique_name == affiliationData.affilate_unique_name) {
                                json2.User.user_affiliate.af_no5 = affiliationData;
                              }
                              else if (json2.User.user_affiliate.af_no6 == null || json2.User.user_affiliate.af_no6.affilate_unique_name == "" || json2.User.user_affiliate.af_no6.affilate_unique_name == affiliationData.affilate_unique_name) {
                                json2.User.user_affiliate.af_no6 = affiliationData;
                              }
                              else if (json2.User.user_affiliate.af_no7 == null || json2.User.user_affiliate.af_no7.affilate_unique_name == "" || json2.User.user_affiliate.af_no7.affilate_unique_name == affiliationData.affilate_unique_name) {
                                json2.User.user_affiliate.af_no7 = affiliationData;
                              }
                              else if (json2.User.user_affiliate.af_no8 == null || json2.User.user_affiliate.af_no8.affilate_unique_name == "" || json2.User.user_affiliate.af_no8.affilate_unique_name == affiliationData.affilate_unique_name) {
                                json2.User.user_affiliate.af_no8 = affiliationData;
                              }
                              else if (json2.User.user_affiliate.af_no9 == null || json2.User.user_affiliate.af_no9.affilate_unique_name == "" || json2.User.user_affiliate.af_no9.affilate_unique_name == affiliationData.affilate_unique_name) {
                                json2.User.user_affiliate.af_no9 = affiliationData;
                              }
                              else {
                                addUserAffiliated = false;
                                window.alert('Affiliation is full, cannot add more than 9 affiliation per user.');
                              }
                            } else {
                              json2.User.user_affiliate = { "af_no1": affiliationData };
                            }
          
                            if (addUserAffiliated) {
                              let parms = {'data': JSON.stringify(json2.User), 'TokenInfo': {'ApiToken': apiKey, 'Token': json2.Token}};
                              this.authService.addAffiliatedUserDetails(json2.User.id, parms).subscribe((data: any) => {
                                let lastCheckin = JSON.stringify(json2);
                                localStorage.setItem("LastCheckin", this._constants.aesEncryption(lastCheckin));
                              });
                            }
                          }
          
                          /* CHECK USER AFFILIATED DATA FUNCTIONALITY END */
          
                          this.authService.storeUserDataIhl(data["Token"], data["User"], '')
                          this.isLoading = false;
                          this._constants.mainUserAccountCredentials = {
                            email: data["User"]["email"],
                            mobileNumber: data["User"]["mobileNumber"],
                            id: data["User"]["id"],
                            Token: data["Token"],
                            password: this.userModal['password']
                          }
                          this._constants.affiliatedUser = false;
                        }
                      });
                    } else {
                      this.isLoading = false;
                      alert("Server down.. please try again..");
                    }
                  });
                } else {
                  this.isLoading = false;
                  // unable to create an account. create api throw error;
                  alert("Server down.. please try again..")
                }
              })
              
            } else {
              this.isLoading = false;
              alert("Server down.. please try again..")
            }
          })
        });
      }
    }else{
      if (!this.privacyChecked)
        this.isPrivacyChecked = false;

    if (!this.isEmailExist && !this.isMobileExist && !this.isInValidHeight && !this.isInValidWeight && !this.isInvalidAge && this.privacyChecked) {

      var heightMeters = this.userModal['height'] / 100;

      var jsontext = '{"user":{"email":"' + this.userModal['email'] + '", "mobileNumber":"' + this.userModal['mobileNumber'] + '", "userInputWeightInKG":"' + this.userModal['weight'] + '", "firstName":"' + this.userModal['firstName'] + '", "lastName":"' + this.userModal['lastName'] + '", "aadhaarNumber":"", "dateOfBirth":"' + this.userModal['dob'].toLocaleDateString() + '", "gender":"' + this.userModal['gender'] + '", "heightMeters":"' + heightMeters + '", "fingerprint":"","affiliate":"' + "dimension" + '","terms":{"termsFileName":"termsofuse_v9_01122016"},"privacyAgreed":{"privacyFileName":"privacypolicy_v7_08112014"}},"password":"' + this.userModal['password'] + '","encryptionVersion":null}}';
      this.isLoading = true;

      this.authService.registerAccount(jsontext).subscribe(data => {
        if (data != null) {
          this.isRegistrationSuccess = true;
          var json3 = JSON.parse(JSON.stringify(data));
          localStorage.setItem("ihlId", this._constants.aesEncryption(json3.id));

          var user = {
            email: this.userModal['email'],
            password: this.userModal['password'],
            encryptionVersion: null,
          }

          this.authService.getAPItokenKey().subscribe(data => {
            let apiKey = data["ApiKey"]
            localStorage.setItem('apiKey', data["ApiKey"]);

            this.authService.authenticateIhl(user, apiKey).subscribe(data => {
              if (data !== null) {
                var json2 = data;

                /* CHECK USER AFFILIATED DATA FUNCTIONALITY START */

                if (this._constants.affiliatedUser) {
                  let affiliationData = {
                    "affilate_unique_name": this._constants.affiliatedData['affilate_unique_name'],
                    "affilate_name": this._constants.affiliatedData['affilate_name'],
                    "affilate_email": this._constants.affiliatedData['email'],
                    "affilate_mobile": this._constants.affiliatedData['mobile'],
                    "affliate_identifier_id": this._constants.affiliatedData['affliate_identifier_id']
                  };

                  let addUserAffiliated = true;

                  if (json2.User.user_affiliate != null) {
                    if (json2.User.user_affiliate.af_no1 == null || json2.User.user_affiliate.af_no1.affilate_unique_name == "" || json2.User.user_affiliate.af_no1.affilate_unique_name == affiliationData.affilate_unique_name) {
                      json2.User.user_affiliate.af_no1 = affiliationData;
                    }
                    else if (json2.User.user_affiliate.af_no2 == null || json2.User.user_affiliate.af_no2.affilate_unique_name == "" || json2.User.user_affiliate.af_no2.affilate_unique_name == affiliationData.affilate_unique_name) {
                      json2.User.user_affiliate.af_no2 = affiliationData;
                    }
                    else if (json2.User.user_affiliate.af_no3 == null || json2.User.user_affiliate.af_no3.affilate_unique_name == "" || json2.User.user_affiliate.af_no3.affilate_unique_name == affiliationData.affilate_unique_name) {
                      json2.User.user_affiliate.af_no3 = affiliationData;
                    }
                    else if (json2.User.user_affiliate.af_no4 == null || json2.User.user_affiliate.af_no4.affilate_unique_name == "" || json2.User.user_affiliate.af_no4.affilate_unique_name == affiliationData.affilate_unique_name) {
                      json2.User.user_affiliate.af_no4 = affiliationData;
                    }
                    else if (json2.User.user_affiliate.af_no5 == null || json2.User.user_affiliate.af_no5.affilate_unique_name == "" || json2.User.user_affiliate.af_no5.affilate_unique_name == affiliationData.affilate_unique_name) {
                      json2.User.user_affiliate.af_no5 = affiliationData;
                    }
                    else if (json2.User.user_affiliate.af_no6 == null || json2.User.user_affiliate.af_no6.affilate_unique_name == "" || json2.User.user_affiliate.af_no6.affilate_unique_name == affiliationData.affilate_unique_name) {
                      json2.User.user_affiliate.af_no6 = affiliationData;
                    }
                    else if (json2.User.user_affiliate.af_no7 == null || json2.User.user_affiliate.af_no7.affilate_unique_name == "" || json2.User.user_affiliate.af_no7.affilate_unique_name == affiliationData.affilate_unique_name) {
                      json2.User.user_affiliate.af_no7 = affiliationData;
                    }
                    else if (json2.User.user_affiliate.af_no8 == null || json2.User.user_affiliate.af_no8.affilate_unique_name == "" || json2.User.user_affiliate.af_no8.affilate_unique_name == affiliationData.affilate_unique_name) {
                      json2.User.user_affiliate.af_no8 = affiliationData;
                    }
                    else if (json2.User.user_affiliate.af_no9 == null || json2.User.user_affiliate.af_no9.affilate_unique_name == "" || json2.User.user_affiliate.af_no9.affilate_unique_name == affiliationData.affilate_unique_name) {
                      json2.User.user_affiliate.af_no9 = affiliationData;
                    }
                    else {
                      addUserAffiliated = false;
                      window.alert('Affiliation is full, cannot add more than 9 affiliation per user.');
                    }
                  } else {
                    json2.User.user_affiliate = { "af_no1": affiliationData };
                  }

                  if (addUserAffiliated) {
                    let parms = {'data': JSON.stringify(json2.User), 'TokenInfo': {'ApiToken': apiKey, 'Token': json2.Token}};
                    this.authService.addAffiliatedUserDetails(json2.User.id, parms).subscribe((data: any) => {
                      let lastCheckin = JSON.stringify(json2);
                      localStorage.setItem("LastCheckin", this._constants.aesEncryption(lastCheckin));
                    });
                  }
                }

                /* CHECK USER AFFILIATED DATA FUNCTIONALITY END */

                this.authService.storeLoginUserRecord(data["User"], 'password').subscribe(item => {
                  console.log(item);
                });

                this.authService.storeUserDataIhl(data["Token"], data["User"], '')
                this.isLoading = false;
                this._constants.mainUserAccountCredentials = {
                  email: data["User"]["email"],
                  mobileNumber: data["User"]["mobileNumber"],
                  id: data["User"]["id"],
                  Token: data["Token"],
                  password: this.userModal['password']
                }
                this._constants.affiliatedUser = false;
              }
            });
          })
        }
      }, err => {
        console.log(err);
        this.isLoading = false;
      })
    }
    }
  }
  /* SSO MICROSOFT REGISTER FUNCTIONALITY START */
  SsoOrganizationSelection(userInput: string) {
    if(userInput != '' && userInput != undefined && userInput != null){
      this.authService.ssoOrganizationName(userInput).subscribe(data => {
        this.ssoOrgName = data;
        console.log(this.ssoOrgName)
      })
      this.selectedSsoOption = userInput;
    }
    else{
      this.ssoRegisterButton = false;
      this.userIdExist = false;
    }
  }
  onSsoOptionSelected(value:any) {
    if(value === '' && value === undefined && value === null){
      this.ssoRegisterButton = false;
    }else{
      this.affiliationUniqueName = value;
      this.ssoRegisterButton = true;
    }
  }
  ssoRegister(value:any){
    const loginRequest = {
      scopes: ['email', 'User.Read'], // Adjust scopes as needed
    };
    this.isSsoRegiserLoading = true;
    this.msalService.loginPopup(loginRequest).subscribe((response: AuthenticationResult) => {
      console.log(response);
      this.msalService.instance.setActiveAccount(response.account);
      this.ssoEmail = response.account.username;
      console.log(this.ssoEmail)
      this.validateSSOToken(response.accessToken);
    });
  }
  validateSSOToken(token) {
    this.sso_token = token;
    this.authService.validateSSOToken({'sso_token': this.sso_token, "sso_type": "microsoft"}).subscribe(data => {
      console.log(data);
      if ('response' in data && data['response'] == 'user already has an primary account in this email' || 'Token' in data) {
        this.isSsoRegiserLoading = false;
        this.userIdExist = true;
      } else if (data['response'] == 'exception' || data['response'] == 'user_not_exist') {
        this.userIdExist = false;
        this.isSsoRegiserLoading = false;
        this.ssoAlternativeEmailSection = true;
        this.ssoRegistrationSection = false;
      }
    });
  }
  isSsoLoggedIn(): boolean {
    return this.msalService.instance.getActiveAccount() != null;
  }
  ssoLogout() {
    this.msalService.logout();
    localStorage.removeItem('loginType');
  }
  validateAlternativeEmail(value: any) {
    this.domainNameExistInEmail = false;
    this.ssoAlternativeEmailErr = false;

    if (value.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/))
      this.emailValid = false;
    else
      this.emailValid = true;
  }
  submitAlternativeEmail() {
    console.log(this.ssoAlternativeEmail);

    if (this.ssoAlternativeEmail != undefined) {
      if (this.ssoEmail.split('@')[1].split('.')[0] == this.ssoAlternativeEmail.split('@')[1].split('.')[0]) {
        this.domainNameExistInEmail = true;
      } else {
        this.domainNameExistInEmail = false;
        this.isEmailLoading = true;

        /* CHECK SSO PERSONAL EMAIL FUNCTIONALITY START */
        this.authService.ssoPersonalEmail(this.ssoAlternativeEmail).subscribe(response => {
          console.log(response);
          if (response['status'] == 'email never used') {
            var data={
              'email':this.ssoAlternativeEmail,
              'mobile':this.ssoMobileNumber  ? this.ssoMobileNumber : ''
            }
            this.sendOtpVerificationToUserByEmailOrNumber(data);
          }else if(response['status'] == 'already used as alternate email' || response['status'] == 'already used as primary email') {
            this.snackBar.open("Already used as alternate Mail, choose different", '', {
              duration: 1000,
              panelClass: ['error'],
            });
          }
        });
        /* CHECK SSO PERSONAL EMAIL FUNCTIONALITY END */
      }
    } else {
      this.ssoAlternativeEmailErr = true;
    }
  }
  sendOtpVerificationToUserByEmailOrNumber(data) {
    this.authService.sendOtpVerificationToUserByEmailOrNumber(data).subscribe(response => {
      console.log(response);
      if ('OTP' in response && response['OTP'] != '') {
        this.ssoAlternativeEmailOTP = response['OTP'];
        this.validateOtp = true;
        this.ssoOTPSection = true;
        this.ssoAlternativeEmailSection = false;
      }else{
        this.isEmailLoading = false;
        this.ssoOtpServerError = true;
      }
    });
  }
  returnSsoRegistration() {
    this.ssoRegistrationSection = true;
    this.ssoAlternativeEmailSection = false;
  }
  onAlternativeEmailOTPChange(value: any){
    console.log(value)
    this.ssoAlternativeEmailOTPEntered = value;
  }
  validateAlternativeEmailOTP() {
    console.log(this.ssoAlternativeEmailOTP);
    console.log(this.ssoAlternativeEmailOTPEntered);
    if (this.ssoAlternativeEmailOTPEntered != undefined || this.ssoAlternativeEmailOTPEntered != '') {
      this.ssoAlternativeEmailOTPLoading = true;
      if (this.ssoAlternativeEmailOTP == this.ssoAlternativeEmailOTPEntered) {
        this.ssoAlternativeEmailOTPLoading = false;
        this.ssoAlternativeEmailInvalidOTP = false;
        this.ssoAlternativeEmailOTPMsg = '';
        this.ssoOTPSection = false;
        this.basicInfoSection = true;
        // this.loginUsingIhlId(this.ssoUserIhlId);
      } else {
        this.ssoAlternativeEmailOTPLoading = false;
        this.ssoAlternativeEmailInvalidOTP = true;
        this.ssoAlternativeEmailOTPMsg = 'Invalid OTP';
      }
    } else {
      this.ssoAlternativeEmailInvalidOTP = true;
      this.ssoAlternativeEmailOTPMsg = 'Please enter valid OTP';
    }
  }
  onSsoRegisterSubmit() {
    this.isLoading = true;
    if (!this.privacyChecked)
        this.isPrivacyChecked = false;

    if (!this.isEmailExist && !this.isMobileExist && !this.isInValidHeight && !this.isInValidWeight && !this.isInvalidAge && this.privacyChecked) {

      var heightMeters = this.ssoUserModal['height'] / 100;

      var jsontext = '{"sso_token":"' + this.sso_token + '","sso_type":"microsoft","user":{"email":"' + this.ssoEmail + '", "mobileNumber":"' + this.ssoMobileNumber + '", "userInputWeightInKG":"' + this.ssoUserModal['weight'] + '", "firstName":"", "lastName":"", "aadhaarNumber":"", "dateOfBirth":"' + this.ssoUserModal['dob'].toLocaleDateString() + '","affiliate":"", "gender":"' + this.ssoUserModal['gender'] + '", "heightMeters":"' + heightMeters + '","personal_email":"'+this.ssoAlternativeEmail+'","is_organization_account":"true", "fingerprint":"","terms":{"termsFileName":"termsofuse_v9_01122016"},"privacyAgreed":{"privacyFileName":"privacypolicy_v7_08112014"}},"password":"","encryptionVersion":null}';
      this.ssoSsoRegisterSubmitLoading = true;
      console.log(jsontext)
      this.authService.ssoRegisterAccount(jsontext).subscribe(data => {
        if (data != null) {
          var json3 = JSON.parse(JSON.stringify(data));
          console.log(json3);
          if(json3.status == 'failed'){
            console.log('Registration Failed');
          }else{
            console.log('Registration Sucess');
            this.isRegistrationSuccess = true;
            this.loginUsingIhlId(json3['request']['user']['id'], false);
          }
        }
      }, err => {
        console.log(err);
        this.ssoSsoRegisterSubmitLoading = false;
      })
    }
  }
  loginUsingIhlId(userIhlId, editProfileAPI = false) {
    try {
      this.authService.getAPItokenKey().subscribe(data => {
        // console.log(data['ApiKey']);
        let apikey = data['ApiKey']
        localStorage.setItem('apiKey', data["ApiKey"]);
        // console.log(User_ihl_id);
        let userId:any = {
          id : userIhlId,
        }
        this.authService.authenticateIhlId(userId, apikey).subscribe(response => {
          // console.log(response);
          if(response == 'exception'){
            this.isLoading = false;
            this.ssoLoading = false;

            this.snackBar.open("Invalid Login", '',{
              duration: 1000,
              panelClass: ['error'],
            });
          }else{
            this.isLoading = false;
            this.ssoLoading = false;
            localStorage.setItem('loginType', 'ssoLogin');
            this.authService.storeUserDataIhl(response['Token'], response['User'], response['LastCheckin']);
            var userAffiliationArray = {};  
            this.teleService.getAffiliationExclusiveData().subscribe(data => {
              data.forEach(data=>{
                if(data.affiliation_unique_name === this.affiliationUniqueName){
                  userAffiliationArray = {
                    "affilate_unique_name": data.affiliation_unique_name,
                    "affilate_name": data.company_name,
                    "affilate_email": this.ssoEmail,
                    "affilate_mobile": response.User.mobileNumber,
                    "affliate_identifier_id": '',
                    "is_sso": true
                  };                    
                }
              })
              var af_no1_data:any = {
                'User':{'user_affiliate':{'af_no1':userAffiliationArray}}
              }              
              let parms = {'data': JSON.stringify(af_no1_data), 'TokenInfo': {'ApiToken': apikey, 'Token': response.Token}};
              this.addAffiliatedUserDetails(response.User.id , parms);
              console.log(af_no1_data)
            });            
          }
        })
      });
    }catch(err){
      this.snackBar.open("Something went wrong", '',{
        duration: 1000,
        panelClass: ['error'],
      });
      return err;
    }
   }
   addAffiliatedUserDetails(UserId:any,parms:any){
    this.authService.addAffiliatedUserDetails(UserId, parms).subscribe((data: any) => {
      this.isLoading = false;
      let lastCheckin = JSON.stringify(data);
      console.log(data)
      localStorage.setItem("LastCheckin", this._constants.aesEncryption(lastCheckin));
    });
   }
    /* SSO MICROSOFT REGISTER FUNCTIONALITY End */

}
