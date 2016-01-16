/*
* demo5.js
*
* Constraints
*/

(function() {
  "use strict";

  var R= 30;

  var svg = SVG("cradle");

  var p1= new SVG.Rx.Constraints.Point(100,100);
  var p2= new SVG.Rx.Constraints.Point( p1, function (o) {   // ({x:Num,y:Num}) -> {x:Num,y:Num}
    return { x: o.x + 50, y: o.y - 10 };
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
