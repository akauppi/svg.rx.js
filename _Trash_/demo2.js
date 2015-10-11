/*
* demo2.js
*
* Sample for showing binding of SVG graphics with RxJs.
*
* Not using BehaviourSubject, but proper observable filtering.
*/

$(function() {
    var W= 100;
    var CORNER_SIZE = 20;
    var CORNER_OFFSET = 5;

    var svg = SVG("cradle");   // fills the cradle fully

    //--- Bind pieces together ---
    //
    // Corners are directly bound to the main rectangle's position and dimensions.
    //
    (function () {
      var g = svg.group();

      g.move(50,50).draggable();    // normal '.draggable' works here; moves the whole group

      var obsCorner = [];   // observables to change when a certain corner is dragged
      var corner = [];

      // Create four corners (note: the corners' (0,0) will be where the main box's particular corner tracks them).
      //
      // - use 'move()' to change the 'x,y' (dragging does this)
      // - use 'translate()' to position the corner
      //
      for( var i=0; i<4; i++ ) {    // ne,se,sw,nw
        var trx = (i<2) ? obsX2 : obsX1;
        var try_ = (i==1 || i==2) ? obsY2 : obsY1;

        var tx = (i<2) ? -(CORNER_SIZE-CORNER_OFFSET) : -CORNER_OFFSET;
        var ty = (i==1 || i==2) ? -(CORNER_SIZE-CORNER_OFFSET) : -CORNER_OFFSET;

        corner[i] = g.rect(CORNER_SIZE,CORNER_SIZE)
                      .translate( tx,ty )
                      .move( trx.getValue(),try_.getValue() )
                      .addClass("corner");

        // Make dragging the corner change the observable, but also the corner to move
        // if another corner changes the observable.
        //
        obsCorner[i] = corner[i].rx_draggable();   // observable of {x:num,y:num}'s
      }

      // tbd: details right (after having read the RxJS stuff...)
      //
      // tbd. initial values 0,0,W,W
      //
      var obsX1 = rx.merge( obsCorner[2], obsCorner[3] ).select( function(o) { return o.x; } ),
          obsY1 = rx.merge( obsCorner[0], obsCorner[3] ).select( function(o) { return o.y; } ),
          obsX2 = rx.merge( obsCorner[0], obsCorner[1] ).select( function(o) { return o.x; } ),
          obsY2 = rx.merge( obsCorner[1], obsCorner[2] ).select( function(o) { return o.y; } );

      // All corners are draggable. Make them follow their own, and the neighbouring corners' drags.
      //
      corner[0].follow( { x: obsX2, y: obsY1 } );
      corner[1].follow( { x: obsX2, y: obsY2 } );
      corner[2].follow( { x: obsX1, y: obsY2 } );
      corner[3].follow( { x: obsX1, y: obsY1 } );

      // Main rect to follow all corners.
      //
      // tbd. Place it below the corners (ahead of them in the SVG order).
      //
      // tbd. make it impossible to move corners past (a limiting function to the corners' draggable, different for each)
      //
      var rect= g.rect( obsX2.getValue()-obsX1.getValue(), obsY2.getValue()-obsY1.getValue() )
       .addClass("main")
       .follow( "x", obsX1 )
       .follow( "y", obsY1 )
       .follow( "width", obsX2.combineLatest( obsX1, function (x2,x1) { return x2-x1; } ))
       .follow( "height", obsY2.combineLatest( obsY1, function (y2,y1) { return y2-y1; } ));
    })();
});
