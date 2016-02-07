/*
* demo-triangles.js
*/

/*
* A custom SVG component
*/
(function() {
  "use strict";

  //--- SVG.Rx.MyTriangle ---
  //
  //  ._cp: SVG.Rx.Point
  //  ._r: SVG.Rx.Dist
  //  ._angle: SVG.Rx.Angle
  //
  //  ._obs
  //  ._locked: Boolean
  //  ._joinedFromObs: Array of Observable of [{x:Num, y:Num, rad:Num}]
  //  ._joinedToObs: Array of Observable of [{x:Num, y:Num, rad:Num}]
  //
  //  .lock(Boolean)
  //  .isLocked()
  //  .tieFrom( Observable of {x:Num, y:Num, angle:Num} )
  //  .tieTo( Observable of {x:Num, y:Num, angle:Num} )
  //
  SVG.Rx.MyTriangle = SVG.invent({
    create: function (cp,r,angle) {   // ({x:Num,y:Num}, Num, Num) ->
      var self= this;

      //this.constructor.call(this, SVG.create('g'));

      this._cp = new SVG.Rx.Point(cp.x, cp.y);
      this._r = new SVG.Rx.Dist(r);
      this._angle = new SVG.Rx.Angle(angle);

      // Merge the location and angle into one Observable
      //
      this._obs = this._cp.subscribe().combineLatest(
        this._angle.subscribe(),
        function (cp,rad) {
          return {
            x: cp.x,
            y: cp.y,
            rad: rad
          };
        }
      )

      this._locked = false;
      this._joinedFromObs = [];
      this._joinedToObs = [];

      // Path via the tips: (r,0), (-r/2,(± r*sqrt(3)/2)
      //
      var b= r*Math.sqrt(3)/2;

      var path = "M0,"+r+
        "L"+(-r/2)+","+b+
        "l0,-"+(2*b)+
        "z";

      this.center(cp.x, cp.y);
      this.path(path);
      this.rotate(angle);

    },
    inherit: SVG.Rx.Group,

    construct: {          // parent method to create these
      my_triangle: function (cp,r,rad) {   // ({x:Num,y:Num}, Num, Num) -> SVG.Rx.MyTriangle

        return this.put(new SVG.Rx.MyTriangle(cp,r,rad));
      }
    },

    extend: {
/***
      // Lock the triangle so it won't move or rotate (either when directly manipulated or via changes in the
      // connecting paths.
      //
      lock: function (b) {    // (Boolean) -> this
        this._locked = b;
        return this;
      },

      // Check if the triangle is locked
      //
      isLocked: function (b) {    // () -> Boolean
        return this._locked;
      } //,
***/

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
    }
  });

})();

/*
* Actual demo
*/
(function() {
  "use strict";

  var R= 30;

  var svg = SVG("cradle");

  function degToRad(deg) {
    return deg * (Math.PI/180.0);
  }

  var function my_triangle( ) {   // (x:Num, y:Num, r:Num, rad:Num)
  }

  var t1 = svg.my_triangle( 100,100, R, 0 );
  var t2 = svg.my_triangle( 200,150, R, degToRad(-90) );
  var t3 = svg.my_triangle( 300,200, R, 0 );

  //t1.tieTo(t2);
  //t2.tieTo(t3);

})();
