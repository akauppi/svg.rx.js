/*
* gx.js
*
* References:
*   Inheritance and the prototype chain
*     -> https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain
*/
/*jshint devel:true */

// Needed to be globally known so that 'gx.draggable.js' et.al. can extend it.
//
var Gx;

(function () {
  "use strict";

  assert(true);
  assert(Rx.Subject);

  //--- Gx ---
  //
  // ._g2: SVG.Group  Inner group. Origin translation and rotation happen for this group.
  // ._g: SVG.Group   Outer group. Positioning happens for this group.
  //
  // ._obsPos: [observable of {x:Num,y:Num}]    non-null if it has been subscribed at least once
  // ._obsRotDeg: [observable of Num]           -''-
  //
  // Note: It is unsure, whether use of two groups or handling one group and maintaining two matrices is the better
  //      approach, performance-wise. We can try these at some stage, if moving/rotating needs boosting. AKa080516
  //
  // Note: In creation, the second parameter can be either
  //      - an SVG.Element (in this case it needs to be in the 'parent' SVG.Doc)
  //      - a callback to add stuff to the right group
  //
  //      NOTE: We're looking at the right way to deal with these things, and the callback variant might be on the
  //          way out (it makes the calling code unnecessarily complex). AKa220516
  //
  Gx = function (parent, fOrEl) {    // ( SVG.Doc, (SVG.Container) -> or SVG.Element )
    var g = parent.group();
    var g2 = g.group();

    if (typeof fOrEl === "function") {
      var f = fOrEl;
      f(g2);
    } else {
      g2.add(fOrEl);    // tbd. does this work
    }

    // X.call(this, ...);   // no super class constructor to call

    this._g = g;
    this._g2 = g2;
    this._obsPos = null;
    this._obsRotDeg = null;
  };

  Gx.prototype = {
    prototype: null,     // marking we are the base
    constructor: Gx,

    // --- Public methods ---

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
        if (this._obsPos) {
          this._obsPos.next({x:x,y:y});
        }
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
        if (this._obsRotDeg) {
          this._obsRotDeg.next(deg);
        }
        return this;
      }
    },

    // Subscribe to position changes
    //
    obsPos: function () {   // () -> observable of {x:Num,y:Num}
      return this._obsPos= this._obsPos || new Rx.Subject;
    },

    // Subscribe to rotation changes
    //
    obsRotDeg: function () {   // () -> observable of Num
      return this._obsRotDeg= this._obsRotDeg || new Rx.Subject;
    },

    // Return the top level element of the 'Gx'
    //
    //  for 'addClass', 'removeClass' etc. SVG-level actions
    //
    el: function () {   // () -> SVG.Container
      return this._g;
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
  };

  /*
  * Restrict creation to 'SVG.Document' (not e.g. under 'SVG.G'), to keep svg.js subordinate to Gx system
  * (so we can eventually replace it, and/or add support for raw SVG for describing the elements).
  */
  SVG.extend( SVG.Doc, {
    gx: function (populateF) {  // ( (SVG.Container) -> ) -> Gx
      return new Gx(this, populateF);
    }
  });

})();
