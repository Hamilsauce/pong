export class VertexCollection {
  constructor(seed = [[]]) {
    this._vertices = new Map();
  }

  init(seed) {
    if (Array.isArray(seed)) {
      this.vertices = seed.every(_ => Array.isArray(_)) ? new Map(seed) : new Map();
    }
  }

  add(key, value, zIndex) {
    if (!(key || value)) return;
    this.vertices.set(key, { ...value, zIndex: zIndex })
    return this.vertices.get(key)
  }

  setProperties(callback, filterFn) {
    if (!callback) return;

    const modifiedVertices = new Map()
    this.vertices.forEach((node, vertex, map) => {
      if (filterFn && filterFn(node, vert, map) === true) {
        callback(node, vert, map);
        modifiedVertices.set(vert, node)
      }
      else {
        callback(node, vert, map);
        modifiedVertices.set(vert, node)
      }
    });
    return modifiedVertices;
  }

  getVertexZ(vertex) {
    return this.vertices.has(vertex) ? this.vertices.get(key).zIndex : -1;
  }

  getVertexX() {}
  getVertexY() {}

  // get vertices() { return this._vertices };
  // set vertices(newValue) { this._vertices = newValue };


  get vertices() { return this._vertices };
  set vertices(newValue) { this._vertices = newValue };
}