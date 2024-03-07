import { Injectable, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';

@Injectable({
  providedIn: 'root'
})
export class EventEmitterService {

  invokeCloseModalFunction = new EventEmitter();
  subsVar: Subscription;

  public _isUnLinkJointUser: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  onModalClose() {
    this.invokeCloseModalFunction.emit();
  }
}