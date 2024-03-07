import { Component, OnInit, HostListener } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { AuthServiceLogin } from 'src/app/services/auth.service.login';
import { Constants } from 'src/app/Constants';
// import { NgxChartsModule } from '@swimlane/ngx-charts';
import { Router } from '@angular/router';
import { ConstantsService } from 'src/app/services/constants.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
// import { ModalComponent } from '../modal/modal.component';
import { EventEmitterService } from 'src/app/services/event-emitter.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  healthData: any
  graphData: any
  goals: any = null
  Constants: Constants = new Constants()
  keys: any
  goalKeys: any
  vitalLaskCheckins = [];

  loading = true
  bannerImg: any
  @HostListener('window:resize', ['$event'])
  onResize(event) {

    if(window.innerWidth <= 500)
    {
      this.bannerImg = "assets/img/familyheart.jpg"
    }
    else if(window.innerWidth > 500 && window.innerWidth <= 1600){
      this.bannerImg = "assets/img/fruits.jpg"
    }else if(window.innerWidth > 1600){
      this.bannerImg = "assets/img/familyexcersmall.jpg"
    }
  }

//   onResize(event) {

//     const innerWidth = event.target.innerWidth;
//     console.log(innerWidth);

//     if (innerWidth <= 767) {
//        ...do something
//     }
//  }
  constructor(
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog,
    private authServiceLogin: AuthServiceLogin,
    private _constant: ConstantsService,
    private eventEmitterService: EventEmitterService
  ) { }

  view: any[] = [700, 400];


  // options
  showXAxis = true;
  showYAxis = true;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Date';
  showYAxisLabel = true;
  yAxisLabel = 'Heart rate';

  single: any
  vitals: any
  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  onSelect(event) {
    console.log(event);
  }

  ngOnInit() {

    // let isIntroDone = JSON.parse(localStorage.getItem('userData'))['introDone'];
    // if(isIntroDone == undefined || isIntroDone == false) {
    //   let isIntroDoneLocalData = JSON.parse(localStorage.getItem('isIntroDoneLocalData'));
    //   if(isIntroDoneLocalData == undefined || isIntroDoneLocalData == false) {
    //     if(window.innerWidth > 500) {
    //     this._constant.initUITour = true;
    //     this.dialog.open(ModalComponent);
    //     localStorage.setItem('isIntroDoneLocalData', 'true');
    //   }
    //   }
    // }

    if(window.innerWidth <= 500)
    {
      this.bannerImg = "assets/img/familyheart.jpg"
    }
    else if(window.innerWidth > 500 && window.innerWidth <= 1600){
      this.bannerImg = "assets/img/fruits.jpg"
    }else if(window.innerWidth > 1600){
      this.bannerImg = "assets/img/familyexcersmall.jpg"
    }

    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['verify'])
    }



    this.vitalLaskCheckins = this.authService.LastCheckin;
    console.log(this.vitalLaskCheckins);
    if(this.vitalLaskCheckins.length === 0 || this._constant.dashboardBmiCalculDone == false){
    this.authServiceLogin.getAPItokenKey().subscribe(data => {
      let apiKey = data["ApiKey"]
      localStorage.setItem('apiKey', apiKey);

      this.authService.fetchUser(this.authService.getIhlUserId(), apiKey).subscribe(data => {
        this.loading = false
        this.vitals = [];
        console.log(this.vitalLaskCheckins);

        if (data.length == 0) {
          this.authService.basicInfoCheck();
          this.vitalLaskCheckins = []
          var manualHeight = localStorage.getItem('height')
          var manualWeight = localStorage.getItem('weight')
          var height = parseFloat(manualHeight)
          var weight = parseFloat(manualWeight)
          var bmi = weight /(height * height)
          // let fatVital = { "title": 'Fat Ratio', "name": "fatRatio", "icon": 'fa-diagnoses', "color": "#4885ed", "val": '-' }
          let spo2Vital = { "title": 'SpO2', "name": "spo2", "icon": 'fa-lungs', "color": "#4885ed", "val": '-' }
          let temperatureVital = { "title": 'TEMPERATURE', "name": "temperature", "icon": 'fa-thermometer-half', "color": "#4885ed", "val": '-' }
          let pulseVital = { "title": 'PULSE', "name": "pulseBpm", "icon": 'fa-file-medical-alt', "color": "#4885ed", "val": '-' }
          let bpVital = { "title": 'Blood Pressure', "name": "bp", "icon": 'fa-heart', "color": "#4885ed", "val": '-' }
          let ecgVital = { "title": 'ECG', "name": "ecgbpm", "icon": 'fa-heartbeat', "color": "#4885ed", "val": '-' }
          let ProteinVital = { "title": 'Protein', "name": "protien", "icon": 'fac-vitals fa-protein', "color": "#4885ed", "val": '-' }
          let ECWVital = { "title": 'Extra Cellular Water', "name": "extra_cellular_water", "icon": 'fac-vitals fa-drop', "color": "#4885ed", "val": '-' }
          let ICWVital = { "title": 'Intra Cellular Water', "name": "intra_cellular_water", "icon": 'fac-vitals fa-dropICW', "color": "#4885ed", "val": '-' }
          let MineralVital = { "title": 'Mineral', "name": "mineral", "icon": 'fac-vitals fa-minerals', "color": "#4885ed", "val": '-' }
          let SMMVital = { "title": 'Skeletal Muscle Mass', "name": "skeletal_muscle_mass", "icon": 'fac-vitals fa-muscle', "color": "#4885ed", "val": '-' }
          let BFMVital = { "title": 'Body Fat Mass', "name": "body_fat_mass", "icon": 'fac-vitals fa-fat', "color": "#4885ed", "val": '-' }
          let WaistHipVital = { "title": 'Waist/Hip Ratio', "name": "waist_hip_ratio", "icon": 'fac-vitals fa-hip', "color": "#4885ed", "val": '-' }
          let BCMVital = { "title": 'Body Cell Mass', "name": "body_cell_mass", "icon": 'fac-vitals fa-cell', "color": "#4885ed", "val": '-' }
          let WtHRVital = { "title": 'Waist/Height Ratio', "name": "waist_height_ratio", "icon": 'fac-vitals fa-tape', "color": "#4885ed", "val": '-' }
          let VFVital = { "title": 'Visceral Fat', "name": "visceral_fat", "icon": 'fac-vitals fa-fat', "color": "#4885ed", "val": '-' }
          let BMRVital = { "title": 'Basal Metabolic Rate', "name": "basal_metabolic_rate", "icon": 'fac-vitals fa-fat', "color": "#4885ed", "val": '-' }
          let BMCVital = { "title": 'Bone Mineral Content', "name": "bone_mineral_content", "icon": 'fac-vitals fa-bone', "color": "#4885ed", "val": '-' }
          let PBFVital = { "title": 'Percent Body Fat', "name": "percent_body_fat", "icon": 'fac-vitals fa-fat', "color": "#4885ed", "val": '-' }
          if (bmi >= 18.5 && bmi <= 22.99) {
            let weightVital = { "title": 'WEIGHT', "name": "weightKG", "icon": 'fa-weight', "color": "#4caf50", "val": weight.toFixed(2), "unit": 'kgs' }
            let bmiVital = { "title": 'BMI', "name": "bmi", "icon": 'fa-female', "color": "#4caf50", "val": bmi.toFixed(2) }
            this.vitalLaskCheckins.push(bmiVital, weightVital, pulseVital, bpVital, ecgVital, spo2Vital, temperatureVital, ProteinVital, ECWVital,ICWVital,MineralVital,SMMVital,BFMVital,WaistHipVital,BCMVital,WtHRVital,VFVital,BMRVital,BMCVital,PBFVital);
          }
          else if ((bmi < 18.5) || (bmi >= 23 && bmi <= 27.5)) {
            let weightVital = { "title": 'WEIGHT', "name": "weightKG", "icon": 'fa-weight', "color": "#ff9800", "val": weight.toFixed(2), "unit": 'kgs' }
            let bmiVital = { "title": 'BMI', "name": "bmi", "icon": 'fa-female', "color": "#ff9800", "val": bmi.toFixed(2) }
            this.vitalLaskCheckins.push(bmiVital, weightVital, pulseVital, bpVital, ecgVital, spo2Vital, temperatureVital, ProteinVital, ECWVital,ICWVital,MineralVital,SMMVital,BFMVital,WaistHipVital,BCMVital,WtHRVital,VFVital,BMRVital,BMCVital,PBFVital);
          }
          else if (bmi > 27.5) {
            let weightVital = { "title": 'WEIGHT', "name": "weightKG", "icon": 'fa-weight', "color": "#f44336", "val": weight.toFixed(2), "unit": 'kgs' }
            let bmiVital = { "title": 'BMI', "name": "bmi", "icon": 'fa-female', "color": "#f44336", "val": bmi.toFixed(2) }
            this.vitalLaskCheckins.push(bmiVital, weightVital, pulseVital, bpVital, ecgVital, spo2Vital, temperatureVital, ProteinVital, ECWVital,ICWVital,MineralVital,SMMVital,BFMVital,WaistHipVital,BCMVital,WtHRVital,VFVital,BMRVital,BMCVital,PBFVital);
          }
          this._constant.dashboardBmiCalculDone = true;
          this.loading = false;
          console.log(this.vitalLaskCheckins);
         /*  this.router.navigate(['dashboard']);
          console.log(this.vitalLaskCheckins); */
        }

        else if (this.authService.WEIGHT.length == 0) {
          this.authService.basicInfoCheck();
          var manualHeight = localStorage.getItem('height')
          var manualWeight = localStorage.getItem('weight')
          var height = parseFloat(manualHeight)
          var weight = parseFloat(manualWeight)
          //var height = 1.5;
          //var weight = 70;
          var bmi = weight /(height * height)
          if (bmi >= 18.5 && bmi <= 22.99) {
            if(this.vitalLaskCheckins[1].title == 'BMI' && this.vitalLaskCheckins[2].title == 'WEIGHT'){
              this.vitalLaskCheckins[1].val = bmi.toFixed(2);
              this.vitalLaskCheckins[1].color = '#4caf50';
              this.vitalLaskCheckins[2].val = weight.toFixed(2);
              this.vitalLaskCheckins[2].color = '#4caf50';
            }
         }
          else if (bmi < 18.5) {
            if(this.vitalLaskCheckins[1].title == 'BMI' && this.vitalLaskCheckins[2].title == 'WEIGHT'){
              this.vitalLaskCheckins[1].val = bmi.toFixed(2);
              this.vitalLaskCheckins[1].color = '#ff9800';
              this.vitalLaskCheckins[2].val = weight.toFixed(2);
              this.vitalLaskCheckins[2].color = '#ff9800';
            }
          }
          else if (bmi > 27.5) {
            if(this.vitalLaskCheckins[1].title == 'BMI' && this.vitalLaskCheckins[2].title == 'WEIGHT'){
              this.vitalLaskCheckins[1].val = bmi.toFixed(2);
              this.vitalLaskCheckins[1].color = '#f44336';
              this.vitalLaskCheckins[2].val = weight.toFixed(2);
              this.vitalLaskCheckins[2].color = '#f44336';
            }
          }
          this._constant.dashboardBmiCalculDone = true;
          this.loading = false;
          /* this.router.navigate(['dashboard']);
          console.log(this.vitalLaskCheckins); */
        }
        else {
          const index = data["user"]["healthData"].length - 1
          this.goals = data["user"]["goals"]
          this.healthData = data["user"]["healthData"][index]["vitals"]

          this.graphData = data["user"]["graphData"]
          //console.log("GraphData: ", this.graphData);
          this.keys = Object.keys(data["user"]["healthData"][index]["vitals"])
          for (let index = 0; index < this.keys.length; index++) {
            if (this.keys[index] == "height") {
              this.vitals.push(this.keys[index])
            }
            if (this.keys[index] == "ecgBpm") {
              this.vitals.push(this.keys[index])
            }
            if (this.keys[index] == "fatRatio") {
              this.vitals.push(this.keys[index])
            }
            if (this.keys[index] == "weight") {
              this.vitals.push(this.keys[index])
            }
            if (this.keys[index] == "bmi") {
              this.vitals.push(this.keys[index])
            }
            if (this.keys[index] == "systolic") {
              this.vitals.push(this.keys[index])
            }
            if (this.keys[index] == "pulseBpm") {
              this.vitals.push(this.keys[index])
            }
            if (this.keys[index] == "spo2") {
              this.vitals.push(this.keys[index])
            }
            if (this.keys[index] == "temperature") {
              console.log(this.keys[index]);
              this.vitals.push(this.keys[index])
            }
            if (this.keys[index] == "percent_body_fat") {
              this.vitals.push(this.keys[index])
            }
            if (this.keys[index] == "body_cell_mass") {
              console.log(this.keys[index]);
              this.vitals.push(this.keys[index])
            }
            if (this.keys[index] == "bone_mineral_content") {
              this.vitals.push(this.keys[index])
            }
            if (this.keys[index] == "extra_cellular_water") {
              this.vitals.push(this.keys[index])
            }
            if (this.keys[index] == "intra_cellular_water") {
              this.vitals.push(this.keys[index])
            }
            if (this.keys[index] == "mineral") {
              this.vitals.push(this.keys[index])
            }
            if (this.keys[index] == "body_fat_mass") {
              this.vitals.push(this.keys[index])
            }
            if (this.keys[index] == "protien") {
              this.vitals.push(this.keys[index])
            }
            if (this.keys[index] == "skeletal_muscle_mass") {
              this.vitals.push(this.keys[index])
            }
            if (this.keys[index] == "visceral_fat") {
              this.vitals.push(this.keys[index])
            }
            if (this.keys[index] == "waist_hip_ratio") {
              this.vitals.push(this.keys[index])
            }
            if (this.keys[index] == "basal_metabolic_rate") {
              this.vitals.push(this.keys[index])
            }
            if (this.keys[index] == "waist_height_ratio") {
              this.vitals.push(this.keys[index])
            }
            this._constant.dashboardBmiCalculDone = true;
          }

          //this.goalKeys = Object.keys(data["user"]["goals"])





          //console.log(this.goals);
        }
      })

    });
   }
    else{
       this.loading = false;
    }
  }


  // this.authService.fetchMetrics(this.authService.getUser(), "heartRate").subscribe(data => {
  //   if(data["success"]){
  //     this.single = data["metrics"]
  //     console.log(this.single);

  //   }
  // })


  // toTitleCase(text){
  //   var result = text.replace( /([A-Z])/g, " $1" );
  //   return result.charAt(0).toUpperCase() + result.slice(1);
  // }

  getPercentFor(vital) {
    return ((this.healthData[vital] * 100) / this.goals[vital]).toFixed(2)
  }

  getPercentTextFor(vital) {
    return this.healthData[vital] + '/ ' + this.goals[vital]
  }

  teleCall(){
        //this.authService.publish('tele-call');
        /* setTimeout(() => {
          this._constant.generateCouponCode = true;
          this.dialog.open(ModalComponent);
        }, 150); */
        //this.loading = true;


        /* this._constant.processingContent = true;
        this.dialog.open(ModalComponent);
        this.authService.teleCallRedirection().subscribe(data =>  {
          console.log(data);
          if(data !== undefined && data !== null){
            this._constant.processingContent = false;
            this.eventEmitterService.onModalClose();
            window.location.href = data;
          }
        }); */

        this.router.navigate(['teleconsultation']);
  }


}
