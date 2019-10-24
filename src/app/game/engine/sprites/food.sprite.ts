import * as p5 from "p5";
import {Vector} from "p5";
import {GameSprite} from "./game.sprite";
import {GameSettings} from "../game.settings";
import {LocationController} from "../location.controller";

/**
 * Еда.
 */
export class Food extends GameSprite {
  public coord: Vector;
  public icon: string = '🍎';
  public text: string = '';

  constructor(p: p5, public settings: GameSettings, public locationController: LocationController) {
    super(p);
  }

  draw(p: p5): void {
    const scaleX = this.settings.scaleX;
    const scaleY = this.settings.scaleY;
    const y = this.coord.y;
    const x = this.coord.x;
    p.textSize(scaleY);
    p.textAlign(p.CENTER);
    p.text(this.icon, x * scaleX + 4, y * scaleY + 4, scaleX, scaleY);
  }

  update(p: p5): void {
    // only self-update.
  }

  putOnNewPlace(newPlace: Vector): void {
    if (this.coord !== undefined) {
      this.locationController.unset(this.coord.x, this.coord.y);
    }
    this.locationController.set(newPlace.x, newPlace.y);
    this.coord = newPlace;
  }
}
