/*
* gx.js
*/
/*jshint devel:true */

(function () {
  "use strict";

  function assert(b,msg) {    // (boolish, String) =>
    if (!b) {
      throw ("Assert failed" + (msg ? ": "+msg : ""))
    }
  }
  assert(true);   // use it up (jshint)

  SVG.Rx = SVG.Rx || {};


  //--- SVG.Rx.gx ---
  //
  //  .xxx: Xxx
  //
  SVG.Rx.gx = SVG.invent({
  ...
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
