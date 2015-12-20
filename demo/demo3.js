/*
* demo3.js
*
* Simple rectangle, getting its moves from an RxJs observable.
*/

(function() {
  "use strict";

  var W= 80;
  var GAP=150;

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
              .addClass("simple");

  dragIt(rect1);

  /*
  * Rectangle with a twist (tests that transforms are properly handled).
  */
  var rect2= svg.rect( W, W )
              .move(GAP,0)
              .addClass("transformed");

  // Note: because order of transforms matter, they cannot be given in the same object.
  //
  rect2.transform({ scale: 0.5 }).transform({ rotation:45 });

  dragIt(rect2);

  /*** Note: rect3 disabled since changing the translation matrix (rotates, sizing) during a drag is probably
  *           not a very real world problem. If it becomes one, let's solve it. AKa241015
  *

  /_*
  * Rectangle with a twist (dynamic behaviour).
  *_/
  var rect3= svg.rect( W, W ).translate(W/2,W/2)
              .move(2*GAP,0)
              .addClass("dynamic");

  rect3.transform({ scale: 0.5 }).transform({ rotation:20 });

  dragIt(rect3,
      function (o) {
          rect3.move(o.x,o.y).rotate(0); // o.x * (360/800) );
      }
  );
  ***/
})();
