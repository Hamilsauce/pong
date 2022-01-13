const { iif, Observable, BehaviorSubject, AsyncSubject, Subject, interval, of , fromEvent, merge, empty, delay, from } = rxjs;
const { throttleTime, mergeMap, switchMap, scan, take, takeWhile, map, tap, startWith, filter, mapTo } = rxjs.operators;

export class Spatial {
  constructor(parentSvg, boardGroup, paddles$, config = { input$: null, boardHeight: 400 }) {
    this.parentSvg = parentSvg;
    this.boardGroup = boardGroup;
    this.config = config;
    this.paddles$ = paddles$
    this.root = document.createElementNS(SVG_NS, 'circle');
    this.board = document.querySelector('#boardBackground')

    this.originY = (this.config.boardHeight / 2);
    this.originX = (this.config.boardWidth / 2);
    this.changeY = this.originY;
    this.changeX = this.originX;
    console.log(this);
    this.transform;
    this.translate
    this.CTM;
    this.coord;
    this.root.setAttribute('r', this.config.r)
    this.root.setAttribute('fill', 'red')
    this.directionX = 'left'
    this.directionY = this.board.getAttribute('height') / 2
    this.SpatialTransforms = this.root.transform.baseVal;

    if (this.SpatialTransforms.length === 0) {
      this.SpatialTranslate = this.parentSvg.createSVGTransform();
      this.SpatialTranslate.setTranslate(this.originX, this.originY);
      this.SpatialTransforms.insertItemBefore(this.SpatialTranslate, 0);
    }
    this.boardGroup.appendChild(this.root);
    this.position$ = new Subject();
    this.position = {
      cx: this.originX,
      cy: this.originY,
      r: this.config.r,
    }

   this.anim = requestAnimationFrame(this.animate.bind(this))
  }

  animate() {
    if (this.directionX === 'left') {
      this.directionY = this.directionY +  -0.1
      this.changeX -= 0.6
      this.changeY =  (this.directionY)

    } else if (this.directionX === 'right') {
      this.directionY += this.directionY +0.1
      this.changeX = 0.6
      this.changeY = this.directionY //+ 1.2// (this.directionY)
      
    }
    this.SpatialTranslate.setTranslate(this.changeX, this.changeY);
    this.position$.next(this.root)
    requestAnimationFrame(this.animate.bind(this))
  }

  updatePosition(cx = this.originX, cy = this.originY, ) {
    /* NOTE: Returns the center Y of the paddle in px*/
    const changedY = ((Math.abs(cy) * this.originY) / 100)+ 1; //- (this.config.height / 2)
    const changedX = (Math.abs(cx) * this.originX) / 100; //- (this.config.height / 2)
    return {cx: cx > 0 ? changedX : -changedX,cy: changedY}
  }

  move(pos) {
    const perc = this.updatePosition(pos)
    this.transform = this.SpatialTransforms.getItem(0);
    this.transform.setTranslate(perc.x, perc.y)
  }

  endMove(evt) { this.selected = null }


  get hitbox() { return this.root.getBoundingClientRect() }

  // set position(val) {
  //   this.position$.next(this.root.getBoundingClientRect())
  // }

  get centroid() { return { cx: this.cx, cy: this.cy } }

  get cx() {
    return +this.root.getAttribute('cx') || this.config.cx
  }

  set cx(newValue) {
    this._cx = this.updatePosition(newValue)
  }
  get cy() {
    return this.updatePosition
  }
  get r() {
    return this.config.r;
  }
  get width() {
    return this.r * 2;
  }
  get height() {
    return this.r * 2;
  }

}

{
  Spatial
}