export class Collider {
  constructor() {
    this.root;
  }

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
  get prop() { return this._prop };
  set prop(newValue) { this._prop = newValue };
}