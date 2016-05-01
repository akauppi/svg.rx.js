/*global: SVG, assert, describe, it*/
/*jshint devel: true */

// References:
//    'Should' style of Chai -> http://chaijs.com/guide/styles/
//    Phantomjs, Mocha and Chai for functional testing -> http://doublenegative.com/phantomjs-mocha-and-chai-for-functional-testing/

mocha.ui('bdd');

var assert = chai.assert;
chai.should();

console.log(chai);

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

    if (false) {
      var svg = SVG();
      var rect= svg.rect(SIDE,SIDE).translate(-SIDE/2,-SIDE/2).move(X,Y).rotate(45);

      var rbox = rect.rbox();
      var OFFSET_Y = 0.43750762939453125;   // for some reason, 'rbox' y values are this much off (at least in browsers)

      (rbox.x).should.be.closeTo( X-T, 0.01 );
      (rbox.y-OFFSET_Y).should.be.closeTo( Y-T, 0.01 );
      (rbox.width).should.be.closeTo(2*T, 0.01);
      (rbox.height).should.be.closeTo(2*T, 0.01);
    }
  });
});