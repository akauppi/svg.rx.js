/*
* svg.rx.js
*/

// assert( SVG.Element.prototype );

// Note: The event handling code is based on 'svg.draggable.js' -> https://github.com/wout/svg.draggable.js
//      but we only enable stuff that we actually test (manually). I.e. 'SVG.Nested', 'SVG.Use', 'SVG.Text' support
//      remains disabled until we need it, and there are demos that exercise those things.

/*
*/
(function() {

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

      // Helper function to give us an outer stream of drags. Either coming from desktop, or touch.
      //
      var outerObs = function (keys) {    // ({start:string, move:string, end:string}) -> observable of {x:Int, y:Int}

        return Rx.Observable.fromEvent(self.node, keys.start)
          .select( function (evStart) {
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

              return function (ev /*, offset*/) {   // (mouse or touch event) -> point
                var o = ev.changedTouches ? ev.changedTouches[0] : ev;
                p.x = o.pageX;  // - (offset || 0)
                p.y = o.pageY;

                return p.matrixTransform(m);
              }
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

            var p0 = transformP(evStart /*, anchorOffset*/);

            var x_offset = p0.x - self.x(),
                y_offset = p0.y - self.y();

            // prevent browser drag behavior
            //
            evStart.preventDefault();

            // prevent propagation to a parent that might also have dragging enabled (tbd. this probably also takes
            // care of '.preventDefault()').
            //
            evStart.stopPropagation();

            var obsMove = Rx.Observable.fromEvent(window, keys.move);

            var obsUpSingle = Rx.Observable.fromEvent(window, keys.end)
                                .take(1);    // tbd. is there any benefit of doing this '.take(1)'? We're using '.takeUntil()' below.

            // tbd. How to optimize so that only the last event would ever be shipped, if multiple have gathered, i.e.
            //      we only need the last coordinates. AKa071015
            //
            // Note: some events actually come with the same x,y values (at least on Safari OS X) - removed by the
            //      '.distinctUntilChanged()'.
            //
            var obsInner = obsMove.select( function (evMove) {
              //console.log( evMove );

              var p = transformP(evMove);

              return {
                x: p.x - x_offset,
                y: p.y - y_offset
              };
            } )
              .distinctUntilChanged()
              .takeUntil( obsUpSingle );

            return obsInner;
          } );
        };  // function outerObs

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

  /*
  * The main document gets a method to track multiple touches within it.
  *
  * Note: We could enable this for 'SVG.Nested' as well, if we one day decide to support them.
  */
  SVG.extend( SVG.Element, {

    // Returns:
    //  observable of [<observable from rx_draggable>, <observable from rx_multitouch>]
    //
    // This is a bit bizarre - but dead simple at the same time!
    //
    // An observable is returned that will get a message when a touch (first touch) within the given SVG element happens.
    //
    //  - the first parameter of it is a "draggable" observable that will follow such touch's moves, until it is cancelled
    //    (roamed past the SVG boundaries) or ended (touch lifted).
    //
    //    This observable behaves precisely like those given by '.rx_draggable'. If the (first) touch happens again, later,
    //    the draggable observable provides a new dragging experience, and so one.
    //
    //  - the second parameter is a recursive observable, in the sense that it's precisely like the one returned
    //    by '.rx_multitouch', but for the next level (2nd) concurrent touch. The second touch (and thereafter) can happen
    //    anywhere on the SVG document, not tied to the particular element. The limit of how many simultaneous touches
    //    can be tracked comes from the hardware.
    //
    // Special cases:
    //
    //    If the last touch is ended, a new touch will be placed onto that level's draggable (i.e. a new level is not
    //    created); this is trivial.
    //
    //    But what if a touch in the "middle" is lifted?
    //
    //    In this case, the remaining touches (let's say 1 and 3) continue their drags as if nothing had occured. Only
    //    the touch 2 ended.
    //
    //    If in this case, a new touch is initiated, is it touch 2 or 4?
    //
    //    This is really a matter of specification, and what is deemed useful by the application code. Here, we make it
    //    touch 4, i.e. we allow gaps to be formed in the touches (nb. by tapping two fingers off one after each other,
    //    you'd get a multitouch where only touches n-1 and n are active, raising by each tap).
    //
    rx_multitouch: function (n) {   // () -> [observable of observables of { x: Int, y: Int }, ...]

      // implement when knowing touch events really, really good!!!
      //...
      var doc = this.doc;    // to be used within further inner functions

      var obs = this.rx_draggable();    // observable of observables of { x: Int, y: Int }

      return obs.select( function (obsDrag) {
        return [obsDrag, doc.rx_multitouch(n+1)];
      } );
    }
  });

})();
