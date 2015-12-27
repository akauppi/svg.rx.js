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

(function() {
  "use strict";

  var R=100;
  var N=10;    // how many fingers to track (if the hardware is up to it, e.g. Nexus 7 is)

  var svg = SVG("cradle");

  // Note: jshint warns against functions in a loop, but we have it covered (taking copies within inner function scope). AKa271215
  //
/*jshint -W083 */

  var doc = svg.doc;

  // Bringing also mouse in here - helps us with debugging
  //
  for( var iMaster=-1; iMaster<N; iMaster++ ) { (function () {   // scope for the inner values
    var i = iMaster;
    var c = (i<0) ? "mouse" : "touch"+i;
    var circle = svg.circle(R).addClass(c).hide();

    var outerObs = (i<0) ? svg.rx_mouse() : svg.rx_touch(i);   // observable of observables of {x: Int, y: Int}; tracks touch id 'i'

    outerObs.subscribe(
      function (dragObs) {
        dragObs.subscribe(
          function (o) {
            circle.center(o.x, o.y).show();
          },
          null,   // error handling
          function () {  // end of drag
            console.log( "end of drag" );
            circle.hide();
          }
        );
      }
    );

  })(); }
/*jshint +W083 */

})();


/***
  // debugging
  //
  if (false) {
    var genHandler = function (name) {
      return function (ev) {
        console.log(ev.changedTouches);

        // Note: 'ev.changedTouches' does not work like an array, i.e. no '.map' and such. AKa131215
        //
        var s="";

        for( var i=0; i< ev.changedTouches.length; i++ ) {
          var touch = ev.changedTouches[i];
          var x = touch.clientX;
          var y = touch.clientY;
          s += touch.identifier + ": "+ x +" "+ y + " ";
        }

        console.log(name + " "+ s);
      }
    }

    svg.node.addEventListener("touchstart", genHandler("touchstart"), false);
    svg.node.addEventListener("touchend", genHandler("touchend"), false);
    svg.node.addEventListener("touchcancel", genHandler("touchcancel"), false);
    svg.node.addEventListener("touchmove", genHandler("touchmove"), false);
  }

***/
