/*
* demo4.js
*
* Multi-touch demo #1
*
* For each touch, a circle will be created and following that touch.
*
* Credit:
*   http://tomicloud.com/2012/03/multi-touch-demo
*/
/*jshint devel: true */

(function() {
  "use strict";

  var R=100;
  var COLORS=10;    // 0..9 in the CSS

  var svg = SVG("cradle");

  var c= -1;   // next CSS color to use

  svg.rx_draggable().subscribe( function (dragObs) {
    c = (c+1) % COLORS;

    var circle = svg.circle(R).addClass("n"+c).hide();
    var fresh = true;

    dragObs.subscribe(
      function (o) {
        //console.log( "Dragging: "+ o.x + " "+ o.y );
        circle.center(o.x, o.y);

        if (fresh) {
          circle.show();
          fresh = false;
        }
      },
      null,   // error handling
      function () {  // end of drag
        circle.remove();
      }
    );
  });

})();
