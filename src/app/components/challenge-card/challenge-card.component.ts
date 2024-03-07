import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-challenge-card',
  templateUrl: './challenge-card.component.html',
  styleUrls: ['./challenge-card.component.css']
})
export class ChallengeCardComponent implements OnInit {
  @Input() postedBy: string
  @Input() points: string
  @Input() challenge: string
  @Input() time: string
  constructor() { }
  take = "Take challenge 👊"
  ngOnInit() {
  }

  click(){
    this.take = "Challenge Started..."
  }

}
