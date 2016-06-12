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

  // Note: if using a bold stroke on the symbol, even that will be cut out for negative X/Y areas, so better give some
  //    margin.
  //
  var MARGIN= 5;

  var SCALE=1.7;    // tbd. 1 when done

  // Define the petals' form
  //
  // Note: The symbol needs to be defined completely in the positive x/y quadrant; the rest is not going to be visible.
  //
  var R1x=SCALE*12,    // radius of the petal's end (semicircle)
    R1y=SCALE*10,
    R2= SCALE*50,     // radius of the inner parts of the petal (> R1)
    A= SCALE*5;      // distance of the petal's start from the center

  var drawPetal = function (sym) {   // (SvG.Symbol) ->
    var alpha = Math.asin( (R2-R1y)/R2 );
    var x = Math.cos(alpha) * R2;   // length from center of 'R1' towards center of all petals

    sym.path( "M"+(MARGIN+A)+","+(MARGIN+R1y)+
      "a"+R2+","+R2+",0,0,1,"+x+","+(-R1y)+    // upper long part of petal
      "a"+R1x+","+R1y+",0,0,1,"+0+","+(2*R1y)+   // end semi-circle
      "a"+R2+","+R2+",0,0,1,"+(-x)+","+(-R1y)+    // lower long part of petal
      "z");

    /* debug
    sym.circle(20).center( 0,0 ).addClass("debug");
    sym.circle(20).center( A,R1 ).addClass("debug");
    sym.circle(20).center( A+x,R1 ).addClass("debug");
    sym.line( A,R1, A+x,0 ).addClass("debug").stroke( {width:1} );
    */
  }

  var originX = MARGIN + 0,
    originY = MARGIN + R1y;

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

    use.style( "fill", color );

    // Debugging box around
    //
    if (false) {  // DEBUG
      var alpha = Math.asin( (R2-R1y)/R2 );
      var x = Math.cos(alpha) * R2;   // length from center of 'R1' towards center of all petals

      parent.rect( x+R1x, 2*R1y ).move(A+50-originX,50-originY).addClass("debug");
    }

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

  var svg = SVG("cradle");

  // Even the petals both sides of vertical axis
  //
  var X= 200,
    Y= 120,
    GAP_DEG= 25,
    START_DEG = -90 - (colors.length-1)/2 * GAP_DEG;    // angle of the first petal

  colors.forEach( function (color,i) {
    //console.log(color);

    new GxPetal(svg,color).pos(X,Y).rotDeg(START_DEG+i*GAP_DEG);
  } );
})();

