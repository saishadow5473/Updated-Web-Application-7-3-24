import { Directive } from '@angular/core';
import { AbstractControl, AsyncValidator, NG_ASYNC_VALIDATORS, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { JointAccountService } from '../services/joint-account.service';
import { ConstantsService } from '../services/constants.service';

@Directive({
  selector: '[uniqueEmailValidator]',
  providers: [
    {
      provide: NG_ASYNC_VALIDATORS,
      useExisting: UniqueEmailValidatorDirective,
      multi: true
    }
  ]
})
export class UniqueEmailValidatorDirective implements AsyncValidator {

  constructor(
    private _jointAccountService: JointAccountService,
    private _constant: ConstantsService
  ) { }

  validate(control: AbstractControl): Promise<ValidationErrors> | Observable<ValidationErrors> {

    let userEmail = "";

    if (this._constant.aesDecryption('userData')) {
      userEmail = (JSON.parse(this._constant.aesDecryption('userData')))['email'];
    }
    if (control.value != "" && userEmail != "" && control.value == userEmail) {
      return new Observable((obs) => {
        obs.next({ emailNotTaken: true });
        obs.complete();
      });
    } else if (control.value != "" && userEmail != "" && control.value != userEmail) {
      return this._jointAccountService.isEmailExists(control.value).pipe(
        map(isEmailNotTaken => (isEmailNotTaken ? { emailNotTaken: true } : null)),
        catchError(() => of(null))
      )
    } else if (control.value != "" && userEmail == "") {
      // alert("coming here");
      return this._jointAccountService.isEmailExists(control.value).pipe(
        map(isEmailTaken => {
          // alert(isEmailTaken);
          return (isEmailTaken != true) ? { emailTaken : true } : null;
        }),
        catchError(() => of(null))
      )
    } else {
      return new Observable((obs) => {
        obs.next(null);
        obs.complete();
      });
    }

  }

}
