import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
const { help, date, array, utils, text } = ham;

import { draggable } from '/src/view/services/draggable.service.js'
// import { GraphicsObject } from '/src/view/GraphicsObject.js'
import { CellMatrix } from '/src/view/models/collections/matrix.collection.js';
import { GridView } from '/src/view/Grid.view.js';
import { TileView } from '/src/view/Tile.view.js'
import { GridModel } from '/src/view/models/Grid.model.js';
import { animate } from '/src/animate.js';
import { Point } from '/src/view/geometry/Point.js'
// import { Collidable } from '/src/view/Collidable.js'
// import { Movable } from '/src/view/Movable.js'
import { Pawn } from '/src/view/actors/pawn.actor.js'
// import { Actor } from '/src/view/actors/actor.js'

// import { Graph } from '/src/view/Graph.js'

// import { GraphicsObject } from '/src/view/GraphicsObject.js'

const app = document.querySelector('#app');
const appBody = document.querySelector('#app-body')
const containers = document.querySelectorAll('.container')

const svg = document.querySelector('svg');
const surf = svg.querySelector('#surface');
const cells = document.querySelectorAll('.tile');


export class Omnibutton {
  constructor() {
    this.self = document.querySelector('#omnibutton');
    this.omnitext = this.self.querySelector('#omnibutton-text');
    this.omnishape = this.self.querySelector('#omnibutton-shape');
    this.omnicon = this.self.querySelector('#omnibutton-icon-filled')
    this._expand = false;
    this.self.addEventListener('click', this.handleClick.bind(this));
    this.self.addEventListener('dblclick', this.handleDblClick.bind(this));

    draggable(svg, this.self)

    this.rootTransforms = this.self.transform.baseVal;
    this.rootScale = svg.createSVGTransform();

    if (this.rootTransforms.length === 0) {
      this.rootTranslate = svg.createSVGTransform();
      this.rootScale.setScale(this.self.x / 8, this.self.y / 8);
      this.rootTransforms.insertItemBefore(this.rootTranslate, 0);
      this.rootTransforms.insertItemBefore(this.rootScale, 0);
    }
  };

  handleClick(e) {
    this.expand = !this.expand
    this.rx = this.expand ? 5 : 30
    this.width = this.expand ? 368 : 60
    this.height = this.expand ? 320 : 60
    this.y = this.expand ? -250 : 0


    this.self.querySelector('rect').setAttribute('rx', this.rx)
    this.self.querySelector('rect').setAttribute('width', this.width)
    this.self.querySelector('rect').setAttribute('height', this.height)
    this.self.querySelector('rect').setAttribute('y', this.y)

    this.omnicon.setAttribute('opacity', this.expand ? 0 : 1)
  }

  handleDblClick(e) {
    const vb = svg.viewBox.baseVal

    Object.assign(vb, {
      x: vb.x - 100,
      y: vb.y - 100,
      width: vb.width + 150,
      height: vb.height + 150,
    })
    this.rootScale.setScale(this.self.getBoundingClientRect().x + 200, this.self.getBoundingClientRect().y + 200);

  }

  get expand() { return this._expand }
  set expand(v) { this._expand = v }
}

const omnibutton = new Omnibutton()

// export class SvgCanvas {
//   constructor(svg = document.createElementNS(SVG_NS)) {
//     this.self = svg;
//     this.layers;
//   }
// }

setTimeout(() => {
  animate.peak()
}, 2000)

const valueType1 = (v) => utils.getValueType(v, true, true)



const createElement = (type, ...opts) => {
  const g = document.createElementNS(SVG_NS, 'g')
  const shape = document.createElementNS(SVG_NS, type)
  g.appendChild(shape);
  return g
}

const compareObjectsByValues = (a, b) => {
  if (Object.is(a, b)) return true

  return Object.entries(a).every(([k, v]) => {
    const vtype = utils.getValueType(v)

    // console.warn('a, b, [k, v], b[key]');
    // console.log(a, b, [k, v], b[k]);

    switch (vtype) {
      case 'array': {
        return v.every((el, i) => el === b[k][i])
        break;
      }
      case 'object': {
        return Object.entries(v).every((el, i) => el === b[k][i])
        break;
      }
      default:
        return b[k] && b[k] === v
    }

    if (Object.is()) {}
    return b[k] && b[k] === v
  })
}

const dims = { w: 10, h: 10 }
const coord1 = { row: 5, col: 7, dims: { w: 10, h: 10 } }
const coord2 = { row: 5, col: 7, dims: { w: 10, h: 10 } }

const coords1v2 = compareObjectsByValues(coord1, coord2)

draggable(svg, surf);

const targetIsTile = (e) => {
  return [...e.path].some(_ => _ instanceof Element && _.classList.contains('tile'))
};
// const targetIsTile = (e) => {
//   return [...e.path].some(_ => _ instanceof Element && _.classList.contains('tile'))
// };

const GridConfiguration = {
  size: { rows: 20, columns: 20 },
  cellSize: 50,
  // rows: 20,
}

const TileConfiguration = {
  row: 20,
  column: 20,
  size: 50,
  active: false,
  rendered: false,
}

const gridModel = new GridModel(GridConfiguration)

gridModel.generateMatrix(GridConfiguration.size)

const gridView = new GridView(svg)
gridView.load.bind(gridView)(gridModel.cells.matrix)


// const pawn = {

//   guy: document.createElementNS(SVG_NS, 'circle'),
//   guyGroup: document.createElementNS(SVG_NS, 'circle'),
// }


const guy = new Pawn(svg, 'bob');
// const guy = document.createElementNS(SVG_NS, 'circle');
// guy.classList.add('pawn')
// const guyGroup = document.createElementNS(SVG_NS, 'g')
// guyGroup.appendChild(guy)

// guy.fill = 'blue';
// guy.r.baseVal.value = 25
// guy.cx.baseVal.value = 25
// guy.cy.baseVal.value = 25;

// guy.point = new Point()

// gridView.self.append(guy)
gridView.self.append(guy.group)

// guy.definePath = (startPoint, destPoint) => {

//   const path = document.createElementNS(SVG_NS, 'path');
//   guyGroup.path = path;

//   let moves = [];

//   moves = [...moves, [startPoint.x, startPoint.y]]
//   moves = [...moves, [destPoint.toPixels().x, startPoint.y]]
//   moves = [...moves, [destPoint.toPixels().x, destPoint.toPixels().y - startPoint.y + 25]]


//   const d = ` M ${moves
//     .filter(_=>_)
//     .reduce((str, [x,y]) => `${str} ${x},${y}`,'')} `

//   guyGroup.path.setAttributeNS(null, 'd', d)
//   guyGroup.path.classList.add('actorpath')

//   return startPoint
// }

// guy.walk = (stepInterval) => {
//   const p = guyGroup.path.getPointAtLength(stepInterval * guyGroup.path.getTotalLength());

//   guy.setAttribute("transform", `translate(${p.x-25}, ${p.y-25})`);
//   guy.point = guy.point.subtract(p)
// }

export const anim = {
  duration: null,
  startTime: null,

  start: function(duration, startPoint, fn) {
    // fn = guy.walk
    this.duration = duration;
    this.startTime = Date.now();

    requestAnimationFrame(() => this.run(fn, startPoint));
  },

  run: function(fn, startPoint) {
    // This throttles dot walk?
    let u = Math.min((Date.now() - this.startTime) / this.duration, 1);

    if (u < 1) {
      // Keep requesting frames, till animation is ready
      requestAnimationFrame(() => this.run(fn, startPoint));
    } else {


      this.stop();
    }
    fn(u);
  },

  stop: function() {
    // console.log('che ck me ouy');
    guy.arrive()
    // guyGroup.removeChild(guyGroup.path)
  }
};




gridView.on('tile:active', e => {
  let duration;
  let tZero;

  const startPoint = e.detail.point
  guy.findPath(
    startPoint)

  // new Point(
  // {
  //   x: 0,
  //   y: 0,
  // }), startPoint)
  // x: guy.self.cx.baseVal.value,
  // y: guy.self.cy.baseVal.value
  // guy.definePath({ x: guy.cx.baseVal.value, y: guy.cy.baseVal.value }, startPoint)
  // guyGroup.insertBefore(guyGroup.path, guy)


  // console.log(guy.move);
  // const mod = (startPoint.x + -(guy.point.x)) / 2
  anim.start(1500, startPoint, guy.move);
  // tZero = Date.now();
  // requestAnimationFrame(() => run(dur, tZero, step));

  // const onFinish = () => {
  // Schedule the animation to restart
  // setTimeout(() => start(this.duration), 1000);
  // }

})


// svg.addEventListener('click', e => {
//   animate.toggle()
//   if (targetIsTile(e)) {

//     const t = e.target
//     const cell = gridModel.cell({ x: +t.dataset.column, y: +t.dataset.row })
//     const bbox = t.getBoundingClientRect()
//     console.log('SVG CKICK', { cell })

//     t.dataset.selected = t.dataset.selected === 'true' ? false : true

//     guy.move({ ...cell.point.toPixel() });

//     const vb = {
//       x: 0, //bb.left,// - 200,
//       y: 0, // bb.top,// - 200,
//       width: bbox.right, //+ 200,
//       height: bbox.bottom, //+ 200,
//     }
//     // Object.assign(svg.viewBox.baseVal, vb)
//     //.join(' ');
//     // svg.viewBox.baseVal.x = vb[0]
//   }
// });



// console.log('cells', cells[0].getBoundingClientRect())
