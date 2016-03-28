/*
* demo2.js
*
* A rotary group.
*/

(function() {
  "use strict";

  var A= 50;     // radius of the rotating circle
  var B= 75;     // distance of the handle origin from rotating origin
  var C= 10;     // width of the lever
  var D= 20;     // radius of the handle circle
  var X= 5;

  var svg = SVG("cradle");

  var g = svg.group().move(100,100);

  g.circle(2*A).addClass("knob").center(0,0);
  g.rect(B+C/2,C).addClass("lever").move(-C/2,-C/2);
  var handle = g.circle(D).addClass("handle").center(B,0);

  g.circle(X).addClass("origin").center(0,0);     // debugging

  //g.animate().rotate(-45,0,0);

  var pivotX = 0,
      pivotY = 0;

  // Tie dragging the 'handle' to rotating the whole group.
  //
  // Note: This could be done simpler but wanted to show how a 'deg' observable can be created. It can be useful
  //      e.g. if a value should be shown in some text field.
  //
  // Try to make the ball change the rotation of the group
  //
  handle.rx_draggable()      // observable of observables of {x:int,y:int}
    .subscribe( function(dragObs) {
      console.log("Drag started");

      // keep initial rotation
      var preDeg = g.transform('rotation');    // just gives the rads

      dragObs.subscribe( function(o) {       // {x:Int,y:Int}
        var rad = Math.atan2(o.y - pivotY, o.x - pivotX);
        g.rotate(preDeg + rad * RAD2DEG,pivotX,pivotY);
      },
      function () {
        //console.log("Drag ended");
      } );
  } );

})();
