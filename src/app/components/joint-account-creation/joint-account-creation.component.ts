import { Component, OnInit, ViewChild, Self, AfterViewInit, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AbstractControl, FormControl, NgForm } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ModalComponent } from '../modal/modal.component';
import { ConstantsService } from 'src/app/services/constants.service';
import * as contracts from '../../contracts/joint-account-contracts';
import { JointAccountService } from '../../services/joint-account.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EventEmitterService } from 'src/app/services/event-emitter.service';

@Component({
  selector: 'app-joint-account-creation',
  templateUrl: './joint-account-creation.component.html',
  styleUrls: ['./joint-account-creation.component.css'],
  providers: [DatePipe]
})
export class JointAccountCreationComponent implements OnInit, AfterViewInit {
  public password_visibility: string = "visibility_off";
  public password_type: string = "password";
  public visibility: boolean = false;
  public userDetails = {} as contracts.UserDetails<string, Object>;
  public isEnableFeet: boolean = false;
  public heightValue: any = 0;
  public heightMeters: any = 0;
  public mainAccountUserDetails: any;
  public _isSeperateJointUserAccount: boolean = false;
  public mainAccountUserUpdateDetails = {} as contracts.MainAccountDetails;
  public newJointAccountUserDetails: any = {};
  public _isSubmitButtonClicked: boolean = false;
  public urlString: string = "user";

  @ViewChild('registrationForm') registrationForm: NgForm;

  constructor(
    private _router: Router,
    @Self() private _date: DatePipe,
    private cdRef: ChangeDetectorRef,
    private dialog: MatDialog,
    private constant: ConstantsService,
    private jointAccountService: JointAccountService,
    private snackBar: MatSnackBar,
    private eventEmitter: EventEmitterService
  ) { }

  ngOnInit() {
    this.mainAccountUserDetails = JSON.parse(this.constant.aesDecryption('userData'));
    console.log(this.mainAccountUserDetails);
  }

  ngAfterViewInit(): void {
    // setTimeout(()=>{
    //   this.registrationForm.setValue(this.userDetails);
    // });
  }

  ngAfterViewChecked(): void {
    this.cdRef.detectChanges();
  }

  onSubmit(formObj: any): void {
    this._isSubmitButtonClicked = true;
    const userDetails = formObj.value;
    this.initiateJointUserRegistrationPhase(userDetails);
  }

  passwordToggle(): void {
    this.visibility = !this.visibility;
    if (this.visibility) {
      this.password_visibility = "visibility";
      this.password_type = "text";
    } else {
      this.password_visibility = "visibility_off";
      this.password_type = "password";
    }
  }

  isDisablePassword(): any {
    if ((this.registrationForm) && (this.registrationForm.controls['mobileNumber'] != null && this.registrationForm.controls['mobileNumber'] != undefined && this.registrationForm.controls['email'] != null && this.registrationForm.controls['email'] != undefined) &&
      ((this.registrationForm.controls['mobileNumber'].value != null && this.registrationForm.controls['mobileNumber'].value.toString().length == 10 && this.registrationForm.controls['mobileNumber'].valid)
        || (this.registrationForm.controls['email'].value != null && this.registrationForm.controls['email'].value.toString().length > 0 && this.registrationForm.controls['email'].valid)
      )) {
      return false;
    }
    return true;
  }

  onMobileInput(event): any {
    if (event.target.value && event.target.value.toString().length > 10) {
      this.registrationForm.controls['mobileNumber'].setValue(event.target.value.toString().slice(0, 10));
    }
  }

  onDateKeyDown(event): boolean {
    return false;
  }

  onWeightInput(event): void {
    if (event.target.value && event.target.value.toString().length > 3) {
      this.registrationForm.controls['userInputWeightInKG'].setValue(event.target.value.toString().slice(0, 3));
    }
  }

  onHeightInput(event): void {
    if (this.isEnableFeet) {
      if (event.target.value) {
        this.registrationForm.controls['heightMeters'].setValue(event.target.value);
        this.heightMeters = (event.target.value / 3.2808).toFixed(2);
      }
    } else {
      if (event.target.value) {
        this.registrationForm.controls['heightMeters'].setValue(event.target.value);
        this.heightMeters = (event.target.value / 100).toFixed(2);
      }
    }
    this.heightValue = this.registrationForm.controls['heightMeters'].value;
  }

  onHeightSliderToggle(event): void {
    const checked = event.checked;
    if (checked) {
      this.isEnableFeet = true;
    } else {
      this.isEnableFeet = false;
    }
  }

  onHeightValueEmitted(value): void {
    if (this.isEnableFeet) {
      if (value) {
        this.registrationForm.controls['heightMeters'].setValue(value);
        this.heightValue = this.registrationForm.controls['heightMeters'].value;
        this.heightMeters = (value / 3.2808).toFixed(2);
      }
    } else {
      if (value) {
        this.registrationForm.controls['heightMeters'].setValue(value);
        this.heightValue = this.registrationForm.controls['heightMeters'].value;
        this.heightMeters = (value / 100).toFixed(2);
      }
    }
  }

  onTermsConditionsCheck(): void {
    this.constant.jointAccountTermsAndConditions = true;
    this.dialog.open(ModalComponent);
  }

  onBack(): void {
    this._router.navigate(['export']);
  }

  initiateJointUserRegistrationPhase(userDetails: any): void {
    if (userDetails.dateOfBirth && userDetails.dateOfBirth.toString().trim().length > 0) {
      userDetails.dateOfBirth = this._date.transform(userDetails.dateOfBirth, 'MM/dd/y');
    }

    if (userDetails.userInputWeightInKG) {
      userDetails.userInputWeightInKG = userDetails.userInputWeightInKG.toString();
    }

    if (userDetails.mobileNumber) {
      userDetails.mobileNumber = userDetails.mobileNumber.toString();
    }

    if ((userDetails != null && userDetails != undefined) && (userDetails.mobileNumber != null && userDetails.mobileNumber != undefined) && (userDetails.email != null && userDetails.email != undefined) &&
      ((userDetails.mobileNumber.trim().length == 10) || (userDetails.email.trim().length > 0))) {
      this._isSeperateJointUserAccount = true;
      this.urlString = "user";
    } else {
      this._isSeperateJointUserAccount = false;
      this.urlString = "create_user";
    }

    let mainAccountDetail = {
      is_joint_account: true,
      caretaker_ihl_id: this.mainAccountUserDetails.id,
      vital_read: false,
      vital_write: false,
      teleconsult_read: false,
      teleconsult_write: false
    }

    if (this._isSeperateJointUserAccount == false) {
      mainAccountDetail.vital_read = true;
      mainAccountDetail.vital_write = true;
      mainAccountDetail.teleconsult_read = true;
      mainAccountDetail.teleconsult_write = true;
    }

    this.userDetails = {
      user: {
        firstName: userDetails.firstName,
        lastName: userDetails.lastName,
        email: userDetails.email || "",
        mobileNumber: userDetails.mobileNumber || "",
        dateOfBirth: userDetails.dateOfBirth,
        userInputWeightInKG: userDetails.userInputWeightInKG,
        heightMeters: this.heightMeters,
        gender: userDetails.gender,
        aadhaarNumber: "",
        fingerprint: "",
        affiliate: "",
        terms: {
          termsFileName: "termsofuse_v9_01122016"
        },
        privacyAgreed: {
          privacyFileName: "privacypolicy_v7_08112014"
        },
        care_taker_details_list: {
          caretaker_user1: mainAccountDetail
        }
      },
      password: userDetails.password || "",
      encryptionVersion: null
    }

    console.log(this.userDetails);
    this.jointAccountService.createNewJointAccountUser(JSON.stringify(this.userDetails), this.urlString).subscribe(
      (response: any) => {
        if (response instanceof Object && 'id' in response) {
          console.log(response);
          this.newJointAccountUserDetails = response;
          this.updateMainAccountUserDetails();
        } else {
          this.showErrorSnackbar();
        }
      },
      (err) => {
        this.showErrorSnackbar();
      },
      () => {

      }
    )
  }

  updateMainAccountUserDetails(): void {

    let joinAccountDetails: any = this.mainAccountUserDetails.joint_user_detail_list;
    let newJointAccountAccessDetails = {
      ihl_user_id: this.newJointAccountUserDetails['id'],
      ihl_user_name: `${this.registrationForm.controls['firstName'].value} ${this.registrationForm.controls['lastName'].value}`,
      status: "requested",
      vital_read: false,
      vital_write: false,
      teleconsult_read: false,
      teleconsult_write: false
    }

    if (this._isSeperateJointUserAccount == false) {
      newJointAccountAccessDetails['status'] = 'active';
      newJointAccountAccessDetails['vital_read'] = true;
      newJointAccountAccessDetails['vital_write'] = true;
      newJointAccountAccessDetails['teleconsult_read'] = true;
      newJointAccountAccessDetails['teleconsult_write'] = true;
    }

    if (joinAccountDetails != undefined && joinAccountDetails != null && typeof (joinAccountDetails) == "object") {
      const jointAccountDetailsCount = Object.keys(joinAccountDetails).length + 1;
      joinAccountDetails[`joint_user${jointAccountDetailsCount}`] = newJointAccountAccessDetails;
    } else {
      joinAccountDetails = {
        joint_user1: newJointAccountAccessDetails
      }
    }

    this.mainAccountUserUpdateDetails = {
      email: this.mainAccountUserDetails.email,
      mobileNumber: this.mainAccountUserDetails.mobileNumber,
      userInputWeightInKG: this.mainAccountUserDetails.userInputWeightInKG,
      firstName: this.mainAccountUserDetails.firstName,
      lastName: this.mainAccountUserDetails.lastName,
      aadhaarNumber: this.mainAccountUserDetails.aadhaarNumber,
      dateOfBirth: this.mainAccountUserDetails.dateOfBirth,
      gender: this.mainAccountUserDetails.gender,
      heightMeters: this.mainAccountUserDetails.heightMeters,
      fingerprint: this.mainAccountUserDetails.fingerPrint,
      terms: {
        termsFileName: "termsofuse_v9_01122016"
      },
      privacyAgreed: {
        privacyFileName: "privacypolicy_v7_08112014"
      },
      joint_user_detail_list: joinAccountDetails
    }

    this.jointAccountService.updateMainAccountUser(JSON.stringify(this.mainAccountUserUpdateDetails), this.mainAccountUserDetails.id).subscribe(
      (response: any) => {
        console.log(response);
        if (response == "updated") {
          if (this._isSeperateJointUserAccount == true) {
            this.sendSeperateJointAccountRequest();
          } else {
            this.switchToNewAccount();
          }
        } else {
          this.showErrorSnackbar();
        }
      },
      (err) => {
        this.showErrorSnackbar();
      },
      () => {
      }
    )
  }

  sendSeperateJointAccountRequest(): void {
    const seperateJointAccountRequestDetails: contracts.SeperateJointAccountRequestDetails = {
      care_taker_ihl_id: this.mainAccountUserDetails.id,
      care_taker_name: `${this.mainAccountUserDetails.firstName} ${this.mainAccountUserDetails.lastName}`,
      care_taker_email: this.mainAccountUserDetails.email || "",
      user_ihl_id: this.newJointAccountUserDetails['id'],
      user_email: this.userDetails.user.email,
      user_name: `${this.userDetails.user.firstName} ${this.userDetails.user.lastName}`,
      user_mobile_no: this.userDetails.user.mobileNumber
    }

    this.jointAccountService.seperateJointAccountRequest(JSON.stringify(seperateJointAccountRequestDetails)).subscribe(
      (response: any) => {
        console.log(response);
        if (response == "Sucessfully Sent") {
          this.switchToNewAccount();
        } else {
          this.showErrorSnackbar();
        }
      },
      (err: any) => {
        this.showErrorSnackbar();
      },
      () => {

      }
    )
  }

  switchToNewAccount(): void {
    this.jointAccountService.initiateSwitchUserAccount({ id: this.newJointAccountUserDetails['id'] });
    this.showSuccessSnackbar();
  }

  showSuccessSnackbar(): void {
    this.snackBar.open("Account Created & Switched to Joint Account.", '', {
      duration: 2 * 1000,
      panelClass: ['success'],
    });
  }

  showErrorSnackbar(): void {
    this._isSubmitButtonClicked = false;
    this.snackBar.open("Something went wrong.", '', {
      duration: 3 * 1000,
      panelClass: ['error'],
    });
  }

}