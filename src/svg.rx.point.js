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
  //  ._obs: observable of Num    // only changed values are emitted
  //
  SVG.Rx.Dist = SVG.invent({
    // Initialize node
    create: function (a) {    // () or (d:Num) or (SVG.Rx.Dist)
      var ta = typeof a;

      this._obs = Rx.Observable.create( function (obs) {
        this._secretObs = obs;    // tbd. unnecessary if also 'this._obs' be used for '.onNext' AKa170116

        //return undefined;   // no cleanup
      }).distinctUntilChanged();

      if (arguments.length === 0) {
        this.value = Number.NaN;    // no emission

      } else if ((arguments.length === 1) && (ta === "number")) {
        this.set(a);

      } else if ((arguments.length === 1) && (a instanceof SVG.Rx.Dist)) {
        this.set(a.value);

      } else {
        throw "Unexpected params to 'SVG.Rx.Dist': " + arguments;
      }
    },

    // Add class methods
    extend: {
      set: function (v) {   // (v:Num) ->
        this._obs.onNext(v);
      },

      subscribe: function (f) {   // ( ({x:Num,y:Num} ->) -> subscription
        return this._obs.subscribe(f);
      }
    }

  });


  //--- SVG.Rx.Point ---
  //
  //  .x: Num
  //  .y: Num
  //
  //  ._sub: observable of {x:Num,y:Num}    // only changed values are emitted
  //
  SVG.Rx.Point = SVG.invent({
    // Initialize node
    create: function (a,b) {    // () or (x:Num, y:Num) or (SVG.Rx.Point)
      var self = this;

      var ta = typeof a;
      var tb = typeof b;

      // tbd. Make so that setting to existing value will not cause new emissions. However, '.distinctUntilChanged'
      //    probably compares the values by reference, and would therefore not notice that our '.x' and '.y' have
      //    changed. AKa170116

      this._obs = Rx.Observable.create( function (obs) {
        self._secretObs = obs;    // tbd. unnecessary if also 'this._obs' be used for '.onNext' AKa170116

        //return undefined;   // no cleanup
      });

      if (arguments.length === 0) {
        this.x = this._y = Number.NaN;    // no emission

      } else if ((arguments.length === 2) && (ta === "number") && (tb === "number")) {
        this.set.call(this,a,b);

      } else if ((arguments.length === 1) && (a instanceof SVG.Rx.Point)) {
        this.set(a.x, a.y);

      } else {
        throw "Unexpected params to 'SVG.Rx.Point': " + arguments;
      }
    },

    // Add class methods
    extend: {
      set: function (cx,cy) {   // (cx:Num,cy:Num) ->
        console.log( this );
        assert( this );

        // Note: Do change detection here (instead of using '.distinctUntilChanged') since '.distinctUntilChanged' might
        //      not see multiple emissions of the same object (with different fields) as distinct. Or does it? Haven't tried. tbd. AKa170116
        //
        if ((cx !== this.x) || (cy !== this.y)) {
          this._secretObs.onNext(this);
        }
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
    create: function (cp,r) {   // ([SVG.Rx.Point [, r:SVG.Rx.Dist or Num]]) ->
      this._cp = cp || new SVG.Rx.Point();
      this._r =
        r instanceof SVG.Rx.Dist ? r
          : new SVG.Rx.Dist( typeof r === "number" ? r : 10 );

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
      rx_circle: function (cp,r) {   // (SVG.Rx.Point [,SVG.Rx.Dist or Num]) -> SVG.Rx.Circle

        return this.put(new SVG.Rx.Circle(cp,r));
      }
    },

    // Override the setting/access functions
    //
    extend: {
      center: function (cx,cy) {   // (cx:Num,cy:Num) -> this or () -> SVG.Rx.Point
        if (arguments.length === 2) {
          this._cp.set(cx,cy);      // distributes the knowledge to possible other users of the point
          return this;

        } else {
          return this._cp;
        }
      },

      radius: function (r) {    // (Num) -> this or () -> SVG.Rx.Dist
        if (arguments.length === 1) {
          this._r.set(r);
          return this;

        } else {
          return this._r;
        }
      },

      move: notSupported,
      cx: notSupported,
      cy: notSupported
    }
  });

  //--- SVG.Rx.Line ---
  //
  //  ._pa: SVG.Rx.Point
  //  ._pb: SVG.Rx.Point
  //
  SVG.Rx.Line = SVG.invent({
    create: function (a,b) {   // (SVG.Rx.Point, SVG.Rx.Point) ->
      this._pa = a;
      this._pb = b;

      // tbd. do we need such?
      //this.constructor.call(this, ...)
    },

    inherit: SVG.Line,

    construct: {          // parent method to create these
      rx_line: function (a,b) {   // (SVG.Rx.Point, SVG.Rx.Point) -> SVG.Rx.Line

        return this.put(new SVG.Rx.Line(a,b));
      }
    },

    // Override the access functions
    //
    extend: {
      // Note: We do not support the "point string", "point array" and 'SVG.PointArray' variants of 'svg.js'.
      //
      plot: function (ax,ay,bx,by) {   // (ax:Num,ay:Num,bx:Num,by:Num) -> this
        var tax = typeof ax;
        var tay = typeof ay;
        var tbx = typeof bx;
        var tby = typeof by;

        if ((arguments.length === 4) && (tax === "number") && (tay === "number") && (tbx === "number") && (tby === "number")) {
          this._pa.set(ax,ay);
          this._pb.set(bx,by);
          return this;

        } else {
          notSupported();
        }
      },

      array: notSupported
    }
  });

})();
