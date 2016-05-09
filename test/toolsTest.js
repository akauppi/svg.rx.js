/*global: SVG, svg, assert, describe, it*/
/*jshint devel: true */

// References:
//    'Should' style of Chai -> http://chaijs.com/guide/styles/

var assert = chai.assert;
chai.should();

describe('testing tools', function () {    // sample on how to test positions

  var DEG2RAD = Math.PI / 180.0;

  beforeEach(function () {
    //paper.clear();
  });
  afterEach(function () {
  });

  it('a point\'s position in SVG coordinates should be reachable - even when rotated', function () {
    var SIDE = 30;
    var X= 100;
    var Y= 50;
    var DEG= 25;    // within 0..90

    var R= Math.sqrt(SIDE*SIDE/2);

    var A= Math.cos( (45+DEG)*DEG2RAD ),    // how much top-left left of X (top-right above Y, ...)
      B= Math.sin( (45+DEG)*DEG2RAD )       // how much top-left above Y (top-right right of X, ...)

    var rect= svg.rect(SIDE,SIDE).translate(-SIDE/2,-SIDE/2).move(X,Y).rotate(DEG);

    // The corners should be at:
    //  top left: (X-A*R, Y-B*R)
    //  bottom right: (X+B*R, Y+A*R)

    var o = rect.transformBack(rect.x(), rect.y());

    (o.x).should.be.closeTo( X-A*R, 0.01 );
    (o.y).should.be.closeTo( Y-B*R, 0.01 );
  });
});