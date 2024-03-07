import { Component, OnInit, HostListener } from '@angular/core';
import { AuthServiceLogin } from '../../services/auth.service.login'
import { AuthService } from '../../services/auth.service'
import { ConstantsService } from '../../services/constants.service';
import { HttpClient } from "@angular/common/http";
import { Router } from '@angular/router'

@Component({
  selector: 'app-take-survey',
  templateUrl: './take-survey.component.html',
  styleUrls: ['./take-survey.component.css']
})


export class TakeSurveyComponent implements OnInit {  

  questions = [];  
  quesValidate: boolean = false;  
  filterQuestions = [];
  yesOptionShow: boolean = false;
  questionSkipTxt: boolean = false;

  currentQues = 0;
  preBtnDisable = true;
  nxtBtnTxt = this.filterQuestions.length-1 == this.currentQues ? "Submit" : "Next";
  questionShow = true;
  D3checkBoxShow = false;
  D3CheckBox = [];

  getCurrentCheckBoxVal(ans) {
    this.quesValidate = false;
    if(ans == 'Yes'){
      this.D3CheckBox = [];
      for(let j = 0; this.filterQuestions[this.currentQues].yes.length > j; j++){              
          this.filterQuestions[this.currentQues].yes[j].check = false;
      }
      this.filterQuestions[this.currentQues].answer = ans;
      this.D3checkBoxShow = true;
    } else {
      this.D3CheckBox = [];
      this.filterQuestions[this.currentQues].answer = ans;
      this.D3checkBoxShow = false;
    }    

    console.log(this.filterQuestions[this.currentQues].answer);
  }
  
  getCurrentRadioBtnVal(val){
    //alert(val);
    if(val == "yes"){
      if(this.filterQuestions[this.currentQues].yes.option.length > 0){
        this.filterQuestions[this.currentQues].yes.showStatus = true;
      }
    } else {
      this.filterQuestions[this.currentQues].yes.showStatus = false;
    }
  }
  getYesRadioBtnVal(val){
    this.filterQuestions[this.currentQues].yes.answer = val;
  }

  CheckBoxValue(val){
      if(this.D3CheckBox.indexOf(val) !== -1){
        this.D3CheckBox = this.D3CheckBox.filter(obj => obj !== val);
      } else{
        this.D3CheckBox.push(val);
      }   

      this.filterQuestions[this.currentQues].yes.answer = this.D3CheckBox;
      
      console.log(this.D3CheckBox);
      console.log(this.filterQuestions[this.currentQues]);
   
  }

 /* reloadCurrentCompt() {
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.router.navigate(['takesurvey']);
    });
  }*/

  nxtQues(){
    let finalAns: any;
    let d3Answe = [];
    if(this.filterQuestions[this.currentQues].answer == "yes"){
      if(this.filterQuestions[this.currentQues].yes.option.length > 0){
        if(this.filterQuestions[this.currentQues].yes.answer == "" || this.filterQuestions[this.currentQues].yes.answer.length == 0){
          this.quesValidate = true;
          return 0;
        } else {
          if(Array.isArray(this.filterQuestions[this.currentQues].yes.answer)){ // D3 question
           if(this.D3CheckBox.length > 0){
             for(let i = 0; this.D3CheckBox.length > i; i++ ){
                for(let j = 0; this.filterQuestions[this.currentQues].yes.option.length > j; j++){              
                  if(this.filterQuestions[this.currentQues].yes.option[j].value == this.D3CheckBox[i]){
                    this.filterQuestions[this.currentQues].yes.option[j].check = true;
                    d3Answe.push(this.D3CheckBox[i]);
                  }
                }
              }
              finalAns = d3Answe;
              
            } else {
              this.quesValidate = true;
              return 0;
            }
          } else {    
           finalAns = this.filterQuestions[this.currentQues].yes.answer;
          }
        }
      } else {
        finalAns = this.filterQuestions[this.currentQues].answer;
      }
    } else {
     finalAns = this.filterQuestions[this.currentQues].answer;      
    }

    this.quesValidate = false;
 
    if(finalAns == ""){
      this.quesValidate = true;
      return 0;
    } 

    if(this.filterQuestions.length-1 == this.currentQues){
      this.questionShow = false;
    }
    
    let q_id = this.filterQuestions[this.currentQues].q_id;    
    let ihl_answer = {};
 
    if(this.filterQuestions[this.currentQues].yes.type == "checkbox"){ // D3 Question
      if(this.filterQuestions[this.currentQues].answer == "no"){
        finalAns = [];  
      } else if(this.filterQuestions[this.currentQues].answer != "yes") {
        finalAns = this.filterQuestions[this.currentQues].answer;
      }
    }

    ihl_answer['Q'+q_id] = finalAns;

    console.log(ihl_answer);

    if(this.currentQues <  this.filterQuestions.length-1){
      this.filterQuestions[this.currentQues+1].showStatus = true;
      this.filterQuestions[this.currentQues].showStatus = false;
      this.currentQues++;
    } 
    this.nxtBtnTxt = this.filterQuestions.length-1 == this.currentQues ? "Submit" : "Next";
    this.preBtnDisable = this.currentQues  == 0 ? true : false;
   
    // skip txt show
    if((this.currentQues) % 5 == 0 ){
      if(this.currentQues != 1){
        this.questionSkipTxt = true;
      }
    } else {
      this.questionSkipTxt = false;
    }


  console.log("before call answer submit");
  this._authServiceLogin.takeSurveyAnswer(ihl_answer).subscribe(data =>  {    
    console.log(data);
    let finalData:any;
    if(data != ""){
      data = JSON.parse(data.replace(/&quot;/g, '\\"'));
      finalData = data;
      if(typeof finalData === "string"){        
        localStorage.setItem("surveyScore", this._constant.aesEncryption(finalData));
        this._authServiceLogin.scoreFetch();
        this._authServiceLogin.publish('score-update');
        console.log( this._authServiceLogin.scoreFetch());
      }
    }
  })

  }
  preQues(){
    this.quesValidate = false;
    if(this.currentQues > 0){
      this.filterQuestions[this.currentQues-1].showStatus = true;
      this.filterQuestions[this.currentQues].showStatus = false;
      this.currentQues--;
    } 
    this.nxtBtnTxt = this.filterQuestions.length-1 == this.currentQues ? "Submit" : "Next";
    this.preBtnDisable = this.currentQues  == 0 ? true : false;
    this.questionSkipTxt = false;
    // skip txt show
    // if((this.currentQues) % 5 == 0 ){
    //   this.questionSkipTxt = true;
    // } else {
    //   this.questionSkipTxt = false;
    // }
  }

  skipQuestion(){    
    this.router.navigate(['dashboard']);
  }

  questionCompleted(){    
    this.router.navigate(['dashboard']);
 }

 finalSurveyQuestion = [];
 finalSurveyQuestionIndex = 0;
  constructor(private _authServiceLogin: AuthServiceLogin, 
    private httpClient: HttpClient,    
    private router: Router,
    private authService: AuthService,
    private _constant: ConstantsService) { }

  ngOnInit() {
    this.authService.basicInfoCheck();

    // this.reloadCurrentCompt();
    
    let userData = JSON.parse(this._constant.aesDecryption('userData'));
    //if(userData[''])

    this.questions = this._authServiceLogin.getSurveyQuestions();
    console.log(this.questions);
    
    this.httpClient.get("assets/questions.json").subscribe(data =>{
      console.log(data);
      this.finalSurveyQuestionIndex = 0;
      for(let i = 0; this.questions.length > i; i++ ){
        for(let j = 0; Object.keys(data).length > j; j++ ){
          if(data[j].q_id == this.questions[i]){
            if(data[j].q_id == "A5"){
              let bmcRange = [ {"status": "Normal", "range": "(BMC: < 25%)", "value":"normal"}, {"status": "Acceptable", "range": "(BMC: 25% - 32%)", "value":"acceptable"}, {"status": "High", "range": "(BMC: > 32%)", "value":"high"}, {"status":"Don't know", "range": "", "value": "dont_know"}];
              if(userData['gender'] == "m"){
                let bmcRange = [ {"status": "Normal", "range": "(BMC: < 18%)", "value":"normal"}, {"status": "Acceptable", "range": "(BMC: 18% - 24%)", "value":"acceptable"}, {"status": "High", "range": "(BMC: > 25%)", "value":"high"}, {"status":"Don't know", "range": "", "value": "dont_know"}];
              }
              data[j].option = bmcRange;
            }
            this.finalSurveyQuestion[this.finalSurveyQuestionIndex] = data[j];
            this.finalSurveyQuestionIndex++;
          }
        }
      }

      console.log(this.finalSurveyQuestion);
      this.filterQuestions = this.finalSurveyQuestion;
      if(this.filterQuestions.length > 0){
        this.filterQuestions[0].showStatus = true; 
      }
    })
  }
  
}
