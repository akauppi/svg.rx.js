/*
* svg.rx.js
*
* Provides dragging support for most SVG elements, taking care of coordinate transforms.
*
* Drags are presented as 'observable of observable of { x: num, y: num }'.
*   - The outer observables are the drags.
*   - The inner observables are the coordinate stream within a single drag.
*   - Coordinates ('x' and 'y') are provided as the coordinates of the element, who's '.rx_draggable()' was called.
*
* There can be multiple drags ongoing, even at the same time (touch interface with multiple fingers or even multiple
* users). This abstraction cleanly handles that.
*
* Design:
*   - support touch and mouse alike (don't require the application to know the difference)
*   - be brief
*
* References:
*   HTML5 API Index > SVG Overview
*     -> http://html5index.org/SVG%20-%20Overview.html
*       SVGDocument -> http://html5index.org/SVG%20-%20SVGDocument.html
*       SVGSVGElement -> http://html5index.org/SVG%20-%20SVGSVGElement.html
*
*   Learn RxJS
*     -> https://www.learnrxjs.io
*
*   MouseEvent
*     -> https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent
*
*   Touch
*     -> https://developer.mozilla.org/en-US/docs/Web/API/Touch
*/

// Note: Using 'pipe' approach means our set of imports does not affect downstream code.
//    See -> https://www.learnrxjs.io/concepts/operator-imports.html
//
import { fromEvent, merge as staticMerge, range } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { assert } from 'assert';

if (typeof assert === "undefined") {
  throw "Expecting runtime 'assert', please enable 'rollup-plugin-node-builtins'."
}

// SVG classes we use or refer to in the comments.
// ...
assert(SVGElement.prototype);
assert(SVGGElement.prototype);
assert(SVGSVGElement.prototype);

// Inner stream of drags. Handles coordinate transforms etc.
//
// Note: The event handling code was originally based on https://github.com/wout/svg.draggable.js . We only enable
//      stuff that we actually test. 'SVGText' support remains disabled, for this reason.
//
// 'el' is the element being tracked
//
// 'oStart': event from "mousedown" or "touchstart"
// 'moveObs': stream of "mousemove" or "touchmove"
// 'endObs': stream of "mouseup" or "touchcancel" or "touchend"
//
// 'elCoords' is the element, whose coordinate system is used (can be 'el', or e.g. its parent).
//
// #DEPRECATE THIS tbd.
// 'precise': If 'true', streams the exact position of the pointer/touch location. Otherwise hides that away and
//    treats any touch within the object the same (streams the position of the object, instead). Use 'true' if you
//    want to e.g. rotate by dragging a disk, in place. For normal drag, or rotational drag with a separate handle
//    object, use 'false'.
//
function innerObs (el, elCoords, oStart, moveObs, endObs, precise) {    // (SVGElement, SVGElement, MouseEvent or Touch, observable of MouseEvent or Touch, observable of MouseEvent or Touch, [true]) -> observable of {x:Int, y:Int}

  const isSvg = el instanceof SVGSVGElement;
  const isG = el instanceof SVGGElement;

  assert(el instanceof SVGElement);   // DEBUG
  /*** remove
  if (! ((el instanceof SVGElement) || isG || isDoc)) {
    throw "svg.rx.js does not support: "+ (typeof el);
  }
  ***/

  // Note: 'offset' and 'anchorOffset' in the code (commented out) have to do with this. (from svg.draggable.js)
  //
  if (el instanceof SVGTextElement) {
    console.warn( "Dragging might not work with "+ el );
  }

  /*** disabled
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
  ***/

  /*
  * About 'SVGPoint':
  *   - it's "not attached to any document" (not part of the DOM): https://msdn.microsoft.com/en-us/windows/ff972165(v=vs.71)
  *       Therefore, cleanup should be just a matter of just releasing the reference.
  *   - there's a 'DOMPoint' in recent browsers (2019; except Edge). This seems to be the same as 'SVGPoint', or an
  *       extension? WebStorm Option-B shows 'type SVGPoint = DOMPoint;'
  */
  const rootSvg = el.ownerSVGElement | el;   // need this as an anchor for the 'SVGPoint', even if it's not in the DOM (a bit weird)

  // Note: Consider that multiple objects can be moved simultaneously. [...clip...] The dynamic alloc/dealloc
  //      is probably the simplest way to go. AKa130316
  //
  let buf = rootSvg.createSVGPoint();    // point object (allocated just once per drag)

  debugger;   // check whether DOM got an 'SVGPoint'

  // Clean the allocated buffer
  //
  endObs.take(1).subscribe( () => {
    buf = null;     // GC cleans it up (likely would even without this, since we are the only place keeping the 'buf' reference)
  });

  // If a group is observing the drag, we want its transform NOT to be included. Otherwise, we get problems if the group
  // is rotated.
  //
  // Note: In the future, we might also do some group translation handling here [...clip...],
  //      so it may make sense to have the initialization within if-else (instead of tertiary operator). AKa290316
  //
  const m = elCoords.screenCTM().inverse();

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
  const transformP = function (o /*, offset*/) {   // (MouseEvent or Touch) -> SVGPoint (which has '.x' and '.y')
    buf.x = o.clientX;  // - (offset || 0)
    buf.y = o.clientY;

    return buf.matrixTransform(m);
  };

  const p0 = transformP(oStart /*, anchorOffset*/);

  // Offset from the touch/point location to the origin of the target element, at the beginning of the drag.
  let x_offset, y_offset;

  if (precise || isDoc) {
    x_offset = y_offset = 0;

  } else if ((el instanceof SVG.Circle) || (el instanceof SVG.Ellipse)) {
    x_offset = p0.x - el.cx();   // provide center's coordinates to the circle / ellipse being dragged
    y_offset = p0.y - el.cy();

  } else /*if (typeof el.x === "function")*/ {    // normal 'svg.js' elements (all have '.x' and '.y', even the circle)     // remove comment
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

  // Note: some events come with the same x,y values (at least on Safari OS X) - remove by '.distinctUntilChanged()'.
  //
  //    // RxJS 5 alpha era comment STARTS:
  // Note: The browser emits a reasonable (roughly 60 times a second, some web sites say) event stream. The application
  //      code tries to keep up with this, but may take longer than the 16ms to process the draws (especially on
  //      multiple fingers on the Nexus 7 tablet). This causes a drag-behind effect where the circles are following
  //      the fingers with a delay.
  //
  //      Neither '.debounce' or '.throttle( 1, Rx.Scheduler.requestAnimationFrame )' helps with this - they would
  //      simply drop the frame rate of all movements; we don't want that.
  //
  //      What we want is proper back pressure, where the application can signal itself, when it's ready for receiving
  //      the next drag event. Let's implement this on the application side (demo4) for now, since most cases would
  //      not need it. AKa140116
  //    // RxJS 5 alpha era comment ENDS.
  //
  // tbd. RxJS 6 may have solved this. Try out different approaches on a slow tablet.

  return moveObs.pipe(map( o => {
      return pointWithOffset( transformP(o) );
    }))
    .startWith( pointWithOffset(p0) )
    .distinctUntilChanged()
    .takeUntil( endObs );
}  // innerObs

/*
* Prevent default behaviour for 'mousedown' and 'touchstart', and bubbling up of the event to the parents.
*
* Note: this is not within 'innerObs' since here the 'TouchEvent', not 'Touch', is needed.
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

  // Prevent propagation to a parent that might also have dragging enabled.
  //
  evStart.stopPropagation();
}

/*--- User API ---
*/

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
function rx_touch (el, elCoords, precise) {   // (SVGElement, SVGElement, [Boolean]) -> observable of observables of { x: Int, y: Int }

  const startAllObs = fromEvent( el, "touchstart" );
  const moveAllObs = fromEvent( window, "touchmove" );
  const cancelAllObs = fromEvent( window, "touchcancel" );
  const endAllObs = fromEvent( window, "touchend" );

  // 'index': 0..n-1 (probably always 0); index to the starting touch
  //
  var touchDragObs = function (evStart, wantedId) {      // (TouchEvent, ???tbd.???) -> observable of {x:Int, y:Int}

    debugger;   // type of 'wantedId'?
    preventDefault(evStart);

    // Pick the 'wanted' move, cancel and end events to track
    //
    // Note: RxJS does not have what Scala calls '.collect' (map or reject as one operation).
    //     -> http://stackoverflow.com/questions/35118707/rxjs5-how-to-map-and-filter-on-one-go-like-collect-in-scala
    //     -> https://xgrommx.github.io/rx-book/content/guidelines/implementations/index.html#implement-new-operators-by-composing-existing-operators
    //
    const filterWanted = pipe(
        map( ev => {    // (TouchEvent) -> Touch | undefined
          ev.changedTouches.find( touch => touch.identifier === wantedId );   // Touch | undefined
        }),
        filter( x => x !== undefined )
    );

    // Note: RxJS does not have what Scala calls '.collect': to both map and filter.
    //
    const moveObs = moveAllObs.pipe(filterWanted);
    const cancelObs = cancelAllObs.pipe(filterWanted);
    const endObs = endAllObs.pipe(filterWanted);

    const cancelOrEndObs = staticMerge( endObs, cancelObs );
      // Note: Ignore the deprecation warning (if any). static 'merge' should _NOT_ be deprecated -> https://rxjs-dev.firebaseapp.com/api/index/function/merge

    return innerObs( self, elCoords, touchStart, moveObs, cancelOrEndObs, precise );

  }; // touchDragObs

  // Each "touchstart" event can start multiple drags. This actually happens on iOS (9.2) but not on Android (6.0.1).
  //
  // Note: the '.selectMany' means that we can spawn multiple (0..n) values from within this one event, unlike the
  //      single one that '.select' would.
  //
  return startAllObs.mergeMap( function (ev) {  // (TouchEvent) -> Array of observable of {x:Int, y:Int}

    return range( 0, ev.changedTouches.length ).map( i => {   // tbd. iterate array contents directly
        const touchStart = ev.changedTouches[i];

        touchDragObs( ev, i );
    } );
  });
};  // rx_touch

//---
// Mouse tracking for the element
//
// Note: We currently only support button 1. Would be easy to support any mouse buttons, if needed, but we probably
//      should see it from the application point of view. Also, shift etc. might be as important as the different
//      buttons. AKa060116
//
function rx_mouse (el, elCoords, precise) {   // (SVGElement, [SVGSVGElement | SVGGElement], [Boolean]) -> observable of observables of {x:Int, y:Int}

  // Just consider primary button
  //
  const filterButton = filter( ev =>  // MouseEvent
      ev.button === 0
  );

  const startObs =  fromEvent(el, "mousedown").pipe(filterButton);
  const moveObs =   fromEvent(window, "mousemove").pipe(filterButton);
  const endObs =    fromEvent(window, "mouseup").pipe(filterButton);

  return startObs.pipe(
    map( ev => {   // (MouseEvent) -> observable of {x:Int, y:Int}
      preventDefault(ev);
      return innerObs( el, elCoords, ev, moveObs, endObs, precise );
    })
  );
}

//---
// Create an observable for either mouse or touch drags
//
// 'myCoords': report coordinates in 'this' element's coordinate system, instead of its parent.
          // tbd. ^-- do we need that?
//
// Returns:
//  observable of observables of { x: Int, y: Int }
//
SVGElement.prototype.rx_draggable = function (myCoords, precise) {   // ([Boolean] = false, [Boolean]) -> observable of observables of { x: Int, y: Int }
  const el = this;

  if (precise) {  // tbd.
    console.warn("NOT reworked 'precise' option, yet. Maybe we won't need it? : "+ precise);
  }

  // Coordinates are given in the parent's coordinate system, unless 'myCoords' is set or there is no parent.
  //
  const elCoords = myCoords ? el :
      (function() {                   // tbd. would just 'el.parent || el' work?
        const parent = el.parent;
        return parent ? parent : el;
      })();

  return Observable.merge(
    rx_mouse(el, elCoords, false /*precise*/) //,
    //rx_touch(this, elCoords, precise)   tbd. re-enable
  );
};

console.log("svg.rx.js initialised.");


/* --- scraps --- */

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

