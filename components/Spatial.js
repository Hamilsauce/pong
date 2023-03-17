import { GraphicsObject } from './GraphicsObject.js';
const ShapeTypeMap = new Map()

export class Spatial extends GraphicsObject {
  constructor({ parentSVG, type, attrs }) {
    super({ svg: parentSVG, type, attrs })
  }
}