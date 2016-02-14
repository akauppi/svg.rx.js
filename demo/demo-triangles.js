/*
* demo-triangles.js
*/
/*jshint devel: true */
/*globals assert */

/*
* A custom SVG component
*/
(function() {
  "use strict";
  assert(assert);

  // A function used when hiding out svg.js methods
  //
  function notSupported (s) {   // (String) -> () -> never returns
    return function () {
      throw "Access to method '"+s+"' not supported in 'svg.rx.js'";
    }
  }

  SVG.Rx = SVG.Rx || {};

  //--- SVG.Rx.MyTriangle ---
  //
  //  ._locked: Boolean
  //
  //  .lock(Boolean)
  //  .isLocked()
  //  .tieFrom( Observable of {x:Num, y:Num, angle:Num} )
  //  .tieTo( Observable of {x:Num, y:Num, angle:Num} )
  //
  // Note: The size of the object is defined here, by the parameter, instead of using a '.scale' in the parent
  //      method. Using 'scale' would cause problems with further movements - now we can keep things simple. AKa140216
  //
  SVG.Rx.MyTriangle = SVG.invent({
    create: function (r) {   // (Num) ->
      //var self= this;

      this.constructor.call(this, SVG.create('g'));

      this._locked = false;

      // Path via the tips: (UNIT,0), (-UNIT/2,(± UNIT*sqrt(3)/2))
      //
      var B= r*Math.sqrt(3)/2;

      var path = "M"+r+",0"+
        "L"+(-r/2)+","+B+
        "l0,-"+(2*B)+
        "z";

      this.path(path);

      //this.translate(r/2,B);   // make rotational center the group's origin

      this._dx = r/2;
      this._dy = B;

      this.addClass("my_triangle");
    },
    inherit: SVG.G,

    construct: {          // parent method to create these
      my_triangle: function (r) {   // ([Num=10]) -> SVG.Rx.MyTriangle    | this = parent

        var el= this.put(new SVG.Rx.MyTriangle(r));

        return el;
      }
    },

    extend: {
      // Lock the triangle so it won't move or rotate (either when directly manipulated or via changes in the
      // connecting paths.
      //
      lock: function (b) {    // (Boolean) -> this
        this._locked = b;
        return this;
      },

      // Check if the triangle is locked
      //
      isLocked: function () {    // () -> Boolean
        return this._locked;
      },

/***
      // Add an incoming connection (there may be 0,1 or 2 in real application)
      //
      _tieFrom: function (obs) {   // (Observable of {x:Num, y:Num, rad:Num}) -> this

        // tbd. Should create a tail
        //
        obs.subscribe( function (ev) {
          // tbd. Should
        } );
        return this;
      },

      // Add an outgoing connection (there may be 0,1 or 2 in real application)
      //
      tieTo: function (o) {   // (MyTriangle) -> this
        this._joinedToObs.push(obs);

        o._tieFrom(this._obs);    // our movements will try to affect the upstream triangle
        return this;
      }
***/

      // Overrides of 'SVG.G' and 'SVG.Element'
      //
      x: notSupported('x'),
      y: notSupported('y'),

      move: function (x,y) {      // (Num,Num) -> this
        // SVG 'g' element does not seem to observe its 'x' and 'y' attributes. Just the translation.
        //
        this.translate(x,y);

        /***
        this.attr({        // what svg.js would do (but separately for 'x' and 'y')
          x: x+ "px",
          y: y+ "px"
        });
        ***/

        return this;
      },

      cx: notSupported('cx'),
      cy: notSupported('cy'),
      center: notSupported('center'),

      // note: 'width', 'height' and 'size' are constant, since we handle all movement and rotation via the transforms.
      //      There is no real need for them. AKa070216,AKa140216
      //
      width: notSupported('width'),
      height: notSupported('height'),
      size: notSupported('size'),

      rotateRad: function (rad) {      // (Num) -> this
        var RAD_TO_DEG = 180.0 / Math.PI;
        this.rotate( rad * RAD_TO_DEG );
      }
    }
  });

})();

/*
* Actual demo
*/
(function() {
  "use strict";
  assert(assert);

  var R= 30;

  var svg = SVG("cradle");

  var t1 = svg.my_triangle(R).move(100,100);
  var t2 = svg.my_triangle(R).move(200,150).rotate(-90);
    //svg.my_triangle(R).move(200,150).rotate(-90).rotate(0);        // should be same as above
    svg.my_triangle(R).move(200,150).rotate(-90).move(200,150);    // should be in same place as above
  var t3 = svg.my_triangle(R).move(300,200);

  // Note: svg.js 2.x transform methods are absolute, but the 3.0 version will make them relative.
  //      We can take that approach with svg.rx.js already now. AKa140216
  //
  //      See -> https://github.com/wout/svg.js/blob/master/CHANGELOG.md
  //
  //var r1 = svg.rect(100,10).move(500,100);
  //var r1b = svg.rect(100,10).move(500,100).rotate(-90).rotate(-45);

  //t1.tieTo(t2);
  //t2.tieTo(t3);

  dragIt(t1);
  dragIt(t2);
  dragIt(t3);

  function dragIt( el ) {     // (SVGElement) ->
    el.rx_draggable().subscribe( function (dragObs) {
      dragObs.subscribe( function (o) {
        console.log(o);
        el.move( o.x, o.y );
      });
    });
  }

  // Allow creation of new triangles
  //
  svg.rx_draggable().subscribe( function (dragObs) {

    var t= svg.my_triangle(R).hide();   // ready, hidden
    var circle= svg.circle(10);         // ready, hidden
    var rect= svg.rect().width(2*30).height(2*30).addClass("debug");

    var fresh = true;

    dragObs.subscribe(
      function (o) {
        //console.log( "Dragging: "+ o.x + " "+ o.y );
        t.move(o.x, o.y);     // 'x','y' are the actual touch/pointer coords, because we are tracking 'svg'
        circle.center(o.x,o.y).show();
        rect.center(o.x,o.y);

        if (fresh) {
          t.show();
          fresh = false;
        }
      },
      null,   // error handling
      function () {  // end of drag
        // leave the triangle there, but allow dragging it later
        dragIt(t);
        circle.remove();
        rect.remove();
      }
    );
  });

})();
