/*
* svg.glue.js
*/

//assert( Rx.Subject );

/*
* SVG.Observable
*
* Usage:
*   val o = new SVG.Observable(value);
*   ...
*   o.subscribe( function(v) { ... } );
*   ...
*   o.emit(value);
*   ...
*   o.dispose();
*/
SVG.Observable = SVG.invent({

  // Initialize
  //
  create: function(val) {
    this._value = val;
    this._subject = new Rx.Subject();
    
    this._subject.onNext(val);
  }

  // Add methods
, extend: {
    subscribe: function (handlerF) {    // ( (Any) => ) =>
      this._subject.subscribe(handlerF);
    },

    emit: function (val) {    // ( (Any) => Unit )
      this._subject.onNext(val);
    },

    dispose: function () {
      this._subject.dispose();
    }
  }
});

/*
* Make SVG.Element able to handle observables.
*
* tbd. Does SVG have ways to mix in new methods? AKa190915
*/
// assert( SVG.Element.prototype );

(function() {
  var proto = SVG.Element.prototype;

  var fact = function (was_f) {
    return function (v) {             // (num | SVG.Observable) => or () => num
      if (typeof v === "object") {    // setting to an Observable
        v.subscribe( function (vv) {
          was_f.call(this, vv);
        } );
      } else {
        was_f.call(this, v);
      }
    };
  };
    
  proto.x = fact(proto.x);
  proto.y = fact(proto.y);
  proto.cx = fact(proto.cx);
  proto.cy = fact(proto.cy);
  proto.width = fact(proto.width);
  proto.height = fact(proto.height);

  // note: we may have missed some methods that would need wrapping
  
})();




