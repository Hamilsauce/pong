// From http://www.redblobgames.com/
// Copyright 2016 Red Blob Games <redblobgames@gmail.com>
// License: Apache v2.0 <http://www.apache.org/licenses/LICENSE-2.0.html>

///<reference path="observable.ts" />

/* Use these to forward or backward translate a coordinate, or also to
 * build svg transform= attribute values. They take Observables as
 * arguments. */

interface Transform {
    forwards(p:number[]):number[];
    backwards(p:number[]):number[];
    toString():string;
}


class ScaleTransform implements Transform {
    constructor (public kx, public ky) {}
    forwards(p) { return [p[0] * this.kx.get(), p[1] * this.ky.get()]; }
    backwards(p) { return [p[0] / this.kx.get(), p[1] / this.ky.get()]; }
    toString() { return "scale(" + [this.kx.get(), this.ky.get()] + ")"; }
}


class TranslateTransform implements Transform {
    constructor (public dx, public dy) {}
    forwards(p) { return [p[0] + this.dx.get(), p[1] + this.dy.get()]; }
    backwards(p) { return [p[0] - this.dx.get(), p[1] - this.dy.get()]; }
    toString() { return "translate(" + [this.dx.get(), this.dy.get()] + ")"; }
}


class RotateTransform implements Transform {
    constructor (public angle_degrees) {}
    forwards(p) { return point_rotate(p, this.angle_degrees*Math.PI/180); }
    backwards(p) { return point_rotate(p, -this.angle_degrees*Math.PI/180); }
    toString() { return "rotate(" + this.angle_degrees.get() + ")"; }
}


class SkewXTransform implements Transform {
    constructor (public skew_x_degrees) {}
    forwards(p) { return [p[0] + p[1] * Math.tan(Math.PI/180 * this.skew_x_degrees.get()), p[1]]; }
    backwards(p) { return [p[0] - p[1] * Math.tan(Math.PI/180 * this.skew_x_degrees.get()), p[1]]; }
    toString() { return "skewX(" + this.skew_x_degrees.get() + ")"; }
}


class ChainTransforms implements Transform {
    constructor (public transforms) {}
    forwards(p) { return this.transforms.reduce((prev, curr) => curr.forwards(prev), p); }
    backwards(p) { return this.transforms.reduceRight((prev, curr) => curr.backwards(prev), p); }
    toString() { return this.transforms.join(" "); }
}

