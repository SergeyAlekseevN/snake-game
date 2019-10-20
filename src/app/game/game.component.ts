import {AfterContentInit, AfterViewInit, Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import * as P5 from 'p5';
import * as p5 from 'p5';
import {GameSettings} from "./engine/game.settings";
import {GameController} from "./engine/game.controller";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnDestroy, OnInit, AfterContentInit, AfterViewInit {
  private readonly settings: GameSettings;
  private readonly actionsCapacity = 7;

  private p: P5;
  private roundTime: number;
  private game: GameController;

  actions: string[] = [];
  score: number = 0;

  actionHandler = (message: string) => {
    this.actions.push(message);
    if (this.actions.length > this.actionsCapacity) {
      this.actions.shift();
    }
  };

  constructor() {
    console.log("game.component -> constructor");
    this.settings = new GameSettings(800, 800, 32, 32, 12);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    console.log(`game.component -> onResize ${event.target.innerWidth} x ${event.target.innerHeight}`);
    this.resize(event.target.innerWidth, event.target.innerHeight);
  }

  ngOnInit(): void {
    console.log('game.component -> onInit');
  }

  ngOnDestroy(): void {
    console.log('game.component -> onDestroy');
    if (this.p !== undefined) {
      console.log("Remove p5 sketch");
      this.p.remove();
    }
  }

  ngAfterContentInit(): void {
    console.log('game.component -> afterContentInit');
  }

  ngAfterViewInit(): void {
    console.log('game.component -> afterViewInit');
    this.initCanvas();
  }

  resize(width: number, height: number) {
    console.log(`resize with ${width}x${height}`);

    if (height > width) {
      console.warn(`Неверное соотношение сторон height:${height}, width:${width}`);
      return;
    }

    this.settings.height = height - 20; //15px margin top
    this.settings.width = height - 20;

    this.settings.scaleX = Math.floor(this.settings.width / this.settings.cols);
    this.settings.scaleY = Math.floor(this.settings.height / this.settings.rows);

    //cut
    this.settings.width -= (this.settings.width % this.settings.cols);
    this.settings.height -= (this.settings.height % this.settings.rows);

    this.p.resizeCanvas(this.settings.width, this.settings.height);
  }

  initCanvas() {
    console.log("init canvas");
    if (this.p !== undefined) {
      console.log("Remove Sketch");
      this.p.remove();
      console.log("no canvas");
      this.p.noCanvas();
    }

    function showFps(p: p5) {
      p.fill(p.color('orange'));
      const size = this.settings.scaleX / 2;
      p.textSize(size);
      p.text("fps " + p.frameRate(), 0, size);
    }

    this.p = new P5((p: P5) => {
        p.preload = () => {
          console.log("p -> preload");
        };

        p.setup = (): void => {
          console.log("p -> setup");
          p.createCanvas(this.settings.width + 1, this.settings.height + 1).parent('canvas');
          p.frameRate(this.settings.fps);
          p.noCursor();
          console.log("create game controller.");
          this.game = new GameController(p, this.settings, this.actionHandler);
        };

        p.draw = (): void => {
          if (this.game === undefined) {
            console.warn("p -> game not initialized!");
          } else {
            this.game.update(p);
            this.score = this.game.score;
            this.game.draw(p);
          }

          // show fps
          // showFps.call(this, p);
        };

        p.keyPressed = (): void => {
          console.log(`p -> key pressed ${p.keyCode}`);
          this.game.keyPressed(p.keyCode);
        };

        p.mouseClicked = () => {
          console.log(`p -> mouse clicked at ${p.mouseX}:${p.mouseY}`)
        };
      }
    );
    this.resize(window.innerWidth, window.innerHeight);
  }
}
