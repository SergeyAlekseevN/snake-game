import * as p5 from "p5";
import {Vector} from "p5";
import {GameSprite} from "./game.sprite";
import {GameSettings} from "../game.settings";

/**
 * Змейка.
 */
export class Snake extends GameSprite {
  private x = 0;
  private y = 0;
  private xSpeed = 1;
  private ySpeed = 0;
  private total = 0;
  private tail = [];

  constructor(public p: p5, public settings: GameSettings) {
    super(p);
  }

  update(p: p5) {
    this.checkSelfCollision();
    this.move();
  }

  draw(p: p5): void {
    const scale = this.settings.scale;

    // head
    p.fill(p.color('blue'));
    p.rect(this.x, this.y, scale, scale);

    // tail
    p.fill(p.color('green'));
    for (let i = 0; i < this.total; i++) {
      p.rect(this.tail[i].x, this.tail[i].y, scale, scale);
    }
  }

  move() {
    const scale = this.settings.scale;
    const width = this.settings.width;
    const height = this.settings.height;

    if (this.total === this.tail.length) {
      for (let i = 0; i < this.tail.length - 1; i++) {
        this.tail[i] = this.tail[i + 1];
      }
    }
    this.tail.unshift(this.p.createVector(this.x, this.y));
    this.x += this.xSpeed * scale;
    this.y += this.ySpeed * scale;

    this.x = this.p.constrain(this.x, 0, width - scale);
    this.y = this.p.constrain(this.y, 0, height - scale);
  }

  setDirection(x: number, y: number) {
    this.xSpeed = x;
    this.ySpeed = y;
  }

  eat(pos) {
    console.log("x=" + this.x + "; y=" + this.y + ";");
    let d = this.p.dist(this.x, this.y, pos.x, pos.y);
    if (d < 1) {
      this.total++;

      return true;
    } else {
      return false;
    }
  }

  checkSelfCollision() {
    for (let i = 0; i < this.tail.length; i++) {
      let pos: Vector = this.tail[i];
      let distance = this.p.dist(this.x, this.y, pos.x, pos.y);
      if (distance < 1) {
        this.total = 0;
        this.tail = [];
      }
    }
  }

  keyPressed(keyCode: number) {
    if (this.p.keyCode === this.p.UP_ARROW) {
      this.setDirection(0, -1);
    } else if (this.p.keyCode === this.p.DOWN_ARROW) {
      this.setDirection(0, 1);
    } else if (this.p.keyCode === this.p.RIGHT_ARROW) {
      this.setDirection(1, 0);
    } else if (this.p.keyCode === this.p.LEFT_ARROW) {
      this.setDirection(-1, 0);
    }
  }
}
