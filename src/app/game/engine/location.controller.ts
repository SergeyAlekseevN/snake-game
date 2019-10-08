import {GameSettings} from "./game.settings";
import * as p5 from "p5";
import {Vector} from "p5";

export class LocationController {
  private locations: Map<string, boolean> = new Map();

  constructor(public p: p5, public settings: GameSettings) {
  }

  public set(x: number, y: number): void {
    this.locations.set(`${x}:${y}`, true);
  }

  public unset(x: number, y: number): void {
    this.locations.delete(`${x}:${y}`);
  }

  public hasSet(x: number, y: number): boolean {
    if (this.locations.has(`${x}:${y}`)) {
      return this.locations.get(`${x}:${y}`);
    }
    return false;
  }

  public getRandomFreeCell(): Vector {
    const p = this.p;
    let newCoord;
    do {
      newCoord = p.createVector(p.floor(p.random(this.settings.cols)), p.floor(p.random(this.settings.rows)));
      this.set(newCoord.x, newCoord.y);
    } while (this.hasSet(newCoord.x, newCoord.y));
    return newCoord;
  }

}
