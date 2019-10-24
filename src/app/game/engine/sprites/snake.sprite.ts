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
  private direction: Direction = Direction.RIGHT;
  private initialLength;
  private lastMoveDirection: Direction = Direction.RIGHT;

  private body: Vector[] = [];
  private grow = false;

  private isMoving: boolean = false;
  public onSelfEat: () => void;

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
    this.locationController.set(h.x, h.y);

    for (let i = 0; i < length - 1; i++) {
      h = this.getNextPosition(h);
      this.body.unshift(h);
      this.locationController.set(h.x, h.y);
    }
  }

  update(p: p5) {
    if (this.isMoving) {
      this.move();
      this.checkSelfCollision();
    }
  }

  draw(p: p5): void {
    let prevSegment;
    let ty;
    let tx;
    /**
     * Отрисовать хвост в цикле.
     * Если в хвосте еда, отрисовать с едой.
     * Если у предыдущего элемента одно направление, у следующего другое, то отрисовать текущий элемент уголком.
     * Если у текущего элемента нет предыдущего то это голова. Отрисуем как годову.
     * Если у текущего элемента нет следующего то это хвост. Отрисуем его как хвост в том направлении в котором он есть.
     */
    const cols = this.settings.cols;
    const rows = this.settings.rows;

    const scaleX = this.settings.scaleX;
    const scaleY = this.settings.scaleY;
    const spriteScaleX = this.sprite.width / 5;
    const spriteScaleY = this.sprite.height / 4;


    for (let i = 0; i < this.body.length; i++) { //нулевой элемент у нас голова
      let currentX;
      let currentY;

      if (i === 0) {
        // head
        let head = this.body[0];

        currentX = head.x;
        currentY = head.y;
        // Head; Determine the correct image

        if (this.direction == Direction.UP) {
          // Up
          tx = 3;
          ty = 0;
        } else if (this.direction == Direction.RIGHT) {
          // Right
          tx = 4;
          ty = 0;
        } else if (this.direction == Direction.DOWN) {
          // Down
          tx = 4;
          ty = 1;
        } else if (this.direction == Direction.LEFT) {
          // Left
          tx = 3;
          ty = 1;
        }
      } else if (i === this.body.length - 1) {
        //tail
        let tail = this.body[i];
        // Tail; Determine the correct image
        prevSegment = this.body[i - 1]; // Prev segment
        currentX = tail.x;
        currentY = tail.y;
        if (
          currentY == prevSegment.y + 1 ||
          currentY == 0 && prevSegment.y == rows - 1) {
          // Up
          tx = 3;
          ty = 2;
        } else if (
          currentY == prevSegment.y - 1 ||
          currentY != 0 && prevSegment.y == 0) {
          // Down
          tx = 4;
          ty = 3;
        } else if (
          currentX == prevSegment.x - 1 ||
          currentX == cols - 1 && prevSegment.x == 0) {
          // Right
          tx = 4;
          ty = 2;
        } else if (
          currentX == prevSegment.x + 1 ||
          currentX == 0 && prevSegment.x == cols - 1) {
          // Left
          tx = 3;
          ty = 3;
        }
      } else {
        const segment = this.body[i];
        currentX = segment.x;
        currentY = segment.y;
        // Sprite column and row that gets calculated
        tx = 0;
        ty = 0;

        // Body; Determine the correct image
        prevSegment = this.body[i - 1];
        let nextSegment = this.body[i + 1]; // Next segment
        if (prevSegment.y == currentY && nextSegment.y == currentY) {
          // Horizontal Left-Right
          tx = 1;
          ty = 0;
        } else if (prevSegment.x == currentX && nextSegment.x == currentX) {
          // Vertical Up-Down
          tx = 2;
          ty = 1;
        } else if (
          /*Angle Left-Down*/
          (nextSegment.x + 1 == currentX || nextSegment.x - cols + 1 == currentX) && (prevSegment.y - 1 == currentY || prevSegment.y + rows - 1 == currentY) ||
          (nextSegment.y - 1 == currentY || nextSegment.y + rows - 1 == currentY) && (prevSegment.x + 1 == currentX || prevSegment.x - cols + 1 == currentX)) {
          tx = 2;
          ty = 0;
        } else if (
          /*Angle Left-Top*/
          (nextSegment.x + 1 == currentX || nextSegment.x - cols + 1 == currentX) && (prevSegment.y + 1 == currentY || prevSegment.y - rows + 1 == currentY) ||
          (nextSegment.y + 1 == currentY || nextSegment.y - rows + 1 == currentY) && (prevSegment.x + 1 == currentX || prevSegment.x - cols + 1 == currentX)
        ) {
          tx = 2;
          ty = 2;
        } else if (
          /*Angle Right-Up*/
          (nextSegment.x - 1 == currentX || nextSegment.x + cols - 1 == currentX) && (prevSegment.y + 1 == currentY || prevSegment.y - rows + 1 == currentY) ||
          (nextSegment.y + 1 == currentY || nextSegment.y - rows + 1 == currentY) && (prevSegment.x - 1 == currentX || prevSegment.x + cols - 1 == currentX)
        ) {
          tx = 0;
          ty = 1;
        } else if (
          /*Angle Right-Down*/
          (nextSegment.x - 1 == currentX || nextSegment.x + cols - 1 == currentX) && (prevSegment.y - 1 == currentY || prevSegment.y + rows - 1 == currentY) ||
          (nextSegment.y - 1 == currentY || nextSegment.y + rows - 1 == currentY) && (prevSegment.x - 1 == currentX || prevSegment.x + cols - 1 == currentX)
        ) {
          tx = 0;
          ty = 0;
        } else {
          tx = 0;
          ty = 3;
        }
      }

      // Draw the image of the snake part
      p.image(this.sprite, currentX * scaleX, currentY * scaleY, scaleX, scaleY, tx * spriteScaleX, ty * spriteScaleY, spriteScaleX, spriteScaleY);
    }
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
    this.locationController.set(newHead.x, newHead.y);
    this.body.unshift(newHead);
    if (this.grow) {
      this.grow = false;
    } else {
      const deletedTile = this.body.pop();
      this.locationController.unset(deletedTile.x, deletedTile.y);
    }
    // console.log(`snake length ${this.body.length}, isGrow = ${this.grow}`);
  }

  getNextPosition(position: Vector): Vector {
    const cols = this.settings.cols;
    const rows = this.settings.rows;

    const xSpeed = this.xSpeed;
    const ySpeed = this.ySpeed;

    let x = position.x + xSpeed;
    let y = position.y + ySpeed;

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

    if (xSpeed === 0 && ySpeed === 1) {
      this.lastMoveDirection = Direction.DOWN;
    } else if (xSpeed === -1 && ySpeed === 0) {
      this.lastMoveDirection = Direction.LEFT;
    } else if (xSpeed === 0 && ySpeed === -1) {
      this.lastMoveDirection = Direction.UP;
    } else if (xSpeed === 1 && ySpeed === 0) {
      this.lastMoveDirection = Direction.RIGHT;
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
        if (this.direction !== Direction.UP && this.lastMoveDirection !== Direction.UP) {
          this.setSpeed(0, 1);
          this.direction = Direction.DOWN;
        }
        break;
      case Direction.LEFT:
        if (this.direction !== Direction.RIGHT && this.lastMoveDirection !== Direction.RIGHT) {
          this.setSpeed(-1, 0);
          this.direction = Direction.LEFT;
        }
        break;
      case Direction.UP:
        if (this.direction !== Direction.DOWN && this.lastMoveDirection !== Direction.DOWN) {
          this.setSpeed(0, -1);
          this.direction = Direction.UP;
        }
        break;
      case Direction.RIGHT:
        if (this.direction != Direction.LEFT && this.lastMoveDirection !== Direction.LEFT) {
          this.setSpeed(1, 0);
          this.direction = Direction.RIGHT;
        }
        break;
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
        this.onSelfEat();
        console.log(`slice snake`);
        this.body = this.body.slice(0, this.initialLength);
      }
    }
  }

  growUp() {
    this.grow = true;
  }
}
