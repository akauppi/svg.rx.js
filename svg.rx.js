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
    rx_draggable: function () {   // () ->

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
  
})();
