/*
* gx-halo.js
*
* A circular menu wheel, with symbols.
*/
/*jshint devel:true */

(function () {
  "use strict";

  assert(true);
  assert(Gx);

  var RAD_TO_DEG = 180.0 / Math.PI;

  //--- GxHalo ---
  //
  // Use:
  //    new GxHalo(parent, 20, 50, [el1, el2, ...])
  //
  // .xxx()        Methods tbd.
  //
  var GxHalo = function (parent, r1, r2, choices) {    // (SVG.Container, Number, Number, array of {el: SVG.Elem, f: () ->}) ->
    var self= this;

    var g = parent.group();

    var spread_rad = 2*Math.PI / choices.length;

    g.circle(2*r1).center(0,0).addClass("debug");
    g.circle(2*r2).center(0,0).addClass("debug");

    // Make a group with path and the inner stuff given (caller will translate)
    //
    // Returns the subgroup, for rotation and assigning the click handling
    //
    // Note: All this could be within the 'forEach' scope, instead of separate function.
    //
    var addArcWithElem = function (_g,el,rad,f) {   // (SVG.G, SVG.Element, Number, () ->) -> SVG.G
      var gg= _g.group();

      var a = Math.cos(spread_rad/2),
        b = Math.sin(spread_rad/2);

      // Note: The position of 'a' and 'b' is like this because we're drawing the arc -PI rotated (on negative Y axis).
      //
      var rx1= r1*b,
        ry1= r1*a,
        rx2= r2*b,
        ry2= r2*a;

      gg.path( "M"+(-rx2)+","+(-ry2)+
        "A"+r2+","+r2+",0,0,1,"+rx2+","+(-ry2)+     // larger arc, left to right
        "L"+(rx1)+","+(-ry1)+
        "A"+r1+","+r1+",0,0,0,"+(-rx1)+","+(-ry1)+  // smaller arc, right to left
        "z"
      );

      // Can use '.move' since the element has been translated to have (0,0) as the attachement point to the halo.
      //
      gg.add(el);
      el.move( 0, -(r1+r2)/2.0 )
        .rotate( (-rad)* RAD_TO_DEG, 0,0 );

      gg.rotate( rad * RAD_TO_DEG, 0,0 );

      gg.click( function () {
        alert("clicked");
        // Currently just toggle (needs at least: toggle by changing background and/or icon), just click, disabled. tbd.
        //
        gg.toggleClass("selected");
        f();
      });
    }

    var n= choices.length;

    // Add sections, one per elem
    //
    choices.forEach( function (x,i) {
      var el= x.el;
      var f= x.f;

      var rad = (i/n) * (2.0*Math.PI);

      console.log(rad);
      addArcWithElem(g,el,rad,f);
    });

    Gx.call( this, parent, g, "gxHalo" );

    this.origin(0,0);
  };

  GxHalo.prototype = Object.create(Gx.prototype);

  // tbd. If there are methods, add them here.

  // tbd. Where and how we want to use the menu is still open (from 'SVG.Doc' or any 'Gx'?). AKa190616
  //
  SVG.extend( SVG.Doc, {
    gxHalo: function (r1, r2, choices) {  // (Number, Number, array of { el: SVG.Element, f: () -> }) -> GxHalo
      return new GxHalo(this, r1, r2, choices);
    }
  });

})();
