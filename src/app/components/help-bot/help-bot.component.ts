import { Component, OnInit, HostListener } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-help-bot',
  templateUrl: './help-bot.component.html',
  styleUrls: ['./help-bot.component.css']
})
export class HelpBotComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.authService.isLoggedIn().subscribe(data => {
      if(!data["success"]){
        this.router.navigate(['verify'])
      }
      
    })
  }

}
