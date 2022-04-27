import Node from '/src/view/models/Node.model.js'
import TextNode from '/src/view/geometry/TextNode.js'

const _SVG_NS = 'http://www.w3.org/2000/svg';

// RECT
export default class extends Node {
  constructor(pos, color, graph, fill = '#ffffff', stroke = '#000000') {
    super(document.createElementNS(_SVG_NS, 'g'));
    this.graph = graph;
    this.self = this.value
    this.rect = document.createElementNS(_SVG_NS, 'rect')
    this.textNode = new TextNode(document.createElementNS('http://www.w3.org/2000/svg', 'text'), this);
    this.init(pos, color)

    this.edges = new Map();
    this.self.addEventListener('dblclick', this.handleDoubleClick.bind(this));
    this.self.addEventListener('click', this.handleClick.bind(this));
  }

  init(pos, color) {
    this.self.classList.add('node');
    this.self.dataset.nodeType = 'rect'
    this.self.dataset.nodeId = 'node1'

    this.rect.classList.add('rect');
    this.rect.setAttributeNS(null, 'stroke-width', '2');
    this.rect.setAttributeNS(null, 'stroke', color);
    this.rect.setAttributeNS(null, 'fill', color);
    this.rect.setAttributeNS(null, 'fill', color);

    this.textNode.element.textContent = 'texter!'
    this.textNode.element.setAttributeNS(null, 'text-anchor', 'middle');

    this.self.appendChild(this.rect);
    this.self.appendChild(this.textNode.element);
    // this.wrapper.appendChild(this.self);
    this.setCoords(pos);
    this.setSize(pos);

  }

  handleClick(e) {
    if (this.graph.selectMode || this.graph.addEdgeMode) {
      const evt = new CustomEvent('node-select', { bubbles: true, detail: { target: this } })
      this.self.dispatchEvent(evt);
    }
    e.stopPropagation();
    e.preventDefault();
  }

  handleDoubleClick(e) {
    this.textNode.editMode = !this.textNode.editMode
    e.preventDefault();
    e.stopPropagation();
  }

  setRotate(angle) {
    let newPos = pos = this.position;
    newPos.x2 = pos - radius * Math.cos(angle);
    newPos.y2 = pos - radius * Math.sin(angle);
    this.setPosition(newPos);
  }


  setCoords({ x, y }) {
    this.x = x
    this.y = y
    this.textNode.element.setAttribute('x', this.centroid.x - ((parseInt(this.textNode.element.getAttribute('width')) || 0) / 2))
    this.textNode.element.setAttribute('y', this.centroid.y + ((parseInt(this.textNode.element.getAttribute('height')) || 0) / 2));
  }
  setSize({ width, height }) {
    this.width = width
    this.height = height
  }
getTextAttribute(attr) {}
  setTextAttribute(attr, value) {
    this.textNode.element.setAttribute('x', this.centroid.x - ((parseInt(this.textNode.element.getAttribute('width')) || 0) / 2))
    this.textNode.element.setAttribute('y', this.centroid.y + ((parseInt(this.textNode.element.getAttribute('height')) || 0) / 2));
  }
  updateTextPosition(alignment = 'center') {
    this.textNode.element.setAttribute('x', this.centroid.x)
    this.textNode.element.setAttribute('y', this.centroid.y)
  }
  get centroid() {
    return {
      x: (this.x + this.width / 2) || 0,
      y: (this.y + this.height / 2) || 0,
    }
  }

  get size() { return { width: this.width, height: this.height, } }

  get coords() { return { x: this.x, y: this.y, } }

  get position() { return { x: this.x, y: this.y, width: this.width, height: this.height, } }
  set position({ x, y, width, height }) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  get x() { return parseInt(this.rect.getAttribute('x')) || 0 }
  set x(newValue) {
    this.rect.setAttribute('x', newValue)
    this.updateTextPosition();
  }

  get y() { return parseInt(this.rect.getAttribute('y')) || 0 }
  set y(newValue) {
    this.rect.setAttribute('y', newValue)
    this.updateTextPosition();
  }

  get width() { return parseInt(this.rect.getAttribute('width')) || 0 }
  set width(newValue) {
    this.rect.setAttribute('width', newValue)
    this.updateTextPosition();
  }

  get height() { return parseInt(this.rect.getAttribute('height')) || 0; } //return this.rect.getAttribute('height') }
  set height(newValue) {
    this.rect.setAttribute('height', newValue)
    this.updateTextPosition();
  }
}
