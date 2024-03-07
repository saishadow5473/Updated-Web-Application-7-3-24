import { Component, OnInit } from '@angular/core';
import dietFitnessRecommendations from '../../../assets/dietFitnessRecommendations.json';
import dietTips from '../../../assets/dietTips.json';
import { AuthService } from 'src/app/services/auth.service';
import { ConstantsService } from 'src/app/services/constants.service';

@Component({
  selector: 'app-recommendations',
  templateUrl: './recommendations.component.html',
  styleUrls: ['./recommendations.component.css']
})
export class RecommendationsComponent implements OnInit {
  dietJson: any
  lastVitalTest: any
  bpClass: any
  pulseClass: any
  fatClass: any
  bmiClass: any
  spo2Class: any
  temperatureClass: any
  gender: any
  filteredPlan = []
  energy_needed: any
  recommendType = ""
  recommendTypeExercise = ""
  restrictions = ""
  Recomedation = ""
  recomedation: any
  energyneed: any;
  exercislight: any
  exercismoderate: any
  exercisintense: any
  lastTakenTest: any
  userInfo: any
  exercise: any
  age: any
  showRestrictions = false

  constructor(private authService: AuthService, public _constant: ConstantsService,) { }

  ngOnInit() {
    this.userInfo = JSON.parse(this._constant.aesDecryption('userData'))
    this.lastTakenTest = JSON.parse(this._constant.aesDecryption('healthData'))
    if (this.lastTakenTest !== null) {
      this.age = parseFloat((this.lastTakenTest.Age))
      this.gender = this.userInfo.gender
      if (!(this.lastTakenTest.bpClass)) {
        this.bpClass = '';
      }
      if (!(this.lastTakenTest.pulseClass)) {
        this.pulseClass = '';
      }
      if (!(this.lastTakenTest.fatClass)) {
        this.fatClass = '';
      }
      if (!(this.lastTakenTest.bmiClass)) {
        this.bmiClass = '';
      }
      if (!(this.lastTakenTest.spo2Class)) {
        this.spo2Class = '';
      }
      if (!(this.lastTakenTest.temperatureClass)) {
        this.temperatureClass = '';
      }
    }
    this.dietParse(this.gender, this.bpClass, this.pulseClass, this.bmiClass, this.fatClass, this.spo2Class, this.temperatureClass)
  }

  dietParse(thisGender, thisBP, thisPulse, thisBmi, thisBmc, thisSpo2, thisTemp) {
    var dietData = dietTips;
    var filtered = dietData.filter(x => { return x.bp == thisBP && x.pulse == thisPulse && x.bmi == thisBmi && x.bmc == thisBmc && x.spo2 == thisSpo2 && x.temp == thisTemp });
    var filteredGender = dietData.filter(x => { return x.bp == thisGender });
    var dietQuery = "";
    if (filtered.length > 0 && filteredGender.length !== 0) {
      if (thisGender == 'm' || thisGender === 'male') {
        if (filteredGender[0].male != "") {
          dietQuery = filteredGender[0].male;
        } else {
          dietQuery = "GD1";
        }
      } else {
        if (filteredGender[0].female != "") {
          dietQuery = filteredGender[0].female;
        } else {
          dietQuery = "GD1";
        }
      }
    } else {
      dietQuery = "GD1";
    }
    var dietparsedjson = dietFitnessRecommendations;
    this.filteredPlan = dietparsedjson.filter(x => { return x.diet_plan == dietQuery });
    var filteredData = this.filteredPlan[0];
    if (this.restrictions == "") {
      this.showRestrictions = false
      this.restrictions = "N/A";
    } else {
      this.showRestrictions = true
      this.restrictions = this.restrictions;
    }
    if (this.Recomedation == "") {
      this.showRestrictions = false
      this.Recomedation = "N/A";
    } else {
      this.showRestrictions = true
      this.Recomedation = this.Recomedation;
    }
    if (this.age >= 13 && this.age <= 35) {
      this.exercise = filteredData.exercise_light;
    } else if (this.age >= 36 && this.age <= 60) {
      this.exercise = filteredData.exercise_moderate;
    } else if (this.age >= 61) {
      this.exercise = filteredData.exercise_light;
    }
    this.recomedation = filteredData.recommedation;
    this.energyneed = filteredData.energy_needed;
  }
}
