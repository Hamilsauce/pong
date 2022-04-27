import { GraphicsObject } from '/src/view/GraphicsObject.js';
export class Layer extends GraphicsObject {
  constructor(id,  z) {
    super('g', {
      id
    });
    
    this.layerIndex = z;

  };


  get prop() { return this._prop };
  set prop(newValue) { this._prop = newValue };
}
