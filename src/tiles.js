import Rect from './view/geometry/shapes/Rect.js'
// import { Tile } from './view/actors/tile.component.js'
import { draggable } from './view/services/draggable.service.js';


export class Surface {
  constructor(el = document.querySelector('#surface'), spatialConfig) {
    this.self = el;

    // this.config = spatialConfig ? spatialConfig : {
    //   x: surfBBox.left,
    //   y: surfBBox.top,
    //   width: surfBBox.width,
    //   height: surfBBox.height,
    //   bottom: surfBBox.bottom,
    //   left: surfBBox.left,
    // }
  }
  set bottom(v) {
    this._bottom = v
    console.log({ v });
  }


  get r() { return this.config.width / 2 };
  
  get centroid() {
    return {
      x: this.config.width - this.r,
      y: this.config.height - this.r
    }
  };

  get originTile() { return this._originTile };
 
  set originTile(newValue) { this._originTile = newValue };
}


const board = document.querySelector('svg');
const boardTiles = board.querySelector('.boardTile');

const surfEl = board.querySelector('#surface')
const surfBBox = surfEl.getBoundingClientRect()
const surf = new Surface(surfEl)

console.log({ surf });
// const surfBBox = surf.getBoundingClientRect()

console.log('surfBBox', surfBBox)

const tiles = board.querySelectorAll('rect')


export const renderCollection = (collection, parent, count = 1) => {
  const gridSize = { rows: 8, columns: 8 }

  let tileMap = []

  if (typeof count === 'number') {
    for (let i = 0; i <= count; i++) {
      // const ir= { x: col, y: row }

      const width = 20;
      const height = 20;
      const tile = new Rect({ x: count * width, y: count * height, height, width }, '#000000', board, '#ffffff', '#000000')

      tile.self.classList.add('tile')
      draggable(board, tile.self)

      parent.append(tile.self)
      tileMap = [...tileMap, tile]
    }
  }
  else {

    for (let row = 0; row <= gridSize.rows; row++) {
      for (let col = 0; col <= gridSize.columns; col++) {
        const pos = { x: col, y: row }
        const width = 20;
        const height = 20;
        const tile = new Rect({ x: col, y: row, height: 25, width: 25 }, '#000000', board, '#ffffff', '#000000')

        tile.self.classList.add('tile')
        draggable(board, tile.self)

        boardTiles.append(tile.self)
        tileMap = [...tileMap, tile]
      }
    }
  }
}





// tiles.forEach((t, i) => {
//   const tileG = document.createElementNS(SVG_NS, 'g');
//   tileG.append(t);

//   const textNode = document.createElementNS(SVG_NS, 'text');
//   textNode.setAttributeNS(null, 'text-anchor', 'middle');
//   textNode.classList.add('text-node'); //to make div fit text

//   const textValue = 'poop' + i;
//   const text = document.createTextNode(textValue);


//   textNode.append(text)
//   tileG.append(textNode)

//   // console.log(t.getBoundingClientRect())
//   // console.log(t);
// });


const tiles2 = [...board.querySelectorAll('rect')]
console.log('tiles2', tiles2)

// export class Tile {
//   constructor(canvas, data) {

//     this.self = document.querySelector(selector || 'svg');
//     this.tiles;

//   }

//   generateTiles(gridSize = { x: 9, y: 9 }) {

//   }

//   createTile(coords) {}

//   get prop() { return this._prop };
//   set prop(newValue) { this._prop = newValue };
// }


export class TileMap {
  constructor(canvas, data) {

    this.self = document.querySelector(selector || 'svg');
    this.tiles;

  }

  generateGrid(gridSize = { x: 9, y: 9 }) {

  }

  createTile(coords) {}

  get prop() { return this._prop };
  set prop(newValue) { this._prop = newValue };
}



export class Board {
  constructor(selector = '#board') {
    this.self = document.querySelector(selector || 'svg');
    this.tiles;

  }

  generateTiles(gridSize = { x: 9, y: 9 }) {

  }

  createTile(coords) {}

  get prop() { return this._prop };
  set prop(newValue) { this._prop = newValue };
}
