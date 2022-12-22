import { SliderGroup, ActionRelayer } from './slider.js';
import { Paddle } from './paddle.js';
import { Ball } from './ball.js';
import { Board } from './board.js';
import { Scoreboard } from './scoreboard.js';

const { combineLatest, iif, Subject, interval, of , fromEvent, merge, from } = rxjs;
const { mergeAll, groupBy, sampleTime, mergeMap, switchMap, scan, take, takeWhile, map, tap, startWith, filter } = rxjs.operators;


const Constants = {
  boardCollision: {
    LEFT: 'LEFT',
    RIGHT: 'RIGHT',
  }
}


export class Game {
  constructor(selector, options) {
    this._x;
    this._y;
    this.scene$;
    this.outOfBounds = false;

    this.root = document.querySelector(selector);
    this.boardGroup = document.querySelector('#boardGroup');
    this.board = new Board(this.root, { id: 'boardBackground', classList: ['board', 'active'], data: { some: 'data' }, x: 0, y: 0, width: window.innerWidth, height: 400, fill: "url(#boardGradient)" });
    this.boardGroup.appendChild(this.board.root)

    this.sliders = options.sliderConfig ? options.sliderConfig.reduce((acc, curr) => ({ ...acc, [curr.id]: new SliderGroup(this.root, undefined, curr) }), {}) : null;
    console.log('this.sliders', this.sliders)

    this.paddleLeft = new Paddle(this.root, this.boardGroup, 'leftPaddle', {
      input$: this.sliders.left.value$,
      y: this.board.centroid.y,
      side: 'left',
      height: 100,
      width: 25,
      boardHeight: 400,
      boardWidth: window.innerWidth,
      rx: 8
    });

    this.paddleRight = new Paddle(this.root, this.boardGroup, 'rightPaddle', {
      input$: this.sliders.right.value$,
      y: this.board.centroid.y,
      side: 'right',
      height: 100,
      width: 25,
      boardHeight: 400,
      boardWidth: window.innerWidth,
      rx: 8
    });

    this.ball = new Ball({
      parentSVG: this.root,
      boardGroup: this.boardGroup,
      paddles$: this.paddles$,
      input$: null,
      attrs: {
        classList: ['ball'],
        r: 10,
        cx: this.board.centroid.x,
        cy: this.board.centroid.y,
        boardHeight: 400,
        boardWidth: 384
      }
    });

    this.scoreboard = new Scoreboard(this.root, { id: 'scoreboard', classList: ['scoreboard'], data: { some: 'data' }, x: 0, y: 0, width: window.innerWidth, height: 55, fill: "#292A2F" })
    this.root.appendChild(this.scoreboard.root);

    this.boardGroup.appendChild(this.ball.root);

    this.boardGroup.setAttribute('transform', 'translate(0, 50)');

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
      map(this.detectCollision.bind(this)),
    );

    this.scene$.subscribe();
  }

  convertCoords(x, y, elem) {
    const offset = this.root.getBoundingClientRect();
    const matrix = elem.getScreenCTM();

    return {
      x: (matrix.a * x) + (matrix.c * y) + matrix.e - offset.left,
      y: (matrix.b * x) + (matrix.d * y) + matrix.f - offset.top
    };
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
    // PADDLE collision   
    let boardCollision = false

    if (
      ball.left <= paddleLeft.right &&
      ball.bottom >= paddleLeft.top &&
      ball.top <= paddleLeft.bottom
    ) {
      const rawPOI = ball.top + (ball.center);

      const POIR = -((paddleLeft.top - paddleLeft.bottom) - (rawPOI - paddleLeft.bottom)) - 50;

      this.ball.directionX = -1;

      if (this.ball.directionY === 0) { this.ball.directionY = Math.random() > 0.5 ? 1 : -1 }
    }
    
    else if (
      ball.right >= paddleRight.left &&
      ball.bottom >= paddleRight.top &&
      ball.top <= paddleRight.bottom
    ) {
      const rawPOI = ball.centerY;
      const POIR = -((paddleRight.top - paddleRight.bottom) - (rawPOI - paddleRight.bottom)) - 50

      this.ball.directionX = 1;

      if (this.ball.directionY === 0) { this.ball.directionY = Math.random() > 0.5 ? 1 : -1 }
    }

    // BOARD collision
    else if (this.ball.hitbox.left <= this.board.hitbox.left) {
      const score = document.querySelector('#right-score text')
      boardCollision = true;

      this.ball.directionX = -1;
      score.textContent = (+score.textContent || 0) + 1
    }
    
    else if (this.ball.hitbox.right >= this.board.hitbox.right) {
      const score = document.querySelector('#left-score text')
      
      boardCollision = true;

      this.ball.directionX = 1;

      if (this.ball.directionY === 0) { this.ball.directionY = Math.random() > 0.5 ? 1 : -1 }
    
      score.textContent = (+score.textContent || 0) + 1;
    }
    
    else if (ball.bottom >= this.board.hitbox.bottom) {
      this.ball.directionY = -1;
    }
    
    else if (ball.top <= this.board.hitbox.top) {
      if (this.ball.directionY === 0) { this.ball.directionY = Math.random() > 0.5 ? 1 : -1 }
      this.ball.directionY = 1;
    }

    if (boardCollision) {
      this.root.dataset.invert = this.root.dataset.invert === 'true' ? false : true;

      setTimeout(() => {
        this.root.dataset.invert = this.root.dataset.invert === 'true' ? false : true;
      }, 200)
    }

    return boardCollision;
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