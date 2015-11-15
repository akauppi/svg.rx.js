/*
* demo4.js
*
* Multi-touch demo.
*
* Follow each finger touch with a circle of different colour, and tie them together in the order of the touches.
*
* Allow any touch to be removed while following.
*/

(function() {
  var R=60;

  var svg = SVG("cradle");   // fills the cradle fully

  /*
  * Helper to handle multitouch events
  *
  * i:  1..n (level of recursion) = Nth touch
  *
  * obs: observable of (observable of {x:Int,y:Int}, observable like 'obs' (recursively))
  */
  var handleMultiTouch = function (i, obs) {

    obs.subscribe( function (obs1, obs2) {
      // tbd. create a circle for the touch ('obs1' will move it around)

      obs1.subscribe( function (o) {   // {x:Int,y:Int}
          console.log( "Moving touch: "+i );
          console.log(o);
          // tbd. move the particular circle
        },
        function () {   // drag ended
          console.log( "Out of touch: "+i );
          // tbd. remove the circle
        }
      )

      handleMultiTouch(i+1, obs2);    // dig one level deeper (anticipate next touch)
    });
  };

  handleMultiTouch( 1, svg.rx_multitouch() )

})();
