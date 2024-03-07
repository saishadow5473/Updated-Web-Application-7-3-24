import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { TeleConsultService } from '../../services/tele-consult.service';
import { ConstantsService } from '../../services/constants.service';
import { ModalComponent } from '../modal/modal.component';
import { MatDialog } from '@angular/material/dialog';
import { ColorsService } from '../../services/colors.service';

@Component({
  selector: 'app-teleconsult-speciality',
  templateUrl: './teleconsult-speciality.component.html',
  styleUrls: ['./teleconsult-speciality.component.css']
})
export class TeleconsultSpecialityComponent implements OnInit {
  
  specialityType: boolean = true;
  
  specalityList:any = [];
  consultSpecialityColor: string[] = [];
  brand_image_url_exist:boolean = false;
  brand_image_url:string = '';
  constructor(private router: Router,
              private _teleConsultService: TeleConsultService,
              private _constantsService: ConstantsService,
              private dialog: MatDialog,
              public colors: ColorsService) { 
              }

  ngOnInit() {
    
    /* if(this._constantsService.teleConsultBackBtnClick){
      this._constantsService.teleConsultBackBtnClick = false;
    } */
    console.log(this._constantsService.consultationPlatformData.consult_type);

    /* TELECONSULTATION NEW FLOW FUNCTIONALITY START */
    if (this._constantsService.teleConsultationNewFlow) {
      let specialityListArr:object[]=[];
      this._constantsService.consultationPlatformData.consult_type.forEach(function(val) {
        if (val['consultation_type_name'] != 'Fitness Class') {
          val['specality'].forEach(function(specialityArr) {
            if (specialityArr['consultant_list'].length != 0)
              specialityListArr.push(specialityArr);
          })
        }
      });
      console.log(specialityListArr);
      this.specalityList = specialityListArr;
      this.selectRandomColor(this.specalityList);
      return;
    }
    /* TELECONSULTATION NEW FLOW FUNCTIONALITY END */

    if(this._constantsService.teleconsultationFlowSelected == 'affiliate') {
      //this.headerName = this._constantsService.teleconsultationAffiliationSelectedName+' - Health Consultation';
      if(this._constantsService.teleconsultationAffiliationSelectedCompanyImg != '') {
        this.brand_image_url_exist = true;
        this.brand_image_url = this._constantsService.teleconsultationAffiliationSelectedCompanyImg;
      }
    }

    if(this._constantsService.teleConsultPageFlow.length == 0) {
      this.router.navigate(['/teleconsultation']);
    }


    if(this._constantsService.consultationPlatformData == undefined) {
      let userData = JSON.parse(this._constantsService.aesDecryption("userData"));
      this._teleConsultService.getTeleConsultUserPlatformData(userData.id).subscribe(data=>{
        console.log(data);        
        this._constantsService.consultationPlatformData = data;
        if(this._constantsService.consultationPlatformData.consult_type != undefined){
          this.populateSpecalityList(this._constantsService.consultationPlatformData.consult_type);
        }
        
      });
      this.router.navigate(['/teleconsultation']);
      /* this._teleConsultService.getTeleConsultData().subscribe(data=>{
        this._constantsService.consultationPlatformData = data['consultation_platfrom_data'];
        this.populateSpecalityList(this._constantsService.consultationPlatformData.consult_type);
      }); */

    } else {
      if(this._constantsService.consultationPlatformData.consult_type != undefined){
        this.populateSpecalityList(this._constantsService.consultationPlatformData.consult_type);
      }
        
    }

  }

  populateSpecalityList(consultTypeList) {
    let selectedConsultationType = this._constantsService.teleConsultPageFlow[
                  this._constantsService.teleConsultPageFlow.length - 1
                  ];
    let consultSpecalityList = consultTypeList.find(item=>{
      return item.consultation_type_name == selectedConsultationType;
    });
    if(consultSpecalityList == undefined) return;
    // If only single specality; then redirect to doctor list directly
    if(consultSpecalityList.specality.length == 1) {
      this.navigateToNextPage(consultSpecalityList.specality[0]);
      // this.router.navigate(['./teleconsult-doctors']);
    }
    let userData = JSON.parse(this._constantsService.aesDecryption("userData"));
    // console.log(userData);
    if(userData['affiliate'] == 'none'){
      let newArrList:object[]=[];
      // console.log(consultSpecalityList.specality);
      for(let key in consultSpecalityList.specality){
        /* As per the management requirement we should show all the cards for speciality */
        // if(!(consultSpecalityList.specality[key]['specality_name'] =='Social Wellbeing'||consultSpecalityList.specality[key]['specality_name'] =='Physical Wellbeing'
        //  ||consultSpecalityList.specality[key]['specality_name'] =='Emotional Wellbeing'||consultSpecalityList.specality[key]['specality_name'] =='Financial Wellbeing')){ 
        //   newArrList.push(consultSpecalityList.specality[key]);
        // }
        newArrList.push(consultSpecalityList.specality[key]);
      }
      // console.log(newArrList);
      this.specalityList = newArrList;
    }else{
      this.specalityList = consultSpecalityList.specality;
    }
    this.selectRandomColor(this.specalityList);
  }

  selectDoctors(specality_name) {    
    this._constantsService.teleSpecalityType = specality_name;
    if (!this._constantsService.teleConsultationNewFlow)
      this.updateLocalStorage(specality_name);
    this.router.navigate(['/teleconsult-doctors'])
  }
  selectCourse(specality_name) {
    this._constantsService.teleSpecalityType = specality_name;
    this.updateLocalStorage(specality_name);
    this.router.navigate(['/subscribe-online-classes']);
  }

  updateLocalStorage(specality_name) {
    // var retrievedObject = this._constantsService.aesDecryption('consultantDataObj');
    // var consultTypeData = JSON.parse(retrievedObject);
    var retrievedObject = {"ct":'Fitness Class' , "st":""};
    var consultTypeData = retrievedObject;
    consultTypeData.st = specality_name;
    localStorage.setItem("consultantDataObj", this._constantsService.aesEncryption(JSON.stringify(consultTypeData)));
  }
  navigateToNextPage(specality) {
    if('consultant_list' in specality) {
      if(specality['consultant_list'].length !== 0) {
        this.selectDoctors(specality.specality_name);
      }
      else {
        this._constantsService.noCourseIsAvailable = false;
        this._constantsService.noDoctorIsAvailable = true;
        this.dialog.open(ModalComponent);
      }
    } 
    else if('courses' in specality) {
      if(specality['courses'].length !== 0) {
        this.selectCourse(specality.specality_name);
      }
      else {
        this._constantsService.noDoctorIsAvailable = false;
        this._constantsService.noCourseIsAvailable = true;
        this.dialog.open(ModalComponent);
      }
    }
  }

  showTeleCT(){
    console.log(this._constantsService.teleConsultationNewFlow);
    if (this._constantsService.teleConsultationNewFlow) {
      this._constantsService.teleConsultationNewFlow = false;
      this.router.navigate(['/teleconsultation']);
      return;
    } else {
      let consultantObject = this._constantsService.aesDecryption('consultantDataObj');
      let parsedConsultantObject = JSON.parse(consultantObject);
      // let consultantObject = this._constantsService.aesDecryption(localStorage.getItem("consultantObject"));
      // let parsedConsultantObject = JSON.parse(consultantObject);
      if (parsedConsultantObject["ct"] === "Fitness Class") {
        this.router.navigate(['/fitnessPage']);
        localStorage.removeItem("consultantDataObj");
      }else{
        this.router.navigate(['/teleconsult-type']);
      }
    }
  }

  selectRandomColor(arr){
    var indexValue: number = 0;
    for (let i = 0; i < arr.length; i++) {
      if (indexValue === 10) {
        indexValue = 0;
      }
      this.consultSpecialityColor[i] = this.colors.consultSpecialityColors[indexValue];
      indexValue++;
    }
  }
}
