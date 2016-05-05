/*
* svg.gx.js
*/
/*jshint devel:true */

(function () {
  "use strict";

  //--- Gx---
  //
  // ._g: SVG.Group   The SVG contents (note: caller has no direct access to this group)
  //
  var Gx = SVG.invent({
    // Initialize node
    create: function ( parent, populateF ) {    // ( SVG.Container, (SVG.Container) -> )
      //var self = this;

      //console.log(parent);    // SVG.Doc
      var g= parent.group();

      populateF(g);

      this._g = g;
    },

    // Add class methods
    extend: {
      // Set the origin for the contents of the 'Gx'
      //
      origin: function (x, y) {   // (Num, Num) -> this

        console.log( this._g.children() );

        if (true) {
          this._g.translate(-x, -y);     // did work, after all AKa050516
        } else {  // remove?
          this._g.children().forEach( function(el) {
            el.translate(-x,-y);
          } );
        }

        return this;
      },

      // Move the 'Gx', absolutely
      //
      pos: function(xy) {   // ({x:Num,y:Num}) -> this
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
