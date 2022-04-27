import { Point } from '/src/view/geometry/Point.js'
import { Actor } from './actor-base.js';

const DEFAULT_ATTRIBUTES = {
  row: 0,
  column: 0,
  r: 25,
  // cx: 25,
  // cy: 25,
  fill: 'blue'
}

export class Pawn extends Actor {
  constructor(svg, name, attributes = {}) {
    attributes = { ...DEFAULT_ATTRIBUTES, ...attributes }
    super(svg, 'circle', attributes)

    this.name = 'pawn';
    this.transform;
    this.currentPosition;
    this.coords;
    this.path;
    this.self = document.createElementNS(SVG_NS, 'circle')
    this.group = document.createElementNS(SVG_NS, 'g')
    this.point = this.getPoint()
    this.group.appendChild(this.self)
    this.cx = this.cx + attributes.r
    this.cy = this.cy + attributes.r
    this.transform = this.transforms.getItem(0);
      this.selfTranslate =svg.createSVGTransform();

    if (this.transforms.length === 0) {
      this.selfTranslate.setTranslate(coords.x * 10, coords.y * 10);
      this.transforms.insertItemBefore(this.selfTranslate, 0);
    }

    Object.assign(this, attributes);
    this.move = this._move.bind(this)
    // console.log('pawn', this);

  }

  render() {
    this.group.appendChild(this.self);
    return this.self;
  }

  _move(stepInterval) {

    const p = this.path.getPointAtLength(stepInterval * this.path.getTotalLength());
    this.self.setAttribute("transform", `translate(${p.x-25}, ${p.y-25})`);
    // this.point = this.point.subtract(p)
    // this.currentPosition = p
    // const p = this.path.getPointAtLength(stepInterval * this.path.getTotalLength());
    // this.translate.bind(this)({x:p.x,y:p.y})
    // this.point = this.point.subtract(p)
    // console.log('moving', this.point);
    // return this.arrive.bind(this)
  }

  findPath(destPoint) {
    this.destinationPoint = destPoint;
    this.definePath(this.point, destPoint)

    // return (stepInterval) => this.move.bind(this)(this.path, stepInterval)
  }

  arrive() {
    this.popPath();
    this.point = this.getPoint.bind(this)(this.destinationPoint.x, this.destinationPoint.y)
    // this.dispatchEvent(new CustomEvent('actor:arrive', { detail: { target: this.point } }))
  
  this.cx = this.point.toPixels().x
  this.cy = this.point.toPixels().y
    this.selfTranslate.setTranslate(0,0)
    // this.currentPosition = this.point
  }

  get edges() { return }

  set edges(v) {}


  popPath() {
    if (this.path instanceof Element) {
      this.group.removeChild(this.path)
    }
  }

  translate(point) {
    this.currentPosition = { x: this.point.x, y: this.point.y }
  }

  get currentPosition() { return { x: this.changeX, y: this.changeY } }

  set currentPosition({ x, y }) {
    // console.log(this.point.add());//
    // this.point = this.point.add(x,y)
    this.selfTranslate.setTranslate(this.destinationPoint.x, this.destinationPoint.y)
    
    // console.log(this);
    
  }


  getPoint(x, y) { return new Point(x, y) }

  definePath(startPoint, destPoint) {
    this.path = document.createElementNS(SVG_NS, 'path');

    let moves = [];
    moves = [...moves, [startPoint.x, startPoint.y + 25]]
    moves = [...moves, [destPoint.toPixels().x, startPoint.y + 25]]
    moves = [...moves, [destPoint.toPixels().x, destPoint.toPixels().y - startPoint.y]]

    this.path.setAttributeNS(null, 'd', ` M ${
      moves
        .filter(_=>_)
        .reduce((str, [x,y]) => `${str} ${x},${y}`,'')
    } `);
    // console.log('startPoint, destPoint', startPoint, destPoint)
    // this.path.setAttributeNS(null, 'd', d)
    this.path.classList.add('actorpath')
    // this.group.appendChild(this.path)
    this.group.insertBefore(this.path, this.self)
    // console.log('in define path', this);
    // g/ridView.self.append(path)
    return this.path
  }
}
