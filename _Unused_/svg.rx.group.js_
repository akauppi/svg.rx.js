/*
* svg.rx.group.js
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
  function notSupported (s) {   // (String) -> () -> never returns
    return function () {
      throw "Access to method '"+s+"' not supported in 'svg.rx.js'";
    }
  }

  SVG.Rx = SVG.Rx || {};

  assert( SVG.Rx.Point && SVG.Rx.Angle );    // what we need (until we get some module system up)

  //--- SVG.Rx.Group ---
  //
  //  ._cp: SVG.Rx.Point
  //  ._angle: SVG.Rx.Angle
  //
  SVG.Rx.Group = SVG.invent({
    create: function (cp,angle) {   // ([SVG.Rx.Point [, r:SVG.Rx.Angle or Num]]) ->
      var self= this;

      this.constructor.call(this, SVG.create('g'));

      this._cp = cp || new SVG.Rx.Point();
      this._r = r instanceof SVG.Rx.Angle ? angle
                  : new SVG.Rx.Angle( typeof angle === "number" ? angle : 0 );

      this._cp.subscribe( function (o) {
        //console.log( "Heard point changed", o );

        alert("tbd!");
        //self.attr('cx',o.x).attr('cy',o.y);        // Note: bypass 'svg.js' code by purpose - it would simply do this
      });

      this._angle.subscribe( function (rad) {
        alert("tbd!");
        //self.attr('r',r);
      });
    },
    inherit: SVG.G,

    construct: {          // parent method to create these
      rx_group: function (cp,angle) {   // (SVG.Rx.Point [,SVG.Rx.Angle or Num]) -> SVG.Rx.Group

        return this.put(new SVG.Rx.Group(cp,angle));
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


    /*** original 'svg.js' Group methods:

    x: function(x) {
      return x == null ? this.transform('x') : this.transform({ x: x - this.x() }, true)
    }
    // Move over y-axis
  , y: function(y) {
      return y == null ? this.transform('y') : this.transform({ y: y - this.y() }, true)
    }
    // Move by center over x-axis
  , cx: function(x) {
      return x == null ? this.tbox().cx : this.x(x - this.tbox().width / 2)
    }
    // Move by center over y-axis
  , cy: function(y) {
      return y == null ? this.tbox().cy : this.y(y - this.tbox().height / 2)
    }
  , gbox: function() {

      var bbox  = this.bbox()
        , trans = this.transform()

      bbox.x  += trans.x
      bbox.x2 += trans.x
      bbox.cx += trans.x

      bbox.y  += trans.y
      bbox.y2 += trans.y
      bbox.cy += trans.y

      return bbox
    }
    ***/
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
