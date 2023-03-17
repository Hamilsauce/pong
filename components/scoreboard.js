import { Spatial } from './Spatial.js'

const boardattrs = {
  id: null,
  classList: null,
  x: null,
  y: null,
  width: null,
  height: null,
  fill: null,
  stroke: null,
}

export class Scoreboard extends Spatial {
  constructor(parentSVG, attrs, input$) {
    super({ parentSVG, type: 'rect', attrs, isContainer: false })

    this.bg = this.self
    this._self = document.createElementNS(SVG_NS, 'g');
    this._self.id = 'scoreboard'
    this.bg.id = 'scoreboard-bg'
    this._self.append(this.bg);

    this.input$ = input$;

    this.displays = {
      left: this.createDisplay('left-score', 0, ),
      right: this.createDisplay('right-score', 0, )
    }
  }
  get dom() { return this._self }
  
  input(side) {
    if (!['LEFT', 'RIGHT'].includes(side)) return;

    side = this.displays[side.toLowerCase()];

    side.textContent = +(side.textContent + 1);
  }

  createDisplay(name, value, callback) {
    const display = document.createElementNS(SVG_NS, 'g');
    const bg = document.createElementNS(SVG_NS, 'circle');
    const tn = this.createText(0, callback);

    bg.r.baseVal.value = 22.5;

    display.id = name;
    display.classList.add('score-display')
    display.append(bg)
    display.append(tn)

    if (name.includes('left')) {
      display.setAttribute('transform', 'translate(100, 27)');
    }
    else display.setAttribute('transform', 'translate(312, 27)');

    this._self.append(display);
  }

  createText(value, callback) {
    const textNode = document.createElementNS(SVG_NS, "text");
    const text = document.createTextNode(value);
    const offsetY = 22.5 / 3;

    textNode.classList.add('score-value')
    textNode.setAttribute('transform', `translate(0, ${offsetY})`);

    if (callback) callback(text)

    textNode.appendChild(text);

    return textNode;
  }
}