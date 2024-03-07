import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { AuthService } from './services/auth.service'
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ModalComponent } from './components/modal/modal.component';
import { ConstantsService } from './services/constants.service';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import { MatTabGroup } from '@angular/material/tabs';
import { SafeResourceUrl, DomSanitizer} from '@angular/platform-browser';
import { TeleConsultService } from './services/tele-consult.service';
import {Idle, DEFAULT_INTERRUPTSOURCES} from '@ng-idle/core';
import {Keepalive} from '@ng-idle/keepalive';
import { AuthServiceLogin } from 'src/app/services/auth.service.login';
import { TeleconsultationCrossbarService } from './services/tele-consult-crossbar.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ihl';
  subscription: any; videoCallAPI:string = '';
  sanitizedVideoCallAPI:SafeResourceUrl;
  screenWidth: any;
  idleState = 'Not started.';
  timedOut = false;
  public showSessionPopup: boolean = false;
  lastPing?: Date = null;
  vaptEnabled = this._constant.vaptEnabled;

  constructor(
    private authService: AuthService,
    private dialog: MatDialog,
    public _constant: ConstantsService,
    private router: Router,
    private snackBar: MatSnackBar,
    private sanitizer: DomSanitizer,
    private teleService: TeleConsultService,
    private idle: Idle, 
    private keepalive: Keepalive,
    private teleConsultCrossbarService: TeleconsultationCrossbarService,
    private authServiceLogin: AuthServiceLogin) {
    //   window.addEventListener("beforeunload", (event) => {
    //     event.preventDefault();
    //     event.returnValue = "Unsaved modifications";
    //     return event;
    //  });

      /* SESSSION TIMEOUT FUNCTIONALITY START */  

      // sets an idle timeout of 5 seconds, for testing purposes.
      // idle.setIdle(900);
      idle.setIdle(9000);// temporary solution increased the time by 2.5hours from 0.15mins
      
      // sets a timeout period of 5 seconds. after 10 seconds of inactivity, the user will be considered timed out.
      idle.setTimeout(5);
      // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
      idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

      idle.onIdleEnd.subscribe(() => {
        this.idleState = 'No longer idle.'
        this.showSessionPopup = false;
      });

      idle.onTimeout.subscribe(() => {
        this.idleState = 'Your session was expired!';
        localStorage.setItem('sessionExpired', 'true');
        this.timedOut = true;
      });

      idle.onIdleStart.subscribe(() => this.idleState = 'You\'ve gone idle!');

      idle.onTimeoutWarning.subscribe((countdown) => {
        if(this.router.url != "/teleconsult-video-call" && this.router.url != "/genixConsultation"){
          this.showSessionPopup = true;
          this.idleState = 'You will time out in ' + countdown + ' seconds!'
        }
      });

      // sets the ping interval to 15 seconds
      keepalive.interval(15);

      keepalive.onPing.subscribe(() => this.lastPing = new Date());
      
      /* SESSSION TIMEOUT FUNCTIONALITY END */

    }
    @HostListener('window:resize', ['$event'])
    @ViewChild(MatTabGroup) tabGroup!: MatTabGroup;

  async ngOnInit() {
    this.screenWidth = window.innerWidth;

    let apiKey = await this.authService.getApiHeaderToken().toPromise();
    localStorage.setItem('api_header_token', apiKey);

    //open model box for affiliated users' first login
    if(this._constant.aesDecryption('affiliated-user-first-login') == 'true' && this._constant.aesDecryption('isUserLoggedIn') == 'true') {
      this._constant.affiliatedFirstLoginModelBox = true;
      // this.dialog.open(ModalComponent);
    }

    if(this._constant.aesDecryption('teleCall') ==  'true'){
      this.authService.basicInfoCheck();
      setTimeout(() => {
        if(!this._constant.basicInfoNeed){
          //this.teleCall();
          this.router.navigate(['teleconsultation']);
        } else {
          this.snackBar.open("Please enter the basic info ", '',{
            duration: 10000,
            panelClass: ['error'],
          });
          this.router.navigate(['export'])
        }
      },1000 * 1);
    } else if(this._constant.aesDecryption('challenge') == 'true') {
      setTimeout(() => {
        localStorage.removeItem('challenge');
        this.router.navigate(['challenges']);
      }, 1000 * 1);
    }
    this.subscription = this.authService.on('tele-call').subscribe(() => this.teleCall());


  	this.videoCallAPI = 'https://youtube.com/embed/CptYICtnKkY';
    this.sanitizedVideoCallAPI = this.sanitizer.bypassSecurityTrustResourceUrl(this.videoCallAPI);
  }

  sessionIdleWatch() {
    let sessionExpired = localStorage.getItem('sessionExpired');

    if (sessionExpired)
      this.logout();

    this.idle.watch();
    this.timedOut = false;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  teleCall(){
    //this._constant.teleConsultaionAgree = true;
    //this.dialog.open(ModalComponent);
  }

  expandVideoCall(){
    this.router.navigate(['teleconsult-video-call']);
    //this._constant.videoWindow = false;
  }

  changeOfRoutes(){
    /**
     * @description please comment the below code when not using the crisp chat window.
     */
    if(this.router.url === "/teleconsult-video-call" || this.router.url === "/genixConsultation" || this.router.url === "/" || this.router.url === "/register") (window as any).$crisp.push(['do', 'chat:hide']);
    else (window as any).$crisp.push(['do', 'chat:show']);

    /**
     * @description below code for tours tool tip.
     */
     if(this._constant.aesDecryption('isUserLoggedIn') != 'true'){
      return 0;
     }

     if(this.router.url === "/"){
      return 0;
     }

     if ('userData' in localStorage) {
      let isIntroDone = JSON.parse(this._constant.aesDecryption('userData'))['introDone'];
      let affUserFirstLogin = JSON.parse(this._constant.aesDecryption('affiliated-user-first-login'));
      console.log(isIntroDone);
      if(isIntroDone == undefined || isIntroDone == false) {
        let isIntroDoneLocalData = JSON.parse(this._constant.aesDecryption('isIntroDoneLocalData'));
        let checklist = [null, '', undefined, false, 'false', 'null', 'undefined'];
        if(checklist.includes(isIntroDoneLocalData) && checklist.includes(affUserFirstLogin)) {
          if(window.innerWidth > 500) {
            if(this.router.url !== "/takesurvey" && this.router.url !== "/export"){
              if('orgUser' in localStorage){
                let userData = JSON.parse(this._constant.aesDecryption('userData'));
                if("data_sharing_consent" in userData) {
                  if(userData['data_sharing_consent'] == null || userData['data_sharing_consent'] == "null" || userData['data_sharing_consent'] == "" || userData['data_sharing_consent'] == "undefined" || userData['data_sharing_consent'] == undefined || Object.keys(userData['data_sharing_consent']).length < 9){
                     // create new object
                    this._constant.orgUserData = JSON.parse(this._constant.aesDecryption('orgUser'));
                    localStorage.setItem('isIntroDoneLocalData', this._constant.aesEncryption('true'));
                     this._constant.orgUserConsentForm = true;
                    this.dialog.open(ModalComponent);
                    // show model box to user and store the data to DB then show the init the UI Tour
                  } else {
                    // length is grter than 8 - so no need to update
                    this._constant.initUITour = true;
                    this.dialog.open(ModalComponent);
                    localStorage.setItem('isIntroDoneLocalData', this._constant.aesEncryption('true'));
                  }
                } else {
                  this._constant.orgUserData = JSON.parse(this._constant.aesDecryption('orgUser'));
                  //localStorage.removeItem("orgUser");
                  localStorage.setItem('isIntroDoneLocalData', this._constant.aesEncryption('true'));
                  this._constant.orgUserConsentForm = true;
                  this.dialog.open(ModalComponent);
                  // show model box to user and store the data to DB then show the init the UI Tour
                }
              } else {
                this._constant.initUITour = true;
                this.dialog.open(ModalComponent);
                localStorage.setItem('isIntroDoneLocalData', this._constant.aesEncryption('true'));
              }
            } else {
              this.orgUserConsentFormShow();
            }
          }
        }
      } else {
        
        this.orgUserConsentFormShow();

        // let hbuddyPopupOver = JSON.parse(localStorage.getItem('hbuddyPopupOver'));
        // if(hbuddyPopupOver == false || hbuddyPopupOver == undefined) {
        //   setTimeout(() => {
        //     window['$crisp'].push(["do", "message:show", ["text", "Ask us your Questions"]]);
        //     localStorage.setItem('hbuddyPopupOver', 'true');
        //   }, 30000);
        // }
      }
    }
    if('userData' in localStorage) {
      let tempArr = [];
      let userLocalData = JSON.parse(this._constant.aesDecryption('userData'));
      // let userLocalData = JSON.parse(localStorage.getItem('userData'));
      if('user_affiliate' in userLocalData) {
        if(userLocalData['user_affiliate'] != null) {
          for(const property in userLocalData['user_affiliate']) {
            if(userLocalData['user_affiliate'][property] != null) {
              tempArr.push(userLocalData['user_affiliate'][property]);
            }
          }
        }
        tempArr = tempArr.filter(obj => {
          if(obj['affilate_name'] != "") {return obj;}
        });
        if(tempArr.length != 0) {this._constant.isAffiliatedUser = true;}
      }
    }

    if(this._constant.affiliationListReceived === false) {
      this.teleService.getAffiliationExclusiveData().subscribe(data => {
        if(data != null) {
          let affiliatedCompaniesList = JSON.stringify(data);
          localStorage.setItem('affiliatedCompaniesList', this._constant.aesEncryption(affiliatedCompaniesList));
          this._constant.affiliationListReceived = true;
        }
      });
    }

    if (this._constant.aesDecryption('isUserLoggedIn') && this.router.url !== "/teleconsult-video-call" && this.router.url !== "/genixConsultation") {
      console.log('sessionIdleWatch');
      this.sessionIdleWatch();
    }
  }

  orgUserConsentFormShow() {
    if('orgUser' in localStorage){
      //alert("1");
      let userData = JSON.parse(this._constant.aesDecryption('userData'));
      if("data_sharing_consent" in userData) {
        //alert("2");
        console.log(JSON.parse(this._constant.aesDecryption("userData")));

        if(userData['data_sharing_consent'] == null || userData['data_sharing_consent'] == "null" || userData['data_sharing_consent'] == "" || userData['data_sharing_consent'] == "undefined" || userData['data_sharing_consent'] == undefined || Object.keys(userData['data_sharing_consent']).length < 9){
          // create new object
          //alert("3");
          this._constant.orgUserData = JSON.parse(this._constant.aesDecryption('orgUser'));
          //localStorage.setItem('isIntroDoneLocalData', this._constant.aesEncryption('true'));
          this._constant.orgUserConsentForm = true;
          this.dialog.open(ModalComponent);
          // show model box to user and store the data to DB then show the init the UI Tour
        }
      } else {
        this._constant.orgUserData = JSON.parse(this._constant.aesDecryption('orgUser'));
        //localStorage.setItem('isIntroDoneLocalData', this._constant.aesEncryption('true'));
        this._constant.orgUserConsentForm = true;
        this.dialog.open(ModalComponent);
        // show model box to user and store the data to DB then show the init the UI Tour
      }
    }
  }

  logout(){
    if(this.vaptEnabled){
      if (this._constant.aesDecryptionForVAPT("isUserLoggedIn") != null) {
        let userInfo = JSON.parse(this._constant.aesDecryptionForVAPT('userData'))
        let userEmail = userInfo.email;
        this.authServiceLogin.logOut(userEmail).subscribe((data) => {
        if(data == "all sessions cleared" || data == "portal sessions cleared" || data == "no active sessions"){
          // console.log(data);
          this._constant.sessionActiveLogout = false;
          this.dialog.closeAll();
          this.teleConsultCrossbarService.closeConnection();
          delete  this.teleService.nativeWindow.CRISP_TOKEN_ID;
          this.teleService.nativeWindow.$crisp.push(["do", "session:reset"]);
          this.authService.globalVariableReset();
          setTimeout(() => {
            localStorage.clear();
            this.authService.LastCheckin = [];
            this.showSessionPopup = false;
            this.timedOut = false;
            this.router.navigate(['/']);
         },1000 * 10);
        }
        })
      }
    }else{
      if (this._constant.aesDecryption("isUserLoggedIn") != null) {
        localStorage.clear();
        this.authService.LastCheckin = [];
        window.location.href="../index.html";
        this.showSessionPopup = false;
        this.timedOut = false;
      }
    }
  }
}
