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
  constructor(parentSVG, attrs) {
    super({ parentSVG, type: 'rect', attrs, isContainer: true })
  }
}