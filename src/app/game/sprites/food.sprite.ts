import * as p5 from "p5";
import {Vector} from "p5";
import {GameSprite} from "./game.sprite";
import {GameSettings} from "../game.settings";

/**
 * Еда.
 */
export class Food extends GameSprite {
  public food: Vector;

  constructor(p: p5, public settings: GameSettings) {
    super(p);
  }

  draw(p: p5): void {
    p.fill('red');
    p.rect(this.food.x, this.food.y, this.settings.scale, this.settings.scale);
  }

  update(p: p5): void {
    // only self-update.
  }

  setNewPlace(): void {
    const p = this.p;
    const scale = this.settings.scale;
    const height = this.settings.height;
    const width = this.settings.width;

    let cols = p.floor(width / scale);
    let rows = p.floor(height / scale);

    this.food = p.createVector(p.floor(p.random(cols)), p.floor(p.random(rows)));
    this.food.mult(scale);
  }
}
