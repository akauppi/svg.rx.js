/*global: SVG, svg, assert, describe, it*/
/*jshint devel: true */

// References:
//    'Should' style of Chai -> http://chaijs.com/guide/styles/

var assert = chai.assert;
chai.should();

describe('just testing', function () {    // sample on how to test positions

  beforeEach(function () {
    //paper.clear();
  });
  afterEach(function () {
  });

  it('rect\'s position should be testable', function () {

    var SIDE = 10;
    var T= Math.sqrt( SIDE*SIDE/2 );
    var X= 100;
    var Y= 50;

    var rect= svg.rect(SIDE,SIDE).translate(-SIDE/2,-SIDE/2).move(X,Y).rotate(45);

    var box = sbox(rect);

    (box.x).should.be.closeTo( X-T, 0.01 );
    (box.y).should.be.closeTo( Y-T, 0.01 );
    (box.width).should.be.closeTo(2*T, 0.01);
    (box.height).should.be.closeTo(2*T, 0.01);
  });
});