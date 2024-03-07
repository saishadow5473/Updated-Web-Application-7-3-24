import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { JointAccountService } from '../../services/joint-account.service';
import * as contracts from '../../contracts/joint-account-contracts';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConstantsService } from 'src/app/services/constants.service';

@Component({
  selector: 'app-link-existing-account',
  templateUrl: './link-existing-account.component.html',
  styleUrls: ['./link-existing-account.component.css']
})
export class LinkExistingAccountComponent implements OnInit {
  public _LinkButtonClicked: boolean = false;
  public mainAccountUserDetails: any;
  public mainAccountUserUpdateDetails = {} as contracts.MainAccountDetails;
  public _isSeperateJointUserAccount: boolean = false;
  public newJointAccountUserDetails: any = {};

  @ViewChild('linkExistingAccountForm') linkExistingAccountForm: NgForm;
  @ViewChild('clearName') clearName: ElementRef;
  @ViewChild('clearEmail') clearEmail: ElementRef;
  @ViewChild('clearMobile') clearMobile: ElementRef;

  constructor(
    private _router: Router,
    private snackBar: MatSnackBar,
    private jointAccountService: JointAccountService,
    private constant: ConstantsService
  ) { }

  ngOnInit() {
    this.mainAccountUserDetails = JSON.parse(this.constant.aesDecryption('userData'));
  }

  onBack(): void {
    this._router.navigate(['export']);
  }

  onMobileInput(event): any {
    if (event.target.value && event.target.value.toString().length > 10) {
      this.linkExistingAccountForm.controls['mobileNumber'].setValue(event.target.value.toString().slice(0, 10));
    }
  }

  onSubmit(formObj: any): void {
    this._LinkButtonClicked = true;
    const linkUserDetails = formObj.value;
    console.log(linkUserDetails);
    this.initiateLinkExistingUserPhase(linkUserDetails);
  }

  initiateLinkExistingUserPhase(linkUserDetails: any): void {

    if (linkUserDetails.mobileNumber) {
      linkUserDetails.mobileNumber = linkUserDetails.mobileNumber.toString();
    }

    if ((linkUserDetails != null && linkUserDetails != undefined) && (linkUserDetails.mobileNumber != null && linkUserDetails.mobileNumber != undefined) && (linkUserDetails.email != null && linkUserDetails.email != undefined) &&
      ((linkUserDetails.mobileNumber.trim().length == 10) || (linkUserDetails.email.trim().length > 0))) {
      this._isSeperateJointUserAccount = true;
    } else {
      this._isSeperateJointUserAccount = false;
    }

    this.jointAccountService.quickUserLoginOnlyEmail("{'email':" +  JSON.stringify(linkUserDetails.email) + "}").subscribe(
      (response: any) => {
        console.log(response);
        if (response instanceof Object && 'User' in response) {
          this.newJointAccountUserDetails = response.User;
          console.log(JSON.stringify(this.newJointAccountUserDetails.id));

          const existingAccountJointRequestDetails = {
            care_taker_ihl_id: this.mainAccountUserDetails.id,
            care_taker_name: `${this.mainAccountUserDetails.firstName} ${this.mainAccountUserDetails.lastName}`,
            care_taker_email: this.mainAccountUserDetails.email || "",
            user_ihl_id: this.newJointAccountUserDetails.id,
            user_email: linkUserDetails.email,
            user_name: `${linkUserDetails.userName}`,
            user_mobile_no: linkUserDetails.mobileNumber
          }

          console.log(existingAccountJointRequestDetails);

        this.jointAccountService.seperateJointAccountRequest(JSON.stringify(existingAccountJointRequestDetails)).subscribe(
          (response: any) => {
            console.log(response);
            if (response == "Sucessfully Sent") {
              this._LinkButtonClicked = false;
              this.showSuccessSnackbar();
              this.clearName.nativeElement.value='';
              this.clearEmail.nativeElement.value='';
              this.clearMobile.nativeElement.value='';
              //let userData = JSON.parse(localStorage.getItem('userData'));
              // console.log(userData);

              if (linkUserDetails.hasOwnProperty(this.newJointAccountUserDetails.id) != true) {

                let joinAccountDetails: any = this.mainAccountUserDetails.joint_user_detail_list;
                let newJointAccountAccessDetails = {
                  ihl_user_id: this.newJointAccountUserDetails.id,
                  ihl_user_name: this.newJointAccountUserDetails.firstName + " " + this.newJointAccountUserDetails.lastName,
                  status: "requested",
                  vital_read: false,
                  vital_write: false,
                  teleconsult_read: false,
                  teleconsult_write: false
                }

                console.log(newJointAccountAccessDetails);

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

                console.log(joinAccountDetails);
                console.log("Success");

                this. mainAccountUserUpdateDetails= {
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
                    if (response = 'updated') {
                      localStorage.setItem('userData', this.constant.aesEncryption(linkUserDetails));
                    }
                  }
                )
              }


            } else {
              this.showErrorSnackbar();
              console.log("Fail");
            }
          },
          (err: any) => {
            console.log(err);
            this.showErrorSnackbar();
          },
          () => {

          }
        )
      } else {
        this.showErrorSnackbar();
      }

      }
    )
  }

  _isMobileNumberEmpty(mobileNumber): boolean {
    if (mobileNumber) {
      console.log(String(mobileNumber).length);
      if (String(mobileNumber).length == 0) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }

  }

  showSuccessSnackbar(): void {
    this._LinkButtonClicked = false;
    this.snackBar.open("Verification sent", '', {
      duration: 3 * 1000,
      panelClass: ['success'],
    });
  }

  showErrorSnackbar(): void {
    this._LinkButtonClicked = false;
    this.snackBar.open("Something went wrong.", '', {
      duration: 3 * 1000,
      panelClass: ['error'],
    });
  }

}
