// import { Collidable } from './Collidable.js'
import { Spatial } from './Spatial.js'

const { iif, Observable, BehaviorSubject, AsyncSubject, Subject, interval, of , fromEvent, merge, empty, delay, from } = rxjs;
const { throttleTime, mergeMap, switchMap, scan, take, takeWhile, map, tap, startWith, filter, mapTo } = rxjs.operators;

const boardConfig = {
  id:null,
  classList:null,
  x:null,
  y:null,
  width:null,
  height:null,
  fill:null,
  stroke:null,
}
console.log('b4 bosrs');

export class Board extends Spatial {
  constructor(parentSvg, type = 'rect', config){
  // constructor(parentSvg, type = 'rect', config = { input$: null, height: 100, boardHeight: 400, boardHeight: 384 }) {
    super(parentSvg, type, config)
    console.log('IN BOARD CONSTRUCTOR', this);
  }
}
console.log(Board);
{ Board }