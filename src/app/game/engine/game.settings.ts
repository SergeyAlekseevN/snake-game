import {Direction} from "./direction.enum";

export class GameSettings {
  public scaleX: number = 64;
  public scaleY: number = 64;

  constructor(
    public width: number,
    public height: number,
    public rows: number,
    public cols: number,
    public fps: number,
    public snakeSettings?: SnakeSettings
  ) {
    if (this.snakeSettings === undefined || this.snakeSettings === null) {
      this.snakeSettings = new SnakeSettings(4, Math.floor(cols / 2), Math.floor(rows / 2), Direction.RIGHT);
    }
  }
}

export class SnakeSettings {
  constructor(
    public length: number,
    public x: number,
    public y: number,
    public direction: Direction
  ) {

  }
}
