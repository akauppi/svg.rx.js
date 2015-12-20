/*
* demo4.js
*
* Multi-touch demo
*
* Follow each finger touch with a circle of different colour, and tie them together in the order of the touches.
*
* Allow any touch to be removed while following.
*
* Credit:
*   http://tomicloud.com/2012/03/multi-touch-demo
*/

(function() {
  "use strict";

  var R=60;
  var N=10;    // how many fingers to track (if the hardware is up to it, e.g. Nexus 7 is)

  var svg = SVG("cradle");

  var circle = [];

  for( var i=0; i<N; i++ ) {
    circle[i] = svg.circle(R).addClass("touch"+i).hide();
  }

  // Object for first touch is always visible
  //
  circle[0].center(100,100).show();

  // Catch the first touch
  //
  var outerObs0 = circle[0].rx_touch(0);   // observable of observables of {x: Int, y: Int}

  outerObs0.subscribe( function (dragObs0) {

    // track the other N-1 touches, while the first one is held
    //
    var circles = [];
    var obs = [];

    for( var i=1; i<N; i++ ) {
/*jshint -W083 */
      obs[i-1] = window.rx_touch(i);

      obs[i-1].subscribe( function (dragObs) {
        circle[i].center(o.x, o.y).show();
      });
/*jshint +W083 */
    }

    dragObs0.subscribe( function (o) {
      circle[0].center(o.x, o.y);
    });

  }, function () {    // end of drag
    for( var i=1; i<N; i++ ) {
      circles[i].hide();
      obs[i-1].cancel();
    }
  });

  // Start getting events for N fingers
  //
  var arr = svg.rx_touch(N);    // [observable of obseravables of ({x: Int, y: Int}), ...]

  arr.forEach( function (obsOuter,i) {

    obsOuter.subscribe( function (obsDrag) {
      dragObs.subscribe( function (o) {
        circle.show().center(o.x, o.y);
      });
    }, function () {
      // tbd. Could make the hiding with animation to look coooool!
      //
      circle.hide();    // end of touch
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
