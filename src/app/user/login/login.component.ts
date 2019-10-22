import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../auth/auth.service";
import {GameService} from "../../game/game.service";
import {Game} from "../../db/game.model";
import {Observable} from "rxjs";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  games: Observable<Game[]>;

  constructor(public auth: AuthService, public gameService: GameService) {
    this.games = gameService.onlineGames();
  }

  ngOnInit() {
  }
}
