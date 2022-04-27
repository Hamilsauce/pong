// From http://www.redblobgames.com/
// Copyright 2016 Red Blob Games <redblobgames@gmail.com>
// License: Apache v2.0 <http://www.apache.org/licenses/LICENSE-2.0.html>


function Observable(value, lo, hi) {
    var notify = [];
    this.range = [lo, hi];
    this.trigger = function(f) { notify.push(f); f(value); }
    this.get = function() { return value; };
    this.set = function(v) {
        var previous_value = value;
        if (v < this.range[0]) v = this.range[0];
        if (v > this.range[1]) v = this.range[1];
        value = v;
        notify.forEach((f) => f(previous_value));
    };
}

function constant(v) {
    return new Observable(v, v, v);
}
