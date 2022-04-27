// From http://www.redblobgames.com/articles/coordinate-transforms/
// Copyright 2016 Red Blob Games <redblobgames@gmail.com>
// License: Apache v2.0 <http://www.apache.org/licenses/LICENSE-2.0.html>

///<reference path="typings/d3/d3.d.ts" />
///<reference path="zobservable.ts" />
///<reference path="ztransforms.ts" />
///<reference path="ztile-map.ts" />


/** Represents a tile map with an outer margin showing axes */
class TileMapDiagram {
  svg;
  underlay;
  root;
  overlay;
  scale = 40;
  world = { width: this.map.width * this.scale, height: this.map.height * this.scale };
  view = { width: 500, height: 200, x_margin: 50, y_margin: 25 };

  camera_x = new Observable(0, -this.world.width, this.view.width);
  camera_y = new Observable(0, -this.world.height, this.view.height);
  camera_transform = new TranslateTransform(this.camera_x, this.camera_y);

  player_x = new Observable(0, 0, this.world.width);
  player_y = new Observable(0, 0, this.world.height);
  player_direction = new Observable(1, -1, +1);
  player_transform = new ChainTransforms([
        new TranslateTransform(this.player_x, this.player_y),
        new ScaleTransform(constant(1.5), constant(1.5)),
        new ScaleTransform(this.player_direction, constant(1.0))
    ]);

  player_sprite;


  constructor(public selector: string, public map: TiledMap) {
    var view = this.view;
    this.svg = d3.select(selector).append('svg')
      .attr('viewBox', [-view.x_margin, -view.y_margin,
                              view.width + 2 * view.x_margin,
                              view.height + 2 * view.y_margin].join(" "));
    this.underlay = this.svg.append('g');
    this.root = this.svg.append('g');
    this.overlay = this.svg.append('g');

    this.underlay.append('rect')
      .attr('width', view.width)
      .attr('height', view.height)
      .attr('fill', "hsl(200,40%,80%)");

    this.overlay.append('rect')
      .attr('x', -view.x_margin)
      .attr('y', view.y_margin)
      .attr('width', view.x_margin)
      .attr('height', view.height - view.y_margin)
      .attr('fill', "hsl(60,20%,95%)")
      .attr('fill-opacity', 0.8);
    this.overlay.append('rect')
      .attr('x', view.width)
      .attr('y', view.y_margin)
      .attr('width', view.x_margin)
      .attr('height', view.height - view.y_margin)
      .attr('fill', "hsl(60,20%,95%)")
      .attr('fill-opacity', 0.8);

    this.make_map();
    this.add_x_axes();
    this.camera_x.trigger(this.update_camera_position.bind(this));
    this.camera_y.trigger(this.update_camera_position.bind(this));
    // TODO: add mouse drag of view -- but not when player sprite
    // is used
  }


  make_map() {
    for (var row = 0; row < this.map.height; row++) {
      for (var col = 0; col < this.map.width; col++) {
        var url = this.map.get(col, row);
        if (url) {
          this.root.append('image')
            .attr('xlink:href', "art/" + url)
            .attr('x', this.scale * col)
            .attr('y', this.scale * row)
            .attr('width', this.scale)
            .attr('height', this.scale);
        }
      }
    }
  }


  add_x_axes() {
    var x_axis_view_svg = this.overlay.append('g')
      .attr('class', "axis x-axis view");
    var x_axis_view = d3.svg.axis()
      .tickFormat(d3.format('d'))
      .orient('top');

    var x_axis_world_svg = this.root.append('g')
      .attr('class', "axis x-axis world");
    var x_axis_world = d3.svg.axis()
      .tickFormat(d3.format('d'))
      .orient('bottom');

    x_axis_world.tickValues(d3.range(-this.view.width, this.world.width + this.view.width, 50));
    x_axis_world_svg.call(x_axis_world);
    x_axis_view.tickValues(d3.range(0, 1 + this.view.width, 50));
    x_axis_view_svg.call(x_axis_view);
  }


  update_camera_position() {
    this.root
      .transition()
      .ease('linear')
      .duration(100)
      .attr('transform', this.camera_transform);
  }


  add_player_sprite() {
    this.player_sprite = this.root.append('g');
    this.player_sprite.append('line')
      .attr('y1', -this.view.height)
      .attr('y2', this.view.height)
      .attr('fill', "none")
      .attr('stroke', "hsl(240,10%,50%)")
      .attr('stroke-opacity', 0.1)
      .attr('stroke-width', 3);
    this.player_sprite.append('image')
      .attr('class', "player")
      .attr('xlink:href', "art/alien-pink-walk-1.png")
      .attr('width', this.scale)
      .attr('height', this.scale)
      .attr('transform', new TranslateTransform(constant(-this.scale / 2), constant(-this.scale)));
    this.player_x.trigger(this.callback_player_x.bind(this));
  }


  set_player_updates_camera() {
    this.camera_x.trigger(() => {
      var new_x = 0.5 * this.view.width - this.camera_x.get();
      if (new_x != this.player_x.get()) {
        this.player_x.set(new_x);
      }
    });
  }

  callback_player_x(previous_x) {
    // Update the player direction for animation reasons; don't
    // update if value hasn't changed; NOTE: this is only for the
    // platformer player sprite
    var dx = this.player_x.get() - previous_x;
    if (dx > 0) { this.player_direction.set(+1); }
    if (dx < 0) { this.player_direction.set(-1); }

    // Update the player y based on the map; NOTE: this is hard-coded to the platformer sprites right now
    this.player_y.set(get_player_y(this.map, this.scale, this.view, this.player_x.get()));

    // Update the player sprite for a simple walk animation
    var pixels_per_step = 10;
    var sprite_asset = "art/alien-pink-walk-" + ["1.png", "2.png"]
        [Math.floor(Math.abs(this.player_x.get() / pixels_per_step)) % 2];

    // Move the sprite with an animated linear transition. NOTE:
    // when scrolling fast this can be in the wrong position,
    // because it linearly interpolates the y position instead of
    // calling get_player_y for each x
    this.player_sprite.select("image")
      .attr('xlink:href', sprite_asset);
    this.player_sprite
      .transition()
      .ease('linear')
      .duration(Math.min(Math.abs(10 * dx), 100))
      .attr('transform', this.player_transform);
  }
}


/** Calculate the "floor" in pixel coords for a platformer map that uses */
function get_player_y(map, scale, view, x) {
  var col = Math.floor(x / scale);
  var frac = (x / scale) - col;
  for (var row = 0; row < map.height; row++) {
    var code = map.get(col, row);
    if (code == 'grass-mid.png') { return row * scale; }
    if (code == 'grass-hill-right.png') { return (row + 1 - frac) * scale; }
    if (code == 'grass-hill-left.png') { return (row + frac) * scale; }
  }
  return view.height;
}



var main_map;
var platformer_object, platformer_player;

d3.xml("art/Platformer.tmx", "text/xml", (xml) => {
  main_map = new TiledMap(xml);

  platformer_object = new TileMapDiagram("#demo-objectpos", main_map);
  platformer_object.add_player_sprite();
  tie("var[v='objectpos-camera-x']", platformer_object.camera_x, "f");
  tie("var[v='objectpos-player-x']", platformer_object.player_x, "f");

  platformer_player = new TileMapDiagram("#demo-playerpos", main_map);
  platformer_player.add_player_sprite();
  platformer_player.set_player_updates_camera();
  tie("var[v='playerpos-camera-x']", platformer_player.camera_x, "f");
  tie("var[v='playerpos-player-x']", platformer_player.player_x, "f");

  // TODO: need to control whether camera is set by player or if player is set by camera -- probably we should make camera always set by player! but then I also need a tie() option that's read-only
});
