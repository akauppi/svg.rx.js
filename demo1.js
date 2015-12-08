/*
* demo1.js
*
* A group with sizing corners.
*/

(function() {
    var W= 100;
    var CORNER_SIZE = 20;
    var CORNER_OFFSET = 5;

    var svg = SVG("cradle");

    /*
    * Helper function for a linear drag
    *
    * Note that unlike with other SVG draggable API's, the library does not actually move the object.
    *     This allows us to do anything with the drag streams that we get (here we just to linear move, following the
    *     cursor).
    */
    var dragIt = function (el,f) {        // (SVGElem, [({x:int,y:int}) =>]) =>
        f = f || function (o) {     // ({x:int, y:int}) =>
            //console.log( JSON.stringify(o) );
            el.move(o.x, o.y);
        };

        el.rx_draggable()      // observable of observables of {x:int,y:int}
          .subscribe( function(dragObs) {
            //console.log("Drag started");
            dragObs.subscribe(f,
            function () {
              //console.log("Drag ended");
            } );
          } );
    }

    /*
    * Simple rectangle
    */
    var g = svg.group().move(50,50);

    dragIt(g);      // linear drag for the group (its main rectangle catches the events, but also corners move with it)

    // Create four corners
    //
    // Note: the corners' (0,0) will be where the main box's particular corner is
    //
    // - use 'translate()' to position the corner
    //
    var corner = [],
        obsCorner = [];

    for( var i=0; i<4; i++ ) {    // ne,se,sw,nw
      var x = (i<2) ? W : 0;
      var y = (i==1 || i==2) ? W : 0;

      var tx = (i<2) ? -(CORNER_SIZE-CORNER_OFFSET) : -CORNER_OFFSET;
      var ty = (i==1 || i==2) ? -(CORNER_SIZE-CORNER_OFFSET) : -CORNER_OFFSET;

      corner[i] = g.rect(CORNER_SIZE,CORNER_SIZE)
                    .translate( tx,ty )
                    .move( x,y )
                    .addClass("corner");

      // Note: the '.switch()' simply gives us the latest drag (we lose track of when drags start/end).
      //
      obsCorner[i] = corner[i].rx_draggable().switch();
    }

    // Make the corners follow each other's (and their own) drags
    //
    var obsX1 = Rx.Observable.merge( obsCorner[2], obsCorner[3] ).pluck('x').startWith(0);
    var obsX2 = Rx.Observable.merge( obsCorner[0], obsCorner[1] ).pluck('x').startWith(W);

    var obsY1 = Rx.Observable.merge( obsCorner[0], obsCorner[3] ).pluck('y').startWith(0);
    var obsY2 = Rx.Observable.merge( obsCorner[1], obsCorner[2] ).pluck('y').startWith(W);

    var dragCorner = function (el, obsX, obsY) {        // (SVGElem, Observable of int, Observable of int) =>

        Rx.Observable.combineLatest( obsX, obsY )
            .subscribe( function (arr) {      // e.g. [100,0]
                //console.log(arr);
                el.move(arr[0],arr[1]);
            });
    }

    dragCorner( corner[0], obsX2, obsY1 );
    dragCorner( corner[1], obsX2, obsY2 );
    dragCorner( corner[2], obsX1, obsY2 );
    dragCorner( corner[3], obsX1, obsY1 );

    var main= g.rect( W, W )
                .addClass("main")
                .back();

    obsX1.subscribe( function (x) { main.x(x); } );
    obsY1.subscribe( function (y) { main.y(y); } );

    Rx.Observable.combineLatest( obsX2, obsX1, function (x2,x1) { return x2-x1; } ).subscribe( function (width) {
        main.attr("width", width);
    } );

    Rx.Observable.combineLatest( obsY2, obsY1, function (y2,y1) { return y2-y1; } ).subscribe( function (height) {
        main.attr("height", height);
    } );
})();
