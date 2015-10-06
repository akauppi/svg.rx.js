/*
* svg.rx.js
*/

// assert( SVG.Element.prototype );

/*
* Add '.track' to an 'SVG.Element'.
*
* Update observables when x/y/width/height are being changed (either explicitly
* or via dragging).
*/
(function() {
  var proto = SVG.Element.prototype;

  // 'was_f': the original method function
  // 'n': index in the 'this._observables' array to emit to
  // 'ctx': the 'this' context
  //
  // Returns: the wrapped method function
  //
  var fact = function (was_f, n, ctx) {
    return function (v) {                 // (Number) => ctx or () => Number

      if (v !== undefined) {
        // Making the change before informing observers (we don't want to trust
        // in the implementation details of '.onNext'). Then again, the order
        // probably doesn't even matter. AKa280915
        //
        was_f.call(ctx,v);

        var obs = ctx._observables ? ctx._observables[n] : null;
        if (obs) {
          obs.onNext(v);
        }

        return ctx;
        
      } else {
        return was_f.call(ctx);
      }

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
  //var was_width = proto.width;
  //var was_height = proto.height;

  proto.x = function(v) { return fact(was_x, 0, this)(v); };
  proto.y = function(v) { return fact(was_y, 1, this)(v); };
  //proto.width = function(v) { return fact(was_width, 2, this)(v); };
  //proto.height = function(v) { return fact(was_height, 3, this)(v); };

  SVG.extend( SVG.Element, {

    // Create an rxJS observable for any dragging events
    //
    // Returns:
    //  observable of observables of { x: Int, y: Int }
    //
    // For each drag, a new inner observable is created. That streams unique {x,y} coordinates, and terminates when
    // the user ends the drag.
    //
    // tbd. disposal hasn't been planned
    //
    // Note: Unlike 'svg.draggable.js', we don't actually move the object anywhere. That is up to the subscriber
    //      (they might want to do something else with the drag than simply pan the x,y).
    //
    rx_draggable: function () {

      // tbd: add touch events (see from 'svg.draggable.js' sources)

      var obsMouseDown = Rx.Observable.fromEvent(this.node, 'mousedown');

      var outerObs = obsMouseDown.select( function(ev) {
        var x= ev.x;
        var y= ev.y;

        console.log( "Mouse down at " + x+","+y );

        // Tracking mouse moves
        //
        var obsMouseMove = Rx.Observable.fromEvent(this.node, 'mousemove');

        // Note: 'take(1)' is not really needed, but may cause a better cleanup.
        //
        var obsMouseUpSingle = Rx.Observable.fromEvent(this.node, 'mouseup').take(1);

        var obsInner = obsMouseMove.pluck('x','y').takeUntil( obsMouseUpOnce );

        return obsInner;
      } )

      return outerObs;    // note: the caller should dispose of this (and we should dispose of inner observables if one is active)
    },

    // Note: In practice the observables are likely 'Rx.BehaviorSubject's.
    //
    track: function (obsX, obsY /*, obsW, obsH*/) {    // ([Rx.BehaviorSubject], [Rx.BehaviorSubject], [Rx.BehaviorSubject], [Rx.BehaviorSubject]) => this

      // Note: This overrides earlier trackings. Should we do a '.dispose()' or is it okay just to leave them waiting for
      //      garbage collection? tbd. AKa200915
      //
      this._observables = [obsX, obsY /*, obsW, obsH*/];
      
      return this;
    },

    // Make the element's attribute ("x","y","width" or "height") follow an 'SVG.Observable'.
    // 
    follow: function (attr, obs) {    // (String, SVG.Observable) => this
      var el= this;
      
      obs.subscribe( function (v) {
        el.attr(attr, v);
      } );
      
      return this;
    }
  });
  
})();
