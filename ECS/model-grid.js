// const app = document.querySelector('#app');
const app = document.querySelector('#app');
const mGrid = document.querySelector('#model-grid')
const containers = document.querySelectorAll('.container')

const cellAdjacencies8 = {
  north: (x, y) => (x, y - 1),
  northeast: (x, y) => (x + 1, y - 1),
  east: (x, y) => (x + 1, y),
  southeast: (x, y) => (x + 1, y + 1),
  south: (x, y) => (x, y + 1),
  southwest: (x, y) => (x - 1, y + 1),
  west: (x, y) => (x - 1, y),
  northwest: (x, y) => (x - 1, y - 1),
}


const cellAdjacencies4 = {
  north: (x, y) => (x, y - 1),
  east: (x, y) => (x + 1, y),
  south: (x, y) => (x, y + 1),
  west: (x, y) => (x - 1, y),
}

const DEFAULT_MATRIX = {
  rows: [
    { columns: [{}, {}, {}, {}, {}] },
    { columns: [{}, {}, {}, {}, {}] },
    { columns: [{}, {}, {}, {}, {}] },
    { columns: [{}, {}, {}, {}, {}] },
    { columns: [{}, {}, {}, {}, {}] },
  ]
};

const GridModelConfig = {
  cellSize: 10,
  rows: 5,
  columns: 5,
  // selector: '#surface'
}


export class ModelCell {
  constructor() {
    this.point;
    this.traversable;
    this.vertices;
    this.edges
    this.adjacencies;
    this.active;
    this.occupied;
    this.hasPath;

  }
}

export class ActorModel {
  constructor() {
    this.name;
    this.point;
    this.destination = 'coords'
    this.currentPosition = 'coords'
    this.speed;
    this.active;
    this.currenCell;
    this.hasPath;
  }
}

export class ModelGrid {
  constructor(matrix = DEFAULT_MATRIX, config = GridModelConfig) {
    this.self = document.querySelector('#model-grid');
    this.cells = matrix
    Object.assign(this, config);
  };

  init() {}
}




const Canvas = {
  handlers: {},
  on() {},
  emit() {},
  setGridColumns(n = 1) {
    const tableStyle = document.querySelector('[data-class=table]') || document.createElement('style');
    tableStyle.dataset.class = 'table'

    tableStyle.innerHTML = `table {
      display: grid;
      border-collapse: collapse;
      min-width: 100%;
      width: min-content;
      grid-template-columns: ${
        n.reduce((acc, curr, i) => `${acc.replace(';','')}  minmax(min-content, max-content);`, '')
      }
      background: hsla(33, 0%, 100%, 0.96);
    }`;

    document.body.appendChild(tableStyle)
  }
}
