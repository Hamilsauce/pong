const { iif, Observable, BehaviorSubject, AsyncSubject, Subject, interval, of , fromEvent, merge, empty, delay, from } = rxjs;
const { throttleTime, mergeMap, switchMap, scan, take, takeWhile, map, tap, startWith, filter, mapTo } = rxjs.operators;


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
        return ['x', 'y', 'width', 'w', 'height', 'h', 'strokeWidth', 'id'].includes(k) ? [k, v] : [k, v];
      })
    );
  };
  get data() { return this._data; };
  set data(newValue) { this._data = newValue; };
}


// TODO Add Slider RepositionX

// TODO Hook up to class tree

export class SliderGroup {
  constructor(parentSvg, element, config = new SliderConfig()) {
    this.selected = null;
    this.parentSvg = parentSvg;
    this.config = config;
    this.handleRadius = this.config.handleRadius;
    this.strokeWidth = config.strokeWidth || 4;
    this.root = element || document.createElementNS(SVG_NS, 'g');
    this.adjusterHeight = this.config.adjusterHeight || 15;
    this.originY = this.height / 2;
    this.changeY = this.originY;
    this.changeX = this.config.x;
    this.value$ = new BehaviorSubject(this.originY);
    this.value = this.originY;

    this.drag$;

    this._children = new Map([
      ['text', this.createText()],
      ['handle', document.createElementNS(SVG_NS, 'circle')],
      ['handleGroup', document.createElementNS(SVG_NS, 'g')],
      ['track', document.createElementNS(SVG_NS, 'line')],
      ['background', document.createElementNS(SVG_NS, 'rect')],
      ['sliderAdjuster', document.createElementNS(SVG_NS, 'rect')],
      ['root', this.root],
    ]);

    this.self = this.getElement('root');
    this.background = this.getElement('background');
    this.track = this.getElement('track');
    this.handle = this.getElement('handle');
    this.handleGroup = this.getElement('handleGroup');
    this.adjuster = this.getElement('sliderAdjuster');
    this.textNode = this.getElement('text');

    this.trackHeight = (this.y2 - this.y1); //- this.handleRadius * 2
    this.offset;
    this.xPos = this.changeX;
    this.transform;
    this.translate;
    this.CTM;
    this.coord;

    this.init();

    this.sliderTransforms = this.root.transform.baseVal;
    this.handleTransforms = this.handleGroup.transform.baseVal;
    this.textNodeTransforms = this.textNode.transform.baseVal;

    if (this.handleTransforms.length === 0) {
      this.sliderTranslate = this.parentSvg.createSVGTransform();
      this.sliderTranslate.setTranslate(this.config.x, this.config.y+25);
      this.sliderTransforms.insertItemBefore(this.sliderTranslate, 0);

      this.handleScale = this.parentSvg.createSVGTransform();

      this.handleTranslate = this.parentSvg.createSVGTransform();
      this.handleTranslate.setTranslate(0, this.originY);
      this.handleTransforms.insertItemBefore(this.handleTranslate, 0);

      this.handleRotate = this.parentSvg.createSVGTransform();
      this.handleRotate.setRotate(0, this.config.x, this.originY);
      this.handleTransforms.insertItemBefore(this.handleRotate, 1);

      this.textNodeRotate = this.parentSvg.createSVGTransform();
      this.textNodeRotate.setRotate(0, 0, 0);
      this.textNodeTransforms.insertItemBefore(this.textNodeRotate, 0);
    }
  }

  repositionX(evt) {
    const { target } = evt;
    if (target !== this.adjuster) return;
    evt.preventDefault();
    evt.stopPropagation();

    this.coord = this.getMousePosition(evt);
    this.changeX = this.coord.X - this.offset.X;

    this.sliderTransforms.setTranslate(this.changeX, 0);
  }

  startDrag(evt) {
    evt.stopPropagation();
    this.setAttr('handle', 'fill', 'url(#activeHandleGradient)');
    this.selected = evt.currentTarget;
    this.transform = this.handleTransforms.getItem(0);
    this.offset = this.getMousePosition(evt);
    this.offset.x -= this.transform.matrix.e;
    this.offset.y -= this.transform.matrix.f;
  }

  drag(evt) {
    this.handle.classList.add('active');
    if (this.selected) {
      evt.preventDefault();
      evt.stopPropagation();

      this.coord = this.getMousePosition(evt);
      this.changeY = this.coord.y - this.offset.y;

      if (this.isInBounds) {
        this.transform.setTranslate(0, this.changeY);
        this.textNode.textContent = Math.abs(this.value);

        this.handle.classList.add('at-origin');
        this.handleRotate.setRotate(this.value * 7.2, this.width / 2, 0);
        this.textNodeRotate.setRotate(-this.value * 7.2, this.width / 2, 0);

        if (Math.abs(this.value) <= 0.9)
          this.handle.classList.add('at-origin');
        else this.handle.classList.remove('at-origin');
      }
    }
  }

  endDrag(evt) {
    this.selected = null;
    this.setAttr('handle', 'fill', 'url(#inactiveHandleGradient)');
  }

  createText(value) {
    const textNode = document.createElementNS(SVG_NS, "text");
    const text = document.createTextNode(this.value);

    textNode.appendChild(text);
    return textNode;
  }

  setAttr(childKey = '', attr = '', value) {
    this.getElement(childKey).setAttribute(attr, value);

    return this.getElement(childKey);
  }

  getAttr(childKey = '', attr = '') { return parseInt(this.getElement(childKey).getAttributeNS(null, attr)); }

  getElement(key = '') { return this.children.has(key) ? this.children.get(key) : null; }

  getMousePosition(evt) {
    const CTM = this.parentSvg.getScreenCTM();
    if (evt.touches) { evt = evt.targetTouches[0]; }

    return {
      x: (evt.clientX - CTM.e) / CTM.a,
      y: (evt.clientY - CTM.f) / CTM.d
    };
  }

  init() {
    this.width = this.config.width;
    this.height = this.config.height;
    this.root.classList.add('sliderGroup');

    this.setAttr('background', 'width', this.width);
    this.setAttr('background', 'height', this.height);
    this.setAttr('background', 'rx', '22px');

    this.background.classList.add('slider-bg');

    this.setAttr('sliderAdjuster', 'x', this.width / 4);
    this.setAttr('sliderAdjuster', 'y', this.height + 5);
    this.setAttr('sliderAdjuster', 'width', this.width / 2);
    this.setAttr('sliderAdjuster', 'height', this.adjusterHeight);
    this.setAttr('sliderAdjuster', 'rx', '8px');
    this.setAttr('sliderAdjuster', 'fill', '#18181890');
    this.setAttr('sliderAdjuster', 'stroke', '#00000050');

    this.background.classList.add('sliderAdjuster');

    this.setAttr('track', 'x1', this.width / 2);
    this.setAttr('track', 'x2', this.width / 2);
    this.setAttr('track', 'y1', this.handleRadius);
    this.setAttr('track', 'y2', this.height - this.handleRadius);

    this.track.classList.add('slider-track');

    this.setAttr('handle', 'r', this.handleRadius);
    this.setAttr('handle', 'cx', this.width / 2);
    this.setAttr('handle', 'fill', 'url(#handleGradient)');
    this.setAttr('handle', 'stroke', '#00000050');
    this.setAttr('handle', 'stroke-width', '1px');

    this.handle.classList.add('at-origin');

    this.setAttr('text', 'x', this.handleRadius);
    this.setAttr('text', 'y', this.handleRadius / 4);

    this.textNode.classList.add('text-node');
    this.textNode.setAttributeNS(null, 'text-anchor', 'middle');

    this.handleGroup.appendChild(this.handle);
    this.handleGroup.appendChild(this.textNode);

    this.root.appendChild(this.background);
    this.root.appendChild(this.track);
    this.root.appendChild(this.handleGroup);
    this.root.appendChild(this.adjuster);

    this.parentSvg.appendChild(this.root);

    this.root.addEventListener('touchmove', this.repositionX.bind(this));

    this.root.addEventListener('mousedown', this.startDrag.bind(this));
    this.root.addEventListener('mousemove', this.drag.bind(this));
    this.root.addEventListener('mouseup', this.endDrag.bind(this));
    this.root.addEventListener('touchstart', this.startDrag.bind(this));
    this.root.addEventListener('touchmove', this.drag.bind(this));
    this.root.addEventListener('touchend', this.endDrag.bind(this));
  }

  // COLLIDABLE
  get isInBounds() {
    return (
      this.changeY >= (this.config.y - this.config.y) + this.handleRadius - this.strokeWidth &&
      this.changeY <= (this.config.height - this.handleRadius) + this.strokeWidth
    );
  }

  // MOVE INTO MOVABLE CLASS
  set value(val) { this._value = val; }

  get value() {
    const origin = this.config.height / 2;
    let val;

    if (this.changeY < origin)
      val = Math.round((((this.changeY - origin)) / (this.config.height - (origin + this.handleRadius))) * 100);
    else if (this.changeY > origin)
      val = Math.round(((this.changeY - origin) / (this.height - (origin + this.handleRadius))) * 100);
    else val = 0;

    val = val > 100 ? 100 : val;
    this.value$.next(val);
    return val;
  }

  get children() { return this._children }

  set children(newValue) { this._children = newValue; };

  get trackRange() { return (this.y2 - this.y1) || 0; }

  get center() {
    return {
      x: this.x + (this.width / 2),
      y: this.y + (this.height / 2),
    };
  }

  get y1() { return this.track.y1.baseVal.value || +this.track.getAttribute('y1') || this.config.y }
  get y2() { return this.track.y2.baseVal.value || +this.track.getAttribute('y2') || this.config.height - this.handleRadius; }
  get width2() { return (parseInt(this.background !== undefined ? this.background.getAttribute('width') : this.config.width)); }
  get width() { return this.background.width.baseVal.value }
  set width(newValue) {
    this.root.setAttribute('width', newValue);
    this.background.setAttribute('width', newValue)
  }
  get height() { return (parseInt(this.background !== undefined ? +this.background.getAttribute('height') : this.config.height)); }
  set height(newValue) {
    this.root.setAttribute('height', newValue);
    this.background.setAttribute('height', newValue);
  }
}
