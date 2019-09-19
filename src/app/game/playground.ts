import * as p5 from 'p5';

export function Playground(p: p5) {
  const width = 800;
  const height = 800;
  const scale = 20;
  const fps = 100;

  let snake;
  let food;

  p.setup = () => {
    p.createCanvas(width + 1, height + 1).parent('playground');
    snake = new Snake();
    pickLocation();
    p.frameRate(fps);
  };

  p.draw = () => {
    p.noCursor();
    p.background('white');

    //клетки поля.
    p.strokeWeight(0.1);
    for (let i = 0; i <= width / scale; i++) {
      p.line(i * scale, 0, i * scale, height)
    }

    for (let i = 0; i <= height / scale; i++) {
      p.line(0, scale * i, width, scale * i)
    }

    snake.death();
    snake.update();
    snake.show();

    if (snake.eat(food)) {
      pickLocation();
    }

    // food
    p.fill('red');
    p.rect(food.x, food.y, scale, scale);
  };


  function pickLocation() {
    let cols = p.floor(width / scale);
    let rows = p.floor(height / scale);

    food = p.createVector(p.floor(p.random(cols)), p.floor(p.random(rows)));
    food.mult(scale);
  }

  p.keyPressed = (): void => {
    if (p.keyCode === p.UP_ARROW) {
      snake.dir(0, -1);
    } else if (p.keyCode === p.DOWN_ARROW) {
      snake.dir(0, 1);
    } else if (p.keyCode === p.RIGHT_ARROW) {
      snake.dir(1, 0);
    } else if (p.keyCode === p.LEFT_ARROW) {
      snake.dir(-1, 0);
    }
  };

  function Snake() {

    this.x = 0;
    this.y = 0;
    this.xSpeed = 1;
    this.ySpeed = 0;
    this.total = 0;
    this.tail = [];

    this.update = function () {
      if (this.total === this.tail.length) {
        for (let i = 0; i < this.tail.length - 1; i++) {
          this.tail[i] = this.tail[i + 1];
        }
      }
      this.tail[this.total - 1] = p.createVector(this.x, this.y);


      this.x += this.xSpeed * scale;
      this.y += this.ySpeed * scale;

      this.x = p.constrain(this.x, 0, width - scale);
      this.y = p.constrain(this.y, 0, height - scale);
    };

    this.dir = function (x, y) {
      this.xSpeed = x;
      this.ySpeed = y;
    };

    this.eat = function (pos) {
      let d = p.dist(this.x, this.y, pos.x, pos.y);
      if (d < 1) {
        this.total++;
        return true;
      } else {
        return false;
      }

    };

    this.death = function () {
      for (let i = 0; i < this.tail.length; i++) {
        let pos = this.tail[i];
        let distanse = p.dist(this.x, this.y, pos.x, pos.y);
        if (distanse < 1) {
          this.total = 0;
          this.tail = [];
        }
      }
    };

    this.show = function () {
      p.fill(p.color('green'));
      for (let i = 0; i < this.total; i++) {
        p.rect(this.tail[i].x, this.tail[i].y, scale, scale);
      }
      p.fill(p.color('blue'));
      p.rect(this.x, this.y, scale, scale);
    }
  }
}
