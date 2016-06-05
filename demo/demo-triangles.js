/*
* demo-triangles.js
*/
/*jshint devel: true */
/*globals assert, Gx */

var RAD2DEG = (180.0 / Math.PI);

/*
* '.gxTriangle' component
*/
(function () {
  "use strict";

  assert(Gx);

  // Define the triangle just once, as a symbol. Then 'use' it.
  //
  // Note: The symbol needs to be defined completely in the positive x/y quadrant; the rest is not going to be visible.
  //
  var R=30,     // radius of the triangle
    B= R*Math.sqrt(3)/2,
    D= 2.0 * B;    // distance of the line to the handler circle

  var originX = R,
    originY = R;

  //--- rotational handler ---
  //
  // The rotational handler is attached to each 'GxTriangle'. The cost of this are some SVG elements per entry,
  // but doing so allows us to have multiple triangles simultaneously rotatable.
  //
  // There may be other ways to this, and it's not initially happening, anyways. But theoretically, on a large
  // touch table, this could be a useful feature. AKa220516
  //
  var addHandler = function (gxt) {    // (GxTriangle) ->

    var g = gxt.el(false).group().addClass("handle").back();  // inner element (this will rotate together with 'gtx')
      //
      g.line(0,0,D,0);
      var dot= g.circle(15).center(D,0);
      //
      //g.circle(1.9*R).center(0,0).front().addClass("debug");   // to see where the triangle rotates

    g.move(originX, originY);

    // Make handle change the rotation of the group
    //
    dot.rx_draggable()      // observable of observables of {x:int,y:int}
      .subscribe( function(dragObs) {
        var preDeg = gxt.rotDeg();    // keep initial rotation

        dragObs.subscribe( function(o) {       // {x:Int,y:Int}
          //console.log(o.x, o.y);
          var rad = Math.atan2(o.y,o.x);
          gxt.rotDeg(preDeg + rad * RAD2DEG);
        },
        function () {   // drag ended
        } );
    } );
  }

  //--- GxTriangle ---
  //
  // Use:
  //    <parent>.gxTriangle()       // () -> GxTriangle
  //
  // ._xxx: String    tbd. describe members here
  //
  // .select()        Marks the triangle as the selected one (clears an earlier selection)
  //
  var GxTriangle = function (parent) {    // (SVG.Doc) ->
    var self= this;

    // Create the symbol, if first time here for 'parent'.
    //
    var use = parent.use( Gx.cache( parent, "GxTriangle.symbol", function (svg) {
      var sym = svg.symbol();

      sym.path( "M"+(2*R)+","+R+
        "l"+(-3*R/2)+","+B+
        "l0,-"+(2*B)+
        "z");

      return sym;
    } ) );

    Gx.call( this, parent, use, "gxTriangle" );

    addHandler(this);

    this.origin( originX, originY );

    this._xxx = "xxx";

    this.draggable( function () {   // drag started
      self.select();
    });
  };

  GxTriangle.prototype = Object.create(Gx.prototype);

  /*
  * Marks the triangle as selected; clears an earlier selection
  */
  GxTriangle.prototype.select = function () {
    var el = this.el(true);

    el.parent().select(".selected").removeClass("selected");
    el.addClass("selected");
  }

  SVG.extend( SVG.Doc, {
    gxTriangle: function () {
      return new GxTriangle(this);
    }
  });

})();

/*
* Actual demo
*/
(function() {
  "use strict";

  var R= 30;
  var RAD2DEG = 180.0 / Math.PI;

  var svg = SVG("cradle");

  var t1 = svg.gxTriangle(R).pos(100,100);
  var t2 = svg.gxTriangle(R).pos(200,150).rotDeg(-40);
  var t3 = svg.gxTriangle(R).pos(300,200);

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
      var t= svg.gxTriangle(R);   // ready, visible
      var circle= svg.circle(10);         // ready, hidden
      var rect= svg.rect().width(2*30).height(2*30).addClass("debug");

      // tbd. enable
      //t.rotDeg( Math.random() * 360 );

      t.select(t);

      dragObs.subscribe(
        function (o) {
          //console.log( "Dragging: "+ o.x + " "+ o.y );

          // Note: Don't use a group's '.move' or '.center'
          //
          t.pos(o.x, o.y);    // 'x','y' are the actual touch/pointer coords, because we are tracking 'svg'

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
      var selected = svg.select(".selected").members[0].asGx;

      console.log("Should rotate!", selected);

      if (selected) {
        dragObs.subscribe(
          function (o) {
            var selX = selected.transform("x");
            var selY = selected.transform("y");

            var rad= Math.atan2(o.y - selY, o.x - selX);
            selected.rotDeg(rad * RAD2DEG);
          },
          null,   // error handling
          null // end of drag
        );
      }
    }
  });
})();

