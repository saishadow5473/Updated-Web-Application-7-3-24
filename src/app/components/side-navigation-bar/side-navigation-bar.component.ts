import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { AuthServiceLogin } from 'src/app/services/auth.service.login';
import { ConstantsService } from 'src/app/services/constants.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ModalComponent } from '../modal/modal.component';
import { EventEmitterService } from 'src/app/services/event-emitter.service';
import { TeleconsultationCrossbarService } from 'src/app/services/tele-consult-crossbar.service';
import { Display } from '../sidebar/sidebar.component';
import { TeleConsultService } from 'src/app/services/tele-consult.service';

import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState,
} from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-side-navigation-bar',
  templateUrl: './side-navigation-bar.component.html',
  styleUrls: ['./side-navigation-bar.component.css']
})
export class SideNavigationBarComponent implements OnInit {
  @ViewChild('drawer') drawer: any;
  public selectedItem : string = '';
   public isHandset$: Observable<boolean> = this.breakpointObserver
     .observe(Breakpoints.Handset)
     .pipe(map((result: BreakpointState) => result.matches));
  
  userName: any
  userScore: any
  user: any
  userInfo: any
  gender: any
  userLastName: any
  metricsDisable: any
  //notShowMetrics:boolean = false;
  genderImg = "";
  subscription:any;
  surveyComplete:boolean;
  displayMenu: Display<string>;
  public innerWidth: any;

  constructor(private router: Router, private authService: AuthService, private breakpointObserver: BreakpointObserver,
    public _constants: ConstantsService, private authServiceLogin: AuthServiceLogin, private sanitizer: DomSanitizer, private snackBar: MatSnackBar, 
    private dialog: MatDialog, 
    private eventEmitterService: EventEmitterService,
    private teleConsultCrossbarService:TeleconsultationCrossbarService,
    private _teleConsultService: TeleConsultService) {
   /*  if(this._constants.userFirstName != null){
      this.user = this._constants.userFirstName;
      if( this._constants.userLastName != null ||  this._constants.userLastName != undefined){
        this.user = this._constants.userFirstName+" "+ this._constants.userLastName;
      }
    } else {
      this.userLastName = this.authService.getUserLastName();
      this._constants.userLastName = this.userLastName;
  
      if(this.userLastName === undefined){
        this.user = this.authService.getUserFirstName();
        this._constants.userFirstName = this.user; 
      }
      else{
        this.user = this.authService.getUser();
        this._constants.userFirstName = this.user; 
      }
    }

    if(this._constants.userGender != null){
      this.gender = this._constants.userGender;
      if(this.gender == "m" || this.gender == "male"){
        this.genderImg = "assets/img/avatar-male.png"
      }
      else{
        this.genderImg = "assets/img/avatar-female.png"
      }
    } else {   
      if(this.user != "null null"){
        this.userInfo = JSON.parse(localStorage.getItem('userData'))
        if(this.userInfo.gender == "m" || this.userInfo.gender == "male"){
          this._constants.userGender = 'm';
          this.genderImg = "assets/img/avatar-male.png"
        }
        else{
          this._constants.userGender = 'f';
          this.genderImg = "assets/img/avatar-female.png"
        }
      }
    } */
   }

  ngOnInit() {
    this.subscription = this.authServiceLogin.on('score-update').subscribe(() => this.scoreUpdate());
    this.subscription = this.authServiceLogin.on('basic-info-update').subscribe(() => this.basicInfoUpdate());
    this.subscription = this.authServiceLogin.on('profile-photo-update').subscribe(() => this.profilePicUpdate());

    let scoreFetch = this.authServiceLogin.scoreFetch();
    if(this._constants.takeSurveyScore != null){
      this.userScore = this._constants.takeSurveyScore;
      this.surveyComplete =  this._constants.takeSurveyScoreShow;
    } else {
      this.userScore = scoreFetch.score;
      this.surveyComplete = scoreFetch.questionComptionStatus;
    }

    if(this._constants.userFirstName != null){
      //alert("1 = "+ this.user);
      if( this._constants.userLastName != null &&  this._constants.userLastName != undefined && this._constants.userLastName != ''){
        //alert("Test" + this._constants.userFirstName+" - "+ this._constants.userLastName);
        this.user = this._constants.userFirstName+" "+ this._constants.userLastName;
        //alert("2 = "+ this.user);
      } else {        
        this.user = this._constants.userFirstName;
        //alert("3 = "+ this.user);
      }
    } else {
      this.user =this.authService.getUser();
      this._constants.userFirstName = this.authService.getUserFirstName();
      this._constants.userLastName = this.authService.getUserLastName();
    }

    if(this._constants.userGender != null){
      this.gender = this._constants.userGender;
      this.userInfo = JSON.parse(this._constants.aesDecryption('userData'))
      this._constants.userProfilePic = this.userInfo.photo;
      this._constants.userProfilePicType = "image/" + this.userInfo.photofmt;
      if(this._constants.userProfilePic == null || this._constants.userProfilePic == undefined)
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
        this._constants.userProfilePic = this.userInfo.photo;
        this._constants.userProfilePicType = "image/" + this.userInfo.photofmt;
        if(this.userInfo != undefined){
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
    }
    this.metricsDisable = this._constants.aesDecryption("affiliateProgram");

    if (this.metricsDisable == undefined || this.metricsDisable == null || this.metricsDisable == "") {
      this._constants.notShowMetrics = true;
    }

    this.displayMenu = new Display<string>("none");
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
    if(this._constants.userProfilePic == null || this._constants.userProfilePic == undefined)
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
    this.genderImg  = `data:${this._constants.userProfilePicType};base64,${this._constants.userProfilePic}`;        
  }

  closeSideNav() {
    if (this.drawer._mode=='over') {
      this.drawer.close();
    }
  }
  logOut(){    
    this.authService.globalVariableReset();
    this.teleConsultCrossbarService.closeConnection();
    delete  this._teleConsultService.nativeWindow.CRISP_TOKEN_ID;
    this._teleConsultService.nativeWindow.$crisp.push(["do", "session:reset"]);
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

  dt(){
    this.router.navigate(['export'])
  }
  teleCall(){
    this.authService.basicInfoCheck();
    setTimeout(() => {      
      if(!this._constants.basicInfoNeed){
        //this.authService.publish('tele-call');
        
        this._constants.processingContent = true;
        this.dialog.open(ModalComponent);
        this.authService.teleCallRedirection().subscribe(data =>  {
          console.log(data);
          if(data !== undefined && data !== null){            
            this._constants.processingContent = false;            
            this.eventEmitterService.onModalClose();  
            window.location.href = data;
          }else{
          }
        });
      } else {
        this.snackBar.open("Please enter the basic info ", '',{
          duration: 10000,
          panelClass: ['error'],
        });
        this.router.navigate(['export'])
      }      
    },1000 * 1);
  }

  generalConsultationFlow() {this._constants.teleconsultationFlowSelected = 'genric';}
 
}
