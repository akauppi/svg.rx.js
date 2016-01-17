/*
* demo5.js
*
* SVG.Rx.Point
*/

(function() {
  "use strict";

  var R= 30;

  var svg = SVG("cradle");

  var p1= new SVG.Rx.Point(100,100);
  var p2= new SVG.Rx.Point(150,90);

  var c1= svg.rx_circle(p1,R).addClass("first");
  var c2= svg.rx_circle(p2,R).addClass("second");

  svg.rx_line(c1.center(),c2.center()).addClass("connector").front();

  // Just the normal dragging - however the line follows dynamically

  dragIt(c1);
  dragIt(c2);

  function dragIt( el ) {     // (SVGElement) ->
    el.rx_draggable().subscribe( function (dragObs) {
      console.log( "dragging starts" );

      dragObs.subscribe( function (o) {
        el.center( o.x, o.y );
      });
    });
  }
})();
