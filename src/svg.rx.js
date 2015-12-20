/*
* svg.rx.js
*/

// Note: The event handling code is based on 'svg.draggable.js' -> https://github.com/wout/svg.draggable.js
//      but we only enable stuff that we actually test (manually). I.e. 'SVG.Nested', 'SVG.Use', 'SVG.Text' support
//      remains disabled until we need it, and there are demos that exercise those things.

(function () {
  "use strict";

  // Helper function to give us an outer stream of drags. Either coming from desktop, or touch.
  //
  // All parameters are 'observable of events', where the event may either be coming from mouse of (particular touch id's)
  // touch events.
  //
  // mouse:
  //    ... show event structure here ...
  //
  // touch:
  //    ... touch event structure here ...
  //
  var outerObs = function (el, startObs, moveObs, endObs) {    // (SVG.Element, observable of mouseEvent or Touch, ...) -> observable of {x:Int, y:Int}

    // Note: keep helper functions within the '.select()' function, since things like the positioning of the element,
    //      its transformation etc. may change during the lifespan of the observable.

    return startObs.
      select( function (oStart) {
        //console.log( "Outer observable started" );

        // Transform from screen to user coordinates. Take care of pointer and touch events having different
        // inner structures.
        //
        var transformP = (function () {    // scope

          // Note: local values are hidden in this scope.
          //
          var parent = /*self.parent(SVG.Nested) ||*/ self.parent(SVG.Doc);

          // tbd. Can we do these within 'svg.js', without using the '.node' (i.e. dropping to plain SVG APIs)?

          var p = parent.node.createSVGPoint();     // point buffer (avoid reallocation per each coordinate change)
          var m = self.node.getScreenCTM().inverse();

          return function (o /*, offset*/) {   // (mouseEvent or Touch) -> point
            p.x = o.pageX;  // - (offset || 0)
            p.y = o.pageY;

            return p.matrixTransform(m);
          };
        })();

        /** DISABLED text element support not needed, yet
        var anchorOffset;

        // fix text-anchor in text-element (svg.draggable.js #37)
        if (self instanceof SVG.Text) {
          anchorOffset = self.node.getComputedTextLength();

          switch (self.attr('text-anchor')) {
            case 'middle':
              anchorOffset /= 2;
              break;
            case 'start':
              anchorOffset = 0;
              break;
          }
        }
        **/

        var p0 = transformP(oStart /*, anchorOffset*/);

        var x_offset = p0.x - el.x(),
            y_offset = p0.y - el.y();

        var endSingleObs = endObs.take(1);    // tbd. is there any benefit of doing this '.take(1)'? We're using '.takeUntil()' below.

        // tbd. How to optimize so that only the last event would ever be shipped, if multiple have gathered, i.e.
        //      we only need the last coordinates. AKa071015
        //
        // Note: some events actually come with the same x,y values (at least on Safari OS X) - removed by the
        //      '.distinctUntilChanged()'.
        //
        var innerObs = moveObs.select( function (o) {
          //console.log( evMove );

          var p = transformP(o);

          return {
            x: p.x - x_offset,
            y: p.y - y_offset
          };
        } )
          .distinctUntilChanged()
          .takeUntil( endSingleObs );

        return innerObs;
      } );
    };  // function outerObs


  /*** DISABLED
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
    rx_draggable: function () {   // () -> observable of observables of { x: Int, y: Int }

      var self = this;    // to be used within further inner functions

      // Merge the two approaches. Only one inner drag active at any one time (desktop or touch)
      //
      // Note: the caller should dispose of this (and we need to check if we need to dispose some).
      //
      return Rx.Observable.merge(
        outerObs( {start: 'mousedown', move: 'mousemove', end: 'mouseup' }),    // mouse
        outerObs( {start: 'touchstart', move: 'touchmove', end: 'touchend' })   // touch
      );
    }

  });
  ***/


  SVG.extend( SVG.Element, {

    //---
    // Create an RxJS observable for touch events of a certain touchId.
    //
    // Returns:
    //  observable of observables of { x: Int, y: Int }
    //
    // 'n' is the touch index (0-based) to follow. Maximum number of touches that can be tracked depends on hardware.
    //
    rx_touch: function (n) {   // (n: Int) -> observable of observables of { x: Int, y: Int }

      var self = this;    // to be used within further inner functions

      // tbd. Could make those filter the data so that it's uniform with pointer events
      //

      // Return an observable for certain touch events for the element. Also remember the observable for later calls
      // (only one is ever created, for a certain element and 'evName').
      //
      var cache = function (evName) {   // (String) -> observable of touchEvent
        var key = "svgrxjs."+evName;

        var obs = self.remember(obs);
        if (!obs) {
          obs = Rx.Observable.fromEvent(self, evName);
          self.remember(key,obs);
        }
        return obs;
      };

      var startAllObs = cache( "touchstart" );
      var moveAllObs = cache( "touchmove" );
      var cancelAllObs = cache( "touchcancel" );
      var endAllObs = cache( "touchend" );

      // Derive the observable for just the given touch
      //
      var f = function (ev) {

        // tbd. Wasn't able to use normal array methods with 'ev.changedTouches'. We'd want '.find()'. AKa161215
        //
        for (var i=0; i<ev.changedTouches.length; i++) {
          var touch = ev.changedTouches[i];
          if (touch.identifier == n) {
            return touch;
          }
        }
      };

      var startObs = startAllObs.select(f);
      var moveObs = moveAllObs.select(f);
      var cancelObs = cancelAllObs.select(f);
      var endObs = endAllObs.select(f);

      var cancelOrEndObs = Rx.Observable.merge( endObs, cancelObs );

      return outerObs( self, startObs, moveObs, cancelOrEndObs );
    },

    //---
    // Pointer tracking for the element
    //
    rx_desktop: function () {
      var self = this;

      var startObs =  Rx.Observable.fromEvent(self.node, "mousestart");
      var moveObs =   Rx.Observable.fromEvent(window, "mousemove");
      var endObs =    Rx.Observable.fromEvent(window, "mouseup");

      // Prevent browser drag behaviour. Note: wonder if we should do the same also for touch #1 evens. tbd AKa171215
      //
      startObs.select( function (ev) {
        // prevent browser drag behavior
        //
        ev.preventDefault();

        // prevent propagation to a parent that might also have dragging enabled (tbd. this probably also takes
        // care of '.preventDefault()').
        //
        ev.stopPropagation();
      });

      // tbd. check if we should just have this, or merge with 'rx_touch(0)' stream ('Rx.Observable.merge').
      //
      return outerObs( self, startObs, moveObs, endObs );
    }
  });

})();


  /*** DISABLED - no 'root' in Safari. AKa251015
  * Decide which events we observe.
  *
  * For any platform, it should be enough to just observe one kind of events, right? This part may need revising, e.g.
  *
  * - role of 'root.PointerEvent' - what is it, how is it connected with the normal mouse events?
  *
  var keys = null;

  if (root.TouchEvent) {
    keys = {
      start: 'touchstart',
      move: 'touchmove',
      end: 'touchend'
    };
  } else if (root.PointerEvent) {   // TBD: not tested!!! (which browsers would have this, IE only?) AKa251015
    keys = {
      start: 'pointerstart',
      move: 'pointermove',
      end: 'pointerhend'
    };
  } else {        // traditional mouse fallback
    keys = {
      start: 'mousedown',
      move: 'mousemove',
      end: 'mouseup'
    };
  }

  return outerObs(keys);
  ***/
