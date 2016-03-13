/*
* svg.rx.angle.js
*/
/*jshint devel:true */
/*globals assert */

(function () {
  "use strict";

  assert(assert);

  // A function used when hiding out svg.js methods
  //
  function notSupported (s) {   // (String) -> () -> never returns
    return function () {
      throw "Access to method '"+s+"' not supported in 'svg.rx.js'";
    }
  }
  assert(notSupported);   // used up (jshint)

  SVG.Rx = SVG.Rx || {};

  var RAD_TO_DEG = (180.0/Math.PI);   // multiple rad to get deg; divide deg to get rad

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
        this._rad = trad._rad;

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
        this.setRad( v / RAD_TO_DEG );
      },

      asRad: function () {   // () -> Num
        return this._rad;
      },

      asDeg: function () {   // () -> Num
        return this.asRad() * RAD_TO_DEG;
      },

      _obsWithInitialValueRad: function () {    // () -> Observable of Num

        // Emit the current values, if there are any (what 'BehaviorSubject' would do by default).
        //
        var obs = isNaN(this._rad) ? this._obsDistinct : this._obsDistinct.startWith(this._rad);
        return obs;
      },

      subscribeRad: function (f) {   // ((rad:Num) ->) -> subscription
        return this._obsWithInitialValueRad().subscribe(f);
      },

      subscribeDeg: function (f) {   // ((deg:Num) ->) -> subscription
        return this._obsWithInitialValueRad()
                    .map( function (rad) { return rad * RAD_TO_DEG; } )
                    .subscribe(f);
      }
    }

  });

})();
