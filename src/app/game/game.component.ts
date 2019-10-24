import {AfterContentInit, AfterViewInit, Component, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import * as P5 from 'p5';
import * as p5 from 'p5';
import {GameSettings} from "./engine/game.settings";
import {GameController} from "./engine/game.controller";
import {GameService} from "./game.service";
import {Player} from "../db/player.model";
import {Observable} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {RulesComponent} from "./rules/rules.component";
import {TimerComponent} from "./timer.component";

export interface Action {
  message: string;
  points: string;
  color: string;
  index: number;
}

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnDestroy, OnInit, AfterContentInit, AfterViewInit {
  @ViewChild(TimerComponent, {static: false}) timerComponent: TimerComponent;

  private readonly settings: GameSettings;

  private readonly actionsCapacity = 10;

  readonly roundTime: number = 140;
  gameStarted = false;
  private isInitedComponent = false;

  private game: GameController;
  player: Observable<Player>;

  p: P5;
  actions: Action[] = [];
  score: number = 0;


  lives: number = 0;
  topic: string;
  actionCounter: number = 0;

  constructor(
    public dialog: MatDialog,
    public gameService: GameService
  ) {
    console.log("game.component -> constructor");
    this.settings = new GameSettings(800, 800, 32, 32, 6);
    this.player = this.gameService.getCurrentPlayer();
  }

  actionHandler = (message: string, color: string, points: string) => {
    this.actionCounter++;
    this.actions.push({index: this.actionCounter, message, color, points});
    if (this.actions.length > this.actionsCapacity) {
      this.actions.shift();
    }
  };

  startGame() {
    this.gameStarted = true;
    this.timerComponent.start();
  }

  stopGame() {
    // TODO: 24.10.2019 Sergey Alekseev: show end modal widnow
    this.gameStarted = false;
    this.gameService.stopGameSession(this.score)
      .then(() => console.log("current game stopped"))
      .catch(reason => console.warn(`Error with stopping current game. ${reason}`));
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(RulesComponent, {
      disableClose: true,
      height: `${window.innerHeight / 4}`,
      width: `${window.innerWidth / 4}`,
      data: {player: this.player}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Start Game!!!');
      this.startGame();
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    console.log(`game.component -> onResize ${event.target.innerWidth} x ${event.target.innerHeight}`);
    this.resize(event.target.innerWidth, event.target.innerHeight);
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeUnload(event) {
    this.ngOnDestroy();
    event.stopPropagation();
  }

  ngOnInit(): void {
    console.log('game.component -> onInit');
    this.openDialog();
  }

  ngOnDestroy(): void {
    this.stopGame();
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
    this.isInitedComponent = true;
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
          if (this.game === undefined || this.isInitedComponent == false) {
            console.warn("p -> game not initialized!");
          } else {
            this.game.update(p);
            this.score = this.game.score;
            this.topic = this.game.topic;
            this.lives = this.game.lives;
            this.game.draw(p);
          }

          // show fps
          // showFps.call(this, p);
        };

        p.keyPressed = (): void => {
          if (this.gameStarted) {
            console.log(`p -> key pressed ${p.keyCode}`);
            this.game.keyPressed(p.keyCode);
          }
        };

        p.mouseClicked = () => {
          // console.log(`p -> mouse clicked at ${p.mouseX}:${p.mouseY}`)
        };
      }
    );
    this.resize(window.innerWidth, window.innerHeight);
  }
}
