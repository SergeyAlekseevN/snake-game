import * as p5 from "p5";
import {GameSettings} from "./game.settings";
import {Food} from "./sprites/food.sprite";

export class SkinsController {
  private skins: Set<string> = new Set<string>();
  private emoji = [
    /*cherries:*/ '🍒',
    /*banana:*/ '🍌',
    /*bineapple:*/ '🍍',
    /*pear:*/ '🍐',
    /*strawberry:*/ '🍓',
    /*mushroom:*/ '🍄',
    /*chestnut:*/ '🌰',
    /*greenapple:*/ '🍏',
    /*redapple:*/ '🍎',
    /*avocado:*/ '🥑',
    /*kiwi:*/ '🥝',
    /*maize:*/ '🌽',
    /*grapes:*/ '🍇',
    /*aubergine:*/ '🍆',
    /*watermelon:*/ '🍉',
    /*lemon:*/ '🍋',
    /*tangerine:*/ '🍊'
  ];

  constructor(public p: p5, public settings: GameSettings) {
  }

  getRandomFreeEmoji(food: Food): string {
    let newIcon;
    do {
      newIcon = this.emoji[this.p.floor(this.p.random(this.emoji.length))];
    } while (this.skins.has(`${newIcon}`));

    this.skins.delete(`${food.icon}`);
    this.skins.add(`${newIcon}`);
    return newIcon;
  }
}
