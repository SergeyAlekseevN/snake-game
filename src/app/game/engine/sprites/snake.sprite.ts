import * as p5 from "p5";
import {Vector} from "p5";
import {GameSprite} from "./game.sprite";
import {GameSettings} from "../game.settings";
import {Direction} from "../direction.enum";
import {LocationController} from "../location.controller";

/**
 * Змейка.
 */
export class Snake extends GameSprite {
  private readonly sprite;
  private xSpeed = 1;
  private ySpeed = 0;
  private direction: Direction;
  private initialLength;

  private body: Vector[] = [];
  private grow = false;

  private isMoving: boolean = false;
  private isOpenMouth: boolean = false;

  constructor(public p: p5, public settings: GameSettings, public locationController: LocationController) {
    super(p);
    this.sprite = p.loadImage('assets/snake.png');
  }

  /**
   * Инициализация змейки в координатах head и длиной тела в length
   * @param length длина змейки, включая хвост и голову.
   * @param head позиция головы.
   * @param direction начальное направление
   */
  public initSnake(length: number = 4, head?: Vector, direction: Direction = Direction.RIGHT): void {
    this.initialLength = length;
    /**
     * todo Если не заданы координаты: по умолчанию берём центр поля.
     *
     * startHeadPosition= vector(width/2,height/2)
     * for(i=1;i<snakeSize;i++){
     *      добавить элементы с головы.
     *      для каждого хранить текущее для него направление.
     * }
     *
     */
    let h = this.p.createVector(0, 0);
    this.body.unshift(h);

    for (let i = 0; i < length - 1; i++) {
      h = this.getNextPosition(h);
      this.body.unshift(h);
    }
  }

  update(p: p5) {
    this.applyMode();
    if (this.isMoving) {
      this.checkNextStep();
      this.checkCurrentStep();
      this.move();
      this.checkSelfCollision();
    }
  }

  private applyMode() {
    // this.isMoving = false;
  }

  draw(p: p5): void {
    let pseg;
    let ty;
    let tx;
    /**
     * Отрисовать хвост в цикле.
     * Если в хвосте еда, отрисовать с едой.
     * Если у предыдущего элемента одно направление, у следующего другое, то отрисовать текущий элемент уголком.
     * Если у текущего элемента нет предыдущего то это голова. Отрисуем как годову.
     * Если у текущего элемента нет следующего то это хвост. Отрисуем его как хвост в том направлении в котором он есть.
     */


    const scaleX = this.settings.scaleX;
    const scaleY = this.settings.scaleY;

    // head

    let head = this.getHead();
    let spriteScaleX = this.sprite.width / 5;
    let spriteScaleY = this.sprite.height / 4;
    let segx = head.x;
    let segy = head.y;
    // Head; Determine the correct image

    // Previous segment
    let nseg = this.body[1]; // Next segment
    if (segy < nseg.y) {
      // Up
      tx = 3;
      ty = 0;
    } else if (segx > nseg.x) {
      // Right
      tx = 4;
      ty = 0;
    } else if (segy > nseg.y) {
      // Down
      tx = 4;
      ty = 1;
    } else if (segx < nseg.x) {
      // Left
      tx = 3;
      ty = 1;
    }

    p.image(this.sprite, head.x * scaleX, head.y * scaleY, scaleX, scaleY, tx * spriteScaleX, ty * spriteScaleY, spriteScaleX, spriteScaleY);

    // body
    for (let i = 1; i < this.body.length - 1; i++) { //нулевой элемент у нас голова
      const segment = this.body[i];
      segx = segment.x;
      segy = segment.y;
      // Sprite column and row that gets calculated
      tx = 0;
      ty = 0;

      // Body; Determine the correct image
      pseg = this.body[i - 1];
      nseg = this.body[i + 1]; // Next segment
      if (pseg.x < segx && nseg.x > segx || nseg.x < segx && pseg.x > segx) {
        // Horizontal Left-Right
        tx = 1;
        ty = 0;
      } else if (pseg.x < segx && nseg.y > segy || nseg.x < segx && pseg.y > segy) {
        // Angle Left-Down
        tx = 2;
        ty = 0;
      } else if (pseg.y < segy && nseg.y > segy || nseg.y < segy && pseg.y > segy) {
        // Vertical Up-Down
        tx = 2;
        ty = 1;
      } else if (pseg.y < segy && nseg.x < segx || nseg.y < segy && pseg.x < segx) {
        // Angle Top-Left
        tx = 2;
        ty = 2;
      } else if (pseg.x > segx && nseg.y < segy || nseg.x > segx && pseg.y < segy) {
        // Angle Right-Up
        tx = 0;
        ty = 1;
      } else if (pseg.y > segy && nseg.x > segx || nseg.y > segy && pseg.x > segx) {
        // Angle Down-Right
        tx = 0;
        ty = 0;
      }
      // Draw the image of the snake part
      p.image(this.sprite, segx * scaleX, segy * scaleY, scaleX, scaleY, tx * spriteScaleX, ty * spriteScaleY, spriteScaleX, spriteScaleY);
    }

    //tail
    let tail = this.getTile();
    // Tail; Determine the correct image
    pseg = this.body[this.body.length - 2]; // Prev segment
    segx = tail.x;
    segy = tail.y;
    if (pseg.y < segy) {
      // Up
      tx = 3;
      ty = 2;
    } else if (pseg.x > segx) {
      // Right
      tx = 4;
      ty = 2;
    } else if (pseg.y > segy) {
      // Down
      tx = 4;
      ty = 3;
    } else if (pseg.x < segx) {
      // Left
      tx = 3;
      ty = 3;
    }
    p.image(this.sprite, segx * scaleX, segy * scaleY, scaleX, scaleY, tx * spriteScaleX, ty * spriteScaleY, spriteScaleX, spriteScaleY);
  }

  private getHead(): Vector {
    return this.body[0];
  }

  private getTile(): Vector {
    return this.body[this.body.length - 1];
  }

  growSnake() {

  }

  checkCurrentStep() {
    /**
     * Проверить текущее положение головы
     * Если еда - издать звук и увеличить очки.
     */
  }

  checkNextStep() {
    /**
     * Проверить следующий ход в текущем направлении.
     * Если еда - открыть рот.
     */
  }

  getCurrentPosition() {
    return this.p.createVector(this.body[0].x, this.body[0].y);
  }

  private move() {

    /**
     * Передвинуть змейку по направлению если голова переместилась в новую позицию.
     * Передать еду в следующий кусок хвоста.
     * Если еда в хвосте, добавить новый элемент в конец с координатами хвоста.
     */

    const newHead = this.getNextPosition(this.body[0]);
    this.body.unshift(newHead);
    this.locationController.unset(newHead.x, newHead.y);
    if (this.grow) {
      this.grow = false;
    } else {
      const deletedTile = this.body.pop();
      this.locationController.unset(deletedTile.x, deletedTile.y);
    }
    console.log(`snake length ${this.body.length}, isGrow = ${this.grow}`);
  }

  getNextPosition(position: Vector): Vector {
    const cols = this.settings.cols;
    const rows = this.settings.rows;

    let x = position.x + this.xSpeed;
    let y = position.y + this.ySpeed;

    // если стены замкнуты
    if (x >= cols) {
      x = 0;
    }
    if (x < 0) {
      x = cols - 1;
    }
    if (y >= rows) {
      y = 0;
    }
    if (y < 0) {
      y = rows - 1;
    }

    return this.p.createVector(x, y);
  }

  /**
   * Задаём новое направление для движения змейки.
   *
   * @param newDirection новое направление движения.
   */
  public setDirection(newDirection: Direction) {
    switch (newDirection) {
      case Direction.DOWN:
        if (this.direction !== Direction.UP) {
          this.setSpeed(0, 1);
          this.direction = Direction.DOWN;
        }
        break;
      case Direction.LEFT:
        if (this.direction !== Direction.RIGHT) {
          this.setSpeed(-1, 0);
          this.direction = Direction.LEFT;
        }
        break;
      case Direction.UP:
        if (this.direction !== Direction.DOWN) {
          this.setSpeed(0, -1);
          this.direction = Direction.UP;
        }
        break;
      case Direction.RIGHT:
        if (this.direction != Direction.LEFT) {
          this.setSpeed(1, 0);
          this.direction = Direction.RIGHT;
        }
    }
  }

  private setSpeed(x: number, y: number) {
    this.xSpeed = x;
    this.ySpeed = y;

    this.isMoving = true;
  }

  public isFoodEaten(food: Vector): boolean {
    let snake = this.getCurrentPosition();
    return this.p.dist(snake.x, snake.y, food.x, food.y) < 1;
  }

  checkSelfCollision() {
    for (let i = 1; i < this.body.length; i++) {
      let tailPosition: Vector = this.body[i];

      let distance = this.p.dist(this.body[0].x, this.body[0].y, tailPosition.x, tailPosition.y);
      if (distance < 1) {
        console.log(`slice snake`);
        this.body = this.body.slice(0, this.initialLength);
      }
    }
  }

  growUp() {
    this.grow = true;
  }
}
