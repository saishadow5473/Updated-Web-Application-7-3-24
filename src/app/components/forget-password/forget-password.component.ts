import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceLogin } from '../../services/auth.service.login';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '../../models/user';
import { ConstantsService } from 'src/app/services/constants.service';


@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {
  userModal = new User();
  isLoading: boolean = false;
  mailStatus: string = '';
  mailSent: boolean = false;
  vaptEnabled = this._constants.vaptEnabled;
  apiKey: string = '';

  constructor(
    private router: Router,
    private authService: AuthServiceLogin,
    private snackBar: MatSnackBar,
    private _constants: ConstantsService
  ) { }

  ngOnInit() {
    if(this.vaptEnabled){
      this.isLoading = false;
      if(localStorage.getItem("api_header_token") != undefined){
        this.apiKey = localStorage.getItem("api_header_token");
      } else {
        this.authService.getAPItokenKeyForVapt().subscribe(data => {
          this.apiKey = data["ApiKey"];
          localStorage.setItem("api_header_token", this.apiKey);
        });
      }
    }else{
      this.isLoading = false;
    }
  }

  onForgotPasswordSubmit() {
    if(this.vaptEnabled){
      this.isLoading = true;
      this.authService.getCToken(this.apiKey).subscribe(res => {
        if ('token' in res) {
          let CToken = res.token;
          this.authService.forgotPasswordForVapt(this.userModal['email'], CToken).subscribe(data => {
            this.isLoading = false;
            if (data == 'success') {
              this.mailStatus = 'We have sent the new password to your registered email';
              this.mailSent = true;
            }
            else if (data == "status = reached daily limit , daily_upload_count = 10") {
              this.mailStatus = "Reached daily limit, Can change password only 10 times per day";
              this.mailSent = false;
            }
            else {
              this.mailStatus = "Email doesn't exist.Please enter the registered email";
              this.mailSent = false;
            }
      
            setTimeout(() => {
                this.mailStatus = '';
                if (data == 'success')
                  this.showLoginPage();
            }, 8000);
          })
        } else {
          this.isLoading = false;
          this.mailStatus = "Unable to connect to the server.. Please login again";
          this.mailSent = false;
        }
      });
    }else{
      this.isLoading = true;
      this.authService.forgotPassword(this.userModal['email']).subscribe(data => {
        this.isLoading = false;
        if (data == 'success') {
          this.mailStatus = 'We have sent the new password to your registered email';
          this.mailSent = true;
        }
        else {
          this.mailStatus = "Email doesn't exist.Please enter the registered email";
          this.mailSent = false;
        }

        setTimeout(() => {
            this.mailStatus = '';
            if (data == 'success')
              this.showLoginPage();
        }, 8000);
      })
    }
  }

  showLoginPage() {
    this.router.navigate(['']);
  }
}
