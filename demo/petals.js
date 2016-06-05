/*
* demo/petals.js
*/
/*jshint devel: true */
/*globals assert, Gx */

var RAD2DEG = (180.0 / Math.PI);

// For now, exposing this to the demo code. Eventually, only 'svg.petals()' or something (the group of many petals)
// will be exposed. AKa050616
//
var GxPetal;

/*
* '.gxPetal' component
*
* Draws and handles one petal, set to represent a certain color.
*/
(function () {
  "use strict";

  assert(Gx);

  // Define the petals' form
  //
  // Note: The symbol needs to be defined completely in the positive x/y quadrant; the rest is not going to be visible.
  //
  var R1=10,    // radius of the petal's end (semicircle)
    R2= 50,     // radius of the inner parts of the petal (> R1)
    D= 60;      // distance of the petal from the center

  var drawPetal = function (sym) {   // (SvG.Symbol) ->
    var alpha = Math.asin( (R2-R1)/R2 );
    var x = Math.cos(alpha) * R2;   // length from center of 'R1' towards center of petals

    // 'D-x' = beginning of the petal

    sym.path( "M"+(D-x)+","+R1+
      "a"+R2+","+R2+",0,0,0,"+x+","+(-R1)+    // upper long part of petal
      "a"+R1+","+R1+",0,0,0,"+0+","+(2*R1)+   // end semi-circle
      "a"+R2+","+R2+",0,0,0,"+(-x)+","+R1+    // lower long part of petal
      "z");
  }

  var originX = 0,
    originY = R1;

  //--- GxPetal ---
  //
  // Use:
  //    new GxPetal(parent, color)
  //
  // ._color: String    Color the petal is presenting
  //
  // .xxx()        Methods (tbd.)
  //
  // Selection is marked by ".selected" class
  //
  GxPetal = function (parent, color) {    // (SVG.Container, String) ->
    var self= this;

    // Create the symbol, once
    //
    var use = parent.use( Gx.cache( parent, "GxPetal.symbol", function (svg) {
      var sym = svg.symbol();
      drawPetal(sym);
      return sym;
    } ) );

    Gx.call( this, parent, use, "gxPetal" );

    this.origin( originX, originY );

    this._color = color;

    // tbd. Add touch / click handler, for making the petal grow/shrink.

    this.clickable( function () {   // clicked
      self.toggleClass("selected");
    });
  };

  GxPetal.prototype = Object.create(Gx.prototype);

  // No methods, for now

})();

/*
* Actual demo
*/
(function() {
  "use strict";

  // See -> http://www.w3schools.com/colors/colors_names.asp
  //
  var colors = [
    "rebeccapurple",
    "powderblue",
    "yellow",
    "saddlebrown",
    "springgreen",
    "thistle",
    "lightsalmon",
    "mediumorchid",
    "chartreuse",
    "burlywood",
    "cornflowerblue"
  ];

  var X= 100,
    Y= 50,
    GAP_DEG= 3,
    START_DEG = -45 + (colors.length-1)/2 * GAP_DEG;    // angle of the first petal

  var svg = SVG("cradle");

  colors.forEach( function (color,i) {
    console.log(color);

    new GxPetal(svg,color).pos(X,Y).rotDeg(START_DEG+i*GAP_DEG);
  } );
})();

