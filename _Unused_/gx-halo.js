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
  var DEG_TO_RAD = 1/RAD_TO_DEG;

  /*
  * MenuItemOpts: {
  *   .el:  SVG.Elem
  *   .el2: [SVG.Elem]
  *   .f:   () ->       // with the menu item group as 'this'
  *   .disabled: [Observable of boolean]
  *   .flash: [Int|Boolean]
  *   .upright: [Boolean]
  * }
  *
  * ^-- Above is a commentary object definition that we can use in the prototypes below.
  */

  //--- GxHalo -> Gx
  //
  // Use:
  //    new GxHalo(parent, 20, 50, [o1, o2, ...])
  //
  // 'r1':    Inner radius
  // 'r2':    Outer radius
  // 'spread_deg':  Spread of each menu item (optional)
  //              If provided, one can make menus which are arc-like, instead of covering the whole circle (default).
  //
  // 'MenuItemOpts':
  //    .el:  The initial (or only) element
  //    .el2: The alternative element, swapped when clicked (optional)
  //    .f:   The callback function
  //            Note: setting a menu entry to '.selected' or not is intentionally left to the callback
  //    .disabled:  Observable of boolean, telling the 'disabled' (true) or enabled (false) state of the entry
  //    .noflash:   set to 'true' for not getting the transitional flash.
  //    .upright:   If 'true', the menu item is kept vertical even when the menu rotates.
  //
  // Note: The menu items are placed by their origin, which is expected to be in the center of those items.
  //        Use '.translate' on the items to reach this.
  //
  // Members:
  //    ._spread_rad: Number
  //
  // Methods:
  //    ._rot:      Place a single menu item to its place
  //    .rotDeg:    Override of the 'Gx' rotation, rotating also the menu items so they remain upright.
  //
  var GxHalo = function (parent, r1, r2, spread_deg, choices) {    // (SVG.Container, Number, Number, Number, array of MenuItemOpts) ->
    var self= this;

    var g = parent.group();

    Gx.call( self, parent, g, "gxHalo" );
    //this.origin(0,0);

    // Get an observable to when the group gets rotated.
    //
    var rotDeg_obs = self.obsRotDeg();

    spread_deg = spread_deg || (360 / choices.length);

    var spread_rad = DEG_TO_RAD * spread_deg;

    g.circle(2*r1).center(0,0).addClass("debug");
    g.circle(2*r2).center(0,0).addClass("debug");

    var rMid = (r1+r2)/2.0;

    // Make a group with arc path and the inner stuff.
    //
    // Returns the subgroup, for rotation and assigning the click handling
    //
    // Note: All this could be within the 'forEach' scope, instead of separate function.
    //
    var addG = function (_g,x,i) {   // (SVG.G, MenuItemOpts, Int) -> SVG.G
      var el = x.el,
        el2 = x.el2,
        f = x.f,
        disabled_obs = x.disabled,
        flash_ms = (x.flash === undefined || x.flash === true) ? 20 :
          x.flash ? x.flash : 0,
        upright = x.upright;

      var gg= _g.group();

      // Make the arc path at 0 rad.
      //
      var a = Math.cos(spread_rad/2),
        b = Math.sin(spread_rad/2);

      var rx1= r1*a,
        ry1= r1*b,
        rx2= r2*a,
        ry2= r2*b;

      var arc = gg.path( "M"+rx2+","+(-ry2)+
        "A"+r2+","+r2+",0,0,1,"+rx2+","+ry2+     // larger arc, clockwise
        "L"+rx1+","+ry1+
        "A"+r1+","+r1+",0,0,0,"+rx1+","+(-ry1)+  // smaller arc, counter-clockwise
        "z"
      );

      arc.addClass("arc");   // to be able to limit styling to us

      // Angle of the center
      //
      // Go counterclockwise
      //
      var rad = (function () {    // scope
        var ii= i - (choices.length)/2 +0.5;
        return - (Math.PI + spread_rad * ii);
      })();

      arc.rotate( rad * RAD_TO_DEG, 0,0 );

      // Calculate the position for the icon.
      //
      var dx = rMid * Math.cos(rad);
      var dy = rMid * Math.sin(rad);

      el.move(dx,dy);

      if (el2) {
        el2.move(dx,dy);
      }

      // Add the elements to the group
      //
      gg.add(arc);
      gg.add(el);

      if (el2) {
        gg.add(el2.hide());
      }

      // Visualize the disabled state
      //
      if (disabled_obs) {
        disabled_obs.subscribe( function (b) {    // (boolean) -> ()
          if (b) gg.addClass("disabled")
          else gg.removeClass("disabled");
        })
      }

      // Keep menu item upright if the menu is rotated
      //
      // Yay, a browser specific thing! For rotating a 'use' element pointing to an external icon,
      // these do right:
      //    - Firefox 47.0.1
      //    - Chrome 47.0.2526.73 (OS X)
      //    - Chrome 51.0.2704.81 (Android 6.0.1)
      //
      // These rotate wrong (Apple):
      //    - Safari 9.1.2 on OS X (in 'demo/halo.html', the envelope does its own small circle outside of its slot)
      //    - Safari Technology Preview 9.1.2 (Webkit 11602.1.41) -''-
      //    - Safari (iOS 9.3.2)
      //      User-Agent	Mozilla/5.0 (iPad; CPU OS 9_3_2 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13F69 Safari/601.1
      //    - Chrome 51.0.2704.104 (iOS 9.3.2)
      //
      //    Filed as a bug for Safari, number 27516559
      //
      //    The solution for Safari is probably just to use inline SVG elements, instead of the external icons,
      //    until this is fixed. AKa250716
      //
      if (upright) {
        rotDeg_obs.subscribe( function (deg) {
          function rot(elx) {

            // Testing remedy for Safari (but works also on the other browsers)
            //
            if (elx instanceof SVG.Use) {
              var x = elx.x(),
                y = elx.y(),
                w = elx.width(),
                h = elx.height();
              elx.rotate(-deg, x+w/2,y+h/2);
            } else {
              elx.rotate(-deg);
            }
          }
          rot(el);
          if (el2) rot(el2);
        });
      }

      // Click handler
      //
      gg.click( function (ev) {

        if (gg.hasClass("disabled")) {
          // nothing
        } else {
          // If there are two icons, swap them
          //
          if (el2) {
            if (el.visible()) {
              el.hide();
              el2.show();
            } else {
              el2.hide();
              el.show();
            }
          }

          // Make a flash to visually indicate the click
          //
          // tbd. Once we have animation support in 'rx', should do this kind of things with it - or with CSS alone. AKa100716
          //
          if (flash_ms > 0) {
            gg.addClass("flash");
            window.setTimeout( function () { gg.removeClass("flash"); }, flash_ms );
          }

          // Call with the menu item being 'this'; allows easy changing of its class.
          //
          f.call(gg);
        }
      });

      // Prevent default browser action (such as selecting text in the background body)
      //
      // Note: Calling '.preventDefault' on the 'click' event is not sufficient.
      //
      gg.mousedown( function (ev) {
        ev.preventDefault();
      });

      gg.touchstart( function (ev) {
        ev.preventDefault();
      });
    }

    // Add sections, one per elem
    //
    choices.forEach( function (x,i) {
      addG(g,x,i);
    });
  };

  GxHalo.prototype = Object.create(Gx.prototype);

  // tbd. If there are methods, add them here.

  // --- Methods ---

  // tbd. Where and how we want to use the menu is still open (from 'SVG.Doc' or any 'Gx'?). AKa190616
  //
  SVG.extend( SVG.Doc, {
    gxHalo: function (r1, r2, widthDeg, choices) {  // (Number, Number, Number, array of { el: SVG.Element, el2: SVG.Element, f: () -> }) -> GxHalo
      return new GxHalo(this, r1, r2, widthDeg, choices);
    }
  });

})();
