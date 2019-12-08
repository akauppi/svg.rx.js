/*
* gx.draggable.js
*
* Additions to 'Gx' to make them draggable
*/
/*jshint devel:true */

(function () {
  "use strict";

  assert(true);
  assert(Gx);

  SVG.extend( Gx, {

    /*
    * The detailed draggable interface; provides access to start and end of drags; does not move the object.
    */
    rx_draggable: function() {    // () -> observable of observable of {x:Num, y:Num}

      return this._g.rx_draggable();
    },

    /*
    * The easier alternative, if:
    *   - the object is wanted to be followed by the mouse/touch, without constraints
    *   - there is no need to unregister the draggability
    *   - there is no need to check mouse/touch status (though those can probably be done using global means, anyways,
    *     via 'window.event')
    *
    * Providing the callback function is optional; moving the object happens regardless of it (before the callback
    * is called).
    */
    draggable: function (f) {    // ((x:Num, y:Num) ->) ->
      var self= this;

      this.rx_draggable().subscribe( function (dragObs) {
        //console.log("Drag started");

        dragObs.subscribe( function (o) {   // ({x:Num, y:Num} ->
          //console.log(o);
          self.pos( o.x, o.y );   // move the object before informing the callback

          if (f) f(o.x, o.y);
        });
      });
    }

  });

})();
