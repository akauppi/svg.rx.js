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
*/
// assert( SVG.Element.prototype );

(function() {
  var proto = SVG.Element.prototype;

  var fact = function (was_f, ctx) {
    return function (v) {             // (num | SVG.Observable) => or () => num
      if (v instanceof SVG.Observable) {    // setting to an Observable
        v.subscribe( function (vv) {
          console.log(vv);
          was_f.call(ctx, vv);
        } );
      } else {
        console.log(v);
        was_f.call(ctx, v);
      }
    };
  };

  // tbd. DAMN making JavaScript inheritence right is difficult (take ES6 to help!). AKa190915
  //
  var was_x = proto.x;
  var was_y = proto.y;
  var was_cx = proto.cx;
  var was_cy = proto.cy;
  var was_width = proto.width;
  var was_height = proto.height;

  proto.x = function(v) { return fact(was_x, this)(v); };
  proto.y = function(v) { return fact(was_y, this)(v); };
  proto.cx = function(v) { return fact(was_cx, this)(v); };
  proto.cy = function(v) { return fact(was_cy, this)(v); };
  proto.width = function(v) { return fact(was_width, this)(v); };
  proto.height = function(v) { return fact(was_height, this)(v); };

  /***
  SVG.extend( SVG.Element, {
    x: fact(proto.x),
    y: fact(proto.y),
    cx: fact(proto.cx),
    cy: fact(proto.cy),
    width: fact(proto.width),
    height: fact(proto.height)
  });
  ***/
  
  // note: we may have missed some methods that would need wrapping
  
})();

