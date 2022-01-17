import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
const { log, help, DOM, date, array, utils, text } = ham;
const { combineLatest, iif, ReplaySubject, AsyncSubject, Subject, interval, of , fromEvent, merge, empty, delay, from } = rxjs;
const { mergeAll, sampleTime, throttleTime, mergeMap, switchMap, scan, take, takeWhile, map, tap, startWith, filter, mapTo } = rxjs.operators;

import { SliderGroup, ActionRelayer } from '../components/slider.js';
import { Paddle } from '../components/paddle.js';
import { Ball } from '../components/ball.js';
import { Board } from '../components/board.js';


export class Game {
  constructor(selector, { key1 = 'vfuck1', key2 = 'vfuck2' }) {
    this.root = document.querySelector(selector);
    this.boardGroup = document.querySelector('#boardGroup');
    this.board = new Board(this.root, 'rect', { id: 'boardBackground', classList: ['board', 'active'], data: { some: 'data' }, x: 0, y: 0, width: this.root.width.baseVal.value, height: 400, fill: "url(#boardGradient)" })
    this.boardGroup.appendChild(this.board.root)
    this._x;
    this._y;
    this.scene$;
    this.sliders = sliderConfig ? sliderConfig.reduce((acc, curr) => ({ ...acc, [curr.id]: new SliderGroup(this.root, undefined, curr) }), {}) : null;
    this.outOfBounds = false
    this.paddleLeft = new Paddle(this.root, this.boardGroup, 'leftPaddle', { input$: this.sliders.left.value$, side: 'left', height: 100, width: 25, boardHeight: 400, boardWidth: window.innerWidth, });
    this.paddleRight = new Paddle(this.root, this.boardGroup, 'rightPaddle', { input$: this.sliders.right.value$, side: 'right', height: 100, width: 25, boardHeight: 400, boardWidth: window.innerWidth, });
    // console.log('balski', (new Ball(
    // {
    //   parentSVG: this.root,
    //   boardGroup: this.boardGroup,
    //   paddles$: this.paddles$,
    //   input$: null,
    //   attrs: {
    //     r: 8,
    //     boardHeight: 400,
    //     boardWidth: 384
    //   }
    // })));
    console.log('this.board.width / 2,', this.board.width / 2, )
    this.ball = new Ball(
    {
      parentSVG: this.root,
      boardGroup: this.boardGroup,
      paddles$: this.paddles$,
      input$: null,
      attrs: {
        r: 8,
        cx: this.board.width / 2,
        cy: this.board.height / 2,
        boardHeight: 400,
        boardWidth: 384
      }
    })
    this.boardGroup.appendChild(this.ball.root);
    this.init();

    // log.interval('getBoundingClientRect', 500, this.paddleLeft.rect.getBoundingClientRect())
    // setInterval(() => {
    //   console.log(' ', );
    //   console.log('getScreenCTM', this.paddleLeft.rect.getBBox())
    //   // console.log('getBoundingClientRect', this.paddleLeft.rect.getBoundingClientRect())
    // }, 2000)

    console.log('this.board.root', this.board.hitbox)
  };


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
    // console.log('ball',ball);
    const pLeftArea = [
      [paddleLeft.left, paddleLeft.right],
      [paddleLeft.top, paddleLeft.bottom],
    ]
    const pRightArea = [
      [paddleRight.right, paddleRight.left],
      [paddleRight.top, paddleRight.bottom],
    ]

    const hitLeft = (pleft, pright, ball) => {
      if (
        ball.left <= pleft[0][1] &&
        (ball.bottom >= pleft[1][0] && ball.top <= pleft[1][1])
      ) {
        const rawPOI = ball.bottom + (ball.center)
        const POIR = -((pleft[1][0] - pleft[1][1]) - (rawPOI - pleft[1][1])) - 50
        console.log('POIR', POIR)
        this.ball.directionX = 'right'
        if (POIR > 0) { this.ball.directionY = -5 }
        else { this.ball.directionY = +5 }
      }
      else if (
        ball.right >= pright[0][1] &&
        (ball.bottom >= pright[1][0] && ball.top <= pright[1][1])
      ) {
        // console.log('HIT RIGHT PADDLE AREA');
        const rawPOI = ball.bottom + (ball.center)
        const POIR = -((pright[1][0] - pright[1][1]) - (rawPOI - pright[1][1])) - 50
        this.ball.directionX = 'left'
        if (POIR < 0) {
          // console.log('HIT RIGHT TOP');
          this.ball.directionY *= -10
          // console.log('this.ball.directionY', this.ball.directionY)
          // console.log('this.ball.directionY', this.ball.directionY)
          // this.ball.changeY +=this.ball.directionY


        }
        else {
          // console.log('HIT RIGHT BOTTOM');
          this.ball.directionY += -1
          // console.log('this.ball.directionY', this.ball.directionY)
          // this.ball.changeY +=this.ball.directionY


        }
      }
    };

    // console.log(pLeftArea, pRightArea, ball)
    hitLeft(pLeftArea, pRightArea, ball)


    const paddleLeftBox = paddleLeft //.getBoundingClientRect()
    const paddleRightBox = paddleRight //.getBoundingClientRect()


    const hitBoundsLeft = ball.left <= paddleLeftBox.right;
    const hitBoundsRight = ball.right >= paddleRightBox.left
    // console.warn('paddleRightBox.left', paddleRightBox)
    // console.log('ball.right', ball.right)

    const hitPaddleLeft = hitBoundsLeft && (ball.bottom >= paddleLeftBox.top && ball.top <= paddleLeftBox.bottom);
    const hitPaddleRight = hitBoundsRight && (ball.bottom >= paddleRightBox.top && ball.top <= paddleRightBox.bottom);

    // const hitWallTop = ball.top > this.x
    // const hitWallBottom = hitBoundsRight && (ball.bottom >= paddleRight.top && ball.top <= paddleRight.bottom);

    // if (hitBoundsLeft) {
    //   this.ball.directionX = 'right'
    //   // TODO NOTE: REPLACE paddleLeft.height / 2
    //   // console.log('ball.y, (paddleLeft.height / 2)', (ball.y + (ball.bottom - ball.top) / 2), paddleLeft.top + (paddleLeft.height / 2))

    //   if ((ball.y + (ball.bottom - ball.top) / 2) - (paddleLeft.bottom / 2) > 0) {
    //     this.ball.directionY += 0.3;
    //     // console.error('HIT BOTTOM', )
    //   } else {

    //     // this.ball.directionY -= 0.3
    //     // console.error('HIT TOP', )

    //   }
    // } else if (hitBoundsRight) {
    //   console.error('HIT PADDLE RIGHT', )
    //   this.ball.directionX = 'left'
    // } else if ((hitBoundsLeft || hitBoundsRight) && !(hitPaddleLeft || hitPaddleRight)) {
    //   console.error('outOfBounds')
    //   this.outOfBounds = !this.outOfBounds
    // }
  }

  collideOn(targetBox) {
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



  init() {
    this.scene$ = combineLatest(
      this.paddleLeft.position$,
      this.paddleRight.position$,
      this.ball.position$,
      (paddleLeft, paddleRight, ball) => ({ paddleLeft, paddleRight, ball })
    ).pipe(
      sampleTime(40),
      takeWhile(() => !this.outOfBounds),
      // tap(x => console.log('x', x)),
      map(({ paddleLeft, paddleRight, ball }) => {
        // console.info('{ paddleLeft, paddleRight, ball }', paddleLeft, paddleRight, ball)
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






// const bbox = elem.getBBox(),
//   middleX = bbox.x + (bbox.width / 2),
//   middleY = bbox.y + (bbox.height / 2);

// generate a conversion function

// use it to calculate the absolute center of the element

// const dot = svg.append('circle')
//   .attr('cx', absoluteCenter.x)
//   .attr('cy', absoluteCenter.y)
//   .attr('r', 5);

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

// const relayer = new ActionRelayer(sliderConfig)
// console.log('relayer', [...relayer])
// const sliderComp = new SliderGroup('#game', undefined, config)
// const game = new Game('#game', {sliderConfig});
const game = new Game('#game', sliderConfig);