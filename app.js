// import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
// const { log, help, DOM, array, utils, text } = ham;
const { combineLatest, iif,Subject, interval, of , fromEvent, merge, from } = rxjs;
const { mergeAll, sampleTime, mergeMap, switchMap, scan, take, takeWhile, map, tap, startWith, filter} = rxjs.operators;

import { SliderGroup, ActionRelayer } from '../components/slider.js';
import { Paddle } from './components/paddle.js';
import { Ball } from './components/ball.js';
import { Board } from './components/board.js';


export class Game {
  constructor(selector, { key1 = 'vfuck1', key2 = 'vfuck2' }) {
    this.outOfBounds = false
    this.scene$;
    this.root = document.querySelector(selector);
    this.boardGroup = document.querySelector('#boardGroup');
    this.board = new Board(this.root, { id: 'boardBackground', classList: ['board', 'active'], data: { some: 'data' }, x: 0, y: 0, width: window.innerWidth, height: 400, fill: "url(#boardGradient)" })
    this.boardGroup.appendChild(this.board.root)
    this._x;
    this._y;
    this.sliders = sliderConfig ? sliderConfig.reduce((acc, curr) => ({ ...acc, [curr.id]: new SliderGroup(this.root, undefined, curr) }), {}) : null;
    this.paddleLeft = new Paddle(this.root, this.boardGroup, 'leftPaddle', { input$: this.sliders.left.value$, y: this.board.centroid.y, side: 'left', height: 100, width: 25, boardHeight: 400, boardWidth: window.innerWidth, rx: 8 });
    this.paddleRight = new Paddle(this.root, this.boardGroup, 'rightPaddle', { input$: this.sliders.right.value$, y: this.board.centroid.y, side: 'right', height: 100, width: 25, boardHeight: 400, boardWidth: window.innerWidth, rx: 8 });
    this.ball = new Ball({
      parentSVG: this.root,
      boardGroup: this.boardGroup,
      paddles$: this.paddles$,
      input$: null,
      attrs: {
        classList: ['ball'],
        r: 8,
        cx: this.board.centroid.x,
        cy: this.board.centroid.y,
        boardHeight: 400,
        boardWidth: 384
      }
    })
    this.boardGroup.appendChild(this.ball.root);

    this.rootTransforms = this.root.transform.baseVal;
    if (this.rootTransforms.length === 0) {
      this.rootTranslate = this.root.createSVGTransform();
      this.rootTranslate.setTranslate(0, 0);
      this.rootTransforms.insertItemBefore(this.rootTranslate, 0);
    }
    this.init();
  };

  init() {
    this.scene$ = combineLatest(
      this.paddleLeft.position$,
      this.paddleRight.position$,
      this.ball.position$,
      (paddleLeft, paddleRight, ball) => ({ paddleLeft, paddleRight, ball })
    ).pipe(
      sampleTime(40),
      takeWhile(() => !this.outOfBounds),
      map(({ paddleLeft, paddleRight, ball }) => {
        return { paddleLeft, paddleRight, ball }
      }),
    );

    this.scene$.subscribe(this.detectCollision.bind(this))
  }

  convertCoords(x, y, elem) {
    const offset = this.root.getBoundingClientRect();
    const matrix = elem.getScreenCTM();

    return {
      x: (matrix.a * x) + (matrix.c * y) + matrix.e - offset.left,
      y: (matrix.b * x) + (matrix.d * y) + matrix.f - offset.top
    };
  }

  create(parent, name, attrs, text) {
    const el = document.createElementNS(this.root.namespaceURI, name);
    for (let attr in attrs) {
      if (!attrs.hasOwnProperty(attr)) continue;

      const splitProp = attr.split(':');
      if (splitProp[1]) el.setAttributeNS(parent.getAttribute('xmlns:' + splitProp[0]), splitProp[1], attrs[attr]);
      else el.setAttribute(attr, attrs[attr]);
    }
    if (text) el.appendChild(document.createTextNode(text));
    return parent.appendChild(el);
  }


  detectCollision({ paddleLeft, paddleRight, ball }) {
    /*
    NOTE: MUST GET PADDLE BOUNDING RECTS HERE UNTIL THEY ARE PUSHING THE VALUE
    */
    if (
      ball.left <= paddleLeft.right &&
      (ball.bottom >= paddleLeft.top && ball.top <= paddleLeft.bottom)
    ) {
      const rawPOI = ball.top + (ball.center)
      const POIR = -((paddleLeft.top - paddleLeft.bottom) - (rawPOI - paddleLeft.bottom)) - 50
      this.ball.directionX = 'right'
      if (this.ball.directionY === 0) { this.ball.directionY = Math.random() > 0.5 ? 1 : -1 }
    }
    else if (
      ball.right >= paddleRight.left &&
      (ball.bottom >= paddleRight.top && ball.top <= paddleRight.bottom)
    ) {
      const rawPOI = ball.centerY
      const POIR = -((paddleRight.top - paddleRight.bottom) - (rawPOI - paddleRight.bottom)) - 50
      this.ball.directionX = 'left'
      if (this.ball.directionY === 0) { this.ball.directionY = Math.random() > 0.5 ? 1 : -1 }
    }

    if (ball.top < this.board.hitbox.top || ball.bottom >= this.board.hitbox.bottom) {
      this.ball.directionY = -(this.ball.directionY)
    }
    else if (ball.bottom > this.board.hitbox.bottom) {
      this.ball.directionY = this.ball.directionY
    }
  }

  collideOn() {
    if (this.isContainer) {
      return !(
        r2.bottom < r1.top ||
        r2.right < r1.left ||
        r2.top > r1.bottom ||
        r2.left > r1.right
      );
    } else {
      return !(
        targetBox.top > this.hitbox.bottom ||
        targetBox.right < this.hitbox.left ||
        targetBox.bottom < this.hitbox.top ||
        targetBox.left > this.hitbox.right
      );
    }
  }

  animate() {
    this.ballTranslate.setTranslate(this.changeX, this.changeY);
    this.position$.next(this.hitbox)
    requestAnimationFrame(this.animate.bind(this))
  }



  convertCoords(x, y, elem) {
    const offset = this.root.getBoundingClientRect();
    const matrix = elem.getScreenCTM();

    return {
      x: (matrix.a * x) + (matrix.c * y) + matrix.e - offset.left,
      y: (matrix.b * x) + (matrix.d * y) + matrix.f - offset.top
    };
  }
  makeAbsoluteContext(element, svgDocument) {
    return function(x, y) {
      const offset = svgDocument.getBoundingClientRect();
      const matrix = element.getScreenCTM();
      return {
        x: (matrix.a * x) + (matrix.c * y) + matrix.e - offset.left,
        y: (matrix.b * x) + (matrix.d * y) + matrix.f - offset.top
      };
    };
  }
  get x() { return +this.boardGroup.getAttribute('x') };
  set x(newValue) {+this.boardGroup.setAttribute('x', newValue) };
  get y() { return +this.boardGroup.getAttribute('y') };
  set y(newValue) {+this.boardGroup.setAttribute('y', newValue) };
}

const sliderConfig = [
  {
    x: 50,
    y: 450,
    width: 50,
    height: 225,
    handleRadius: 25,
    strokeWidth: 1,
    id: 'left',
    key1: 'duck'
  },
  {
    x: 285,
    y: 450,
    width: 50,
    height: 225,
    handleRadius: 25,
    strokeWidth: 1,
    id: 'right',
    key2: 'suck'
  },
];

const game = new Game('#game', sliderConfig);
