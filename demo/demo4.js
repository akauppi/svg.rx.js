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

  var svg = SVG("cradle");

  //var el = svg.circle(20).center(0,0);

  var genHandler = function (name) {
    return function (ev) {
      //console.log(name);

      for( var i=0; i< ev.changedTouches.length; i++ ) {
        var touch = ev.changedTouches[i];
        var x = touch.clientX;
        var y = touch.clientY;
        console.log(name + " "+ touch.identifier + ": "+ x +" "+ y);
      }
    }
  }

  svg.node.addEventListener("touchstart", genHandler("touchstart"), false);
  svg.node.addEventListener("touchend", genHandler("touchend"), false);
  svg.node.addEventListener("touchcancel", genHandler("touchcancel"), false);
  svg.node.addEventListener("touchmove", genHandler("touchmove"), false);

  /*** needs editing
  /_*
  * Helper to handle multitouch events
  *
  * i:  1..n (level of recursion) = Nth touch
  *
  * obs: observable of (observable of {x:Int,y:Int}, observable like 'obs' (recursively))
  *_/
  var handleMultiTouch = function (i, obs) {

    obs.subscribe( function (obs1, obs2) {
      // create a circle for the touch ('obs1' will move it around)
      //
      var circle = svg.circle(0,0).attr("level",i);

      obs1.subscribe( function (o) {   // {x:Int,y:Int}
          console.log( "Moving touch: "+i );
          console.log(o);
          circle.move(o.x,o.y);
        },
        function () {   // drag ended
          console.log( "Out of touch: "+i );
          circle.release();
        }
      )

      handleMultiTouch(i+1, obs2);    // dig one level deeper (anticipate next touch)
    });
  };

  handleMultiTouch( 1, svg.rx_multitouch() )
  ***/

})();
