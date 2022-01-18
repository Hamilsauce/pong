export class ActionRelayer {
  /* 
    TODO: Develop relayer class which is
    instatiated as a data wrapper then passed
    to other class constructor that 
    mediates/controls/notifies data changes
    between objects
  */
  constructor(data = [[]] || new Map() || {}) {
    this._data = new Map(
      [...(Array.isArray(data) || data instanceof Map ? [...data] : Object.entries(data))]
      .map(([k, v], i) => {
        return ['x', 'y', 'width', 'w', 'height', 'h', 'strokeWidth'].includes(k) ? [k, v] : [k, v];
      })
    );
  };
  get data() { return this._data };
  set data(newValue) { this._data = newValue };
}

const config = {
  x: 50,
  y: 50, // [x, y] == top left of root group
  width: 50,
  height: 250,
  handleRadius: 25,
  strokeWidth: 0,
}

const relayer = new ActionRelayer(config)
console.log('relayer', [...relayer.data])


export class SliderGroup {
  constructor(parentSvg, element, config = new SliderConfig()) {
    this.selected = null;
    this.parentSvg = parentSvg;
    this.config = config;
    this.handleRadius = this.config.handleRadius;
    this.strokeWidth = config.strokeWidth || 4;
    this.root = element || document.createElementNS(SVG_NS, 'g');
    this._children = new Map([
      ['text', this.createText()],
      ['handle', document.createElementNS(SVG_NS, 'circle')],
      ['handleGroup', document.createElementNS(SVG_NS, 'g')],
      ['track', document.createElementNS(SVG_NS, 'line')],
      ['background', document.createElementNS(SVG_NS, 'rect')],
      ['root', this.root],
    ]);

    this.root = this.getElement('root');
    this.background = this.getElement('background');
    this.track = this.getElement('track');
    this.handle = this.getElement('handle');
    this.handleGroup = this.getElement('handleGroup');
    this.textNode = this.getElement('text');
    this.trackHeight = (this.y2 - this.y1) //- this.handleRadius * 2

    this.offset;
    this.transform;
    this.translate
    this.CTM;
    this.elementY;
    this.elementRadius;
    this.elementCenter;
    this.coord;
    this.changeY;
    this.init();

    this.originY = this.height / 2 //((this.height - this.y1) - this.y) + (this.strokeWidth * 2.5)
    this.handleText = Math.round(this.getValue(this.originY));
    this._value;

    this.sliderTransforms = this.root.transform.baseVal;
    this.handleTransforms = this.handleGroup.transform.baseVal;

    if (this.handleTransforms.length === 0) {
      this.sliderTranslate = this.parentSvg.createSVGTransform();
      this.sliderTranslate.setTranslate(this.config.x, this.config.y);
      this.sliderTransforms.insertItemBefore(this.sliderTranslate, 0);

      // console.log('this.originY', this.originY)

      this.handleTranslate = this.parentSvg.createSVGTransform();
      this.handleTranslate.setTranslate(0, this.originY);
      this.handleScale = this.parentSvg.createSVGTransform();
      this.handleTransforms.insertItemBefore(this.handleTranslate, 0);
    }
    // console.log('this.height - this.handleRadius', this.height - this.handleRadius)

  }

  getValue(yValue = 0) {
    // console.log('yValue', yValue)
    const origin = this.config.height / 2;
    if (yValue < origin) {
      this.value = ((-(yValue - origin)) / (this.config.height - (origin + this.handleRadius))) * 100;
      this.value = this.value > 100 ? 100 : this.value
    } else if (yValue > origin) {
      this.value = ((yValue - origin) / (this.height - (origin + this.handleRadius))) * 100;
      this.value = this.value > 100 ? 100 : this.value
    } else this.value = 0;
    return this.value;
  }

  startDrag(evt) {
    this.selected = this.handle;
    this.transform = this.handleTransforms.getItem(0);

    this.offset = this.getMousePosition(evt);
    this.offset.x -= this.transform.matrix.e;
    this.offset.y -= this.transform.matrix.f;
  }

  drag(evt) {
    if (this.selected) {
      evt.preventDefault();
      this.coord = this.getMousePosition(evt);
      this.changeY = this.coord.y - this.offset.y
      if (this.isInBounds) {
        // console.log('this.changeY', this.changeY)
        this.transform.setTranslate(0, this.changeY);
        this.handleText = Math.round(this.getValue(this.changeY))
        this.handle.classList.add('at-origin')

        if (this.value == 0) this.handle.classList.add('at-origin')
        else this.handle.classList.remove('at-origin')
      }
    }
  }

  endDrag(evt) { this.selected = null }

  createText() {
    const textNode = document.createElementNS(SVG_NS, "text");
    const text = document.createTextNode(this.originY);
    textNode.appendChild(text);
    return textNode
  }

  setAttr(childKey = '', attr = '', value) {
    this.getElement(childKey).setAttribute(attr, value);
    return this.getElement(childKey)
  }

  getAttr(childKey = '', attr = '') { return parseInt(this.getElement(childKey).getAttributeNS(null, attr)); }

  getElement(key = '') { return this.children.has(key) ? this.children.get(key) : null; }

  getMousePosition(evt) {
    const CTM = this.parentSvg.getScreenCTM();
    if (evt.touches) { evt = evt.touches[0]; }
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


    this.handle.classList.add('slider-handle', 'at-origin');
    // this.handle.classList.remove('at-origin')


    this.setAttr('text', 'x', this.handleRadius);
    this.setAttr('text', 'y', this.handleRadius / 4)
    this.textNode.classList.add('text-node');
    this.textNode.setAttributeNS(null, 'text-anchor', 'middle');

    this.handleGroup.appendChild(this.handle)
    this.handleGroup.appendChild(this.textNode)

    this.root.appendChild(this.background)
    this.root.appendChild(this.track)
    this.root.appendChild(this.handleGroup)
    this.parentSvg.appendChild(this.root)

    this.root.addEventListener('mousedown', this.startDrag.bind(this));
    this.root.addEventListener('mousemove', this.drag.bind(this));
    this.root.addEventListener('mouseup', this.endDrag.bind(this));
    this.root.addEventListener('touchstart', this.startDrag.bind(this));
    this.root.addEventListener('touchmove', this.drag.bind(this));
    this.root.addEventListener('touchend', this.endDrag.bind(this));
  }

  set handleText(newValue) { this.textNode.textContent = newValue }
  get value() { return this._value }
  set value(val) { this._value = val }

  get isInBounds() {
    return (
      this.changeY >= this.config.y - this.handleRadius &&
      this.changeY <= this.config.height - this.handleRadius
    )
  }

  get children() {
    return this._children
  };
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


const sliderComp = new SliderGroup(document.querySelector('#controls'), undefined, config)
// console.log('sliderComp', sliderComp)

{
  SliderGroup,
  ActionRelayer
}