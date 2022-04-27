// import Node from '../models/Node.model.js';
import { TextNode } from './text-node.js';
import { Spatial } from './Spatial.js'
import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
const { date, array, utils, text, help } = ham;
const { from, race, interval, of , fromEvent, merge, empty, Subject } = rxjs;
const { bufferTime, bufferCount, bufferWhen, first, repeat, throttleTime, debounceTime, buffer, switchMap, concatMap, mergeMap, take, filter, scan, takeWhile, startWith, tap, map, mapTo } = rxjs.operators;

// const intervalEvents = interval(1000);
// const buffered = intervalEvents.pipe(bufferWhen(() => clicks));
// buffered.subscribe(x => console.log(x));




const TILE_DEFAULT = {
  type: 'rect',
  data: { coords: { x: null, y: null } },
  state: {
    content: '',
  },
  attrs: {
    fill: '#CCCCCC',
    x: '0',
    y: '0',
    width: '10',
    height: '10',
    style: 'fill:#CCCCCC;stroke:#000000;stroke-width:0.1;'
  }

}



// tile
export class Tile { //extends Spatial {
  constructor(canvas, coords, state, config = TILE_DEFAULT) {
    // super(canvas, 'rect', attrs);
    this.self = document.createElementNS(SVG_NS, 'g')

    this.state = state;
    // this.self = this.value
    this.canvas = canvas
    // console.log({canvas});
    this.shape = document.createElementNS(SVG_NS, 'rect')
    this.textNode = new TextNode(document.createElementNS('http://www.w3.org/2000/svg', 'text'), this);
    this.edges = new Map();
    // this.zIndex = zIndex;
    this.setCoords( coords);
    Object.assign(this, config.attrs)

    this.x = this.coords.x * this.width
    this.y = this.coords.y * this.height

    this._isSelected;
    this.isSelected = false;
    this._isFocused;
    this.isFocused = false;

    // this.isFocused.pipe(tap(x => console.log('heard isFocused chsnge pipe!', x)), ).subscribe()
    this.init(this.coords, config.attrs.fill);

    this._activeState = {
      value: 'INACTIVE',
      value$: new Subject(),
      isNewStateValid: (v) => ['INACTIVE', 'SELECTED', 'FOCUSED'].includes(v),
      validStates: ['INACTIVE', 'SELECTED', 'FOCUSED'],
    }

    this.rootTransforms = this.self.transform.baseVal;


    // this.rootTransforms = this.root.transform.baseVal;

    if (this.rootTransforms.length === 0) {
      this.rootTranslate = this.canvas.createSVGTransform();
      // this.rootScale = this.canvas.createSVGTransform();
      this.rootTranslate.setTranslate(coords.x * 10, coords.y*10);
      // this.rootScale.setScale(coords.x/8, coords.y/8);
      this.rootTransforms.insertItemBefore(this.rootTranslate, 0);
      // this.rootTransforms.insertItemBefore(this.rootScale, 0);
    }
  }

  // createSVGTransform() { return this.canvas.createSVGTransform() }



  init(pos, color) {
    this.classList('add', 'tile')
    this.shape.style.width=12
    this.shape.style.height=12
    this.self.dataset.column = pos.x
    this.self.dataset.row = pos.y
    this.x = pos.x*10
    this.y = pos.y*10
    
    this.self.dataset.nodeId = `[${pos.x,pos.y}]`
    this.shape.classList.add('tile_bg','grad2');
    this.shape.setAttributeNS(null, 'stroke-width', '1');
    this.shape.setAttributeNS(null, 'stroke', '#00000090');
    this.shape.setAttribute('fill', color || '#CCCCCC50');

    this.textNode.self.classList.add('tile_content')
    this.textNode.self.textContent = this.state.content || `[${pos.x,pos.y}]`
    this.textNode.self.setAttributeNS(null, 'text-anchor', 'middle');
    this.self.appendChild(this.shape);
    this.self.appendChild(this.textNode.self);
    
    this.setCoords(pos);
    this.setSize(pos);
    this.textTransforms = this.textNode.self.transform.baseVal;
    
      this.textScale = this.canvas.createSVGTransform();
      this.textScale.setScale(this.x/3, this.y/3);
      this.textTransforms.insertItemBefore(this.textScale, 0);
    
  }

  setActiveState(status = '') {
    this.activeState = status;
    return this.activeState
  }

  get activeState() { return this._activeState.value }
  set activeState(newState) {
    if (this.activeState !== newState && this._activeState.isNewStateValid(newState)) { //&& this._activeState.isNewStateValid(newState)) {
      this._activeState.value = newState;
      this._activeState.value$.next(this.activeState);
    } //else  console.log('activeState didnt chsnge, no emit, line 213 vertex');
  }
  get activeState$() { return this._activeState.value$.asObservable() }

  isEventSource(target) {
    return target ? [this.self, this.shape].includes(target) : null
  }

  classList(keyword, ...classes) {
    if (classes.length === 0 || !['add', 'remove'].includes(keyword)) return;
    this.self.classList[keyword](...classes)
    // this.shape.classList[keyword](...classes)
    if (!this.self.classList.contains('selected-vertex')) {
      this.shape.classList.remove(...classes)
    }
  }

  setRotate(angle) {
    let newPos = pos = this.position;
    newPos.x2 = pos - radius * Math.cos(angle);
    newPos.y2 = pos - radius * Math.sin(angle);
    this.setPosition(newPos);
  }

  setCoords({ x, y }) {
    this.x = x * this.width
    this.y = y * this.height
    this.shape.setAttributeNS(null, 'x', this.x);
    this.shape.setAttributeNS(null, 'y', this.y);
    this.textNode.self.setAttributeNS(null, 'x', this.centroid.x - ((parseInt(this.textNode.self.getAttributeNS(null, 'width')) || 0) / 2))
    this.textNode.self.setAttributeNS(null, 'y', this.centroid.y + ((parseInt(this.textNode.self.getAttributeNS(null, 'height')) || 0) / 2));
  }

  setSize({ width, height }) {
    this.width = width
    this.height = height
  }

  getTextAttribute(attr) {}
  setTextAttribute(attr, value) {
    this.textNode.self.setAttribute('x', this.centroid.x - ((parseInt(this.textNode.self.getAttribute('width')) || 0) / 2))
    this.textNode.self.setAttribute('y', this.centroid.y + ((parseInt(this.textNode.self.getAttribute('height')) || 0) / 2));
  }

  updateTextPosition(alignment = 'center') {
    this.textNode.self.setAttribute('x', this.centroid.x)
    this.textNode.self.setAttribute('y', this.centroid.y)
  }

  get isSelected() { return this._isSelected }
  set isSelected(newValue) {
    this._isSelected = newValue
    this.classList(this.isSelected ? 'add' : 'remove', 'selected-vertex')
  }

  get isFocused() { return this._isFocused }
  set isFocused(newValue) {
    this._isFocused = newValue
  }

  get centroid() {
    return {
      x: (this.x + this.width / 2) || 0,
      y: (this.y + this.height / 2) || 0,
    }
  }

  get size() { return { width: this.width, height: this.height, } }

  get coords() {
    return { x: this.x, y: this.y, }
  }

  get position() { return { x: this.x, y: this.y, width: this.width, height: this.height, } }
  set position({ x, y, width, height }) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  get x() { return parseInt(this.shape.getAttributeNS(null, 'x')) || 0 }
  set x(newValue) {
    this.self.style.x = newValue //setAttributeNS( 'x', newValue)
    this.self.setAttribute( 'x', newValue)
    this.shape.setAttributeNS(null, 'x', newValue)
    this.updateTextPosition();
  }

  get y() { return parseInt(this.shape.getAttributeNS(null, 'y')) || 0 }
  set y(newValue) { 
    this.self.setAttribute('y', newValue)
    this.shape.setAttributeNS(null, 'y', newValue)
    this.updateTextPosition();
  }

  get width() { return parseInt(this.shape.getAttribute('width')) || 0 }
  set width(newValue) {
    this.self.setAttribute('width', newValue)
    this.shape.setAttribute('width', newValue)
    this.updateTextPosition();
  }

  get height() { return parseInt(this.shape.getAttribute('height')) || 0; }
  set height(newValue) {
    this.self.setAttribute('height', newValue)
    this.shape.setAttribute('height', newValue)
    this.updateTextPosition();
  }
}
