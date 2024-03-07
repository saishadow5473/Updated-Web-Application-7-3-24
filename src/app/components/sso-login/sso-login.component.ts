import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from "@angular/forms";
import { AuthServiceLogin } from 'src/app/services/auth.service.login';
import { AuthService } from 'src/app/services/auth.service';
import { ConstantsService } from 'src/app/services/constants.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-sso-login',
  templateUrl: './sso-login.component.html',
  styleUrls: ['./sso-login.component.css']
})
export class SsoLoginComponent implements OnInit, OnDestroy {
  orgControl = new FormControl();
  mailControl = new FormControl();
  org_name:any;
  OrgList:any;
  orgEmail:any;
  ssoDetail:any;
  personalEmail:any;
  isLoading:boolean = false;
  isLoadingMail:boolean = false;
  mailError:boolean = false;
  invalidOrgName:boolean = false;
  isRegisterFlow:boolean = false;
  isNewUserRegister:boolean = false;
  isOrgSubmit:boolean = true;

  constructor(
    private router: Router,
    private authServiceLogin: AuthServiceLogin,
    private _constants: ConstantsService,
    private snackBar: MatSnackBar,
    private authService: AuthService,
  ) { }


  ngOnInit() {
    this.ssoDetail = JSON.parse(this._constants.aesDecryption('orgSign'));
  }
  
  pushOrg(orgNi: string){
    if(orgNi != '' && orgNi != undefined && orgNi != null){
      // console.log(orgNi);
      var allOrg = [];
      this.authServiceLogin.ssoOrganizationName(orgNi).subscribe(data => {
        // console.log(data);
        for(var i in data){
          allOrg.push(data[i]['company_name']);
        }
        this.loadOrg(allOrg);
      })
    }else{
      allOrg = [];
      this.loadOrg(allOrg);
    }
  }

  PersonalMailCheck(perEmail: any){
    console.log(perEmail);
    if(perEmail.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)){
      this.mailError = false;
    }else{
      this.mailError = true;
    }
  }

  loadOrg(data) {
    this.OrgList = data;
    // console.log(this.OrgList);
    this.org_name =  this.OrgList.map( function (orgName) {
      return {
        value: orgName,
        display: orgName
      };
    });
    // console.log(this.org_name);
  }

 organizationName(){
  if(this.orgControl.value != '' && this.orgControl.value != undefined && this.orgControl.value != null){
    // console.log(this.OrgList.includes(this.orgControl.value));
    if(this.OrgList.includes(this.orgControl.value)){
      this.invalidOrgName = false;
      // console.log(this.orgControl.value);
      this.isLoading = true;

      this.openIframe(this.orgControl.value);

    }else{
      this.invalidOrgName = true;
    }
  }else{
    this.invalidOrgName = true;
  }
 }

 openIframe(org){
  console.log(org);
  this.orgEmail = 'abc2@indiahealthlink.com';
  let response = 'Got SSO Token';
  let User_ihl_id = 'N6wKpKGxoUS0TlVpoU81tw';
  console.log(this.ssoDetail.userFrom);
  if(response == 'Got SSO Token' && this.ssoDetail.userFrom == 'register'){

    this.isRegisterFlow = true;
    this.isOrgSubmit = false;
  }else if(response == 'Got SSO Token' && this.ssoDetail.userFrom == 'login'){
    this.loginUsingID(User_ihl_id);
  }else{
    this.isLoading = false;
    this.snackBar.open("Invalid Login", '',{
      duration: 1000,
      panelClass: ['error'],
    });
  }
 }

 sendPersonalMail(){
  console.log(this.mailControl.value);
  this.personalEmail = this.mailControl.value;
  if(this.mailControl.value.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/) && this.personalEmail != this.orgEmail && this.orgEmail.split('@')[1].split('.')[0] != this.personalEmail.split('@')[1].split('.')[0]){
    this.authServiceLogin.ssoPersonalEmail(this.mailControl.value).subscribe(response => {
      console.log(response);
      if(response['status'] == 'email never used'){
        this.isOrgSubmit = false;
        this.isRegisterFlow = false;
        this.isNewUserRegister = true;
        // this.router.navigate(['/register']);

      }else if(response['status'] == 'already used as primary email'){
        var ihl_id = response['id'];
        this.loginUsingID(ihl_id);

      }else if(response['status'] == 'already used as alternate email'){
        this.snackBar.open("Already used as alternate Mail, choose different", '',{
          duration: 1000,
          panelClass: ['error'],
        });
      }
    })
  }else{
    this.snackBar.open("Enter valid Mail", '',{
      duration: 1000,
      panelClass: ['error'],
    });
  }
 }

 loginUsingID(User_ihl_id){
  try {
    this.authServiceLogin.getAPItokenKey().subscribe(data => {
      // console.log(data['ApiKey']);
      let apikey = data['ApiKey']
      localStorage.setItem('apiKey', data["ApiKey"]);
      // console.log(User_ihl_id);
      let userId:any = {
        id : User_ihl_id,
      }
      this.authServiceLogin.authenticateIhlId(userId, apikey).subscribe(response => {
        // console.log(response);
        if(response == 'exception'){
          this.isLoading = false;
          this.snackBar.open("Invalid Login", '',{
            duration: 1000,
            panelClass: ['error'],
          });
        }else{
          this.isLoading = false;
          this.authServiceLogin.storeUserDataIhl(response['Token'], response['User'], response['LastCheckin']);
          if(this.ssoDetail.userFrom == 'register'){
            let ssoUserDetail = response['User'];
            ssoUserDetail['personal_email'] = this.personalEmail;
            ssoUserDetail['email'] = this.orgEmail;
            console.log(JSON.stringify(ssoUserDetail));
            let IHLUserToken = localStorage.getItem('id_token');
            console.log(User_ihl_id);
            this.authService.postEditProfieInput(apikey,IHLUserToken,User_ihl_id,JSON.stringify(ssoUserDetail)).subscribe(data => {
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

 ngOnDestroy() {
  localStorage.removeItem('orgSign');
 }

  showLoginPage() {
    this.router.navigate(['']);
  }

}
