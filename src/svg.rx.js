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
  var innerObs = function (el, oStart, moveObs, endObs) {    // (SVG.Element|SVG.G|SVG.Doc, MouseEvent or TouchEvent, observable of MouseEvent or Touch, observable of MouseEvent or Touch) -> observable of {x:Int, y:Int}

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

    // With 'S.Doc', 'el.x()' and 'el.y()' are always 0 (well, unless viewport is used, likely..). Don't really
    // understand why the below is the right thing but it is. AKa271215
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
      .takeUntil( endObs );
  };  // innerObs


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

      /*** Code below did not really work - 'remember' remembers nada. tbd. fix it. AKa271215
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

      var touchDragObs = function (ev, wanted) {      // (TouchEvent, /*touchId*/ Int) -> observable of {x:Int, y:Int}

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

        return innerObs( self, ev, moveObs, cancelOrEndObs );

      }; // touchDragObs

      // tbd.
      //
      // 'startAllObs' gets events for every new touch start.
      // Each of such events creates 1..n-1 observables of {x,y}
      // How do we map this into a single observable of observables of {x,y}?
      //

      // tbd. How to transfer 1..n-1 observables of {x,y}
      //
      // Note: It is possible (though unlikely) that the same TouchEvent would start multiple touch chains. We'll keep
      //        that possibility available in the code, though (it's the right thing to do). AK060116
      //
      var outerObs = startAllObs.selectMany( function (ev) {  // (TouchEvent) -> Array(observable of {x:Int, y:Int}, ...)

        // tbd. Could use '.map' for this instead of i looping. But 'ev.changedTouches' is not a true Array. AKa060116
        //
        var arr = [];

        for (var i=0; i<ev.changedTouches.length; i++) {
          var touch = ev.changedTouches[i];

          // Note: 'touch.identifier' can be a 0..N-1 number (Android) or a freely running counter (iOS); we treat it as
          //      an opaque identifier to find the matching further move/cancel/end events.
          //
          var wanted = touch.identifier;

          arr.push( touchDragObs( ev, wanted ) );   // dragging observable for that particular touch
        }

        // tbd. How should we now (or in the loop above) push all the dragObs's to this observable?
        //
        return arr;
      } );

      return outerObs;
    },  // rx_touch

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

      startObs.select( function (ev) {   // (MouseEvent) -> observable of {x:Int, y:Int}
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
