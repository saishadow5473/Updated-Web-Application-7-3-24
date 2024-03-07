import { Component, OnInit, HostListener,  ViewChild, ElementRef  } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { AuthServiceLogin } from 'src/app/services/auth.service.login';
import { ConstantsService } from 'src/app/services/constants.service';
import { TeleconsultationCrossbarService } from 'src/app/services/tele-consult-crossbar.service';
import { TeleConsultService } from 'src/app/services/tele-consult.service';
import { Router } from '@angular/router'
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-headbar',
  templateUrl: './headbar.component.html',
  styleUrls: ['./headbar.component.css']
})
export class HeadbarComponent implements OnInit {
  query : string = ""
  user: any
  userScore: any
  userInfo: any
  gender: any
  userLastName: any
  surveyComplete: boolean = false;
  genderImg: any;
  vaptEnabled = this._constants.vaptEnabled;
  subscription: any;

  //infoBox:boolean = false;

  userData: any;
  enableJointUsersMenuList: boolean = false;
  public innerWidth: any;

  constructor(
    private authService: AuthService,
    private authServiceLogin: AuthServiceLogin,
    private router: Router,    
    private _constants: ConstantsService,
    private sanitizer: DomSanitizer,
    private teleConsultCrossbarService:TeleconsultationCrossbarService,
    private _teleConsultService: TeleConsultService
  ) { 
    

    
  }

  logOut(){
    if(this.vaptEnabled){
      this.authServiceLogin.logOut(this.userInfo.email).subscribe((data) => {
        if(data == "all sessions cleared" || data == "portal sessions cleared" || data == "no active sessions"){
          // console.log(data);
          this.logOutRedirect();
        }
      })
    }else{
      this.teleConsultCrossbarService.closeConnection();
      delete  this._teleConsultService.nativeWindow.CRISP_TOKEN_ID;
      this._teleConsultService.nativeWindow.$crisp.push(["do", "session:reset"]);
  
      this.authService.globalVariableReset();
      if(this._constants.aesDecryption("loginValue") != undefined){
        localStorage.clear();
        this.authService.LastCheckin = [];
        window.location.href="../index.html";
      } else {
        localStorage.clear();
        this.authService.LastCheckin = [];
        this.router.navigate(['/']);
      }
    }
  }

  logOutRedirect(){
    // console.log("Log out");
    this.teleConsultCrossbarService.closeConnection();
    delete  this._teleConsultService.nativeWindow.CRISP_TOKEN_ID;
    this._teleConsultService.nativeWindow.$crisp.push(["do", "session:reset"]);

    this.authService.globalVariableReset();
    localStorage.clear();
    this.authService.LastCheckin = [];
    this.router.navigate(['/']);
  }

  dt(){
    this.router.navigate(['export'])
  }
  ngOnInit() {
    
    this.subscription = this.authServiceLogin.on('score-update').subscribe(() => this.scoreUpdate());

    this.subscription = this.authServiceLogin.on('basic-info-update').subscribe(() => this.basicInfoUpdate());

    this.subscription = this.authServiceLogin.on('profile-photo-update').subscribe(() => this.profilePicUpdate());

    //this.drawer.close();   
    this.authService.checkSession();
    this.authService.liveVideoCallWindow();  
    
    let scoreFetch = this.authServiceLogin.scoreFetch();
    /* this.userScore = scoreFetch.score;
    this.surveyComplete = scoreFetch.questionComptionStatus; */
    if(this._constants.takeSurveyScore != null){
      this.userScore = this._constants.takeSurveyScore;
      this.surveyComplete =  this._constants.takeSurveyScoreShow;
    } else {
      this.userScore = scoreFetch.score;
      this.surveyComplete = scoreFetch.questionComptionStatus;
    }

    
    if(this._constants.userFirstName != null){
      if( this._constants.userLastName != null &&  this._constants.userLastName != undefined && this._constants.userLastName != ''){
        this.user = this._constants.userFirstName+" "+ this._constants.userLastName;
      } else {        
        this.user = this._constants.userFirstName;
      }
    } else {
      this.user =this.authService.getUser();
      this._constants.userFirstName = this.authService.getUserFirstName();
      this._constants.userLastName = this.authService.getUserLastName();
    }

    if(this._constants.userGender != null){
      this.gender = this._constants.userGender;
      this.userInfo = JSON.parse(this._constants.aesDecryption('userData'));
      this._constants.userProfilePic = this.userInfo.photo;
      this._constants.userProfilePicType = "image/" + this.userInfo.photofmt;
      if(this._constants.userProfilePic == undefined || this._constants.userProfilePic == null)
      {
        if(this.gender == "m" || this.gender == "male"){
          this.genderImg = "assets/img/avatar-male.png"
        }
        else{
          this.genderImg = "assets/img/avatar-female.png"
        }
      }
      else{
        this.genderImg = "data:" + this._constants.userProfilePicType + ";base64," + this._constants.userProfilePic;
      }  
    }
    else {   
      if(this.user != "null null"){
        this.userInfo = JSON.parse(this._constants.aesDecryption('userData'))
        if(this.userInfo.gender == "m" || this.userInfo.gender == "male"){
          this._constants.userGender = 'm';
          this.genderImg = "assets/img/avatar-male.png"
        }
        else{
          this._constants.userGender = 'f';
          this.genderImg = "assets/img/avatar-female.png"
        }
      }
    }


    /* console.log("scoreFetch");
    console.log(scoreFetch); */
    if (this._constants.userProfileData == undefined ||  this._constants.userProfileData == null) {
      this._constants.userProfileData = JSON.parse(this._constants.aesDecryption('userData'));
    }
    
    if (this._constants.userProfileData != null && 'joint_user_detail_list' in this._constants.userProfileData && Object.keys(this._constants.userProfileData.joint_user_detail_list).length > 0 ) {
      this.enableJointUsersMenuList = true;
    }else{
      this.enableJointUsersMenuList = false;
    }
    this.innerWidth = window.innerWidth;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
  }

  redirectToSurvey(){
    this.router.navigate(['takesurvey']);
  }

  scoreUpdate(){
    this.userScore = this._constants.takeSurveyScore;
    this.surveyComplete =  this._constants.takeSurveyScoreShow;
  }

  basicInfoUpdate(){
    this.gender = this._constants.userGender;
    this.user = this._constants.userFirstName+" "+ this._constants.userLastName;
    if(this._constants.userProfilePic == null)
    {
      if(this.gender == "m" || this.gender == "male"){
        this.genderImg = "assets/img/avatar-male.png"
      }
      else{
        this.genderImg = "assets/img/avatar-female.png"
      }
    }
  }

  profilePicUpdate(){
    this.genderImg = this.sanitizer.bypassSecurityTrustResourceUrl(`data:${this._constants.userProfilePicType};base64,${this._constants.userProfilePic}`);
  }
  /* infoContentShow();
  
  infoContentShow(){         
    alert("test");
    setTimeout(function(){
      this.infoBox = true;
    }, 5000);
  }

  infoTextHide(){
    this.infoBox = false;
  } 

  redirectToTakeSurvey(){
    this.infoBox = false;
    this.router.navigate(['takesurvey/']);
  } */

  /* search(){
    this.authService.fetchUser(this.query).subscribe(data => {
      if(!data["success"])
        return false     
      this.router.navigate(['search/'+this.query])
    })
  } */

  websiteRedirect(){
         
    localStorage.setItem("websiteRedirect", this._constants.aesEncryption("true"));
    localStorage.setItem("teleCall", this._constants.aesEncryption('false'));
    this.router.navigate(['dashboard'])
    //var currentUrl = window.location.href;
    //window.location.href = "/dashboard";
    //var tempUrl = currentUrl.split("portal");
    //window.location.href = tempUrl[0];
    /* if(localStorage.getItem("websiteRedirect") != undefined){ 
    } else {
      // write portal functionality if required...
    } */
  }

  prescriptionFlow(){
    this.router.navigate(['/consult-summary']);
   /*  alert("test");
    this._teleConsultService.oneMgCall().subscribe(data =>  {
      console.log(data);
    }) */
  }

  onEmptyUserList(value: boolean): void{
    this.enableJointUsersMenuList = value;
  }


}
