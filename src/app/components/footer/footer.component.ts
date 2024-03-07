import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  currentYear: any;
  constructor(
    private router: Router, 
    private date: DatePipe
    ) { 
      this.currentYear = date.transform(new Date(), 'y');
    }

  ngOnInit() {
  }
   
  /*websiteRedirectFooter(page){
    localStorage.setItem("websiteRedirect", "true");
    localStorage.setItem("teleCall", 'false');
    var currentUrl = window.location.href;
    var tempUrl = currentUrl.split("portal");
    window.location.href = tempUrl[0]+"policy.html#"+page;
  }*/

  routeToDisclaimer() {
    this.router.navigate(['policy']);
    document.getElementById('disclaimer').scrollIntoView({behavior:"smooth"});
  }
  routeToGrievance() {
    this.router.navigate(['policy']);
    document.getElementById('grievance').scrollIntoView({behavior:"smooth"});
  }
  routeToTerms() {
    this.router.navigate(['policy']);
    document.getElementById('terms').scrollIntoView({behavior:"smooth"});
  }
  routeToPrivacy() {
    this.router.navigate(['policy']);
    document.getElementById('privacy').scrollIntoView({behavior:"smooth"});
  }
  routeToRefund() {
    this.router.navigate(['policy']);
    document.getElementById('refund').scrollIntoView({behavior:"smooth"});
  }
}
