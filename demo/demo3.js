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
  var X2= X1 + 200;
  var Y2= Y1;
  var X3= X2 + 200;
  var Y3= Y2;
  var X4= X3 + 100;
  var Y4= Y3;
  var X5= X4 + 200;
  var Y5= Y4;
  var X6= X5 + 200;
  var Y6= Y5;

  var RAD2DEG = 180.0 / Math.PI;

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

          if ((el instanceof SVG.Circle) || (el instanceof SVG.Ellipse)) {
            el.center(o.x, o.y);
          } else {
            el.move(o.x, o.y);
          }
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
  var g1circle= g1.circle(W/3).center(W/2,W/2);

  dragIt(g1);
  dragIt(g1circle);

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
  *
  * - use '.move' to set the symbol's origin
  * - use '.translate' (not '.move') to move the use around (this allows other transforms to be applied, based on the origin)
  */
  svg.rect(W,W).move(X5,Y5)
    .transform({ scale: 0.8 })
    .transform({ rotation: 30 })
    .addClass("debug");

  // For symbol, transforms don't matter but simply moving the contents relative to (0,0) (with 'x' and 'y')
  // sets the symbol's origin.
  //
  var sym1= svg.symbol().move(-W/2,-W/2);

  sym1.rect(W,W);
  var circle = sym1.circle(W/3).center(2/3*W,W/2);

  sym1.rect(W/2,W/2).move(W/2,W/2).addClass("sub");

  var use1= svg.use(sym1)
              .translate( X5+W/2, Y5+W/2 )
              .transform({ scale: 0.6 })
              .transform({ rotation: 30 })
              //
              .addClass("transformed")
              .addClass("showSub");

  dragIt(use1);

  dragIt(circle);

  var use1b= svg.use(sym1)
              .translate( X5+W/2, Y5+100+W/2 )
              .transform({ scale: 0.3 })
              .transform({ rotation: 20 })
              //
              .addClass("transformed");

  dragIt(use1b);

  /*
  * Symbol within a group
  *
  * Allow reuse of symbol definition
  * Allow rotation by the events coming to a drag handle
  */
  var R = 80;
  var B= R*Math.sqrt(3)/2;
  var sym2= svg.symbol();
  sym2.path( "M"+R+",0"+
        "L"+(-R/2)+","+B+
        "l0,-"+(2*B)+
        "z" );
  sym2.circle(30).center(0,0);

  var gx = svg.group()
           .translate( X6+W/2, Y6+W/2 );

  var use2= gx.use(sym2)
              //.transform({ scale: 0.6 })
              //.transform({ rotation: 30 })
              //

  var gxCircle = gx.circle(30).move(100,0);

  dragIt(gx);

  // Try to make the ball change the rotation of the group
  //
  gxCircle.rx_draggable()      // observable of observables of {x:int,y:int}
    .subscribe( function(dragObs) {
      //console.log("Drag started");

      dragObs.subscribe( function(o) {       // {x:Int,y:Int}
        console.log( JSON.stringify(o) );

        var rad = Math.atan2(o.y,o.x);

        gx.rotate(rad * RAD2DEG);

      },
      function () {
        //console.log("Drag ended");
      } );
  } );

})();
