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

  var svg = SVG("cradle");

  //var gx = svg.rx.gx( svg.rect(10,10) ).translate(5,5);
  //gx.pos(200,100);

  var rect= svg.rect(SIDE,SIDE).translate(-SIDE/2,-SIDE/2).move(200,100).rotate(45);

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

  // offset of the SVG (needs to be added to use '.elementFromPoint()'
  //
  var ox = svg.native().offsetLeft;
  var oy = svg.native().offsetTop;

  assert( document.elementFromPoint(ox+200, oy+100) === rect.native() );
  assert( document.elementFromPoint(ox+200-SIDE/2, oy+100) === rect.native() );
  assert( document.elementFromPoint(ox+200-SIDE/2, oy+100+SIDE/2) !== rect.native() );
  assert( document.elementFromPoint(ox+200-SIDE/2, oy+100-SIDE/2) !== rect.native() );

  // ...

  var m= rect.screenCTM().inverse();
  console.log(m);

  // (0,0) should be ...
  // (10,10) should be ...
  //
  var t= SIDE* Math.sqrt(0.5);

  //assert.closeTo( top, 100-t, 0.01 );
  //assert.closeTo( bottom, 100+t, 0.01 );
  //assert.closeTo( left, 200-t, 0.01 );
  //assert.closeTo( right, 200+t, 0.01 );

}());
