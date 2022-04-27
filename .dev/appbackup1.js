const { combineLatest, iif, ReplaySubject, AsyncSubject, Subject, interval, of , fromEvent, merge, empty, delay, from } = rxjs;
const { mergeAll, sampleTime, throttleTime, mergeMap, switchMap, scan, take, takeWhile, map, tap, startWith, filter, mapTo } = rxjs.operators;


import { SliderGroup, ActionRelayer } from '../components/slider.js';
import { Paddle } from '../components/paddle.js';
import { Ball } from '../components/ball.js';

export class Game {
  constructor(selector, sliderConfig) {
    this.root = document.querySelector(selector);
    this.boardGroup = document.querySelector('#boardGroup');
    this.scene$;
    this.sliders = sliderConfig
      .reduce((acc, curr) => ({ ...acc, [curr.id]: new SliderGroup(this.root, undefined, curr) }), {});

    this.paddleLeft = new Paddle(this.root, this.root.querySelector('#leftPaddleGroup'), { input$: this.sliders.left.value$, height: 100, boardHeight: 425, width: 25, });
    this.paddleRight = new Paddle(this.root, this.root.querySelector('#rightPaddleGroup'), { input$: this.sliders.right.value$, height: 100, boardHeight: 400, boardWidth: window.innerWidth, width: 25, });
    this.ball = new Ball(this.root, this.boardGroup, this.paddles$, { input$: null, r: 8, boardHeight: 400, boardWidth: 384 })
    console.log('this.ball.position$', this.ball.position$)
    // this.ball.position$.subscribe(console.log)
    console.log('game', this);
    this.init();

  };

  detectCollision({ paddleLeft, paddleRight, ball }) {
    const pads = [paddleLeft, paddleRight]
    // console.log('balvl.cx + ball.r >= paddleRight.x ', ball.cx, ball.r, paddleRight.x)
    const poo = ball.cx - ball.r
    // console.log('poo', paddleLe,ft)
    // const adjustedX = (ball.cx + (ball.r) * 2) / (384 / 2)) * 100
  // console.log((
  //     ball.cx - ball.r <= paddleLeft.x + 50// &&
  //     // (ball.cy + ball.r <= paddleLeft.top &&
  //       // ball.cy - ball.r >= paddleLeft.bottom)
  //   ));
    if (
      (
        ball.cx - ball.r <= paddleLeft.x + 50 //&&
        // (ball.cy + ball.r <= paddleLeft.top &&
          // ball.cy - ball.r >= paddleLeft.bottom)
      )
    ) {
      this.ball.directionX = 'right'
      console.log('fail!');
    }
    if (
      (
        ((ball.cx + (ball.r)) / (384 / 2)) * 100 >= paddleRight.x - 25 //&&
        // (ball.cy + ball.r <= paddleRight.top &&
        // ball.cy - ball.r >= paddleRight.bottom)
      )
    ) {
      // console.table( paddleRight.x,ball.cx, ball.r )
      this.ball.directionX = 'left'
      // this.ball.changeX = -ball.changeX
      console.log('got em right');

    } else {
      // console.log('paddleLeft, paddleRight, ball', paddleLeft, paddleRight, ball)
      // console.log('got em');

    }
  }


  init() {
    this.scene$ = combineLatest(
      this.paddleLeft.position$,
      this.paddleRight.position$,
      this.ball.position$,
      (paddleLeft, paddleRight, ball) => ({ paddleLeft, paddleRight, ball })
    ).pipe(
      sampleTime(40),
      // takeWhile(({ spaceship, enemies }) => this.gameOver(spaceship, enemies) === false)
    );
    this.scene$.subscribe(this.detectCollision.bind(this))

  }


  get prop() { return this._prop; };
  set prop(newValue) { this._prop = newValue; };
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