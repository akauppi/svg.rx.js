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

    var n= choices.length;

    g.circle(2*r1).center(0,0).addClass("debug");
    g.circle(2*r2).center(0,0).addClass("debug");

    var rMid = (r1+r2)/2;

    // Make a group with path and the inner stuff given (caller will translate)
    //
    // Returns the subgroup, for rotation and assigning the click handling
    //
    // Note: All this could be within the 'forEach' scope, instead of separate function.
    //
    var addArcWithElem = function (_g,x,i) {   // (SVG.G, {el: SVG.Element, f: () ->, disabled: Boolean|undefined}, Int, () ->) -> SVG.G
      var el = x.el,
        f = x.f,
        disabled = x.disabled || false;

      var gg= _g.group();

      var rad = -(Math.PI/2) - i/n * (2.0*Math.PI);   // counter-clockwise, starting from top

      // Make the path at 0 rad and rotate to rightful place.
      //
      var a = Math.cos(spread_rad/2),
        b = Math.sin(spread_rad/2);

      var rx1= r1*a,
        ry1= r1*b,
        rx2= r2*a,
        ry2= r2*b;

      var path = gg.path( "M"+rx2+","+(-ry2)+
        "A"+r2+","+r2+",0,0,1,"+rx2+","+ry2+     // larger arc, clockwise
        "L"+rx1+","+ry1+
        "A"+r1+","+r1+",0,0,0,"+rx1+","+(-ry1)+  // smaller arc, counter-clockwise
        "z"
      );

      path.addClass("arc");   // to be able to limit styling to us

      var arc= path.rotate( rad * RAD_TO_DEG, 0,0 );

      // Calculate the position for the icon. We don't want to rotate it.
      //
      var rMid = (r1+r2)/2.0;

      var dx = rMid * Math.cos(rad);
      var dy = rMid * Math.sin(rad);

      el.center(dx,dy);

      gg.add(arc);
      gg.add(el);

      if (disabled) {
        gg.addClass("disabled");
      }

      /*** remove?
      if (true) {
        // Can use '.move' since the element has been translated to have (0,0) as the attachement point to the halo.
        //
        gg.add(el);
        el.center( 0, -(r1+r2)/2.0 );
          //.rotate( (-rad)* RAD_TO_DEG, 0,0 );
      } else {
        // Just place the icon in the right position, without joining it in the group (this way, it does not need to
        // be rotated
        //
        var c = Math.cos(rad/2),
          d = Math.sin(rad/2),
          dx = rMid * d,
          dy = rMid * c;

        el.center(dx,dy);
      }
      ***/

      gg.click( function () {
        //alert("clicked");

        // If disabled, do nothing
        //
        if (gg.hasClass("disabled")) {
        } else {
          // Currently just toggle (needs at least: toggle by changing background and/or icon), just click, disabled. tbd.
          //
          gg.toggleClass("selected");
          f();
        }
      });
    }

    // Add sections, one per elem
    //
    choices.forEach( function (x,i) {
      addArcWithElem(g,x,i);
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
