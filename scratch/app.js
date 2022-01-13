const { combineLatest, iif, ReplaySubject, AsyncSubject, Subject, interval, of , fromEvent, merge, empty, delay, from } = rxjs;
const { mergeAll, sampleTime, throttleTime, mergeMap, switchMap, scan, take, takeWhile, map, tap, startWith, filter, mapTo } = rxjs.operators;


import { SliderGroup, ActionRelayer } from '../components/slider.js';
import { Paddle } from '../components/paddle.js';
import { Ball } from '../components/ball.js';

export class Game {
  constructor(selector, sliderConfig) {
    this.root = document.querySelector(selector);
    this.boardGroup = document.querySelector('#boardGroup');
    this._x;
    this._y;
    this.scene$;
    this.sliders = sliderConfig
      .reduce((acc, curr) => ({ ...acc, [curr.id]: new SliderGroup(this.root, undefined, curr) }), {});
    this.outOfBounds = false
    this.paddleLeft = new Paddle(this.root, this.boardGroup, 'leftPaddle', { input$: this.sliders.left.value$, side: 'left', height: 100, width: 25, boardHeight: 400, boardWidth: window.innerWidth, });
    this.paddleRight = new Paddle(this.root, this.boardGroup, 'rightPaddle', { input$: this.sliders.right.value$, side: 'right', height: 100, width: 25, boardHeight: 400, boardWidth: window.innerWidth, });
    this.ball = new Ball(this.root, this.boardGroup, this.paddles$, { input$: null, r: 8, boardHeight: 400, boardWidth: 384 })
    this.init();

    // this.convert = this.makeAbsoluteContext(elem, svgDoc);
    // this.absoluteCenter = this.convert(middleX, middleY);

  };


  convertCoords(x, y, elem) {
    var offset = this.root.getBoundingClientRect();
    var matrix = elem.getScreenCTM();

    return {
      x: (matrix.a * x) + (matrix.c * y) + matrix.e - offset.left,
      y: (matrix.b * x) + (matrix.d * y) + matrix.f - offset.top
    };
  }

  create(parent, name, attrs, text) {
    var el = document.createElementNS(this.root.namespaceURI, name);
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
    // const paddleLeft = paddleLeft.getBoundingClientRect()
    // const paddleRight = paddleRight.getBoundingClientRect()
    // const ball = ball.getBoundingClientRect()
    console.log('ball, paddleLeft.getBoundingClientRect(), paddleRight.getBoundingClientRect()')
    console.log(ball, paddleLeft.getBoundingClientRect(), paddleRight.getBoundingClientRect())

    const paddleLeftBox = paddleLeft.getBoundingClientRect()
    const paddleRightBox = paddleRight.getBoundingClientRect()
    // console.log('yt');
    const hitBoundsLeft = ball.left <= paddleLeftBox.right;
    const hitBoundsRight = ball.right >= paddleRightBox.left

    // console.log('hitBoundsRight', hitBoundsRight)
    // console.log('paddleRightBox', paddleRightBox)

    const hitPaddleLeft = hitBoundsLeft && (ball.bottom >= paddleLeftBox.top && ball.top <= paddleLeftBox.bottom);
    const hitPaddleRight = hitBoundsRight && (ball.bottom >= paddleRightBox.top && ball.top <= paddleRightBox.bottom);

    console.log('hitPaddleLeft hitPaddleRight', hitPaddleLeft, hitPaddleRight)
    // const hitWallTop = ball.top > this.x
    // const hitWallBottom = hitBoundsRight && (ball.bottom >= paddleRight.top && ball.top <= paddleRight.bottom);

    if (hitPaddleLeft) {
      this.ball.directionX = 'right'
      // if (ball.y - paddleLeft.y > 0) {
      this.ball.directionY = 1;
      console.log('HIT PADDLE LEFT', this.ball)

      // } else {
      this.ball.directionY = -1

      // }
    } else if (hitPaddleRight) {
      console.log('HIT PADDLE RIGHT', )
      this.ball.directionX = 'left'
    } else if (hitBoundsLeft || hitBoundsRight) {
      console.log('outOfBounds')
      this.outOfBounds = !this.outOfBounds
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
      tap(x => console.log('x', x)),
      map(({ paddleLeft, paddleRight, ball }) => {
        console.log('{ paddleLeft, paddleRight, ball }', paddleLeft, paddleRight, ball )
        return { paddleLeft:this.conver , paddleRight:this.conver , ball:this.conver  }
      }),
    );

    this.scene$.subscribe(this.detectCollision.bind(this))

  }

  makeAbsoluteContext(element, svgDocument) {
    return function(x, y) {
      var offset = svgDocument.getBoundingClientRect();
      var matrix = element.getScreenCTM();
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






// var bbox = elem.getBBox(),
//   middleX = bbox.x + (bbox.width / 2),
//   middleY = bbox.y + (bbox.height / 2);

// generate a conversion function

// use it to calculate the absolute center of the element

// var dot = svg.append('circle')
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
  },
  {
    x: 285,
    y: 450,
    width: 50,
    height: 225,
    handleRadius: 25,
    strokeWidth: 1,
    id: 'right',
  },
];

// const relayer = new ActionRelayer(sliderConfig)
// console.log('relayer', [...relayer])
// const sliderComp = new SliderGroup('#game', undefined, config)
const game = new Game('#game', sliderConfig);