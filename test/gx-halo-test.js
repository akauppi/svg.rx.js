/*
* gx-halo-test.js
*/
/*global: SVG, svg, assert, describe, it, beforeEach, afterEach*/
/*jshint devel: true */

chai.should();

describe('gx-halo', function () {

  var DEG2RAD = Math.PI / 180.0;

  beforeEach(function () {
    svg.clear();
  });
  afterEach(function () {
  });

  var SIZE= 50;
  //var SYMBOLS = [svg., ... ];

  /*** tbd.
  var create = function () {    // () -> GxHalo
    var o= svg.gxHalo( {
      r: SIZE,
      symbols: ...
    } );

    return o;
  }
  ***/

  // Ensure we actually have access to the symbols
  //
  var symForward= svg.symbol();     // tbd. get these from a file
  var symTrash= svg.symbol();

  //var symTrash =

  assert( symForward );

  // tbd.
  xit ('should be possible to create a \'halo\' menu, using symbols', function () {

    //val gxHalo= create();
  });

  // tbd.
  xit ('should be possible to select a menu entry, by clicking - and the menu should hide after the click', function () {

    // Halo should be initially hidden

  });

});
