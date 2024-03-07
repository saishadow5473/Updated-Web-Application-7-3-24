import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { TeleConsultService } from '../../services/tele-consult.service';
import { ConstantsService } from '../../services/constants.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { ModalComponent } from '../modal/modal.component';
import { MatDialog } from '@angular/material/dialog';
import { ColorsService } from '../../services/colors.service';


@Component({
  selector: 'app-teleconsult-consultation-type',
  templateUrl: './teleconsult-consultation-type.component.html',
  styleUrls: ['./teleconsult-consultation-type.component.css']
})
export class TeleconsultConsultationTypeComponent implements OnInit {
  
  consultationPlatformData:any;
  consultTypeColor: string[] = [];
  brand_image_url_exist:boolean = false;
  brand_image_url:string = '';
  constructor(private router: Router,
              private _teleConsultService: TeleConsultService,
              private _constantsService: ConstantsService,
              private snackBar: MatSnackBar,
              public dialog: MatDialog,
              public colors: ColorsService) {
              }

  ngOnInit() {

    if(this._constantsService.teleconsultationFlowSelected == 'affiliate') {
      if(this._constantsService.teleconsultationAffiliationSelectedCompanyImg != '') {
        this.brand_image_url_exist = true;
        this.brand_image_url = this._constantsService.teleconsultationAffiliationSelectedCompanyImg;
      } 
    }
    
    if(this._constantsService.consultationPlatformData == undefined){
      let userData = JSON.parse(this._constantsService.aesDecryption("userData"));
      this._teleConsultService.getTeleConsultUserPlatformData(userData.id).subscribe(data=>{
        console.log(data);
        this._constantsService.consultationPlatformData = data;        
        this.consultationPlatformData = this._constantsService.consultationPlatformData;
      }); 
      if(this._constantsService.aesDecryption('consult')){
        this._constantsService.startCallFlow = true;
      } else {
        this._constantsService.startCallFlow = false;
        this.router.navigate(['/teleconsultation']);
      }

     /*  this._teleConsultService.getTeleConsultData().subscribe(data=>{
        this._constantsService.consultationPlatformData = data['consultation_platfrom_data'];
        this.consultationPlatformData = this._constantsService.consultationPlatformData;
      }); */

    }else{
      //this.consultationPlatformData =this._constantsService.consultationPlatformData;

      //if (this._constantsService.startCallFlow === true) {
        let consultationTypes = this._constantsService.consultationPlatformData.consult_type.filter(obj =>{
          return obj['consultation_type_name'] !== "Fitness Class";
        });
        console.log(consultationTypes);
        this.selectRandomColor(consultationTypes);
        this.consultationPlatformData = consultationTypes;
      // }else{
      //   this.selectRandomColor(this._constantsService.consultationPlatformData.consult_type);
      //   this.consultationPlatformData = this._constantsService.consultationPlatformData.consult_type;
      // }

    }

    this._constantsService.teleConsultPageFlow = [];    
    this._constantsService.teleSpecalityType = null;
  }

  selectSpeciality(consultation_type_name){
    this._constantsService.teleConsultType = consultation_type_name; //reset the value

    if (consultation_type_name === "Medical Consultation") {        
      // if (this._constantsService.startCallFlow == true) {
      //   this.snackBar.open("This Feature Is Coming Soon!", '',{
      //     duration: 6 * 1000, 
      //     panelClass: ['success'],
      //   });
      //   return;
      // }


      let userData = JSON.parse(this._constantsService.aesDecryption("userData"));
      if (userData.mobileNumber === undefined || userData.mobileNumber === null || userData.mobileNumber.trim().length !== 10) {
        this._constantsService.teleconsultMobileValidate = true;
        this.dialog.open(ModalComponent);
        return;
      }
    }
    this._constantsService.teleConsultPageFlow.push(consultation_type_name);
    var consultantObj = {"ct":consultation_type_name , "st":""};
    localStorage.setItem("consultantDataObj", this._constantsService.aesEncryption(JSON.stringify(consultantObj)));
    this.router.navigate(['/teleconsult-speciality']);
  }
    
  showTeleDashboard(){
    this.router.navigate(['/teleconsultation']);
  }

  selectRandomColor(arr){
    var indexValue: number = 0;
    for (let i = 0; i < arr.length; i++) {
      if (indexValue === 10) {
        indexValue = 0;
      }
      this.consultTypeColor[i] = this.colors.consultTypeColors[indexValue];
      indexValue++;
    }
  }
  
}