

const collider = {
  moveableDiv: null,
  staticDivs: [],
  checkCollision: function() {
    let hasJustCollided = false;
    for (let i = 0; i < this.staticDivs.length; i++) {
      const currentDiv = this.staticDivs[i];
      if (currentDiv.position.left < this.moveableDiv.position.left + this.moveableDiv.position.width &&
        currentDiv.position.left + currentDiv.position.width > this.moveableDiv.position.left &&
        currentDiv.position.top < this.moveableDiv.position.top + this.moveableDiv.position.height &&
        currentDiv.position.height + currentDiv.position.top > this.moveableDiv.position.top) {
        hasJustCollided = true;
        if (!this.moveableDiv.ref.classList.contains('collision-state')) {
          this.moveableDiv.ref.classList.add('collision-state');
        }
      } else if (this.moveableDiv.ref.classList.contains('collision-state') && !hasJustCollided) {
        this.moveableDiv.ref.classList.remove('collision-state');
      }
    }
  },

};

class BaseDiv {
  constructor(position) {
    this.position = position;
  }
}

class MoveDiv extends BaseDiv {
  constructor(position, ref) {
    super(position);
    this.ref = ref;
  }
  shiftPosition(x, y) {
    this.position.left += x;
    this.position.top += y;
    this.reDraw();
  }
  reDraw() {
    this.ref.setAttribute('style', `left: ${this.position.left}px; top: ${this.position.top}px`);
    collider.checkCollision();
  }
}


export class Tpad {
    constructor(parentSvg, element, config = new SliderConfig()) {
    this.root;
    
     this.trackHeight = (this.y2 - this.y1); //- this.handleRadius * 2
    this.offset;
    this.xPos = this.changeX;
    this.transform;
    this.translate;
    this.CTM;
    this.coord;

    this.selected = null;
    this.parentSvg = parentSvg;
    this.config = config;
    this.handleRadius = this.config.handleRadius;
    this.strokeWidth = config.strokeWidth || 4;
    this.root = element || document.createElementNS(SVG_NS, 'g');
    this.adjusterHeight = this.config.adjusterHeight || 15;
    this.originY = this.height / 2; //((this.height - this.y1) - this.y) + (this.strokeWidth * 2.5)
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

    this.root = this.getElement('root');
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
      this.sliderTranslate.setTranslate(this.config.x, this.config.y);
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



  get prop() { return this._prop };
  set prop(newValue) { this._prop = newValue };
}
