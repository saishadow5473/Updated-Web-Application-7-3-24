import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-stats-card',
  templateUrl: './stats-card.component.html',
  styleUrls: ['./stats-card.component.css']
})
export class StatsCardComponent implements OnInit {
  @Input() title: string
  @Input() value: string
  @Input() color: string
  @Input() icon: string

  bounce = false
  constructor() { }

  ngOnInit() {
    this.doAnimations()
  }

  doAnimations(){
    if(this.icon == "fa-heart"){
      this.bounce = true
    }
  }

}
