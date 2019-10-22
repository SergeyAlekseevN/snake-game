import * as p5 from "p5";
import {GameSettings} from "./game.settings";
import {Color, Food, Shape} from "./sprites/food.sprite";

export class SkinsController {
  private skins: Set<string> = new Set<string>();

  constructor(public p: p5, public settings: GameSettings) {
  }

  getRandomFreeSkin(food: Food):Skin {
    let newShape;
    let newColor;
    do {
      newShape = this.p.floor(this.p.random(4));
      newColor = this.p.floor(this.p.random(4));
    } while (this.skins.has(`${newShape}:${newColor}`));

    this.skins.delete(`${food.shape}:${food.color}`);
    this.skins.add(`${newShape}:${newColor}`);
    return {color:newColor, shape: newShape}
  }
}

export interface Skin {
  shape: Shape;
  color: Color;
}
