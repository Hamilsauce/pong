import { Point } from '/src/view/geometry/Point.js'

const areInstancesOf = (type, ...objs) => {
  return objs.every(_ => _ instanceof type)


};

export class Vector {
  constructor(a = 0, b = 0) {
    // if (!areInstancesOf(Point, a, b)) return;
    this.x = new Point(a)
    this.y = new Point(b)

  }

  add(v) {
    return new Vector(this.x + v.x, this.y + v.y);
  }

  subtract(v) {
    return new Vector(this.x - v.x, this.y - v.y);
  }

  get length() {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  }
}
