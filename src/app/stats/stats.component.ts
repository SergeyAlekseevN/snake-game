import {Component, OnInit} from '@angular/core';
import {ResultsService} from "./results.service";
import {Observable} from "rxjs";
import {Player} from "../db/player.model";
import {Angular2CsvService} from "angular2-csv";

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit {
  bestScore: Observable<number>;
  worstScore: Observable<number>;
  totalGames: Observable<number>;
  totalPlayers: Observable<number>;
  playerWithMaxGameCount: Observable<Player>;
  allPlayers: Observable<Player[]>;

  constructor(public results: ResultsService, private csv: Angular2CsvService) {
    this.bestScore = results.getBestScore();
    this.worstScore = results.getWorstScore();
    this.totalGames = results.getTotalGames();
    this.totalPlayers = results.getTotalPlayers();
    this.playerWithMaxGameCount = results.getPlayerWithMaxGameCount();
    this.allPlayers = results.getAllPlayers();
  }

  ngOnInit() {
  }

  options = {
    showTitle: true,
    title: "Игроки со стенда OK.TECH на конференции Joker<?> 2019",
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    useBom: true,
    removeNewLines: false,
    showLabels: true,
    headers: ['имя', 'телефон', 'количество игр', 'лучший результат'],
    keys: ['name', 'phone', 'gameCount', 'bestScore']
  };
}
