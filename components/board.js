import { Collidable } from './Collidable.js'
// import { Spatial } from './Spatial.js'

const { iif, Observable, BehaviorSubject, AsyncSubject, Subject, interval, of , fromEvent, merge, empty, delay, from } = rxjs;
const { throttleTime, mergeMap, switchMap, scan, take, takeWhile, map, tap, startWith, filter, mapTo } = rxjs.operators;

const boardattrs = {
  id: null,
  classList: null,
  x: null,
  y: null,
  width: null,
  height: null,
  fill: null,
  stroke: null,
}
console.log('b4 bosrs');

export class Board extends Collidable {
  constructor(parentSVG, attrs) {
    super({ parentSVG, type: 'rect', attrs, isContainer: true })
  }
} { Board }