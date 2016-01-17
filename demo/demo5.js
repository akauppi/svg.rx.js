/*
* demo5.js
*
* Constraints
*/

(function() {
  "use strict";

  var R= 30;

  var svg = SVG("cradle");

  var p1= new SVG.Rx.Point(100,100);
  var p2= new SVG.Rx.Point().constrain( p1, function (p1_candidate,p2_candidate) {   // (SVG.Rx.Point, SVG.Rx.Point) -> Boolean

    // Don't let the points go too far
    //
    return (p1_candidate.distTo(p2_candidate) <= 100);
  } );

  var c1= svg.rx_circle(p1).addClass("first");
  var c2= svg.rx_circle(p2).addClass("second");

  // Just the normal dragging from now on - however dragging past constraints will not move the coordinates.

  dragIt(c1);
  dragIt(c2);

  function dragIt( el ) {     // (SVGElement) ->
    el.rx_draggable.subscribe( function (dragObs) {
      dragObs.subscribe( function (o) {
        el.center( o.x, o.y );
      });
    });
  }
})();
