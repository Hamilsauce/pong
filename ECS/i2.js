const app = document.querySelector('#app');
const canvas = document.querySelector('#canvas');
const containers = document.querySelectorAll('.container')
const tiles = [...document.querySelectorAll('.tile')]
// const tiles = [...document.querySelectorAll('.tile')]
const grid = document.querySelector('#grid');
const TILE_SIZE = 10;

export class SmartTile {
  constructor() {
    
  }
  
  get prop() { return this._prop };
  set prop(newValue) { this._prop = newValue };
}

const createText = (value, parent) => {
  const textNode = document.createElementNS(SVG_NS, "text");
  const text = document.createTextNode(value);
  textNode.appendChild(text);
  textNode.classList.add('text-node');
  textNode.setAttributeNS(null, 'text-anchor', 'middle');
  textNode.setAttribute('x', -25)
  textNode.setAttribute('y', -22.4)
  textNode.setAttribute('transform', 'scale(0.6)')
  parent.prepend(textNode);
  return textNode;
}

grid.addEventListener('click', e => {
  const tileTarget = e.target.closest('.tile');
  console.log('tileTarget', tileTarget.getBoundingClientRect())
  tileTarget.prepend(document.createElementNS(SVG_NS, 'rect'));

});


tiles.forEach((t, i) => {
  const { row, column } = t.dataset
  console.log(+row, +column);
  createText(`${row}, ${column}`, t)
})
