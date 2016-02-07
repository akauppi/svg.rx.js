/*
* svg.rx.circle.js
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

  // A function used when hiding out svg.js methods
  //
  function notSupported (s) {   // (String) -> () -> never returns
    return function () {
      throw "Access to method '"+s+"' not supported in 'svg.rx.js'";
    }
  }

  SVG.Rx = SVG.Rx || {};

  assert( SVG.Rx.Point && SVG.Rx.Dist );    // what we need (until we get some module system up)

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

})();
