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

  it('an element\'s bounding box should be testable, within the SVG coordinates (also after rotation)', function () {

    var SIDE = 30;
    var X= 100;
    var Y= 50;
    var DEG= 25;    // within 0..90

    var R= Math.sqrt(SIDE*SIDE/2);

    // Shift of corners
    //
    //var A= Math.cos( (45+DEG)*DEG2RAD ),    // how much top-left left of X (top-right above Y, ...)
    var B= Math.sin( (45+DEG)*DEG2RAD )       // how much top-left above Y (top-right right of X, ...)

    //console.log("A",A);
    console.log("B",B);

    var rect= svg.rect(SIDE,SIDE).translate(-SIDE/2,-SIDE/2).move(X,Y).rotate(DEG);

    svg.rect(SIDE,SIDE).center(X,Y).rotate(DEG).addClass("debug");

    // Visually close to (95,32) (top left corner)

    // The corners should be at:
    //  top left: (X-A*R, Y-B*R)
    //  bottom right: (X+B*R, Y+A*R)

    // Note: '.sbox()' provides the overall bounding box within the SVG, not where an individual corner ended up.
    //
    var o = rect.sbox();

    (o.x).should.be.closeTo( X-B*R, 0.01 );
    (o.y).should.be.closeTo( Y-B*R, 0.01 );
    (o.x2).should.be.closeTo( X+B*R, 0.01 );
    (o.y2).should.be.closeTo( Y+B*R, 0.01 );
  });
});