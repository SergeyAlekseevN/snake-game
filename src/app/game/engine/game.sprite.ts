import * as p5 from "p5";

/**
 * Все игровые элементы наследуем от этого класса.
 */
export abstract class GameSprite {
  protected constructor(public p: p5) {
  }

  /**
   * Проверить условия. Посчитать новое состояние.
   */
  protected abstract update(p: p5): void;

  /**
   * Отрисовать.
   */
  protected abstract draw(p: p5): void;
}
