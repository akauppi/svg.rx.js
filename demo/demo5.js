/*
* demo5.js
*
* Constraints
*/

(function() {
  "use strict";

  var R= 30;

  var svg = SVG("cradle");

  var p2;

  var p1= new SVG.Rx.Point(100,100).constrain( p2, function () {
    return p2.sub( 50,-10 );
  } );
  p2= new SVG.Rx.Point().constrain( p1, function () {   // () -> SVG.Rx.Point or falsy
    return p1.add( 50,-10 );
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
