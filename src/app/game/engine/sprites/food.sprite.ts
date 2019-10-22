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
  public shape: Shape = Shape.square;
  public color: Color = Color.RED;

  constructor(p: p5, public settings: GameSettings, public locationController: LocationController) {
    super(p);
  }

  draw(p: p5): void {
    if (this.color === Color.RED) {
      p.fill('red');
    } else if (this.color === Color.BLUE) {
      p.fill('blue');
    } else if (this.color === Color.YELLOW) {
      p.fill('yellow');
    } else if (this.color === Color.GREEN) {
      p.fill('green')
    } else {
      console.log("color for food not set");
      p.fill('black');
    }

    const scaleX = this.settings.scaleX;
    const scaleY = this.settings.scaleY;
    const y = this.coord.y;
    const x = this.coord.x;

    if (this.shape === Shape.square) {
      p.rect(x * scaleX, y * scaleY, scaleX, scaleY);
    } else if (this.shape === Shape.circle) {
      p.ellipse(x * scaleX + Math.floor(scaleX / 2), y * scaleY + Math.floor(scaleY / 2), scaleX, scaleY);
    } else if (this.shape === Shape.triangle) {
      p.triangle(
        //up
        x * scaleX + Math.floor(scaleX / 2),
        y * scaleY,
        //left
        x * scaleX,
        y * scaleY + scaleY,

        //right
        x * scaleX + scaleX,
        y * scaleY + scaleY
      )
    } else if (this.shape === Shape.cross) {
      //vertical
      p.rect(
        x * scaleX + Math.floor(scaleX / 4),
        y * scaleY,
        scaleX - Math.floor(scaleX / 2),
        scaleY
      );

      //horizontal
      p.rect(
        x * scaleX,
        y * scaleY + Math.floor(scaleY / 4),
        scaleX,
        scaleY - Math.floor(scaleY / 2)
      );
    } else {
      console.log(`shape= ${this.shape} color=${this.color}`)
    }
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

export enum Color {
  RED,
  BLUE,
  GREEN,
  YELLOW
}

export enum Shape {
  square,
  triangle,
  circle,
  cross
}
