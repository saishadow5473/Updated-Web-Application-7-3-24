import { Component, OnInit, HostListener} from '@angular/core';
import {Router} from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ConstantsService } from 'src/app/services/constants.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TooltipPosition} from '@angular/material/tooltip';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ModalComponent } from '../modal/modal.component';
import { EventEmitterService } from 'src/app/services/event-emitter.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  @HostListener("click") onClick(){
    if(this.router.url === "/dashboard"){
      if($("#vital-stats-board").is(":hidden")) {
        $("#vital-stats-board").show()
        $("#vital-stats-info").hide()  
        $("#dashboardBannerImg").show()
      }
    }
  }
  newUser:boolean = false;
  metricsDisable: any
  //notShowMetrics:boolean = false;
  displayMenu: Display<string>;
  
  constructor(private router: Router, private authService: AuthService, public _constants: ConstantsService, private snackBar: MatSnackBar, private dialog: MatDialog, 
    private eventEmitterService: EventEmitterService) { }

  ngOnInit() {
    this.metricsDisable = this._constants.aesDecryption("affiliateProgram");
    //this._constants.notShowMetricsTitle = "programs";
    if (this.metricsDisable == undefined || this.metricsDisable == null || this.metricsDisable == "") {
      this._constants.notShowMetrics = true;
      this._constants.notShowMetricsTitle = "The program feature is disabled";
    }

    this.displayMenu = new Display<string>("none");
  }

  teleCall(){
    this.authService.basicInfoCheck();
    setTimeout(() => {      
      if(!this._constants.basicInfoNeed){
        //this.authService.publish('tele-call');
        this._constants.processingContent = true;
        this.dialog.open(ModalComponent);
        this.authService.teleCallRedirection().subscribe(data =>  {
          console.log(data);
          if(data !== undefined && data !== null){
            this._constants.processingContent = false;             
            this.eventEmitterService.onModalClose();      
            window.location.href = data;
          }
        });
      } else {
        this.snackBar.open("Please enter the basic info ", '',{
          duration: 10000,
          panelClass: ['error'],
        });
        this.router.navigate(['export'])
      }      
    },1000 * 1);
  }

  generalConsultationFlow() {this._constants.teleconsultationFlowSelected = 'genric'; this._constants.teleConsultationNewFlow = false}
  
  

}

export class Display<T>{
  display: T;
  constructor(display){
    this.display = display;
  }
}
