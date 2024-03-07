import { Directive, Input, Output, EventEmitter } from '@angular/core';
import { AbstractControl, Validator, AsyncValidator, ValidationErrors, NG_ASYNC_VALIDATORS } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Directive({
  selector: '[heightValidator]',
  providers:[
    {
      provide: NG_ASYNC_VALIDATORS,
      useExisting: HeightValidatorDirective,
      multi: true
    }
  ]
})
export class HeightValidatorDirective implements AsyncValidator{

  private isHeightInFeet: boolean = false;
  private receivedHeightValue: any = 0;
  @Output() emittedHeightValue = new EventEmitter();

  constructor() { }

  @Input()
  set heightValidator(_isHeightInFeet: boolean){
    this.isHeightInFeet =  _isHeightInFeet;
    this.convertHeightValues();
  }

  get heightValidator(): boolean{
    return this.isHeightInFeet;
  }

  @Input()
  set heightValue(value: any){
    this.receivedHeightValue = value;
  }

  get heightValue(): any{
    return this.receivedHeightValue;
  }

  convertHeightValues(): void{
    if (this.isHeightInFeet) {
      const cmValue =   Number(this.receivedHeightValue);
      const meterValue =  cmValue/100;
      const heightInFeet = (meterValue * 3.2808);
      this.emittedHeightValue.emit(heightInFeet);
    }else{
      const footValue =   Number(this.receivedHeightValue);
      const meterValue =  footValue/3.2808;
      const heightInCm = meterValue * 100;
      this.emittedHeightValue.emit(heightInCm);
    }
  }


  validate(control: AbstractControl): Promise<ValidationErrors> | Observable<ValidationErrors> {
    if (this.isHeightInFeet) {
      if (control.value) {
        const feets = control.value;
        return new Observable((obs)=>{
          obs.next(feets);
          obs.complete();
        }).pipe(
          map((value)=>{
            // if (value < 3 || value > 8) {
            if (value < 0 || value > 8) {
              return {isHeightNotValid:true};
            }else{
              return null;
            }
          }),
          catchError(()=>of(null))
        );
      }
    }else{
      if (control.value) {
        const cm = control.value;
        return new Observable((obs)=>{
          obs.next(cm);
          obs.complete();
        }).pipe(
          map((value)=>{
            //if (value < 91.44 || value > 243.84) {
            if (value < 0 || value > 243.84) {
              return {isHeightNotValid:true};
            }else{
              return null;
            }
          }),
          catchError(()=>of(null))
        );
      } 
    }
  }

}
