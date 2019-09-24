import {AfterContentInit, Component, OnDestroy, OnInit} from '@angular/core';
import * as P5 from 'p5';
import {GameSettings} from "./game.settings";
import {GameController} from "./game.controller";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnDestroy, OnInit, AfterContentInit {
  private p: P5;
  private isGameStarted: boolean;
  private score: number;
  private readonly settings: GameSettings;
  private roundTime: number;
  private game: GameController;

  constructor() {
    this.settings = new GameSettings(800, 800, 80, 10);
  }

  ngOnInit(): void {
    console.log('oninit')
  }

  ngOnDestroy(): void {
    this.stopGame();
  }

  ngAfterContentInit(): void {
    this.startGame();
  }

  startGame() {
    this.score = 0;
    this.isGameStarted = true;
    this.initCanvas();
  }

  stopGame() {
    this.isGameStarted = false;
    if (this.p !== undefined) {
      this.p.noCanvas();
    }
  }

  initCanvas() {
    if (this.p !== undefined) {
      this.p.noCanvas();
    }

    this.p = new P5((p: P5) => {
        p.setup = (): void => {
          p.createCanvas(this.settings.width + 1, this.settings.height + 1).parent('canvas');
          p.frameRate(this.settings.fps);
          p.noCursor();
        };

        p.draw = (): void => {
          this.game.update(p);
          this.score = this.game.score;
          this.game.draw(p);

          // show fps
          p.fill(p.color('orange'));
          const size = this.settings.scale / 2;
          p.textSize(size);
          p.text("fps " + p.frameRate(), 0, size);
        };

        p.keyPressed = (): void => {
          this.game.keyPressed(p.keyCode);
        };
      }
    );
    this.game = new GameController(this.p, this.settings);
  }
}
