import { Component, OnInit, ViewChild } from '@angular/core';
import { ChallengesService } from 'src/app/services/challenges.service';
import { MatAccordion } from '@angular/material/expansion';
import { FormGroupDirective, NgForm, FormControl, Validators } from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ConstantsService} from 'src/app/services/constants.service';
import { ModalComponent } from '../modal/modal.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

//angular material code for displaying error message when invalid control is touched or submitted
export class FormErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-challenges',
  templateUrl: './challenges.component.html',
  styleUrls: ['./challenges.component.css']
})
export class ChallengesComponent implements OnInit {

  @ViewChild(MatAccordion) accordion: MatAccordion;

  constructor(private _programHttp: ChallengesService,
    private snackBar: MatSnackBar,
    private _constant: ConstantsService,
    private dialog: MatDialog) { }

  isCardOpened:boolean = false;
  challengesList:any = [];
  selectedProgram:any = {};
  challengeEndDate:any;
  isChallengeAccepted:boolean = false;
  isChallengeCompleted:boolean = false;
  isLoading:boolean = false;
  isProgramListLoading:boolean = false;
  isFormLoading:boolean = false;
  isFormSubmitted:boolean = false;
  showSuccessMessage:boolean = false;
  programName:string = "";
  dailyChallengeList:any = [];
  currentDate = new Date();
  tomorrow = new Date();
  yesterday = new Date();
  tomorrowDate = this.currentDate.getDate()+1;
  yesterdayDate = this.currentDate.getDate()-1;
  localUserDataList: any = this._constant.aesDecryption("userData");
  parsedLocalUserDataList = JSON.parse(this.localUserDataList);
  IHLUserId:any = this.parsedLocalUserDataList.id;
  programId:any;
  programInfo:string = "";
  api_banner_image:string = "";

  //add new properties (dates, lock) to each and every object in the dailyChallengeList array
  addDatesInChallengeList(start_date) {
    let count = 1;
    this.dailyChallengeList.map(day => {
      day.date = new Date(start_date);
      day.isDayLocked = true;
      day.icon = "lock";
      let newDate = day.date.getDate()+count;
      day.date.setDate(newDate);
      day.date.setHours(0,0,0,0);
      count++;
    });
    this.currentDate.setHours(0,0,0,0);
    this.checkIfChallengeCompleted(this.dailyChallengeList[this.dailyChallengeList.length-1].date);
    this.unlockDate();
    this.updateDates();
  }

  //finding last challenge date, tomorrow & yesterday's date
  updateDates() {
    this.tomorrow.setDate(this.tomorrowDate);
    this.yesterday.setDate(this.yesterdayDate);
    for(let day of this.dailyChallengeList) {
      if(day.date.getDate() === this.tomorrow.getDate() &&
        day.date.getMonth() === this.tomorrow.getMonth() &&
        day.date.getFullYear() === this.tomorrow.getFullYear())
      {
        day.temp_date = "Tomorrow";
      }
      else if(day.date.getDate() === this.yesterday.getDate() &&
        day.date.getMonth() === this.yesterday.getMonth() &&
        day.date.getFullYear() === this.yesterday.getFullYear())
      {
        day.temp_date = "Yesterday";
      }
      else if(day.date.getDate() === this.currentDate.getDate() &&
        day.date.getMonth() === this.currentDate.getMonth() &&
        day.date.getFullYear() === this.currentDate.getFullYear())
      {
        day.temp_date = "Today";
      }
      else {
        let splitDate = day.date.toString().split(' ');
        day.temp_date = splitDate[2]+"-"+splitDate[1]+"-"+splitDate[3];
      }
    }
    this.challengeEndDate = this.dailyChallengeList[this.dailyChallengeList.length-1].temp_date;
    this.isLoading = false;
  }

  //unlock date
  unlockDate() {
    this.dailyChallengeList.map(day => {
      if(day.day === 'Day 1' || (day.date <= this.currentDate))
      {
        day.isDayLocked = false;
        day.icon = 'lock_open';
      }
      else {
        day.isDayLocked = true;
        day.icon = 'lock';
      }
    });
  }

  //update user visit details and current date
  updateVisits(program_id) {
    //check the start date of enrolled program
    this._programHttp.updateUserVisits(this.IHLUserId, program_id).subscribe(data => {
      let parseData = data.replace(/(&quot\;)/g,"\"");
      let receivedData = JSON.parse(parseData);
      let start_date = new Date(receivedData.enroll_timestamp);
      this.addDatesInChallengeList(start_date);
      this.checkFormSubmission(program_id);
    });
  }

  //list out daily challenges
  listOutDailyChallenges(program_id) {
    this.challengesList.map(challenge => {
      if(challenge.program_id === program_id) {
        this.dailyChallengeList = challenge.program_array;
      }
    });
  }

  //already enrolled
  alreadyEnrolled(program_id) {
    this.isChallengeAccepted = true;
    this.listOutDailyChallenges(program_id);
    this.updateVisits(this.programId);
  }

  //never enrolled
  neverEnrolled(program_id) {
    this.isChallengeAccepted = false;
    this.challengesList.map(program => {
      if(program.program_id === program_id) {
        this.selectedProgram = program;
      }
    });
    this.isLoading = false;
  }

  //checking the challenge is already accepted or not
  checkEnrollmentStatus(program_id) {
    this.isLoading = true;
    this._programHttp.isEnrolled(this.IHLUserId, program_id).subscribe(data => {
      let parseData = data.replace(/(&quot\;)/g,"\"");
      let receivedData = JSON.parse(parseData);
      if(receivedData.enrollment_status === "yes") {
        this.alreadyEnrolled(program_id);
      }
      else {
        this.neverEnrolled(program_id);
      }
    });
    this.programId = program_id;
  }

  //open the challenge cards
  openChallengeCards(program_id) {
    this.isLoading = true;
    this.challengesList.map(program => {
      if(program.program_id === program_id) {
        this.programName = program.program_name;
        this._constant.challenge_programName = this.programName;
        this.api_banner_image = program.program_banner;
      }
    });
    this.isCardOpened = true;
    this.checkEnrollmentStatus(program_id);
  }

  //accept challenge button
  startChallenge(program_id) {
    this.isLoading = true;
    this.isChallengeAccepted = true;
    this._constant.challenge_welcomeWindow = true;
    this._constant.challenge_numberOfDays = this.selectedProgram['number_of_days'];
    this.dialog.open(ModalComponent);
    let enrollData = {"user_ihl_id":this.IHLUserId, "program_id":program_id};
    this._programHttp.enroll(this.IHLUserId, enrollData, program_id).subscribe(() => {
      this.alreadyEnrolled(program_id);
    });
  }

  //back button
  backtoMain() {
    this.isCardOpened = false;
  }

  //check if the challenge is completed or not
  checkIfChallengeCompleted(endDate) {
    if(this.currentDate >= endDate)
    {
      this.isChallengeCompleted = true;
      if(
        this.currentDate.getDate() == endDate.getDate() &&
        this.currentDate.getMonth() == endDate.getMonth() &&
        this.currentDate.getFullYear() == endDate.getFullYear()
        )
      {
        this.programInfo = `This ${this.programName} challenge ends at`;
      } else { this.programInfo = `This ${this.programName} challenge ended at`; }
    }
    else {
      this.isChallengeCompleted = false;
      this.programInfo = `This ${this.programName} challenge ends at`;
    }
  }

  //feedback form control
  user_ratings = new FormControl(null, Validators.required)
  likely_to_share = new FormControl('', Validators.required)
  feedback_message = new FormControl('', Validators.required)

  //feedback form error message (mat-error)
   matcher = new FormErrorStateMatcher();

  //submit feedback button
  submitFeedback() {
    if(this.user_ratings.valid && this.likely_to_share.valid && this.feedback_message.valid) {
      this.isFormLoading = true;
      let feedbackData = {
        "program_id":this.programId,
        "program_name":this.programName,
        "user_ihl_id":this.IHLUserId,
        "user_ratings":this.user_ratings.value.toString(),
        "feedback_message":this.feedback_message.value,
        "likely_to_share":this.likely_to_share.value
      };
      this._programHttp.submitFeedbackData(feedbackData).subscribe(() => {
        this.isFormSubmitted = true;
        this.isFormLoading = false;
      });
      this.snackBar.open('Successfully submitted.','Thanks for your valuable feedback!', {
        duration: 10000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
      this.checkFormSubmission(this.programId);
    }
    else {
      return;
    }
  }

  //check feedback already submitted or not
  checkFormSubmission(program_id) {
    this.isLoading = true;
    this._programHttp.updateUserVisits(this.IHLUserId, program_id).subscribe(data => {
      let parseData = data.replace(/(&quot\;)/g,"\"");
      let receivedData = JSON.parse(parseData);
      let feedback_submited = receivedData.feedback_submited;
      if(feedback_submited === "Yes") {
        this.isFormSubmitted = true;
      }
      else {
        this.isFormSubmitted = false;
      }
      this.isLoading = false;
    });
  }

  //format HTML Code
  formatHTMLCode(html_code) {
    let formatted_HTML = document.createElement('div');
    formatted_HTML.innerHTML = html_code;
    return formatted_HTML.childNodes[0].nodeValue;
  }

  parseHTML(receivedData) {
    receivedData.map(program => {
      program.program_detailed_description = this.formatHTMLCode(program.program_detailed_description);
      program.program_array.map(day => {
        day.instruction = this.formatHTMLCode(day.instruction);
      });
      if(program['program_icon'] == null || undefined) {
        program.program_icon = "far fa-thumbs-up";
      }
    });
    this.challengesList = receivedData;
    this.isProgramListLoading = false;
  }

  shareBtn(media) {
    let url = this._constant.externalBaseURL+'/login.html';
    let winHeight = 400;
    let winWidth = 500;
    let winTop = (screen.height / 2) - (winHeight / 2);
    let winLeft = (screen.width / 2) - (winWidth / 2);
    let quote = `Hey there, I have accepted the IHL ${this.programName} health challenge, I feel better after following the program instructions. Do give it a try.`;

    if(media.toLowerCase() === 'facebook') {
      window.open('https://www.facebook.com/sharer/sharer.php?s=100&u=' + url + '&display=popup&quote=' + quote, 'sharer', 'top=' + winTop + ',left=' + winLeft + ',toolbar=0,status=0,width=' + winWidth + ',height=' + winHeight  + '&p[images][0]=' + encodeURIComponent(this._constant.externalBaseURL+'images/banner/mban2.png'));
    }
    else if(media.toLowerCase() === 'linkedin') {
      window.open('https://www.linkedin.com/shareArticle?mini=true&source=indiahealthlink.com&url=' + url + '&summary=' + quote, 'sharer', 'top=' + winTop + ',left=' + winLeft + ',toolbar=0,status=0,width=' + winWidth + ',height=' + winHeight);
    }
    else if(media.toLowerCase() === 'twitter') {
      window.open('https://twitter.com/intent/tweet?text=' + quote + '&source=indiahealthlink.com&url=' + url + '&via=IHLcom', 'sharer', 'top=' + winTop + ',left=' + winLeft + ',toolbar=0,status=0,width=' + winWidth + ',height=' + winHeight);
    }
  }

  ngOnInit() {
    this.isProgramListLoading = true;

    //subscribe to get all the program details
    this._programHttp.getProgramDetails().subscribe(data => {
      let parseData = data.replace(/(&quot\;)/g,"\"");
      let existingURLwithHttps = "https://indiahealthlink.com/";
      let existingURLwithHttp = "http://indiahealthlink.com/";
      parseData = parseData.replaceAll(existingURLwithHttps, this._constant.externalBaseURL);
      parseData = parseData.replaceAll(existingURLwithHttp, this._constant.externalBaseURL);
      let receivedData = JSON.parse(parseData);
      console.log(receivedData);
      this.parseHTML(receivedData);
    });

    // if(this._constant.tourDoneShowHbuddy === true) {
    //   setTimeout(() => {
    //     window['$crisp'].push(["do", "message:show", ["text", "Ask us your Questions"]]);
    //     this._constant.tourDoneShowHbuddy = false;
    //   }, 90000);
    // }

    // this._programHttp.getLocalJSONDailyTaskData().subscribe(data => {
    //   this.challengesList = data;
    //   console.log(this.challengesList)
    //   this.isProgramListLoading = false;
    // });
  }
}
