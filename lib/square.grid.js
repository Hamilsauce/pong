import { Edge, Tile, Vertex } from '/lib/grid-lib.js'
export class SquareGrid {
  constructor(scale, originTile) {
    this.scale = scale;
    this.originTile = {...originTile,neighborTiles: []};
    this.tiles = [originTile]
    this.edges = ['W', 'N']
    this.vertexes = ['']
// console.log('square', this);
  }



  vertexToScreen(vertex) {
    return new ScreenCoordinate(vertex.q * this.scale,
      vertex.r * this.scale);
  }

  neighbors(tile) {
    const { q, r } = tile;
    return [
          new Tile(q, r - 1),
          new Tile(q - 1, r),
          new Tile(q, r + 1),
          new Tile(q + 1, r),
      ];
  }

  borders(tile) {
    const { q, r } = tile;
    return [
          new Edge(q, r, 'N'),
          new Edge(q, r, 'W'),
          new Edge(q, r + 1, 'N'),
          new Edge(q + 1, r, 'W'),
      ];
  }

  corners(tile) {
    const { q, r } = tile;
    return [
          new Vertex(q, r),
          new Vertex(q, r + 1),
          new Vertex(q + 1, r + 1),
          new Vertex(q + 1, r),
      ];
  }

  joins(edge) {
    const { q, r, s } = edge;
    switch (s) {
      case 'N':
        return [new Tile(q, r - 1), new Tile(q, r)];
      case 'W':
        return [new Tile(q, r), new Tile(q - 1, r)];
    }
    return [];
  }

  continues(edge) {
    const { q, r, s } = edge;
    switch (edge.s) {
      case 'N':
        return [new Edge(q - 1, r, 'N'), new Edge(q + 1, r, 'N')];
      case 'W':
        return [new Edge(q, r - 1, 'W'), new Edge(q, r + 1, 'W')];
    }
    return [];
  }

  endpoints(edge) {
    const { q, r, s } = edge;
    switch (s) {
      case 'N':
        return [new Vertex(q + 1, r), new Vertex(q, r)];
      case 'W':
        return [new Vertex(q, r), new Vertex(q, r + 1)];
    }
    return [];
  }

  touches(vertex) {
    const { q, r } = vertex;
    return [
          new Tile(q, r),
          new Tile(q, r - 1),
          new Tile(q - 1, r - 1),
          new Tile(q - 1, r),
      ];
  }

  protrudes(vertex) {
    const { q, r } = vertex;
    return [
          new Edge(q, r, 'W'),
          new Edge(q, r, 'N'),
          new Edge(q, r - 1, 'W'),
          new Edge(q - 1, r, 'N'),
      ];
  }

  adjacent(vertex) {
    const { q, r } = vertex;
    return [
          new Vertex(q, r + 1),
          new Vertex(q + 1, r),
          new Vertex(q, r - 1),
          new Vertex(q - 1, r),
      ];
  }
}
