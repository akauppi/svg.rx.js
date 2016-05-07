/*
* svg.gx.js
*/
/*jshint devel:true */

(function () {
  "use strict";

  //--- Gx---
  //
  // ._g: SVG.Group   The SVG contents (note: caller has no direct access to this group)
  // ._ox, ._oy: Num  Offset of origin (within the given SVG elements)
  //
  var Gx = SVG.invent({
    // Initialize node
    create: function ( parent, populateF ) {    // ( SVG.Container, (SVG.Container) -> )
      //var self = this;

      //console.log(parent);    // SVG.Doc
      var g= parent.group();

      populateF(g);

      this._g = g;
      this._ox = this._oy = 0;
    },

    // Add class methods
    extend: {
      // Set the origin for the contents of the 'Gx'
      //
      origin: function (x, y) {   // (Num, Num) -> this
        var xyWas = this.pos();   // the position without the offset applied

        this._ox = x;
        this._oy = y;

        this.pos(xyWas.x, xyWas.y);   // with the new origin applied

        return this;
      },

      // Move the 'Gx', absolutely, or ask the position
      //
      // Note: Position is placed as to the origin of the group, so rotations do not matter (the group rotates around
      //      that origin).
      //
      pos: function(x,y) {   // (Num,Num) -> this or () -> {x:Num, y:Num}

        if (x === undefined) {
          var o = this._g.transform();
          console.log("transform",o);
          return {x: o.x+this._ox, y: o.y+this._oy}
        } else {
          this._g.translate( x-this._ox, y-this._oy );
          return this;
        }
      },

      // Move the 'Gx', relatively
      //
      relpos: function(dx,dy) {   // (Num,Num) -> this
        var o= this.pos();
        this.pos( o.x+dx, o.y+dy );
        return this;
      },

      // Rotate the 'Gx', around the origin, or ask the rotation
      //
      rotDeg: function(deg) {   // (Num) -> this or () -> Num
        if (deg === undefined) {
          var deg = this._g.transform("rotation");
          return deg;
        } else {
          this._g.rotate(deg);    // around the group's origin (right?)
          return this;
        }
      },

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
