const { iif, Observable, BehaviorSubject, AsyncSubject, Subject, interval, of , fromEvent, merge, empty, delay, from } = rxjs;
const { throttleTime, mergeMap, switchMap, scan, take, takeWhile, map, tap, startWith, filter, mapTo } = rxjs.operators;

export class Paddle {
  constructor(parentSvg, boardGroup, id, config = { input$: null, height: 100, boardHeight: 400, boardHeight: 384 }) {
    this.parentSvg = parentSvg;
    this.CTM = this.parentSvg.getScreenCTM();
    this.config = config;
    this.boardGroup = boardGroup
    this.input$ = this.config.input$;
    this.strokeWidth = config.strokeWidth || 4;
    this.root = document.createElementNS(SVG_NS, 'g');
    this.root.classList.add(`${id}Group`)

    this.rect = document.createElementNS(SVG_NS, 'rect');
    this.rect.classList.add('paddle')
    this.rect.setAttribute('height', this.config.height)
    this.rect.setAttribute('width', this.config.width)
    this.rect.setAttribute('rx', this.config.rx || 10)
    this.rect.setAttribute('stroke', '#00000050')
    this.rect.setAttribute('filter', 'drop-shadow(0 0 3px  #FFFFFF90)')
    this.rect.id = id
    this.fill = '#18181899'

    this.board = document.querySelector('#boardBackground')
    this.originY = (this.config.boardHeight / 2) - (this.config.height / 2) //((this.height - this.y1) - this.y) + (this.strokeWidth * 2.5)
    this.originX = this.config.side === 'left' ? 0 + this.config.width : this.config.boardWidth - (this.config.width * 2);
    this.position$ = new BehaviorSubject(this.rect.getBoundingClientRect());

    this.transform;
    this.translate
    this.coord;
    // this.hitbox = this.re

    this.rect.setAttribute('y', this.originY)
    this.paddleTransforms = this.rect.transform.baseVal;

    if (this.paddleTransforms.length === 0) {
      this.paddleTranslate = this.parentSvg.createSVGTransform();
      this.paddleTranslate.setTranslate(0, 0);
      this.paddleTransforms.insertItemBefore(this.paddleTranslate, 0);
    }
    this.input$.pipe(tap(this.move)).subscribe()
    this.boardGroup.appendChild(this.rect)
    this._y;
  }

  updatePosition(y = this.originY, x = this.originX) {
    /* NOTE: Returns the center Y of the paddle in px*/
    const changedY = (Math.abs(y) * this.originY) / 100; //- (this.config.height / 2)
    if (y > 0) {
      this.position = {
        x: x,
        top: ((this.config.boardHeight / 2) + changedY) - this.centroid.y,
        bottom: ((this.config.boardHeight / 2) + changedY) + this.centroid.y,
      }
    } else {
      this.position = {
        x: x,
        top: (-changedY + (this.config.boardHeight / 2)) - this.centroid.y,
        bottom: (-changedY + (this.config.boardHeight / 2)) + this.centroid.y,
      }
    }
    return y > 0 ? changedY : -changedY
  }

  move(yVal) {
    this.transform = this.paddleTransforms.getItem(0);
    this.transform.setTranslate(this.originX, this.updatePosition(yVal))
   console.log('this.hitbox', this.hitbox)
    this.position$.next(this.hitbox)
  }

  endMove(evt) { this.selected = null }

  getCoordsCTM(x, y) {
    return {
      x: (x - this.CTM.e) / this.CTM.a,
      y: (y - this.CTM.f) / this.CTM.d
    };
  }
  getMousePosition(evt) {
    if (evt.touches) { evt = evt.targetTouches[0]; }
    return {
      x: (evt.clientX - this.CTM.e) / this.CTM.a,
      y: (evt.clientY - this.CTM.f) / this.CTM.d
    };
  }

 
  set position(val) {
    this.position$.next(val)
  }
  get hitbox() {
    return this.root.getBoundingClientRect()
    this.position$.next(val)
  }

  get centroid() { return { x: this.width / 2, y: this.height / 2 } }

  get fill() { return this.rect.getAttribute('fill') }
  set fill(val) { this.rect.setAttribute('fill', val) }

  get x() {
    return +this.rect.getAttribute('x')
  }
  set y(newValue) {
    this._y = this.updatePosition(newValue)
  }
  get y() {
    return this.updatePosition;
  }
  get y() {
    return this.updatePosition
  }
  get width() {
    return this.config.width
  }
  get height() {
    return this.config.height
  }

}

{
  Paddle
}