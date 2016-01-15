/*
* svg.rx.constraints.js
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

  //--- SVG.Point ---
  //
  assert( typeof SVG.Rx === "undefined" );

  SVG.Rx = {};

  SVG.Rx.Point = SVG.invent({
    // Initialize node
    create: function () {    // ()
      // ...
      assert(false);
    },

    // Add class methods
    extend: {
      fix: function () {
        assert(false);
      },
      constrain: function (p2, f) {   // (SVG.Rx.Point, (SVG.Rx.Point, SVG.Rx.Point) -> ???) -> ???
        assert(false);
      }
    }

  })

})();
