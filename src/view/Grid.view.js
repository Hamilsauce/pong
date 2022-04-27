import { TileView } from '/src/view/Tile.view.js'
import { Point } from '/src/view/geometry/Point.js'
export class GridView {
  constructor(svg, config) {
    if (!svg) throw Error('no svg in layer constructor');
    // super('g', svg, { id: 'grid', x: 0, y: 0 })
    // this.tileConfig = {
    //   fill: '#FFFFFF',
    //   stroke: '#000000',
    //   'stroke-width': '1px',
    // }
this.tileWidth= 50
    this.events = new Map([
      ['tile:click', []],
      ['tile:active', []],
    ]);

    this.tileEls = []

    this.svg = svg

    this.self = svg.querySelector('#surface')

    // this.tiles.forEach(t => t.fill = 'brown')
    Object.assign(this, config);

    this.tiles = this.tilesElements
      .map((el, i) => {
        return new TileView(this, el, { size: 50 })
      });

    this.gridTiles = this.tiles

    let me = this.tiles[10]
    this.initial = { x: 0, y: 0 }
    this.tileClickHandler = this.handleTileClick.bind(this)

    this.self.addEventListener('tile:click', this.tileClickHandler)
    this.bindListeners(this.self) //('tile:click', this.handleTileClick.bind(this))
  }




  /**
   * Re-renders the initial and goal points onto the grid, needs to be called whenever
   * the points are changed
   */
  renderPoints() {
    this.gridTiles[this.initial.y][this.initial.x].self.style.backgroundColor = INITIAL_COLOR;
    this.gridTiles[this.goal.y][this.goal.x].self.style.backgroundColor = GOAL_COLOR;
  }

  /**
   * Converts real screen x,y coordinates into
   * a 2d point position on the grid
   * @param xCoordinate
   * @param yCoordinate
   */
  calculatePoint(xCoordinate, yCoordinate) {
    return {
      x: Math.floor(xCoordinate / this.tileWidth),
      y: Math.floor(yCoordinate / this.tileWidth)
    }
  }

  /**
   * Convert 2d position on grid to real screen coordinates
   * @param point
   */
  calculateCoordinate(point = new Point()) {
    return {
      x: point.x * this.tileWidth + this.tileWidth / 2,
      y: point.y * this.tileWidth + this.tileWidth / 2
    }
  }


  /**
   * Responds to the event thrown at screen coordinates on touch
   * @param xCoordinate
   * @param yCoordinate
   */
  onTouch(xCoordinate, yCoordinate) {
    const point = this.calculatePoint(xCoordinate, yCoordinate);
    this.lastPoint = point;
    if (this.pointsequal(point, this.initial)) {
      this.mouseDown0 = true;
      this.draggingInitial = true;
    } else if (this.this.pointsequal(point, this.goal)) {
      this.mouseDown0 = true;
      this.draggingGoal = true;
    } else if (!this.grid.get(point).data.isSolid) {
      this.mouseDown0 = true;
      if (!this.disable) {
        this.mutateTile(point, this.pointerTile);
      }
    } else {
      this.mouseDown2 = true;
      if (!this.this.pointsequal(point, this.initial) && !this.this.pointsequal(point, this.goal) && !this.disable) {
        this.erasePoint(point);
      }
    }
  }

  /**
   * Responds to the event thrown at screen coordinates on drag/move
   * @param xCoordinate
   * @param yCoordinate
   */
  onDrag(xCoordinate, yCoordinate) {
    const point = this.calculatePoint(xCoordinate, yCoordinate);
    if (this.pointsequal(point, this.lastPoint)) {
      return;
    }
    this.lastPoint = point;
    if (this.mouseDown0) {
      if (this.draggingInitial) {
        this.moveInitial(point);
        this.onTilesDragged();
      } else if (this.draggingGoal) {
        this.moveGoal(point);
        this.onTilesDragged();
      } else if (!this.pointsequal(point, this.initial) && !this.pointsequal(point, this.goal) && !this.disable) {
        this.mutateTile(point, this.pointerTile);
      }
    } else if (this.mouseDown2) {
      if (!this.pointsequal(point, this.initial) && !this.pointsequal(point, this.goal) && !this.disable) {
        this.erasePoint(point);
      }
    }
  }

  /**
   * Moves initial to a new point
   * @param point
   */
  moveInitial(point = new Point()) {
    if (this.grid.inBounds(point) && !this.pointsequal(this.goal, point) && !this.disable) {
      this.mutateTile(this.initial, this.getTileType(this.initial));
      this.gridTiles[point.y][point.x].style.borderColor = BORDER_MAPPING[TileType.Empty];
      this.gridTiles[point.y][point.x].style.backgroundColor = INITIAL_COLOR;
      this.initial = point;
    }
  }

  /**
   * Moves goal to a new point
   * @param point
   */
  moveGoal(point = new Point()) {
    if (this.grid.inBounds(point) && !this.pointsequal(this.initial, point) && !this.disable) {
      this.mutateTile(this.goal, this.goalTile);
      this.goalTile = this.getTileType(point);
      this.mutateTile(point, TileType.Empty);
      this.gridTiles[point.y][point.x].style.backgroundColor = GOAL_COLOR;
      this.goal = point;
    }
  }

  pointsEqual(point1 = new Point(), point2 = new Point()) {
    return point1.x == point2.x && point1.y == point2.y;
  }


  on(type, handler) {
    if (this.events.has(type)) {
      this.events.set(type, [...this.events.get(type), handler])
    } else {
      this.events.set(type, [handler])
    }

    // this.self.addEventListener(type, handler)
  }

  emit(e) {
    this.events.get(e.type)
      .forEach((handler, i) => {
        handler(e);
      });
  }


  bindListeners(element) {
    element.addEventListener('contextmenu', e =>
      e.preventDefault()
    );
    // element.addEventListener('pointerdown', e => {
    //   e.preventDefault();
    //   let bounds = element.getBoundingClientRect();
    //   this.handleTileClick.bind(this)({ x: e.clientX - bounds.left, y: e.clientY - bounds.top });
    // });
    // element.addEventListener('pointerup', e => {
    //   e.preventDefault();
    //   if (e.button == 0) {
    //     this.draggingGoal = false;
    //     this.draggingInitial = false;
    //     this.pointerDown0 = false;
    //   } else if (e.button == 2) {
    //     this.pointerDown2 = false;
    //   }
    //   this.lastPoint = NULL_POINT;
    // });
    // element.addEventListener('pointermove', e => {
    //   let bounds = element.getBoundingClientRect();
    //   this.onDrag(e.clientX - bounds.left, e.clientY - bounds.top);
    // });

    element.addEventListener('mouseleave', e => {
      e.preventDefault();
      this.draggingGoal = false;
      this.draggingInitial = false;
      this.mouseDown = false;
      this.mouseDown2 = false;
      this.lastPoint = NULL_POINT;
    });
  }


  handleTileClick(e) {
  // const tile =e.detail.target
    const point = { x: e.detail.target.point.x, y: e.detail.target.point.y }
    console.warn('heard in grid', e.detail.target.point.x)
    const p = this.calculatePoint(+e.detail.target.point.x, +e.detail.target.point.y);
    this.initial = {}
    const tile = this.tiles[point.y][point.x]

    console.log('this.tiles', this.tiles)
    this.renderPoints.bind(this)()

    const t = e.detail && e.detail.target ? e.detail.target : this.tiles.get(e.target)
    // this.emit({ type: 'tile:active', detail: { point: t.point } });
    // const cell = gridModel.cell({ x: +t.dataset.column, y: +t.dataset.row })
    // const bbox = t.getBoundingClientRect()

    tile.dataset.selected = tile.dataset.selected === 'true' ? false : true

    // guy.move(t.point.toPixel());


    tile.self.dispatchEvent(new CustomEvent('tile:active', { bubbles: false, detail: { point: tile.point } }))
    // e.detail.target.self.dispatchEvent(new CustomEvent('tile:click', {bubbles:true, detail: { target: this } }))

  }

  getTile(row = 0, col = 0) {}


  load(tileMatrix) {
    tileMatrix
      .forEach((row, i) => {
        row.forEach((cell, i) => {
          // console.log('cell', cell)
          this.tileEls.push(this.createTile(cell))
        });
      });

    // initial loading of view state and actors
    // probably just into memory 
    // to prepare for initial render();

    return this.render;
  }

  render() {
    // this.self.innerHTML = ''
    this.tileEls.forEach((tile, i) => {
      // console.log("TILE TILE TILE",{tile});
      tile.render()
      this.append(tile)
    });
    return true
    // initial loading of view state and actors
    // probably just into memory 
    // to prepare for initial render();
  }

  createTile(model, callback) {

    const tile =
      new TileView(this, null, model)
    // Object.assign(

    // );

    if (callback) callback(tile)
    return tile
  }

  append(tile, callback) {
    // const tileEl = tile.render(this.tileSize)
    tile = tile instanceof Element ? tile : tile.self
    this.self.appendChild(tile.self);

    if (callback) callback(tile);
    return tile;
  }

  removeTile() {}


  get rows() {}
  set rows(v) {}

  get tilesElements() { return [...this.self.querySelectorAll('.tile')] };

  set prop(newValue) { this._prop = newValue };
}
