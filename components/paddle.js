const { iif, Observable, BehaviorSubject, AsyncSubject, Subject, interval, of , fromEvent, merge, empty, delay, from } = rxjs;
const { throttleTime, mergeMap, switchMap, scan, take, takeWhile, map, tap, startWith, filter, mapTo } = rxjs.operators;

export class Paddle {
  constructor(parentSvg, element, config = { input$: null, boardHeight: 400 }) {
    this.parentSvg = parentSvg;
    this.config = config;
    this.input$ = this.config.input$;
    this.strokeWidth = config.strokeWidth || 4;
    this.root = element || document.createElementNS(SVG_NS, 'g');
    this.board = document.querySelector('#boardBackground')
    this.rect = this.root.querySelector('.paddle')

    this.originY = (this.config.boardHeight / 2) - (this.config.height / 2) //((this.height - this.y1) - this.y) + (this.strokeWidth * 2.5)

    this.transform;
    this.translate
    this.CTM;
    this.coord;
    this.rect.setAttribute('y', this.originY)
    this.paddleTransforms = this.rect.transform.baseVal;

    if (this.paddleTransforms.length === 0) {
      this.paddleTranslate = this.parentSvg.createSVGTransform();
      this.paddleTranslate.setTranslate(0, this.originY);
      this.paddleTransforms.insertItemBefore(this.paddleTranslate, 0);
    }

    this.input$.pipe(tap(this.move.bind(this))).subscribe()
  }

  translateValue(value = this.originY) {
    if (value > 0) {
      const perc = ((((Math.abs(value))) * this.originY) / 100) //- (this.config.height / 2)
      return perc
    } else {
      const perc = ((((Math.abs(value))) * this.originY) / 100) //- (this.config.height / 2)
      return -perc
    }
  }

  move(yVal) {
    const perc = this.translateValue(yVal)
    this.transform = this.paddleTransforms.getItem(0);
    this.transform.setTranslate(0, perc)
  }

  endMove(evt) { this.selected = null}

}

{
  Paddle
}