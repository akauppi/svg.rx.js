/*
* gx.js
*/
/*jshint devel:true */

// Needed to be globally known so that 'gx.draggable.js' et.al. can extend it.
//
var Gx;

(function () {
  "use strict";

  assert(true);

  //--- Gx---
  //
  // ._g2: SVG.Group  Inner group. Origin translation and rotation happen for this group.
  // ._g: SVG.Group   Outer group. Positioning happens for this group.
  //
  // Note: It is unsure, whether use of two groups or handling one group and maintaining two matrices is the better
  //      approach, performance-wise. We can try these at some stage, if moving/rotating needs boosting. AKa080516
  //
  Gx = SVG.invent({
    // Initialize node
    create: function ( parent, populateF ) {    // ( SVG.Container, (SVG.Container) -> )
      //var self = this;

      var g = parent.group();
      var g2 = g.group();
      populateF(g2);

      this._g = g;
      this._g2 = g2;
    },

    // Add class methods
    extend: {
      // Set the origin for the contents of the 'Gx' (ie. affect the offset how it's shown). Changing the offset later
      // allows eg. wobbling of the entity; that's why we keep the option of changing the origin after creation open,
      // though it might not actually be needed. AKa080516
      //
      origin: function (x, y) {   // (Num, Num) -> this

        var deg= this._rotDeg();
        this._g2.rotate(0).translate(-x,-y).rotate(deg);    // works :)

        return this;
      },

      // Move the 'Gx', absolutely, or ask the position
      //
      // Note: Position is placed as to the origin of the group, so rotations do not matter (the group rotates around
      //      that origin).
      //
      pos: function(x,y) {   // (Num,Num) -> this or () -> {x:Num, y:Num}

        if (x === undefined) {
          return this._pos();
        } else {
          this._g.translate(x,y);
          return this;
        }
      },

      // Rotate the 'Gx', or ask the rotation
      //
      rotDeg: function(deg) {   // (Num) -> this or () -> Num
        if (deg === undefined) {
          return this._rotDeg();
        } else {
          this._g2.rotate(deg);     // replace earlier rotation (keep origin translation)
          return this;
        }
      },

      //--- Private methods ---

      _pos: function() {    // () -> {x:Num,y:Num}
        var o = this._g.transform();
        return {x: o.x, y: o.y}
      },

      _rotDeg: function() {     // () -> Num

        // Note: The returned value is not necessarily normalized to [0,360) range (e.g. setting to '123' causes
        //      the angle '-237' to be read). We do the normalization here. AKa080516
        //
        var deg = this._g2.transform("rotation");   // this should be in the (-360,360) range, though?

        var tmp = (deg+360)%360;
        assert( tmp >= 0 && tmp < 360 );

        return tmp;
      }
    }
  });

  //---
  // Add the '.gx' method to the SVG document (not a method of say 'SVG.G'; we want to keep the SVG libraries
  // subordinate to the 'gx' concept). AKa050516
  //
  // Note: Later, maybe, we'd allow creating sub-gx'es within a 'gx'.
  //
  SVG.extend( SVG.Doc, {

    gx: function( populateF ) {    // ( (SVG.Container) -> ) -> Gx
      //console.log(this);    // SVG.Doc

      return new Gx(this, populateF);
    }
  });

})();
