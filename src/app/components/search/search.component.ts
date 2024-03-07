import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  id: string
  user: any
  badges: any
  constructor(private route: ActivatedRoute, private authService: AuthService) { }
  
  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');

    /* this.authService.fetchUser(this.id).subscribe(data=> {
      if(data["success"]){
        this.user = data["user"]
        console.log(this.user);
        
      }
    }) */

    this.badges = []
    this.authService.fetchBadge(this.authService.getUser()).subscribe(data=> {
      
      this.badges = data["badges"]
    
    })
  }


  fetchBadge(badge){
    this.badges = []
    this.authService.fetchBadge(badge).subscribe(data => {
      this.badges = data["badges"]
    })
  }

}
