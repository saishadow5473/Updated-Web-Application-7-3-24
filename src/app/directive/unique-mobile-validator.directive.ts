import { Directive } from '@angular/core';
import { AbstractControl, AsyncValidator, NG_ASYNC_VALIDATORS, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { JointAccountService } from '../services/joint-account.service';
import { ConstantsService } from '../services/constants.service';

@Directive({
  selector: '[uniqueMobileValidator]',
  providers: [
    {
      provide: NG_ASYNC_VALIDATORS,
      useExisting: UniqueMobileValidatorDirective,
      multi: true
    }
  ]
})
export class UniqueMobileValidatorDirective implements AsyncValidator {

  constructor(
    private jointAccountService: JointAccountService,
    private _constant: ConstantsService 
  ) { }

  validate(control: AbstractControl): Promise<ValidationErrors> | Observable<ValidationErrors> {

    let userMobile = "";

    if (this._constant.aesDecryption('userData')) {
      userMobile = (JSON.parse(this._constant.aesDecryption('userData')))['mobileNumber'];
    }

    if (control.value != "" && userMobile != "" && control.value == userMobile) {
      return new Observable((obs) => {
        obs.next({ mobileNotTaken: true });
        obs.complete();
      });
    } else if (control.value && userMobile && (control.value).toString() != "" &&
      (userMobile).toString() != "" && (control.value).toString() != (userMobile).toString()) {
      return this.jointAccountService.isMobileExists(control.value).pipe(
        map(isMobileNotTaken => (isMobileNotTaken ? { mobileNotTaken: true } : null)),
        catchError(() => of(null))
      );
    } else if (control.value != "" && userMobile == "" ) {
      return this.jointAccountService.isMobileExists(control.value).pipe(
        map(isMobileTaken => {
          return (isMobileTaken != true) ? { mobileTaken : true } : null;
        }),
        catchError(() => of(null))
      );
    } else {
      return new Observable((obs) => {
        obs.next(null);
        obs.complete();
      });
    }
  }

}
