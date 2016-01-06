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

  var svg = SVG("cradle");

  // tbd. Use that name only temporarily
  //
  var outerObs = svg.rx_mouseOrTouch();   // observable of observables of {x: Int, y: Int}

  var active= 0;   // count of ongoing drags

  outerObs.subscribe(
    function (dragObs) {
      active = active + 1;
      console.log( "Drag start: "+ active );

      var circle = svg.circle(R).addClass("n"+active).hide();

      dragObs.subscribe(
        function (o) {
          console.log( "Dragging: "+ o.x + " "+ o.y );
          circle.center(o.x, o.y).show();
        },
        null,   // error handling
        function () {  // end of drag
          console.log( "end of drag" );
          circle.remove();    // remove from 'svg'
        }
      );
    }
  );

})();
