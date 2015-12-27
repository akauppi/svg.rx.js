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

  /*
  * Return an array with 'start'..'end' as values.
  *
  * Ref. -> http://stackoverflow.com/questions/3746725/create-a-javascript-array-containing-1-n
  */
  /*** not used
  function range(start,end) {
    var arr = [];
    for (var i = start; i <= end; i++) {
        arr.push(i);
    }
    return arr;
  }
  ***/

  var R=100;
  var N=10;    // how many fingers to track (if the hardware is up to it, e.g. Nexus 7 is)

  var svg = SVG("cradle");

  var circle = [];
  var outerObs = [];

  for( var i=0; i<N; i++ ) {
    circle[i] = svg.circle(R).addClass("touch"+i).hide();
  }

  // Object for first touch is always visible
  //
  circle[0].center(100,100).show();

  // Catch the first touch
  //
  outerObs[0] = circle[0].rx_touch(0);   // observable of observables of {x: Int, y: Int}

  outerObs[0].subscribe( function (dragObs0) {

    dragObs0.subscribe( function (/*o*/) {      // not using the touch #0 drag coordinates

      // track the other N-1 touches, while the first one is held down

      // Note: jshint warns "not to make functions within a loop". We're prepared. AKa271215
/*jshint -W083 */
      for( var i_=1; i_<=N; i_++ ) { (function (i) {    // 'i' captured for the inner functions
        outerObs[i] = window.rx_touch(i);

        outerObs[i].subscribe( function (dragObs) {

          dragObs.subscribe( function (o) {
            circle[i].center(o.x, o.y).show();
          });
        });
      }(i_)) }
/*jshint +W083 */

    }, function () {  // end of drag
      // tbd. could change size or color
      for( var i=1; i<N; i++ ) {
        circle[i].hide();
        outerObs[i].cancel();
      }
    } );

  });

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
