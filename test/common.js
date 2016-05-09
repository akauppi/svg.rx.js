/*
* common.js
*
* Tools common to all the tests
*/
/*global: SVG, assert*/
/*jshint devel: true */

// Create just one SVG cradle (not a new one to each test)
//
var svg = SVG( document.body );   // just append the SVG to the body

SVG.extend( SVG.Element, {

  /*
  * Transform a coordinate from some SVG element to the coordinates of the enclosing SVG.Doc.
  */
  transformBack: function (x,y) {    // (Num,Num) -> {x:Num,y:Num}
    var m= this.ctm();

    // This should take into account also rotation.
    //
    // See -> http://stackoverflow.com/questions/18554224/getting-screen-positions-of-d3-nodes-after-transform/18561829
    //
    return {
      x: m.e + x*m.a + y*m.c,
      y: m.f + x*m.b + y*m.d
    }
  }
});
