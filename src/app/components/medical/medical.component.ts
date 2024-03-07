import { Component, ElementRef, OnInit, ViewChild, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ModalComponent } from '../modal/modal.component';
import { ConstantsService } from 'src/app/services/constants.service';
import { TeleConsultService } from 'src/app/services/tele-consult.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { DndDirective } from '../../dnd.directive';
import { MedicalDocumentService } from 'src/app/services/medical-document.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import {DomSanitizer,SafeResourceUrl} from '@angular/platform-browser';

@Component({
  selector: 'app-medical',
  templateUrl: './medical.component.html',
  styleUrls: ['./medical.component.css']
})
export class MedicalComponent implements OnInit {
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
  documentSelected: any = {};
  enableMenuOptions: boolean = false;
  selectedDocumentIndex: any;
  percentDone: any = "";
  percentValue: any = 0;
  uploadStarted: boolean = false;
  isDeleteProgress: boolean = false;
  isPreviewPdf: boolean = false;
  showPreview: boolean = false;
  urlSafe: SafeResourceUrl ="";
  documentToShare: any[] = [];
  uploadedFileName: any = "";

  constructor(public router: Router,
    private _teleConsultService:TeleConsultService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    public _constant: ConstantsService,
    private medicalDocumentService: MedicalDocumentService,
    private renderer: Renderer2,
    private sanitizer: DomSanitizer
  ) { 
  }

  ngOnInit() {
    this.userData = JSON.parse(this._constant.aesDecryption('userData'));
    this.viewAllDocuments();

    this.subscription = this.authService.on('newFile-Name').subscribe(() => this.uploadFileToServer());
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
          console.log(data);
          this._constant.medicalDocumentsList = data;
          console.log(this._constant.medicalDocumentsList);

          this._constant.medicalDocumentsList.forEach(function(value) {
            value['is_checked'] = false;
          });

          console.log(this._constant.medicalDocumentsList);

          if (this.router.url != '/medical') {
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
        console.log("file fetching completed");
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
      // this.files.push(element);
      
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
      // this.files.push(element);
      
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
    console.log(this.files[0]);
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
    if (this.router.url != '/medical') {
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
              console.log(data);
              if (data.type === HttpEventType["UploadProgress"]) {
                const percentDone = Math.round(
                  (100 * data.loaded) / data.total
                );
                this.percentValue = percentDone;
                this.percentDone = `Uploading ${this.percentValue}%`;
                //console.log(`File is ${this.percentValue}% uploaded.`);
                return;
              }else if (data instanceof HttpResponse) {
                console.log(data);
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
        } else {
          this.showSnackBar("Sorry something went wrong", "error");
        }
      });
    }else{
      this.medicalDocumentService.uploadFiles(formData).subscribe(
        async (data)=>{
          console.log(data);
          if (data.type === HttpEventType["UploadProgress"]) {
            const percentDone = Math.round(
              (100 * data.loaded) / data.total
            );
            this.percentValue = percentDone;
            this.percentDone = `Uploading ${this.percentValue}%`;
            //console.log(`File is ${this.percentValue}% uploaded.`);
            return;
          }else if (data instanceof HttpResponse) {
            console.log(data);
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
      if(extension == ".pdf"){
        this.isPreviewPdf = true;
        this.urlSafe ="";
        this.transform();
      }else{
        this.isPreviewPdf = false;
      }
    }
  }

  transform() {
    if(this.vaptEnabled){
      console.log(this.documentSelected.document_link);     
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
      console.log(this.documentSelected.document_link);
      const splitUrl = this.documentSelected.document_link.split("//");
      console.log(`https://${splitUrl[1]}`);
      this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(`https://${splitUrl[1]}`);
      console.log(this.urlSafe);
    }
  }

  onClosePreviewClick(){
    this.showPreview = false;
  }

  // Move back to menu on close button
  showTeleDashboard(): void{
    this.router.navigate(['/teleconsultation']);
  }

  onSelectDocument(value: any): any{
    if (this._constant.documentToShare.includes(value)) {
      this._constant.documentToShare.splice(this._constant.documentToShare.indexOf(value), 1);
    }else{
      this._constant.documentToShare.push(value);
    }
    this.medicalDocumentService.selectedDocumentedId(this._constant.documentToShare);
  }
}

interface ListFilesObj{
  ihl_user_id : string;
  request_from : string;
}

interface DeleteDocumentObj{
  ihl_user_id : string;
  document_id : Array<any>;
}