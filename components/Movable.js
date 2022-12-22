import { Collidable } from './Collidable.js';
const { BehaviorSubject } = rxjs;


export class Movable extends Collidable {
  constructor({ parentSVG, type = 'rect', attrs = {}, isContainer = false, coordsInput$ }) {
    super({ parentSVG, type, attrs })
    
    this._lastPosition = { x: 0, y: 0 }
    this.transform;
    this.translate
    this.translate2 = this.translate()
    this.coord;
    this.changeY = 0;
    this.changeX = 0;

    this.position$ = new BehaviorSubject(this.root.getBoundingClientRect())
  }

  translate({ x, y, cx, cy, x1, x2, y1, y2 }) { return { x: null, y: null } }

  updatePosition(updateFunction) {
    this.position = updateFunction()({ x: this.changeX, y: this.changeY });
    this.position$.next({ ...this.hitbox })
    return this.position;
  }

  get position() { return { x: this.changeX, y: this.changeY } }
  set position({ x, y }) {
    this.transform = this.rootTransforms.getItem(0);
    this.rootTranslate.setTranslate(x, y)
  }
}
