import {Direction} from "./direction.enum";

export class GameSettings {
  constructor(
    public width: number,
    public height: number,
    public scale: number,
    public fps: number,
    public snakeSettings?: SnakeSettings
  ) {
    if (this.snakeSettings === undefined || this.snakeSettings === null) {
      this.snakeSettings = new SnakeSettings(4, width / scale / 2, height / scale / 2, Direction.RIGHT);
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
