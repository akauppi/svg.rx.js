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

})();
