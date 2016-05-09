/*
* gx-test.js
*/
/*global: SVG, svg, assert, describe, it, beforeEach, afterEach*/
/*jshint devel: true */

chai.should();

describe('gx', function () {    // Test 'gx.js' operations

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

    var o= r.transformBack( r.x(), r.y() );

    o.x.should.be.closeTo( -SIDE/2, 0.01 );
    o.y.should.be.closeTo( -SIDE/2, 0.01 );
  });

  it ('should be moveable', function () {
    var X= 200,
      Y= 100;
    create().pos(123,456).pos(X,Y);   // only the last '.pos' should matter

    var o= r.transformBack( r.x(), r.y() );
    o.x.should.be.closeTo( X -SIDE/2, 0.01 );
    o.y.should.be.closeTo( Y -SIDE/2, 0.01 );
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

    var o1= r.transformBack( r.x(), r.y() );
    o1.x.should.be.closeTo( X-OX, 0.01 );
    o1.y.should.be.closeTo( Y-OY, 0.01 );

    // position should still be intact
    //
    var o2= gx.pos();
    o2.x.should.be.closeTo( X, 0.01 );
    o2.y.should.be.closeTo( Y, 0.01 );
  });

  it ('should be rotatable', function () {
    var X= 200,
      Y= 100;
    var DEG= 15;    // 0..90
    create().pos(X,Y).rotDeg(123).rotDeg(DEG);   // only the last angle matters (non-relative)

    svg.rect(SIDE,SIDE).center(X,Y).rotate(DEG,X,Y).addClass("debug");

    var R= Math.sqrt(SIDE*SIDE/2),
      A= Math.cos( (45+DEG)*DEG2RAD ),
      B= Math.sin( (45+DEG)*DEG2RAD );

    var o1= r.transformBack( r.x(), r.y() );
    (o1.x).should.be.closeTo( X-A*R, 0.01 );
    (o1.y).should.be.closeTo( Y-B*R, 0.01 );

    var o2= r.transformBack( r.x()+SIDE, r.y()+SIDE );
    (o2.x).should.be.closeTo( X+A*R, 0.01 );
    (o2.y).should.be.closeTo( Y+B*R, 0.01 );
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

    var R= Math.sqrt(SIDE*SIDE/2),
      A= Math.cos( (45+DEG)*DEG2RAD ),
      B= Math.sin( (45+DEG)*DEG2RAD );

    var o1= r.transformBack( r.x(), r.y() );
    (o1.x).should.be.closeTo( X-A*R, 0.01 );
    (o1.y).should.be.closeTo( Y-B*R, 0.01 );

    var o2= r.transformBack( r.x()+SIDE, r.y()+SIDE );
    (o2.x).should.be.closeTo( X+A*R, 0.01 );
    (o2.y).should.be.closeTo( Y+B*R, 0.01 );
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
    var o1_tl= r.transformBack( r.x(), r.y() );
    var o1_br= r.transformBack( r.x()+SIDE, r.y()+SIDE );

    var gx2= create().origin(OX,OY).pos(X,Y).rotDeg(DEG);   // for control
    var o2_tl= r.transformBack( r.x(), r.y() );
    var o2_br= r.transformBack( r.x()+SIDE, r.y()+SIDE );

    o1_tl.x.should.be.closeTo( o2_tl.x, 0.01 );
    o1_tl.y.should.be.closeTo( o2_tl.y, 0.01 );
    o1_br.x.should.be.closeTo( o2_br.x, 0.01 );
    o1_br.y.should.be.closeTo( o2_br.y, 0.01 );
  });

  it ('should be possible to subscribe to moves', function () {
    var X=100, Y=150,
      X2= X+20, Y2= Y+20;

    var gx= create().pos(X,Y);

    var obs= gx.obsPos();   // observable of {x:Num,y:Num}

    // Note: Our 'obs' is a 'Subject' (not 'BehaviorSubject') so it's not caching the last value (not that we need that
    //      either, since it's askable as '.pos').

    var oLast;    // {x:Num,y:Num}
    obs.subscribe( function (o) {
      console.log( "notified of move", o.x, o.y );
      oLast= {x:o.x,y:o.y};
    } );

    // Move the 'gx' slightly
    //
    gx.pos(X2, Y2);

    oLast.x.should.be.closeTo( X2, 0.01 );
    oLast.y.should.be.closeTo( Y2, 0.01 );
  });

  it ('should be possible to subscribe to rotations', function () {
    var X=100, Y=150,
      DEG2= 30,
      DEG3= 60;

    var gx= create().pos(X,Y);

    var obs= gx.obsRotDeg();   // observable of Num

    var degLast;    // Num
    obs.subscribe( function (deg) {
      console.log( "notified of rotation", deg );
      degLast= deg;
    } );

    // Move the 'gx' slightly
    //
    gx.rotDeg(DEG2);
    gx.rotDeg(DEG3);

    degLast.should.be.closeTo( DEG3, 0.01 );
  });

});
