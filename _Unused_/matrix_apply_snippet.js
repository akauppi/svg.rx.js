
  // svg.js (2.2.5) misses a '.transform' method from 'SVG.Matrix', forcing application code to create a native SVGPoint
  // structure. We would like to introduce such a method here just for our own convenience.
  //
  // tbd. We would need to have access to the SVG.Element (or rather, the SVG.Doc) attached to the matrix, in order to
  //      create an 'SVGPoint' for the transforms to work. Is there a hidden field we could use for that? AKa100116
  //
  //      On a more serious level, the life span of such an 'SVGPoint' should be handled by the application, to reduce
  //      allocations. We can't really do it here - what we can do is simply buffer all transforms via a single SVGPoint
  //      bound to the document. Would that be safe? AKa100116
  //
  //      For these reasons, this is not worth it.
  //
  // See -> https://github.com/wout/svg.js/issues/437
  //     -> https://github.com/wout/svg.js/issues/403
  //
  SVG.extend( SVG.Matrix, {

    apply: function (buf, a,b) {     // (SVGPoint,Num,Num) or (SVGPoint,array(2) of Num) -> SVGPoint
      var x,y;

      if (typeof b !== "undefined") {
        x= a;
        y= b;
      } else {
        x= a[0];
        y= a[1];
      }

      buf.x = x;
      buf.y = y;

      return buf.matrixTransform( this.native() );   // returns SVGPoint (which has {x:Num,y:Num})
    }
  });
