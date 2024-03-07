import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

  files = [{name: "hello.pdf", extension: "pdf"}]
  constructor() { }

  ngOnInit() {
  }

}
