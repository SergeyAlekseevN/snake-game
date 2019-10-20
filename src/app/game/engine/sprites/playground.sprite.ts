import * as p5 from 'p5';
import {GameSprite} from "./game.sprite";
import {GameSettings} from "../game.settings";

/**
 * Игровая площадка.
 */
export class Playground extends GameSprite {
  constructor(p: p5, public settings: GameSettings) {
    super(p);
  }

  update(): void {
  }

  draw(p: p5) {
    const cols = this.settings.cols;
    const rows = this.settings.rows;

    const scaleX = this.settings.scaleX;
    const scaleY = this.settings.scaleY;

    const width = this.settings.width;
    const height = this.settings.height;

    p.background('white');

    //клетки поля.
    p.strokeWeight(0.1);
    for (let col = 0; col <= cols; col++) {
      p.line(col * scaleX, 0, col * scaleX, height)
    }
    for (let row = 0; row <= rows; row++) {
      p.line(0, scaleY * row, width, scaleY * row)
    }
  }
}
