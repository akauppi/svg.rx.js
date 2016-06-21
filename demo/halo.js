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
    Y= 50;

  var svg = SVG( document.body );

  // Refer to the symbols in an external SVG file
  //
  var use1= svg.use("icon-forward", "halo-icons.svg");
  var use2= svg.use("icon-trash", "halo-icons.svg");

  var trans = function (el) {   // SVG.Use -> SVG.Use (same)
    el.translate(9,9);    // make the center its (0,0); we know the viewbox is 18,18
    el.scale(0.06);
    return el;
  }

  // tbd. using 'use' as elems doesn't seem to work - why don't they move? AKa210616

  var halo = svg.gxHalo(R1, R2, [
    {el: trans(use1), f: function () { console.log("forward"); }},
    {el: trans(use2), f: function () { console.log("trash"); }},
    {el: svg.rect(18,18), f: function () { console.log("forward"); }},
    {el: svg.rect(18,18).style( {fill: "blue" }), f: function () { console.log("forward"); }},
    {el: svg.rect(18,18).style( {fill: "red" }), f: function () { console.log("forward"); }}
  ]);

  halo.pos(X,Y);

  // Show one menu on the screen, to begin with. When clicked, it shall close.
  //
  // Clicking on the canvas moves the menu there shows the menu, again.

  svg.rx_draggable().subscribe( function (dragObs) {
  } );

})();

