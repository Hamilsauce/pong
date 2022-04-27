import {Point, Tile, TILE_CREATOR, TileData, TileType} from './Components';

export interface Grid
{
    getWidth(): number;
    getHeight(): number;
    inBounds(point: Point): boolean;
    get(point: Point): Tile;
    mutate(point: Point, data: TileData): void;
    mutateTile(tile: Tile): void;
    output(console: Console): void;
    getJson(): string;
    walkable(point: Point): boolean;
}

/**
 * A square grid system that stores nodes in a matrix
 * Uses an x,y system where x corresponds to column of the matrix,
 * and y corresponds to the row of the matrix
 * TileData.ts should be treated like graph nodes
 */
class SquareGrid implements Grid{
    private readonly tiles: Tile[][];
    private readonly width: number;
    private readonly height: number;

    /**
     * Constructs a grid either with empty or predefined tiles
     * @param width of the grid
     * @param height of grid
     * @param tiles, optional parameter for predefined tiles,
     * will perform a defensive copy to the grid
     */
    constructor(width: number, height: number, tiles?: Tile[][]) {
        this.width = width;
        this.height = height;
        if(tiles == undefined) {
            this.tiles = createEmptyGrid(width, height);
        } else {
            this.tiles = [];
            for(let y = 0; y < height; y++) {
                const row: Tile[] = [];
                for(let x = 0; x < width; x++) {
                    row.push({
                        data: {
                            pathCost: tiles[y][x].data.pathCost,
                            isSolid: tiles[y][x].data.isSolid
                        },
                        point: {
                            x: x, y: y
                        }
                    });
                }
               this.tiles.push(row);
            }
        }
    }

    getWidth() {
        return this.width;
    }

    getHeight() {
        return this.height;
    }

    /**
     * Checks if a given point is in bounds
     * Other functions assume arguments are in bounds, this should be used
     * if there is reasonable doubt about whether a point is in bounds
     * @param point, to check
     */
    inBounds(point: Point) {
        return point.x >= 0 && point.x < this.width && point.y >= 0 && point.y < this.height;
    }

    /**
     * Retrieves the tile for a position
     * @param point, point to get
     */
    get(point: Point) {
        return this.tiles[point.y][point.x];
    }

    /**
     * Mutates a position's tile to solid or non solid
     * @param point, point to mutate
     * @param data to mutate to
     */
    mutate(point: Point, data: TileData) {
        this.tiles[point.y][point.x].data = data;
    }

    /**
     * Mutates a a tile by point
     * @param tile to mutate
     */
    mutateTile(tile: Tile) {
        this.tiles[tile.point.y][tile.point.x].data = tile.data;
    }

    /**
     * Outputs the grid to a console
     * @param console
     */
    output(console: Console) {
        for(let y = 0; y < this.height; y++) {
            let str = '';
            for(let x = 0; x < this.width; x++) {
                str += this.tiles[y][x].data.isSolid + ', ';
            }
            console.log(str);
        }
    }

    /**
     * Returns json of tiles
     */
    getJson() {
        return JSON.stringify(this.tiles);
    }

    /**
     * Determines if a tile can be walked on
     * @param point
     */
    walkable(point: Point) {
        return !this.get(point).data.isSolid;
    }
}

/**
 * Creates a 2d matrix of empty nodes
 */
function createEmptyGrid(width: number, height: number) {
    const nodes: Tile[][] = [];
    for(let y = 0; y < height; y++) {
        const row: Tile[] = [];
        for(let x = 0; x < width; x++) {
            row.push({
                point: {
                    x: x, y: y
                },
                data: TILE_CREATOR[TileType.Empty]()
            });
        }
        nodes.push(row);
    }
    return nodes;
}

export default SquareGrid;
