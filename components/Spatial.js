import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
const { help, DOM, date, array, utils, text } = ham;
const { iif, Observable, BehaviorSubject, AsyncSubject, Subject, interval, of , fromEvent, merge, empty, delay, from } = rxjs;
const { throttleTime, mergeMap, switchMap, scan, take, takeWhile, map, tap, startWith, filter, mapTo } = rxjs.operators;

const ShapeTypeMap = new Map()

const DefaultConfig = {
  isDefault: true,
  data: {},
  classList: [],
  id: null,
  x: 0,
  y: 0,
  height: 0,
  width: 0,
  stroke: 0,
  strokeWidth: 0,
  cx: 0,
  cy: 0,
  x1: 0,
  x2: 0,
  y1: 0,
  y2: 0,
  fill: null,
}

export class Spatial {
  constructor(parentSVG, type = 'rect', attrs = {}) {
    this.attrs = attrs;
    this._parentSVG = parentSVG;
    this.root = document.createElementNS(this.namespaceURI, type)

    Object.entries(attrs || {}).forEach(([key, value]) => {
      this[key] = value;

    });

    // this.originY = (this.attrs.boardHeight / 2);
    // this.changeY = this.originY;
    // this.originX = (this.attrs.boardWidth / 2);
    // this.changeX = t;his.originX;

    this.CTM;
    this.coord;
    // ? TRANSFORMS GO IN MOVABLE?
    // this.spatialTransforms = this.root.transform.baseVal;
    // if (this.spatialTransforms.length === 0) {
    //   this.SpatialTranslate = this.parentSVG.createSVGTransform();
    //   this.SpatialTranslate.setTranslate(this.originX, this.originY);
    //   this.spatialTransforms.insertItemBefore(this.SpatialTranslate, 0);
    // }
  }



  get namespaceURI() { return 'http://www.w3.org/2000/svg' }
  get dataset() { return this.root.dataset }
  set dataset(val) { Object.entries(val).forEach(([prop, value]) => this.root.dataset[prop] = value) }



  get classList() { return this.root.classList }
  set classList(val) { this.root.classList.add(...val) }
  get id() { return this.root.id }
  set id(val) { this.root.id = val }
  get parentSVG() { return this._parentSVG }
  set parentSVG(val) { this._parentSVG = val }
 
 
  get radiusX() { return this.width / 2 }
  get radiusY() { return this.height / 2 }
  get centroid() {
    return {
      x: this.x + this.radiusX,
      y: this.y + this.radiusY,
    }
  }

  get x() {
    return this.root.x.baseVal.value || 0
  }
  set x(val) { this.root.x.baseVal.value = val }
  get y() { return this.root.y.baseVal.value || 0 }
  set y(val) { this.root.y.baseVal.value = val }
  get cx() {
    try {
      return this.root.cx.baseVal.value;
    } catch (e) {
      return null;
    }
  }
  set cx(val) { this.root.cx.baseVal.value = val }
  get cy() { return this.root.cy.baseVal.value || 0 }
  set cy(val) { this.root.cy.baseVal.value = val }
  get r() { return this.root.r.baseVal.value || 0 }
  set r(val) { this.root.r.baseVal.value = val }
  get height() { return this.root.height.baseVal.value || 0 }
  set height(val) { this.root.height.baseVal.value = val }
  get width() { return this.root.width.baseVal.value || 0 }
  set width(val) { this.root.width.baseVal.value = val }
  get x1() { return this.root.x1.baseVal.value || 0 }
  set x2(val) { this.root.x2.baseVal.value = val }
  get y1() { return this.root.y1.baseVal.value || 0 }
  set y2(val) { this.root.y2.baseVal.value = val }
  get fill() { return this.root.getAttribute('fill') }
  set fill(val) { this.root.setAttribute('fill', val) }
}

{
  Spatial
}