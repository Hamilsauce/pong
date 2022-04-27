import { Movable } from '/src/view/Movable.js'
import { start } from '/src/game-engine/loop.engine.js'
import { Point } from '/src/view/geometry/Point.js'

export class Actor extends Movable {
  constructor(el, point,canvas,  config) {
  
  
    super({ canvas, type:'circle', attrs: {}, isContainer: false })
    this.self = el
    this.path = [];
    this.point = new Point();
    this.velocity = config.velocity || 0.8
    this.tileCost = config.tileCost || 1;
  };
  getDirection() {}
  calculateDistance(a, b) {

    return b - a < 0 ?
      Math.abs(a) - Math.abs(b) :
      Math.abs(b) - Math.abs(a)
  }

  giveInstructions(arrOfPoints) {}

  setPath(dest) {

    this.path = {
      y: this.calculateDistance(this.position.x, dest.x),
      x: this.calculateDistance(this.position.y, dest.y),
    }
    return this.path

    // 1. Determine Direxction
    // for row n col by comparison of points


    //2. create vector with points
    // maybe show vector

    //
  }

  heuristic(node) {
    let dx = Math.abs(node.x - goal.x)
    let dy = Math.abs(node.y - goal.y)
    return this.D * (dx + dy)
  }

  moveTo(point) {
    const path = this.setPath(point);
    return path;
  }

  evaluateTile(point) {}

  getTileAtPoint(point) {}

  // get boundingBox() { return this.self.getBoundioundingBox };
  // set boundingBox(newValue) { this._boundingBox = newValue };
}
