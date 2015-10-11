/*
* svg.rx.js
*/

// assert( SVG.Element.prototype );

/*
*/
(function() {

  // adapted from 'svg.draggable.js' -> https://github.com/wout/svg.draggable.js
  //
  var Draggable = {
    // transforms one point from screen to user coords
    transformPoint: function (event, offset) {
      event = event || window.event
      var touches = event.changedTouches && event.changedTouches[0] || event
      this.p.x = touches.pageX - (offset || 0)
      this.p.y = touches.pageY
      return this.p.matrixTransform(this.m)
    }

    /**
    // gets elements bounding box with special handling of groups, nested and use
    getBBox: function(){
      var box = this.el.bbox()

      if(this.el instanceof SVG.Nested) box = this.el.rbox()

      if (this.el instanceof SVG.G || this.el instanceof SVG.Use || this.el instanceof SVG.Nested) {
        box.x = this.el.x()
        box.y = this.el.y()
      }

      return box
    }
    **/
  };

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

      console.log(this.node);
      
      // Note: If the events are identical by the fields we need, we can merge them right here.
      //      Otherwise, 
      //
      var obsDown = Rx.Observable.fromEvent(this.node, 'mousedown');  // tbd. #touch

      var outerObs = obsDown.select( function(ev) {
        console.log(52);

        var ev_x = ev.x,
            ev_y = ev.y;

        var x_offset = ev_x - self.x(),
            y_offset = ev_y - self.y();

        var cx_offset = ev_x - self.cx(),
            cy_offset = ev_y - self.cy();

        // Tracking mouse or touch moves
        //
        // Note: We expect the events to be similar. If they are not, we'll simply do a
        //      select before the merge.
        //
        var obsMove = //Rx.Observable.merge(
          Rx.Observable.fromEvent(window, 'mousemove');
          //Rx.Observable.fromEvent(window, 'touchmove')
        //);

        var obsUpSingle = //Rx.Observable.merge(
          Rx.Observable.fromEvent(window, 'mouseup');
          //Rx.Observable.fromEvent(window, 'touchend')
        //).take(1);    // note: 'take(1)' is not really needed (we're simply waiting for one event)

        // tbd. How to optimize so that only the last event would ever be shipped, if multiple have gathered, i.e.
        //      we only need the last coordinates. AKa071015
        //
        // Note: some events actually come with the same x,y values (at least on Safari OS X). 
        //
        var obsInner = obsMove.select( function (o) {
          return {
            x: o.x-x_offset,
            y: o.y-y_offset
          };
        } )
          .distinctUntilChanged()
          .takeUntil( obsUpSingle );

        return obsInner;
      } )

      return outerObs;    // note: the caller should dispose of this (and we should dispose of inner observables if one is active)
    }

  });
  
})();
