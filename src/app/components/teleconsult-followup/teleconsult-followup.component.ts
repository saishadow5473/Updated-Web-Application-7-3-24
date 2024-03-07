import { Component, OnInit } from '@angular/core';
import { TeleConsultService } from '../../services/tele-consult.service';
import { ConstantsService } from '../../services/constants.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-teleconsult-followup',
  templateUrl: './teleconsult-followup.component.html',
  styleUrls: ['./teleconsult-followup.component.css']
})
export class TeleconsultFollowupComponent implements OnInit {
  consultationHistory: any = [];
  consultationFollowUps: any = [];
  
  constructor(private router: Router, 
              private _teleConsultService: TeleConsultService,
              private _constantsService: ConstantsService) { }

  ngOnInit() {
    let userData = JSON.parse(this._constantsService.aesDecryption("userData"));
    this._teleConsultService.getTeleConsultUserData(userData.id).subscribe(data=>{
      console.log(data);
      this.consultationHistory = data['consultation_history'];
      this.consultationFollowUps = data['followup'];
    });
   /*  this._teleConsultService.getTeleConsultData().subscribe(data=>{
      console.log(data);
      this.consultationHistory = data['consultation_user_data']['consultation_history'];
      this.consultationFollowUps = data['consultation_user_data']['followup'];
    }); */


  }

  followUp(){
    this.router.navigate(['/teleconsult-video-call']);
  }

  extractDate(js_datetime){
    if(js_datetime == undefined || js_datetime == '') return '';
    let a = new Date(js_datetime);
    return a.getDate() + '-' + a.toLocaleString('default',{'month':'short'}) + '-'+a.getFullYear();
  }

  extractTime(js_datetime){
    if(js_datetime == undefined || js_datetime == '') return '';
    let a = new Date(js_datetime);
    return a.toLocaleTimeString('default',{'hour':'numeric',hour12:true,'minute':'numeric'})
  }

  getDuration(start_date,end_date){
    if(start_date == undefined || start_date == '') return '';
    if(end_date == undefined || end_date == '') return '';
    start_date = new Date(start_date);
    end_date = new Date(end_date);
    return (end_date-start_date)/(1000*60) + ' min';
  }

  consultationDetails(index){
    console.log(this.consultationHistory[index]);
    this._constantsService.getTeleConsulationHistory = this.consultationHistory[index];
    this.router.navigate(['/consultation-details-view']);
  }

}
