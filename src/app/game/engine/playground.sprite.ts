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
    const scale = this.settings.scale;
    const height = this.settings.height;
    const width = this.settings.width;

    p.background('white');

    //клетки поля.
    p.strokeWeight(0.1);
    for (let i = 0; i <= width / scale; i++) {
      p.line(i * scale, 0, i * scale, height)
    }
    for (let i = 0; i <= height / scale; i++) {
      p.line(0, scale * i, width, scale * i)
    }
  };
}
