/*
* demo/halo.js
*/
/*jshint devel: true */
/*globals assert, Gx */

var RAD2DEG = (180.0 / Math.PI);

/*
* Halo demo
*/
(function() {
  "use strict";

  var R1 = 20,
    R2 = 50,
    X= 100,
    Y= 55;

  var svg = SVG( document.body );

  /*
  * Make a group with a rectangle and the symbol fitting inside it.
  */
  /*** disabled
  (function () {
    var g = svg.group();
    g.rect(20,20).center(0,0).addClass("debug");

    var use = g.use("icon-forward", "halo-icons.svg");
    //use.scale(0.06, 0,0);

    console.log(use.x(), use.y());

    g.move(200,50);
  })();
  ***/

  /*** Disabled: 'use' gave too big placement of the symbols, and they were not coming on top of menu arc, either,
  *     like rect's do. Trying another approach.
  *
  // Refer to the symbols in an external SVG file
  //
  var use1= svg.use("icon-forward", "halo-icons.svg");
  var use2= svg.use("icon-trash", "halo-icons.svg");

  var trans = function (el) {   // SVG.Use -> SVG.Use (same)
    el.translate(9,9);    // make the center its (0,0); we know the viewbox is 18,18
    el.scale(0.06);

    //console.log( el.width(), el.height() );   // 0,0 ???

    // Note: If we pass 'use' entities to the 'svg.gxHalo()' they won't be properly rotated (actually - translated).
    //    Wrap in a group. AKa210616
    //
    var g= el.parent().group();
    g.add(el);

    // tbd. Why do the rect end up elsewhere than the symbols? AKa220616
    g.rect(20,20).center(0,0).addClass("debug");

    return g;
  }
  ***/

  // Don't use 'use'. Just define the icons here. #temporary
  //
  var use1 = (function () {     // () -> SVG.Element
    return svg.path("M16.711 8.29l-6-5.996c-0.391-0.391-1.026-0.391-1.417 0s-0.391 1.025 0 1.417l4.293 4.29h-11.59c-0.553 0-1.001 0.448-1.001 1s0.448 1 1.001 1h11.59l-4.292 4.29c-0.391 0.391-0.391 1.025 0.001 1.417s1.026 0.391 1.417 0l6-5.997c0.196-0.196 0.294-0.453 0.294-0.71s-0.097-0.514-0.294-0.71z");
  })();

  var use2 = svg.group();
    //
    use2.path( "M17 5h-4v-3c0-0.552-0.448-1-1-1h-6c-0.552 0-1 0.448-1 1v3h-4c-0.552 0-1 0.448-1 1v1h2v9c0 0.552 0.448 1 1 1h12c0.552 0 1-0.448 1-1v-9h2v-1c0-0.552-0.448-1-1-1zM7 3h4v2h-4v-2zM14 15h-10v-8h10v8z" );
    use2.path( "M6.5 13h1c0.276 0 0.5-0.224 0.5-0.5v-3c0-0.276-0.224-0.5-0.5-0.5h-1c-0.276 0-0.5 0.224-0.5 0.5v3c0 0.276 0.224 0.5 0.5 0.5z" );
    use2.path( "M10.5 13h1c0.276 0 0.5-0.224 0.5-0.5v-3c0-0.276-0.224-0.5-0.5-0.5h-1c-0.276 0-0.5 0.224-0.5 0.5v3c0 0.276 0.224 0.5 0.5 0.5z" );

  // tbd. using 'use' as elems doesn't seem to work - why don't they move? AKa210616

  var halo = svg.gxHalo(R1, R2, [
    {el: /*trans(use1)*/ use1, f: function () { console.log("1"); }},
    {el: /*trans(use2)*/ use2, f: function () { console.log("2"); }},
    {el: svg.rect(18,18), f: function () { console.log("3"); }},
    {el: svg.rect(18,18).style( {fill: "blue" }), f: function () { console.log("4"); }},
    {el: svg.rect(18,18).style( {fill: "red" }), f: function () { console.log("5"); }}
  ]);

  halo.pos(X,Y);

  // Show one menu on the screen, to begin with. When clicked, it shall close.
  //
  // Clicking on the canvas moves the menu there shows the menu, again.

  svg.rx_draggable().subscribe( function (dragObs) {
  } );

})();

