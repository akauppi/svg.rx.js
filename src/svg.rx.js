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

  // Especially with RxJS5 coming up, we want to ensure our expectations.
  //
  assert( typeof Rx.Observable.fromEvent === "function" );
  assert( typeof Rx.Observable.merge === "function" );

  // Note: RxJS does not seem to have what Scala calls '.collect': to both filter and convert.
  //
  // Ref. https://xgrommx.github.io/rx-book/content/guidelines/implementations/index.html#implement-new-operators-by-composing-existing-operators
  //
  // tbd. Is it true RxJS does not have a built-in operator for this? Ask at StackOverflow (pointing to this line). AKa271215
  //
  Rx.Observable.prototype.filterAndSelect = function (f) {
    return this.select(f).filter( function (x) { return x !== undefined; } );
  }

  // JavaScript does not have an Array for range constructor.
  //
  function range( start, count ) {    // (Int,Int) -> Array of Int
    var arr = [];
    for (var i=0; i<count; i++ ) {
      arr[i]= start+i;
    }
    return arr;
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
  function innerObs (el, oStart, moveObs, endObs) {    // (SVG.Element|SVG.G|SVG.Doc, MouseEvent or Touch, observable of MouseEvent or Touch, observable of MouseEvent or Touch) -> observable of {x:Int, y:Int}

    var isDoc = (el instanceof SVG.Doc);

    if (! ((el instanceof SVG.Element) || (el instanceof SVG.G) || isDoc)) {
      throw "svg.rx.js does not support: "+ (typeof el);
    }

    // If 'el' is already the doc (or 'SVG.Nested', which we don't currently support), we can use that as the cradle
    // for our point.
    //
    var doc = isDoc ? el : /*el.parent(SVG.Nested) ||*/ el.parent(SVG.Doc);

    // Note: svg.js doesn't have an abstraction for applying a matrix transform. This kind of makes sense - such a
    //      transform uses SVGPoint structure specifically allocated for this purpose and handling the life span of
    //      such an object may be crucial for keeping drag behaviour optimal. So we are fine diving down to native
    //      SVG API (using '.node' and '.native') here. It's an implementation detail, anyways (does not show in the
    //      svg.rx.js API). AKa100116
    //
    //      See -> https://github.com/wout/svg.js/issues/437
    //             https://github.com/wout/svg.js/issues/403
    //
    var buf = doc.node.createSVGPoint();          // point buffer (allocated just once per drag)
    var m = el.screenCTM().inverse().native();    // calculated just once per drag

    // Transform from screen to user coordinates
    //
    // Note: This gets called a lot, so should be swift, and not create new objects.
    //
    // Note: The returned value is kept in 'buf' and will be overwritten on next call. Not to be forwarded further
    //      by the caller.
    //
    var transformP = function (o /*, offset*/) {   // (MouseEvent or Touch) -> SVGPoint (which has '.x' and '.y')
      buf.x = o.clientX;  // - (offset || 0)
      buf.y = o.clientY;
      return buf.matrixTransform(m);
    };

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

    // Offset from the touch/point location to the origin of the target element. We're providing the drag coordinates
    // in the observable, not the actual mouse/touch coordinates (tbd. maybe we should provide both). AKa080116
    //
    var x_offset, y_offset;

    // tbd. We might be better off not doing any of this here, but in the application code. AKa170116

    if (isDoc) {
      x_offset = y_offset = 0;

    } else if ((el instanceof SVG.Circle) || (el instanceof SVG.Ellipse)) {   // 'SVG.Circle', 'SVG.Ellipse' or 'SVG.Rx.Circle'
      //
      // Do not access '.x' or '.y' on a circle - they are not needed, and 'SVG.Rx.Circle' does not implement them.

      var center = el.center();   // {x:Num,y:Num}

      x_offset = p0.x - center.x;   // we are providing center's coordinates to the circle / ellipse being dragged
      y_offset = p0.y - center.y;

    } else if (typeof el.x === "function") {    // normal 'svg.js' elements (all have '.x' and '.y', even the circle
      x_offset = p0.x - el.x();
      y_offset = p0.y - el.y();

    } else {
      throw "Unknown element: "+ typeof el;
    }

    // Note: some events actually come with the same x,y values (at least on Safari OS X) - removed by the
    //      '.distinctUntilChanged()'.
    //
    // Note: There does not seem to be a good way to introduce throttling (removing extraneous events from the stream).
    //      The browser emits a reasonable (roughly 60 times a second, some web sites say) event stream. The application
    //      code tries to keep up with this, but may take longer than the 16ms to process the draws (especially on
    //      multiple fingers on the Nexus 7 tablet). This causes a drag-behind effect where the circles (demo4) are
    //      following the fingers with a delay.
    //
    //      Neither '.debounce' or '.throttle( 1, Rx.Scheduler.requestAnimationFrame )' helps with this - they would
    //      simply drop the frame rate of all movements; we don't want that.
    //
    //      What we want is proper back pressure, where the application can signal itself, when it's ready for receiving
    //      the next drag event. Let's implement this on the application side (demo4) for now, since most cases would
    //      not need it. AKa140116
    //
    return moveObs.select( function (o) {
      var p = transformP(o);

      return {
        x: p.x - x_offset,
        y: p.y - y_offset
      };
    } )
      .startWith( { x: p0.x - x_offset, y: p0.y - y_offset } )
      .distinctUntilChanged()
      .takeUntil( endObs );
  }  // innerObs

  /*
  * Prevent default behaviour for 'mousedown' and 'touchstart', and bubbling up of the event to the parents.
  *
  * Note: We're not having this with 'innerObs' since here the TouchEvent, not Touch, is needed.
  */
  function preventDefault (evStart) {    // (MouseEvent or TouchEvent) ->
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
  }


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

      // Each "touchstart" event can start multiple drags. This actually happens on iOS (9.2) but not on Android (6.0.1).
      //
      // Note: the '.selectMany' means that we can spawn multiple (0..n) values from within this one event, unlike the
      //      single one that '.select' would.
      //
      return startAllObs.selectMany( function (ev) {  // (TouchEvent) -> Array of observable of {x:Int, y:Int}

        return range( 0, ev.changedTouches.length ).map( function (i) {
          return touchDragObs( ev, i );
        } );
      });
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
