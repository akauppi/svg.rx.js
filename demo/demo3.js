/*
* demo3.js
*
* Simple rectangle, getting its moves from an RxJs observable.
*/
/*jshint devel: true */

(function() {
  "use strict";

  var X1= 50;
  var Y1= 50;
  var W= 160;
  var X2= X1 + 250;
  var Y2= Y1;

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
        console.log("Drag started");
        dragObs.subscribe( f || function(o) {       // {x:Int,y:Int}
          console.log( JSON.stringify(o) );
          el.move(o.x, o.y);
        },
        function () {
          console.log("Drag ended");
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
  var rect2= svg.rect( W, W )
              .move(X2,Y2)
              .addClass("transformed");

  // Note: because order of transforms matter, they cannot be given in the same object.
  //
  rect2.transform({ scale: 0.5 }).transform({ rotation:45 });

  dragIt(rect2);
})();
