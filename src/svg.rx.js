/*
* svg.rx.js
*/
/*jshint devel:true */

/*
* Note: The event handling code is based on 'svg.draggable.js' -> https://github.com/wout/svg.draggable.js
*       but we only enable stuff that we actually test (manually). I.e. 'SVG.Nested', 'SVG.Use', 'SVG.Text' support
*       remains disabled until we need it, and there are demos that exercise those things.
*/

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

  // Helper function to give us an outer stream of drags. Either coming from desktop, or touch.
  //
  // '...Obs'  parameters are 'observable of x' where 'x' is either 'MouseEvent' or { pageX:Int, pageY:Int [,_ev:TouchEvent] }'.
  //
  // 'debugName': used for console output
  //
  // References:
  //    MouseEvent -> https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent
  //    Touch -> https://developer.mozilla.org/en-US/docs/Web/API/Touch
  //
  var outerObs = function (el, startObs, moveObs, endObs, debugName) {    // (SVG.Element|SVG.G|SVG.Doc, observable of MouseEvent or {pageX: Int, pageY: Int, _ev:TouchEvent}, ...) -> observable of observable of {x:Int, y:Int}

    debugName = debugName | "unknown";

    var isDoc = (el instanceof SVG.Doc);

    if (! ((el instanceof SVG.Element) || (el instanceof SVG.G) || isDoc)) {
      throw "svg.rx.js does not support: "+ (typeof el);
    }

    /*** disabled
    // Prevent browser default behavior and propagation to parent entries.
    //
    // Note: Preventing default behaviour on mouse events is a bit weird, since the same event can carry multiple touch id
    //      information. We cannot just prevent one of them, but have to bite out all. Does this do any harm? AKa271215
    //
    function eatUp (o) {
      var ev = o._ev | o;

      debugger;
      ev.preventDefault();      // don't cause browser pan, refresh etc. (touch)
      ev.stopPropagation();     // needed eg. for demo1 (so corner events don't also drag the main element)
    }
    ***/

    // Note: keep helper functions within the '.select()' function, since things like the positioning of the element,
    //      its transformation etc. may change during the lifespan of the observable.

    return startObs.
      select( function (oStart) {   // (MouseEvent or {pageX: Int, pageY: Int, _ev: TouchEvent}) -> observable of {x:Int, y:Int}
        //console.log( debugName +": Outer observable started" );

        //eatUp(oStart);

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

        //console.log("move clientXY "+ oStart.clientX + " "+ oStart.clientY);
        //console.log("move pageXY "+ oStart.pageX + " "+ oStart.pageY);
        //console.log("move screenXY "+ oStart.screenX + " "+ oStart.screenY);

        var p0 = transformP(oStart /*, anchorOffset*/);

        // With 'S.Doc', 'el.x()' and 'el.y()' are always 0 (well, unless viewport is used, likely..). Don't really
        // understand why the below is the right thing but it is. AKa271215
        //
        // Note: If the SVG element is slightly scrolled off window, the 0's don't work. AKa271215
        //
        var x_offset = isDoc ? 0 : p0.x - el.x(),
            y_offset = isDoc ? 0 : p0.y - el.y();

        //console.log("el "+ el.x() + " "+ el.y());
        //console.log("p0 "+ p0.x + " "+ p0.y);
        //console.log("x_offset "+ x_offset);
        //console.log("y_offset "+ y_offset);

        var endSingleObs = endObs.take(1);    // tbd. is there any benefit of doing this '.take(1)'? We're using '.takeUntil()' below.

        // tbd. How to optimize so that only the last event would ever be shipped, if multiple have gathered, i.e.
        //      we only need the last coordinates. AKa071015
        //
        // Note: some events actually come with the same x,y values (at least on Safari OS X) - removed by the
        //      '.distinctUntilChanged()'.
        //
        var innerObs = moveObs.select( function (o) {
          //console.log( debugName +": "+ o );

          // When moving outside of SVG area, shouldn't paint text. (not sure if this works for that; anyways a rather
          // marginal issue). AKa271215
          //
          //eatUp(o);

          var p = transformP(o);

          //console.log( o );
          //console.log( "move: "+ p.x +" "+ p.y );

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
    // Create an RxJS observable for touch events of a certain touch id.
    //
    // Returns:
    //  observable of observables of { x: Int, y: Int }
    //
    // 'n' is the touch index (0-based) to follow. Maximum number of touches that can be tracked depends on hardware.
    //
    rx_touch: function (n) {   // (n: Int) -> observable of observables of { x: Int, y: Int }

      var self = this;    // to be used within further inner functions

      /*** disabled (code below did not really work - 'remember' remembers nada. tbd. fix it. AKa271215
      ***/
      // Return an observable for certain touch events for the element. Also remember the observable for later calls
      // (only one is ever created, for a certain element and 'evName').
      //
      var cache = function (evName) {   // (String) -> observable of touchEvent
        var key = "svg.rx.js."+evName;

        var obs = self.remember(obs);
        if (!obs) {
          obs = Rx.Observable.fromEvent(self, evName);
          self.remember(key,obs);
          console.log( "cached: "+evName+" for "+ self );
        } else {
          console.log( "found from cache: "+ evName +" for "+self )
        }
        return obs;
      };
      /***
      var cache = function (evName) {   // temporary
        return Rx.Observable.fromEvent(self,evName);
      }
      ***/

      var startAllObs = cache( "touchstart" );
      var moveAllObs = cache( "touchmove" );
      var cancelAllObs = cache( "touchcancel" );
      var endAllObs = cache( "touchend" );

      // Note: If the one buffer for all touch id messages works fine, we can simplify this a bit (declare the 'buf'
      //      here instead of the caller). AKa271215

      // Derive the observable for just the given touch
      //
      var f = function (buf) {    // ({}) -> (TouchEvent) -> { pageX: Int, pageY: Int, _ev: event } or undefined

        return function (ev) {
          // tbd. Wasn't able to use normal array methods with 'ev.changedTouches'. We'd want '.find()'. AKa161215
          //
          for (var i=0; i<ev.changedTouches.length; i++) {
            var touch = ev.changedTouches[i];
            if (touch.identifier === n) {
              // the fields that 'outerObs' is expecting of us (similar names to a mouse event)
              //
              // Note: Using a buffer object allocated by the caller, to reduce lots of temporary allocations. The stream
              //      should always be bothered of the latest value only. AKa271215
              //
              buf.pageX = touch.pageX;
              buf.pageY = touch.pageY;
              buf._ev = ev;   // so 'outerObs' can prevent event default effects and bubbling up (*)

              return buf;
            }
          }
        }
      };

      // (*) preventing default events may be a context-sensitive thing so we don't want to do it here. E.g. mousemove
      //    events (for mouse, though) need to be default-prevented when dragging is occurring, but not if it's not.
      //    This simply buys us more freedom. AKa271215

      // Prevent browser drag behaviour for touch #0
      //
      // Note: Just preventing all "touchstart" events, if the application tracks id 0. This is simplest and works
      //      the way we want.
      //
      if (n===0) {
        startAllObs.subscribe( function (ev) {     // (TouchEvent)

          // prevent browser drag behavior
          //  - scrolling the whole web page (Android, iOS)
          //  - refresh gestures (Android)
          //
          ev.preventDefault();

          // prevent propagation to a parent that might also have dragging enabled (see demo1).
          //
          ev.stopPropagation();
        });
      }

      // Just one buffer seems to be enough (keep like this until tested on multiple platforms).
      //
      var buf = {};

      // Note: RxJS does not seem to have what Scala calls '.collect': to both filter and convert.
      //
      var startObs = startAllObs.filterAndSelect(f(buf));
      var moveObs = moveAllObs.filterAndSelect(f(buf));
      var cancelObs = cancelAllObs.filterAndSelect(f(buf));
      var endObs = endAllObs.filterAndSelect(f(buf));

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

        // prevent browser drag behavior
        //  - Makes sure text doesn't get "painted" when moving the cursor outside of the SVG cradle, on top of HTML text.
        //
        ev.preventDefault();

        // prevent propagation to a parent that might also have dragging enabled (see demo1).
        //
        ev.stopPropagation();
      });

      return outerObs( self, startObs, moveObs, endObs, "mouse" );
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
