/*
* svg.rx.js
*/

/*
* Note: The event handling code is based on 'svg.draggable.js' -> https://github.com/wout/svg.draggable.js
*       but we only enable stuff that we actually test (manually). I.e. 'SVG.Nested', 'SVG.Use', 'SVG.Text' support
*       remains disabled until we need it, and there are demos that exercise those things.
*/

(function () {
  "use strict";

  // Helper function to give us an outer stream of drags. Either coming from desktop, or touch.
  //
  // '...Obs'  parameters are 'observable of x', where the 'x' is either a 'MouseEvent' or a 'Touch' (which contains touches
  // of only one touch id; TouchEvent has all changes).
  //
  // 'debugName': used for console output
  //
  // 'preventDefault': true for when default browser events are not wished for.
  //
  // References:
  //    MouseEvent -> https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent
  //    Touch -> https://developer.mozilla.org/en-US/docs/Web/API/Touch
  //
  var outerObs = function (el, startObs, moveObs, endObs, debugName, preventDefault) {    // (SVG.Element, observable of MouseEvent or Touch, ...) -> observable of observable of {x:Int, y:Int}

    debugName = debugName | "unknown";

    // Note: keep helper functions within the '.select()' function, since things like the positioning of the element,
    //      its transformation etc. may change during the lifespan of the observable.

    return startObs.
      select( function (oStart) {
        console.log( debugName +": Outer observable started" );

        // Transform from screen to user coordinates. Take care of pointer and touch events having different
        // inner structures.
        //
        var transformP = (function () {    // scope

          // Note: local values are hidden in this scope.
          //
          var parent = /*el.parent(SVG.Nested) ||*/ el.parent(SVG.Doc);

          // tbd. Can we do these within 'svg.js', without using the '.node' (i.e. dropping to plain SVG APIs)?

          var p = parent.node.createSVGPoint();     // point buffer (avoid reallocation per each coordinate change)
          var m = el.node.getScreenCTM().inverse();

          return function (o /*, offset*/) {   // (MouseEvent or Touch) -> point
            p.x = o.pageX;  // - (offset || 0)
            p.y = o.pageY;

            return p.matrixTransform(m);
          };
        })();

        /** DISABLED text element support not needed, yet
        var anchorOffset;

        // fix text-anchor in text-element (svg.draggable.js #37)
        if (el instanceof SVG.Text) {
          anchorOffset = el.node.getComputedTextLength();

          switch (el.attr('text-anchor')) {
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
          console.log( debugName +": "+ o );

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

      // Prevent browser drag behaviour for touch #0
      //
      // Note: Just preventing all "touchstart" events, if the application tracks id 0. This is simplest and works
      //      the way we want.
      //
      if (n===0) {
        startAllObs.subscribe( function (ev) {     // (TouchEvent)

          // prevent browser drag behavior (eg. pulling shadow and refresh gestures on Android)
          //
          ev.preventDefault();

          // prevent propagation to a parent that might also have dragging enabled (see demo1).
          //
          ev.stopPropagation();
        });
      }

      var startObs = startAllObs.select(f);
      var moveObs = moveAllObs.select(f);
      var cancelObs = cancelAllObs.select(f);
      var endObs = endAllObs.select(f);

      var cancelOrEndObs = Rx.Observable.merge( endObs, cancelObs );

      return outerObs( self, startObs, moveObs, cancelOrEndObs, "touch"+n );
    },

    //---
    // Pointer (button 1) tracking for the element
    //
    // Note: We currently only support button 1.
    //
    rx_mouse: function () {
      var self = this;

      var startObs =  Rx.Observable.fromEvent(self.node, "mousedown");
      var moveObs =   Rx.Observable.fromEvent(window, "mousemove");
      var endObs =    Rx.Observable.fromEvent(window, "mouseup");

      // Prevent browser drag behaviour and bubbling to parents.
      //
      startObs.subscribe( function (ev) {     // (MouseEvent)

        // prevent browser drag behavior (do we have any, for mouse based browsers and button 1?)
        //
        //ev.preventDefault();

        // prevent propagation to a parent that might also have dragging enabled (see demo1).
        //
        ev.stopPropagation();
      });

      return outerObs( self, startObs, moveObs, endObs, "mouse", true );
    },

    //---
    // Create an rxJS observable for either mouse or touch (index 0) drags
    //
    // Returns:
    //  observable of observables of { x: Int, y: Int }
    //
    // For each drag, a new inner observable is created. That streams unique {x,y} coordinates, and terminates when
    // the user ends the drag.
    //
    rx_draggable: function () {   // () -> observable of observables of { x: Int, y: Int }

      // Merge the two approaches. Only one inner drag active at any one time (desktop or touch)
      //
      // Note: the caller should dispose of this (and we need to check if we need to dispose some).
      //
      return Rx.Observable.merge(
        this.rx_mouse(),
        this.rx_touch(0)
      );
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
