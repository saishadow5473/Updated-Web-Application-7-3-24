import { Component, NgZone, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DatePipe } from "@angular/common";
import { Router } from '@angular/router';
import { TeleConsultService } from 'src/app/services/tele-consult.service';
import { ConstantsService } from 'src/app/services/constants.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ModalComponent } from '../modal/modal.component';
import { EventEmitterService } from 'src/app/services/event-emitter.service';
import { AuthService } from 'src/app/services/auth.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TeleconsultationCrossbarService, Channel } from 'src/app/services/tele-consult-crossbar.service';
import { PublishToChannelOptions } from '../../services/tele-consult-crossbar.service';
import { FormControl } from '@angular/forms';
import { PaymentDetails } from '../../classes/payment-details';
import { PaymentDetailsService } from '../../services/payment-details.service';
import { CollectPaymentDetails } from '../../contracts/collect-payment-details';
import { MockPaymentResponseData } from '../../contracts/mock-payment-response-data';
import { GlobalCdnService } from '../../services/global-cdn.service';
import { FireStoreService } from '../../services/firestore.service';
import { jsPDF } from "jspdf";

interface time_slots_interface {
  'morning': Array<string>;
  'afternoon': Array<string>;
  'evening': Array<string>;
  'night': Array<string>;
};

// In Js, 0 == Sunday, 1 == Monday, 2 == Tuesday, 3 == Wednesday, 4 == Thursday, 5 == Friday, 6 == Saturday
const week_days_mapping = {
  'Sunday': 0,
  'Monday': 1,
  'Tuesday': 2,
  'Wednesday': 3,
  'Thursday': 4,
  'Friday': 5,
  'Saturday': 6,
};

@Component({
  selector: 'app-subscribe-online-classes',
  templateUrl: './subscribe-online-classes.component.html',
  styleUrls: ['./subscribe-online-classes.component.css']
})
export class SubscribeOnlineClassesComponent implements OnInit {

  @ViewChild('invoicePdf', { static: false }) el!: ElementRef;
  classesList: Array<any> = [];
  classData: Array<any> = [];
  cardExpendDiv = false;
  selectedCourse: any | string = '';
  headerName = 'Select Classes';
  selectedCourseTimeSlots: time_slots_interface = undefined;
  userData: any;
  paymentTransactionId: number;
  printInvoiceNumber: any
  contactDetailsMobileNumber: any;
  course_fees: number;
  isLoading: boolean = false;
  // Here, 0th index means sunday
  // if 0th index == 0 means on sunday slot is not available, if 0th index == 1 means sunday is available
  selectedCourseWeekDaysAvailability: number[] = [0, 0, 0, 0, 0, 0, 0];

  // selectedCourseTimeSlots = [];
  // currentTimeSlot:date_interface_format;
  selectedStartDate: Date = undefined;
  selectedTimeSlot = undefined;
  selectedEndDate: Date = undefined;
  cssClassOfCalendarSelectedDates = '';
  isCourseDetailCardOpen = false;
  isBookingCardOpen = false;
  selectedStar: number = 0;
  sendReview: boolean = false;
  rateArray: number[] = [0, 0, 0, 0, 0];
  isValidationDone: boolean = false;
  noCourseIsAvailable: boolean = false;
  brand_image_url_exist: boolean = false;
  brand_image_url: string = '';
  subscriptionStartDate: string = "";
  @ViewChild('reviewField') reviewField: any;
  autoApproveCourseStatus: boolean = false;
  showSubscribeBtn: boolean = false;
  subscription: any;
  showInvoice: boolean = false;
  todayDate = new Date();
  givenCouponNumber: any = '';
  couponDiscountAmount: any = 0;
  actualClassFee: any = 0;
  //todayDate:Date = undefined;

  @ViewChild('matCalendar') cal;
  book: any = {};
  enableUrl: boolean = false;
  description_text: string = "";
  finalUrlLink: any;
  billObj: any;
  course_duration: any;
  title: any;
  provider: any;
  userName: any;
  userAddress: any;
  userMobNumber: any;
  userMail: any;
  deductedIgstAmt: any = 0;
  igstAmt: any = 0;
  sgstAmt: any = 0;
  state: any;
  totalAmount: any = 0;
  constructor(private router: Router,
    private _teleConsultService: TeleConsultService,
    private authService: AuthService,
    public _constantsService: ConstantsService,
    private sanitizer: DomSanitizer,
    private teleConsultCrossbarService: TeleconsultationCrossbarService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private eventEmitterService: EventEmitterService,
    private globalCdn: GlobalCdnService,
    private zone: NgZone,
    private fireStoreService: FireStoreService,
    private datePipe: DatePipe) {
  }

  ngOnInit() {
    this.globalCdn.load('razorPay');

    if (this._constantsService.teleConsultPageFlow.length == 0) {

      this.zone.run(() => {
        //this.router.navigate(['/teleconsultation']);
        this.router.navigate(['/fitnessPage']);
      });
    }

    const consultantObject = this._constantsService.aesDecryption('consultantDataObj');
    // const consultantObject = this._constantsService.aesDecryption(localStorage.getItem("consultantDataObj"));
    if (consultantObject == undefined || consultantObject == null) {
      this.zone.run(() => {
        //this.router.navigate(['/teleconsultation']);
        this.router.navigate(['/fitnessPage']);
      });
    }
    const parsedConsultantObject = JSON.parse(consultantObject);
    const consultanttype = parsedConsultantObject.ct;
    const specialityName = parsedConsultantObject.st;

    if (consultanttype == undefined || specialityName == undefined) {
      //this.router.navigate(['/teleconsultation']);
      this.router.navigate(['/fitnessPage']);
    }

    if (this._constantsService.consultationPlatformData == undefined) {
      this.userData = JSON.parse(this._constantsService.aesDecryption("userData"));
      this._teleConsultService.getTeleConsultUserPlatformData(this.userData.id).subscribe(data => {
        console.log(data);
        this._constantsService.consultationPlatformData = data;
        this.initializeCrossbarConnection();
        // this.populateClasses(this._constantsService.consultationPlatformData, consultanttype, specialityName);
      });
      this.zone.run(() => {
        //this.router.navigate(['/teleconsultation']);
        this.router.navigate(['/fitnessPage']);
      });
      /* this._teleConsultService.getTeleConsultData().subscribe(data => {
        this._constantsService.consultationPlatformData = data['consultation_platfrom_data'];
        this.populateClasses(this._constantsService.consultationPlatformData, consultanttype, specialityName);
      }); */

    } else {
      this.initializeCrossbarConnection();
      // this.populateClasses(this._constantsService.consultationPlatformData, consultanttype, specialityName);
    }
    if (this.router.url === 'subscribe-online-classes') {
      this.subscription = this.authService.on('downloadInvoice').subscribe(() => this.downloadInvoiceSubOnline());
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  initializeCrossbarConnection() {
    // No channels Subscription is required here, only publish events are used here
    this.teleConsultCrossbarService.on_connection_established = () => {
      const consultantObject = this._constantsService.aesDecryption('consultantDataObj');
      // const consultantObject = this._constantsService.aesDecryption(localStorage.getItem("consultantDataObj"));
      const parsedConsultantObject = JSON.parse(consultantObject);
      const consultanttype = parsedConsultantObject.ct;
      const specialityName = parsedConsultantObject.st;

      this.populateClasses(this._constantsService.consultationPlatformData, consultanttype, specialityName);

    }
    this.teleConsultCrossbarService.user_id = JSON.parse(this._constantsService.aesDecryption('userData'))['id'];

    if (this.teleConsultCrossbarService.is_connected == true) {
      this.teleConsultCrossbarService.on_connection_established();
    } else {
      this.teleConsultCrossbarService.connect({});
    }
  }

  //refund modal window
  refundInfo() {
    this.dialog.open(ModalComponent);
    this._constantsService.refundInfo = true;
    this._constantsService.showClassRefundInfo = true;
  }


  populateClasses(platformData, consultantType, specialityName): void {

    const consultantTypeData = platformData['consult_type'].find(item => { return item['consultation_type_name'] == consultantType });

    if (consultantTypeData == undefined) {

    }
    const specialityTypeData = consultantTypeData.specality.find(item => {
      return item['specality_name'] == specialityName;
    });
    if (specialityTypeData == undefined) {

    }

    this.classData = specialityTypeData.courses;
    console.log(this.classData);
    //this.classesList = this.tempClass;

    if (this.classData.length > 0) {
      let courses: any[] = this.classData;
      if (courses.length > 0) {
        if (this._constantsService.teleconsultationFlowSelected == "genric") {

          //step:1--> Filter exclusive false and undefined, null.
          this.classData = this.classData.filter(obj => {
            return obj.exclusive_only != true;
          });
        } else if (this._constantsService.teleconsultationFlowSelected == "affiliate") {

          //affiliated companies' images
          if (this._constantsService.teleconsultationAffiliationSelectedCompanyImg != '') {
            this.brand_image_url_exist = true;
            this.brand_image_url = this._constantsService.teleconsultationAffiliationSelectedCompanyImg;
          }

          //step:1--> Filter only exclusive true courses.
          let exclusiveCourses = courses.filter(obj => {
            //return obj.exclusive_only == true;
            return obj;
          });
          console.log(exclusiveCourses);

          if (exclusiveCourses.length > 0) {

            //step:2--> Remove empty and undefined affiliation
            let validAffiliatedCourses = exclusiveCourses.filter(obj => {

              return (obj.affilation_excusive_data != undefined && obj.affilation_excusive_data != null && obj.affilation_excusive_data.affilation_array != undefined && obj.affilation_excusive_data.affilation_array != null && obj.affilation_excusive_data.affilation_array.length > 0);
            });
            console.log(validAffiliatedCourses);


            if (validAffiliatedCourses.length > 0) {

              //step:3--> Check whether the selected affiliate present & return selected affilited Courses.
              let selectedAffiliatedCourses = validAffiliatedCourses.filter(obj => {
                let verifyAffiliatePresent = obj.affilation_excusive_data.affilation_array.some(element => {

                  if (element.affilation_unique_name != undefined && element.affilation_unique_name != null && element.affilation_unique_name.trim().length > 0) {
                    return element.affilation_unique_name == this._constantsService.teleconsultationAffiliationSelectedName;
                  } else {
                    return false;
                  }
                });

                return verifyAffiliatePresent == true;
              });
              console.log(selectedAffiliatedCourses);

              //step:4--> Remove other affiliation from affiliation array.
              if (selectedAffiliatedCourses.length > 0) {
                let retriveOnlySelectedAfilliation = selectedAffiliatedCourses.map((element, index, arr) => {

                  let removeNonMatchAffiliates = element.affilation_excusive_data.affilation_array.filter(obj => {
                    return obj.affilation_unique_name == this._constantsService.teleconsultationAffiliationSelectedName;
                  });
                  element.affilation_excusive_data.affilation_array = removeNonMatchAffiliates;

                  return element;
                });
                console.log(retriveOnlySelectedAfilliation);

                this.classData = retriveOnlySelectedAfilliation;

              } else {
                this.classData = [];
              }

            } else {
              this.classData = [];
            }
          } else {
            this.classData = [];
          }
        }
      }
    }

    this.classData.map(course => {
      if (course.text_reviews_data == undefined || course.text_reviews_data == null) {
        course.text_reviews_data = [];
      }

      //disable expired courses
      let duration = course.course_duration.split(' - ');
      let end;
      let end_date = new Date();
      let current_date = new Date();
      if (duration[1].includes('-')) {
        end = duration[1].split('-');
        end_date.setFullYear(parseInt(end[2])); end_date.setMonth(parseInt(end[1]) - 1); end_date.setDate(parseInt(end[0]));
      } else if (duration[1].includes('/')) {
        end = duration[1].split('/');
        end_date.setFullYear(parseInt(end[2])); end_date.setMonth(parseInt(end[0]) - 1); end_date.setDate(parseInt(end[1]));
      } else { console.log(duration) }
      end_date.setHours(23); end_date.setMinutes(59); end_date.setSeconds(59);
      console.log("end_date : ", end_date);
      console.log("today:" + current_date + ", end_date:" + end_date + ", end:" + end + ", duration:" + duration[1]);

      if (current_date < end_date) {
        course.isCourseAvailable = true;
      }
      else { course.isCourseAvailable = false; }
      //console.log(end_date);
      //console.log(current_date);
      //checking expiry date
      let diff_time = end_date.getTime() - current_date.getTime();
      let diff_days = diff_time / (1000 * 3600 * 24);
      //console.log(diff_days);
      let c_type = course.course_type.split(' ');
      //console.log(c_type);
      if (c_type.length == 2) {
        if (c_type[1].toLowerCase() == 'day' || c_type[1].toLowerCase() == 'days') {
          // if(parseInt(c_type[0]) <= diff_days) {
          //   course.isCourseExpired = false;
          // } else {course.isCourseExpired = true;}
          let courseStartDate = '';
          let courseTimings = course.course_time;
          let startTimings = courseTimings.map(item => {
            return item.split('-')[0].trim();
          });
          //console.log("startTimings ", startTimings);
          if (duration[0].includes('-')) {
            let dateSplit = duration[0].split('-');
            courseStartDate = dateSplit[1] + '/' + dateSplit[0] + '/' + dateSplit[2];
          }
          //console.log("courseStartDate ", courseStartDate);

          let _isAnyUnexpiredTimeAvailable = startTimings.some(item => {
            /* check the course based on condition for issue rootcause starts here
            if(course['course_id'] == "b166e316780e432bad7971649087320f"){
              console.log(item);
              console.log(courseStartDate);
              console.log(new Date(courseStartDate+' '+item).getTime());//1701169500000
              console.log(new Date().getTime());
              console.log(end_date);
              console.log(end_date.getTime());
            }
            check the course based on condition for issue rootcause starts here
            */
            return end_date.getTime() > new Date().getTime();
            // changes in code due to class issue expiration: If class is in active for subscription, still it shows expired
            // return new Date(courseStartDate+' '+item).getTime() > new Date().getTime();
          });
          if (_isAnyUnexpiredTimeAvailable == true) {
            course.isCourseExpired = false;
          } else { course.isCourseExpired = true; }
        } else if (c_type[1].toLowerCase() == 'month' || c_type[1].toLowerCase() == 'months') {
          let days = parseInt(c_type[0]) * 30;
          if (days <= diff_days) {
            course.isCourseExpired = false;
            //console.log(days)
          } else { course.isCourseExpired = true; }
        } else if (c_type[1].toLowerCase() == 'year' || c_type[1].toLowerCase() == 'years') {
          /*let days = parseInt(c_type[0]) * 365;
          if(days <= diff_days) {
            course.isCourseExpired = false;
            //console.log(days)
          } else {course.isCourseExpired = true;}*/

          let courseDurationInfo = course.course_duration.split(' - ');
          let courseTimeInfo = course.course_time[0].split(' - ');
          let currentDate = this.getCurrentDate();
          let currentTime = this.getCurrentTime();

          if (courseDurationInfo[1] == currentDate) {
            const courseTimeStr = this.convertTo24HourFormat(courseTimeInfo[1]);
            const currentTimeStr = this.convertTo24HourFormat(currentTime);

            if (currentTimeStr > courseTimeStr) {
              course.isCourseExpired = true;
            }
            else {
              course.isCourseExpired = false;
            }
          } else {
            if (courseDurationInfo[1] < currentDate)
              course.isCourseExpired = true;
            else
              course.isCourseExpired = false;
          }
        } else if (c_type[1].toLowerCase() == 'week' || c_type[1].toLowerCase() == 'weeks') {
          let days = parseInt(c_type[0]) * 7;
          if (days <= diff_days) {
            course.isCourseExpired = false;
          } else { course.isCourseExpired = true; }
        }
      }

      //setting course min-start date
      let tempMinDate = duration[0].split('-');
      //course.minStartDate = new Date(`${tempMinDate[2]}-${tempMinDate[1]}-${tempMinDate[0]}`);
      //course.minStartDate.setHours('00');
      //course.minStartDate.setMinutes('00');
      //course.minStartDate = new Date(`${tempMinDate[2]}/${tempMinDate[1]}/${tempMinDate[0]}`);
      let overAllCourseTimings = course.course_time;
      let overAllCourseStartTimings = overAllCourseTimings.map(item => {
        return new Date(tempMinDate[1] + '/' + tempMinDate[0] + '/' + tempMinDate[2] + ' ' + item.split('-')[0].trim()).getTime();
      });

      let MaximumStartTime = Math.max.apply(null, overAllCourseStartTimings);
      course.minStartDate = new Date(MaximumStartTime);
      //console.log(course.minStartDate);

      // if(course.minStartDate <= this.todayDate) {
      //   course.minStartDate = new Date(this.todayDate);
      // }
      if ((course.minStartDate < this.todayDate) && !course.isCourseExpired) course.isOnGoing = true;
      else course.isOnGoing = false;
    });
    console.log(this.classData)

    let available_courses_list = this.classData.filter(course => {
      if (course.isCourseAvailable === true) {
        return course;
      }
    });
    if (available_courses_list.length == 0) {
      this.noCourseIsAvailable = true;
    }

    if (this.classData.length > 0) {
      let courseId = this.classData.map(data => {
        return data.course_id;
      });

      let classIdObj: classId;
      classIdObj = { classIDList: courseId };

      this.authService.getClassImages(classIdObj).subscribe(data => {
        let imageDataObj = data;
        console.log(imageDataObj);
        console.log(this.classData);

        if (Array.isArray(imageDataObj)) {
          if (imageDataObj.length > 0) {
            imageDataObj.forEach(obj => {
              let retriveImage = this.classData.filter(elmt => elmt.course_id === obj.course_id);
              retriveImage[0].course_img_url = obj.base_64;
            });
            this.classesList['subscribed'] = false;
            this.classesList = this.classData;
          } else {
            this.classesList['subscribed'] = false;
            this.classesList = this.classData;
          }

        } else {
          this.classesList['subscribed'] = false;
          this.classesList = this.classData;
        }


        this.userData = JSON.parse(this._constantsService.aesDecryption("userData"));
        this._teleConsultService.getTeleConsultUserData(this.userData.id).subscribe((data: any) => {
          if ('my_subscriptions' in data) {
            //console.log(data);
            this.showSubscribeBtn = true;
            data['my_subscriptions'].forEach(element => {
              let splitDate = element.course_duration.split(' ');
              let startDateSplit = splitDate[0].split('-');
              let endDateSplit = splitDate[2].split('-');
              let startDate = startDateSplit[1] + "/" + startDateSplit[2] + "/" + startDateSplit[0];
              let endDate = endDateSplit[1] + "/" + endDateSplit[2] + "/" + endDateSplit[0];
              element['course_duration'] = startDate + " - " + endDate;
            });
            // console.log(this._constantsService.consultationUserData);
            //this.consultationActiveSubscriptions = platform_data['my_subscriptions'];
            let activeSubscriptions = [];
            let overAllSubscriptionDetails = null;
            overAllSubscriptionDetails = data['my_subscriptions'];
            if (overAllSubscriptionDetails == null || overAllSubscriptionDetails == undefined || overAllSubscriptionDetails.length == 0) {
              this.isValidationDone = true;
            }
            if (overAllSubscriptionDetails.length > 0 && overAllSubscriptionDetails !== null && overAllSubscriptionDetails !== undefined) {
              let filterAcceptedData = overAllSubscriptionDetails.filter(obj => {
                return obj.approval_status === "Accepted" || obj.approval_status === "accepted" || obj.approval_status === null || obj.approval_status === "Approved" || obj.approval_status === "approved";
              });
              console.log(filterAcceptedData);
              if (filterAcceptedData.length > 0 && filterAcceptedData !== null) {
                filterAcceptedData.forEach(element => {
                  let course_duration = element.course_duration.split(" ");
                  let todayDate = new Date();
                  let durationDate = new Date(course_duration[2]);

                  // if (durationDate.getTime() > todayDate.getTime()) {
                  //   activeSubscriptions.push(element);
                  // }


                  let courseTimeInfo = element.course_time.split(' - ');
                  let currentTime = this.getCurrentTime();
                  let durationDateStr = this.datePipe.transform(durationDate, 'dd-MM-yyyy');
                  let todayDateStr = this.datePipe.transform(todayDate, 'dd-MM-yyyy');

                  if (durationDateStr == todayDateStr) {
                    const courseTimeStr = this.convertTo24HourFormat(courseTimeInfo[1]);
                    const currentTimeStr = this.convertTo24HourFormat(currentTime);

                    if (currentTimeStr < courseTimeStr)
                      activeSubscriptions.push(element);
                  } else if (durationDateStr > todayDateStr) {
                    activeSubscriptions.push(element);
                  }
                });
              }

              console.log(activeSubscriptions);
              for (let i = 0; i < this.classesList.length; i++) {
                this.classesList[i]['subscribed'] = false;
                for (let j = 0; j < activeSubscriptions.length; j++) {
                  if (activeSubscriptions[j].course_id == this.classesList[i].course_id) {
                    this.classesList[i]['subscribed'] = true;
                  }
                }
              }
              this.isValidationDone = true;
              console.log(this.classesList);
            }
          }

        });
      });

    }
  }

  imageConverter(baseimage) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(baseimage);
  }

  getStars(avg_review) {
    avg_review = parseFloat(avg_review);
    let stars = [];
    for (let j = 0; j < 5; j++) {
      stars[j] = {};
      if (parseInt(avg_review) > j) {
        stars[j]['star'] = "fa-star star_checked";
      } else if (j == Math.floor(parseInt(avg_review))) {
        stars[j]['star'] = "fa-star-half-alt star_checked";
      } else {
        stars[j]['star'] = "fa-star";
      }
    }
    return stars;
  }

  expandCard(course) {
    this.cardExpendDiv = true;
    this.isBookingCardOpen = true;
    this.isCourseDetailCardOpen = false;
    this.autoApproveCourseStatus = true;
    this.selectedCourse = course;
    this.headerName = 'Subscribe';
    this.prepareSelectedCourse();
  }
  shrinkCard() {
    // if(this.selectedCourse != '' && this.cardExpendDiv == true){
    //   this.headerName = 'Select Classes';
    //   this.cardExpendDiv = false;
    //   this.selectedCourse = '';
    //   //this.selectTimeSlot = undefined;
    // } else {
    //   this.zone.run(() => {
    //     this.router.navigate(['teleconsult-speciality']);
    //   });
    // }

    if (this._constantsService.aesDecryption("consultantDataObj") != undefined) {
      let consultantDataObj = JSON.parse(this._constantsService.aesDecryption("consultantDataObj"));
      let consult_type = consultantDataObj.ct;
      console.log(this._constantsService.consultationPlatformData.consult_type.length);
      for (let i = 0; i < this._constantsService.consultationPlatformData.consult_type.length; i++) {
        console.log(this._constantsService.consultationPlatformData.consult_type[i]);
        console.log(this._constantsService.consultationPlatformData.consult_type[i].consultation_type_name);
        if (this._constantsService.consultationPlatformData.consult_type[i].consultation_type_name == consult_type) {
          console.log(this._constantsService.consultationPlatformData.consult_type[i].specality);
          if (this._constantsService.consultationPlatformData.consult_type[i].specality.length == 1) {
            this.router.navigate(['/fitnessPage']);
            break;
          } else {
            this.router.navigate(['/teleconsult-speciality']);
            break;
          }
        }
      }
    }
  }

  expandReviewCard(course) {
    console.log(course);
    this.cardExpendDiv = true;
    this.isBookingCardOpen = false;
    this.isCourseDetailCardOpen = true;
    this.selectedCourse = course;
    this.headerName = 'Course Details';
    if (course.course_description != '') {
      this.description_text = course.course_description;
      // console.log(this.description_text);
      let urlLink = this.description_text.match(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig);
      if (urlLink != undefined) {
        urlLink.map(url => {
          if (url != "") {
            this.description_text = this.description_text.replace(url, "<a href=\"" + url + "\"target=\"_BLANK\">" + url + "\"</a>");
            this.finalUrlLink = this.description_text;
          }
        })
      } else {
        this.finalUrlLink = this.description_text;
      }
    }
    if (this.selectedCourse['isCourseAvailable'] == true && this.selectedCourse['auto_approve'] == true) {
      // enabling subscribe button for Ongoing class if it is autoapproved 
      if (this.selectedCourse['subscribed'] == false) {
        this.selectedCourse['isCourseExpired'] = false;
        this.isValidationDone = true;
        this.autoApproveCourseStatus = true;
      } else {
        console.log(this.selectedCourse)
      }
      // this.selectedCourse['subscribed'] = false;
      // this.selectedCourse['isCourseExpired'] = false;
      // this.isValidationDone = true;
      // this.autoApproveCourseStatus = true;
    }
  }


  feedBack(course) {
    let selectedCourse = course;
    let userId = JSON.parse(this._constantsService.aesDecryption('userData'))['id'].toString();
    let ratings = this.selectedStar.toString();
    let review = this.reviewField.nativeElement.value.toString();

    if (ratings == '0' && review == '') {
      this.snackBar.open("Please fill the rating and comments", '', {
        panelClass: ['error'],
        duration: 4500,
      });
      return 0;
    }

    this.sendReview = true;
    let obj = {
      "user_ihl_id": userId,
      "ihl_consultant_id": course['consultant_id'],
      "course_name": course['title'],
      "course_id": course['course_id'],
      "review_text": review,
      "trainer_name": course['consultant_name'],
      "vendor_name": course['provider'],
      "ratings": ratings,
    };
    console.log(obj);
    this.authService.postCourseReview(obj).subscribe(data => {
      console.log(data);
      if (typeof (data) === "object") {
        this.snackBar.open("Thanks for your review.", '', {
          duration: 3000
        });
        // let todayTime =  new Date().getTime();
        // let updatedReviewTimeStamp =`"/Date("${todayTime}")/"`;
        let userData = JSON.parse(this._constantsService.aesDecryption("userData"));
        // let userName = `${userData.firstName} ${userData.lastName}`;

        // let updatedReview:reviewObj = {rating_text:review, user_rating: this.selectedStar, time_stamp: updatedReviewTimeStamp, user_name: userName};

        // course.ratings = ( Number(course.ratings) + this.selectedStar) / 2;
        // course.text_reviews_data.push(updatedReview);

        this.reviewField.nativeElement.value = "";
        this.rateArray = [0, 0, 0, 0, 0];
        this.selectedStar = 0;
        this.sendReview = false;

        this._teleConsultService.getTeleConsultUserPlatformData(userData.id);
      } else {
        this.snackBar.open("Something went wrong.", '', {
          duration: 3000
        });
        this.sendReview = false;
      }

    });
  }

  dayRearrange(days) {
    // console.log(days);
    var daysFormat = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    daysFormat = daysFormat.filter(val => days.includes(val));
    return daysFormat.join(", ");
  }

  newDateOrderReviews(reviews: Array<any>): any {
    if (reviews.length > 1) {
      let sortedReviews = reviews.sort((a, b) => {
        let timeSplitA = a.time_stamp.match(/\d+/);
        let timeSplitB = b.time_stamp.match(/\d+/);
        let millisecondsA = Number(timeSplitA);
        let millisecondsB = Number(timeSplitB);
        let sortA = new Date(millisecondsA);
        let sortB = new Date(millisecondsB);
        return sortB.getTime() - sortA.getTime();
      });
      return sortedReviews;
    } else {
      return reviews;
    }
  }

  countStars(value) {
    if (this.selectedStar == value) {
      this.selectedStar -= 1;
    } else {
      this.selectedStar = value;
    }
    this.rateArray = [0, 0, 0, 0, 0];
    for (let i = 0; i < this.selectedStar; i++) {
      this.rateArray[i] = 1;
    }
    console.log(this.selectedStar);
    console.log(this.rateArray);
  }

  prepareSelectedCourse() {

    // Prepare time slots
    if (this.selectedCourse['course_time'] != undefined && this.selectedCourse['course_time'].length != 0) {
      let available_slot = this.selectedCourse['course_time'];
      let time_slots: time_slots_interface = {
        'morning': [],
        'afternoon': [],
        'evening': [],
        'night': [],
      };
      available_slot.forEach(time_slot => {
        let start_time = time_slot.split('-')[0];
        if (this.isMorningSlot(start_time)) time_slots['morning'].push(time_slot);
        else if (this.isAfternoonSlot(start_time)) time_slots['afternoon'].push(time_slot);
        else if (this.isEveningSlot(start_time)) time_slots['evening'].push(time_slot);
        else if (this.isNightSlot(start_time)) time_slots['night'].push(time_slot);
      });

      this.selectedCourseTimeSlots = time_slots;
      console.log(time_slots);
    }

    // Prepare week days availability
    if (this.selectedCourse['course_on'] != undefined && this.selectedCourse['course_on'].length != 0) {
      console.log(this.selectedCourse['course_on']);
      this.selectedCourseWeekDaysAvailability = [0, 0, 0, 0, 0, 0, 0];
      this.selectedCourse['course_on'].forEach(day => {
        this.selectedCourseWeekDaysAvailability[week_days_mapping[day]] = 1;
      });
      console.log(this.selectedCourseWeekDaysAvailability);
    }

    //this.selectedStartDate = this.todayDate;
    this.selectedStartDate = this.selectedCourse.minStartDate;
    // if(this.selectedCourse['course_duration'] != undefined && this.selectedCourse['course_duration'].length != 0){
    //   let coursePeriod = this.selectedCourse['course_duration'].split(" ");
    //   let courseStartPeriod = coursePeriod[0].split("-");
    //   let courseStartDate = new Date(`${courseStartPeriod[2]}-${courseStartPeriod[1]}-${courseStartPeriod[0]}`);
    //   console.log(courseStartDate);
    //   if(courseStartDate.getTime() <=  new Date().getTime()){
    //     alert("ongoing course");
    //     this.todayDate = new Date();
    //     this.selectedStartDate = this.todayDate;
    //   }else{
    //     this.todayDate = courseStartDate;
    //     this.selectedStartDate = this.todayDate;
    //   }
    // }
    setTimeout(() => { this.updateEndDate() }, 0);
  }

  isMorningSlot(_time: String): Boolean {
    if (_time.includes('AM') || _time.includes('am')) return true;
    return false;
  }
  isAfternoonSlot(_time: String): Boolean {
    let time_: string = _time.split(' ')[0];
    let time__: string[] = time_.split(':');
    let hrs = parseInt(time__[0]);
    let mins = parseInt(time__[1]);
    if (hrs == 12 || hrs == 1 || hrs == 2) return true;
    if (hrs == 3 && mins <= 59) return true;
    return false;
  }

  isEveningSlot(_time: string): Boolean {
    let time_: string = _time.split(' ')[0];
    let time__: string[] = time_.split(':');
    let hrs = parseInt(time__[0]);
    let mins = parseInt(time__[1]);
    if (hrs == 4 || hrs == 5) return true;
    if (hrs == 6 && mins <= 59) return true;
    return false;
  }


  isNightSlot(_time: string): Boolean {
    let time_: string = _time.split(' ')[0];
    let time__: string[] = time_.split(':');
    let hrs = parseInt(time__[0]);
    let mins = parseInt(time__[1]);
    if (hrs == 7 || hrs == 8 || hrs == 9 || hrs == 10) return true;
    if (hrs == 11 && mins <= 59) return true;
    return false;
  }

  updateEndDate(): void {
    let course_type = this.selectedCourse['course_type'];
    if (course_type != undefined) {

      // let milliseconds_in_a_day = 86400000;
      // let days_to_be_added = 1;
      // if(course_type == 'Monthly'){
      //   days_to_be_added = 30;
      // }
      // let end_date_milli_seconds = this.selectedStartDate.getTime() + (days_to_be_added - 1)*milliseconds_in_a_day;
      // this.selectedEndDate = new Date(end_date_milli_seconds);
      // console.log('End date', this.selectedEndDate);
      // this.updateCalendarCss('subsribe-online-classes-valid-date');


      let milliseconds_in_a_day = 86400000;
      let days_to_be_added = 1;
      let courseTypeArray = course_type.split(" ");
      if (courseTypeArray[1] == "Day" || courseTypeArray[1] == "Days") {
        days_to_be_added = courseTypeArray[0];
      } else if (courseTypeArray[1] == "Week" || courseTypeArray[1] == "Weeks") {
        days_to_be_added = 7 * courseTypeArray[0];
      } else if (courseTypeArray[1] == "Month" || courseTypeArray[1] == "Months") {
        days_to_be_added = 30 * courseTypeArray[0];
      } else if (courseTypeArray[1] == "Year" || courseTypeArray[1] == "Years") {
        days_to_be_added = 365 * courseTypeArray[0];
      }

      //let end_date_milli_seconds = this.selectedStartDate.getTime() + (days_to_be_added - 1)*milliseconds_in_a_day;
      //let end_date_milli_seconds = this.selectedStartDate.getTime() + (days_to_be_added)*milliseconds_in_a_day;
      //this.selectedEndDate = new Date(end_date_milli_seconds);
      let splitDates = this.selectedCourse.course_duration.split(' ');
      let endDateSplited = splitDates[2].split('-');
      let endDates = new Date(endDateSplited[2] + "-" + endDateSplited[1] + "-" + endDateSplited[0]).getTime();
      this.selectedEndDate = new Date(endDates);
      console.log('End date', this.selectedEndDate);
      this.updateCalendarCss('subsribe-online-classes-valid-date');

      // let coursePeriod = this.selectedCourse['course_duration'].split(" ");
      // let courseEndPeriod = coursePeriod[2].split("-");
      // this.selectedEndDate = new Date(`${courseEndPeriod[2]}-${courseEndPeriod[1]}-${courseEndPeriod[0]}`);
      // console.log('End date', this.selectedEndDate);
      // this.updateCalendarCss('subsribe-online-classes-valid-date');
    }
  }


  dateChanged(date_event: Date) {
    //this.selectedStartDate = date_event;
    this.selectedStartDate = this.selectedCourse.minStartDate;
    setTimeout(() => { this.updateEndDate() }, 0);
  }

  filterDates() {
    // return (date:Date)=>{
    //   let day = date.getDay();
    //   return this.selectedCourseWeekDaysAvailability[day];
    // }
  }

  _getDateClass(date: Date) {
    if (this.cssClassOfCalendarSelectedDates == '' || this.selectedStartDate == undefined || this.selectedEndDate == undefined) return '';
    if (this.selectedCourseWeekDaysAvailability[date.getDay()] == 0) return '';
    if (this.selectedStartDate.getTime() <= date.getTime() && this.selectedEndDate.getTime() >= date.getTime()) return this.cssClassOfCalendarSelectedDates;
    return '';
  }

  dateClass() {
    return (date: Date) => {
      return this._getDateClass(date);
    }
  }
  selectTimeSlot(time_slot): void {
    if (time_slot == this.selectedTimeSlot) {
      this.selectedTimeSlot = undefined;
    } else {
      this.selectedTimeSlot = time_slot;
    }
  }

  updateCalendarCss(css_class: string) {
    this.cssClassOfCalendarSelectedDates = css_class;
    //let new_date = new Date("'" + (this.todayDate.getFullYear()+2) + "'");
    let initial_new_date = (this.todayDate.getFullYear() + 2) + "-" + "01" + "-" + "01";
    let new_date = new Date(initial_new_date);
    let cur_active_date = this.cal.activeDate;
    this.cal.activeDate = new_date;
    this.cal._changeDetectorRef.detectChanges();

    this.cal.activeDate = cur_active_date;
    this.cal._changeDetectorRef.detectChanges();

    // Working code 1
    // this.cssClassOfCalendarSelectedDates = css_class;
    // let new_date = new Date("'" + (this.todayDate.getFullYear()+1) + "'");
    // console.log(this.todayDate);
    // console.log(new_date);
    // this.cal.activeDate = new_date;
    // this.cal._changeDetectorRef.detectChanges();

    // this.cal.activeDate = this.todayDate;
    // this.cal._changeDetectorRef.detectChanges();
  }

  confirmSubscription(): void {
    this.isLoading = true;
    console.log('clicked');
    if (this.selectedTimeSlot === undefined || this.selectedTimeSlot === null || this.selectedTimeSlot.trim().length === 0) {
      // alert("Select time");
      this.isLoading = false;
      this.snackBar.open("Please Choose a time slot", '', {
        duration: 2500,
        panelClass: ['error'],
      });
      return;
    };

    if (this.selectedCourse && 'course_fees' in this.selectedCourse) {
      this.userData = JSON.parse(this._constantsService.aesDecryption("userData"));
      if (this._constantsService.teleconsultationFlowSelected == "affiliate") {
        let offerPrice = this.selectedCourse['affilation_excusive_data']['affilation_array'][0]['affilation_price'];
        try {
          if (offerPrice == undefined || offerPrice == null || String(offerPrice).trim().length == 0) throw "Invalid OfferPrice";
        } catch (err) {
          // offerPrice = this.selectedCourse['affilation_excusive_data']['affilation_array'][0]['affilation_mrp'];
          offerPrice = this.selectedCourse['affilation_excusive_data']['affilation_array'][0]['affilation_price'];
        }
        this.course_fees = Number(offerPrice);
      } else {
        this.course_fees = this.selectedCourse['course_fees'];
      }
    }

    console.log(this.selectedCourse);
    this._constantsService.selectedCourseConsultantId = this.selectedCourse.consultant_id;
    this._constantsService.selectedCourseId = this.selectedCourse.course_id;
    this._constantsService.consultationFee = this.course_fees * 100;
    this.actualClassFee = this.course_fees;
    if (this.course_fees > 0) {
      this._constantsService.showPaymentSelect = true;
      this.dialog.open(ModalComponent).afterClosed().subscribe(res => {
        console.log(res);
        if (res != undefined) {
          // if(res == 'couponNotApplied' || res == ''){
          //   this.AddressValidate();
          // }else{
          //   this.doctorFees = res*100;
          //   this.AddressValidate();
          // }
          if (res['payableAmount'] !== undefined) {
            this.givenCouponNumber = res['couponCode'];
            this.couponDiscountAmount = res['discountAmount'];
            this.course_fees = res['payableAmount'];
            this.checkUserDetailAndSub();
          } else if (res == 'couponNotApplied') {
            this.givenCouponNumber = '';
            this.couponDiscountAmount = '';
            this.course_fees = this.actualClassFee;
            this.checkUserDetailAndSub();
          } else {
            this.isLoading = false;
            this.givenCouponNumber = '';
            this.couponDiscountAmount = '';
          }
        } else {
          this.isLoading = false;
          this.givenCouponNumber = '';
          this.couponDiscountAmount = '';
        }
      });
    } else {
      // this.isLoading = false;
      this.givenCouponNumber = '';
      this.couponDiscountAmount = '';
      this.checkUserDetailAndSub();
    }
  }

  checkUserDetailAndSub(): void {

    if (this.selectedCourse && 'course_fees' in this.selectedCourse) {
      this.userData = JSON.parse(this._constantsService.aesDecryption("userData"));
      // if (this._constantsService.teleconsultationFlowSelected == "affiliate") {
      //   let offerPrice = this.selectedCourse['affilation_excusive_data']['affilation_array'][0]['affilation_price'];
      //   try{
      //     if(offerPrice == undefined || offerPrice == null || String(offerPrice).trim().length == 0) throw "Invalid OfferPrice";
      //   }catch(err){
      //     offerPrice = this.selectedCourse['affilation_excusive_data']['affilation_array'][0]['affilation_mrp'];
      //   }
      //   this.course_fees = Number(offerPrice);
      // } else {
      //   this.course_fees = this.selectedCourse['course_fees'];
      // }

      let courseDate = (this.selectedCourse.course_duration).split(" - ");
      let getEndDate = (courseDate[1]).split("-");
      let arrangeEndDate = getEndDate[1] + '/' + getEndDate[0] + '/' + getEndDate[2];
      var d1 = this.selectedEndDate;
      var d2 = new Date(arrangeEndDate);
      var diff = d2.getTime() - d1.getTime();

      var daydiff = diff / (1000 * 60 * 60 * 24);
      // if (this.selectedCourse.course_type != "1 Day") {
      //   if(daydiff < 0){
      //     this.snackBar.open("Course will be end on "+  courseDate[1] + " Please choose valid date ", '',{
      //       duration: 1000 * 5,
      //       panelClass: ['error'],
      //     });
      //     return;
      //   }
      // }

      var userData = JSON.parse(this._constantsService.aesDecryption('userData'));
      if (this.selectedTimeSlot === undefined || this.selectedTimeSlot === null || this.selectedTimeSlot.trim().length === 0) {
        // alert("select time ")
        this.isLoading = false;
        this.snackBar.open("Please choose a time slot", '', {
          duration: 4000,
          panelClass: ['error'],
        });
        return;
      } else {
        let timeSelected = this.selectedTimeSlot;
        let startDate = (this.selectedStartDate.getDate() < 10) ? "0" + (this.selectedStartDate.getDate()) : this.selectedStartDate.getDate();
        let startMonth = (this.selectedStartDate.getMonth() + 1 < 10) ? "0" + (this.selectedStartDate.getMonth() + 1) : this.selectedStartDate.getMonth() + 1;
        //let courseStartAt = this.selectedStartDate.getFullYear()+"-"+startMonth+"-"+startDate;
        let courseStartAt = startMonth + "/" + startDate + "/" + this.selectedStartDate.getFullYear();

        let endDate = (this.selectedEndDate.getDate() < 10) ? "0" + (this.selectedEndDate.getDate()) : this.selectedEndDate.getDate();
        let endMonth = (this.selectedEndDate.getMonth() + 1 < 10) ? "0" + (this.selectedEndDate.getMonth() + 1) : this.selectedEndDate.getMonth() + 1;
        //let courseEndAt = this.selectedEndDate.getFullYear()+"-"+endMonth+"-"+endDate;
        let courseEndAt = endMonth + "/" + endDate + "/" + this.selectedEndDate.getFullYear();

        let courseDatePeriod = `${courseStartAt} - ${courseEndAt}`;
        this.subscriptionStartDate = this.selectedStartDate.getFullYear() + "-" + startMonth + "-" + startDate;
        console.log(timeSelected);
        console.log(courseStartAt);
        console.log(courseEndAt);
        console.log(courseDatePeriod);
        let fee: number = 0;
        // if (this._constantsService.teleconsultationFlowSelected == "affiliate") {
        //   let offerPrice = this.selectedCourse['affilation_excusive_data']['affilation_array'][0]['affilation_price'];
        //   try{
        //     if(offerPrice == undefined || offerPrice == null || String(offerPrice).trim().length == 0) throw "Invalid OfferPrice";
        //   }catch(err){
        //     offerPrice = this.selectedCourse['affilation_excusive_data']['affilation_array'][0]['affilation_mrp'];
        //   }
        //   fee = Number(offerPrice);
        // } else {
        //   fee = this.selectedCourse['course_fees'];
        // }
        fee = this.course_fees;

        // console.log(this.selectedCourse['auto_approve']);
        if (this.selectedCourse['auto_approve'] == true) {
          this.book = {
            "user_ihl_id": userData['id'],
            "course_id": this.selectedCourse['course_id'],
            "name": userData['firstName'] + " " + userData['lastName'],
            "email": userData['email'],
            "mobile_number": userData['mobileNumber'],
            "course_type": this.selectedCourse['course_type'],
            "course_time": timeSelected,
            "provider": this.selectedCourse['provider'],
            "fees_for": this.selectedCourse['fees_for'],
            "consultant_name": this.selectedCourse['consultant_name'],
            "course_duration": courseDatePeriod,
            "course_fees": fee,
            "mode_of_payment": "online",
            "consultation_id": this.selectedCourse['consultant_id'],
            "approval_status": "Accepted",
            "external_url": this.selectedCourse.external_url != '' ? this.selectedCourse.external_url : ''
          }
        } else {
          this.book = {
            "user_ihl_id": userData['id'],
            "course_id": this.selectedCourse['course_id'],
            "name": userData['firstName'] + " " + userData['lastName'],
            "email": userData['email'],
            "mobile_number": userData['mobileNumber'],
            "course_type": this.selectedCourse['course_type'],
            "course_time": timeSelected,
            "provider": this.selectedCourse['provider'],
            "fees_for": this.selectedCourse['fees_for'],
            "consultant_name": this.selectedCourse['consultant_name'],
            "course_duration": courseDatePeriod,
            "course_fees": fee,
            "mode_of_payment": "online",
            "consultation_id": this.selectedCourse['consultant_id'],
            "approval_status": "requested",
            "external_url": this.selectedCourse.external_url != '' ? this.selectedCourse.external_url : ''
          }
        }

        console.log(this.book);
        //debugger;
      }

      if (this.course_fees != 0) {
        this.contactDetailsMobileNumber = this.userData['mobileNumber'] || '';
        /*var jsonData = { "ihl_id": this.userData.id, "total_amount": this.course_fees, "payment_status": "initiated", "payment_for": "onlineClass", "MobileNumber": this.contactDetailsMobileNumber, ...this.receiveAppointmentDataForPaymentTransaction("", this.book)  };
        console.log(jsonData);
        //debugger;
        this._teleConsultService.paymentTransInit(jsonData).subscribe(data=>{
          this.initiatePayment();
          this.paymentTransactionId = data['transactionId'];
        });*/
        this.initiatePayment();
      } else {
        //this.callConfirmAppointment();
        let response: MockPaymentResponseData<string> = {
          razorpay_order_id: "",
          razorpay_payment_id: "",
          razorpay_signature: ""
        }
        this.storePaymentTransactionDetails(response);
      }
    }
  }

  initiatePayment() {
    let course_id = this.selectedCourse.course_id;
    if (course_id == undefined) return;
    let requestID = this._teleConsultService.paymentRequestIdGenerate("web", course_id);
    let fee: number = 0;
    // if (this._constantsService.teleconsultationFlowSelected == "affiliate") {
    //   let offerPrice = this.selectedCourse['affilation_excusive_data']['affilation_array'][0]['affilation_price'];
    //   try{
    //     if(offerPrice == undefined || offerPrice == null || String(offerPrice).trim().length == 0) throw "Invalid OfferPrice";
    //   }catch(err){
    //     offerPrice = this.selectedCourse['affilation_excusive_data']['affilation_array'][0]['affilation_mrp'];
    //   }
    //   fee = Number(offerPrice);
    // } else {
    //   fee = this.selectedCourse['course_fees'];
    // }
    fee = this.course_fees;

    this._teleConsultService.getPaymentOrderID(requestID, fee * 100).subscribe(data => {
      console.log(data);
      if (data['status'] == "success") {
        this.paymentProcessINitiate(data['order'], data['key']);
      } else {
        this.isLoading = false;
        // alert("soming went wrong");
      }
    });
  }




  paymentProcessINitiate(order_id, key) {
    let fee: number = 0;
    // if (this._constantsService.teleconsultationFlowSelected == "affiliate") {
    //   let offerPrice = this.selectedCourse['affilation_excusive_data']['affilation_array'][0]['affilation_price'];
    //   try{
    //     if(offerPrice == undefined || offerPrice == null || String(offerPrice).trim().length == 0) throw "Invalid OfferPrice";
    //   }catch(err){
    //     offerPrice = this.selectedCourse['affilation_excusive_data']['affilation_array'][0]['affilation_mrp'];
    //   }
    //   fee = Number(offerPrice);
    // } else {
    //   fee = this.selectedCourse['course_fees'];
    // }
    fee = this.course_fees;
    //alert(appointmentBook);
    let userData = JSON.parse(this._constantsService.aesDecryption('userData'));
    const options: any = {
      "key": key, // Enter the Key ID generated from the Dashboard    
      "amount": this.couponDiscountAmount > 0 ? this.couponDiscountAmount : fee, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise    
      "currency": "INR",
      "name": "India Health Link",
      "description": "Online Class",
      "image": "assets/img/ihl-plus.png",
      "order_id": order_id,
      "prefill": {
        "name": this.authService.getUser(),
        "email": userData.email,
        "contact": userData.mobileNumber
      },
      "notes": {
        "address": "Razorpay Corporate Office"
      },
      "theme": {
        "color": "#5081ce"
      }
    };
    options.handler = ((response, error) => {
      options.response = response;
      console.log(response);
      console.log(options);
      //debugger;
      if (response.razorpay_payment_id != undefined && response.razorpay_payment_id.length > 0) {
        this.storePaymentTransactionDetails(response);
      } else {
        alert("something went wrong");
      }
      // call your backend api to verify payment signature & capture transaction
    });

    var rzp1 = new this._teleConsultService.nativeWindow.Razorpay(options);
    rzp1.open();
    this.isLoading = false;

  }

  storePaymentTransactionDetails(razorPayResponse: any): void {
    this.contactDetailsMobileNumber = this.userData['mobileNumber'] || '';
    let [razorpay_order_id, razorpay_payment_id, razorpay_signature]: [string, string, string] = [razorPayResponse.razorpay_order_id, razorPayResponse.razorpay_payment_id, razorPayResponse.razorpay_signature];
    let usageType = '';
    let principalAmt = '';
    let gstAmt = '';
    let state = this.userData['state'] ? this.userData['state'].replace(/\s/g, '').toLowerCase() : '';
    let discountAmt = '';
    let accountName = '';
    if ((this.course_fees) == 0 && this.givenCouponNumber == '') {
      usageType = "FREE";
    } else if (this.givenCouponNumber != '') {
      usageType = "coupon";
      if (this.course_fees == 0) discountAmt = this.selectedCourse['course_fees'].toString();
      else discountAmt = this.couponDiscountAmount.toString();
    }

    if (this.course_fees > 0) {
      principalAmt = (this.course_fees / 1.18).toFixed(2).toString();
      gstAmt = ((Number(principalAmt) * 18) / 100).toFixed(2).toString();
    }
    if (this.selectedCourse['account_name'] != undefined && this.selectedCourse['account_name'] != "") accountName = this.selectedCourse['account_name'];

    var jsonData = {
      "user_email": this.userData.email,
      "user_mobile_number": this.userData.mobileNumber,
      "user_ihl_id": this.userData.id,
      "total_amount": this.course_fees,
      "payment_status": "completed",
      "payment_for": "onlineClass",
      "MobileNumber": this.contactDetailsMobileNumber,
      ...this.receiveAppointmentDataForPaymentTransaction("", this.book, razorpay_order_id, razorpay_payment_id, razorpay_signature),
      "vendor_name": this.selectedCourse['provider'],
      // "account_name": "default account",
      "account_name": accountName,
      "service_provided_date": this.subscriptionStartDate,
      "OrganizationCode": "",
      "UsageType": usageType,
      // "Discounts": this.couponDiscountAmount.toString(),// shows coupon amt as default 
      "Discounts": discountAmt, // shows calculation of how much amt has been used as discount
      "DiscountType": this.couponDiscountAmount != '' ? 'discount' : '',
      "CouponNumber": this.couponDiscountAmount != '' ? this.givenCouponNumber.toString() : '',
      //"Discounts": this.couponDiscountAmount != 0.0 ? (this.couponDiscountAmount.toString().contains(".0") ? this.couponDiscountAmount.toFixed(0).toString() : this.couponDiscountAmount.toString()) : ""
      "principal_amount": principalAmt,
      "gst_amount": gstAmt,
      "state": state,
    };
    console.log(jsonData);
    //debugger;
    this._teleConsultService.paymentTransInit(jsonData).subscribe(data => {
      console.log(data);
      //debugger;
      this.paymentTransactionId = data['transaction_id'];
      this.printInvoiceNumber = data['invoice_number'];
      this.callConfirmAppointment();
    });
  }

  moveToMySubscription(): void {
    this.router.navigate(['/mysubscription']);
  }


  callConfirmAppointment() {

    this._constantsService.createSubscriptionProcess = true;
    this.zone.run(() => {
      console.log("Open modal");
      this.dialog.open(ModalComponent);
    });

    this.zone.run(() => {
      // var  jsonDataUpdate = {"ihl_id": this.userData.id,"total_amount": this.course_fees.toString(), "payment_status": "completed",  "transactionId": this.paymentTransactionId, "payment_for": "onlineClass", "MobileNumber":this.contactDetailsMobileNumber,  "payment_mode":"Online"};
      var jsonDataUpdate = { "ihl_id": this.userData.id, "total_amount": this.course_fees.toString(), "payment_status": "completed", "transactionId": this.paymentTransactionId, "payment_for": "onlineClass", "MobileNumber": this.contactDetailsMobileNumber };
      if (this.course_fees > 0) jsonDataUpdate["payment_mode"] = "Online";
      console.log(jsonDataUpdate);
      //debugger;
      this._teleConsultService.paymentTransUpdate(jsonDataUpdate).subscribe(res => {
        console.log(res);
      });
    });

    /**
    @description Below code is commented because it is moved to confirm subscription method
    */
    /*var userData = JSON.parse(localStorage.getItem('userData'));
    if(this.selectedTimeSlot === undefined ||  this.selectedTimeSlot === null ||  this.selectedTimeSlot.trim().length === 0){
      //alert("select time ")
      this.snackBar.open("Please select a valid time slot", '',{
        duration: 4000,
        panelClass: ['error'],
      });
      return;
    }else{
      let timeSelected = this.selectedTimeSlot;
      let startDate = (this.selectedStartDate.getDate() < 10) ? "0"+(this.selectedStartDate.getDate()) : this.selectedStartDate.getDate();
      let startMonth = (this.selectedStartDate.getMonth()+1 < 10) ? "0"+(this.selectedStartDate.getMonth()+1) : this.selectedStartDate.getMonth() + 1;
      //let courseStartAt = this.selectedStartDate.getFullYear()+"-"+startMonth+"-"+startDate;
      let courseStartAt = startMonth+"/"+startDate+"/"+this.selectedStartDate.getFullYear();

      let endDate = (this.selectedEndDate.getDate() < 10) ? "0"+(this.selectedEndDate.getDate()) : this.selectedEndDate.getDate();
      let endMonth = (this.selectedEndDate.getMonth()+1 < 10) ? "0"+(this.selectedEndDate.getMonth()+1) : this.selectedEndDate.getMonth() + 1;
      //let courseEndAt = this.selectedEndDate.getFullYear()+"-"+endMonth+"-"+endDate;
      let courseEndAt = endMonth+"/"+endDate+"/"+this.selectedEndDate.getFullYear();

      let courseDatePeriod = `${courseStartAt} - ${courseEndAt}`;
      console.log(timeSelected);
      console.log(courseStartAt);
      console.log(courseEndAt);
      console.log(courseDatePeriod);
      let fee: number =  0;
      if (this._constantsService.teleconsultationFlowSelected == "affiliate") {
        let offerPrice = this.selectedCourse['affilation_excusive_data']['affilation_array'][0]['affilation_price'];
        try{
          if(offerPrice == undefined || offerPrice == null || String(offerPrice).trim().length == 0 || offerPrice == 0) throw "Invalid OfferPrice";
        }catch(err){
          offerPrice = this.selectedCourse['affilation_excusive_data']['affilation_array'][0]['affilation_mrp'];
        }
        fee = Number(offerPrice);
      } else {
        fee = this.selectedCourse['course_fees'];
      }

      this.book = {
        "user_ihl_id":userData['id'],
        "course_id":this.selectedCourse['course_id'],
        "name":userData['firstName']+" "+userData['lastName'],
        "email":userData['email'],
        "mobile_number":userData['mobileNumber'],
        "course_type":this.selectedCourse['course_type'],
        "course_time":timeSelected,
        "provider":this.selectedCourse['provider'],
        "fees_for":this.selectedCourse['fees_for'],
        "consultant_name":this.selectedCourse['consultant_name'],
        "course_duration":courseDatePeriod,
        "course_fees":fee,
        "consultation_id":this.selectedCourse['consultant_id']
      }
      console.log(this.book);*/
    var subscriptionData = this.book;
    //return;
    var resObj
    this.authService.createUserSubscription(this.book).subscribe(data => {
      resObj = data;
      this.zone.run(() => {
        this._constantsService.createSubscriptionProcess = false;
        this.eventEmitterService.onModalClose();
      });
      var initialRes = JSON.parse(resObj.replace(/&quot;/g, '"'));
      if (initialRes.status == "Subscription Added") {

        this.zone.run(() => {
          // var  jsonDataUpdate = {"appointment_id": initialRes['subscription_id'], "ihl_id": this.userData.id,"total_amount": this.course_fees.toString(), "payment_status": "completed",  "transactionId": this.paymentTransactionId, "payment_for": "onlineClass", "MobileNumber":this.contactDetailsMobileNumber,  "payment_mode":"Online"};
          var jsonDataUpdate = { "appointment_id": initialRes['subscription_id'], "ihl_id": this.userData.id, "total_amount": this.course_fees.toString(), "payment_status": "completed", "transactionId": this.paymentTransactionId, "payment_for": "onlineClass", "MobileNumber": this.contactDetailsMobileNumber };
          if (this.course_fees > 0) jsonDataUpdate["payment_mode"] = "Online";
          console.log(jsonDataUpdate);
          //debugger;
          this._teleConsultService.paymentTransUpdate(jsonDataUpdate).subscribe(res => {
            console.log(res);
          });
        });

        if (this._constantsService.fireStore) {
          let userData = JSON.parse(this._constantsService.aesDecryption("userData"));
          let obj = {
            'data': { cmd: 'GenerateNotification', notification_domain: 'SubscriptionClass' },
            'receiver_ids': this.selectedCourse['consultant_id'],
            'sender_id': userData['id'],
            'published': true
          };
          this.fireStoreService.create(initialRes['subscription_id'], this._constantsService.teleConsultationCollectionName, obj);
        } else {
          if (this.teleConsultCrossbarService.is_connected == true) {
            console.log('In sending crossbar event');
            // Sending event to host about new Appointment
            let _data = {
              'cmd': 'GenerateNotification',
              'notification_domain': 'SubscriptionClass',
            };
            let receiver_id = this.selectedCourse['consultant_id'];
            console.log(receiver_id);
            if (receiver_id != undefined) {
              let _options: PublishToChannelOptions = {
                receiver_ids: [receiver_id],
              };
              this.teleConsultCrossbarService.publishToChannel('ihl_send_data_to_doctor_channel', _data, _options);
            }
          }
        }

        this.isLoading = false;
        this.zone.run(() => {
          this.dialog.open(ModalComponent);
        });

        if (this.course_fees != 0)
          this._constantsService.showSubscriptionDownloadInvoice = true;

        this._constantsService.showSubscriptionModal = true;
        /*this.snackBar.open("Your Subscription Added successfully!", '',{
          duration: 6000,
          panelClass: ['success'],
        });

        this.zone.run(() => {
          this.router.navigate(['/mysubscription']);
        });*/
      } else {
        this.isLoading = false;
        this.snackBar.open("Sorry something went wrong!", '', {
          duration: 6000,
          panelClass: ['error'],
        });
        this.shrinkCard();
      }
    });
    /*}*/
  }

  receiveAppointmentDataForPaymentTransaction(id: any, book: Object, ...razorpayTransactionDetails: string[]): any {
    let MRPCost: string;
    let TotalAmount: string;
    let Discounts: string;
    let ConsultantID: string; //(ihl_consultant_id, course id)
    let ConsultantName: string;
    let ClassName: string;
    let PurposeDetails: string; //(string of book appointment object, string of course object)
    let AppointmentID: string;
    let AffilationUniqueName: string;
    let SourceDevice: string;
    let appointmentDetail = this._constantsService.appointmentDetails;
    let bookAppointmentObject = book;
    let Service_Provided = "false";
    let purpose = "online_class";
    let [razorpay_order_id, razorpay_payment_id, razorpay_signature]: [string, string, string] = [razorpayTransactionDetails[0], razorpayTransactionDetails[1], razorpayTransactionDetails[2]];

    if (this._constantsService.teleconsultationFlowSelected == "affiliate") {
      // MRPCost = (this.selectedCourse['affilation_excusive_data']['affilation_array'][0]['affilation_mrp']).toString();
      // Discounts = Number(this.selectedCourse['affilation_excusive_data']['affilation_array'][0]['affilation_mrp'] - this.selectedCourse['affilation_excusive_data']['affilation_array'][0]['affilation_price']).toString();
      if (this.selectedCourse['affilation_excusive_data']['affilation_array'][0]['affilation_price'] == 0) {
        MRPCost = "FREE";
      } else {
        MRPCost = this.selectedCourse['affilation_excusive_data']['affilation_array'][0]['affilation_price'];
      }
      Discounts = "";
      TotalAmount = (this.selectedCourse['affilation_excusive_data']['affilation_array'][0]['affilation_price']).toString();
      ConsultantID = this.selectedCourse['course_id'];
      ConsultantName = this.selectedCourse['consultant_name'];
      ClassName = this.selectedCourse['title'];
      PurposeDetails = JSON.stringify(bookAppointmentObject);
      AppointmentID = id;
      AffilationUniqueName = this.selectedCourse['affilation_excusive_data']['affilation_array'][0]['affilation_unique_name'];
      SourceDevice = "portal";
    } else {
      if (this.selectedCourse['course_fees'] == 0) {
        MRPCost = "FREE";
      } else {
        MRPCost = this.selectedCourse['course_fees'];
      }
      Discounts = "";
      AffilationUniqueName = "global_services";
      // MRPCost = (this.selectedCourse['course_fees']).toString();
      TotalAmount = (this.selectedCourse['course_fees']).toString();
      // Discounts = "0";
      ConsultantID = this.selectedCourse['course_id'];
      ConsultantName = this.selectedCourse['consultant_name'];
      ClassName = this.selectedCourse['title'];
      PurposeDetails = JSON.stringify(bookAppointmentObject);
      AppointmentID = id;
      // AffilationUniqueName = "";
      SourceDevice = "portal";
    }
    let PaymentDetail: PaymentDetails<string> = new PaymentDetails<string>(MRPCost, TotalAmount, Discounts, ConsultantID, ConsultantName, ClassName, PurposeDetails, AppointmentID, AffilationUniqueName, SourceDevice, Service_Provided, purpose, razorpay_order_id, razorpay_payment_id, razorpay_signature);
    return PaymentDetail;
    //let paymentTransactionDetailsFunction: CollectPaymentDetails<string> = this.paymentTransactionDetails;
    //paymentTransactionDetailsFunction(MRPCost, TotalAmount, Discounts, ConsultantID, ConsultantName, ClassName, PurposeDetails, AppointmentID, AffilationUniqueName, SourceDevice);

  }

  downloadInvoiceSubOnline() {

    console.log(this.book);
    console.log(this.selectedCourse);

    this.course_duration = this.book.course_duration;
    this.title = this.selectedCourse.title;
    this.provider = this.book.provider;
    this.course_fees = this.book.course_fees + this.couponDiscountAmount;
    let userDetail = JSON.parse(this._constantsService.aesDecryption('userData'));

    if (userDetail.address != undefined && userDetail.area != undefined && userDetail.city != undefined && userDetail.state != undefined && userDetail.pincode != undefined)
      this.userAddress = userDetail.address + "<br>" + userDetail.area + "<br>" + userDetail.city + "<br>" + userDetail.state + " - " + userDetail.pincode;

    if (userDetail.state != undefined)
      this.state = userDetail.state.toLowerCase();
    this.userName = `${userDetail.firstName} ${userDetail.lastName}`;
    this.userMobNumber = (userDetail.mobileNumber !== undefined && userDetail.mobileNumber !== null && userDetail.mobileNumber.trim().length === 10) ? userDetail.mobileNumber : "NA";
    this.userMail = (userDetail.email !== undefined && userDetail.email !== null && userDetail.email.trim().length > 0) ? userDetail.email : "NA";

    if (this.course_fees > 0) {
      this.deductedIgstAmt = ((Number(this.course_fees) - this.couponDiscountAmount) / 1.18).toFixed(2);
      this.igstAmt = (Number(this.deductedIgstAmt) * 18 / 100).toFixed(2);
      this.sgstAmt = (Number(this.deductedIgstAmt) * 9 / 100).toFixed(2);
      this.totalAmount = Number(this.course_fees) - this.couponDiscountAmount;
    }
    this.showInvoice = true;

    setTimeout(() => {
      console.log("pdf call");
      let pdf = new jsPDF('p', 'pt', 'a3');
      pdf.html(this.el.nativeElement, {
        callback: (pdf) => {
          pdf.save("DownloadInvoice.pdf");
          this.showInvoice = false;
          this.couponDiscountAmount = 0;
        }
      });
      this.router.navigate(['/mysubscription']);
    }, 3000);
  }

  getCurrentDate(): string {
    const currentDate = new Date();
    return this.datePipe.transform(currentDate, 'dd-MM-yyyy');
  }

  getCurrentTime(): string {
    const currentDate = new Date();
    return this.datePipe.transform(currentDate, 'h:mm a');
  }

  convertTo24HourFormat(time12HourString) {
    const timeComponents = time12HourString.split(' ');
    const timePart = timeComponents[0];
    const period = timeComponents[1];

    const [hours, minutes] = timePart.split(':').map(Number);

    // Convert to 24-hour format
    let convertedHours = hours;
    if (period === 'PM' && hours < 12) {
      convertedHours += 12;
    } else if (period === 'AM' && hours === 12) {
      convertedHours = 0;
    }

    // Format the result
    return `${convertedHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }

  tempClass: Array<any> = [
    {
      available_slot: [],
      available_slot_count: "no_limit",
      consultant_gender: "Male",
      consultant_id: "29bf8410c6fc43a697309fc2a457b4b1",
      consultant_name: "host52_2",
      course_duration: "01-11-2020 - 30-11-2020",
      course_fees: 800,
      course_img_url: "",
      course_on: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      course_status: "upcoming",
      course_time: ["05:00 AM - 6:00 AM", "05:00 PM - 06:00 PM"],
      course_type: "7 Days",
      fees_for: "7 Days",
      provider: "Gym52",
      subscriber_count: 0,
      title: "zumba",
      specality_name: "Zumba",
      course_id: "afdefef1",
      course_review: [],
    },
    {
      available_slot: [],
      available_slot_count: "no_limit",
      consultant_gender: "Male",
      consultant_id: "29bf8410c6fc43a697309fc2a457b4b2",
      consultant_name: "host52_2",
      course_duration: "30-11-2020 - 04-12-2020",
      course_fees: 800,
      course_img_url: "",
      course_on: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      course_status: "upcoming",
      course_time: ["02:00 PM - 05:00 PM"],
      course_type: "2 Weeks",
      fees_for: "2 Weeks",
      provider: "Gym52",
      subscriber_count: 0,
      title: "zumba",
      specality_name: "Zumba",
      course_id: "afdefef2",
      course_review: [],
    },
    {
      available_slot: [],
      available_slot_count: "no_limit",
      consultant_gender: "Male",
      consultant_id: "29bf8410c6fc43a697309fc2a457b4b3",
      consultant_name: "host52_2",
      course_duration: "30-11-2020 - 04-12-2020",
      course_fees: 800,
      course_img_url: "",
      course_on: ["Monday", "Tuesday", "Wednesday"],
      course_status: "upcoming",
      course_time: ["06:00 AM - 10:00 AM"],
      course_type: "2 Months",
      fees_for: "2 Months",
      provider: "Gym52",
      subscriber_count: 0,
      title: "zumba",
      specality_name: "Zumba",
      course_id: "afdefef3",
      course_review: [],
    }

  ]

}

interface classId {
  classIDList: any[];
}

interface reviewObj {
  rating_text: string;
  user_rating: number;
  time_stamp: string;
  user_name: string;
}
