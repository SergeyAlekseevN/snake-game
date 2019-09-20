import * as p5 from "p5";
import {GameSprite} from "./sprites/game.sprite";
import {Snake} from "./sprites/snake.sprite";
import {Food} from "./sprites/food.sprite";

export class GameController extends GameSprite {
  constructor(
    public p: p5,
    public snake: Snake,
    public food: Food
  ) {
    super(p);
    food.setNewPlace();
  }

  update(): void {
    if (this.snake.eat(this.food.food)) {
      this.food.setNewPlace();
    }
  }

  draw(): void {
    // draw nothing, only control
  }
}
