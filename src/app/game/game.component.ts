import {Component, OnDestroy} from '@angular/core';
import * as p5 from 'p5';


@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnDestroy {
  isGameStarted = false;
  score: number = 570;

  startGame() {
    this.isGameStarted = true;
    // noinspection JSPotentiallyInvalidConstructorUsage

  }

  stopGame() {
    if (this.p5 !== undefined) {
      this.p5.noCanvas();
    }
  }

  ngOnDestroy(): void {
    this.stopGame();
  }

  // noinspection LocalVariableNamingConventionJS
  private p5: p5;
  private origin = {x: 0, y: 0};
  private toggle = true;

  constructor() {
    // window.onresize = this.onWindowResize.bind(this);
  }

  // private onWindowResize($event) {
  //   this.p5.resizeCanvas(this.p5.windowWidth, this.p5.windowHeight);
  // }

  private drawing(p: any): any {
    p.setup = () => {
      p.createCanvas(800, 800).parent('playground');
      p.background(0);
    };

    p.draw = () => {
      const center = {
        x: p.width / 2,
        y: p.height / 2
      };

      p.background(51);

      p.fill(255);
      p.noStroke();
      p.textSize(50);
      let text = "Snake <?>";
      p.text(text, center.x++, center.y);
    };
  }

  initCanvas() {
    if (this.p5 !== undefined) {
      this.p5.noCanvas();
    }
    this.p5 = new p5(this.drawing);
  }
}
