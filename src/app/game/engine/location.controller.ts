import {GameSettings} from "./game.settings";
import * as p5 from "p5";
import {Vector} from "p5";

export class LocationController {
  private locations: Set<string> = new Set<string>();

  constructor(public p: p5, public settings: GameSettings) {
  }

  public set(x: number, y: number): void {
    this.locations.add(`${x}:${y}`);
  }

  public unset(x: number, y: number): void {
    this.locations.delete(`${x}:${y}`);
  }

  public hasSet(x: number, y: number): boolean {
    return this.locations.has(`${x}:${y}`);
  }

  public getRandomFreeCell(): Vector {
    const p = this.p;
    let newCoord;
    do {
      newCoord = p.createVector(p.floor(p.random(this.settings.cols)), p.floor(p.random(this.settings.rows)));
    } while (this.hasSet(newCoord.x, newCoord.y));
    return newCoord;
  }
}
