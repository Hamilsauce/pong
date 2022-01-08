import { Movable } from './Movable.js';

export class Collidable extends Movable {
  constructor(element) {
    this.root;
  };

  getAttr(attr) {
    return this
  }
  get prop() { return this._prop };
  set prop(newValue) { this._prop = newValue };
}