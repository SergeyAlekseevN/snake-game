import * as p5 from "p5";
import {GameSprite} from "./sprites/game.sprite";
import {Snake} from "./sprites/snake.sprite";
import {Food} from "./sprites/food.sprite";
import {Playground} from "./sprites/playground.sprite";
import {GameSettings} from "./game.settings";
import {Direction} from "./direction.enum";
import {LocationController} from "./location.controller";

export class GameController extends GameSprite {
  private readonly locationController: LocationController;
  private readonly snake: Snake;
  private readonly food: Food;
  private readonly playground: Playground;

  score: number = 0;
  private isPaused: boolean = true;
  private readonly actionLogger: (message: string) => void;

  constructor(public p: p5, public settings: GameSettings, actionHandler: (message: string) => void) {
    super(p);
    console.log("constructor of game controller");
    this.actionLogger = actionHandler;
    this.locationController = new LocationController(p, settings);
    this.playground = new Playground(this.p, this.settings);
    this.snake = new Snake(this.p, this.settings, this.locationController);
    this.snake.initSnake(4, p.createVector(4, 0));

    this.food = new Food(this.p, this.settings, this.locationController);
    this.food.putOnNewPlace(this.locationController.getRandomFreeCell());
  }

  update(p: p5): void {
    if (this.isPaused) {
      if (this.snake.isFoodEaten(this.food.coord)) {
        this.snake.growUp();
        this.actionLogger("Съели правильную еду.");
        this.score++;
        this.food.putOnNewPlace(this.locationController.getRandomFreeCell());
        this.food.setRandomFreeSkin();
      }
      this.snake.update(p);
    }
  }

  draw(p: p5): void {
    this.playground.draw(p);
    this.food.draw(p);
    this.snake.draw(p);
  }

  keyPressed(keyCode: number) {
    console.log("keyCode:" + keyCode);
    if (keyCode === this.p.UP_ARROW) {
      this.snake.setDirection(Direction.UP);
    } else if (keyCode === this.p.DOWN_ARROW) {
      this.snake.setDirection(Direction.DOWN);
    } else if (keyCode === this.p.RIGHT_ARROW) {
      this.snake.setDirection(Direction.RIGHT);
    } else if (keyCode === this.p.LEFT_ARROW) {
      this.snake.setDirection(Direction.LEFT);
    } else if (keyCode === 32) { // space key
      this.isPaused = !this.isPaused;
    }
  }
}
