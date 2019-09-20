import {Component, OnDestroy, OnInit} from '@angular/core';
import * as P5 from 'p5';
import {GameSettings} from "./game.settings";
import {Snake} from "./sprites/snake.sprite";
import {Playground} from "./sprites/playground.sprite";
import {GameSprite} from "./sprites/game.sprite";
import {GameController} from "./game.controller";
import {Food} from "./sprites/food.sprite";


@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnDestroy, OnInit {
  private p: P5;
  private isGameStarted: boolean;
  private score: number;

  private playground: Playground;
  private snake: Snake;
  private readonly settings: GameSettings;

  constructor() {
    this.settings = new GameSettings(800, 800, 25, 24);
  }

  ngOnInit(): void {
    // this.startGame();
  }

  ngOnDestroy(): void {
    this.stopGame();
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

    let sprites: GameSprite[] = [];
    this.p = new P5((p: P5) => {
        p.setup = (): void => {
          p.createCanvas(this.settings.width + 1, this.settings.height + 1).parent('canvas');
          p.frameRate(this.settings.fps);
          p.noCursor();
        };

        p.draw = (): void => {
          sprites.forEach(sprite => sprite.updateSprite());
          sprites.forEach(sprite => sprite.drawSprite());

          // show fps
          p.fill(p.color('orange'));
          const size = this.settings.scale / 2;
          p.textSize(size);
          p.text("fps " + p.frameRate(), 0, size);
        };

        p.keyPressed = (): void => {
          this.snake.keyPressed(p.keyCode);
        };
      }
    );

    this.playground = new Playground(this.p, this.settings);
    this.snake = new Snake(this.p, this.settings);
    const food = new Food(this.p, this.settings);
    let controller = new GameController(this.p, this.snake, food);
    sprites.push(
      this.playground,
      this.snake,
      food,
      controller
    );
  }
}
