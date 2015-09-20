/*
* svg.glue.js
*/

//assert( Rx.Subject );

/*
* SVG.Observable
*
* Usage:
*   val o = new SVG.Observable();
*   ...
*   o.subscribe( function(v: Number) { ... } );
*   ...
*   o.emit(v: Number);
*   ...
*   o.dispose();
*/
SVG.Observable = SVG.invent({

  // Initialize
  //
  create: function() {
    this._subject = new Rx.Subject();
  }

  // Add methods
, extend: {
    subscribe: function (handlerF) {    // ( (Number) => ) =>
      this._subject.subscribe(handlerF);
    },

    emit: function (val) {              // (Number) => Unit
      this._subject.onNext(val);
    },

    dispose: function () {
      this._subject.dispose();
    }
  }
});

/*
* Add '.track' to an 'SVG.Element'.
*
* Update observables when x/y/width/height are being changed (either explicitly
* or via dragging).
*/
// assert( SVG.Element.prototype );

(function() {
  var proto = SVG.Element.prototype;

  // 'was_f': the original method function
  // 'n': index in the 'this._observables' array to emit to
  // 'ctx': the 'this' context
  //
  // Returns: the wrapped method function
  //
  var fact = function (was_f, n, ctx) {
    return function (v) {                 // (Number) => or () => Number

      // Note: the change will get done before the observable's subscribers
      //    hear about it (even though here we emit before the change).
      //
      if (v !== undefined) {
        var obs = ctx._observables ? ctx._observables[n] : null;
        if (obs) {
          obs.emit(v);
        }
      }

      return was_f.call(ctx,v);
    };
  };

  // tbd. DAMN making JavaScript inheritence right is difficult (take ES6 to help!). 
  //      (The problem here is getting the right 'this' context for the factory-made method.) AKa190915
  //
  // Note: 'move', 'cx', 'cy', 'center' get processed indirectly, because they forward to
  //      'x','y','width','height' calls.
  //
  var was_x = proto.x;
  var was_y = proto.y;
  var was_width = proto.width;
  var was_height = proto.height;

  proto.x = function(v) { return fact(was_x, 0, this)(v); };
  proto.y = function(v) { return fact(was_y, 1, this)(v); };
  proto.width = function(v) { return fact(was_width, 2, this)(v); };
  proto.height = function(v) { return fact(was_height, 3, this)(v); };

  SVG.extend( SVG.Element, {
    track: function (obsX, obsY, obsW, obsH) {    // ([SVG.Observable], [SVG.Observable], [SVG.Observable], [SVG.Observable]) => this

      // Note: This overrides earlier trackings. Should we do a '.dispose()' or is it okay just to leave them waiting for
      //      garbage collection? tbd. AKa200915
      //
      this._observables = [obsX, obsY, obsW, obsH];
      
      return this;
    }
  });
  
})();


/*** REMOVE
    y: fact(proto.y),
    cx: fact(proto.cx),
    cy: fact(proto.cy),
    width: fact(proto.width),
    height: fact(proto.height)
***/
