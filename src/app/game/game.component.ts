import {Component, OnDestroy, OnInit} from '@angular/core';
import * as P5 from 'p5';
import {Playground} from "./playground";


@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnDestroy, OnInit {
  private p: P5;
  private isGameStarted: boolean;
  private score: number;

  constructor() {
    this.isGameStarted = false;
    this.score = 570;
  }

  ngOnInit(): void {
    this.startGame();
  }

  ngOnDestroy(): void {
    this.stopGame();
  }

  startGame() {
    this.initCanvas();
    this.isGameStarted = true;
  }

  stopGame() {
    if (this.p !== undefined) {
      this.p.noCanvas();
    }
  }

  initCanvas() {
    if (this.p !== undefined) {
      this.p.noCanvas();
    }
    this.p = new P5(Playground);
  }
}
