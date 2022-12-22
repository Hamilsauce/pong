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
    this.bg = this.root
    this.root = document.createElementNS(SVG_NS, 'g');
    this.root.id = 'scoreboard'
    this.bg.id = 'scoreboard-bg'
    this.root.append(this.bg);

    this.input$ = input$;
    this.displays = {
      left: this.createDisplay('left-score', 0, ), //this.input.bind(this)),
      right: this.createDisplay('right-score', 0, ) //this.input.bind(this))
    }
    console.log('score board', this);
  }

  input(side) {
    if (!['LEFT', 'RIGHT'].includes(side)) return;
    side = this.displays[side.toLowerCase()];
    side.textContent = +(side.textContent + 1)

  }

  createDisplay(name, value, callback) {
    const display = document.createElementNS(SVG_NS, 'g');
    const bg = document.createElementNS(SVG_NS, 'rect');

    if (name.includes('left')) {
      display.setAttribute('transform', 'translate(15, 5)');
    } else display.setAttribute('transform', 'translate(352, 5)');

    bg.width.baseVal.value = 40;
    bg.height.baseVal.value = 40;
    // bg.x.baseVal.value = 10;
    // bg.y.baseVal.value = 10;
    const tn = this.createText(0, callback);

    display.id = name;
    display.classList.add('score-display')
    display.append(bg, tn)
    // tn.setAttributeNS(null,'text-anchor', 'middle')
    this.root.append(display);
  }

  createText(value, callback) {
    const textNode = document.createElementNS(SVG_NS, "text");
    const text = document.createTextNode(value);

    if (callback) callback(text)
    textNode.appendChild(text);
    return textNode;
  }

} { Scoreboard }