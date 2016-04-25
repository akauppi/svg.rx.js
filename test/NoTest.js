
var assert = require('chai').assert;

describe('SVG.Rx', function() {
  describe('gx', function () {
    it('should be positionable by (Num,Num)', function () {

      var svg = SVG();
      var gx = svg.rx.gx( svg.rect(-10,-10,10,10) );

      gx.pos(200,100);

      assert
      assert.equal(-1, [1,2,3].indexOf(5));
      assert.equal(-1, [1,2,3].indexOf(0));
    });
  });
});