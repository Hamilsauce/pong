// import * as d3 from '/cdn_modules/d3@7.4.4/d3.js'
function lineInterp(start, end, t) {
  return start + t * (end - start);
}

var t0 = make_scrubbable('t0', 0.3, [0.0, 1.0], 0.01);
t0.trigger(function() {
  function set(id, fmt, lo, hi) {
    d3.select(id).text(d3.format(fmt)(lineInterp(lo, hi, t0.value)));
  }
  set("#lineInterp1", ".2f", 0, 1);
  set("#lineInterp2", ".0f", 0, 100);
  set("#lineInterp3", ".1f", 3, 5);
  set("#lineInterp4", ".1f", 5, 3);
});

function lineInterp_point(p0, p1, t) {
  return new Point(lineInterp(p0.x, p1.x, t),
    lineInterp(p0.y, p1.y, t));
}

function Point(x, y) {
  this.x = x;
  this.y = y;
}

// This will make it easier to use with d3+svg
Point.prototype.toString = function() {
  return this.x + "," + this.y;
};

function line(p0, p1) {
  let points = [];
  let N = diagonal_distance(p0, p1);
  for (let step = 0; step <= N; step++) {
    let t = N === 0 ? 0.0 : step / N;
    points.push(round_point(lineInterp_point(p0, p1, t)));
  }
  return points;
}

function diagonal_distance(p0, p1) {
  let dx = p1.x - p0.x,
    dy = p1.y - p0.y;
  return Math.max(Math.abs(dx), Math.abs(dy));
}

function round_point(p) {
  return new Point(Math.round(p.x), Math.round(p.y));
}

// function lineInterp_point(p0, p1, t) {
//   return new Point(lineInterp(p0.x, p1.x, t),
//     lineInterp(p0.y, p1.y, t));
// }

// function lineInterp(start, end, t) {
//   return start + t * (end - start);
// }

// You should use the line() function presented in the article.
// However, for the interactive illustrations I want to show the
// unrounded points, and I also want the reader to choose N, so this
// is a variant of the line() function.
function line_N_unrounded(p0, p1, N) {
  let points = [];
  for (let step = 0; step <= N; step++) {
    let t = N === 0 ? 0.0 : step / N; // special case: N=0 when p0==p1
    points.push(lineInterp_point(p0, p1, t));
  }
  return points;
}

// Make a line-drawing diagram
// 
// #$id will get a new <svg> element
// *[data-name=$id-N] will become draggable N
// *[data-name=$id-t] will become draggable t
//
// Components:
// * Grid (g.grid rect)
// * Rasterized line drawn on grid (g.grid rect.line)
// * Draggable endpoints (.endpoints .draggable)
// * Straight line (.endpoints line)
// * Interpolation point controlled by $t
// * Multiple labeled interpolation points controlled by $N (.midpoints circle, .midpoints text)
//
// Select features by setting the CSS rules


function Diagram(id) {
  this.scale = 20;
  this.N = make_scrubbable(id + "-N", 5, [1, 30], 1);
  this.t = make_scrubbable(id + "-t", 0.3, [0.0, 1.0], 0.01);
  this.endpoints = [new Point(2, 2), new Point(20, 8)];
  this.distance = 0;
  this.redrawers = []; // list of functions

  this.svg = d3.select("#" + id).append('svg')
    .attr('viewBox', "0 0 600 200")
    .append('g')
    .attr('transform', "translate(0.5, 0.5) scale(" + this.scale + ") translate(0.5, 0.5)");

  let g_grid = this.svg.append('g')
    .attr('class', "grid");
    
  let coords = [];
  for (let x = 0; x < 30; x++) {
    for (let y = 0; y < 10; y++) {
      coords.push(new Point(x, y));
    }
  }
  
  g_grid.selectAll("rect").data(coords).enter()
    .append('rect')
    .attr('transform', function(d) { return "translate(" + d + ") translate(-0.5, -0.5)"; })
    .attr('width', 1 - 1 / this.scale)
    .attr('height', 1 - 1 / this.scale);

  this.redraw = function() {
    this.distance = diagonal_distance(this.endpoints[0], this.endpoints[1]);
    this.find_line();
    d3.selectAll("." + id + "-distance").text(this.distance);
    this.redrawers.forEach(function(f) { f.call(this); }.bind(this));

    return this;
  };

  this.find_line = function() {
    let N = this.N ? this.N.value : this.distance;
    this.points = line_N_unrounded(this.endpoints[0], this.endpoints[1], N);
  };

  this.N.trigger(this.redraw.bind(this));
  this.t.trigger(this.redraw.bind(this));
}


Diagram.prototype.automatic_N = function() {
  this.N = null;
  return this;
}


Diagram.prototype.add_line_draw = function() {
  let g = this.svg.append('g')
    .attr('class', "linedraw");

  this.redrawers.push(function() {
    let sel = g.selectAll("rect").data(this.points);
    sel.exit().remove();
    sel.enter().append('rect')
      .attr('width', 1 - 1 / this.scale)
      .attr('height', 1 - 1 / this.scale);
    sel.attr('transform', function(d) { return "translate(" + round_point(d) + ") translate(-0.5, -0.5)"; });
  });
  return this;
}


Diagram.prototype.add_track = function() {
  let line = this.svg.append('line')
    .attr('class', "track");

  this.redrawers.push(function() {
    line
      .attr('x1', this.endpoints[0].x)
      .attr('x2', this.endpoints[1].x)
      .attr('y1', this.endpoints[0].y)
      .attr('y2', this.endpoints[1].y);
  });
  return this;
}


Diagram.prototype.add_midpoints = function() {
  let g = this.svg.append('g')
    .attr('class', "midpoints");

  this.redrawers.push(function() {
    // Mark the line midpoints as small circles
    let sel = g.selectAll("circle").data(this.points);
    sel.exit().remove()
    sel.enter().append('circle').attr('r', 2.5 / this.scale);
    sel.attr('transform', function(d) { return "translate(" + d + ")"; });

    let offset = Math.abs(this.endpoints[1].y - this.endpoints[0].y) > Math.abs(this.endpoints[1].x - this.endpoints[0].x) ? [0.8, 0] : [0, -0.8];
    sel = g.selectAll("text").data(this.points);
    sel.exit().remove();
    sel.enter().append('text')
      .attr('text-anchor', "middle")
      .text(function(d, i) { return i; });
    sel.attr('transform', function(d) { return "translate(" + d + ") translate(" + offset + ") translate(0, 0.25)"; });
  });
  return this;
}


// Endpoints will be large invisible circles with a small visible circle. Draggable.
Diagram.prototype.add_endpoints = function() {
  let g = this.svg.append('g')
    .attr('class', "endpoints");
  let sel = g.selectAll("g").data(this.endpoints)
    .enter().append('g');
  sel.append('circle')
    .attr('class', "invisible")
    .attr('r', 0.9);
  sel.append('circle')
    .attr('class', "visible")
    .attr('r', 0.3);
  this.on_drag = function(endpoint) {
    d3.event.sourceEvent.preventDefault(); // stop scrolling on touch devices
    let x = Math.round(d3.event.x),
      y = Math.round(d3.event.y);
    if (0 <= x && x < 30 && 0 <= y && y < 10) {
      endpoint.x = x;
      endpoint.y = y;
      this.redraw();
    }
  }
  let drag = d3.behavior.drag()
    .on('drag', this.on_drag.bind(this))
    .on('dragstart', function() {
      d3.event.sourceEvent.preventDefault(); // stop scrolling on touch devices
      d3.select(this).classed('dragging', true);
    })
    .on('dragend', function() { d3.select(this).classed('dragging', false); })
    .call(sel);

  this.redrawers.push(function() {
    g.selectAll("g")
      .attr('transform', function(d) { return "translate(" + d + ")"; });
  });
  return this;
}


// Calculate an interpolation point based on t
Diagram.prototype.add_interpolation = function() {
  let g = this.svg.append('g')
    .attr('class', "interpolation");
  g.append('circle')
    .attr('r', 4 / this.scale);

  this.redrawers.push(function() {
    g.select("circle")
      .attr('transform', "translate(" + lineInterp_point(this.endpoints[0], this.endpoints[1], this.t.value) + ")");
  });
  return this;
}

let diagram_top = new Diagram('line-top')
  .automatic_N()
  .add_line_draw()
  .add_endpoints()
  .redraw();

let diagram_interpolation = new Diagram('line-interpolation')
  .add_track()
  .add_endpoints()
  .add_interpolation()
  .redraw();

let diagram_midpoints = new Diagram('line-midpoints')
  .add_track()
  .add_midpoints()
  .add_endpoints()
  .redraw();

let diagram_rounding = new Diagram('line-rounding')
  .add_track()
  .add_line_draw()
  .add_midpoints()
  .add_endpoints()
  .redraw();
diagram_rounding.redrawers.push(function() {
  d3.selectAll(".line-rounding-N-is-correct").text(diagram_rounding.N.value === diagram_rounding.distance ? "\u2714" : "");
});

let diagram_grid_movement = new Diagram('diagram-grid-movement')
  .add_track()
  .add_line_draw()
  .add_endpoints();
diagram_grid_movement.find_line = function() {
  this.points = walk_grid(this.endpoints[0], this.endpoints[1]);
};
diagram_grid_movement.redraw();

function walk_grid(p0, p1) {
  let dx = p1.x - p0.x,
    dy = p1.y - p0.y;
  let nx = Math.abs(dx),
    ny = Math.abs(dy);
  let sign_x = dx > 0 ? 1 : -1,
    sign_y = dy > 0 ? 1 : -1;

  let p = new Point(p0.x, p0.y);
  let points = [new Point(p.x, p.y)];
  for (let ix = 0, iy = 0; ix < nx || iy < ny;) {
    if ((0.5 + ix) / nx < (0.5 + iy) / ny) {
      // next step is horizontal
      p.x += sign_x;
      ix++;
    } else {
      // next step is vertical
      p.y += sign_y;
      iy++;
    }
    points.push(new Point(p.x, p.y));
  }
  return points;
}

let diagram_supercover = new Diagram('diagram-supercover')
  .add_track()
  .add_line_draw()
  .add_endpoints();
diagram_supercover.find_line = function() {
  this.points = supercover_line(this.endpoints[0], this.endpoints[1]);
};
diagram_supercover.redraw();

function supercover_line(p0, p1) {
  let dx = p1.x - p0.x,
    dy = p1.y - p0.y;
  let nx = Math.abs(dx),
    ny = Math.abs(dy);
  let sign_x = dx > 0 ? 1 : -1,
    sign_y = dy > 0 ? 1 : -1;

  let p = new Point(p0.x, p0.y);
  let points = [new Point(p.x, p.y)];
  for (let ix = 0, iy = 0; ix < nx || iy < ny;) {
    let decision = (1 + 2 * ix) * ny - (1 + 2 * iy) * nx;
    if (decision === 0) {
      // next step is diagonal
      p.x += sign_x;
      p.y += sign_y;
      ix++;
      iy++;
    } else if (decision < 0) {
      // next step is horizontal
      p.x += sign_x;
      ix++;
    } else {
      // next step is vertical
      p.y += sign_y;
      iy++;
    }
    points.push(new Point(p.x, p.y));
  }
  return points;
}
