/*
* demo/halo.js
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
    R2 = 70,
    X= 100,
    Y= 75;

  // Note: Plain path does not change position like when it's placed in a group. Why not? AKa100716
  //
  var arrowRight = svg.group()
    .path("M16.711 8.29l-6-5.996c-0.391-0.391-1.026-0.391-1.417 0s-0.391 1.025 0 1.417l4.293 4.29h-11.59c-0.553 0-1.001 0.448-1.001 1s0.448 1 1.001 1h11.59l-4.292 4.29c-0.391 0.391-0.391 1.025 0.001 1.417s1.026 0.391 1.417 0l6-5.997c0.196-0.196 0.294-0.453 0.294-0.71s-0.097-0.514-0.294-0.71z")
    .translate(-9,-9);

  //var arrowLeft = arrowRight.clone().scale(-1,1);

  var trash = svg.group();
    //
    trash.path( "M17 5h-4v-3c0-0.552-0.448-1-1-1h-6c-0.552 0-1 0.448-1 1v3h-4c-0.552 0-1 0.448-1 1v1h2v9c0 0.552 0.448 1 1 1h12c0.552 0 1-0.448 1-1v-9h2v-1c0-0.552-0.448-1-1-1zM7 3h4v2h-4v-2zM14 15h-10v-8h10v8z" )
    trash.path( "M6.5 13h1c0.276 0 0.5-0.224 0.5-0.5v-3c0-0.276-0.224-0.5-0.5-0.5h-1c-0.276 0-0.5 0.224-0.5 0.5v3c0 0.276 0.224 0.5 0.5 0.5z" )
    trash.path( "M10.5 13h1c0.276 0 0.5-0.224 0.5-0.5v-3c0-0.276-0.224-0.5-0.5-0.5h-1c-0.276 0-0.5 0.224-0.5 0.5v3c0 0.276 0.224 0.5 0.5 0.5z" )
    trash.translate(-9,-9);

  var letter = svg.path("M512 96h-448c-17.672 0-32 14.328-32 32v320c0 17.672 14.328 32 32 32h448c17.672 0 32-14.328 32-32v-320c0-17.672-14.328-32-32-32zM467.781 160l-179.781 122.602-179.781-122.602h359.562zM480 400c0 8.836-7.156 16-16 16h-352c-8.844 0-16-7.164-16-16v-171.602l175.906 119.141c4.969 2.977 10.532 4.461 16.094 4.461s11.125-1.484 16.094-4.461l175.906-119.141v171.602z")
    .scale(18/512, 0,0)
    .translate(-28,-32);    // tbd. Why is this needed? Places the icon suitably

  var widthDeg = 50;

  var halo = svg.gxHalo(R1, R2, widthDeg, [
    {el: arrowRight, f: function () { console.log("1"); }, _disabled: Rx.Observable.from([true]), upright: true },
    {el: trash, el2: letter, f: function () { console.log("2"); }, upright: true },
    {el: svg.rect(18,18).translate(-9,-9), f: function () { console.log("3"); }, upright: true },
    {el: svg.circle(18,18).translate(-9,-9).style( {fill: "blue" }), f: function () { console.log("4"); this.toggleClass("selected"); }, flash: false},
    {el: svg.circle(18,18).translate(-9,-9).style( {fill: "red" }), f: function () { console.log("5"); }}
  ]);

  halo.pos(X,Y);

  // Check that icons remain upright even when rotated
  //
  //halo.rotDeg(45);

  // Add a rim that can be used for interactive rotation
  //
  var rim = svg.circle(2*R2).translate(-R2,-R2).move(X,Y).addClass("rim").back();
    //
    // This clipped the wrong way (wanted to clip the smaller circle out). AKa100716
    //rim.clipWith( svg.circle(2*R1).move(X,Y) );

  svg.circle(2*R1).center(X,Y).style({ fill: "purple"}).front();

  rim.rx_draggable().subscribe( function (dragObs) {
    var preDeg = halo.rotDeg();    // keep initial rotation
    console.log(preDeg);

    // tbd. Should make a simpler rotational dragging API, saying which coordinate we wish to rotate around. AKa100716
    //
    // tbd. This does not work exactly as we'd like, but enough to test stuff anyways. AKa100716
    //
    dragObs.subscribe(
      function (o) {    // ({x: Number, y: Number}) ->
        console.log( "Dragging: "+ o.x + " "+ o.y );

        var rad = Math.atan2(o.y,o.x);
        halo.rotDeg(/*preDeg +*/ rad * RAD2DEG);
      },
      null,   // error handling
      null    // end of drag
    );
  } );

  rotDeg_obs = halo.obsRotDeg();
})();

/*
* Place symbols in squares and see how they would rotate (they should rotate in place).
*/
(function() {
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
      .translate(-9,-9)

  //console.log( arrowRight.bbox() );   // { x: 1, y: 2: width: 16, height: 14, ... }

  // Possible svg.js BUG:
  //    Adding 'cx' to 'scaleX' does not actually seem to matter. svg.js docs say it should. AKa130716
  //    -> https://github.com/wout/svg.js#transform
  //
  //    Similarily, also mixing 'rotation' and 'cx' or 'cy' (on a 'use' element) seems to ignore the 'cx' and 'cy'.
  //
  var arrowLeft = arrowRight.clone().translate(-9,-9).scale(2.0, 1.0);    // transform( { scaleX: 2.0 } );

  console.log( arrowLeft.bbox(), arrowLeft.x(), arrowLeft.y(), arrowLeft.width(), arrowLeft.height(), arrowLeft.cx() );

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

  // tbd.
  //
  var letter = svg.path("M512 96h-448c-17.672 0-32 14.328-32 32v320c0 17.672 14.328 32 32 32h448c17.672 0 32-14.328 32-32v-320c0-17.672-14.328-32-32-32zM467.781 160l-179.781 122.602-179.781-122.602h359.562zM480 400c0 8.836-7.156 16-16 16h-352c-8.844 0-16-7.164-16-16v-171.602l175.906 119.141c4.969 2.977 10.532 4.461 16.094 4.461s11.125-1.484 16.094-4.461l175.906-119.141v171.602z")
    .width(18).height(18)
    .translate(-9,-9);

  var square = svg.rect(18,18).translate(-9,-9);

  // Should figure how to load an outside icon to specific measures, and moveable. tbd. AKa100716
  //
  var use1= svg.use("icon-forward", "halo-icons.svg");
  var use2= svg.use("icon-letter", "halo-icons.svg");

  use1.attr( {width: 18, height:18} ).translate(-9,-9);
  use2.attr( {width: 18, height:18} ).translate(-9,-9);

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

  // Tie to the rim's rotational stream
  //
  rotDeg_obs.subscribe( function (deg) {
    els.forEach( function (el,i) {
      el.rotate(deg);   // follow the rotation, around their origin
    } );
  } );
})();

/*
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
