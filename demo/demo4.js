/*
* demo4.js
*
* Multi-touch demo.
*
* Follow each finger touch with a circle of different colour, and tie them together in the order of the touches.
*
* Allow any touch to be removed while following.
*
* Credit:
*   http://tomicloud.com/2012/03/multi-touch-demo
*/

(function() {
  var R=60;
  var N=10;    // how many fingers to track (if the hardware is up to it, e.g. Nexus 7 is)

  var svg = SVG("cradle");

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

      /***
      for( var i=0; i< ev.changedTouches.length; i++ ) {
        var touch = ev.changedTouches[i];
        var x = touch.clientX;
        var y = touch.clientY;
        console.log(name + " "+ touch.identifier + ": "+ x +" "+ y);
      }
      ***/
    }
  }

  svg.node.addEventListener("touchstart", genHandler("touchstart"), false);
  svg.node.addEventListener("touchend", genHandler("touchend"), false);
  svg.node.addEventListener("touchcancel", genHandler("touchcancel"), false);
  svg.node.addEventListener("touchmove", genHandler("touchmove"), false);

  /*** PENDING
  // Start getting events for N fingers
  //
  var arr = svg.rx_touch(N);    // [(observable of obseravables of ({x: Int, y: Int})), ...]

  arr.forEach( function (obsOuter,i) {

    var circle = svg.circle(R).class("touch"+i).hide();

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
  ***/

})();
