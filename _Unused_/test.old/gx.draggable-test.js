/*
* gx.draggable-test.js
*/
/*global: SVG, svg, assert, describe, it, beforeEach, afterEach*/
/*jshint devel: true */

chai.should();

describe('gx.draggable', function () {

  var DEG2RAD = Math.PI / 180.0;

  beforeEach(function () {
    svg.clear();
  });
  afterEach(function () {
  });

  var SIDE= 30;

  var r;
  function create() {
    return svg.gx( r= svg.rect(SIDE,SIDE) )
            .origin( SIDE/2, SIDE/2 );
  }

  it ('should be possible to drag a\'Gx\'', function () {
    var X= 100,
      Y= 100,
      DX= 34,
      DY= 56;

    var gx= create().pos(X,Y);

    // Make it draggable
    //
    // Note: This gets exercised also if manually dragging the element, after tests.
    //
    gx.draggable( function(x,y) {
      //console.log( "Dragging", x,y );
    });

    r.simulateDrag(DX,DY);

    // The dispatched events seem to be acted upon right away: no need for asynchronic waiting here.

    var o= r.transformBack( r.cx(), r.cy() );

    o.x.should.be.closeTo( X+DX, 0.01 );
    o.y.should.be.closeTo( Y+DY, 0.01 );
  });

  it ('should be possible to drag it (when rotated)', function () {
    var X= 100,
      Y= 100,
      DX= 34,
      DY= 56,
      DEG= 15;

    var gx= create().pos(X,Y).rotDeg(DEG);

    // Make it draggable
    //
    gx.draggable( function(x,y) {
      //console.log( "Dragging", x,y );
    });

    r.simulateDrag(DX,DY);

    // The dispatched events seem to be acted upon right away: no need for asynchronic waiting here.

    var o= r.transformBack( r.cx(), r.cy() );

    o.x.should.be.closeTo( X+DX, 0.01 );
    o.y.should.be.closeTo( Y+DY, 0.01 );
  });

});

