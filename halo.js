/*
* bugs/scaling.js
*
* Shows how svg.js does not seem to allow anchoring
*/
/*jshint devel: true */
/*globals assert, Gx */

var RAD2DEG = (180.0 / Math.PI);

var svg = SVG( document.body );

var rotDeg_obs;

/*
* Halo demo, not using symbols (works)
*
* Note: This method scales by the browser zooming changes (symbols + use don't).
*/
(function() {
  "use strict";

  var R1 = 20,
    R2 = 120,
    X= 140,
    Y= 100;

  var arrowRight = svg.path("M16.711 8.29l-6-5.996c-0.391-0.391-1.026-0.391-1.417 0s-0.391 1.025 0 1.417l4.293 4.29h-11.59c-0.553 0-1.001 0.448-1.001 1s0.448 1 1.001 1h11.59l-4.292 4.29c-0.391 0.391-0.391 1.025 0.001 1.417s1.026 0.391 1.417 0l6-5.997c0.196-0.196 0.294-0.453 0.294-0.71s-0.097-0.514-0.294-0.71z")
    .width(18).height(18).translate(-9,-9);

  //var arrowLeft = arrowRight.clone().scale(-1,1);

  var trash = svg.group();
    //
    trash.path( "M17 5h-4v-3c0-0.552-0.448-1-1-1h-6c-0.552 0-1 0.448-1 1v3h-4c-0.552 0-1 0.448-1 1v1h2v9c0 0.552 0.448 1 1 1h12c0.552 0 1-0.448 1-1v-9h2v-1c0-0.552-0.448-1-1-1zM7 3h4v2h-4v-2zM14 15h-10v-8h10v8z" )
      .width(18).height(18).translate(-9,-9);
    trash.path( "M6.5 13h1c0.276 0 0.5-0.224 0.5-0.5v-3c0-0.276-0.224-0.5-0.5-0.5h-1c-0.276 0-0.5 0.224-0.5 0.5v3c0 0.276 0.224 0.5 0.5 0.5z" )
      /*.width(18).height(18)*/.translate(-9,-9);
    trash.path( "M10.5 13h1c0.276 0 0.5-0.224 0.5-0.5v-3c0-0.276-0.224-0.5-0.5-0.5h-1c-0.276 0-0.5 0.224-0.5 0.5v3c0 0.276 0.224 0.5 0.5 0.5z" )
      /*.width(18).height(18)*/.translate(-9,-9);

  var letter = svg.path("M512 96h-448c-17.672 0-32 14.328-32 32v320c0 17.672 14.328 32 32 32h448c17.672 0 32-14.328 32-32v-320c0-17.672-14.328-32-32-32zM467.781 160l-179.781 122.602-179.781-122.602h359.562zM480 400c0 8.836-7.156 16-16 16h-352c-8.844 0-16-7.164-16-16v-171.602l175.906 119.141c4.969 2.977 10.532 4.461 16.094 4.461s11.125-1.484 16.094-4.461l175.906-119.141v171.602z")
    .width(18).height(12).translate(-9,-6);

  // Use, but a local symbol
  //
  /*** didn't work very well
  var symLocal = svg.defs().path("M512 96h-448c-17.672 0-32 14.328-32 32v320c0 17.672 14.328 32 32 32h448c17.672 0 32-14.328 32-32v-320c0-17.672-14.328-32-32-32zM467.781 160l-179.781 122.602-179.781-122.602h359.562zM480 400c0 8.836-7.156 16-16 16h-352c-8.844 0-16-7.164-16-16v-171.602l175.906 119.141c4.969 2.977 10.532 4.461 16.094 4.461s11.125-1.484 16.094-4.461l175.906-119.141v171.602z")
  var useLocal = svg.use(symLocal)
    .attr( {width: 36, height: 27} ).translate(-18,-13.5);
  ***/

  // Pick a symbol from an external file (this would be the best way to use SVGs).
  //
  // Note: The dimensions must match the icon's aspect ratio, using a box would cut off right edge.
  //      tbd. would be nice to get a programmatic way to sniff the ratio.
  //
  var useExt= svg.use("icon-letter", "halo-icons.svg")
    .width(22).height(18).translate(-11,-9);

  var widthDeg = 45;

  var halo = svg.gxHalo(R1, R2, widthDeg, [
    {el: arrowRight, f: function () { console.log("1"); }, _disabled: Rx.Observable.from([true]), upright: true },
    {el: trash, el2: letter, f: function () { console.log("2"); }, upright: true },

    //{el: useLocal, f: function () { console.log("2b"); }, upright: false },

    // If the 'use' has 'upright' off, it behaves fine. Rotating it doesn't.
    //
    {el: useExt, f: function () { console.log("2c"); }, upright: true },
    {el: svg.rect(18,18).translate(-9,-9), f: function () { console.log("3"); }, upright: true },
    {el: svg.circle(18,18).translate(-9,-9).style( {fill: "blue" }), f: function () { console.log("4"); this.toggleClass("selected"); }, flash: false},
    {el: svg.circle(18,18).translate(-9,-9).style( {fill: "red" }), f: function () { console.log("5"); }}
  ]);

  halo.pos(X,Y);

  // Add a rim that can be used for interactive rotation
  //
  // Note: By using 'translate' (and not 'center'), we keep the origin of the circle's coordinate system in its
  //    center. This makes the rotation handling easier, later.
  //
  var R2_EXTRA = R2+5;
  var rim = svg.circle(2*R2_EXTRA).translate(X,Y).addClass("rim").back();
    //
    // This clipped the wrong way (wanted to clip the smaller circle out). AKa100716
    //
    // tbd. How to clip out the piece? AKa170716
    //
    //rim.clipWith( svg.circle(2*R1).center(X,Y) );

  svg.circle(2*R1).center(X,Y).style({ fill: "purple"}).front();

  // Note: For some reason, we need to explicitly remove 'cx', 'cy' attributes. Maybe 'svg.js' places them there;
  //    anyways without this they would point to '(75,75)' and rotation code would not behave right.
  //
  rim.attr( {
    cx: null,
    cy: null
  });

  rim.rx_draggable(rim,true).subscribe( function (dragObs) {

    // Make the dragging skip a trail (always go to latest value after earlier redraw has happened).
    //
    // Based on:
    //  -> http://jsbin.com/gopodowaxa/edit?html,js,console
    //  -> http://stackoverflow.com/questions/35343183/rxjs-control-observable-invocation#answer-35347136
    //
    // tbd. Should bake this into 'svg.rx.js' dragging itself, once it works. AKa300716
    //
    // Note: Wasn't able to get the 'controlledObs' flowing with 'controller' being a regular 'Subject' (tried with
    //    '.next(true)' and '.startWith(true)'. As a 'BehaviorSubject' it works - is there any downside to that? AKa300716
    //
    // Note: NOT SURE, whether the 'zip' actually makes the dragging experience any better. How to check whether
    //      coordinates are really skipped or not?
    //

    if (true) {   // with 'auditTime'
      var auditObs = dragObs.auditTime(0);    // 10, 20 (just 0 might actually wait until DOM rendering has happened, since it probably uses 'setTimeout' internally)

      var diffRad;   // while not actively dragged: undefined
                     // while dragged: Number, providing the diff (in radians), needed due to the ability to point/touch anywhere on the disk

      auditObs.subscribe(
        function (o) {    // ({x: Number, y: Number}) ->
          //console.log( "Dragging: "+ o.x + " "+ o.y );

          if ((!diffRad) && (diffRad !== 0)) {
            diffRad = halo.rotRad() - Math.atan2(o.y, o.x);
            // First drag coordinates don't move, yet
          } else {
            var rad = Math.atan2(o.y, o.x);
            halo.rotRad(rad + diffRad);
          }
        },
        null,   // error handling
        null    // end of drag
      );

    } else {
      // Using RxJS 'buffer' -> http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-buffer
      //
      // Note: This collects the 'dragObs' values into an array. We only wish to use the last of those collected, but
      //    there does not seem to be a method in RxJS5 for that.
      //
      var controller = new Rx.BehaviorSubject();

      var controlledObs = dragObs.buffer(controller);

      var diffRad;   // while not actively dragged: undefined
                     // while dragged: Number, providing the diff (in radians), needed due to the ability to point/touch anywhere on the disk

      controlledObs.subscribe(
        function (os) {    // (array of {x: Number, y: Number}) ->
          //console.log( "Dragging: "+ o.x + " "+ o.y );

          if (os.length > 0) {
            var o = os[os.length-1];

            //console.log( os );

            if (os.length > 1) {
              console.log( "Skipping "+ (os.length-1) +" coordinates" );
            }

            if ((!diffRad) && (diffRad !== 0)) {
              diffRad = halo.rotRad() - Math.atan2(o.y, o.x);
              // First drag coordinates don't move, yet
            } else {
              var rad = Math.atan2(o.y, o.x);
              halo.rotRad(rad + diffRad);
            }
          }

          // The browsers punch in new coordinates at about 60fps (16ms intervals) (it's not a continuous stream).
          //
          // We'd actually want to know, when the SVG drawing has happened, on the screen, but that's probably not
          // available in the browser, is it? If it was, tap for next coordinate only then. tbd. AKa310716
          //
          setTimeout( function () {
            controller.next();    // let last of collected coordinates (or next) come through
          }, 20 );
        },
        null,   // error handling
        null    // end of drag
      );
    }
  } );

  rotDeg_obs = halo.obsRotDeg();
})();

/*
* Place symbols in squares and see how they would rotate (they should rotate in place).
*/
if (true) (function() {
  "use strict";

  var X= 300,
    Y= 20,
    BOX_SIZE= 50,
    SIZE2= 20,
    ROWS= 3,
    COLS= 3;

  // Draw the grid
  //
  for( var i=0; i<COLS; i++ ) {
    for( var j=0; j<ROWS; j++ ) {
      var x= X+ BOX_SIZE*i,
        y= Y+ BOX_SIZE*j;

        svg.rect(BOX_SIZE, BOX_SIZE).move(x,y).addClass("debug");
        svg.rect(SIZE2, SIZE2).center(x+BOX_SIZE/2,y+BOX_SIZE/2).addClass("debug");
    }
  }

  // Symbols
  //
  var arrowRight =
    svg.path("M16.711 8.29l-6-5.996c-0.391-0.391-1.026-0.391-1.417 0s-0.391 1.025 0 1.417l4.293 4.29h-11.59c-0.553 0-1.001 0.448-1.001 1s0.448 1 1.001 1h11.59l-4.292 4.29c-0.391 0.391-0.391 1.025 0.001 1.417s1.026 0.391 1.417 0l6-5.997c0.196-0.196 0.294-0.453 0.294-0.71s-0.097-0.514-0.294-0.71z")
      .width(18).height(18)
      .translate(-9,-9);

  // In order to scale (mirror) the arrow, we need to give the 'cx' of the actual horizontal position of the arrow,
  // in relation to the window. Why it is like this is not actually clear. It may (or may not) be something about 'svg.js'
  // (hopefully one day we get rid of it!!! :). AKa170716
  //
  // Interestingly, even if we do this "right", after the arrow is rotated, it goes completely heywire. :( AKa170716
  //
  //var arrowLeft_bad = arrowRight.clone().translate(-9,-9).transform( { scaleX: -1, cx: 0 } );   // this won't be visible, off the left edge

  var arrowLeft = arrowRight.clone().flip('x', 384);  //.transform( { scaleX: -1, cx: 384 } );

  /*** disabled
  // Let's make a group to wrap the mirrored arrow, and see if that helps. (nope)
  //
  var arrowLeftGrouped = svg.group();
    //
    arrowLeftGrouped.add( arrowRight.clone() ).translate(-9,-9).transform( { scaleX: -1, cx: 217 } );
  ***/

  // Symbol in multiple parts.
  //
  // We need to apply '.translate()' to the paths themselves, not the group. Group is SVG is not for layout, but for
  // handling attributes etc.
  //
  var trash = svg.group();
    //
    trash.path( "M17 5h-4v-3c0-0.552-0.448-1-1-1h-6c-0.552 0-1 0.448-1 1v3h-4c-0.552 0-1 0.448-1 1v1h2v9c0 0.552 0.448 1 1 1h12c0.552 0 1-0.448 1-1v-9h2v-1c0-0.552-0.448-1-1-1zM7 3h4v2h-4v-2zM14 15h-10v-8h10v8z" )
      .width(18).height(18).translate(-9,-9);
    trash.path( "M6.5 13h1c0.276 0 0.5-0.224 0.5-0.5v-3c0-0.276-0.224-0.5-0.5-0.5h-1c-0.276 0-0.5 0.224-0.5 0.5v3c0 0.276 0.224 0.5 0.5 0.5z" )
      /*.width(18).height(18)*/ .translate(-9,-9);
    trash.path( "M10.5 13h1c0.276 0 0.5-0.224 0.5-0.5v-3c0-0.276-0.224-0.5-0.5-0.5h-1c-0.276 0-0.5 0.224-0.5 0.5v3c0 0.276 0.224 0.5 0.5 0.5z" )
      /*.width(18).height(18)*/ .translate(-9,-9);

  var letter = svg.path("M512 96h-448c-17.672 0-32 14.328-32 32v320c0 17.672 14.328 32 32 32h448c17.672 0 32-14.328 32-32v-320c0-17.672-14.328-32-32-32zM467.781 160l-179.781 122.602-179.781-122.602h359.562zM480 400c0 8.836-7.156 16-16 16h-352c-8.844 0-16-7.164-16-16v-171.602l175.906 119.141c4.969 2.977 10.532 4.461 16.094 4.461s11.125-1.484 16.094-4.461l175.906-119.141v171.602z")
    .width(18).height(18)
    .translate(-9,-9);

  // Load an outside icon. This is the way we'd actually like to treat icons, since it detaches the graphical design
  // from the code. AKa170716
  //
  var use1= svg.use("icon-forward", "halo-icons.svg");
  var use2= svg.use("icon-letter", "halo-icons.svg");

  use1.attr( {width: 18, height:18} ).translate(-9,-9);
  use2.attr( {width: 18, height:18} ).translate(-9,-9);

  var square = svg.rect(18,18).translate(-9,-9);

  var els= [
    arrowRight, arrowLeft, trash,
    letter, use1, use2,
    square
  ];

  els.forEach( function (el,k) {
    var i= k%COLS,
      j= Math.floor(k/COLS) %ROWS;

    var x= X + (i+0.5) * BOX_SIZE,
      y= Y + (j+0.5) * BOX_SIZE;

    // Moving a 'path' (in svg.js) seems to actually edit its contents! i.e. moving is not a cheap operation for a path.
    // It should be done by changing the matrix, instead.

    //console.log( "Setting "+k+" to", x, y );
    el.move(x,y);

    //el.attr( {width:18});
  } );

  /*
  * Return the center of an element, within the 'SVG.Doc'
  */
  var centerWithinDoc = function (el) {    // (SVG.Element) -> {x:Num,y:Num}
    var x= el.cx(),
      y= el.cy();

    var m= el.screenCTM();

    return {
      x: m.e + x*m.a + y*m.c,
      y: m.f + x*m.b + y*m.d
    }
  }

  // After '.move', the 'use' elements get 'x' and 'y' attributes set. This also allows us to read the '.cx' and '.cy'.
  //
  console.log( use1.cx(), use2.y() );
  //use1.rotate(20, 384, 95);

  //use1.translate( -100, -100 );

  // Tie to the rim's rotational stream
  //
  rotDeg_obs.subscribe( function (deg) {
    els.forEach( function (el,i) {

      if (el instanceof SVG.G) {
        el.rotate(deg);
      } else {
        var cx= el.cx(),
          cy= el.cy();

        el.rotate(deg, cx, cy);   // follow the rotation, around their origin
      }
    } );
  } );
})();

/* REMOVE
* Halo demo, using 'use' and symbols (fetched from external files)
*
* Note:
*   It would be nice to be able to fetch icons from elsewhere. However, this approach (implementation) suffers from
*   two problems:
*
*     - the icons don't scale along if the zooming factor in the browser is changed (they also change positions)
*     - positioning and scaling the icons is "magical", just trying to find the right numbers to fit them in.
*
*   Those two are obviously the same problem. Anyways, it is a waste of time at this stage to try to fix them, since
*   the "inlined" symbol definitions don't suffer from this. AKa100716
*/
/* disabled
(function() {
  "use strict";

  var R1 = 20,
    R2 = 50,
    X= 230,
    Y= 55;

  /_*
  * Make a group with a rectangle and the symbol fitting inside it.
  *_/
  if (false) (function () {
    var g = svg.group();
    g.rect(20,20).center(0,0).addClass("debug");

    var use = g.use("icon-forward", "halo-icons.svg");
    //use.scale(0.06, 0,0);

    g.move(200,50);
  })();

  /_*
  * Note: 'use' gives too big placement of the symbols, and they were not coming on top of menu arc, either, like
  *     rect's do.
  *_/
  // Refer to the symbols in an external SVG file
  //
  var use1= svg.use("icon-forward", "halo-icons.svg");
  //var use2= svg.use("icon-trash", "halo-icons.svg");

  //var use1= svg.use("icon-forward", "halo-icons.svg");   // tbd. do arrow backward
  var use2= svg.use("icon-letter", "halo-icons.svg");

  var trans = function (el) {   // SVG.Use -> SVG.Use (same)

    // Note: These adjustments just *happen* to bring the right outcome (on default zooming level, in Safari and Chrome).
    //      We should make this more systematic, so any scaling and zooming would work. AKa040716
    //
    el.scale(0.06, 9,9);
    el.translate(-16,2);

    // Note: If we pass 'use' entities to the 'svg.gxHalo()' they won't be properly rotated (actually - translated).
    //    Wrap in a group. AKa210616
    //
    if (true) {
      var g= el.parent().group();
      g.add(el);

      if (true) {
        g.rect(20,20).addClass("debug");
      }

      return g;
    } else {
      return el;
    }
  }

  // tbd. using 'use' as elems doesn't seem to work - why don't they move? AKa210616

  var halo = svg.gxHalo(R1, R2, [
    {el: trans(use1), f: function () { console.log("1"); }, disabled: true},
    {el: trans(use2), f: function () { console.log("2"); }},
    {el: svg.rect(18,18), f: function () { console.log("3"); }},
    {el: svg.circle(18,18).style( {fill: "blue" }), f: function () { console.log("4"); }},
    {el: svg.circle(18,18).style( {fill: "red" }), f: function () { console.log("5"); }}
  ]);

  halo.pos(X,Y);

})();
***/
