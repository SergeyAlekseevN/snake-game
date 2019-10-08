import {AfterContentInit, Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import * as P5 from 'p5';
import * as p5 from 'p5';
import {GameSettings} from "./engine/game.settings";
import {GameController} from "./engine/game.controller";

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

  private actions: string[] = [];
  private readonly actionsCapacity = 10;

  actionHandler = (message: string) => {
    this.actions.push(message);
    if (this.actions.length > this.actionsCapacity) {
      this.actions.shift();
    }
  };


  constructor() {
    this.settings = new GameSettings(800, 800, 32, 32, 12);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    console.log(`resize ${event.target.innerWidth} x ${event.target.innerHeight}`);
    this.resize(event.target.innerWidth, event.target.innerHeight);
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

  resize(width: number, height: number) {
    console.log(`resize with ${width}x${height}`);
    if (height > width) {
      this.actionHandler("Неверное соотношение сторон.")
      return;
    }
    this.settings.height = height - 15; //15px margin top
    this.settings.width = height - 15;

    this.settings.scaleX = Math.floor(this.settings.width / this.settings.cols);
    this.settings.scaleY = Math.floor(this.settings.height / this.settings.rows);

    //cut
    this.settings.width -= (this.settings.width % this.settings.cols);
    this.settings.height -= (this.settings.height % this.settings.rows);

    this.p.resizeCanvas(this.settings.width, this.settings.height);
  }

  startGame() {
    console.log("Start game");
    this.score = 0;
    this.isGameStarted = true;
    this.initCanvas();
  }

  stopGame() {
    console.log("Stop game");
    this.isGameStarted = false;
    if (this.p !== undefined) {
      this.p.noCanvas();
    }
  }

  initCanvas() {
    console.log("init canvas");
    if (this.p !== undefined) {
      this.p.noCanvas();
    }

    function showFps(p: p5) {
      p.fill(p.color('orange'));
      const size = this.settings.scaleX / 2;
      p.textSize(size);
      p.text("fps " + p.frameRate(), 0, size);
    }

    this.p = new P5((p: P5) => {
        p.setup = (): void => {
          p.createCanvas(this.settings.width + 1, this.settings.height + 1).parent('canvas');
          p.frameRate(this.settings.fps);
          p.noCursor();
          this.game = new GameController(this.p, this.settings, this.actionHandler);
        };

        p.draw = (): void => {
          this.game.update(p);
          this.score = this.game.score;
          this.game.draw(p);

          // show fps
          showFps.call(this, p);
        };

        p.keyPressed = (): void => {
          this.game.keyPressed(p.keyCode);
        };
      }
    );
  }
}
