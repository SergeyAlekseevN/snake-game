import * as p5 from "p5";
import {GameSprite} from "./sprites/game.sprite";
import {Snake} from "./sprites/snake.sprite";
import {Food} from "./sprites/food.sprite";
import {Playground} from "./sprites/playground.sprite";
import {GameSettings} from "./game.settings";
import {Direction} from "./direction.enum";
import {LocationController} from "./location.controller";
import {SkinsController} from "./skins.controller";
import {TopicsController} from "./topics.controller";

export class GameController extends GameSprite {
  private readonly locationController: LocationController;
  private readonly skinsController: SkinsController;
  private readonly snake: Snake;
  private readonly foods: Food[] = [];
  private readonly playground: Playground;

  score: number = 0;
  lives: number = 3;
  topic: string = "no topic";

  topicsController: TopicsController;
  private isNotPaused: boolean = true;
  private readonly actionLogger: (message: string, color: string, points: string) => void;
  private readonly onGameOver: (score: number) => void;

  constructor(
    public p: p5,
    public settings: GameSettings,
    actionHandler: (message: string, color: string, points: string) => void,
    onGameOver: (score: number) => void
  ) {
    super(p);
    console.log("constructor of game controller");
    this.actionLogger = actionHandler;
    this.locationController = new LocationController(p, settings);
    this.skinsController = new SkinsController(p, settings);
    this.topicsController = new TopicsController();
    this.playground = new Playground(this.p, this.settings);
    this.snake = new Snake(this.p, this.settings, this.locationController);
    this.snake.initSnake(4, p.createVector(4, 0));
    this.snake.onSelfEat = () => {
      this.score -= 3;
      this.lives -= 1;
      this.actionLogger("откусили хвост", "red", '-3');
    };
    this.onGameOver = onGameOver;
    this.loadFood(7);
    this.topicsController.initTopics();

  }

  public startGame() {
    this.topicsController.generateTopics();
  }

  public stopGame() {
    this.topicsController.stopGenerateTopics();
  }

  loadFood(count: number) {
    for (let i = 0; i < count; i++) {
      let food = new Food(this.p, this.settings, this.locationController);
      food.putOnNewPlace(this.locationController.getRandomFreeCell());
      const randomFreeSkin = this.skinsController.getRandomFreeSkin(food);
      food.color = randomFreeSkin.color;
      food.shape = randomFreeSkin.shape;
      food.text = "text";
      this.foods.push(food);
    }
  }

  update(p: p5): void {
    if (this.isNotPaused) {
      if (this.lives <= 0) {
        this.isNotPaused = false;
        this.onGameOver(this.score);
      }
      const foods = this.foods.filter((food, index) => this.snake.isFoodEaten(food.coord));

      if (foods.length > 0) {
        const eatenFood = foods[0];

        if (p.random(4) > 2/*true food*/) {// TODO: 24.10.2019 Sergey Alekseev: проверка что правильная еда
          this.actionLogger(`${eatenFood.text}`, 'green', '+1');
          this.score++;
        } else {
          this.actionLogger(`${eatenFood.text}`, 'red', '-1');
          this.score--
        }

        this.snake.growUp();

        eatenFood.putOnNewPlace(this.locationController.getRandomFreeCell());
        const randomFreeSkin = this.skinsController.getRandomFreeSkin(eatenFood);
        eatenFood.color = randomFreeSkin.color;
        eatenFood.shape = randomFreeSkin.shape;
      }
      this.snake.update(p);
      this.topic = this.topicsController.getCurrentTopic().name;
    }
  }

  draw(p: p5): void {
    if (p.keyIsDown(32)) {
      p.frameRate(this.settings.fps * 3);
    } else {
      p.frameRate(this.settings.fps);
    }
    this.playground.draw(p);
    this.foods.forEach((food, index) => food.draw(p));
    this.snake.draw(p);
  }

  keyPressed(keyCode: number) {
    console.log("keyCode:" + keyCode);
    if (keyCode == 80) { // P key
      this.isNotPaused = !this.isNotPaused;
    }

    if (this.isNotPaused) {
      if (keyCode === this.p.UP_ARROW) {
        this.snake.setDirection(Direction.UP);
      } else if (keyCode === this.p.DOWN_ARROW) {
        this.snake.setDirection(Direction.DOWN);
      } else if (keyCode === this.p.RIGHT_ARROW) {
        this.snake.setDirection(Direction.RIGHT);
      } else if (keyCode === this.p.LEFT_ARROW) {
        this.snake.setDirection(Direction.LEFT);
      }
    }
  }
}
