import { Component, OnInit, OnChanges, SimpleChanges, Input, Output, EventEmitter, ChangeDetectorRef, AfterViewInit, AfterViewChecked, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import * as contract from "../../contracts/joint-account-contracts";
import { JointAccountService } from '../../services/joint-account.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConstantsService } from 'src/app/services/constants.service';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ModalComponent } from '../modal/modal.component';
import { takeUntil } from 'rxjs/operators';
import { EventEmitterService } from 'src/app/services/event-emitter.service';

@Component({
  selector: 'manage-account',
  templateUrl: './manage-account.component.html',
  styleUrls: ['./manage-account.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManageAccountComponent implements OnInit, OnChanges, AfterViewChecked, OnDestroy {

  @Input('userDetails') public receivedUserDetails: any;
  @Output() public onLogOut: EventEmitter<any> = new EventEmitter();
  public userData: any = {};
  public colors: Array<string> = contract.colorPalettes;
  public _isDisabledUserDetailBtn: boolean = false;
  disableAddLinkBtn:boolean = false;
  @Output() public onEmptyUserList: EventEmitter<any> = new EventEmitter();
  private unLinkUserSubscription = undefined;
  private unLinkUserDetail: any = "";
  userDataCred: any;
  idCare: any;
  care_taker_details_list: string[];

  constructor(
    private cdRef: ChangeDetectorRef,
    private jointAccountService: JointAccountService,
    private snackBar: MatSnackBar,
    public _constants: ConstantsService,
    private authService: AuthService,
    private dialog: MatDialog,
    private eventEmitter: EventEmitterService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if ('receivedUserDetails' in changes) {
      this.userData = changes['receivedUserDetails']['currentValue'];
      console.log(this.userData);
    }
  }

  ngOnInit() {
    // console.log((Object.keys(this.userData['joint_user_detail_list']).length == 0) == false)
    // console.log(Object.values(this.userData['care_taker_details_list']).filter((item: any) => ((item.is_joint_account.toString() == "true"))).length == 1);
    if(this.userData.hasOwnProperty('care_taker_details_list') == true) {
      if(Object.keys(this.userData['care_taker_details_list']).length == 0) {
        this._constants._isDependentUserAccount = false;
        this.authService.globalVariableReset();
        localStorage.clear();
        this.authService.LastCheckin = [];
        // alert("this._constants._isDependentUserAccount " + this._constants._isDependentUserAccount);
      } else {
        this._constants._isDependentUserAccount = true;
        // alert("this._constants._isDependentUserAccount " + this._constants._isDependentUserAccount);
      }
    }

    if(this._constants._isDependentUserAccount == true) {
      this.disableAddLinkBtn = true;
    }

    // if (this.unLinkUserSubscription == undefined) {
    //   this.unLinkUserSubscription = this.eventEmitter._isUnLinkJointUser.subscribe((msg: any) => {
    //     if (msg && msg._isUnLink != undefined && msg._isUnLink == true) {
    //       // this.unLinkUser(this.unLinkUserDetail);
    //       this.unLinkUserDetail = "";
    //     }
    //   });
    // } gXOg5cuMUUq6y1kGRHqydA
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  ngOnDestroy(): void {
    //this.unLinkUserSubscription.unsubscribe();
    this.unLinkUserSubscription = undefined;
    this.unLinkUserDetail = "";
  }

  public userProfileImage(): string {
    if (this.userData) {
      if (this.userData['photo'] && this.userData['photo'].length > 0) {
        return `data:${this._constants.userProfilePicType};base64,${this.userData['photo']}`;
      } else {
        if (this.userData['gender'] && (this.userData['gender'].toLowerCase() == 'm' || this.userData['gender'].toLowerCase() == 'male')) {
          return "assets/img/avatar-male.png";
        } else {
          return "assets/img/avatar-female.png";
        }
      }
    } else {
      return "assets/img/avatar-male.png";
    }
  }

  public userEmailOrMobile(): String {
    if (this.userData) {
      if (this.userData['email'] != undefined && this.userData['email'] != null && this.userData['email'].toString().trim().length > 0) {
        return this.userData['email'];
      } else if (this.userData['mobileNumber'] != undefined && this.userData['mobileNumber'] != null && this.userData['mobileNumber'].toString().trim().length == 10) {
        return this.userData['mobileNumber'];
      } else {
        return "";
      }
    } else {
      return "";
    }
  }

  public initialBackground(): any {
    return this.colors[Math.floor(Math.random() * 16)];
  }

  public _isDisableJointAccountOption(): any {
    if (this.userData) {
      if ('joint_user_detail_list' in this.userData && this.userData['joint_user_detail_list'] != undefined && this.userData['joint_user_detail_list'] != null && (Object.values(this.userData['joint_user_detail_list'])).filter((item: any)=>((item.status.toLowerCase() == 'active'))).length + (Object.values(this.userData['joint_user_detail_list'])).filter((item: any)=>((item.status.toLowerCase() == 'requested'))).length == 15) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }

  public _isEnableJointUserListSection(): any {
    if (this.userData) {
      if ('joint_user_detail_list' in this.userData && this.userData['joint_user_detail_list'] != undefined && this.userData['joint_user_detail_list'] != null && Object.keys(this.userData['joint_user_detail_list']).length > 0) {
        let obj: any = Object.entries(this.userData['joint_user_detail_list']).some((item)=>{
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

  public switchUser(user: any): void {
    console.log(user);
    this._isDisabledUserDetailBtn = true;
    this.jointAccountService.initiateSwitchUserAccount({ id: user.value['ihl_user_id'] });
    this._isDisabledUserDetailBtn = false;
  }

  public userLogout(): void {
    this.onLogOut.emit();
  }

  public trackByFn(index: number, detail: any): any {
    return detail.value['ihl_user_id'];
  }

  // openConfirmationDialog(detail): void {
  //   this.unLinkUserDetail = detail;
  //   this._constants.unlinkJointUserConfirmationPopUp = true;
  //   this.dialog.open(ModalComponent);
  // }

  // public unLinkUser(detail): void {
  //   let userDetail = detail;
  //   this._isDisabledUserDetailBtn = true;
  //   this.userData.joint_user_detail_list[userDetail.key]["status"] = "inactive";
  //   let data = {
  //     joint_user_detail_list: this.userData.joint_user_detail_list
  //   };
  //   this.jointAccountService.updateMainAccountUser(JSON.stringify(data), this.userData.id).subscribe(
  //     (response: any) => {
  //       console.log(response);
  //       if (response == "updated") {
  //         this.snackBar.open("User unlink is successful", '', {
  //           duration: 2 * 1000,
  //           panelClass: ['success'],
  //         });
  //         this._constants.userProfileData.joint_user_detail_list = this.userData.joint_user_detail_list;
  //         this._isDisabledUserDetailBtn = false;
  //       } else {
  //         this._isDisabledUserDetailBtn = false;
  //         this.snackBar.open("Something went wrong", '', {
  //           duration: 2 * 1000,
  //           panelClass: ['error'],
  //         });
  //       }
  //     },
  //     (err) => {
  //       this._isDisabledUserDetailBtn = false;
  //       this.snackBar.open("Something went wrong", '', {
  //         duration: 2 * 1000,
  //         panelClass: ['error'],
  //       });
  //     },
  //     () => {
  //     }
  //   );

  //   if ('joint_user_detail_list' in this.userData && this.userData['joint_user_detail_list'] != undefined && this.userData['joint_user_detail_list'] != null && Object.keys(this.userData['joint_user_detail_list']).length == 0) {
  //     this.onEmptyUserList.emit(false);
  //   }
  // }

  public switchToMainUser(): void {
    // console.log(this.userData);
    // console.log("Main User ID" +localStorage.getItem('currentUserId'));
    // console.log("this._constants.mainUserAccountCredentials.id = " +  this._constants.mainUserAccountCredentials.id);
    if (this._constants.mainUserAccountCredentials.id != undefined && this._constants.mainUserAccountCredentials.id != null && this._constants.mainUserAccountCredentials.id.toString().length > 0) {
      this.jointAccountService.initiateSwitchUserAccount({ id: this._constants.mainUserAccountCredentials.id }, true);
      this.snackBar.open("Switched back to Main user", '', {
        duration: 2 * 1000,
        panelClass: ['success'],
      })
      localStorage.removeItem('m_acc');
    } else if (Object.keys(this.userData['care_taker_details_list']).length == 1) {
      console.log(this.userData['care_taker_details_list']);

    } else {
      let mainAcc = this._constants.aesDecryption('m_acc');
      // console.log("Current user ID " + this._constants.currentUserId);
      // this.userDataCred = JSON.parse(localStorage.getItem('userData'));
      // this.idCare = this.userDataCred.care_taker_details_list['caretaker_user1'];
      // this._constants.mainUserAccountCredentials.id = this.idCare.caretaker_ihl_id;
      this._constants.mainUserAccountCredentials.id = mainAcc;
      this.switchToMainUser();
      // this._constants.mainUserAccountCredentials.id = this.userData.id;
      // this.snackBar.open("Something went wrong", '', {
      //   duration: 2 * 1000, // m_
      //   panelClass: ['error'],
      // });
      // this.onLogOut.emit();
    }
  }
}