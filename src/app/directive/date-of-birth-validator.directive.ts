import { Directive } from '@angular/core';
import { AbstractControl, Validator, AsyncValidator, NG_ASYNC_VALIDATORS, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { resolve } from 'url';

@Directive({
  selector: '[dateOfBirthValidator]',
  providers: [
    {
      provide: NG_ASYNC_VALIDATORS,
      useExisting: DateOfBirthValidatorDirective,
      multi: true
    }
  ]
})
export class DateOfBirthValidatorDirective implements AsyncValidator {

  constructor() { }

  validate(control: AbstractControl): Promise<ValidationErrors> | Observable<ValidationErrors> {
    if (control.value) {
      const dateInputValue = new Date(control.value);
      const todayDate = new Date();
      const age = todayDate.getFullYear() - dateInputValue.getFullYear();
      return new Observable((obs)=>{
        obs.next(age);
        obs.complete();
      }).pipe(
        map(value => ((value < 13)? {isDobInValid: true}: null)),
        catchError(()=> of(null))
      )
    } 
  }
}
