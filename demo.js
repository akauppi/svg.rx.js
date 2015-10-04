/*
* demo.js
*
* Sample for showing binding of SVG graphics with RxJs.
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

    g.move(50,50).draggable();

    // 'Rx.BehaviorSubject' "represents a value that changes over time".
    //
    var obsX1 = new Rx.BehaviorSubject(0),
      obsY1 = new Rx.BehaviorSubject(0),
      obsX2 = new Rx.BehaviorSubject(W),
      obsY2 = new Rx.BehaviorSubject(W);

    // Declare main rect first so corners get on top of it.
    //
    var rect= g.rect( obsX2.getValue()-obsX1.getValue(), obsY2.getValue()-obsY1.getValue() )
     .addClass("main")
     .follow( "x", obsX1 )
     .follow( "y", obsY1 )
     .follow( "width", obsX2.combineLatest( obsX1, function (x2,x1) { return x2-x1; } ))    // tbd. make it impossible to move corners past (a limiting function to the corners' draggable, different for each)
     .follow( "height", obsY2.combineLatest( obsY1, function (y2,y1) { return y2-y1; } ));

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

      var corner = g.rect(CORNER_SIZE,CORNER_SIZE)
                    .translate( tx,ty )
                    .move( trx.getValue(),try_.getValue() )
                    .addClass("corner")
                    .draggable();   // tbd. how to not escalate dragging to the group level

      // Make dragging the corner change the observable, but also the corner to move
      // if another corner changes the obsersable.
      //
      corner.track( trx, try_ )
            .follow( "x", trx )
            .follow( "y", try_ );
    }
  })();
});
