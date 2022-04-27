//NODE
export default class {
  constructor(value = null, adjacentList = []) {
    this._value = value;
    this._adjacentList = adjacentList;
  }

  addAdjacent(node) {
    this.adjacents.push(node);
  }

  removeAdjacent(node) {
    const index = this.adjacents.indexOf(node);
    if (index > -1) {
      this.adjacents.splice(index, 1);
      return node;
    }
  }

  locateAdjacent(node) {
    return this._adjacentList.indexOf(node);
  }

  isAdjacent(node) {
    return this._adjacentList.indexOf(node) > -1;
  }
  
  get adjacents() { return this._adjacentList };
  set adjacents(newValue) { this._adjacentList = newValue }
  get value() { return this._value };
  set value(newValue) { this._value = newValue }
}
