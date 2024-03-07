import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConstantsService } from '../../services/constants.service';
import { TeleConsultService } from '../../services/tele-consult.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ModalComponent } from '../modal/modal.component';
import { ColorsService } from 'src/app/services/colors.service';
import { GlobalCdnService } from 'src/app/services/global-cdn.service';

@Component({
  selector: 'app-affiliated-users',
  templateUrl: './affiliated-users.component.html',
  styleUrls: ['./affiliated-users.component.css']
})
export class AffiliatedUsersComponent implements OnInit, OnDestroy {

  userLocalData = JSON.parse(this.constant.aesDecryption('userData'));
  mainTitle:string;
  isLoading:boolean = false;
  openAffiliatedFeatures = false;
  affiliatedDataObjArr:object[] = [];
  brand_image_url_exist:boolean = false;
  brand_image_url:string = '';
  subscription:any;
  specality_name_list:object[] = [];
  consultSpecialityColor:string[] = [];
  affiliationCategoryList = ['Social Wellbeing','Emotional Wellbeing','Financial Wellbeing','Physical Wellbeing'];
  showCatogory:boolean = true;

  constructor(private router: Router, public constant: ConstantsService, private teleservice: TeleConsultService, private _teleConsultService: TeleConsultService,private dialog: MatDialog,private colors:ColorsService, private globalCdn: GlobalCdnService) { }

  ngOnInit() {
    this.globalCdn.load('autobahn');
    // this.constant.teleconsultationFlowSelected = "";
    // this.constant.teleconsultationAffiliationSelectedName = "";
    this.subscription = this._teleConsultService.on('terms-condition-agree').subscribe(() => this.allowUserToTeleConsult());
    this.subscription = this._teleConsultService.on('terms-condition-agree-category').subscribe(() => this.allowUserToTeleConsultCategory());
  	this.mainTitle = 'Select Your Association';
    if((this.constant.teleConsultationNewFlow && this.constant.teleconsultationAffiliationSelectedName != '')){
      this.getAffiliatedCategoryList();
      this.openAffiliatedFeatures = true;
    }

  	this.constant.isAffiliatedRouterLink = true;
    if('user_affiliate' in this.userLocalData) {
      if(this.userLocalData['user_affiliate'] != null) {
        let affiliatedDataObj = this.userLocalData['user_affiliate'];
        for(const prop in affiliatedDataObj) {
          if(affiliatedDataObj[prop] != null) {
            this.affiliatedDataObjArr.push(affiliatedDataObj[prop]);
          }
        }
        this.affiliatedDataObjArr.map(company => {
          company['brand_image_url_exist'] = false;
          company['brand_image_url'] = '';
        });

        let loginType = localStorage.getItem('loginType');

        if (loginType == 'ssoLogin') {
          this.affiliatedDataObjArr = this.affiliatedDataObjArr.filter(company => {
            console.log(company);
            if('is_sso' in company && company['is_sso'] && company['affilate_name'] != "") {return company;}
          });
        } else {
          this.affiliatedDataObjArr = this.affiliatedDataObjArr.filter(company => {
            console.log(company);
            if(company['affilate_name'] != "") {return company;}
          });
        }
        console.log(this.affiliatedDataObjArr);
      }
    }

    let affiliatedCompaniesList = JSON.parse(this.constant.aesDecryption('affiliatedCompaniesList'));
    if(affiliatedCompaniesList != null) {
      this.addAffiliatedCompaniesImages(affiliatedCompaniesList);
    }
    else {
      this.teleservice.getAffiliationExclusiveData().subscribe(data => {
        this.addAffiliatedCompaniesImages(data);
      });
    }
  }

  ngOnDestroy(){
    if(this.subscription != undefined && this.subscription != null){
      this.subscription.unsubscribe();
    }
  }

  addAffiliatedCompaniesImages(affiliated_company_list) {
    affiliated_company_list.map(company => {
      if(this.affiliatedDataObjArr.length !== 0) {
        this.affiliatedDataObjArr.map(aff_company => {
          if(aff_company['affilate_unique_name'] == company['affiliation_unique_name']) {
            if(company['brand_image_url_exist'] != '') {
              aff_company['brand_image_url'] = company['brand_image_url'];
              aff_company['brand_image_url_exist'] = true;
            }
            else {aff_company['brand_image_url_exist'] = false;}
          }
        });
      }
    });
  }
  
  /*old code works fyn hided for 4 pillar category starts here
  //open affiliate card
  openAffiliateCard(aff_obj:object) {
    console.log(this.constant.teleconsultationAffiliationSelectedName);
    this.mainTitle = aff_obj['affilate_name'];
    this.constant.teleconsultationFlowSelected = 'affiliate';
    this.constant.teleconsultationAffiliationSelectedName = aff_obj['affilate_unique_name'];
    if(this.constant.teleconsultationAffiliationSelectedName == "dev-testing"){this.constant.teleconsultationAffiliationSelectedName = "dev_testing";}
    this.constant.teleconsultationAffiliationSelectedCompanyImg = aff_obj['brand_image_url'];
    this.constant.teleconsultationAffiliationCode = aff_obj['affilation_code'];
    this.openAffiliatedFeatures = true;
    if(aff_obj['brand_image_url'] != '') {
      this.brand_image_url_exist = true;
      this.brand_image_url = aff_obj['brand_image_url'];
    }
    console.log(aff_obj);
    this.specality_name_list = [];
  //As per persistent requirements Social Wellbeing','Emotional Wellbeing','Physical Wellbeing','Financial Wellbeing' speciality was implemented
    let persistArrayList = [ 'Social Wellbeing','Emotional Wellbeing','Physical Wellbeing','Financial Wellbeing'];
      if(aff_obj['affilate_unique_name'] == 'persistent'){
        this.teleservice.getTeleConsultUserPlatformData(this.userLocalData.id).subscribe(result=>{
          this.constant.consultationPlatformData = result;
          let consultationType = result['consult_type'].filter(obj=>{
            return obj['consultation_type_name'] ==='Fitness Class'
          })
          // console.log(consultationType);
          let persistentSpeciality:Object[] =[];
          for(let key in consultationType){
            persistentSpeciality = consultationType[key]['specality'];
            for(let i = 0; i < persistentSpeciality.length; i++){
              for(let j = 0; j < persistArrayList.length; j++){
                if(persistentSpeciality[i]['specality_name'] == persistArrayList[j] && persistentSpeciality[i]['courses'].length > 0){
                  this.specality_name_list.push(persistentSpeciality[i]);
                  // console.log(this.specality_name_list);  
                  this.constant.persistentSpecialityArrList = this.specality_name_list;
                  console.log(this.constant.persistentSpecialityArrList);
                }
              }
            }
          }
          this.selectRandomColor(persistentSpeciality);
        })
      }  
  }
  old code works fyn hided for 4 pillar category ends here*/

  //open card code for 4 pillar category concept
  openAffiliateCard(aff_obj:object) {
    console.log(this.constant.teleconsultationAffiliationSelectedName);
    this.mainTitle = aff_obj['affilate_name'];
    this.constant.teleconsultationFlowSelected = 'affiliate';
    this.constant.teleconsultationAffiliationSelectedName = aff_obj['affilate_unique_name'];
    if(this.constant.teleconsultationAffiliationSelectedName == "dev-testing"){this.constant.teleconsultationAffiliationSelectedName = "dev_testing";}
    this.constant.teleconsultationAffiliationSelectedCompanyImg = aff_obj['brand_image_url'];
    this.constant.teleconsultationAffiliationCode = aff_obj['affilation_code'];
    this.openAffiliatedFeatures = true;
    if(aff_obj['brand_image_url'] != '') {
      this.brand_image_url_exist = true;
      this.brand_image_url = aff_obj['brand_image_url'];
    }
    this.getAffiliatedCategoryList();
  }

  //Getting object of category details(consultant list, course list) and wellness card course list
  getAffiliatedCategoryList(){
    let overAllSpeacialityList:Object[] = [];
    let overAllConsultantList:Object[] = [];
    let overAllCourseList:Object[] = [];
    let overAllCourseListWithCatogory:Object[] = [];
    let filteredConsultantList:Object[] = [];
    let filteredCoursesList:Object[] = [];
    
    this.isLoading = true;
    this._teleConsultService.getTeleConsultUserPlatformData(this.userLocalData.id).subscribe(result=>{
      console.log(result);
      this.isLoading = false;
      this.constant.consultationPlatformData = result;
      this.constant.consultationPlatformData['consult_type'].forEach(element => {
        // console.log(element);
        if(element['specality'].length > 0){
          for(let k in element['specality']){
            overAllSpeacialityList.push(element['specality'][k])
          }

          //Overall Consultant List from speacilty
          overAllSpeacialityList.forEach(element => {
            // console.log(element);
              for(let key in element['consultant_list']){
                overAllConsultantList.push(element['consultant_list'][key])
              }
          });

          // Overall course List from speacilty
          overAllSpeacialityList.forEach(element=>{
            // console.log(element)
            for(let key in element['courses']){
              overAllCourseList.push(element['courses'][key])
            }
          });
        }        
      });
      
      //Filtering Consultant List
      overAllConsultantList.forEach(res=>{
        if(res['affilation_excusive_data'] != undefined && res['affilation_excusive_data'] != null && Object.keys(res['affilation_excusive_data']).length > 0 
          && res['affilation_excusive_data']['affilation_array'] != undefined && res['affilation_excusive_data']['affilation_array'] != null 
          && Object.keys(res['affilation_excusive_data']['affilation_array']).length > 0 && res['category'] != null 
          && res['category'] != undefined && res['category'] != ''){
          filteredConsultantList.push(res);
        }
      });
      this.constant.filteredConsultantList = filteredConsultantList;
      console.log(this.constant.filteredConsultantList)

      //Filtering course List
      overAllCourseList.forEach(res=>{
        if(res['affilation_excusive_data'] != undefined && res['affilation_excusive_data'] != null && Object.keys(res['affilation_excusive_data']).length > 0 
          && res['affilation_excusive_data']['affilation_array'] != undefined && res['affilation_excusive_data']['affilation_array'] != null 
          && Object.keys(res['affilation_excusive_data']['affilation_array']).length > 0 && res['category'] != null 
          && res['category'] != undefined && res['category'] != ''){
            filteredCoursesList.push(res);
        }
      });
      this.constant.filteredCoursesList = filteredCoursesList;
      console.log(this.constant.filteredCoursesList);

      //Filtering courses without coming under 4 pillar category
      overAllCourseList.forEach((res) =>{
        if(res['category'] == undefined || res['category'] == '' || res['category'] == null){
          // console.log(res)
          overAllCourseListWithCatogory.push(res);
        }
      });

      //to avoid dupliaction in array of objects
      this.constant.overAllCourseList = overAllCourseListWithCatogory.filter((item, index) => overAllCourseListWithCatogory.indexOf(item) === index);
    });
  }

  selectCategory(category){
    this.showCatogory = false;
    this.constant.showAffCourseWithoutCategory = false;
    this.constant.teleSpecalityType = category;
    this.constant.isLoading = true;
   
    //Enable terms and condition popup
    this.constant.teleConsultationNewFlow = true;
    this.constant.startCallFlow = true;
    localStorage.setItem('teleflow', this.constant.aesEncryption("consult"));
    this.constant.teleConsultaionAgree = true;
    this.dialog.open(ModalComponent);
  }

  allowUserToTeleConsultCategory(){
    console.log('call');
    //creating consultant list having category property for selected pillar
    let filteredConsultantList:Object[] = [];
    filteredConsultantList = this.constant.filteredConsultantList;
    this.constant.filteredConsultantList = [];
    if(filteredConsultantList.length > 0){
      this.constant.filteredConsultantList = filteredConsultantList.filter(obj =>{
        // console.log(obj);
        return obj['category'] === this.constant.teleSpecalityType;
      });

      //to avoid dupliaction in array of object
      this.constant.filteredConsultantList = this.constant.filteredConsultantList.filter((item, index) => this.constant.filteredConsultantList.indexOf(item) === index);
    }

    //creating course list having category property for selected pillar
    let filteredCoursesList:Object[] = [];
    filteredCoursesList = this.constant.filteredCoursesList;
    this.constant.filteredCoursesList = []; 
    if(filteredCoursesList.length > 0){
      this.constant.filteredCoursesList = filteredCoursesList.filter(obj =>{
        // console.log(obj);
        return obj['category'] === this.constant.teleSpecalityType;
      });

      //to avoid dupliaction in array of object
      this.constant.filteredCoursesList = this.constant.filteredCoursesList.filter((item, index) => this.constant.filteredCoursesList.indexOf(item) === index);
      
      // var retrievedObject = this.constant.aesDecryption('consultantDataObj');
      // var consultTypeData = JSON.parse(retrievedObject);
      // consultTypeData.st = category;
      var consultTypeData = {"ct":'Fitness Class' , "st":this.constant.teleSpecalityType.toString()};
      // if(consultTypeData == undefined || consultTypeData == null){
      //   consultTypeData = {"ct":'Fitness Class' , "st":this.constant.teleSpecalityType.toString()};
      // }
      localStorage.setItem("consultantDataObj", this.constant.aesEncryption(JSON.stringify(consultTypeData)));
      // console.log(this.constant.aesDecryption(localStorage.getItem('consultantDataObj')))
    }

    if(this.constant.filteredConsultantList.length > 0 || this.constant.filteredCoursesList.length > 0){
      // this.constant.teleSpecalityType = category;
      this.router.navigate(['/affiliated-catogory-users'])
    }
  }

  //back button
  backtoMain(){
    this.openAffiliatedFeatures = false;
    // this.mainTitle = 'Affiliation';
    this.mainTitle = 'Select Your Association';
    this.brand_image_url_exist = false;
  }

  //open health consult card
  gotoHealthConsultPage() {
  	this.router.navigate(['/teleconsultation']);
  }

  //open wellness cart card
  gotoWellnessCartPage() {
    this.constant.showAffCourseWithoutCategory = true;
    this.router.navigate(['/affiliated-catogory-users']);
  }

  onDiagnosticsClick(){
    let userData = JSON.parse(this.constant.aesDecryption('userData'));
    if(userData.isTeleMedPolicyAgreed == undefined || userData.isTeleMedPolicyAgreed == false){// user not agree the terms & condition
      this.constant.teleConsultaionAgree = true;
      this.dialog.open(ModalComponent);
    } else {    
      this.allowUserToTeleConsult();
    } 
  }

  allowUserToTeleConsult(){
    this.constant._isDiagnosticConsultantSelected = true;
    if(this.constant.consultationPlatformData == undefined || this.constant.consultationPlatformData == null){
      this.router.navigate(['/teleconsultation']);
      return;
    }
    // if(this.constant.teleconsultationFlowSelected == "affiliate"){
    //   return true; 
    // }
    this.constant.teleConsultPageFlow = [];    
    this.constant.teleSpecalityType = null;
    this.constant.startCallFlow = true;
    this.constant.teleConsultType = "Health Consultation";
    this.constant.teleConsultPageFlow.push("Health Consultation");
    this.constant.teleSpecalityType = "Diagnostic Services";
    var consultantObj = {"ct":"Health Consultation" , "st":"Diagnostic Services"};
    localStorage.setItem("consultantDataObj" , this.constant.aesEncryption(JSON.stringify(consultantObj)));
    this.constant._isDiagnosticConsultantSelected = false;
    this.router.navigate(['/teleconsult-doctors']);
  }

  selectRandomColor(arr){
    // console.log(arr);
    var indexValue: number = 0;
    for (let i = 0; i < arr.length; i++) {
      if (indexValue === 10) {
        indexValue = 0;
      }
      this.consultSpecialityColor[i] = this.colors.consultSpecialityColors[indexValue];
      indexValue++;
    }
  }
  specialitySelect(specality_name){  // hardcore the nessecesary details for peristent speciality requirements
    this.constant.teleConsultType = 'Fitness Class';
    this.constant.teleConsultPageFlow.push('Fitness Class');
    var consultantObj = {"ct":'Fitness Class' , "st":specality_name};
    localStorage.setItem("consultantDataObj", this.constant.aesEncryption(JSON.stringify(consultantObj)));
    this.router.navigate(['/subscribe-online-classes']);

  }
  
 //go to subscription page
  MySubscriptions() {
    this.router.navigate(['/mysubscription']);
  }
}