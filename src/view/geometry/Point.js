/**
 * Implements a 2-dimensional vector with double precision coordinates.
 *
 * Constructs a new point for the optional x and y coordinates. If no
 * coordinates are given, then the default values for <x> and <y> are used.
 */

export class Point {
  constructor(x = 0, y = 0, size = 10) {
    this._x = null;
    this._y = null;
    this.x = x;
    this.y = y;
    this.size = size;
  }

  toPixels() {
    return {
      x: (this.x * this.size) + (this.size / 2),
      y: (this.y * this.size) + (this.size / 2),
    }
  }

  set x(x) {
    // console.log('XXXXX',x);
    if (Number.isNaN(x)) throw new Error('Invalid x supplied.');

    this._x = x;
  }
  get x() {
    return this._x || 0
  }

  get y() { return this._y || 0; }

  set y(y) {
    if (Number.isNaN(y)) throw new Error('Invalid y supplied.');

    this._y = y;
  }

  equals(p) {
    if (!(p && (p instanceof Point))) return false;

    return p.x === this.x && p.y === this.y;
  }

  clone() {
    return new Point(this.x, this.y);
  }

  subtract(p2) {
    return new Point(this.x - p2.x, this.y - p2.y);
  }

  add(p2) {
    return new Point(this.x + p2.x, this.y + p2.y);
  }
}
