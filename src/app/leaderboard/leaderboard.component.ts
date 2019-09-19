import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss']
})
export class LeaderboardComponent implements OnInit {

  results = [
    {
      name: "Сергей",
      score: 2342
    },
    {
      name: "Василий",
      score: 1234
    },
    {
      name: "Дмитрий",
      score: 957
    }
  ]

  constructor() {
  }

  ngOnInit() {

  }
}
