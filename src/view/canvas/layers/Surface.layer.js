import {Layer} from '../Layer.js'

export class Surface extends Layer {
  constructor(el = document.querySelector('#surface'), spatialConfig) {
  super('surface', 0)

    // this.config = spatialConfig ? spatialConfig : {
    //   x: surfBBox.left,
    //   y: surfBBox.top,
    //   width: surfBBox.width,
    //   height: surfBBox.height,
    //   bottom: surfBBox.bottom,
    //   left: surfBBox.left,
    // }
  }
  set bottom(v) {
    this._bottom = v
    console.log({ v });
  }


  get r() { return this.config.width / 2 };
  
  get centroid() {
    return {
      x: this.config.width - this.r,
      y: this.config.height - this.r
    }
  };

  get originTile() { return this._originTile };
 
  set originTile(newValue) { this._originTile = newValue };
}
