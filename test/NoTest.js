/*global: SVG, assert, describe, it*/
/*jshint devel: true */

// References:
//    'Should' style of Chai -> http://chaijs.com/guide/styles/
//    Phantomjs, Mocha and Chai for functional testing -> http://doublenegative.com/phantomjs-mocha-and-chai-for-functional-testing/

mocha.ui('bdd');

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

    var svg = SVG( document.body );   // just append the SVG to the body
    var rect= svg.rect(SIDE,SIDE).translate(-SIDE/2,-SIDE/2).move(X,Y).rotate(45);

    var box = (function() {    // get the bounding box, relative to origin of the SVG element
      var rbox= rect.rbox();

      // In browser, this is 150
      // In command line testing, it's 60
      //
      var OFFSET_Y = svg.native().offsetTop;

      rbox.y -= OFFSET_Y;
      rbox.y2 -= OFFSET_Y;
      rbox.cy -= OFFSET_Y;

      return rbox;
    })();

    (box.x).should.be.closeTo( X-T, 0.01 );
    (box.y).should.be.closeTo( Y-T, 0.01 );
    (box.width).should.be.closeTo(2*T, 0.01);
    (box.height).should.be.closeTo(2*T, 0.01);
  });
});