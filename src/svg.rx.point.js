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

  // tbd. Could get this from main 'svg.rx.js' in some way (non-DRY) AKa310116
  //
  var RxJS5 = !!Rx.Subscriber;

  // Check the things we will use of 'Rx'
  //
  assert( typeof Rx.Subject === "function" );

  // A function used when hiding out svg.js methods
  //
  function notSupported (s) {   // (String) -> () -> never returns
    return function () {
      throw "Access to method '"+s+"' not supported in 'svg.rx.js'";
    }
  }

  SVG.Rx = SVG.Rx || {};


  //--- SVG.Rx.Dist ---
  //
  //  .value: Num
  //
  //  ._sub: subject of Num
  //  ._obsDistinct: observable of Num  // only changed values are emitted
  //
  SVG.Rx.Dist = SVG.invent({
    // Initialize node
    create: function (a) {    // () or (d:Num) or (SVG.Rx.Dist)
      var ta = typeof a;

      if (arguments.length === 0) {
        this.value = Number.NaN;    // no emission

      } else if ((arguments.length === 1) && (ta === "number")) {
        this.value = a;

      } else if ((arguments.length === 1) && (a instanceof SVG.Rx.Dist)) {
        this.value = a.value;

      } else {
        throw "Unexpected params to 'SVG.Rx.Dist': " + arguments;
      }

      this._sub = new Rx.Subject();
      this._obsDistinct = this._sub.distinctUntilChanged();
    },

    // Add class methods
    extend: {
      set: function (v) {   // (v:Num) ->
        this.value = v;
        if (RxJS5) {
          this._sub.next(v);
        } else {
          this._sub.onNext(v);  // RxJS4
        }
      },

      subscribe: function (f) {   // ( ({x:Num,y:Num} ->) -> subscription
        var subscription = this._obsDistinct.subscribe(f);

        // Emit the current values, if there are any (what 'BehaviorSubject' would do by default).
        //
        if (!isNaN(this.value)) {
          if (RxJS5) {
            this._sub.next(this.value);
          } else {
            this._sub.onNext(this.value);
          }
        }

        return subscription;
      }
    }

  });


  //--- SVG.Rx.Point ---
  //
  //  .x: Num
  //  .y: Num
  //
  //  ._sub: subject of {x:Num,y:Num}
  //  ._obs: observable of {x:Num,y:Num}    // only changed values are emitted
  //
  SVG.Rx.Point = SVG.invent({
    // Initialize node
    create: function (a,b) {    // () or (x:Num, y:Num) or (SVG.Rx.Point)
      //var self = this;

      var ta = typeof a;
      var tb = typeof b;

      if (arguments.length === 0) {
        this.x = Number.NaN;
        this.y = Number.NaN;

      } else if ((arguments.length === 2) && (ta === "number") && (tb === "number")) {
        this.x = a;
        this.y = b;

      } else if ((arguments.length === 1) && (a instanceof SVG.Rx.Point)) {
        this.x = a.x;
        this.y = a.y;

      } else {
        throw "Unexpected params to 'SVG.Rx.Point': " + arguments;
      }

      // tbd. Make so that setting to existing value will not cause new emissions. However, '.distinctUntilChanged'
      //    probably compares the values by reference, and would therefore not notice that our '.x' and '.y' have
      //    changed. AKa170116

      // Note: 'Rx.BehaviorSubject' would give a nice starting value, but for the 'SVG.Rx.Point()' constructor, we
      //      don't want that. So this is a bit more elaborate. Note that any values emitted before the caller
      //      actually subscribes, are lost.

      this._sub = new Rx.Subject();
    },

    // Add class methods
    extend: {
      // Setting the values once it is possible someone's subscribed
      //
      set: function (cx,cy) {   // (cx:Num,cy:Num) ->

        // Note: Do change detection here (instead of using '.distinctUntilChanged') since '.distinctUntilChanged' might
        //      not see multiple emissions of the same object (with different fields) as distinct. Or does it? Haven't tried. tbd. AKa170116
        //
        if ((cx !== this.x) || (cy !== this.y)) {
          this.x = cx;
          this.y = cy;
          //console.log( this, "onNext", cx, cy );
          if (RxJS5) {
            this._sub.next(this);
          } else {
            this._sub.onNext(this);
          }
        }
      },

      subscribe: function (f) {   // ( ({x:Num,y:Num} ->) -> subscription
        //console.log( "subscribed" );
        var subscription= this._sub.subscribe(f);    // this call runs the things within the observable constructor

        // Emit the current values, if there are any (what 'BehaviorSubject' would do by default).
        //
        if (!isNaN(this.x)) {
          if (RxJS5) {
            this._sub.next(this);
          } else {
            this._sub.onNext(this);
          }
        }

        return subscription;
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
      var self= this;

      this.constructor.call(this, SVG.create('circle'));

      this._cp = cp || new SVG.Rx.Point();
      this._r = r instanceof SVG.Rx.Dist ? r
                  : new SVG.Rx.Dist( typeof r === "number" ? r : 10 );

      this._cp.subscribe( function (o) {
        //console.log( "Heard point changed", o );
        self.attr('cx',o.x).attr('cy',o.y);        // Note: bypass 'svg.js' code by purpose - it would simply do this
      });

      this._r.subscribe( function (r) {
        //console.log( "Heard radius changed", r );
        self.attr('r',r);
      });
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
          //console.log("Going to set _cp");
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

      cx: notSupported('cx'),
      cy: notSupported('cy'),
      x: notSupported('x'),
      y: notSupported('y'),
      width: notSupported('width'),
      height: notSupported('height'),
      move: notSupported('move')
    }
  });

  //--- SVG.Rx.Line ---
  //
  //  ._pa: SVG.Rx.Point
  //  ._pb: SVG.Rx.Point
  //
  SVG.Rx.Line = SVG.invent({
    create: function (a,b) {   // (SVG.Rx.Point, SVG.Rx.Point) ->
      var self = this;

      this.constructor.call(this, SVG.create('line'));

      this._pa = a;
      this._pb = b;

      this._pa.subscribe( function (o) {
        self.attr('x1',o.x).attr('y1',o.y);     // Note: bypass 'svg.js' code by purpose - it would simply do this
      });

      this._pb.subscribe( function (o) {
        self.attr('x2',o.x).attr('y2',o.y);     // Note: bypass 'svg.js' code by purpose - it would simply do this
      });
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
          throw "'.plot' with these parameters not supported in 'svg.rx.js': "+ arguments;
        }
      },

      array: notSupported('array'),
      move: notSupported('move'),
      size: notSupported('size')
    }
  });

})();
