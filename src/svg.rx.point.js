/*
* svg.rx.point.js
*/
/*jshint devel:true */

(function () {
  "use strict";

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

  SVG.Rx = SVG.Rx || {};


  //--- SVG.Rx.Dist ---
  //
  //  .value: Num
  //
  // ... tbd ...


  //--- SVG.Rx.Point ---
  //
  //  .x: Num
  //  .y: Num
  //
  //  ._obs: observable of {x:Num,y:Num}
  //
  SVG.Rx.Point = SVG.invent({
    // Initialize node
    create: function (a,b) {    // () or (x:Num, y:Num) or (SVG.Rx.Point)

      var ta = typeof a;
      var tb = typeof b;

      if (args.length === 0)) {
        this.x = this._y = Number.NaN;

      if ((args.length === 2) && (ta === "number") && (tb === "number")) {
        this.x = a;
        this.y = b;

      } else if ((args.length === 1) && (a instanceof SVG.Rx.Point)) {
        this.x = a.x;
        this.y = a.y;

      } else {
        throw "Unexpected params to 'SVG.Rx.Point': " + args;
      }

      this._obs = Rx.Observable.create( function (obs) {
        if (!this.x.isNan) {
          obs.onNext(this);   // initial value
        }
        this._secretObs = obs;    // tbd. unnecessary if also 'this._obs' be used for '.onNext' AKa170116

        //return undefined;   // no cleanup
      })
    },

    // Add class methods
    extend: {
      set: function (cx,cy) {   // (cx:Num,cy:Num) ->
        this._obs.onNext({x:cx,y:cy});
      },

      subscribe: function (f) {   // ( ({x:Num,y:Num} ->) -> subscription
        return this._obs.subscribe(f);
      }
    }

  });


  //--- SVG.Rx.Circle ---
  //
  //  ._cp: SVG.Rx.Point
  //  ._r: SVG.Rx.Dist
  //
  // Note: Unlike 'svg.js', we use the second parameter as a radius (not diameter).
  //
  SVG.Rx.Circle = SVG.invent({
    create: function (cp,r) {   // ([SVG.Rx.Point [, r:SVG.Rx.Dist]]) ->
      this._cp = cp || new SVG.Rx.Point();
      this._r = r || new SVG.Rx.Dist(10);

      this._cp.subscribe( function (o) {
        this.attr('cx',o.x).attr('cy',o.y);        // Note: bypass 'svg.js' code by purpose - it would simply do this
      });

      this._r.subscribe( function (r) {
        this.attr('r',r);
      });

      // tbd. do we need such?
      //this.constructor.call(this, ...)
    },

    inherit: SVG.Circle,

    construct: {          // parent method to create these
      rx_circle: function (cp,r) {   // (SVG.Rx.Point [,SVG.Rx.Dist]) -> SVG.Rx.Circle

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
          this._cp.set(cx,cy);      // distributes the knowledge to possible other users of the point
          return this;

        } else {
          return this._cp;
        }
      },

      radius: function (r) {    // (Num) -> this or () -> SVG.Rx.Dist
        if (args.length === 1) {
          this._r.set(r);
          return this;

        } else {
          return this._r;
        }
      },

      move: notSupported,
      cx: notSupported,
      cy: notSupported,
      radius: notSupported
    }
  })

})();
