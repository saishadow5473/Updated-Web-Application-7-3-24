import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-social-login',
  templateUrl: './social-login.component.html',
  styleUrls: ['./social-login.component.css']
})
export class SocialLoginComponent implements OnInit {
  username: string
  token: string
  constructor(private router: Router, private route: ActivatedRoute, private authService: AuthService) { }
  
  ngOnInit() {
    
    setTimeout(() => {
      this.router.navigate(['dashboard'])
    },1500)
  
  }
}
