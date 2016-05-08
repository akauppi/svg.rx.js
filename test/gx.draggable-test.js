/*
* gx.draggable-test.js
*/
/*global: SVG, svg, assert, describe, it, beforeEach, afterEach*/
/*jshint devel: true */

var assert = chai.assert;
chai.should();

describe('gx.draggable', function () {    // test 'gx.draggable.js' features

  var DEG2RAD = Math.PI / 180.0;

  beforeEach(function () {
    svg.clear();
  });
  afterEach(function () {
  });

  var SIDE= 30;

  var r;
  function create() {
    return svg.gx( function(g) { r= g.rect(SIDE,SIDE); } )
            .origin( SIDE/2, SIDE/2 );
  }

  it ('should be possible to drag a\'Gx\'', function () {
    var X= 200,
      Y= 100,
      X_END= X+12,
      Y_END= Y+34;

    var gx= create().pos(X,Y);

    // Make it draggable
    //
    gx.draggable( function(x,y) {
      console.log( "Dragging", x,y );
    });

    /***
    // Simulate dragging to (X_END, Y_END)
    //
    var canceled = !r.dispatchEvent(
      new MouseEvent( 'mousedown', {
        'view': window,
        'bubbles': true,
        'cancelable': true
      });
    );

    var canceled = !r.dispatchEvent(
      new MouseEvent( 'mousemove', {
        // ...
      });
    );

    var canceled = !r.dispatchEvent(
      new MouseEvent( 'mouseend', {
        // ...
      });
    );
    ***/
    var sbox= r.sbox();

    sbox.x.should.be.closeTo( X_END, 0.01 );
    sbox.y.should.be.closeTo( Y_END, 0.01 );
  });

  xit ('should be possible to drag it (when rotated)', function () {

    // tbd
  });

  xit ('should be possible to subscribe to moves', function () {

    // tbd
  });

  xit ('should be possible to subscribe to rotations', function () {

    // tbd
  });
});

