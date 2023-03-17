import { Spatial } from './Spatial.js';

export class Collidable extends Spatial {
  constructor({ parentSVG, type, attrs, isContainer = false }) {
    super({ parentSVG, type, attrs });
    this.isContainer = isContainer;
  };

  collideOn(targetBox) {
    if (this.isContainer) {
      return !(
        r2.bottom < r1.top ||
        r2.right < r1.left ||
        r2.top > r1.bottom ||
        r2.left > r1.right
      );
    } else {
      return !(
        targetBox.top > this.hitbox.bottom ||
        targetBox.right < this.hitbox.left ||
        targetBox.bottom < this.hitbox.top ||
        targetBox.left > this.hitbox.right
      );
    }
  }

  getBoundingClientRect() { return this.self.getBoundingClientRect() }

  get hitbox() {
    return {
      top: this.getBoundingClientRect().top,
      right: this.getBoundingClientRect().right,
      bottom: this.getBoundingClientRect().bottom,
      left: this.getBoundingClientRect().left,
      centerY: this.getBoundingClientRect().top + (this.getBoundingClientRect().bottom - this.getBoundingClientRect().top) / 2,
      centerX: this.getBoundingClientRect().left + (this.getBoundingClientRect().right - this.getBoundingClientRect().left) / 2,
    }
  }
}
