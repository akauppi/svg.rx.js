/*
* common.js
*
* Tools common to all the tests
*/
/*global: SVG, assert*/
/*jshint devel: true */

// Create just one SVG cradle (not a new one to each test)
//
var svg = SVG( document.body );   // just append the SVG to the body

SVG.extend( SVG.Element, {

  /*
  * Provide the bounding box of an element, translation and rotation applied, within the SVG viewport.
  *
  * Note: This is not as easy as it seems. The 'svg.js' 'bbox', 'tbox', 'rbox' all fall short in one way or the other
  *       ('tbox' e.g. does not cover rotations).
  *
  * Note: We're intentionally having this on the test side. It should not be needed in normal application code.
  *
  * Note: The returned member names are made to be similar to 'bbox' et.al.
  *
  * Note: In practise, we only use this with the global 'svg' mentioned above. We could move the CSS sniffing code
  *     (border widths) outside, but this way the code is more encapsulated (in case we wish to move it out of tests,
  *     one day).
  */
  sbox: function() {    // () -> { x: Number, y: Number, x2: Number, y2: Number, width: Number, height: Number }

    // Note: '.getBoundingClientRect()' seems to give a trustworthy response, also when the element has been rotated,
    //      and/or is outside of the positive viewport (neither svg.js '.rbox' or '.tbox' methods do this). AKa060516
    //
    //      See -> https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect
    //
    var o = this.native().getBoundingClientRect();

    var sx = window.scrollX,
      sy = window.scrollY;

    var mySvg_native = this.parent(SVG.Doc).native();   // same as our 'svg' global (but we're more encapsulated this way)

    // In browser: offsetTop 150, offsetLeft 10
    // In command line testing, offsetTop 60
    //
    var OFFSET_Y = mySvg_native.offsetTop;
    var OFFSET_X = mySvg_native.offsetLeft;

    // Need the border width from CSS
    //
    // See: window.getComputedStyle -> https://developer.mozilla.org/en-US/docs/Web/API/Window/getComputedStyle
    //
    var cs = window.getComputedStyle( mySvg_native, null );

    function f(prop) {    // (String) -> Int
      var px= cs.getPropertyValue(prop);      // e.g. "1px"
      return parseInt(px,10);
    }

    var borderLeft = f("border-left-width");
    var borderTop = f("border-top-width");

    return {
      x: o.left +sx - OFFSET_X - borderLeft,
      y: o.top +sy - OFFSET_Y - borderTop,
      x2: o.right +sx - OFFSET_X - borderLeft,
      y2: o.bottom +sy - OFFSET_Y - borderTop,
      width: o.width,
      height: o.height

      // 'cx','cy','w','h' omitted
    }
  }
});
