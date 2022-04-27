// From http://www.redblobgames.com/
// Copyright 2016 Red Blob Games <redblobgames@gmail.com>
// License: Apache v2.0 <http://www.apache.org/licenses/LICENSE-2.0.html>

///<reference path="typings/d3/d3.d.ts" />

/* Read Tiled TMX map into my data structure */

// http://doc.mapeditor.org/reference/tmx-map-format/
// - Everything is straightforward except base64 encoding is
//   little-endian 4-byte integers

class TiledMap {
  width: number;
  height: number;
  tileUrls: string[] = [];
  mapData: string;

  constructor(xml) {
    let map = xml.getElementsByTagName('map')[0];
    this.width = parseInt(map.attributes.getNamedItem('width').value);
    this.height = parseInt(map.attributes.getNamedItem('height').value);

    let tileset = map.getElementsByTagName('tileset')[0];
    let firstgid = parseInt(tileset.attributes.getNamedItem('firstgid').value);
    let tiles = tileset.getElementsByTagName('tile');
    for (let i = 0; i < tiles.length; i++) {
      let tile = tiles[i];
      let id = firstgid + parseInt(tile.attributes.getNamedItem('id').value);
      let source = tile.getElementsByTagName('image')[0].attributes.getNamedItem('source').value;
      this.tileUrls[id] = source;
    }

    this.mapData = window.atob(map.getElementsByTagName('layer')[0].getElementsByTagName('data')[0].textContent.trim());
  }

  get(col, row) {
    if (0 <= row && row < this.height &&
      0 <= col && col < this.width) {
      let index = 4 * (row * this.width + col)
      let tileId = 0;
      for (let i = 0; i < 4; i++) {
        // Tile ID is encoded as little endian in 4 bytes
        tileId += this.mapData.charCodeAt(index + i) << (8 * i);
      }
      return this.tileUrls[tileId];
    }
    return null;
  }
}
