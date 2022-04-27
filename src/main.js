// const { iif, Observable, BehaviorSubject, AsyncSubject, Subject, interval, of , fromEvent, merge, empty, delay, from } = rxjs;
// const { throttleTime, mergeMap, switchMap, scan, take, takeWhile, map, tap, startWith, filter, mapTo } = rxjs.operators;
import { draggable } from '/src/view/services/draggable.service.js'
import { renderCollection } from './tiles.js'

const svg = document.querySelector('svg');
const surf = document.querySelector('#surface');
const activeLayer = document.querySelector('#active-objects');
const grid = document.querySelector('#grid');
const guy = document.querySelector('#guy');

console.log('guy.getBoundingClientRect()', guy.getBoundingClientRect())

const omnibutton = document.querySelector('#omnibutton');
const omnitext = omnibutton.querySelector('#omnibutton-text');
const omnishape = omnibutton.querySelector('#omnibutton-shape');
const omnicon = omnibutton.querySelector('#omnibutton-icon-filled')


export class Omnibutton {
  constructor() {
    this.self = document.querySelector('#omnibutton');
    this.omnitext = this.self.querySelector('#omnibutton-text');
    this.omnishape = this.self.querySelector('#omnibutton-shape');
    this.omnicon = this.self.querySelector('#omnibutton-icon-filled')
    this._expand = false;
    this.self.addEventListener('click', e => this.handleClick.bind(this));

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

    this.self.setAttribute('opacity', expand ? 0 : 1)
    // console.log('e.target.id', e.target.id)
    renderCollection(82, surf)
  }

  get expand() {}
  set expand(v) {}
  get prop() { return this._prop };
  set prop(newValue) { this._prop = newValue };
}


console.log("poop");
draggable(svg, surf);
draggable(svg, activeLayer);



let expand = false
omnibutton.addEventListener('click', e => {
  expand = !expand
  const rx = expand ? 5 : 30
  const width = expand ? 368 : 60
  const height = expand ? 320 : 60
  const y = expand ? -250 : 0


  omnibutton.querySelector('rect').setAttribute('rx', rx)
  omnibutton.querySelector('rect').setAttribute('width', width)
  omnibutton.querySelector('rect').setAttribute('height', height)
  omnibutton.querySelector('rect').setAttribute('y', y)

  omnicon.setAttribute('opacity', expand ? 0 : 1)
  // console.log('e.target.id', e.target.id)
  // renderCollection(82, surf)
});



surf.addEventListener('dblclick', e => {
  const lgrid = document.querySelector('#largeGridRect');

  if (lgrid.classList.contains('invert')) {
    lgrid.classList.remove('invert')
  } else {
    lgrid.classList.add('invert')
  }

});

svg.addEventListener('click', e => {
  const t = e.target
  if ([...e.path].some(_ => _ instanceof Element && _.classList.contains('graphic-object'))) {
    if (surf.contains(e.target)) {
      activeLayer.appendChild(t)
    }
  }
  console.log('e.target.id', e.target.id)


  // const lgrid = document.querySelector('#largeGridRect');

  // if (lgrid.classList.contains('invert')) {
  //   lgrid.classList.remove('invert')
  // } else {
  //   lgrid.classList.add('invert')
  // }

});

const getDimensions = () => {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
    factor: (() => {
      return [(window.innerWidth / 100) * 10]
    })(),
  }
};

export class Graph {
  constructor(canvas, element, config = { input$: null, boardHeight: 400 }) {
    this.canvas = canvas;
    this.config = config;
    this.input$ = this.config.input$;
    this.strokeWidth = config.strokeWidth || 4;
    this.root = element || document.createElementNS(SVG_NS, 'g');
    this.surface = document.createElementNS(SVG_NS, 'rect');

    this.board = document.querySelector('#boardBackground')
    this.originY = this.config.boardHeight / 2 //((this.height - this.y1) - this.y) + (this.strokeWidth * 2.5)
    this.value$ = new BehaviorSubject(this.originY)
    this.value = this.originY;

    this.transform;
    this.translate
    this.CTM;
    this.coord;
    this.paddleTransforms = this.root.transform.baseVal;

    if (this.paddleTransforms.length === 0) {
      this.paddleTranslate = this.canvas.createSVGTransform();
      this.paddleTranslate.setTranslate(0, this.originY);
      this.paddleTransforms.insertItemBefore(this.paddleTranslate, 0);
    }

    this.input$.pipe(
      // tap(x => console.log('input', x)),
      tap(this.move.bind(this))
    ).subscribe()
  }

  move(yVal) {
    this.transform = this.paddleTransforms.getItem(0);
    this.transform.setTranslate(0, yVal)
  }

  endMove(evt) { this.selected = null }

  createText() {
    const textNode = document.createElementNS(SVG_NS, "text");
    const text = document.createTextNode(this.value);

    textNode.appendChild(text);
    return textNode;
  }

  setAttr(childKey = '', attr = '', value) {
    this.getElement(childKey).setAttribute(attr, value);

    return this.getElement(childKey)
  }

  getAttr(childKey = '', attr = '') { return parseInt(this.getElement(childKey).getAttributeNS(null, attr)); }

  getElement(key = '') { return this.children.has(key) ? this.children.get(key) : null; }

  getMousePosition(evt) {
    const CTM = this.canvas.getScreenCTM();
    if (evt.touches) { evt = evt.targetTouches[0] }

    return {
      x: (evt.clientX - CTM.e) / CTM.a,
      y: (evt.clientY - CTM.f) / CTM.d
    };
  }

  init() {
    this.width = this.config.width
    this.height = this.config.height
    this.root.classList.add('sliderGroup');

    this.setAttr('background', 'width', this.width);
    this.setAttr('background', 'height', this.height);
    this.setAttr('background', 'rx', '22px');
    this.background.classList.add('slider-bg')

    this.setAttr('track', 'x1', this.width / 2);
    this.setAttr('track', 'x2', this.width / 2);
    this.setAttr('track', 'y1', this.handleRadius)
    this.setAttr('track', 'y2', this.height - this.handleRadius)
    this.track.classList.add('slider-track')

    this.setAttr('handle', 'r', this.handleRadius);
    this.setAttr('handle', 'cx', this.width / 2);
    this.setAttr('handle', 'fill', 'url(#handleGradient)');
    this.setAttr('handle', 'stroke', '#00000050');
    this.setAttr('handle', 'stroke-width', '1px');
    this.handle.classList.add('at-origin');

    this.setAttr('text', 'x', this.handleRadius);
    this.setAttr('text', 'y', this.handleRadius / 4)
    this.textNode.classList.add('text-node');
    this.textNode.setAttributeNS(null, 'text-anchor', 'middle');

    this.handleGroup.appendChild(this.handle)
    this.handleGroup.appendChild(this.textNode)

    this.root.appendChild(this.background)
    this.root.appendChild(this.track)
    this.root.appendChild(this.handleGroup)
    this.canvas.appendChild(this.root)

    this.root.addEventListener('mousedown', this.startMove.bind(this));
    this.root.addEventListener('mousemove', this.move.bind(this));
    this.root.addEventListener('mouseup', this.endMove.bind(this));
    this.root.addEventListener('touchstart', this.startMove.bind(this));
    this.root.addEventListener('touchmove', this.move.bind(this));
    this.root.addEventListener('touchend', this.endMove.bind(this));
  }

  get isInBounds() {
    return (
      this.changeY >= (this.config.y - this.config.y) + this.handleRadius - this.strokeWidth &&
      this.changeY <= (this.config.height - this.handleRadius) + this.strokeWidth // + (this.handleRadius * 3) 
    )
  }

  set value(val) { this._value = val }

  get value() {
    let val;
    const origin = this.config.height / 2;

    if (this.changeY < origin) {
      val = Math.round(((-(this.changeY - origin)) / (this.config.height - (origin + this.handleRadius))) * 100);
    } else if (this.changeY > origin) {
      val = Math.round(((this.changeY - origin) / (this.height - (origin + this.handleRadius))) * 100);
    } else val = 0
    val = val > 100 ? 100 : val
    this.value$.next(val);

    return val
  }

  get children() { return this._children };

  set children(newValue) { this._children = newValue };

  get trackRange() { return (this.y2 - this.y1) || 0 }

  get center() {
    return {
      x: this.x + (this.width / 2),
      y: this.y + (this.height / 2),
    }
  }

  get y1() { return (parseInt(this.track !== undefined ? +this.track.getAttribute('y1') : this.config.y + this.handleRadius)) }

  get y2() { return (parseInt(this.track !== undefined ? +this.track.getAttribute('y2') : this.config.height - this.handleRadius)) }
  // get y2() { return (parseInt(this.track !== undefined ? +this.track.getAttribute('y2') : this.config.height)) }
  // set y2(newValue) {
  //   // this.track.setAttribute('y2', newValue) // - this.strokeWidth)
  //   this.setAttr('track', 'y2', newValue - this.handleRadius - this.strokeWidth)
  // }
  // get cx() { return parseInt(this.handle.getAttribute('cx')) } // - this.strokeWidth || 0 }
  // set cx(newValue) {
  //   this.handleGroup.setAttribute('cx', newValue) - this.strokeWidth
  //   this.handle.setAttribute('cx', newValue) - this.strokeWidth
  // }
  // get r() { return parseInt(this.handle.getAttribute('r')) } //+ this.strokeWidth || 0 }
  // set r(newValue) {
  //   this.handle.setAttribute('r', newValue)
  // }
  // get x() { return parseInt(this.root.getAttribute('x')) || 0 }
  // get x() { return this.config.x }
  // set x(newValue) {
  //   this.root.setAttribute('x', newValue)
  //   this.background.setAttribute('x', newValue)
  // }
  // get x() { return parseInt(this.root.getAttribute('x')) || 0 }
  // set x(newValue) {
  //   this.root.setAttribute('x', newValue)
  //   this.background.setAttribute('x', newValue)
  // }
  // get y() { return parseInt(this.root.getAttribute('y')) || 0 }
  // set y(newValue) {
  //   this.root.setAttribute('y', newValue)
  //   this.background.setAttribute('y', newValue)
  // }

  get width() { return (parseInt(this.background !== undefined ? this.background.getAttribute('width') : this.config.width)) }

  set width(newValue) {
    this.root.setAttribute('width', newValue)
    this.background.setAttribute('width', newValue)
  }
  get height() { return (parseInt(this.background !== undefined ? +this.background.getAttribute('height') : this.config.height)) }

  set height(newValue) {
    this.root.setAttribute('height', newValue)
    this.background.setAttribute('height', newValue)
  }
}


{
  Graph
}
