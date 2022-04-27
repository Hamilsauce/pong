// import { Edge, Tile, Vertex } from '/lib/grid-lib.js'
import { SquareGrid } from '/lib/square.grid.js'
// console.log('SquareGrid', SquareGrid);
const grid2 = new SquareGrid(5, { q: 0, r: 0 })

let size = 5;
let cursor = 0
let nestedMap = []
let flatMap = []
// console.log('SquareGrid', SquareGrid);
let curr = grid2.originTile
while (cursor < size) {
  curr.neighborTiles= [...curr.neighborTiles, grid2.neighbors(curr)]
  nestedMap = [...nestedMap, grid2.neighbors(grid2.originTile)]
  // flatMap = [...flatMap, ...grid2.neighbors(grid2.originTile)]
// curr = curr.neighborTiles[]
  cursor++
}

console.log({ grid2 });
// console.log({ flatMap });
