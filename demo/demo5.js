/*
* demo5.js
*
* Constraints
*/

(function() {
  "use strict";

  var R= 30;

  var svg = SVG("cradle");

  var p1= new Rx.constraints.Point(100,100);
  var p2= new Rx.constraints.Point( p1, function (o) {   // ({x:Num,y:Num} -> {x:Num,y:Num}
    return { x: o.x + 50, y: o.y - 10 };
  } );

  var c1= svg.circle(p1).addClass("first");
  var c2= svg.circle(p2).addClass("second");

  dragIt(c1);
  dragIt(c2);

  function dragIt( el ) {     // (SVGElement) ->
    rl.rx_draggable.subscribe( function (dragObs) {
      dragObs.subscribe( function (o) {
        el.move( {o.x, o.y} );
      });
    });
  }
})();
