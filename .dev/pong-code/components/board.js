import { Collidable } from './Collidable.js'

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


export class Board extends Collidable {
  constructor(canvas, attrs) {
    super({ canvas, type: 'rect', attrs, isContainer: true })
  }
} { Board }
