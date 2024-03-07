import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-leaderboard-card',
  templateUrl: './leaderboard-card.component.html',
  styleUrls: ['./leaderboard-card.component.css']
})
export class LeaderboardCardComponent implements OnInit {
 @Input() name: string
 @Input() points: string
  constructor() { }

  ngOnInit() {
  }

}
