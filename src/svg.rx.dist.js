/*
* svg.rx.dist.js
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

  SVG.Rx = SVG.Rx || {};


  //--- SVG.Rx.Dist ---
  //
  //  .value: Num                   // note: We might be able to do without this, just taking the latest from '._obsDistinct'
  //
  //  ._sub: subject of Num
  //  ._obsDistinct: observable of Num  // only changed values are emitted
  //
  SVG.Rx.Dist = SVG.invent({
    // Initialize node
    create: function (a) {    // () or (d:Num) or (SVG.Rx.Dist)
      var ta = typeof a;
      var init;

      if (arguments.length === 0) {
        init = Number.NaN;    // no emission

      } else if ((arguments.length === 1) && (ta === "number")) {
        init = a;

      } else if ((arguments.length === 1) && (a instanceof SVG.Rx.Dist)) {
        init = a.value;

      } else {
        throw "Unexpected params to 'SVG.Rx.Dist': " + arguments;
      }
      this.value = init;

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

        // Emit the current values, if there are any (what 'BehaviorSubject' would do by default).
        //
        var obs = isNaN(this.value) ? this._obsDistinct : this._obsDistinct.startWith(this.value);

        return obs.subscribe(f);
      }
    }

  });

})();
