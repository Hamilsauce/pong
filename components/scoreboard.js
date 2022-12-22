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
    this.input$ = input$;
    this.displays = {
      left: this.createDisplay('left-score', 0,) ,//this.input.bind(this)),
      right: this.createDisplay('right-score', 0,) //this.input.bind(this))
    }

  }

  input(side) {
    if (!['LEFT', 'RIGHT'].includes(side)) return;
    side = this.displays[side.toLowerCase()];
    side.textContent = +(side.textContent + 1)

  }

  createDisplay(name, value, callback) {
    const tn = this.createText(value, callback);

    tn.id = name;
    this.root.append(tn);
  }

  createText(value, callback) {
    const textNode = document.createElementNS(SVG_NS, "text");
    const text = document.createTextNode(this.value);


    if (callback) callback(text)
    textNode.appendChild(text);
    return textNode;
  }

} { Scoreboard }
