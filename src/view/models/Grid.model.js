import { CellMatrix } from '/src/view/models/collections/matrix.collection.js'

export class GridModel {
  constructor(config) {
    this.rows;
    this.columns;

    this.size = config.size || { rows: 20, columns: 20 };
    this.cellSize = config.cellSize;

    this.cells = new CellMatrix(this.size.rows)
  }

  dispatch(event, detail) {
    this.dispatch(new CustomEvent('cells:loaded', { detail: { cells: this.cells.matrix } }))

  }

  on() {}

  generateMatrix(size) {
    for (let row = 0; row < size.rows; row++) {
      for (let column = 0; column < size.columns; column++) {
        const cell = this.createCell(row, column, this.cellSize, {
          active: false,
          rendered: false
        });

        this.cells.insert(row, column, cell)
      }
    }

    // this.dispatch('cells:loaded',{cells: this.cells.matrix  })
  }

  createCell(row, column, state) {
    //  NEED CELL CLASS
    return {
      row,
      column,
      cellSize: this.cellSize,
      state
    }
  }

  cell(coords = []) { return this.cells.at(coords) }

  columns() {}

  get activeCell() {}
  set activeCell(c) { this.activCell = c }

  get cellCount() { return this.size.x * this.size.y }
}
