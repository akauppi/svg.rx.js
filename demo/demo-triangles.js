/*
* demo-triangles.js
*/
/*jshint devel: true */
/*globals assert */

function selectTriangle(el) {
  "use strict";

  el.parent().select(".selected").removeClass("selected");
  el.addClass("selected");
}

/*
* A custom SVG component
*/
(function() {
  "use strict";
  assert(assert);

  var RAD2DEG = 180.0 / Math.PI;

  // A function used when hiding out svg.js methods
  //
  function notSupported (s) {   // (String) -> () -> never returns
    return function () {
      throw "Access to method '"+s+"' not supported in 'svg.rx.js'";
    }
  }

  SVG.Rx = SVG.Rx || {};

  function dragIt( el ) {     // (SVGElement) ->
    el.rx_draggable().subscribe( function (dragObs) {

      // Drag started
      selectTriangle(el);

      dragObs.subscribe( function (o) {
        //console.log(o);
        el.translate( o.x, o.y );
      });
    });
  }

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
      var self= this;

      this.constructor.call(this, SVG.create('g'));

      this._locked = false;

      // Path via the tips: (UNIT,0), (-UNIT/2,(± UNIT*sqrt(3)/2))
      //
      // tbd. eventually make this path into a symbol.
      //
      var B= r*Math.sqrt(3)/2;

      var p = "M"+r+",0"+
        "L"+(-r/2)+","+B+
        "l0,-"+(2*B)+
        "z";

      this.path(p);

      var dist = 1.8*B;
      var g2 = this.group().addClass("handle").back();
        //
        g2.line(0,0,dist,0);
        var dot= g2.circle(15).center(dist,0);

      // Make handle change the rotation of the group
      //
      dot.rx_draggable()      // observable of observables of {x:int,y:int}
        .subscribe( function(dragObs) {
          // keep initial rotation
          var preDeg = self.transform('rotation');    // just gives the rads

          dragObs.subscribe( function(o) {       // {x:Int,y:Int}

            console.log(o.y, o.x);
            var rad = Math.atan2(o.y,o.x);
            self.rotate(preDeg + rad * RAD2DEG,0,0);
          },
          function () {   // drag ended
          } );
      } );

      //this.translate(r/2,B);   // make rotational center the triangle's origin

      dragIt(this);   // all triangles draggable (unless locked, tbd.)

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
      //x: notSupported('x'),
      //y: notSupported('y'),
      //move: notSupported('move'),

      //cx: notSupported('cx'),
      //cy: notSupported('cy'),
      //center: notSupported('center'),

      // note: 'width', 'height' and 'size' are constant, since we handle all movement and rotation via the transforms.
      //      There is no real need for them. AKa070216,AKa140216
      //
      //width: notSupported('width'),
      //height: notSupported('height'),
      //size: notSupported('size'),

      /***
      rotateRad: function (rad) {      // (Num) -> this
        var RAD_TO_DEG = 180.0 / Math.PI;
        this.rotate( rad * RAD_TO_DEG );
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
  assert(assert);

  var R= 30;
  var RAD2DEG = 180.0 / Math.PI;

  var svg = SVG("cradle");

  var t1 = svg.my_triangle(R).move(100,100);
  var t2 = svg.my_triangle(R).move(200,150);
    t2.rotate(-40);
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

  var canvasDrags = 0;    // number of simultaneous canvas drags

  // Allow creation of new triangles, and rotation of old ones
  //  - touching on canvas while dragging a triangle changes its orientation
  //  - pointing on canvas, with Shift, does the same
  //
  svg.rx_draggable().subscribe( function (dragObs) {
    canvasDrags += 1;
    console.log( "canvas drag: "+ canvasDrags );

    // This subscription simply to pull down 'canvasDrags' once the drag ends
    //
    dragObs.subscribe(
      null,   // drag events
      null,   // error handling
      function () {  // end of drag
        canvasDrags -= 1;
      }
    );

    var hasShift = window.event.shiftKey;   // state of Shift at last event

    if (canvasDrags === 1 && !hasShift) {   // create new triangle
      var t= svg.my_triangle(R);   // ready, visible
      var circle= svg.circle(10);         // ready, hidden
      var rect= svg.rect().width(2*30).height(2*30).addClass("debug");

      t.rotate( Math.random() * 360 );

      selectTriangle(t);

      dragObs.subscribe(
        function (o) {
          console.log( "Dragging: "+ o.x + " "+ o.y );

          // BUG: The group's 'move' and 'center' shouldn't be used.
          //
          if (true) {
            t.translate(o.x, o.y);
          } else {
            t.center(o.x, o.y);     // 'x','y' are the actual touch/pointer coords, because we are tracking 'svg'
          }

          circle.center(o.x,o.y).show();
          rect.center(o.x,o.y);

        },
        null,   // error handling
        function () {  // end of drag
          // leave the triangle
          circle.remove();
          rect.remove();
        }
      );
    } else if ((canvasDrags === 2) || (canvasDrags === 1 && hasShift)) {   // rotate selected triangle
      var selected = svg.select(".selected").members[0];

      //console.log(selected);

      if (selected) {
        var preDeg = selected.rotate();

        dragObs.subscribe(
          function (o) {
            console.log( "Dragging: "+ o.x + " "+ o.y, selected.transform("x"), selected.transform("y") );

            var dx= o.x - selected.transform("x");
            var dy= o.y - selected.transform("y");

            var rad= Math.atan2(dy,dx);
            selected.rotate(preDeg + rad * RAD2DEG, 0,0);
          },
          null,   // error handling
          null // end of drag
        );
      }
    }
  });
})();
