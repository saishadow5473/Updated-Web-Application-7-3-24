import { Component,ViewChild,OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ModalComponent, bool } from '../modal/modal.component';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { FormControl, FormBuilder, FormGroup, Validators, AbstractControl  } from "@angular/forms";
import { AuthServiceLogin } from '../../services/auth.service.login';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router'
import { HttpClient } from '@angular/common/http';
import { ConstantsService } from '../../services/constants.service';
import { TeleConsultService } from '../../services/tele-consult.service';
import { User } from '../../models/user';
import { MsalService } from '@azure/msal-angular';
import { AuthenticationResult } from '@azure/msal-browser';
import { SocialAuthService, SocialUser, GoogleLoginProvider } from "angularx-social-login";

export function passwordMatchValidator(control: AbstractControl) {
  const newPassword = control.get('newPassword').value;
  const confirmPassword = control.get('confirmPassword').value;

  if (newPassword === confirmPassword) {
    return null; // Passwords match
  } else {
    return { passwordMismatch: true }; // Passwords do not match
  }
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @ViewChild(MatAutocomplete) autocomplete: MatAutocomplete;
  @ViewChild("ngOtpInput", { static: false }) ngOtpInput: any; config = { allowNumbersOnly: true, length: 6, isPasswordInput: false, disableAutoFocus: false, placeholder: "", inputStyles: { width: "50px", height: "50px", }, }; 
  vaptEnabled = this._constants.vaptEnabled;
  passwordExpired: boolean = false;
  orgControl = new FormControl();
  userModal = new User();
  passwordForm: FormGroup;
  ssoUserModal: any;
  isLoading: boolean = false;
  invalidLogin: boolean = false;
  loginBtnDisabled: boolean = false;
  emailValid: boolean = false;
  mobileAadharValid: boolean = false;
  viewMode = 'tab1';
  OrgList:any;
  orgName:any;
  domainNameExistInEmail: boolean = false;
  subscription: any;
  validateOtp: boolean = false;
  isEmailLoading: boolean = false;
  otp: string; 
  showOtpComponent:boolean = true;
  ssoLoginButton: boolean = false;
  ssoLoading: boolean = false;
  ssoUserIhlId: any;
  ssoEmail: string; 
  ssoOrganizationSearch: boolean = true;
  ssoOTPSection: boolean = false;
  ssoAlternativeEmail: string;
  ssoAlternativeEmailExist: boolean = true;
  ssoAlternativeEmailErr: boolean = false;
  ssoAlternativeEmailSection: boolean = false;
  ssoAlternativeEmailOTP: any;
  ssoAlternativeEmailOTPMsg: string;
  ssoAlternativeEmailOTPLoading: boolean = false;
  ssoAlternativeEmailInvalidOTP: boolean = false;
  ssoAlternativeEmailOTPEntered: any;
  affiliationUniqueName: any;
  convertSSOToIHLFlow: boolean = false;
  setPasswordSection: boolean = false;
  isConvertSSoToIHLSuccess: boolean = false;
  passwordLoading: boolean = false;
  ssoIhlUserId: string;
  ssoApiKey: string;
  ssoToken: string;
  user: SocialUser;
  googleLoggedIn: boolean = false;
  ssoGoogleLoginBtn: boolean = false;
  loginCountExceeded: boolean = false;
  ssoRegistrationFlow: boolean = false;
  currentUrl: String;
  demoCredential:boolean = false;

  constructor(
    private authService: AuthServiceLogin,
    private authServiceFile: AuthService,
    private dialog: MatDialog,

    private router: Router,
    private http: HttpClient,
    private teleService: TeleConsultService,
    private snackBar: MatSnackBar,
    public _constants: ConstantsService,
    private msalService: MsalService,
    private fb: FormBuilder,
    private googleAuthService: SocialAuthService
  ) { 
    this.passwordForm = this.fb.group(
      {
        newPassword: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: passwordMatchValidator }
    );
  }

  async ngOnInit() {
    if ("orgUser" in localStorage) {
      let tempStore = localStorage.getItem("orgUser");
      localStorage.clear();
      localStorage.setItem("orgUser", tempStore);
    } else {
      localStorage.clear();
    }


    this.isLoading = false;
    if (this._constants.aesDecryption("loginValue") == "true") {
      var realTimeData = JSON.parse(this._constants.aesDecryption("LastCheckin"));
      this.authService.storeUserDataIhl(realTimeData["Token"], realTimeData["User"], realTimeData['LastCheckin']);
      this._constants.mainUserAccountCredentials = {
        email: realTimeData["User"]["email"],
        mobileNumber: realTimeData["User"]["mobileNumber"],
        id: realTimeData["User"]["id"],
        Token: realTimeData["Token"],
        password: (this._constants.aesDecryption("userLoginPassword")) ? this._constants.aesDecryption("userLoginPassword") : ""
      }
    } else {
      // login page restricted code start
      // Please don't remove the code. Below code is important for deploy.
      /* localStorage.setItem("websiteRedirect", "false");
      var currentUrl = window.location.href;
      var tempUrl = currentUrl.split("portal");
      window.location.href = tempUrl[0]+"index.html"; */
      // login page restricted code end
    }

    if (this._constants.affiliatedUser)
      this.userModal['email'] = this._constants.affiliatedData['email'];

    /* if(!this.authService.isLoggedIn()){
      this.router.navigate(['verify'])
    } */
    let apiKey = await this.authServiceFile.getApiHeaderToken().toPromise();
    localStorage.setItem('api_header_token', apiKey);
    this.subscription = this.authServiceFile.on('showSSOAlternativeEmailSection').subscribe(() => this.showSSOAlternativeEmailSection());
    this.subscription = this.authServiceFile.on('resetLoginPage').subscribe(() => this.resetLoginPage());

    if ('msal.interaction.status' in sessionStorage)
      sessionStorage.removeItem('msal.interaction.status');

    this.currentUrl = window.location.href;
    console.log(this.currentUrl);
    if (this.currentUrl.includes("marketing_kit")) {
      this.demoCredential = true;
    }
  }

  validEmailType(value: any) {
    // console.log(value);
    if(value.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)){
      // console.log("Email");
      this.emailValid = false;
      this.userModal['email'] = value;

    }else if(Number.isInteger(parseInt(value))){
      this.emailValid = false;

      if(value.length == 10){
        // console.log("Mobile");
        this.mobileAadharValid = false;
        this.userModal['email'] = value;

      }else if(value.length == 12){
        // console.log("Aadhaar");
        this.mobileAadharValid = false;
        this.userModal['email'] = value;

      } else {
        this.mobileAadharValid = true;
      }
    }else{
      this.emailValid = true;
    }
  }

  ssoFromLogin(){
    console.log("From Login");
    const ssoObj = {
      userFrom: 'login',
      ssoLogin: true,
      ssoRegister: false
    }
    localStorage.setItem('orgSign', this._constants.aesEncryption(JSON.stringify(ssoObj)));
  }

  onLoginSubmit() {
    this.isLoading = true;
    this.loginBtnDisabled = true;

    this._constants.userPassword = this.userModal['password'];
    if(this.vaptEnabled){
      //for IHL backend
      const user = {
        email: this.userModal['email'],
        password: this._constants.aesEncryptionForVAPT(this.userModal['password']),
        encryptionVersion: null,
        login_source: "portal"
      }

      this.authService.getAPItokenKeyForVapt().subscribe(data => {
        let apiKey = data["ApiKey"]
        localStorage.setItem('apiKey', data["ApiKey"]);
        this.authService.getCToken(apiKey).subscribe(res => {
          if ('token' in res) {
            let CToken = res.token;
            this.authService.authenticateIhlForVapt(user, apiKey, CToken).subscribe(data => {
              if (data == null) {
                this.isLoading = false;
                this.invalidLogin = true;
              }

              this.loginBtnDisabled = false;

              if (data !== null && data.User.status == "set new password") {
                this._constants.changePasswordData = data.User;
                this._constants.changePasswordData['email'] = this.userModal['email'];
                this._constants.changePasswordData['oldPwd'] = this.userModal['password'];
                this._constants.changePasswordModel = true;
                this.dialog.open(ModalComponent);
                this.isLoading = false;
                this.userModal['password'] = "";
                this.userModal['email'] = "";
                return 0;
              } else if (data !== null && data.User.status !== "session active" && data.User.status !== "login count exceeded") {
      
                var json2 = data;

                if (json2 == 'temporary password expired') {
                  this.passwordExpired = true;
                  this.isLoading = false;

                  setTimeout(() => {
                    this.passwordExpired = false;
                  }, 10*1000);
                  return;
                }
      
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
      
                this.authService.storeUserDataIhl(data["Token"], data["User"], data["LastCheckin"])
      
                this._constants.mainUserAccountCredentials = {
                  email: data["User"]["email"],
                  mobileNumber: data["User"]["mobileNumber"],
                  id: data["User"]["id"],
                  Token: data["Token"],
                  password: this.userModal['password']
                }
                this._constants.affiliatedUser = false;
              } else if(data.User.status == "session active"){
                this._constants.changePasswordData['email'] = this.userModal['email'];
                this._constants.sessionActiveLogout = true;
                this.dialog.open(ModalComponent);
                this.isLoading = false;
                this.userModal['password'] = "";
                this.userModal['email'] = "";
                return 0;
              }else if(data.User.status == "login count exceeded"){
                this.loginCountExceeded = true;
                this.isLoading = false;
                setTimeout(() => {
                  this.loginCountExceeded = false;
                }, 3000);
              } else {
                this.isLoading = false;
                this.invalidLogin = true;
      
                setTimeout(() => {
                  this.invalidLogin = false;
                }, 3000);
              }
            })
          } else {
            this.isLoading = false;
            this.snackBar.open("Unable to login.. Please login again", '',{
              duration: 6 * 1000,
              panelClass: ['error'],
            });
          }
        });
      })
    }else{
      //for IHL backend
      const user = {
        email: this.userModal['email'],
        password: this.userModal['password'],
        encryptionVersion: null,
      }
  
      this.authService.getAPItokenKey().subscribe(data => {
        let apiKey = data["ApiKey"]
        localStorage.setItem('apiKey', data["ApiKey"]);
  
        this.authService.authenticateIhl(user, apiKey).subscribe(data => {
          this.loginBtnDisabled = false;
  
          if (data !== null) {
            localStorage.setItem('loginType', 'onLogin');
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
  
            this.authService.storeUserDataIhl(data["Token"], data["User"], data["LastCheckin"])
  
            this._constants.mainUserAccountCredentials = {
              email: data["User"]["email"],
              mobileNumber: data["User"]["mobileNumber"],
              id: data["User"]["id"],
              Token: data["Token"],
              password: this.userModal['password']
            }
            this._constants.affiliatedUser = false;
          } else {
            this.isLoading = false;
            this.invalidLogin = true;
  
            setTimeout(() => {
              this.invalidLogin = false;
            }, 3000);
          }
        })
      })
    }    
  }

  /* SSO MICROSOFT LOGIN FUNCTIONALITY START */

  ssoOrganization(userInput: string) {
    if(userInput != '' && userInput != undefined && userInput != null){
      this.authService.ssoOrganizationName(userInput).subscribe(data => {
        this.orgName = data;
      })
    }else{
      this.ssoLoginButton = false;
    }
  }
  onSsoOptionSelected(value:any, signInOption: string) {
    this.ssoLoginButton = false;
    this.ssoGoogleLoginBtn = false;

    if (value === '' && value === undefined && value === null) {
      this.ssoLoginButton = false;
      this.ssoGoogleLoginBtn = false;
    } else {
      this.affiliationUniqueName = value;
      if (signInOption == 'microsoft')
        this.ssoLoginButton = true;
      else if (signInOption == 'google')
        this.ssoGoogleLoginBtn = true;
    }
  }
  returnSsoLogin() {
    this.ssoOrganizationSearch = true;
    this.ssoAlternativeEmailSection = false;
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
      if (this.convertSSOToIHLFlow) {
        this.isEmailLoading = true;
        this.getSSOUserInfoByAlternativeEmail(this.ssoAlternativeEmail);
      } else {
        if (this.ssoEmail.split('@')[1].split('.')[0] == this.ssoAlternativeEmail.split('@')[1].split('.')[0]) {
          this.domainNameExistInEmail = true;
        } else {
          this.domainNameExistInEmail = false;
          this.isEmailLoading = true;

          /* CHECK SSO PERSONAL EMAIL FUNCTIONALITY START */
          this.authService.ssoPersonalEmail(this.ssoAlternativeEmail).subscribe(response => {
            console.log(response);
            if (response['status'] == 'email never used') {
              this.sendOtpVerificationToUserByEmail(this.ssoAlternativeEmail);
            } else if(response['status'] == 'already used as primary email') {
              var ihl_id = response['id'];
              this.loginUsingIhlId(ihl_id);
            } else if(response['status'] == 'already used as alternate email') {
              this.snackBar.open("Already used as alternate Mail, choose different", '', {
                duration: 1000,
                panelClass: ['error'],
              });
              this.isEmailLoading = false;
            }
          });
        }
        /* CHECK SSO PERSONAL EMAIL FUNCTIONALITY END */
      }
    } else {
      this.ssoAlternativeEmailErr = true;
    }
  }

  onAlternativeEmailOTPChange(value: any){
    console.log(value)
    this.ssoAlternativeEmailOTPEntered = value;
  }

  validateAlternativeEmailOTP() {
    console.log(this.ssoAlternativeEmailOTP);
    console.log(this.ssoAlternativeEmailOTPEntered);
    if (this.ssoAlternativeEmailOTPEntered != undefined) {
      this.ssoAlternativeEmailOTPLoading = true;
      if (this.ssoAlternativeEmailOTP == this.ssoAlternativeEmailOTPEntered) {
        this.ssoAlternativeEmailOTPLoading = false;
        this.ssoAlternativeEmailInvalidOTP = false;
        this.ssoAlternativeEmailOTPMsg = '';

        if (this.convertSSOToIHLFlow)
          this.showPasswordSection();
        else
          this.loginUsingIhlId(this.ssoUserIhlId);
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

  isSsoLoggedIn(): boolean {
    return this.msalService.instance.getActiveAccount() != null;
  }

  ssoLogin(persistentLogin = false) {
    this.ssoLoading = true;
    const loginRequest = {
      scopes: ['email', 'User.Read'], // Adjust scopes as needed
    };
    this.msalService.loginPopup(loginRequest).subscribe((response: AuthenticationResult) => {
      console.log(response);
      this.msalService.instance.setActiveAccount(response.account);
      this.ssoEmail = response.account.username;
      console.log(this.ssoEmail);
      this.validateSSOToken(response.accessToken, 'microsoft', persistentLogin);
    }, (error) => {
      // Handle popup close event
      if (error.errorCode === 'user_cancelled') {
        console.log('Popup was closed by the user.');
        if (persistentLogin) {
          this.ssoLoading = false;
        } else {
          this.convertSSOToIHLFlow = true;
          this.ssoLoading = false;
          const dialogRef = this.dialog.open(ModalComponent);
          this._constants.ihlAccountErrModal = true;
        }
      } else {
        // Handle other errors
        console.error('An error occurred during login', error);
      }
    });
  }

  ssoLogout() {
    localStorage.removeItem('loginType');
    this.msalService.logout();
  }

  validateSSOToken(token, ssoType, persistentLogin = false) {
    this.authService.validateSSOToken({'sso_token': token, "sso_type": ssoType}).subscribe(data => {
      console.log(data);
      if ('response' in data && data['response'] == 'exception') {
        this.ssoLoading = false;
        this.snackBar.open("Something went wrong", '',{
          duration: 3000,
          panelClass: ['error'],
        });
      } else if ('response' in data && data['response'] == 'user already has an primary account in this email') {
        this.ssoLoading = false;
        if (persistentLogin) {
          this.ssoRegistrationFlow = true;
        } else {
          this._constants.ihlAccountExistModal = true;
          this.ssoUserIhlId = data['id'];
          const dialogRef = this.dialog.open(ModalComponent);
        }
      } else if ('response' in data && data['response'] == 'user_not_exist') {
        this.ssoLoading = false;
        if (persistentLogin) {
          this.ssoRegistrationFlow = true;
        } else {
          const dialogRef = this.dialog.open(ModalComponent);
          this._constants.ihlAccountNotExistModal = true;
        }
      } else if ('Token' in data) {
          this.loginUsingIhlId(data['User']['id'], false);
      }
    });
  }

  showSSOAlternativeEmailSection() {
    console.log('Alternative Email');
    this.ssoAlternativeEmailSection = true;
    this.ssoOrganizationSearch = false;
  }

  sendOtpVerificationToUserByEmail(alternativeEmail) {
    this.authService.sendOtpVerificationToUserByEmail(alternativeEmail).subscribe(response => {
      console.log(response);
      if ('OTP' in response && response['OTP'] != '') {
        this.ssoAlternativeEmailOTP = response['OTP'];
        this.validateOtp = true;
        this.ssoOTPSection = true;
        this.ssoAlternativeEmailSection = false;
      }
    });
  }

  showPasswordSection() {
    console.log('Set Password Section');
    this.ssoOTPSection = false;
    this.setPasswordSection = true;
  }

  loginUsingIhlId(userIhlId, editProfileAPI = true) {
    try {
      this.authService.getAPItokenKey().subscribe(data => {
        // console.log(data['ApiKey']);
        console.log(data);
        let apikey = data['ApiKey']
        localStorage.setItem('apiKey', data["ApiKey"]);
        // console.log(User_ihl_id);
        let userId:any = {
          id : userIhlId,
        }
        this.authService.authenticateIhlId(userId, apikey).subscribe(response => {
          console.log(response);
          if(response == 'exception'){
            this.isLoading = false;
            this.ssoLoading = false;

            if (this.convertSSOToIHLFlow) {
              this.snackBar.open("Something went wrong", '',{
                duration: 1000,
                panelClass: ['error'],
              });
            } else {
              this.snackBar.open("Invalid Login", '',{
                duration: 1000,
                panelClass: ['error'],
              });
            }
          } else {
            this.isLoading = false;
            this.ssoLoading = false;
            localStorage.setItem('loginType', 'ssoLogin');

            if (this.convertSSOToIHLFlow) {
              this.ssoAlternativeEmailSection = false;
              this.ssoOTPSection = true;
              this.ssoApiKey = apikey;
              this.ssoToken = response['Token'];
              return;
            }

            this.authService.storeUserDataIhl(response['Token'], response['User'], response['LastCheckin']);
            
            if (editProfileAPI) {
              let ssoUserDetail = response['User'];
              ssoUserDetail['personal_email'] = this.ssoAlternativeEmail;
              ssoUserDetail['email'] = this.ssoEmail;
              console.log(JSON.stringify(ssoUserDetail));
              let IHLUserToken = localStorage.getItem('id_token');
              console.log(userIhlId);
              this.authServiceFile.postEditProfieInput(apikey,IHLUserToken,userIhlId,JSON.stringify(ssoUserDetail)).subscribe(data => {
                console.log(data);
                if(data == "Forbidden"){
                  // throw "Something went wrong.";
                  this.snackBar.open("Something went wrong", '',{
                    duration: 1000,
                    panelClass: ['error'],
                  });
                }else if(data == "Updated"){
                  this.snackBar.open("Updated successfully", '',{
                    duration: 1000,
                    panelClass: ['success'],
                  });
                }
              })
            }
            /* CHECK USER AFFILIATED DATA FUNCTIONALITY START */
            //this.affiliationUniqueName
            if(response.User.user_affiliate && response.User.user_affiliate !=''){
              var userAffiliationArray = response.User.user_affiliate;  
              for (var key in userAffiliationArray) {
                if (userAffiliationArray.hasOwnProperty(key)) {
                    if (userAffiliationArray[key].affilate_unique_name === this.affiliationUniqueName) {
                        userAffiliationArray[key].is_sso = true;
                    }
                }
              }
              console.log(userAffiliationArray)
              var data = {
                'User':{'user_affiliate':userAffiliationArray}
              }
              console.log(data)
              let parms = {'data': JSON.stringify(data), 'TokenInfo': {'ApiToken': apikey, 'Token': response.Token}};
              this.addAffiliatedUserDetails(response.User.id , parms);
            }else{
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
                console.log(af_no1_data)            
                let parms = {'data': JSON.stringify(af_no1_data), 'TokenInfo': {'ApiToken': apikey, 'Token': response.Token}};
                this.addAffiliatedUserDetails(response.User.id , parms);
              });
            }
            /* CHECK USER AFFILIATED DATA FUNCTIONALITY END */
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

  /* CONVERT SSO TO IHL ACCOUNT FUNCTIONALITY START */
  getSSOUserInfoByAlternativeEmail(alternativeEmail) {
    this.authService.getSSOUserByIhlId({'email': alternativeEmail}).subscribe(data => {
      console.log(data);
      this.isEmailLoading = false;
      if (data['status'] == 'success') {
        if ('response' in data && data['response'].hasOwnProperty('OTP')) {
          this.ssoAlternativeEmailOTP = data['response']['OTP'];
          this.ssoIhlUserId = data['response']['ihl_user_id'];
          this.loginUsingIhlId(this.ssoIhlUserId);
        }
      } else {
        this.ssoAlternativeEmailExist = false;
      }
    })
  }

  ssoUserSetPassword() {
    this.passwordLoading = true;
    const newPassword = this.passwordForm.get('newPassword').value;
    let data = {'email': this.ssoAlternativeEmail, password: newPassword};
    this.authService.ssoUserSetPassword(data, this.ssoApiKey, this.ssoToken).subscribe(data => {
      console.log(data);
      if (data['status'] == 'success') {
        let parms = {'User': {'email': this.ssoAlternativeEmail, 'personal_email': ''}};
        console.log(parms);
        this.authServiceFile.postEditProfieInput(this.ssoApiKey, this.ssoToken, this.ssoIhlUserId, JSON.stringify(parms)).subscribe(data => {
          console.log(data);
          const dialogRef = this.dialog.open(ModalComponent);
          this._constants.isConvertSSoToIHLSuccessModal = true;
          this.passwordLoading = false;
        });
      }
    });
  }

  resetLoginPage() {
      this.viewMode = 'tab1';
      this.setPasswordSection = false;
      this.ssoLoginButton = false;
      this.ssoGoogleLoginBtn = false;
      this.ssoOrganizationSearch = true;
      this.googleLoggedIn = false;
      this.orgControl.reset();
      this.orgName = [];
  }

  addAffiliatedUserDetails(UserId:any,parms:any){
    this.authService.addAffiliatedUserDetails(UserId, parms).subscribe((data: any) => {
      let lastCheckin = JSON.stringify(data);
      console.log(data);
      localStorage.setItem("LastCheckin", this._constants.aesEncryption(lastCheckin));
    });
   }

  /* CONVERT SSO TO IHL ACCOUNT FUNCTIONALITY END */

  /* SSO MICROSOFT LOGIN FUNCTIONALITY END */

  /* SSO GOOGLE LOGIN FUNCTIONALITY START */

  signInWithGoogle() {
    this.ssoLoading = true;
    this.googleAuthService.signIn(GoogleLoginProvider.PROVIDER_ID)
    .then((userData) => {
      console.log('Google login successful', userData);
      this.user = userData;
      if (this.user != null) {
        this.validateSSOToken(this.user.response['id_token'], 'google');
        this.ssoEmail = this.user.email;
      }
      this.googleLoggedIn = (userData != null);
    })
    .catch((error) => {
      console.log('Error during Google login', error);
      this.convertSSOToIHLFlow = true;
      this.ssoLoading = false;
      const dialogRef = this.dialog.open(ModalComponent);
      this._constants.ihlAccountErrModal = true;
    });
  }

  signOutWithGoogle() {
    this.googleLoggedIn = false;
    this.googleAuthService.signOut();
  }

  isGoogleLoggedIn() {
    return this.googleLoggedIn;
  }

  showLogin() {
    this.ssoRegistrationFlow = false;
  }

  /* SSO GOOGLE LOGIN FUNCTIONALITY END */

}
