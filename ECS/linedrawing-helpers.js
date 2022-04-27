// "Scrubbable" numbers library, inspired by Bret Victor's Tangle, but uses d3 instead
// From http://www.redblobgames.com/
// Copyright 2014 Red Blob Games <redblobgames@gmail.com>
// License: Apache v2.0 <http://www.apache.org/licenses/LICENSE-2.0.html>
///<reference path="typings/d3/d3.d.ts" />
// Very simple observable that has a list of observers
const {scale}=d3
var ObservableValue = (function() {
  function ObservableValue(_value) {
    this._value = _value;
    this.notify = [];
  }
  
  ObservableValue.prototype.trigger = function(f) {
    this.notify.push(f);
  };
  
  Object.defineProperty(ObservableValue.prototype, "value", {
    get: function() {
      return this._value;
    },
    set: function(_value) {
      this._value = _value;
      this.notify.forEach(function(f) { return f(); });
    },
    enumerable: true,
    configurable: true
  });
  return ObservableValue;
})();

// Set of "scrubbable" numbers on the page. Dragging the mouse or
// finger left/right will change the value. This function makes a
// scrubbable number and assigns all dom elements with data-name="foo"
// to them.

function make_scrubbable(name, initial_value, range, precision) {
  var scrubbable = new ObservableValue(initial_value);
  var elements = d3.selectAll("[data-name='" + name + "']");
  elements.classed('draggable', true);
  var inner = elements.append('span');

  function update() {
    inner.text(function() {
      var element = d3.select(this.parentNode);
      var format = element.attr('data-format');
      return d3.format(format)(scrubbable.value);
    });
  };
  scrubbable.trigger(update);
  
  update();
  
  var position_to_value = d3.scale.linear().clamp(true).domain([-100, 100]).range(range);
  var zoom = d3.behavior.zoom().scaleExtent([1, 1]).translate([position_to_value.invert(initial_value), 0]).on('zoomstart', function() {
    d3.select(this).classed('dragging', true);
  }).on('zoomend', function() {
    d3.select(this).classed('dragging', false);
  }).on('zoom', function() {
    var pos = d3.event.translate[0];
    scrubbable.value = Math.round(position_to_value(pos) / precision) * precision;
    zoom.translate([position_to_value.invert(scrubbable.value), 0]);
  });
  elements.call(zoom);
  return scrubbable;
}
