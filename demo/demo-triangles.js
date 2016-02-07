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
  //  ._joinedFromObs: Array of Observable of [{x:Num, y:Num, angle:Num}]
  //  ._joinedToObs: Array of Observable of [{x:Num, y:Num, angle:Num}]
  //
  //  .lock(Boolean)
  //  .isLocked()
  //  .tieFrom( Observable of {x:Num, y:Num, angle:Num} )
  //  .tieTo( Observable of {x:Num, y:Num, angle:Num} )
  //
  SVG.Rx.MyTriangle = SVG.invent({
    create: function (cp,r,angle) {   // ({x:Num,y:Num}, Num, Num) ->
      var self= this;

      this.constructor.call(this, SVG.create('g'));

      this._cp = new SVG.Rx.Point(cp.x, cp.y);
      this._r = new SVG.Rx.Dist(r);
      this._angle = new SVG.Rx.Angle(angle);

      this._obs =

      this._locked = false;
      this._joinedFromObs = [];
      this._joinedToObs = [];

      // Path via the tips: (r,0), (-r/2,(± r*sqrt(3)/2)
      //
      var b= r*Math.sqrt(3)/2;

      var path = "M0,"+r+
        "L"+(-r/2)+","+b+
        "l0,-"+(2*b),
        "z";

      this.center(cp.x, cp.y);
      this.path(path);
      this.rotate(angle);

    },
    inherit: SVG.Group,

    construct: {          // parent method to create these
      myTriangle: function (cp,r,angle) {   // (SVG.Rx.Point, SVG.Rx.Dist, SVG.Rx.Angle) -> SVG.Rx.MyTriangle

        return this.put(new SVG.Rx.MyTriangle(cp,r,angle));
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
      isLocked: function (b) {    // () -> Boolean
        return this._locked;
      },

      // Add an incoming connection (there may be 0,1 or 2 in real application)
      //
      tieFrom: function (obs) {   // (Observable of {x:Num, y:Num, angle:Num}) -> this
        this._joinedFromObs.push(obs);
      },

      // Add an outgoing connection (there may be 0,1 or 2 in real application)
      //
      tieTo: function (obs) {   // (Observable of {x:Num, y:Num, angle:Num}) -> this
        this._joinedToObs.push(obs);
      },
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

  var t1 = svg.my_triangle( 100,100, 30, 0 );
  var t2 = svg.my_triangle( 200,150, 30, -90 ).tieFrom(t1);
  var t3 = svg.my_triangle( 300,200, 30, 0 ).tieFrom(t2);

  /*** disabled
  dragIt(t1);

  function dragIt( el ) {     // (SVGGroup) ->
    el.rx_draggable().subscribe( function (dragObs) {

      dragObs.subscribe( function (o) {
        el.center( o.x, o.y );
      });
    });
  }
  ***/
})();
