import { Point } from '/src/view/geometry/Point.js'

export class TileView { //extends GraphicsObject {
  constructor(grid, el, config = { size: 50 }) {
    if (!grid) throw Error('no svg in layer constructor');
    this.self = el || document.createElementNS(SVG_NS, 'path');
    this._point;
    this.grid = grid || document.querySelector('#surface')
    this._column
    this._row
    this.group = document.createElementNS(SVG_NS, 'g');
    this.group.classList.add('tile')
    this.size = config.size || config.cellSize

    // Object.assign(this.group, this.point());
    this.point = new Point(this.column, this.row, this.size)
    this.group.appendChild(this.self);
    this.grid.self.appendChild(this.group)

    // this.self = document.createElementNS(SVG_NS, 'path')
    this.render = () => this.render1.bind(this)()
    // this.self.appendChild(this.self);
    // this.row = config.row
    // this.column = config.column

    this.self.addEventListener('tile:active', this.handleActivation.bind(this))

    this.group.addEventListener('click', e => {
      console.log('click ib tile', e.target.id);
      this.self.dispatchEvent(new CustomEvent('tile:click', { bubbles: true, detail: { target: this } }))
    });
  }

  handleActivation(e) {
    if (this.hasPoint(e.detail.point)) {
      console.log('point matches tile', e.detail.coords);
      this.active = true;
    }
  }

  calculateEdges(r, c, size) {
    console.log({ r, c, size });
    let x = c * size
    let y = r * size
    let w = x + size
    let h = y + size
    const p1 = [[x, y]];
    const p2 = [...p1, [w, y]];
    const p3 = [...p2, [w, h]];
    const p4 = [...p3, [x, w]];
    const p5 = [...p4, [x, y]];
    console.warn('[...p4, p1]', { p1, p2, p3, p4, p5 })
    return p5
  }

  point() { return new Point(this.column, this.row) }
  hasPoint({ x, y }) { return this.point.x === x && this.point.y === y }

  render1() {
    // this.edges = this.calculateEdges(this.row, this.column, this.size)

    const d = ` M ${this.edges
    .filter(_=>_)
    .reduce((str, [x,y]) => `${str} ${x},${y}`,'')} Z`

    this.self.setAttributeNS(null, 'd', d)
    // console.log('this.self TILE AFTR RENDER', this.self)
    return this.self
    // initial loading of view state and actors
    // probably just into memory 
    // to prepare for initial render();
  }
  get id() { return this.self.id }
  set id(v) { this.self.id = v }
  get width() { return +this.dataset.width || null }
  set width(v) { this.dataset.width = v }

  set active(v) {
    this.dataset.active = v;
    if (v === false) {
      this.notifyNeighbors()
    }
  }

  // get point() { return t }
  get isOccupied() { return false }

  get parent() { return this.self.parentElement }

  get row() { return +this.self.dataset.row || null }

  set row(v) {
    this._row = v;
    this.dataset.row = v;
  }

  get column() { return +this.self.dataset.column || null }

  set column(v) {
    this.self.dataset.column = v;
    this.dataset.column = v;
  }

  // get row() { return this._row || null }

  get getBoundingClientRect() { return this.self.getBoundingClientRect() }

  get dataset() { return this.self.dataset }
}



class TileView2 { //extends GraphicsObject {
  constructor(grid, config) {
    if (!grid) throw Error('no svg in layer constructor');
    this.svg = grid.svg;
    Object.assign(this, config);

    // this.self = createElement('path')
    this.group = document.createElementNS(SVG_NS, 'g')
    this.group.appendChild(this.self);

    this.row
    this.grid = grid;
    this.column
    // this._d = [
    //   [x, y],
    //   [x, y],
    //   [x, y],
    //   [x, y],
    // ];
    const template = ` 
    <path class="tile" id="tile-r0c0" data-row="0" data-column="0" 
      d=" M 
        0,0 
        50,0 
        50,50 
        0,50 
        0,0 
      Z" />`
  }


  // get width() { return +this.dataset.width || null}
  // set width(v) { this.dataset.width = v }

  get row() { return +this.dataset.row || null }
  set row(v) { this.dataset.row = v }

  get column() { return +this.dataset.column || null }
  set column(v) { this.dataset.column = v }
  get getBoundingClientRect() { return this.self.getBoundingClientRect() }
  // get dataset() { return this.self.dataset }
}
