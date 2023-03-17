import { Collidable } from './Collidable.js';
const { Observable, BehaviorSubject, Subject, interval, of , fromEvent, merge, from } = rxjs;
const { mergeMap, switchMap, scan, take, takeWhile, map, tap, startWith, filter } = rxjs.operators;

/*
  TODO: Make PADDLE extend from MOVABLE
*/

export class Paddle extends Collidable {
  constructor(parentSVG, boardGroup, id, attrs = { height: 100, boardHeight: 400, boardHeight: 384 }, input$ = null) {
    super({ parentSVG, type: 'rect', attrs: { ...attrs, y: attrs.y - 50, id: id, classList: ['paddle'], fill: '#18181899' }, isContainer: false });
    this.boardGroup = boardGroup
    this.containerGroup = document.createElementNS(SVG_NS, 'g');
    this.containerGroup.classList.add(`${id}Group`)
    this.strokeWidth = attrs.strokeWidth || 4;
    this.self.setAttribute('rx', this.attrs.rx || 10)

console.warn('[PADDLE] ATTRS', attrs)

    this.originY = (this.attrs.boardHeight / 2) - (this.attrs.height / 2) //((this.height - this.y1) - this.y) + (this.strokeWidth * 2.5)
    this.originX = this.attrs.side === 'left' ? 0 + this.attrs.width : this.attrs.boardWidth - (this.attrs.width * 2);
    this.input$ = this.attrs.input$;

    this.transform;
    this.translate
    this.coord;

    this.paddleTransforms = this.self.transform.baseVal;

    if (this.paddleTransforms.length === 0) {
      this.paddleTranslate = this.parentSVG.createSVGTransform();
      this.paddleTranslate.setTranslate(0, 50);
      this.paddleTransforms.insertItemBefore(this.paddleTranslate, 0);
    }

    this.boardGroup.appendChild(this.self)
    this.position$ = new BehaviorSubject(this.self.getBoundingClientRect()) //.pipe(tap(x => console.log('x', x)), ) // this.position$.next(this.self.getBoundingClientRect())
    this.input$.pipe(tap(this.move.bind(this))).subscribe()
  }

  updatePosition(y = this.originY, x = this.originX) {
    /* NOTE: Returns the center Y of the paddle in px*/
    const changedY = (Math.abs(y) * this.originY) / 100; //- (this.attrs.height / 2)
    return { x: x, y: y > 0 ? changedY : -changedY }
  }

  move(yVal) {
    const perc = this.updatePosition(yVal)
    this.transform = this.paddleTransforms.getItem(0)
    this.transform.setTranslate(perc.x, perc.y)
    this.position$.next(this.hitbox)
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
}