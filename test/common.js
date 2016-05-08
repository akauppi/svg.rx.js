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
  * The bounding box has the top left (x,y) and bottom right (x2,y2) coordinates of the element, after transformations
  * (including rotation) are applied. You can not use the result to know, where a particular point ended up.
  *
  * Note: We're intentionally having this on the test side. It should not be needed in normal application code.
  *
  * Note: In practise, we only use this with the global 'svg' mentioned above. We could move the CSS sniffing code
  *     (border widths) outside, but this way the code is more encapsulated (in case we wish to move it out of tests,
  *     one day).
  *
  * Note: naming of the returned fields is akin to '.bbox()' et.al.
  */
  sbox: function() {    // () -> { x: Number, y: Number, x2: Number, y2: Number }

    // Note: '.getBoundingClientRect()' gives a trustworthy response, also when the element has been rotated,
    //      and/or is outside of the positive viewport (neither svg.js '.rbox' or '.tbox' methods do this). AKa060516
    //
    //      - bounding box, in visible screen coordinates (scrolling not applied), of the bounding box after rotation
    //      (.bottom, .left, .right, .top, .width, .height)
    //
    //      See -> https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect
    //
    var o = this.native().getBoundingClientRect();

    //console.log( "bounding client", o );

    var scrollX = window.scrollX,
      scrollY = window.scrollY;

    var svg_native = this.parent(SVG.Doc).native();   // same as our 'svg' global (but we're more encapsulated this way)

    // Need the border width from CSS
    //
    // See: window.getComputedStyle -> https://developer.mozilla.org/en-US/docs/Web/API/Window/getComputedStyle
    //
    var cs = window.getComputedStyle( svg_native, null );

    function f(prop) {    // (String) -> Int
      var px= cs.getPropertyValue(prop);      // e.g. "1px"
      return parseInt(px,10);
    }

    var borderLeft = f("border-left-width");
    var borderTop = f("border-top-width");

    var dx = scrollX - svg_native.offsetLeft - borderLeft;
    var dy = scrollY - svg_native.offsetTop - borderTop;

    return {
      x: o.left + dx,
      y: o.top + dy,
      x2: o.right + dx,
      y2: o.bottom + dy

      // 'cx','cy','width','height','w','h' omitted
    }
  },

  /*
  * Transform a coordinate from some SVG element to the coordinates of the enclosing SVG.Doc.
  */
  transformBack: function (x,y) {    // (Num,Num) -> {x:Num,y:Num}
    var m= this.ctm();

    console.log(m);

    // This should take into account also rotation.
    //
    // See -> http://stackoverflow.com/questions/18554224/getting-screen-positions-of-d3-nodes-after-transform/18561829
    //
    return {
      x: m.e + x*m.a + y*m.c,
      y: m.f + x*m.b + y*m.d
    }
  }
});
