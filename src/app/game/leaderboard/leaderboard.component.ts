import {Component, OnInit} from '@angular/core';
import {LeaderboardService, TopPlayer} from "./leaderboard.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss']
})
export class LeaderboardComponent implements OnInit {
  players: Observable<TopPlayer[]>;

  constructor(public leaderboardService: LeaderboardService) {
    this.players = leaderboardService.getLeaders();

  }

  ngOnInit() {
  }
}
