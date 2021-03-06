  // DEPRECATED: use the '.transformBack' instead. AKa090516
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
  sbox_deprecated: function() {    // () -> { x: Number, y: Number, x2: Number, y2: Number }

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


  /*** REMOVE: not using '.sbox' any more; '.transformBack' is nicer.
  it('an element\'s bounding box should be testable, within the SVG coordinates (also after rotation)', function () {

    var SIDE = 30;
    var X= 100;
    var Y= 50;
    var DEG= 25;    // within 0..90

    var R= Math.sqrt(SIDE*SIDE/2);

    // Shift of corners
    //
    //var A= Math.cos( (45+DEG)*DEG2RAD ),    // how much top-left left of X (top-right above Y, ...)
    var B= Math.sin( (45+DEG)*DEG2RAD )       // how much top-left above Y (top-right right of X, ...)

    //console.log("A",A);
    console.log("B",B);

    var rect= svg.rect(SIDE,SIDE).translate(-SIDE/2,-SIDE/2).move(X,Y).rotate(DEG);

    svg.rect(SIDE,SIDE).center(X,Y).rotate(DEG).addClass("debug");

    // The corners should be at:
    //  top left: (X-A*R, Y-B*R)
    //  bottom right: (X+B*R, Y+A*R)

    // Note: '.sbox()' provides the overall bounding box within the SVG, not where an individual corner ended up.
    //
    var o = rect.sbox();

    (o.x).should.be.closeTo( X-B*R, 0.01 );
    (o.y).should.be.closeTo( Y-B*R, 0.01 );
    (o.x2).should.be.closeTo( X+B*R, 0.01 );
    (o.y2).should.be.closeTo( Y+B*R, 0.01 );
  });
  ***/