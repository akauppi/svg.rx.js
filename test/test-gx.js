/*
* test-gx.js
*/
/*global: SVG, svg, assert, describe, it, beforeEach, afterEach*/
/*jshint devel: true */

// References:
//    'Should' style of Chai -> http://chaijs.com/guide/styles/

var assert = chai.assert;
chai.should();

describe('gx', function () {    // sample on how to test positions

  beforeEach(function () {
    svg.clear();    // remove all elements (including a 'defs' in the first test)
  });
  afterEach(function () {
  });

  it('should get a rect', function () {
    var rect= svg.rect(10,10).move(50,50);

    console.log(svg.children().length);
    (svg.children().length).should.be.equal(1);
  });

  it('should get a circle', function () {
    var circle= svg.circle(20).move(100,50);

    console.log(svg.children());
    svg.children().length.should.be.equal(1);
  });
});