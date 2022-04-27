import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
const { date, array, utils, text } = ham;
import { EventEmitter } from '/src/event-target.js'
import { animate } from '/src/game-engine/main-loop.engine.js'
// import { animate } from '/src/game-engine/animate(loop).js'
import { start, instruct } from '/src/game-engine/loop.engine.js'
// console.log({ gloop });
const app = document.querySelector('#app');
const containers = document.querySelectorAll('.container')
const tiles = [...document.querySelectorAll('.tile')]
// const tiles = [...document.querySelectorAll('.tile')]
const surface = document.querySelector('#surface');
const gridFace = document.querySelector('#grid-face');
const TILE_SIZE = 10;

export class SmartTile {
  constructor() {}

  get prop() { return this._prop };
  set prop(newValue) { this._prop = newValue };
}

const svg = document.querySelector('svg')

const createText = (value, parent) => {
  const textNode = document.createElementNS(SVG_NS, "text");
  const text = document.createTextNode(value);
  textNode.appendChild(text);
  textNode.classList.add('text-node');
  textNode.setAttributeNS(null, 'text-anchor', 'middle');
  textNode.setAttribute('x', 0.5)
  textNode.setAttribute('y', 0.6)

  textNode.setAttribute('transform', 'translate(0,0)')
  parent.prepend(textNode);

  return textNode;
}

// svg.addEventListener('click', e => {
//   const tileTarget = e.target.closest('.tile');
//   console.log('click', e.target)
// });

let vectors = []

tiles.forEach((t, i) => {
  const { row, column } = t.dataset
  const r = document.createElementNS(SVG_NS, 'rect')
  r.classList.add('tile-face');

  r.height.baseVal.value = 1
  r.width.baseVal.value = 1

  r.setAttribute('fill', 'none')
  r.setAttribute('stroke', 'none')
  r.setAttribute('stroke-width', '0')

  const tn = createText(`${row}, ${column}`, t);
  t.insertBefore(r, tn)

  t.addEventListener('click', e => {
    e.preventDefault()
    // e.stopPropagation()
    const tileTarget = e.target.closest('.tile');
    // console.log('Tile click', e.target);
    t.dataset.active = t.dataset.active === 'true' ? false : true

    if (t.dataset.active === 'true') {
      vectors.push([[+t.dataset.row, +t.dataset.column]])

    }
  });
})



import { Actor } from '/ECS/entities/ActorBase.entity.js'

export class Actor2 {
  constructor(name, type, svg) {
    this.name = name
    this.self = svg.querySelector('.actor')
    this.type = type;
    this.svg = svg;
    this.destination = { x: 5, y: 5 }
    this.transforms = this.self.transform.baseVal;
    this.selfTranslate = this.svg.createSVGTransform();
    this.vel = 0.1
    // this.x = 0.1 
    // this.y  =0.1


    if (this.transforms.length === 0) {
      this.selfTranslate.setTranslate(0, 0);
      this.transforms.insertItemBefore(this.selfTranslate, 0);
    }
  }
  get cx() { try { return this.self.cx.animVal.value } catch (e) { return null } }

  set cx(val) { this.self.cx.baseVal.value = val }

  get cy() { try { return this.self.cy.animVal.value } catch (e) { return null } }

  set cy(val) { this.self.cy.baseVal.value = val }

  static create(name, type, svg) {
    const a = new Actor(name, type, svg);

    // a.connect(a.update)
    return a;
  }

  move(delta) {
    delta = delta
    // let { x, y } = this.destination
    // console.trace('yo');
    // if (this.cx >= this.destination.x || this.cy >=this.destination.y) {
    // console.log('cx or cy excedes', this.cx, this.cy);
    //   return
    // }

    let x = this.cx + (this.vel / delta)
    let y = this.cy + (this.vel / delta * 1)
    // boxPos += boxVelocity * delta;
    // Switch directions if we go too far
    // if (boxPos >= limit || boxPos <= 0) boxVelocity = -boxVelocity;


    this.transform = this.transforms.getItem(0);
    this.selfTranslate.setTranslate(x, y)

  }

  update(delta) {
    this.move.bind(this)(delta || 1)
    // console.log('Actor delta', delta);
  }

  connect(connector) {
    connector.bind(this)(this.update.bind(this));
    // connector.bind(this)(this.update);
    // this.gameLoopConnector(this.update.bind(this));
  }


  get prop() { return this._prop };
  set prop(newValue) { this._prop = newValue };
}

const actor1 = new Actor(svg.querySelector('.actor'), { x: 0, y: 0 }, svg, { velocity: 0.8 })
// const actor1 = Actor.create('#john', 'pawn', svg)
// actor1.destination = { x: 2.5, y: 2.5, }
// animate.addUpdate(actor1.update.bind(actor1))
// animate.start()2.5
// await instruct(actor1.self, { x: 1, y: 1 })
// start(actor1.self, {x:0,y:0})
// animate.start(actor1.update.bind(actor1))


// document.querySelector('#point-submit')
// .addEventListener('click', e => {
//   const xin = +document.querySelector('.xInput').textContent
//   const yin = +document.querySelector('.yInput').textContent
//   console.log('click', xin, yin);
//   instruct(actor1.self, { x: xin, y: yin })

// });


svg.addEventListener('click', e => {

console.log(e.clientX, e.clientY);
  const t = e.target.closest('.tile')
  const xin = +t.dataset.column
  const yin = +t.dataset.row
  const path = actor1.setPath({ x: xin, y: yin })
  console.log({ path });

  
  start(actor1.self, actor1.moveTo(path))
  // instruct(actor1.self, { x: xin, y: yin })

});

const MatrixRow = { columns: [] }

const MatrixColumn = { point: { x: 0, y: 0 } }

// const matExample = { rows: [{ columns: [] }] }


export class SubArray extends Array{
  constructor() {
super()
  };
}

class Matrix extends EventTarget {
  constructor() {
    super()
    this.rows;

  };
}

import { range } from '/lib/collection.helpers.js'
const createMatrix = (r, c) => {
  const m = new Matrix()
  return Object.assign(m,range(0, r)
    .reduce((matrix, row, rowIndex) => {
      row = { columns: [] }
      for (let col = 0; col < c; col++) {
        const newCol = { x: col, y: rowIndex }
        row.columns = [...row.columns, newCol]
      }
      return {
        ...matrix,
        rows: [
          ...matrix.rows,
           row
        ],
      };
    }, { rows: [] }));
}





const colSeed = (colCount) => {}
const newMatrix = createMatrix(5, 5)

const matty = newMatrix

matty .addEventListener('click', e => {
  
  console.warn('HEARD CLICK IN MATTY');
});

console.log('matty', { matty })

window.matrix = matty


// console.log(array.zip(
//   range(0, 25),
//   range(0, 25).sort() // => a - b > 0 ? a : b)
// ));
// Move to cartesian coordinates x,y
// function move(pathArray, x, y, init = false) {
//   if (init) {
//     pathArray.push(' M ', `${x},${y} `);
//   } else {
//     pathArray.push(`${x},${y} `);
//   }
// }
