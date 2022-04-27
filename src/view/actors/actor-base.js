import { Movable } from '/src/view/Movable.js'
// import {}

export class Actor extends Movable {
  constructor(svg, type = 'rect', attrs = {}) {
    // constructor() {
    // constructor(svg, boardGroup, paddles$, attrs ) {
    // console.log({svg},{type},{attrs} );
    super({ canvas: svg, type: 'circle', attrs });
    // this.root;
  };
  get prop() { return this._prop };
  set prop(newValue) { this._prop = newValue };
}
