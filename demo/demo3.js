/*
* demo3.js
*
* Tests that rotation, translation and scaling should not affect dragging behaviour.
*/
/*jshint devel: true */

(function() {
  "use strict";

  var X1= 50;
  var Y1= 50;
  var W= 160;
  var X2= X1 + 250;
  var Y2= Y1;
  var X3= X2 + 250;
  var Y3= Y2;
  var X4= X3 + 250;
  var Y4= Y3;
  var X5= X4 + 250;
  var Y5= Y4;

  var svg = SVG("cradle");

  /*
  * Helper function for a linear drag
  *
  * Note that unlike with other SVG draggable API's, the library does not actually move the object.
  *     This allows us to do anything with the drag streams that we get (here we just to linear move, following the
  *     cursor).
  */
  var dragIt = function (el,f) {        // (SVGElem, [({x:int,y:int}) =>]) =>

    el.rx_draggable()      // observable of observables of {x:int,y:int}
      .subscribe( function(dragObs) {
        //console.log("Drag started");
        dragObs.subscribe( f || function(o) {       // {x:Int,y:Int}
          //console.log( JSON.stringify(o) );
          el.move(o.x, o.y);
        },
        function () {
          //console.log("Drag ended");
        } );
    } );
  };

  /*
  * Simple rectangle
  */
  var rect1= svg.rect( W, W )
              .move(X1,Y1)
              .addClass("simple");

  dragIt(rect1);

  /*
  * Rectangle with a twist (tests that transforms are properly handled).
  */
  // Note: because order of transforms matter, they cannot be given in the same object.
  //
  var rect2= svg.rect( W, W )
              .move(X2,Y2)
              .transform({ scale: 0.7 })
              .transform({ rotation:45 })
              .addClass("transformed");

  dragIt(rect2);

  /*
  * Group that gets transforms
  *
  * Note: This wobbles when being dragged, since svg.js '.move()' for groups meddles with their transformation (there is
  *     no 'x','y' attributes for groups; groups stretch automatically by their contents.
  */
  var g1= svg.group()
              .move(X3,Y3)
              .transform({ scale: 0.7 })
              .transform({ rotation:45 })
              .addClass("transformed");

  g1.rect(W,W);
  g1.circle(W/3).center(W/2,W/2);

  dragIt(g1);

  /*
  * Nested SVG with transforms
  *
  * - transforms don't apply to a nested thing, it seems
  */
  var nest1= svg.nested()
              .move(X4,Y4)
              .transform({ scale: 0.7 })
              .transform({ rotation:45 })
              .addClass("transformed");

  nest1.rect(W,W);
  nest1.circle(W/3).center(W/2,W/2);

  dragIt(nest1);

  /*
  * Symbol and use with transforms
  *
  * - may well be the best way to handle complicated objects
  * - need to fix that the transforms are based on some weird coordinate
  */
  var sym1= svg.symbol();

  sym1.rect(W,W);
  sym1.circle(W/3).center(W/2,W/2);

  var use1= svg.use(sym1)
              .move(X5,Y5)                    // tbd. this probably is handled via translate
              .transform({ scale: 0.8, cx: X5+W/2, cy:Y5+W/2 })      // scaling is based on the svg origin
              .transform({ rotation:45, cx: X5+W/2, cy:Y5+W/2 })     // for some reason, the rotation is based on svg origin
              .addClass("transformed");

  dragIt(use1);

})();
