/*
* demo5.js
*
* SVG.Rx.Point
*/

(function() {
  "use strict";

  var R= 30;

  var svg = SVG("cradle");

  var c1= svg.rx_circle( new SVG.Rx.Point(100,100) ,R).addClass("first");
  var c2= svg.rx_circle( new SVG.Rx.Point(150,90), R).addClass("second");

  // tbd. uncomment while circles work AKa170116
  //
  //svg.rx_line(c1.center(),c2.center()).addClass("connector").front();

  // Just the normal dragging - however the line follows dynamically

  dragIt(c1);
  dragIt(c2);

  function dragIt( el ) {     // (SVGElement) ->
    el.rx_draggable().subscribe( function (dragObs) {
      dragObs.subscribe( function (o) {
        el.center( o.x, o.y );
      });
    });
  }
})();
