/*
* debug.js
*
* Just stuff for any experiments.
*/
/*jshint devel: true */

(function() {
  "use strict";
  var assert = chai.assert;

  var SIDE = 30;
  var T= Math.sqrt( SIDE*SIDE/2 );
  console.log("T:",T);

  var X = 200;
  var Y = 100;

  var svg = SVG("cradle");

  var rect= svg.rect(SIDE,SIDE).translate(-SIDE/2,-SIDE/2).move(X,Y).rotate(45);

  /***
  // '.tbox()' gives the bounding box, with transformations applied (ie. in screen coords):
  //
  //  {
  //    cx: Num,    // x + w/2
  //    cy: Num,    // y + h/2
  //    h: Num,
  //    w: Num,
  //    x: Num,
  //    x2: Num,    // x + w
  //    y: Num,
  //    y2: Num     // y + h
  //  }
  //
  // NOTE: Doesn't work after rotation, gives (334,-14) as 'cx','cy'
  //
  var tbox = rect.tbox();

  console.log(tbox);

  assert( tbox.cx === 200 );
  assert( tbox.cy === 100 );
  ***/

  /*
  * '.getBoundingClientRect()' gives what we want (screen coords of the element bounds, translations applied):
  *
  * <<
  *   bottom: 207.50857543945312      <<-- wrong (should be 100+7.07)
  *   height: 14.142120361328125
  *   left: 200.92893981933594        <<-- wrong (should be 200-7.07)
  *   right: 215.07107543945312       <<-- wrong (should be 200+7.07)
  *   top: 193.366455078125           <<-- wrong (should be 100-7.07)
  *   width: 14.142135620117188
  * <<
  * Try sending a click on the screen and see if the element catches it.
  *
  console.log( rect.native().getBoundingClientRect() );
  */

  /***
  * Poking works, but is a bit imprecice.
  *
  // offset of the SVG (needs to be added to use '.elementFromPoint()'
  //
  var ox = svg.native().offsetLeft;
  var oy = svg.native().offsetTop;

  assert( document.elementFromPoint(ox+200, oy+100) === rect.native() );
  assert( document.elementFromPoint(ox+200-SIDE/2, oy+100) === rect.native() );
  assert( document.elementFromPoint(ox+200-SIDE/2, oy+100+SIDE/2) !== rect.native() );
  assert( document.elementFromPoint(ox+200-SIDE/2, oy+100-SIDE/2) !== rect.native() );
  ***/

  var ox = svg.native().offsetLeft;
  var oy = svg.native().offsetTop;

  var m= rect.screenCTM().inverse();
  console.log(m);

  var m2 = rect.matrixify();
  console.log(m2);

  var rbox = rect.rbox();
  console.log("rbox:", rbox);

  svg.rect(rbox.width, rbox.height).translate( rbox.x, rbox.y ).addClass("debug");
  svg.plain("rbox").translate(X+2*T,Y).addClass("debug");

  // For some reason, the '.y' reported by '.rbox()' is systematically 0.43750762939453125 too big.
  //
  var OFFSET_Y = 0.43750762939453125;

  // (0,0) should be (ox+200, oy+100)
  // (10,10) should be (ox+200+T, oy+100+T
  //
  assert.closeTo( rbox.x, X-T, 0.01 );
  assert.closeTo( rbox.y-OFFSET_Y, Y-T, 0.01 );
  assert.closeTo( rbox.width, 2*T, 0.01 );
  assert.closeTo( rbox.height, 2*T, 0.01 );

}());
