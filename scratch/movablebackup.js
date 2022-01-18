import { Collidable } from './Collidable.js';
const { iif, BehaviorSubject, ReplaySubject, AsyncSubject, Subject, interval, of , fromEvent, merge, empty, delay, from } = rxjs;
const { throttleTime, mergeMap, switchMap, scan, take, takeWhile, map, tap, startWith, filter, mapTo } = rxjs.operators;


export class Movable extends Collidable {
  constructor(parentSVG, type = 'rect', attrs = {}, isContainer = false, coordsInput$) {
    super({ parentSVG, type, attrs })
    this._lastPosition = { x: 0, y: 0 }

    this.transform;
    this.translate
    this.coord;

    this.rootTransforms = this.root.transform.baseVal;
    if (this.rootTransforms.length === 0) {
      this.paddleTranslate = this.parentSVG.createSVGTransform();
      this.paddleTranslate.setTranslate(0, 0);
      this.rootTransforms.insertItemBefore(this.paddleTranslate, 0);
    }
    this.position$ = new BehaviorSubject(this.root.getBoundingClientRect()) //.pipe(tap(x => console.log('x', x)), ) // this.position$.next(this.root.getBoundingClientRect())

  }
  get position() {
    return { x: this.changeX, y: this.changeY }
  }
  set position({ x, y }) {
    this.transform = this.ballTransforms.getItem(0);
    this.ballTranslate.setTranslate(this.changeX, this.changeY);
  }

  updatePosition(cx = this.originX, cy = this.originY, ) {
    if (this.directionX === 'left') {
      this.changeX -= 3
      this.changeY += this.directionY
    } else if (this.directionX === 'right') {
      this.changeX += 3
      this.changeY += this.directionY
    }

    this.position = { x: this.changeX, y: this.changeY }
    this.position$.next({ ...this.hitbox })
    return this.position;
  }

  set position(val) {
    this.position$.next(this.hitbox);

  }

  updatePosition(y = this.originY, x = this.originX) {
    /* NOTE: Returns the center Y of the paddle in px*/
    const changedY = (Math.abs(y) * this.originY) / 100; //- (this.attrs.height / 2)
    // if (y > 0) {
    //   this.position = {
    //     x: x,
    //     top: ((this.attrs.boardHeight / 2) + changedY) - this.centroid.y,
    //     bottom: ((this.attrs.boardHeight / 2) + changedY) + this.centroid.y,
    //   }
    // } else {
    //   this.position = {
    //     x: x,
    //     top: (-changedY + (this.attrs.boardHeight / 2)) - this.centroid.y,
    //     bottom: (-changedY + (this.attrs.boardHeight / 2)) + this.centroid.y,
    //   }
    // }
    return { x: x, y: y > 0 ? changedY : -changedY }
  }
  move(yVal) {
    const perc = this.updatePosition(yVal)
    this.transform = this.rootTransforms.getItem(0)
    // console.log('this.transform', this.transform)
    this.transform.setTranslate(perc.x, perc.y)
    this.position$.next(this.hitbox)
    // this.position$.next(this.root.getBoundingClientRect())
  }
  endMove(evt) { this.selected = null }


  get prop() { return this._prop };
  set prop(newValue) { this._prop = newValue };
}