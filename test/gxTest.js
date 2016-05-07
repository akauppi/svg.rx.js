/*
* test-gx.js
*/
/*global: SVG, svg, assert, describe, it, beforeEach, afterEach*/
/*jshint devel: true */

var assert = chai.assert;
chai.should();

describe('gx', function () {    // Test all 'gx' operations

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

  it ('should be possible to create a \'gx\' and set its origin', function () {
    create();

    //svg.rect(SIDE,SIDE).move(0,0).addClass("debug").front();

    var sbox= r.sbox();

    //console.log("sbox", sbox);

    sbox.x.should.be.closeTo( -SIDE/2, 0.01 );
    sbox.y.should.be.closeTo( -SIDE/2, 0.01 );
  });

  it ('should be moveable', function () {
    var X= 200,
      Y= 100;
    create().pos(123,456).pos(X,Y);   // only the last '.pos' should matter

    var sbox= r.sbox();
    sbox.x.should.be.closeTo( X -SIDE/2, 0.01 );
    sbox.y.should.be.closeTo( Y -SIDE/2, 0.01 );
  });

  it ('should be possible to read the position', function () {    // note: '.relpos' may use this (so test this first)
    var X= 100, Y= 200;
    var gx= create().pos(X,Y);

    var o= gx.pos();

    o.x.should.be.closeTo( X, 0.01 );
    o.y.should.be.closeTo( Y, 0.01 );
  });

  xit ('should be relatively moveable', function () {
    var X= 100,
      Y= 100,
      DX= 20,
      DY= 10;
    create().pos(X,Y).relpos(DX/2,DY/2).relpos(DX/2,DY/2);   // let's see that the moves are additive

    var sbox= r.sbox();
    sbox.x.should.be.closeTo( X+ DX -SIDE/2, 0.01 );
    sbox.y.should.be.closeTo( Y+ DY -SIDE/2, 0.01 );
  });

  xit ('should be rotatable', function () {
    var DEG= 15;
    create().rotDeg(123).rotDeg(DEG);   // only the last call matters

    var sbox= r.sbox();
    sbox.x.should.be.closeTo( 999, 0.01 );
    sbox.y.should.be.closeTo( 999, 0.01 );
  });

  xit ('should be possible to read the position (after rotation)', function () {
    var X= 100, Y= 200;
    var gx= create().pos(X,Y).rotDeg(12);   // rotation shouldn't matter

    var o= gx.pos();

    o.x.should.be.closeTo( X, 0.01 );
    o.y.should.be.closeTo( Y, 0.01 );
  });

  xit ('should be possible to read the rotation', function () {
    var X= 100, Y= 200;
    var DEG= 123;
    var gx= create().pos(X,Y).rotDeg(DEG);

    var deg= gx.rotDeg();
    deg.should.be.closeTo( DEG, 0.01 );
  });

  xit ('should be possible to subscribe to moves', function () {

    // tbd
  });

  xit ('should be possible to read the rotation', function () {
    var DEG= 25;
    var gx= create().rotDeg(DEG);

    var deg= gx.rotDeg();

    deg.should.be.closeTo( DEG, 0.01 );
  });

  xit ('should be possible to subscribe to rotations', function () {

    // tbd
  });
});
