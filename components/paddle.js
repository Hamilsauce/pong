import { Collidable } from './Collidable.js';

const { iif, Observable, BehaviorSubject, AsyncSubject, Subject, interval, of , fromEvent, merge, empty, delay, from } = rxjs;
const { throttleTime, mergeMap, switchMap, scan, take, takeWhile, map, tap, startWith, filter, mapTo } = rxjs.operators;

export class Paddle extends Collidable {
  constructor(parentSVG, boardGroup, id, attrs = { height: 100, boardHeight: 400, boardHeight: 384 }, input$ = null) {
    super({parentSVG, type: 'rect', attrs:{ ...attrs, y: attrs.y - 50, id: id, classList: ['paddle'], fill: '#18181899' }, isContainer:false});
    this.boardGroup = boardGroup
    this.containerGroup = document.createElementNS(SVG_NS, 'g');
    this.containerGroup.classList.add(`${id}Group`)
    this.strokeWidth = attrs.strokeWidth || 4;
    this.root.setAttribute('rx', this.attrs.rx || 10)

    this.originY = (this.attrs.boardHeight / 2) - (this.attrs.height / 2) //((this.height - this.y1) - this.y) + (this.strokeWidth * 2.5)
    this.originX = this.attrs.side === 'left' ? 0 + this.attrs.width : this.attrs.boardWidth - (this.attrs.width * 2);
    this.input$ = this.attrs.input$;

    this.transform;
    this.translate
    this.coord;

    this.paddleTransforms = this.root.transform.baseVal;
    if (this.paddleTransforms.length === 0) {
      this.paddleTranslate = this.parentSVG.createSVGTransform();
      this.paddleTranslate.setTranslate(0, 0);
      this.paddleTransforms.insertItemBefore(this.paddleTranslate, 0);
    }
    this.boardGroup.appendChild(this.root)
    this.position$ = new BehaviorSubject(this.root.getBoundingClientRect()) //.pipe(tap(x => console.log('x', x)), ) // this.position$.next(this.root.getBoundingClientRect())
    this.input$.pipe(tap(this.move.bind(this))).subscribe()

    this._y;
    // console.log('YYYYYY', this.y)
    // console.log('this.root.y.baseVal.value', 
    // console.log('this.root.y.baseVal.value', this.root.y.baseVal.value)

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
    this.transform = this.paddleTransforms.getItem(0)
    // console.log('this.transform', this.transform)
    this.transform.setTranslate(perc.x, perc.y)
    this.position$.next(this.hitbox)
    // this.position$.next(this.root.getBoundingClientRect())
  }
  endMove(evt) { this.selected = null }

  getMousePosition(evt) {
    if (evt.touches) { evt = evt.targetTouches[0]; }
    return {
      x: (evt.clientX - this.CTM.e) / this.CTM.a,
      y: (evt.clientY - this.CTM.f) / this.CTM.d
    };
  }

  getCoordsCTM(x, y) {
    return {
      x: (x - this.CTM.e) / this.CTM.a,
      y: (y - this.CTM.f) / this.CTM.d
    };
  }

  set position(val) {
    this.position$.next(this.hitbox)
  }

  // get x() { return this.root.x.baseVal.value || this.attrs.x }
  // set x(val) { this.root.x.baseVal.value = value }
  // get y() { return this.root.y.baseVal.value || this.attrs.y }
  // set y(val) { this.root.y.baseVal.value = value }

  // get cx() { return this.root.cx.baseVal.value || this.attrs.cx }
  // set cx(val) { this.root.cx.baseVal.value = value }
  // get cy() { return this.root.cy.baseVal.value || this.attrs.cy }
  // set cy(val) { this.root.cy.baseVal.value = value }

  // get height() { return this.root.height.baseVal.value || this.attrs.height }
  // set height(val) { this.root.height.baseVal.value = value }
  // get width() { return this.root.width.baseVal.value || this.attrs.width }
  // set height(val) { this.root.height.baseVal.value = value }

  // get x1() { return this.root.x1.baseVal.value || this.attrs.x1 }
  // set x2(val) { this.root.x2.baseVal.value = value }
  // get y1() { return this.root.y1.baseVal.value || this.attrs.x2 }
  // set y2(val) { this.root.y2.baseVal.value = value }

  // get centroid() { return { x: this.width / 2, y: this.height / 2 } }
  // get fill() { return this.root.getAttribute('fill') }
  // set fill(val) { this.root.setAttribute('fill', val) }

  // get hitbox() { return this.root.getBoundingClientRect() }
  // get x() {return +this.root.getAttribute('x')}
  // set y(newValue) {this._y = this.updatePosition(newValue)}
  // get y() {return this.updatePosition;}
  // get y() {return this.updatePosition}
}

{
  Paddle
}