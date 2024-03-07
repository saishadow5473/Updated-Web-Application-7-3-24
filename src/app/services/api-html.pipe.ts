import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'apiHtml'
})
export class ApiHtmlPipe implements PipeTransform {

	constructor(private sanitizer:DomSanitizer) {}

  transform(apiHtml): any {
    return this.sanitizer.bypassSecurityTrustHtml(apiHtml);
  }

}
