import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators'
import { Observable } from 'rxjs';
import {  Subject } from 'rxjs'
// import { last } from '@angular/router/src/utils/collection';
import { ConstantsService } from 'src/app/services/constants.service';
import { Router } from '@angular/router'
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChallengesService {

  constructor(private http: HttpClient,
    private _constants: ConstantsService,
    private router:Router) { }

  public ProgramBaseURL:string = this._constants.ihlBaseurl+'data/';

  //to get list of programs for health challenges
  getProgramDetails() {
    let headers = new HttpHeaders();
    return this.http.post<any>(`${this.ProgramBaseURL}getProgramDetails`, headers).pipe(map(res => res));
  }

  //to accept new challenge
  enroll(IHL_user_id, enrollData, programID) {
    return this.http.get<any>(`${this.ProgramBaseURL}enrollToProgram?user_ihl_id=${IHL_user_id}&program_id=${programID}`, enrollData).pipe(map(res => res));
  }

  //checking challenge accepted or not
  isEnrolled(IHL_user_id, programID) {
    return this.http.get<any>(`${this.ProgramBaseURL}userEnrolledOrNot?user_ihl_id=${IHL_user_id}&program_id=${programID}`).pipe(map(res => res));
  }

  //update date and visit details
  updateUserVisits(IHL_user_id, programID) {
    return this.http.get<any>(`${this.ProgramBaseURL}updateVisitDetails?user_ihl_id=${IHL_user_id}&program_id=${programID}`).pipe(map(res => res));
  }

  //submit feedback data
  submitFeedbackData(feedbackData) {
    let headers = new HttpHeaders({'Content-Type':'application/json'});
    return this.http.post<any>(`${this.ProgramBaseURL}UserFeedback`, feedbackData, {headers}).pipe(map(res => res));
  }

  //---------------local daily challenge list json data - service-----------------------//
  getLocalJSONDailyTaskData() {
    return this.http.get<any>('assets/blood_pressure_management.json').pipe(map(res => res));
  }
}
