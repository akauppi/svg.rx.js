/*
* demo-triangles.js
*/

function assert(b,msg) {    // (boolish, String) =>
  if (!b) {
    throw ("Assert failed" + (msg ? ": "+msg : ""))
  }
}
assert(true);   // just use it up (jshint)

/*
* A custom SVG component
*/
(function() {
  "use strict";

  assert( SVG.Rx.Point && SVG.Rx.Dist && SVG.Rx.Angle );

  var R= 30;

  // A function used when hiding out svg.js methods
  //
  function notSupported (s) {   // (String) -> () -> never returns
    return function () {
      throw "Access to method '"+s+"' not supported in 'svg.rx.js'";
    }
  }

  //--- SVG.Rx.MyTriangle ---
  //
  //  ._cp: SVG.Rx.Point
  //  ._r: SVG.Rx.Dist
  //  ._angle: SVG.Rx.Angle
  //
  //  ._locked: Boolean
  //
  //  .lock(Boolean)
  //  .isLocked()
  //  .tieFrom( Observable of {x:Num, y:Num, angle:Num} )
  //  .tieTo( Observable of {x:Num, y:Num, angle:Num} )
  //
  SVG.Rx.MyTriangle = SVG.invent({
    create: function (cp,angle) {   // (SVG.Rx.Point, SVG.Rx.Angle) ->
      var self= this;

      this.constructor.call(this, SVG.create('g'));

      this._cp = cp;
      this._r = SVG.Rx.Dist(R);
      this._angle = angle;

      this._locked = false;

      /***
      // Combine the location and angle into one Observable
      //
      this._obs = this._cp.subscribe().combineLatest(
        this._angle.subscribeRad(),
        function (cp,rad) {
          return {
            x: cp.x,
            y: cp.y,
            rad: rad
          };
        }
      )
      ***/

      // Path via the tips: (r,0), (-r/2,(± r*sqrt(3)/2))
      //
      var b= R*Math.sqrt(3)/2;

      var path = "M"+R+",0"+
        "L"+(-R/2)+","+b+
        "l0,-"+(2*b)+
        "z";

      console.log(path);
      this.path(path);

      this.addClass("my_triangle");

      /* change the transformation matrix so that the rotational center becomes the group's x,y.
      */
      //self.translate(-R/2,-b);

      /* handle moves via the 'SVG.Rx.Point'
      */
      this._cp.subscribe( function (o) {  // ({x:Num,y:Num}) ->
        self.attr( {                      // what 'svg.js' would do (but separately for 'x' and 'y')
          "x": o.x,
          "y": o.y
        });
      } );

      /* handle rotation via the 'SVG.Rx.Angle'
      */
      this._angle.subscribeDeg( function (deg) {    // (Num) ->

        self.rotateDeg(deg);    // what 'svg.js' rotate would do
      } );

    },
    inherit: SVG.G,

    construct: {          // parent method to create these
      my_triangle: function (cp,rad) {   // ([{x:Num,y:Num}], [Num]) -> SVG.Rx.MyTriangle    | this = parent

        var cp2 = cp ? new SVG.Rx.Point(cp.x, cp.y) : new SVG.Rx.Point();
        var angle = new SVG.Rx.Angle(rad || 0);

        var ret= this.put(new SVG.Rx.MyTriangle(cp2, angle));

        if (!cp) { ret.hide(); }
        return ret;
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
      cx: notSupported('cx'),
      cy: notSupported('cy'),
      move: notSupported('move'),

      // note: 'width', 'height' and 'size' are constant, since we handle all movement and rotation via the transforms.
      //      There is no real need for them. The radius should be used, instead. AKa070216,AKa140216
      width: notSupported('width'),
      height: notSupported('height'),
      size: notSupported('size'),

      center: function (cx,cy) {    // (Num,Num) -> this
        this._cp.set(cx,cy);        // sets the position, but also broadcasts it to any observers
        return this;
      },
      rotateDeg: function (deg) {      // (Num) -> this
        this._angle.setDeg( this._angle.asDeg() + deg );
      },
      rotateRad: function (rad) {      // (Num) -> this
        this._angle.setRad( this._angle.asRad() + rad );
      },
      rotate: notSupported('rotate (use \'rotateDeg\' or \'rotateRad\'')
    }
  });

})();

/*
* Actual demo
*/
(function() {
  "use strict";

  var svg = SVG("cradle");

  function degToRad(deg) {
    return deg * (Math.PI/180.0);
  }

  var t1 = svg.my_triangle( {x:100,y:100}, 0 );
  var t2 = svg.my_triangle( {x:200,y:150}, degToRad(-90) );
  var t3 = svg.my_triangle( {x:300,y:200}, 0 );

  //t1.tieTo(t2);
  //t2.tieTo(t3);

  /*** disabled
  dragIt(t1);
  dragIt(t2);
  dragIt(t3);

  function dragIt( el ) {     // (SVGElement) ->
    el.rx_draggable().subscribe( function (dragObs) {
      dragObs.subscribe( function (o) {
        el.move( o.x, o.y );
      });
    });
  }

  // Allow creation of new triangles
  //
  svg.rx_draggable().subscribe( function (dragObs) {

    var t= svg.my_triangle();   // ready, hidden
    var circle= svg.circle(10);   // ready, hidden
    var rect= svg.rect().width(2*30).height(2*30).addClass("debug");

    var fresh = true;

    dragObs.subscribe(
      function (o) {
        //console.log( "Dragging: "+ o.x + " "+ o.y );
        t.center(o.x, o.y);     // 'x','y' are the actual touch/pointer coords, because we are tracking 'svg'
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
  ***/

})();
