/*
* svg.gx.js
*/
/*jshint devel:true */

(function () {
  "use strict";

  //--- Gx---
  //
  // ._g: SVG.Group   The SVG contents (note: caller has no direct access to this group)
  // ._dx: Num        Offset of origin, used in translates
  // ._dy: Num        -''-
  //
  var Gx = SVG.invent({
    // Initialize node
    create: function ( parent, populateF ) {    // ( SVG.Container, (SVG.Container) -> )
      //var self = this;

      //console.log(parent);    // SVG.Doc
      var g= parent.group();

      populateF(g);

      this._g = g;
      this._dx = this._dy = 0;
    },

    // Add class methods
    extend: {
      // Set the origin for the contents of the 'Gx'
      //
      origin: function (x, y) {   // (Num, Num) -> this
        var xyWas = this.pos();   // the position without the offset applied

        this._dx = -x;
        this._dy = -y;

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
          return {x: o.x, y: o.y}

        } else {
          this._g.translate( x+this._dx, y+this._dy );
          return this;
        }
      },

      // Move the 'Gx', relatively
      //
      relpos: function(xy) {   // ({x:Num,y:Num}) -> this
      },

      // Rotate the 'Gx', around the origin
      //
      rotDeg: function(deg) {   // (Num) -> this
        this._g.rotate(deg);
        return this;
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
