import { Component, ElementRef, OnInit, ViewChild, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { bool, ModalComponent } from '../modal/modal.component';
import { ConstantsService } from 'src/app/services/constants.service';
import { TeleConsultService } from 'src/app/services/tele-consult.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { DndDirective } from '../../dnd.directive';
import { MedicalDocumentService } from 'src/app/services/medical-document.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import {DomSanitizer,SafeResourceUrl} from '@angular/platform-browser';
import { PublishToChannelOptions, TeleconsultationCrossbarService, Channel } from '../../services/tele-consult-crossbar.service';
import { FireStoreService } from '../../services/firestore.service';

@Component({
  selector: 'app-medical-doc',
  templateUrl: './medical.component.html',
  styleUrls: ['./medical.component.css']
})
export class MedicalDocComponent implements OnInit {
  vaptEnabled = this._constant.vaptEnabled;
  files: any[] = [];
  extension: any;
  acceptedImageExtension: Array<string> = [".png", ".jpeg", ".jpg", ".pdf"];
  subscription: any;

  @ViewChild("fileDropRef") fileDropRef: ElementRef;
  @ViewChild("fileDropRef2") fileDropRef2: ElementRef;
  userData: any;
  medicalDocumentsList: Array<any> = [];
  isViewAllDocumentsResponseReceived: boolean = false;
  activeDocumentId: string | number = "";
  sharedActiveDocumentId: string | number = "";
  documentSelected: any = {};
  enableMenuOptions: boolean = false;
  selectedDocumentIndex: any;
  percentDone: any = "";
  percentValue: any = 0;
  uploadStarted: boolean = false;
  isDeleteProgress: boolean = false;
  isPreviewPdf: boolean = false;
  isMedFilePreviewPdf: boolean = false;
  isSharedMedFilePreviewPdf: boolean = false;
  showPreview: boolean = false;
  medFilePreview: boolean = false;
  sharedMedFilePreview: boolean = false;
  urlSafe: SafeResourceUrl ="";
  documentToShare: any[] = [];
  uploadedFileName: any = "";
  sharedDocumentsList: Array<any> = [];
  appointmentInfo: any = {};
  documentSelectList: any[] = [];
  enableView: boolean = false;
  enableShareDocMenuOptions: boolean = false;
  sharedDocumentSelected: any = {};
  showSharedDocFile: boolean = false;
  showFile: boolean = false;
  medicalDocumentListData: any = {};
  showProgressBar: boolean = false;

  constructor(public router: Router,
    private _teleConsultService:TeleConsultService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    public _constant: ConstantsService,
    private medicalDocumentService: MedicalDocumentService,
    private renderer: Renderer2,
    private sanitizer: DomSanitizer,
    private teleConsultCrossbarService: TeleconsultationCrossbarService,
    private fireStoreService: FireStoreService
  ) { 
  }

  ngOnInit() {
    this.userData = JSON.parse(this._constant.aesDecryption('userData'));
    this.viewAllDocuments();
    this.getDocumentDetailsByAppointmentID();

    this.subscription = this.authService.on('newFile-Name').subscribe(() => this.uploadFileToServer());
    console.log(this._constant.liveCallCourseObj);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  viewAllDocuments(): void{
    let data: ListFilesObj = {
      ihl_user_id : this.userData.id,
      request_from : "user"
    }
    this.medicalDocumentService.getAllMedicalFiles(data).subscribe(
      (data)=>{
        this.isViewAllDocumentsResponseReceived = true;
        if(Array.isArray(data)){
          this._constant.medicalDocumentsList = data;

          this._constant.medicalDocumentsList.forEach(function(value) {
            value['is_checked'] = false;
          });

          if (this.router.url != '/medical-doc') {
            let obj = this._constant.medicalDocumentsList.find(item =>{
              return item.document_name == this.uploadedFileName;
            });
            if (obj != undefined && obj != null) {
              this.onSelectDocument(obj.document_id);
            }
          }else{
            this.uploadedFileName = "";
          }
          return;
        }
        this._constant.medicalDocumentsList = [];
      },
      (err)=>{
        this._constant.medicalDocumentsList = [];
        this.isViewAllDocumentsResponseReceived = true;
      },
      ()=>{
        this.isViewAllDocumentsResponseReceived = true;
      }
    );
  }

  // public uploade:string = null;
  public openRenamePopUP(name: any) {
    // alert(name);
    this._constant.currentUploadedFileName = name.substr(0, name.indexOf('.'));
    this._constant.renameFilePopUp = true;
    this.dialog.open(ModalComponent, {width:'400px'});
  }
  
  // Add file to list
  uploadFile(event: any) {
    if(this.vaptEnabled){
      this.files = [];
      this.uploadedFileName = "";
      this.resetDocumentSelectionProperties();
      const element = event[0];

      // VALIDATION FOR IMAGE FILE SIZE
      let fileSizeMB = element.size / (1024 ** 2)
      if (fileSizeMB > 5) {
        this.showSnackBar("File size should not exceed 5 MB", "error");
        return;
      }
      
      // VALIDATION FOR IMAGES AND PDF FILES ONLY
      this.extension = element.name.substr(element.name.lastIndexOf('.')).toLowerCase();
      if (this.acceptedImageExtension.includes(this.extension) == false){
        this.showSnackBar("Please choose a valid file format", "error");
        return;
      }
      this.files.push(element);
      this.openRenamePopUP(element.name);
      if(this._constant.medicalDocumentsList.length > 0){
        let isFileNameAlreadyExists = this._constant.medicalDocumentsList.some(item => {
          return element.name == item.document_name;
        });
        if(isFileNameAlreadyExists == true){
          this._constant.saveFile = false;
          this.showSnackBar("File already exists", "error");
          return;
        }
      }
      if(this.fileDropRef){
        this.fileDropRef.nativeElement.value = ''; 
      }

      if(this.fileDropRef2){
        this.fileDropRef2.nativeElement.value = ''; 
      }
      // const myRenamedFile = new File([element], 'rename.pdf');
      // alert(extension);
      // this.openRenamePopUP(element.name);
      // console.log(this.files[0]);

      // this.uploadFileToServer(this.files[0]);
    }else{
      this.files = [];
      this.uploadedFileName = "";
      this.resetDocumentSelectionProperties();
      const element = event[0];
      
      // VALIDATION FOR IMAGES AND PDF FILES ONLY
      this.extension = element.name.substr(element.name.lastIndexOf('.')).toLowerCase();
      if (this.acceptedImageExtension.includes(this.extension) == false){
        this.showSnackBar("Please choose a valid file format", "error");
        return;
      }
      this.files.push(element);
      this.openRenamePopUP(element.name);
      if(this._constant.medicalDocumentsList.length > 0){
        let isFileNameAlreadyExists = this._constant.medicalDocumentsList.some(item => {
          return element.name == item.document_name;
        });
        if(isFileNameAlreadyExists == true){
          this._constant.saveFile = false;
          this.showSnackBar("File already exists", "error");
          return;
        }
      }
      if(this.fileDropRef){
        this.fileDropRef.nativeElement.value = ''; 
      }

      if(this.fileDropRef2){
        this.fileDropRef2.nativeElement.value = ''; 
      }
      // const myRenamedFile = new File([element], 'rename.pdf');
      // alert(extension);
      // this.openRenamePopUP(element.name);
      // console.log(this.files[0]);

      // this.uploadFileToServer(this.files[0]);
    }
  }

  public uploadFileToServer(): void {

    let onlyFN = this._constant.modifiedMedicalFileName;
    let newFN = onlyFN.newFileName + this.extension;
    const file = new File([this.files[0]], newFN);
    const formData = new FormData();  
    let [userId, fileName, fileFormat]: [string, string, string] = [this.userData.id, file.name, ((file.name.substr(file.name.lastIndexOf('.')).split(".")[1]).toLowerCase() == "pdf")? "pdf": "image"];
    formData.append('ihl_user_id', userId);
    if(this.vaptEnabled){
      formData.append('document_name', onlyFN.newFileName);
    }else{
      formData.append('document_name', fileName);
    }    
    formData.append('document_format_type', fileFormat);
    formData.append('document_type', "others");
    formData.append('data', file);
    if (this.router.url != '/medical-doc') {
      this.uploadedFileName = fileName;
    }else{
      this.uploadedFileName = "";
    }

    this.uploadStarted = true;
    this.percentDone = `Uploading 0%`;
    if(this.vaptEnabled){
      /* GET C-TOKEN BEFORE UPLOAD THE FILE */
      var apiKey = localStorage.getItem('apiKey');
      this.authService.getCToken(apiKey).subscribe(res => {
        console.log(res);
        if ('token' in res) {
          let CToken = res.token;
          this.medicalDocumentService.uploadFilesForVapt(formData, CToken).subscribe(
            async (data)=>{
              if (data.type === HttpEventType["UploadProgress"]) {
                const percentDone = Math.round(
                  (100 * data.loaded) / data.total
                );
                this.percentValue = percentDone;
                this.percentDone = `Uploading ${this.percentValue}%`;
                //console.log(`File is ${this.percentValue}% uploaded.`);
                return;
              }else if (data instanceof HttpResponse) {
                if(data.status && data.status == 200){
                  if(data.body  && data.body.status && data.body.status == "document uploaded successfully"){
                    await this.viewAllDocuments();
                    this.showSnackBar("Your document uploaded successfully", "success");
                    return;
                  } else if(data.body  && data.body.status && data.body.status == "reached daily limit") {
                    this.showSnackBar("Reached daily limit, Can upload document only 10 times per day", "error");
                    return;
                  }
                  this.showSnackBar("Sorry something went wrong", "error");
                  return;
                }else{
                  this.showSnackBar("Sorry something went wrong", "error");
                }
              }
            },
            (err)=>{
              // console.log(err);
              this.showSnackBar("Sorry something went wrong", "error");
              this.resetProgressEventProperties();
            },
            ()=>{
              // console.log("file upload completed");
              this.resetProgressEventProperties();
            }
          );
        } else{
          this.showSnackBar("Sorry something went wrong", "error");
        }
      });
    }else{
      this.medicalDocumentService.uploadFiles(formData).subscribe(
        async (data)=>{
          if (data.type === HttpEventType["UploadProgress"]) {
            const percentDone = Math.round(
              (100 * data.loaded) / data.total
            );
            this.percentValue = percentDone;
            this.percentDone = `Uploading ${this.percentValue}%`;
            //console.log(`File is ${this.percentValue}% uploaded.`);
            return;
          }else if (data instanceof HttpResponse) {
            if(data.status && data.status == 200){
              if(data.body  && data.body.status && data.body.status == "document uploaded successfully"){
                await this.viewAllDocuments();
                this.showSnackBar("Your document uploaded successfully", "success");
                return;
              }
              this.showSnackBar("Sorry something went wrong", "error");
              return;
            }else{
              this.showSnackBar("Sorry something went wrong", "error");
            }
          }
        },
        (err)=>{
          console.log(err);
          this.showSnackBar("Sorry something went wrong", "error");
          this.resetProgressEventProperties();
        },
        ()=>{
          console.log("file upload completed");
          this.resetProgressEventProperties();
        }
      );  
    }
  }

  getImageSrc(data: any): string{
    if(this.vaptEnabled){
      if (data.document_link.includes('png'))
        return `assets/img/png.png`;
      else
        return `assets/img/pdf.png`;
    }else{
      let img = data.document_link.substr(data.document_link.lastIndexOf('.')).split('.')[1].toLowerCase();
      return `assets/img/${img}.png`;
    }
  }

  getFontAwesomeIcon(data: any): string{
    if(this.vaptEnabled){
      if (data.document_link.includes('pdf')) {
        return "fa-file-pdf";
      }
      return "fa-file-image";
    }else{
      let img = data.document_link.substr(data.document_link.lastIndexOf('.')).split('.')[1].toLowerCase();
      if (img == "pdf") {
        return "fa-file-pdf";
      }
      return "fa-file-image";
    }
  }

  showSnackBar(message: string, status: string): void{
    this.snackBar.open(message, '',{
      duration: 3000,
      panelClass: [status],
    });
  }

  trackByFn(index: number, item: any): any{
    return item.document_id;
  }

  onDocumentSelectionClick(documnt: any, index: any): void{
    if(documnt.document_id == this.activeDocumentId){
      this.resetDocumentSelectionProperties();
      return;
    }
    this.activeDocumentId = documnt.document_id;
    this.documentSelected = documnt;
    this.enableMenuOptions = true;
    this.selectedDocumentIndex = index;
  }

  resetDocumentSelectionProperties(): void{
    this.activeDocumentId = "";
    this.documentSelected = {};
    this.enableMenuOptions = false;
    this.selectedDocumentIndex = undefined;
  }

  resetProgressEventProperties(): void{
    this.uploadStarted = false;
    this.percentValue = 0;
    this.percentDone = "";
  }

  // Removing a file from list
  onDeleteClick() {
    let deleleteDocumentObj: DeleteDocumentObj = {
      ihl_user_id : this.userData.id,
      document_id : [this.documentSelected.document_id]
    }
    //this.medicalDocumentsList.splice(this.selectedDocumentIndex, 1);
    this.isDeleteProgress = true;
    this.medicalDocumentService.deleteSeletectedFile(deleleteDocumentObj).subscribe(
      (data)=>{
        console.log(data);
        if(data.status == "document deleted successfully"){
          this.showSnackBar("Your document deleted successfully", "success");
          return;
        }
        this.showSnackBar("Sorry something went wrong", "error");
      },
      (err)=>{
        console.log(err);
        this.resetDocumentSelectionProperties();
        this.viewAllDocuments();
        this.showSnackBar("Sorry something went wrong", "error");
        this.isDeleteProgress = false;
      },
      ()=>{
        console.log("file delete completed");
        this.resetDocumentSelectionProperties();
        this.viewAllDocuments();
        this.isDeleteProgress = false;
      }
    );  
  }

  htmlDecode(input){
    var doc = new DOMParser().parseFromString(input, "text/html");
    return doc.documentElement.textContent;
  }

  onViewClick(){
    if(this.vaptEnabled){
      console.log(this.documentSelected.document_link);
      let extension = '.pdf';
      if (this.documentSelected.document_link.includes('png'))
        extension = '.png'
      
      this.showPreview = true;
      console.log(extension);
      if(extension == ".pdf"){
        this.isPreviewPdf = true;
        this.urlSafe ="";
        this.transform();
      }else{
        this.isPreviewPdf = false;
      }
    }else{
      this.documentSelected.document_link = this.htmlDecode(this.documentSelected.document_link);
      let extension = this.documentSelected.document_link.substr(this.documentSelected.document_link.lastIndexOf('.')).toLowerCase();
      this.showPreview = true;
      this.showSharedDocFile = false;
      this.showFile = true;
      if(extension == ".pdf"){
        this.isPreviewPdf = true;
        this.urlSafe ="";
        this.transform();
      }else{
        this.isPreviewPdf = false;
      }
    }
  }

  onMedFileViewClick() {
    this.documentSelected.document_link = this.htmlDecode(this.documentSelected.document_link);
    let extension = this.documentSelected.document_link.substr(this.documentSelected.document_link.lastIndexOf('.')).toLowerCase();
    this.medFilePreview = true;
    this.sharedMedFilePreview = false;
    if(extension == ".pdf"){
      this.isMedFilePreviewPdf = true;
      this.urlSafe ="";
      this.transform();
    }else{
      this.isMedFilePreviewPdf = false;
    }
  }

  transform() {
    if(this.vaptEnabled){
      this.documentSelected.document_link = this.documentSelected.document_link.replace('data:doc/pdf;base64,', '');
      const byteArray = new Uint8Array(
        atob(this.documentSelected.document_link)
        .split('')
        .map((char) => char.charCodeAt(0))
      );
  
      const file = new Blob([byteArray], {type: 'application/pdf'});
      const fileUrl = URL.createObjectURL(file);
      this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(fileUrl);
    }else{
      const splitUrl = this.documentSelected.document_link.split("//");
      console.log(`https://${splitUrl[1]}`);
      this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(`https://${splitUrl[1]}`);
      console.log(this.urlSafe);
    }
  }

  sharedTransform() {
    const splitUrl = this.sharedDocumentSelected.document_link.split("//");
    console.log(`https://${splitUrl[1]}`);
    this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(`https://${splitUrl[1]}`);
    console.log(this.urlSafe);
  }

  onClosePreviewClick(){
    this.showPreview = false;
  }

  onCloseMedFilePreviewClick() {
    this.medFilePreview = false;
  }

  onCloseSharedMedFilePreviewClick() {
    this.sharedMedFilePreview = false;
  }

  // Move back to menu on close button
  showTeleDashboard(): void{
    this.router.navigate(['/myappointment']);
  }

  onSelectDocument(value: any): any{
    if (this._constant.documentToShare.includes(value)) {
      this._constant.documentToShare.splice(this._constant.documentToShare.indexOf(value), 1);
    }else{
      this._constant.documentToShare.push(value);
    }
    //console.log(this.documentToShare);
    this.medicalDocumentService.selectedDocumentedId(this._constant.documentToShare);
  }

  /* GET DOCUMENT DETAILS BY APPOINTMENT ID */

  getDocumentDetailsByAppointmentID() {
    if (this._constant.updateAppointmentID === null && this._constant.newAppointmentID === null) {
      this.showTeleDashboard();
      return;
    }

    let appointmentID = '';
    let consultantID = '';

    if (this._constant.newAppointmentID != null)
      appointmentID = this._constant.newAppointmentID;
    else
      appointmentID = this._constant.updateAppointmentID;

    console.log(this._constant.appointmentDetails);
    console.log(this._constant.newConsultantID);

    if (this._constant.newConsultantID != null)
      consultantID = this._constant.newConsultantID;
    else if (this._constant.appointmentDetails != undefined && this._constant.appointmentDetails.hasOwnProperty('consultant_id'))
      consultantID = this._constant.appointmentDetails.consultant_id;
    else
      consultantID = this._constant.consultationAppointmentInfo.ihl_consultant_id;

    let userData: ListFilesObj = {
      ihl_user_id : this.userData.id,
      request_from : "user",
      Appointment_id : appointmentID,
    }

    this.medicalDocumentService.getAllMedicalFiles(userData).subscribe((data)=>{
      if(Array.isArray(data)){

        console.log(consultantID);

        data.forEach(function(val) {
            val['document_name'] = val['document_name'].split(consultantID)[1];
        });

        this.sharedDocumentsList = data;
      } else {
        this.sharedDocumentsList = [];
      }
    });
  }
  
  onDocumentSelection(documnt: any, index: any, event: any): void {
    this._constant.medicalDocumentsList.forEach((value) => {
      if (documnt.document_id == value['document_id']) {
        value['is_checked'] = event.target.checked;

        this.onSelectDocument(documnt.document_id);

        if (value['is_checked']) {
          this.documentSelectList.push(value);
          this.documentSelected = documnt;
        }
        else {
          this.documentSelectList.splice(this.documentSelectList.indexOf(value), 1);
        }
      }
    });

    if (this.documentSelectList.length != 0)
      this.enableMenuOptions = true;
    else
      this.enableMenuOptions = false;

    if (this.documentSelectList.length == 1)
      this.enableView = true;
    else
      this.enableView = false;
  }

  onSharedDocumentSelectionClick(documnt: any, index: any): void{
    this.sharedActiveDocumentId = documnt.document_id;
    this.sharedDocumentSelected = documnt;
    this.enableShareDocMenuOptions = true;
    this.selectedDocumentIndex = index;
  }

  onSharedDocViewClick(){
    if(this.vaptEnabled){
      let extension = '.pdf';
      if (this.sharedDocumentSelected.document_link.includes('png'))
        extension = '.png'
      this.showPreview = true;
      this.showSharedDocFile = true;
      this.showFile = false;
      if(extension == ".pdf"){
        this.isPreviewPdf = true;
        this.urlSafe ="";
        this.sharedTransform();
      }else{
        this.isPreviewPdf = false;
      }
    }else{
      this.sharedDocumentSelected.document_link = this.htmlDecode(this.sharedDocumentSelected.document_link);
      let extension = this.sharedDocumentSelected.document_link.substr(this.sharedDocumentSelected.document_link.lastIndexOf('.')).toLowerCase();
      this.showPreview = true;
      this.showSharedDocFile = true;
      this.showFile = false;
      if(extension == ".pdf"){
        this.isPreviewPdf = true;
        this.urlSafe ="";
        this.sharedTransform();
      }else{
        this.isPreviewPdf = false;
      }
    }
  }

  onSharedMedFileViewClick() {
    if(this.vaptEnabled){
      let extension = '.pdf';
      if (this.sharedDocumentSelected.document_link.includes('png'))
        extension = '.png'
      this.sharedMedFilePreview = true;
      this.medFilePreview = false;
      if(extension == ".pdf"){
        this.isSharedMedFilePreviewPdf = true;
        this.urlSafe ="";
        this.sharedTransform();
      }else{
        this.isSharedMedFilePreviewPdf = false;
      }
    }else{
      this.sharedDocumentSelected.document_link = this.htmlDecode(this.sharedDocumentSelected.document_link);
      let extension = this.sharedDocumentSelected.document_link.substr(this.sharedDocumentSelected.document_link.lastIndexOf('.')).toLowerCase();
      this.sharedMedFilePreview = true;
      this.medFilePreview = false;
      if(extension == ".pdf"){
        this.isSharedMedFilePreviewPdf = true;
        this.urlSafe ="";
        this.sharedTransform();
      }else{
        this.isSharedMedFilePreviewPdf = false;
      }
    }
  }

  onUploadClick(videoCall = false) {

    var documentListArr = [];
    var selectedDocumentList = [];

    this.sharedDocumentsList.forEach(function(value) {
      documentListArr.push(value['document_id']);
    });

    this._constant.medicalDocumentsList.forEach((value) => {
        if (value['is_checked'])
          selectedDocumentList.push(value['document_id']);
    });

    documentListArr = documentListArr.concat(selectedDocumentList);

    let appointmentID = '';
    let consultantID = '';

    if (videoCall) {
      appointmentID = this._constant.newAppointmentID;

      if (this._constant.newConsultantID != null)
        consultantID = this._constant.newConsultantID;
      else
        consultantID = this._constant.appointmentDetails.consultant_id;
    } else {
      appointmentID = this._constant.consultationAppointmentInfo.appointment_id;
      consultantID = this._constant.consultationAppointmentInfo.ihl_consultant_id;
    }

    this.medicalDocumentListData = {
      'ihl_user_id': this.userData.id,
      'document_id': documentListArr,
      'appointment_id': appointmentID,
      'ihl_consultant_id': consultantID
    };

    // console.log(this.medicalDocumentListData);
    // console.log(this._constant.newAppointmentID);
    // console.log(this._constant.consultationAppointmentInfo.appointment_id);
    // console.log(this._constant.newConsultantID);
    // console.log(this._constant.appointmentDetails.consultant_id);
    // console.log(this._constant.consultationAppointmentInfo.ihl_consultant_id);
        
    this.authService.shareMedicalDocAfterAppointment(this.medicalDocumentListData).subscribe(data=>{
      this._constant.medicalDocumentsList.forEach(function(value) {
        if (value['is_checked'])
          value['is_checked'] = false;
      });
      this.enableMenuOptions = false;
      this.documentSelectList = [];
      this._constant.documentToShare = [];
      this.getDocumentDetailsByAppointmentID();

      if (this._constant.fireStore) {
        let obj = {
          'data': {'cmd': 'MedicalReportShare', 'ihl_user_id': this.userData.id, 'appointment_id': appointmentID, 'ihl_consultant_id': consultantID, 'notification_domain': 'MedicalDocument', 'document_id': documentListArr},
          'receiver_ids': [consultantID],
          'sender_id': this.userData.id
        };
        this.fireStoreService.update(appointmentID, obj, this._constant.teleConsultationCollectionName);
      } else {
        let receiver_id = consultantID;
        if(receiver_id != undefined){
          let _options:PublishToChannelOptions = {
            receiver_ids:[receiver_id],
          };
          this.teleConsultCrossbarService.publishToChannel('medical_report_share', this.medicalDocumentListData, _options);
        }
      }
    });
  }
}

interface ListFilesObj{
  ihl_user_id : string;
  request_from : string;
  Appointment_id?: string;
}

interface DeleteDocumentObj{
  ihl_user_id : string;
  document_id : Array<any>;
}