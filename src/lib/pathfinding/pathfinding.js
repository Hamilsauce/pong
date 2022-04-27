function pointsEqual(point1 = new Point(), point2 = new Point()) {
  return point1.x == point2.x && point1.y == point2.y;
}

/**
 * Clear all child elements from parent element
 * @param element
 */
function clearElements(element: HTMLElement) {
  while (element.hasChildNodes()) {
    element.removeChild(element.lastChild!);
  }
}

/**
 * Re-renders the initial and goal points onto the grid, needs to be called whenever
 * the points are changed
 */
renderPoints() {
  this.gridTiles[this.initial.y][this.initial.x].style.backgroundColor = INITIAL_COLOR;
  this.gridTiles[this.goal.y][this.goal.x].style.backgroundColor = GOAL_COLOR;
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
  if (pointsEqual(point, this.initial)) {
    this.mouseDown0 = true;
    this.draggingInitial = true;
  } else if (pointsEqual(point, this.goal)) {
    this.mouseDown0 = true;
    this.draggingGoal = true;
  } else if (!this.grid.get(point).data.isSolid) {
    this.mouseDown0 = true;
    if (!this.disable) {
      this.mutateTile(point, this.pointerTile);
    }
  } else {
    this.mouseDown2 = true;
    if (!pointsEqual(point, this.initial) && !pointsEqual(point, this.goal) && !this.disable) {
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
  if (pointsEqual(point, this.lastPoint)) {
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
    } else if (!pointsEqual(point, this.initial) && !pointsEqual(point, this.goal) && !this.disable) {
      this.mutateTile(point, this.pointerTile);
    }
  } else if (this.mouseDown2) {
    if (!pointsEqual(point, this.initial) && !pointsEqual(point, this.goal) && !this.disable) {
      this.erasePoint(point);
    }
  }
}

/**
 * Moves initial to a new point
 * @param point
 */
moveInitial(point = new Point()) {
  if (this.grid.inBounds(point) && !pointsEqual(this.goal, point) && !this.disable) {
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
  if (this.grid.inBounds(point) && !pointsEqual(this.initial, point) && !this.disable) {
    this.mutateTile(this.goal, this.goalTile);
    this.goalTile = this.getTileType(point);
    this.mutateTile(point, TileType.Empty);
    this.gridTiles[point.y][point.x].style.backgroundColor = GOAL_COLOR;
    this.goal = point;
  }
}

bindListeners(element) {
  element.addEventListener('contextmenu', e =>
    e.preventDefault()
  );
  element.addEventListener('mousedown', e => {
    e.preventDefault();
    let bounds = element.getBoundingClientRect();
    this.onPress(e.clientX - bounds.left, e.clientY - bounds.top, e.button);
  });
  element.addEventListener('mouseup', e => {
    e.preventDefault();
    if (e.button == 0) {
      this.draggingGoal = false;
      this.draggingInitial = false;
      this.mouseDown0 = false;
    } else if (e.button == 2) {
      this.mouseDown2 = false;
    }
    this.lastPoint = NULL_POINT;
  });
  element.addEventListener('mousemove', e => {
    let bounds = element.getBoundingClientRect();
    this.onDrag(e.clientX - bounds.left, e.clientY - bounds.top);
  });

  element.addEventListener('mouseleave', e => {
    e.preventDefault();
    this.draggingGoal = false;
    this.draggingInitial = false;
    this.mouseDown0 = false;
    this.mouseDown2 = false;
    this.lastPoint = NULL_POINT;
  });
}
