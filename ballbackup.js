// import { Spatial } from './Spatial.js';
import { Collidable } from './Collidable.js';
const { iif, Observable, BehaviorSubject, AsyncSubject, Subject, interval, of , fromEvent, merge, empty, delay, from } = rxjs;
const { throttleTime, mergeMap, switchMap, scan, take, takeWhile, map, tap, startWith, filter, mapTo } = rxjs.operators;
console.log('in ball top');

export class Ball extends Collidable {
  constructor({ parentSVG, boardGroup, paddles$, attrs }) { //= { fill: 'red', name: 'ball', input$: null, boardHeight: 400 } }) {
    super(parentSVG, 'circle', attrs);
    this.boardGroup = boardGroup;
    this.paddles$ = paddles$
    this.board = document.querySelector('#boardBackground')
    this.originY = this.cx
    this.originX = this.cy
    console.log('this.cx', this.cx)
    console.log('orig x n y', this.originY, this.originX, );
    this.changeY = 0;
    this.changeX = 0;
    this.transform;
    this.translate
    this.CTM;
    this.coord;
    this.directionX = 'left'
    this.directionY = 0;

    this.ballTransforms = this.root.transform.baseVal;
    this.ballTranslate = this.parentSVG.createSVGTransform();
    if (this.ballTransforms.length === 0) {
      this.ballTranslate.setTranslate(0, 0)
      this.ballTransforms.insertItemBefore(this.ballTranslate, 0);
    }

    this.position$ = new BehaviorSubject({
      cx: this.cx,
      cy: this.cy,
      r: this.r,
    });
    this.anim = requestAnimationFrame(this.animate.bind(this))
  }

  animate() {
    this.currentPosition = this.updatePosition()
    requestAnimationFrame(this.animate.bind(this))
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

  move(pos) {
    const perc = this.updatePosition(pos)
    // this.transform = this.ballTransforms.getItem(0);
    // this.transform.setTranslate(perc.x, perc.y)
  }

  endMove(evt) { this.selected = null }

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

  // get hitbox() { return this.root.getBoundingClientRect() }
  // get centroid() { return { cx: this.cx, cy: this.cy } }
  // get cx() { return +this.root.getAttribute('cx') || this.attrs.cx }
  // set cx(newValue) { this._cx = this.updatePosition(newValue) }
  // get cy() { return this.updatePosition }
  // get r() { return this.attrs.r }
  // get width() { return this.r * 2 }
  // get height() { return this.r * 2 }
}

{
  Ball
}