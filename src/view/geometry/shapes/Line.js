import Node from '../models/Node.model.js';

export default class extends Node {
  constructor(pos, color, graph) {
    super(document.createElementNS('http://www.w3.org/2000/svg', 'line'))
    this.graph = graph;
    this.element = this.value
    this.element.classList.add('line');
    this.element.setAttribute('stroke', color);
    this.element.setAttribute('width', 9);
    this.element.setAttribute('stroke-width', '');
    this.setPosition(pos);
    // console.log('line.', this);
  }

  get element() { return this._element };
  set element(newValue) { this._element = newValue }

  setPosition(pos) {
    this.element.setAttribute('x1', pos.x1);
    this.element.setAttribute('y1', pos.y1);
    this.element.setAttribute('x2', pos.x2);
    this.element.setAttribute('y2', pos.y2);
  }

  getPosition() {
    return {
      x1: this.element.getAttribute('x1'),
      y1: this.element.getAttribute('y1'),
      x2: this.element.getAttribute('x2'),
      y2: this.element.getAttribute('y2'),
    };
  }

  setRotate(angle) {
    let newPos = pos = this.getPosition();
    newPos.x2 = pos - radius * Math.cos(angle);
    newPos.y2 = pos - radius * Math.sin(angle);
    this.setPosition(newPos);
  }

  getHtmlEl() {
    return this.element;
  }
}
