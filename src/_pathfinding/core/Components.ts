/**
 * Represents a point in 2d space
 */
export interface Point
{
    readonly x: number;
    readonly y: number;
}

/**
 * Represents the data inside a tile
 * Solid tiles cannot be passed while non solid ones can
 * pathCost stores how expensive it is to travel to the tile if it isn't solid
 */
export interface TileData
{
    pathCost: number;
    isSolid: boolean;
}

/**
 * Represents a tile on the Grid
 */
export interface Tile
{
    data: TileData;
    readonly point: Point;
}

/**
 * A set of pre-existing TileTypes that work with the grid
 * Grid will work with any data that implements TileData
 */
export enum TileType
{
    Empty,Solid
}

/**
 * Creates the tileData corresponding with the given tile type
 */
export const TILE_CREATOR: {[key in TileType]: () => TileData} = {
    [TileType.Empty]: () => ({
        pathCost: 1,
        isSolid: false
    }),
    [TileType.Solid]: () => ({
        pathCost: 1,
        isSolid: true
    })
}

export function createTile(type: TileType) {
    return TILE_CREATOR[type]();
}
