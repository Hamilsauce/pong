const { iif, ReplaySubject, AsyncSubject, Subject, interval, of, fromEvent, merge, empty, delay, from } = rxjs;
const { throttleTime, mergeMap, switchMap, scan, take, takeWhile, map, tap, startWith, filter, mapTo } = rxjs.operators;


import { SliderGroup, ActionRelayer } from '../components/slider.js';
import { Paddle } from '../components/paddle.js';

export class Game {
  constructor(selector, sliderConfig) {
    this.root = document.querySelector(selector);
    this.sliders = sliderConfig
      .reduce((acc, curr) => ({ ...acc, [curr.id]: new SliderGroup(this.root, undefined, curr) }), {});

    this.paddleLeft = new Paddle(this.root, this.root.querySelector('#leftPaddleGroup'), { input$: this.sliders.left.value$, height: 100, boardHeight: 425, width: 25, });
    this.paddleRight = new Paddle(this.root, this.root.querySelector('#rightPaddleGroup'), { input$: this.sliders.right.value$, height: 100, boardHeight: 425, width: 25, });

    console.log('game', this);
  };
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