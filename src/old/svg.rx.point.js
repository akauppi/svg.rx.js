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

  SVG.Rx = SVG.Rx || {};


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

})();
