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

/*
* Provide the bounding box of an element, within the SVG cradle.
*
* Note: none of the svg.js methods seemed to actually provide this ('.box', '.tbox', '.rbox').
*     tbd. We could of course extend our own '.sbox' to all elements.
*/
function sbox(el) {    // get the bounding box, relative to origin of the SVG element
  var o= el.rbox();

  // In browser, this is 150
  // In command line testing, it's 60
  //
  var OFFSET_Y = svg.native().offsetTop;

  o.y -= OFFSET_Y;
  o.y2 -= OFFSET_Y;
  o.cy -= OFFSET_Y;

  return o;
}
