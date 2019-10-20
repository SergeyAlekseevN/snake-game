import {Component, OnInit} from '@angular/core';
import {LeaderboardService, Player} from "./leaderboard.service";

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss']
})
export class LeaderboardComponent implements OnInit {
  results: Player[] = [];

  constructor(public leaderboardService: LeaderboardService) {
    leaderboardService.get().subscribe(results => this.results = results);
  }

  ngOnInit() {

  }
}
