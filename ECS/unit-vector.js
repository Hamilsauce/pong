let u = Math.min((Date.now() - this.startTime) / this.duration, 1);

export class Point {
  constructor(coordX, coordY) {
    this.root;
  }

  static create(x, y) {
    return new Point(x, y);

  }

  get prop() { return this._prop };
  set prop(newValue) { this._prop = newValue };
}


export class Vector {
  // Vector is a relation between two points
  // Defines direction of a, b and velocity
  constructor(pointA = [0, 0], pointB = [0, 0]) {

    this.points = [pointA, pointB];

  }

  static create(x, y) {
    return new Vector(x, y);

  }
add(v) {
  return new Vector(this.getX() + v.getX(), this.getY() + v.getY())
}

subtract(v) {
  return new Vector(this.getX() - v.getX(), this.getY() - v.getY())
}

multiply(scalar) {
  return new Vector(this.getX() * scalar, this.getY() * scalar)
};

divide(scalar) {
  return new Vector(this.getX() / scalar, this.getY() / scalar)
};

magnitude() {
  return Math.sqrt(this.getX() * this.getX() + this.getY() * this.getY() )
}


//this is the vector I have tried for the normalisation
normalize() {
  var vec = new Vector(this.getX(), this.getY())
  // return new Vector(vec.divide(this.magnitude()));
return this.divide(this.magnitude());
}

  get magnitude() { return this._magnitude };
  set magnitude(newValue) { this._magnitude = newValue };

  get direction() { return this._direction };
  set direction(newValue) { this._direction = newValue };
}


const normalizeVector = (points = []) => {
  const [a, b] = points;

  let v = [(b.x - a.x), (b.y - a.y)]

};
