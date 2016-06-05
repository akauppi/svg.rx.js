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
  // ._g: SVG.Group         Outer group. Positioning happens for this group.
  // ._inner: SVG.Element   Inner element (from the caller). Origin translation and rotation happen for this group.
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
  Gx = function (parent, elOrF, className) {    // ( SVG.Doc, SVG.Element | (SVG.Container) -> [, String] )
    var g = parent.group();
    var inner = g.group();

    if (typeof elOrF=== "function") {
      alert( "This is no longer a used path" );
      elOrF(inner);
    } else {
      inner.add(elOrF);
    }

    if (className) {
      g.addClass(className);    // add class to the top level group
    }

    // X.call(this, ...);   // no super class constructor to call

    // Make a path back to 'Gx' land (e.g. if getting a group by searching for certain CSS classes).
    //
    g.asGx = this;

    this._g = g;
    this._inner = inner;
    this._obsPos = null;
    this._obsRotDeg = null;

    // Note: Storing the inner origin might not be absolutely required - we should be able to recover that from the
    //    transformation of '._inner'. This is "for now" (storing less state is a good thing, we should strive for
    //    uncovering such things from SVG instead of keeping a cache). AKa050616
    //
    //this._originX = null;
    //this._originY = null;
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
      this._inner.rotate(0).translate(-x,-y).rotate(deg);    // works :)

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
    rotDeg: function (deg) {   // (Num) -> this or () -> Num
      if (deg === undefined) {
        return this._rotDeg();
      } else {
        // Get the origin
        //
        // Note: If the '.transformedX|Y' members are not standard (they work on Safari and Firefox), we may need
        //      to cache the values given to '.offset()'. We're just trying to minimize cached state that may lead
        //      to bugs. AKa050616
        //
        var t = this._inner.transform();
        var xo = - t.transformedX;
        var yo = - t.transformedY;
        //console.log(xo,yo, t);

        this._inner.rotate(deg,xo,yo);     // replace earlier rotation (keep origin translation)

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

    // Return the top level, or the inner element of the 'Gx'
    //
    //  for 'addClass', 'removeClass' etc. SVG-level actions, look for the top level element ('top'==true)
    //  for adding more elements to the component, just call '.el()'
    //
    // Note: It is possible we merge these two group levels, later. If we do, the 'top' parameter can be ignored. AKa220516
    //
    el: function (top) {   // ( [Boolean] ) -> SVG.Container
      return top ? this._g : this._inner;
    },

    //--- Private methods ---

    _pos: function () {    // () -> {x:Num,y:Num}
      var o = this._g.transform();
      return {x: o.x, y: o.y}
    },

    _rotDeg: function () {     // () -> Num

      // Note: The returned value is not necessarily normalized to [0,360) range (e.g. setting to '123' causes
      //      the angle '-237' to be read). We do the normalization here. AKa080516
      //
      var deg = this._inner.transform("rotation");

      var tmp = (deg+360)%360;
      assert( tmp >= 0 && tmp < 360 );

      return tmp;
    }
  };

  //--- Static methods ---

  /*
  * Caching service. Allows creation of a value just once, for an SVG element. The initial use case is to create
  * an 'SVG.Symbol' just once for each 'SVG.Doc' that needs it.
  *
  * Note: 'key' is intended to be sufficiently unique.
  */
  Gx.cache = function (el, key, f) {      // ( SVG.Element, String, (SVG.Element) -> T ) -> T

    var v = el.remember(key);
    if (v === undefined) {
      v= f(el);
      assert( v !== undefined );

      el.remember(key,v);
      //console.log( "Set in cache", v );
    }

    return v;
  }

  /*
  * Restrict creation to 'SVG.Document' (not e.g. under 'SVG.G'), to keep svg.js subordinate to Gx system
  * (so we can eventually replace it, and/or add support for raw SVG for describing the elements).
  */
  SVG.extend( SVG.Doc, {
    gx: function (elOrF, className) {  // ( SVG.Element | (SVG.Container) -> [, String] ) -> Gx
      return new Gx(this, elOrF, className);
    }
  });

})();
