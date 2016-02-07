/*
* svg.rx.angle.js
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


  //--- SVG.Rx.Angle ---
  //
  //  .asDeg(): Num
  //  .asRad(): Num
  //
  //  ._sub: subject of Num
  //  ._obsDistinct: observable of Num    // only changed values are emitted (in radians)
  //
  SVG.Rx.Angle = SVG.invent({
    // Initialize node
    create: function (rad) {    // () or (rad:Num) or (SVG.Rx.Angle)
      var trad = typeof rad;

      if (arguments.length === 0) {
        this._rad = Number.NaN;    // no emission

      } else if ((arguments.length === 1) && (trad === "number")) {
        this._rad = rad;

      } else if ((arguments.length === 1) && (trad instanceof SVG.Rx.Angle)) {
        this._rad = a._rad;

      } else {
        throw "Unexpected params to 'SVG.Rx.Angle': " + arguments;
      }

      this._sub = new Rx.Subject();
      this._obsDistinct = this._sub.distinctUntilChanged();
    },

    // Add class methods
    extend: {
      setRad: function (v) {   // (v:Num) ->
        this._rad = v;
        this._sub.next(v);
      },

      setDeg: function (v) {   // (v:Num) ->
        this.setRad( v * (Math.PI/180.0) );
      },

      subscribe: function (f) {   // ((rad:Num) ->) -> subscription
        var subscription = this._obsDistinct.subscribe(f);

        // Emit the current values, if there are any (what 'BehaviorSubject' would do by default).
        //
        if (!isNaN(this._rad)) {
          this._sub.next(this._rad);
        }

        return subscription;
      }
    }

  });

})();
