import * as p5 from "p5";
import {Vector} from "p5";
import {GameSprite} from "./game.sprite";
import {GameSettings} from "../game.settings";

/**
 * Еда.
 */
export class Food extends GameSprite {
  public coord: Vector;

  constructor(p: p5, public settings: GameSettings) {
    super(p);
  }

  draw(p: p5): void {
    p.fill('red');
    p.rect(this.coord.x, this.coord.y, this.settings.scale, this.settings.scale);
  }

  update(p: p5): void {
    // only self-update.
  }

  putOnNewPlace(newPlace: Vector): void {
    this.coord = newPlace;
  }
}
