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

  // adapted from 'svg.draggable.js' -> https://github.com/wout/svg.draggable.js
  //
  var Draggable = {
    // transforms one point from screen to user coords
    transformPoint: function (event, offset) {
      event = event || window.event
      var touches = event.changedTouches && event.changedTouches[0] || event
      this.p.x = touches.pageX - (offset || 0)
      this.p.y = touches.pageY
      return this.p.matrixTransform(this.m)
    },

    /**
    // gets elements bounding box with special handling of groups, nested and use
    getBBox: function(){
      var box = this.el.bbox()

      if(this.el instanceof SVG.Nested) box = this.el.rbox()

      if (this.el instanceof SVG.G || this.el instanceof SVG.Use || this.el instanceof SVG.Nested) {
        box.x = this.el.x()
        box.y = this.el.y()
      }

      return box
    }
    **/
  }

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
    rx_draggable: function () {   // () ->

      // tbd: add touch events (see from 'svg.draggable.js' sources)

      var self = this;    // to be used within further inner functions

      var obsMouseDown = Rx.Observable.fromEvent(this.node, 'mousedown');

      // #touch tbd. could probably merge these two observables to 'obsStart'
      //var obsTouchStart = Rx.Observable.fromEvent(this.node, 'touchstart');

      var outerObs = obsMouseDown.select( function(ev) {
        var ev_x = ev.x,
            ev_y = ev.y;

        var x_offset = ev_x - self.x(),
            y_offset = ev_y - self.y();

        var cx_offset = ev_x - self.cx(),
            cy_offset = ev_y - self.cy();

        // Tracking mouse or touch moves
        //
        // Note: We expect the events to be similar. If they are not, we'll simply do a
        //      select before the merge.
        //
        var obsMove = //Rx.Observable.merge(
          Rx.Observable.fromEvent(window, 'mousemove');
          //Rx.Observable.fromEvent(window, 'touchmove')
        //);

        var obsUpSingle = //Rx.Observable.merge(
          Rx.Observable.fromEvent(window, 'mouseup');
          //Rx.Observable.fromEvent(window, 'touchend')
        //).take(1);    // note: 'take(1)' is not really needed (we're simply waiting for one event)

        // tbd. How to optimize so that only the last event would ever be shipped, if multiple have gathered, i.e.
        //      we only need the last coordinates. AKa071015
        //
        // Note: some events actually come with the same x,y values (at least on Safari OS X). 
        //
        var obsInner = obsMove.select( function (o) {
          return {
            x: o.x-x_offset,
            y: o.y-y_offset
          };
        } )
          .distinctUntilChanged()
          .takeUntil( obsUpSingle );

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
