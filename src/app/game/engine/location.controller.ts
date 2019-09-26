import {GameSettings} from "./game.settings";
import * as p5 from "p5";
import {Vector} from "p5";

export class LocationController {
  private locations: Map<string, boolean> = new Map();

  constructor(public p: p5, public settings: GameSettings) {
  }

  public setRealCoord(realCoord: Vector) {
    const gameCoord = this.p.createVector(realCoord.x, realCoord.y).div(this.settings.scale);
    this.set(gameCoord.x, gameCoord.y);
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
    const scale = this.settings.scale;
    const height = this.settings.height;
    const width = this.settings.width;

    let cols = p.floor(width / scale);
    let rows = p.floor(height / scale);

    let newCoord;
    do {
      newCoord = p.createVector(p.floor(p.random(cols)), p.floor(p.random(rows)));
    } while (this.hasSet(newCoord.x, newCoord.y));

    return newCoord.mult(scale);
  }

  unsetRealCoord(realCoord: Vector) {
    const gameCoord = this.p.createVector(realCoord.x, realCoord.y).div(this.settings.scale);
    this.unset(gameCoord.x, gameCoord.y);
  }
}
