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
  public readonly foods: Food[] = [];
  private readonly playground: Playground;

  score: number = 0;
  lives: number = 3;
  topic: string = "no topic";

  topicsController: TopicsController;
  private isNotPaused: boolean = true;
  private isGameStarted: boolean = false;
  private readonly actionLogger: (message: string, color: string, points: string) => void;
  private readonly onGameOver: (score: number) => void;

  onChangeTopic = (topicName: string) => {
    /*при смене темы перегенерим всю еду*/
    this.foods.forEach(food => this.regenerateFood(food));
    this.settings.fps += 2;
  };

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
    this.topicsController = new TopicsController(this.onChangeTopic);
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
  }

  public startGame() {
    this.isGameStarted = true;
    this.topicsController.generateTopics();
  }

  public stopGame() {
    this.isGameStarted = false;
    this.topicsController.stopGenerateTopics();
  }

  loadFood(count: number) {
    for (let i = 0; i < count; i++) {
      let food = new Food(this.p, this.settings, this.locationController);
      this.regenerateFood(food);
      this.foods.push(food);
    }
  }

  regenerateFood(food: Food) {
    food.putOnNewPlace(this.locationController.getRandomFreeCell());
    food.icon = this.skinsController.getRandomFreeEmoji(food);
    food.text = this.topicsController.getNewWord();
  }

  update(p: p5): void {
    this.topic = this.topicsController.getCurrentTopic().name;
    if (this.isNotPaused) {
      if (this.lives <= 0) {
        this.isNotPaused = false;
        this.onGameOver(this.score);

      }
      if (this.isGameStarted) {
        const foods = this.foods.filter((food, index) => this.snake.isFoodEaten(food.coord));
        if (foods.length > 0) {
          const eatenFood = foods[0];

          if (this.isGoodFood(eatenFood)) {// TODO: 24.10.2019 Sergey Alekseev: проверка что правильная еда
            this.actionLogger(`${eatenFood.text}`, 'green', '+1');
            this.score++;
          } else {
            this.actionLogger(`${eatenFood.text}`, 'red', '-1');
            this.score--
          }

          this.snake.growUp();
          this.regenerateFood(eatenFood);
        }
        this.snake.update(p);
      }
    }
  }

  isGoodFood(food: Food): boolean {
    return this.topicsController.getCurrentTopic().words.indexOf(food.text.trim()) > -1;
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
      if (keyCode === this.p.UP_ARROW || keyCode === 87) {
        this.snake.setDirection(Direction.UP);
      } else if (keyCode === this.p.DOWN_ARROW || keyCode === 83) {
        this.snake.setDirection(Direction.DOWN);
      } else if (keyCode === this.p.RIGHT_ARROW || keyCode === 68) {
        this.snake.setDirection(Direction.RIGHT);
      } else if (keyCode === this.p.LEFT_ARROW || keyCode === 65) {
        this.snake.setDirection(Direction.LEFT);
      }
    }
  }
}
