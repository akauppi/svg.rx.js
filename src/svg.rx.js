/*
* svg.rx.js
*/

// assert( SVG.Element.prototype );

/*
*/
(function() {

  /** DISABLED we don't support '.G', '.Use', '.Nested', yet. Do we need to?
  // gets elements bounding box with special handling of groups, nested and use
  //
  var getBBox = function(el) {
    var box = (el instanceof SVG.Nested) ? el.rbox() : el.bbox();

    if (el instanceof SVG.G || el instanceof SVG.Use || el instanceof SVG.Nested) {
      box.x = el.x();
      box.y = el.y();
    }

    return box;
  }
  **/

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
      var outerObs = function (touch) {    // (boolean) -> observable of {x:Int, y:Int}

        return Rx.Observable.fromEvent(self.node, touch ? 'touchstart':'mousedown')
          .select( function (ev) {
            console.log( "Outer observable started" );    // happens on touch
            //console.log(ev);

            /** remove
            var ev_x = ev.x,
                ev_y = ev.y;

            var x_offset = ev_x - self.x(),
                y_offset = ev_y - self.y();
            **/
            //var cx_offset = ev_x - self.cx(),
            //    cy_offset = ev_y - self.cy();

            // Transforms from screen to user coords
            //
            // adapted from 'svg.draggable.js' -> https://github.com/wout/svg.draggable.js
            //
            var transformP = (function () {    // -> function (event) -> point

              // Note: local values are hidden in this scope.
              //
              // nb. Only stuff we actually test (manually) is enabled. 'SVG.Nested' is not one of them (from 'svg.draggable.js')
              //
              var parent = /*self.parent(SVG.Nested) ||*/ self.parent(SVG.Doc);

              var p = parent.node.createSVGPoint();     // point buffer (avoid reallocation per each coordinate change)
              var m = self.node.getScreenCTM().inverse();

              return function (ev /*, offset*/) {
                //event = event || window.event
                var touches = ev.changedTouches && ev.changedTouches[0] || ev;
                p.x = touches.pageX;  // - (offset || 0)
                p.y = touches.pageY;

                return p.matrixTransform(m);
              }
            })();

            /** DISABLED text element support not needed, yet
            var anchorOffset;

            // fix text-anchor in text-element (#37)
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

            var offset = transformP(ev /*, anchorOffset*/);
            var startBox = self.bbox();    // note. 'svg.draggable.js' had special code for handling G, Use, Nested

            // prevent browser drag behavior
            //
            ev.preventDefault();

            // prevent propagation to a parent that might also have dragging enabled (tbd. this probably also takes
            // care of '.preventDefault()').
            //
            ev.stopPropagation();

            var obsMove = Rx.Observable.fromEvent(window, touch ? 'touchmove':'mousemove');

            var obsUpSingle = Rx.Observable.fromEvent(window, touch ? 'touchend':'mouseup')
                                .take(1);    // note: 'take(1)' is not really needed (we're simply waiting for one event)

            // tbd. How to optimize so that only the last event would ever be shipped, if multiple have gathered, i.e.
            //      we only need the last coordinates. AKa071015
            //
            // Note: some events actually come with the same x,y values (at least on Safari OS X) - removed by the
            //      '.distinctUntilChanged()'.
            //
            var obsInner = obsMove.select( function (ev) {
              //console.log( ev );   // tbd. with touch, it's not '.x','.y'

              //var box = self.bbox();
              var p = self.transformPoint(o);
              var x = startBox.x + p.x - offset.x,
                  y = startBox.y + p.y - offset.y;

              return {
                x: x,   //remove: o.x - x_offset,
                y: y    //remove: o.y - y_offset //,
                //cx: o.cx - cx_offset,
                //cy: o.cy - cy_offset
              };
            } )
              .distinctUntilChanged()
              .takeUntil( obsUpSingle );

            return obsInner;
          } );
        };  // function outerObs

      // Merge the two approaches. Only one inner drag active at any one time (desktop or touch)
      //
      // Note: the caller should dispose of this (and we need to check if we need to dispose some).
      //
      return Rx.Observable.merge(
        outerObs(false),  // mouse
        outerObs(true)    // touch
      );
    }

  });
  
})();
