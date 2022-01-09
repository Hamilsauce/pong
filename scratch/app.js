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
    this.outOfBounds = false
    this.paddleLeft = new Paddle(this.root, this.boardGroup, 'leftPaddle', { input$: this.sliders.left.value$, side: 'left', height: 100, width: 25, boardHeight: 400, boardWidth: window.innerWidth, });
    this.paddleRight = new Paddle(this.root, this.boardGroup, 'rightPaddle', { input$: this.sliders.right.value$, side: 'right', height: 100, width: 25, boardHeight: 400, boardWidth: window.innerWidth, });
    this.ball = new Ball(this.root, this.boardGroup, this.paddles$, { input$: null, r: 8, boardHeight: 400, boardWidth: 384 })
    this.init();

  };

  detectCollision({ paddleLeft, paddleRight, ball }) {
    const paddleLeftBox = paddleLeft.getBoundingClientRect()
    const paddleRightBox = paddleRight.getBoundingClientRect()
    const ballBox = ball.getBoundingClientRect()

    const hitBoundsLeft = ballBox.left <= paddleLeftBox.right;
    const hitPaddleLeft = hitBoundsLeft && (ballBox.bottom >= paddleLeftBox.top && ballBox.top <= paddleLeftBox.bottom);
    const hitBoundsRight = ballBox.right >= paddleRightBox.left
    const hitPaddleRight = hitBoundsRight && (ballBox.bottom >= paddleRightBox.top && ballBox.top <= paddleRightBox.bottom);

    if (hitPaddleLeft) {
      this.ball.directionX = 'right'
      console.log('right');
    } else if (hitPaddleRight) {
      this.ball.directionX = 'left'
      console.log('left');
    } else if (hitBoundsLeft || hitBoundsRight) {
      this.outOfBounds = !this.outOfBounds
      // this.boardGroupPause = pauseAnimations(6000)
      // this.animations.pauseAnimations()
    }
    console.log('going');

  }


  init() {
    this.scene$ = combineLatest(
      this.paddleLeft.position$,
      this.paddleRight.position$,
      this.ball.position$,
      (paddleLeft, paddleRight, ball) => ({ paddleLeft, paddleRight, ball })
    ).pipe(
      sampleTime(40),
      takeWhile(() => !this.outOfBounds)
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