/*
* svg.rx.constraints.js
*/
/*jshint devel:true */

(function () {
  "use strict";

  var UNCOMFORTABLE = "uncomfortable";

  function assert(b,msg) {    // (boolish, String) =>
    if (!b) {
      throw ("Assert failed" + (msg ? ": "+msg : ""))
    }
  }
  assert(true);   // just use it up (jshint)

  // A function used when hiding out svg.js methods
  //
  function notSupported () {
    throw "Access to this method not supported in 'svg.rx.js'";
  }

  //--- SVG.Rx.Constraints.Point ---
  //
  assert( typeof SVG.Rx === "undefined" );

  SVG.Rx = {};

  SVG.Rx.Point = SVG.invent({
    // Initialize node
    create: function (a,b) {    // () or (x:Int, y:Int) or (pb: Point, ({x:Int, y:Int}) -> {x:Int, y:Int})

      var ta = typeof a;
      var tb = typeof b;

      if (args.length === 0)) {
        this._x = 0;
        this._y = 0;

      if ((args.length === 2) && (ta === "number") && (tb === "number")) {
        this._x = a;
        this._y = b;

      } else if ((args.length === 2) && (a instanceof SVG.Rx.Constraints.Point) && (tb === "function")) {
        ...

      } else {
        throw "Unexpected params to 'SVG.Rx.Conststraints.Point': " + args;
      }
    },

    // Add class methods
    extend: {
      fix: function () {
        assert(false);
      },
      constrain: function (p2, f) {   // (SVG.Point, (SVG.Point, SVG.Point) -> ???) -> ???
        assert(false);
      }
    }

  });

  //--- SVG.Rx.Circle ---
  //
  var oldSVGCircle = SVG.Circle;      // the earlier constructor

  var oldSVGCircleMethod = SVG.prototype.circle;

  SVG.Rx.Circle = SVG.invent({
    create: function (cp,r) {   // ([SVG.Rx.Point [, r:SVG.Rx.Dist]]) ->
      this._cp = cp || new SVG.Rx.Point();
      this._r = r || new SVG.Rx.Dist(10);

      this.constructor.call(this, element)
    },

    inherit: SVG.Circle,

    construct: {          // parent method to create these
      rx_circle: function (cp,r) {   // (SVG.Rx.Point [, r:SVG.Rx.Dist]) -> SVG.Circle

        return this.put(new SVG.Rx.Circle(cp,r));
      }
    },

    // Override the setting functions
    //
    // With 'svg.rx.js', if setting a value does not please the constraints, the value remains unchanged, and the
    // element becomes tagged with "uncomfortable" class - until the constraint is pleased, again.
    //
    extend: {
      center: function (cx,cy) {   // (cx:Num,cy:Num) -> this or () -> SVG.Rx.Point
        if (args.length === 2) {
          this._cp.trySet(cx,cy,this);
          return this;

        } else {
          throw "tbd. What exactly should we return here?";
        }
      },

      r: function (r) {    // (r:Num) -> this or () -> SVG.Rx.Dist
        if (args.length === 1) {
          this._r.set(r,this);
          return this;

        } else {
          throw "tbd. What exactly should we return here?";
        }
      },

      move: notSupported,
      cx: notSupported,
      cy: notSupported,
      radius: notSupported
    }
  })

})();
