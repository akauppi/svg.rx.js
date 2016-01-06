/*
* svg.rx.js
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

  // Note: RxJS does not seem to have what Scala calls '.collect': to both filter and convert.
  //
  // Ref. https://xgrommx.github.io/rx-book/content/guidelines/implementations/index.html#implement-new-operators-by-composing-existing-operators
  //
  // tbd. Is it true RxJS does not have a built-in operator for this? Ask at StackOverflow (pointing to this line). AKa271215
  //
  Rx.Observable.prototype.filterAndSelect = function (f) {
    return this.select(f).filter( function (x) { return x !== undefined; } );
  }

  // Inner stream of drags. Handles coordinate transforms etc.
  //
  // References:
  //    MouseEvent -> https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent
  //    Touch -> https://developer.mozilla.org/en-US/docs/Web/API/Touch
  //
  // Note: The event handling code is originally based on 'svg.draggable.js' -> https://github.com/wout/svg.draggable.js
  //      but we only enable stuff that we actually test (manually). I.e. 'SVG.Nested', 'SVG.Use', 'SVG.Text' support
  //      remains disabled until we need it, and there are demos that exercise those things.
  //
  var innerObs = function (el, oStart, moveObs, endObs) {    // (SVG.Element|SVG.G|SVG.Doc, MouseEvent or Touch, observable of MouseEvent or Touch, observable of MouseEvent or Touch) -> observable of {x:Int, y:Int}

    var isDoc = (el instanceof SVG.Doc);

    if (! ((el instanceof SVG.Element) || (el instanceof SVG.G) || isDoc)) {
      throw "svg.rx.js does not support: "+ (typeof el);
    }

    // Transform from screen to user coordinates
    //
    var transformP = (function () {    // scope

      // If 'el' is already the doc (or 'SVG.Nested', which we don't currently support), we can use that as the cradle
      // for our point.
      //
      var doc = isDoc ? el : /*el.parent(SVG.Nested) ||*/ el.parent(SVG.Doc);

      // tbd. Can we do these within 'svg.js', without using the '.node' (i.e. dropping to plain SVG APIs)?
      //
      var p = doc.node.createSVGPoint();     // point buffer (avoid reallocation per each coordinate change)
      var m = el.node.getScreenCTM().inverse();

      // 'o.pageX|Y' contain coordinates relative to the actual browser window (may be partly scrolled out),
      // for both 'MouseEvent' and 'Touch' objects.
      //
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

    // With 'S.Doc', 'el.x()' and 'el.y()' are always 0. Don't really understand why the below is the right thing
    // but it is. AKa271215
    //
    // Note: If the SVG element is slightly scrolled off window, the 0's don't work. AKa271215
    //
    var x_offset = isDoc ? 0 : p0.x - el.x(),
        y_offset = isDoc ? 0 : p0.y - el.y();

    // tbd. How to optimize so that only the last event would ever be shipped, if multiple have gathered, i.e.
    //      we only need the last coordinates. AKa071015
    //
    // Note: some events actually come with the same x,y values (at least on Safari OS X) - removed by the
    //      '.distinctUntilChanged()'.
    //
    return moveObs.select( function (o) {
      var p = transformP(o);

      return {
        x: p.x - x_offset,
        y: p.y - y_offset
      };
    } )
      .distinctUntilChanged()
      .takeUntil( endObs );
  };  // innerObs

  /*
  * Prevent default behaviour for 'mousedown' and 'touchstart', and bubbling up of the event to the parents.
  *
  * Note: We're not having this with 'innerObs' since here the TouchEvent, not Touch, is needed.
  */
  var preventDefault = function (evStart) {    // (MouseEvent or TouchEvent) ->
    // Prevent browser drag behavior
    //
    // On mouse:
    //    makes sure text doesn't get "painted" when moving the cursor outside of the SVG cradle, on top of HTML text.
    //
    // On touch:
    //    avoids scrolling the whole web page (Android, iOS)
    //    avoids refresh gestures (Android)
    //
    evStart.preventDefault();

    // Prevent propagation to a parent that might also have dragging enabled (see demo1).
    //
    evStart.stopPropagation();
  };


  SVG.extend( SVG.Element, {

    //---
    // Create an observable for touch events.
    //
    // Returns:
    //  observable of observables of { x: Int, y: Int }
    //
    // Note: Touch id's are not reported, by design. The idea is to treat any touches alike, not mapping them to
    //      "fingers". Also, depending on the platform touch id's may or may not be in the 0...N-1 range (Android
    //      reuses id's whereas iOS does not). The model chosen seems to be a good fit for allowing e.g. multiple
    //      users to work on a touch interface simultaneously, i.e. it feels more generic and expandable. AKa060116
    //
    rx_touch: function () {   // () -> observable of observables of { x: Int, y: Int }

      var self = this;    // to be used within further inner functions

      var startAllObs = Rx.Observable.fromEvent( self, "touchstart" );
      var moveAllObs = Rx.Observable.fromEvent( window, "touchmove" );
      var cancelAllObs = Rx.Observable.fromEvent( window, "touchcancel" );
      var endAllObs = Rx.Observable.fromEvent( window, "touchend" );

      // 'index': 0..n-1 (probably always 0); index to the starting touch
      //
      var touchDragObs = function (evStart, index) {      // (TouchEvent, Int) -> observable of {x:Int, y:Int}

        preventDefault(evStart);

        var touchStart = evStart.changedTouches[index];

        // Note: 'touch.identifier' is 0..N-1 number on Android (reusing id's once a touch has ended); on iOS it is a
        //        freely running counter. Just treat it as an opaque id between the start and the other (move/cancel/end)
        //        touch events.
        //
        var wanted = touchStart.identifier;

        /* Pick the 'wanted' move, cancel and end events to track
        */
        var f = function (ev) {   // (TouchEvent) -> Touch or undefined
          for (var i=0; i<ev.changedTouches.length; i++) {
            var touch = ev.changedTouches[i];

            if (touch.identifier === wanted) {
              return touch;
            }
          }
          return undefined;   // will not pass this event further for the particular stream
        }

        // Note: RxJS does not seem to have what Scala calls '.collect': to both filter and convert.
        //
        var moveObs = moveAllObs.filterAndSelect(f);
        var cancelObs = cancelAllObs.filterAndSelect(f);
        var endObs = endAllObs.filterAndSelect(f);

        var cancelOrEndObs = Rx.Observable.merge( endObs, cancelObs );

        return innerObs( self, touchStart, moveObs, cancelOrEndObs )

      }; // touchDragObs

      // Take easy way first - count on getting just one touch started.
      //
      if (true) {
        return startAllObs.select( function (ev) {  // (TouchEvent) -> observable of {x:Int, y:Int}

          assert( ev.changedTouches.length == 1, "Not prepared for 2 or more simultaneously starting touches" );

          return touchDragObs( ev, 0 );
        } );

      } else {
        // tbd. How to transfer 1..n-1 observables of {x,y}
        //
        // Note: It is possible (though unlikely) that the same TouchEvent would start multiple touch chains. We'll keep
        //        that possibility available in the code, though (it's the right thing to do). AK060116
        //
        var f = function (ev) {  // (TouchEvent) -> Array(observable of {x:Int, y:Int}, ...)

          // tbd. Could use '.map' for this instead of i looping. But 'ev.changedTouches' is not a true Array. AKa060116
          //
          var arr = [];

          for (var i=0; i<ev.changedTouches.length; i++) {
            arr.push( touchDragObs( ev, i ) );   // dragging observable for that particular touch
          }

          // tbd. How should we now (or in the loop above) push all the dragObs's to this observable?
          //
          return arr;
        };

        return startAllObs.flatMap(f);    // flatMap, selectMany, ... which should it be?
      }
    },  // rx_touch

    //---
    // Mouse tracking for the element
    //
    // Note: We currently only support button 1. Would be easy to support any mouse buttons, if needed, but we probably
    //      should see it from the application point of view. Also, shift etc. might be as important as the different
    //      buttons. AKa060116
    //
    rx_mouse: function () {   // () -> observable of observables of {x:Int, y:Int}
      var self = this;

      // Just consider primary button
      //
      var f = function (ev) {   // (MouseEvent) -> Boolean
        return ev.button === 0;
      }

      var startObs =  Rx.Observable.fromEvent(self.node, "mousedown").filter(f);
      var moveObs =   Rx.Observable.fromEvent(window, "mousemove").filter(f);
      var endObs =    Rx.Observable.fromEvent(window, "mouseup").filter(f);

      return startObs.select( function (ev) {   // (MouseEvent) -> observable of {x:Int, y:Int}
        preventDefault(ev);
        return innerObs( self, ev, moveObs, endObs );
      } );
    },

    //---
    // Create an observable for either mouse or touch drags
    //
    // Returns:
    //  observable of observables of { x: Int, y: Int }
    //
    rx_draggable: function () {   // () -> observable of observables of { x: Int, y: Int }

      return Rx.Observable.merge(
        this.rx_mouse(),
        this.rx_touch()
      );
    }
  });

})();
