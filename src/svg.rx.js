/*
* svg.rx.js
*
* tbd. Change this module to ES6 like exports
*     - expect the parent to provide 'assert' function
*
* References:
*   HTML5 API Index > SVG Overview
*     -> http://html5index.org/SVG%20-%20Overview.html
*       SVGDocument -> http://html5index.org/SVG%20-%20SVGDocument.html
*       SVGSVGElement -> http://html5index.org/SVG%20-%20SVGSVGElement.html
*
*/

import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/fromEvent";
import "rxjs/add/observable/merge";

const Rx = { Observable };

if (typeof assert === "undefined") {
  log.assert("Oops - no 'assert'");
  throw "Expecting runtime 'assert', please enable 'rollup-plugin-node-builtins'."
}

// Classes we'll expand
//
//assert(SVGSVGElement);

// Note: taking 'SVG' as a global for now. We're likely to abandon it, anyways (if not, there's a 3.0 out there).

(function () {
  "use strict";

  assert(true);

  // Check the things we will use of 'Rx'
  //
  assert( typeof Rx.Observable.fromEvent === "function" );
  assert( typeof Rx.Observable.merge === "function" );

  // Note: RxJS5 does not have what Scala calls '.collect': to both filter and convert.
  //
  // Ref.
  //  -> http://stackoverflow.com/questions/35118707/rxjs5-how-to-map-and-filter-on-one-go-like-collect-in-scala
  //  -> https://xgrommx.github.io/rx-book/content/guidelines/implementations/index.html#implement-new-operators-by-composing-existing-operators
  //
  Rx.Observable.prototype.mapAndFilterUndefinedOut = function (f) {
    return this.map(f).filter( function (x) { return x !== undefined; } );
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
  // Note: The event handling code is originally based on https://github.com/wout/svg.draggable.js but we only enable
  //      stuff that we actually test (manually). I.e. 'SVG.Nested', 'SVG.Text' support remains disabled.
  //
  // References:
  //    MouseEvent -> https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent
  //    Touch -> https://developer.mozilla.org/en-US/docs/Web/API/Touch
  //
  // 'el' is the element that is being tracked
  //
  // 'elCoords' is the element, whose coordinate system is used (can be 'el', or e.g. its parent)
  //
  // 'precise': If 'true', streams the exact position of the pointer/touch location. Otherwise hides that away and
  //    treats any touch within the object the same (streams the position of the object, instead). Use 'true' if you
  //    want to e.g. rotate by dragging a disk, in place. For normal drag, or rotational drag with a separate handle
  //    object, use 'false'.
  //
  function innerObs (el, oStart, moveObs, endObs, elCoords, precise) {    // (SVG.Element|SVG.G|SVG.Doc, MouseEvent or Touch, observable of MouseEvent or Touch, observable of MouseEvent or Touch, [SVG.Element], [true]) -> observable of {x:Int, y:Int}

    var isDoc = (el instanceof SVG.Doc);
    var isG = (el instanceof SVG.G);

    if (! ((el instanceof SVG.Element) || isG || isDoc)) {
      throw "svg.rx.js does not support: "+ (typeof el);
    }

    if (el instanceof SVG.Text) {
      console.warn( "Dragging might not work with "+ el );
    }

    // Select which element is used for reporting the coordinates.
    //
    // Note: For groups, do NOT include the group's transformation matrix, or things won't work when a group is rotated.
    //
    // For full power, the caller can provide the 'elCoords' (and actually, should).
    //
    if (!elCoords) {
      if (el instanceof SVG.G) {
        elCoords = el.parent();
      } else {
        elCoords = el;
      }
    }

    // If 'el' is already the doc (or 'SVG.Nested', which we don't support), we can use that as the cradle for our point.
    //
    var doc = isDoc ? el : /*el.parent(SVG.Nested) ||*/ el.parent(SVG.Doc);

    /*
    * About SVGPoint:
    *   - it's "not attached to any document" (not part of the DOM): https://msdn.microsoft.com/en-us/windows/ff972165(v=vs.71)
    *       If we trust that (tbd. check if we see it in the DOM), cleanup is a matter of just releasing the reference.
    *   - there's a 'DOMPoint' in recent browsers (2019; except Edge). This seems to be the same as 'SVGPoint', or an
    *       extension? WebStorm Option-B shows 'type SVGPoint = DOMPoint;'
    */

    // Note: svg.js doesn't have an abstraction for applying a matrix transform. This kind of makes sense - such a
    //      transform uses SVGPoint structure specifically allocated for this purpose and handling the life span of
    //      such an object may be crucial for keeping drag behaviour optimal. So we are fine diving down to native
    //      SVG API (using '.node' and '.native') here. It's an implementation detail, anyways (does not show in the
    //      svg.rx.js API). AKa100116
    //
    //      See -> https://github.com/wout/svg.js/issues/437
    //             https://github.com/wout/svg.js/issues/403
    //
    // Note: If thinking of not cleaning the point buffer, but keeping it always there, consider that multiple objects
    //      can be moved simultaneously (and their points may be cradled in the 'SVG.Doc'). The dynamic alloc/dealloc
    //      is probably the simplest way to go. AKa130316
    //
    var buf = doc.node.createSVGPoint();    // point object (allocated just once per drag)

    // tbd. Maybe we can create the point under the element itself (not just the doc)?

    // Clean the allocated buffer
    //
    endObs.take(1).subscribe( function () {
      buf = null;     // GC cleans it up
    });

    // If a group is observing the drag, we want its transform NOT to be included. Otherwise, we get problems if the group
    // is rotated.
    //
    // Note: In the future, we might also do some group translation handling here (instead of in the calling code, see 'demo3'),
    //      so it may make sense to have the initialization within if-else (instead of tertiary operator). AKa290316
    //
    var m = elCoords.screenCTM().inverse().native();

    // Q: is the '.native()' needed? This doesn't have it -> https://schneide.blog/2018/03/05/some-tricks-for-working-with-svg-in-javascript/

    // Transform from screen to user coordinates
    //
    // Note: This gets called a lot, so should be swift, and not create new objects.
    //
    // Note: The returned value is kept in 'buf' and will be overwritten on next call. Not to be forwarded further
    //      by the caller.
    //
    // Note: Use '.client[XY]' (not '.screen[XY]') so that the position of the SVG cradle does not affect (the difference
    //      becomes visible only when dragging is applied on 'svg' background).
    //
    var transformP = function (o /*, offset*/) {   // (MouseEvent or Touch) -> SVGPoint (which has '.x' and '.y')
      buf.x = o.clientX;  // - (offset || 0)
      buf.y = o.clientY;

      return buf.matrixTransform(m);
    };

    var p0 = transformP(oStart /*, anchorOffset*/);

    // Offset from the touch/point location to the origin of the target element, at the beginning of the drag.
    // We provide the drag coordinates in the observable, not the actual mouse/touch coordinates (tbd. we should provide both). AKa080116
    //    ^^- tbd. Provide both in the observable, and no need for 'precise' param. :)
    //
    var x_offset, y_offset;

    if (precise || isDoc) {
      x_offset = y_offset = 0;

    } else if ((el instanceof SVG.Circle) || (el instanceof SVG.Ellipse)) {   // 'SVG.Circle', 'SVG.Ellipse' or 'SVG.Rx.Circle' #edit
      //
      // Do not access '.x' or '.y' on a circle - they are not needed, and 'SVG.Rx.Circle' does not implement them.

      // Note: Do not use 'el.center()' for reading coordinates; only '.cx()' and '.cy()' work as getters.

      // Note: Once we get 'svg.js' replaced, positioning centers and ellipses will always happen just by their center
      //      (then we can remove this special handling).

      x_offset = p0.x - el.cx();   // we are providing center's coordinates to the circle / ellipse being dragged
      y_offset = p0.y - el.cy();

    } else if (typeof el.x === "function") {    // normal 'svg.js' elements (all have '.x' and '.y', even the circle)
      x_offset = p0.x - el.x();
      y_offset = p0.y - el.y();
    }

    // The returned object.
    //
    //  .x, .y:   The top left coords (...tbd. for circle and ellipse, is this the center?)
    //  .x2, .y2: The actual position of the drag (in which coord system?) tbd.
    //
    const pointWithOffset = function (p) {    // (SVGPoint) => { x: int, y: int [,x2: num][, y2: num] }
      return {
        x: p.x - x_offset,
        y: p.y - y_offset,
        x2: isDoc ? undefined : p.x,
        y2: isDoc ? undefined : p.y
      };
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
    return moveObs.map( function (o) {
      return pointWithOffset( transformP(o) );
    } )
      .startWith( pointWithOffset(p0) )
      .distinctUntilChanged()
      .takeUntil( endObs );
  }  // innerObs

  /*
  * Prevent default behaviour for 'mousedown' and 'touchstart', and bubbling up of the event to the parents.
  *
  * Note: this is not within 'innerObs' since here the TouchEvent, not Touch, is needed.
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


  const methods =  {
    //---
    // Create an observable for touch events.
    //
    // Returns:
    //  observable of observables of { x: Int, y: Int }
    //
    // Note: Touch id's are not reported, by design. The idea is to treat any touches alike, not mapping them to
    //      "fingers". Also, depending on the platform touch id's may or may not be in the 0...N-1 range (Android
    //      reuses id's whereas iOS does not. The model chosen seems to be a good fit for allowing e.g. multiple
    //      users to work on a touch interface simultaneously, i.e. it feels more generic and expandable. AKa060116
    //
    rx_touch: function (elCoords, precise) {   // ([SVG.Element], [Boolean]) -> observable of observables of { x: Int, y: Int }

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

        // Note: RxJS does not have what Scala calls '.collect': to both map and filter.
        //
        var moveObs = moveAllObs.mapAndFilterUndefinedOut(f);
        var cancelObs = cancelAllObs.mapAndFilterUndefinedOut(f);
        var endObs = endAllObs.mapAndFilterUndefinedOut(f);

        var cancelOrEndObs = Rx.Observable.merge( endObs, cancelObs );

        return innerObs( self, touchStart, moveObs, cancelOrEndObs, elCoords, precise )

      }; // touchDragObs

      // Each "touchstart" event can start multiple drags. This actually happens on iOS (9.2) but not on Android (6.0.1).
      //
      // Note: the '.selectMany' means that we can spawn multiple (0..n) values from within this one event, unlike the
      //      single one that '.select' would.
      //
      return startAllObs.mergeMap( function (ev) {  // (TouchEvent) -> Array of observable of {x:Int, y:Int}

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
    rx_mouse: function (elCoords, precise) {   // ([SVG.Element], [Boolean]) -> observable of observables of {x:Int, y:Int}
      var self = this;

      // Just consider primary button
      //
      var f = function (ev) {   // (MouseEvent) -> Boolean
        return ev.button === 0;
      }

      var startObs =  Rx.Observable.fromEvent(self.node, "mousedown").filter(f);
      var moveObs =   Rx.Observable.fromEvent(window, "mousemove").filter(f);
      var endObs =    Rx.Observable.fromEvent(window, "mouseup").filter(f);

      return startObs.map( function (ev) {   // (MouseEvent) -> observable of {x:Int, y:Int}
        preventDefault(ev);
        return innerObs( self, ev, moveObs, endObs, elCoords, precise );
      } );
    },

    //---
    // Create an observable for either mouse or touch drags
    //
    // Note: Since we are handling drags here, 'precise' mode is off. It does not matter, where in the dragged object
    //      one points/touches.
    //
    // Returns:
    //  observable of observables of { x: Int, y: Int }
    //
    rx_draggable: function (elCoords, precise) {   // ([SVG.Element], [Boolean]) -> observable of observables of { x: Int, y: Int }

      return Rx.Observable.merge(
        this.rx_mouse(elCoords, precise),
        this.rx_touch(elCoords, precise)
      );
    } //,

    /*** disabled (the rotational thing is a bit more complex; may need e.g. menu items to be rotated in compensation. AKa170716
    //---
    // Create an observable for either mouse or touch rotational drags.
    //
    // If the 'elCoords' param is given, and is not the same as 'this', 'this' is taken to be a separate handle object
    // and the precise position where it's dragged does not matter.
    //
    // If 'elCoords' is not given, or is same as 'this', the precise position matters (this is the case of rotating
    // a disk).
    //
    // Returns:
    //  observable of observables of Number (radians)
    //
    rx_rotateable: function (elCoords) {   // ([SVG.Element]) -> observable of observables of Number

      elCoords = elCoords | this;
      var precise = (elCoords === this);

      return Rx.Observable.merge(
        this.rx_mouse(elCoords, precise),
        this.rx_touch(elCoords, precise)
      ).map( function (o) {
        var cx= elCoords.cx(),
          cy= elCoords.cy();

        var rad= Math.atan2(o.y-cy, o.x-cx);
        return rad;
      }
      );
    }
    ***/
  };

  // tbd. extend the actual 'SVGDocument' and others
  //SVG.extend( SVG.Element,

  //tbd.
  //SVGSVGElement.prototype.rx_draggable = methods.rx_draggable;

  console.log("svg.rx.js initialised.")
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

