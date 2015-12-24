/*
* demo4.js
*
* Multi-touch demo
*
* One circle is on the screen all the time. When it is being pushed, other fingers will be tracked by different
* colors on the screen. The first one does not move.
*
* The demo is the way it is because this is alike one real-world need. Maybe.
*
* Credit:
*   http://tomicloud.com/2012/03/multi-touch-demo
*/

(function() {
  "use strict";

  /*
  * Return an array that actually has 'length' elements. This can be used as a seed for '.foreach' and '.map' -
  * just use the index parameters, and not the contents.
  *
  * Note: 'new Array(n)' does not do the same.
  *
  * Ref. -> http://stackoverflow.com/questions/3746725/create-a-javascript-array-containing-1-n
  */
  /*** not needed
  function emptyArray(len) {   // (Int) -> [null, ...]
    return Array.apply( null, { length: len });
  }
  ***/
  function range(start,end) {
    var arr = [];
    for (var i = start; i <= end; i++) {
        arr.push(i);
    }
    return arr;
  }

  var R=200;
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

    dragObs0.subscribe( function (o) {
      circle[0].center(o.x, o.y);

      // track the other N-1 touches, while the first one is held down

      // Note: Using Array map instead of for-looping, to make sure 'i' is captured for the later processing.
      //
      range(1,N).forEach( function(i) {
        outerObs[i] = window.rx_touch(i);

        outerObs[i].subscribe( function (dragObs) {

          dragObs.subscribe( function (o) {
            circle[i].center(o.x, o.y).show();
          });
        });
      } );

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
