/*
* test-gx.js
*/
/*global: SVG, svg, assert, describe, it, beforeEach, afterEach*/
/*jshint devel: true */

var assert = chai.assert;
chai.should();

describe('gx', function () {    // Test all 'gx' operations

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

  it ('should be possible to change the origin', function () {
    var X= 200,
      Y= 100,
      OX= 10,
      OY= 10;
    var gx= create().pos(X,Y).origin(OX,OY);

    var sbox= r.sbox();
    sbox.x.should.be.closeTo( X-OX, 0.01 );
    sbox.y.should.be.closeTo( Y-OY, 0.01 );

    // position should still be intact
    //
    var o= gx.pos();
    o.x.should.be.closeTo( X, 0.01 );
    o.y.should.be.closeTo( Y, 0.01 );
  });

  it ('should be rotatable', function () {
    var X= 200,
      Y= 100;
    var DEG= 15;    // 0..90
    create().pos(X,Y).rotDeg(123).rotDeg(DEG);   // only the last angle matters (non-relative)

    svg.rect(SIDE,SIDE).center(X,Y).rotate(DEG,X,Y).addClass("debug");

    var R= Math.sqrt(SIDE*SIDE/2);
    var B= Math.sin( (45+DEG)*DEG2RAD )

    var o= r.sbox();
    (o.x).should.be.closeTo( X-B*R, 0.01 );
    (o.y).should.be.closeTo( Y-B*R, 0.01 );
    (o.x2).should.be.closeTo( X+B*R, 0.01 );
    (o.y2).should.be.closeTo( Y+B*R, 0.01 );
  });

  it ('should be possible to read the rotation', function () {
    var X= 100, Y= 200;
    var DEG= 123;
    var gx= create().pos(X,Y).rotDeg(DEG);

    var deg= gx.rotDeg();
    deg.should.be.closeTo( DEG, 0.01 );
  });

  it ('order of movement and rotation should not matter', function () {
    var X= 200,
      Y= 100;
    var DEG= 15;    // 0..90
    create().rotDeg(DEG).pos(X,Y);   // rotate first, move then

    svg.rect(SIDE,SIDE).center(X,Y).rotate(DEG,X,Y).addClass("debug");

    var R= Math.sqrt(SIDE*SIDE/2);
    var B= Math.sin( (45+DEG)*DEG2RAD )

    var o= r.sbox();
    (o.x).should.be.closeTo( X-B*R, 0.01 );
    (o.y).should.be.closeTo( Y-B*R, 0.01 );
    (o.x2).should.be.closeTo( X+B*R, 0.01 );
    (o.y2).should.be.closeTo( Y+B*R, 0.01 );
  });

  it ('should be possible to read the position (after rotation)', function () {
    var X= 100, Y= 200;
    var gx= create().pos(X,Y).rotDeg(12);   // rotation shouldn't matter

    var o= gx.pos();

    o.x.should.be.closeTo( X, 0.01 );
    o.y.should.be.closeTo( Y, 0.01 );
  });

  it ('should be possible to change the origin (after rotation)', function () {
    var X= 200,
      Y= 100,
      OX= 10,
      OY= 10,
      DEG= 15;

    var gx= create().pos(X,Y).rotDeg(DEG).origin(OX,OY);
    var sbox= r.sbox();

    var gx2= create().origin(OX,OY).pos(X,Y).rotDeg(DEG);   // for control
    var sbox2= r.sbox();

    sbox.x.should.be.closeTo( sbox2.x, 0.01 );
    sbox.y.should.be.closeTo( sbox2.y, 0.01 );
    sbox.x2.should.be.closeTo( sbox2.x2, 0.01 );
    sbox.y2.should.be.closeTo( sbox2.y2, 0.01 );
  });

  xit ('should be possible to subscribe to moves', function () {

    // tbd
  });

  xit ('should be possible to subscribe to rotations', function () {

    // tbd
  });
});

