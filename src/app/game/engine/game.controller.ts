import * as p5 from "p5";
import {GameSprite} from "./sprites/game.sprite";
import {Snake} from "./sprites/snake.sprite";
import {Food} from "./sprites/food.sprite";
import {Playground} from "./sprites/playground.sprite";
import {GameSettings} from "./game.settings";
import {Direction} from "./direction.enum";
import {LocationController} from "./location.controller";
import {SkinsController} from "./skins.controller";

export class GameController extends GameSprite {
  private readonly locationController: LocationController;
  private readonly skinsController: SkinsController;
  private readonly snake: Snake;
  private readonly foods: Food[] = [];
  private readonly playground: Playground;

  score: number = 0;
  private isPaused: boolean = true;
  private readonly actionLogger: (message: string) => void;

  constructor(public p: p5, public settings: GameSettings, actionHandler: (message: string) => void) {
    super(p);
    console.log("constructor of game controller");
    this.actionLogger = actionHandler;
    this.locationController = new LocationController(p, settings);
    this.skinsController = new SkinsController(p, settings);
    this.playground = new Playground(this.p, this.settings);
    this.snake = new Snake(this.p, this.settings, this.locationController);
    this.snake.initSnake(4, p.createVector(4, 0));

    this.loadFood(7);

  }

  loadFood(count: number) {
    for (let i = 0; i < 10; i++) {
      let food = new Food(this.p, this.settings, this.locationController);
      food.putOnNewPlace(this.locationController.getRandomFreeCell());
      const randomFreeSkin = this.skinsController.getRandomFreeSkin(food);
      food.color = randomFreeSkin.color;
      food.shape = randomFreeSkin.shape;
      this.foods.push(food);
    }
  }

  update(p: p5): void {
    if (this.isPaused) {
      const foods = this.foods.filter((food, index) => this.snake.isFoodEaten(food.coord));

      if (foods.length > 0) {
        this.snake.growUp();
        this.actionLogger("Съели правильную еду.");
        this.score++;

        foods[0].putOnNewPlace(this.locationController.getRandomFreeCell());
        const randomFreeSkin = this.skinsController.getRandomFreeSkin(foods[0]);
        foods[0].color = randomFreeSkin.color;
        foods[0].shape = randomFreeSkin.shape;
      }
      this.snake.update(p);
    }
  }

  draw(p: p5): void {
    this.playground.draw(p);
    this.foods.forEach((food, index) => food.draw(p));
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
