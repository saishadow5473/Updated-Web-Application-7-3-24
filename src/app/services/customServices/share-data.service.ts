import { Injectable } from '@angular/core';
// import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShareDataService {

  constructor() { }

  private value = new BehaviorSubject('');
  private unit = new BehaviorSubject('');
  private title = new BehaviorSubject('');
  private icon = new BehaviorSubject('');
  private colour = new BehaviorSubject('');

  currentValue = this.value.asObservable()
  currentUnit = this.unit.asObservable()
  currentTitle = this.title.asObservable()
  currentIcon = this.icon.asObservable()
  currentColour = this.colour.asObservable()

  updateMessage(title: any, unit: any, value: any, icon: any, colour: any) {
    this.title.next(title);
    this.unit.next(unit);
    this.value.next(value);
    this.icon.next(icon);
    this.colour.next(colour);
  }
}
