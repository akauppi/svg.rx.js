/*
* demo2.js
*
* A rotary group.
*/

$(function() {
    var A= 50;     // radius of the rotating circle
    var B= 75;     // distance of the handle origin from rotating origin
    var C= 10;     // width of the lever
    var D= 20;     // radius of the handle circle
    var X= 5;

    var svg = SVG("cradle");

    /*
    * Helper function for a rotational drag
    */
    var dragIt = function (el,f) {        // (SVGElem, ({x:int,y:int}) =>) =>
        el.rx_draggable()      // observable of observables of {x:int,y:int}
          .subscribe( function(dragObs) {
            //console.log("Drag started");
            dragObs.subscribe(f,
            function () {
              //console.log("Drag ended");
            } );
          } );
    }

    var g = svg.group().move(75,75);

    g.circle(2*A).addClass("knob").center(0,0);
    g.rect(B+C/2,C).addClass("lever").move(-C/2,-C/2);
    var handle = g.circle(D).addClass("handle").center(B,0);

    g.circle(X).addClass("origin").center(0,0);     // debugging

    g.rotate(-45);

    var pivotX = g.cx(),
        pivotY = g.cy();

    // Tie dragging the 'handle' to rotating the whole group
    //
    dragIt( handle,
        function (o) {     // ({x:int, y:int}) =>
            var dx = o.x - pivotX,
                dy = o.y - pivotY;

            if (dx && dy) {
                var deg = Math.atan2(dx,dy) * (180.0/Math.PI);
                g.rotate(deg);
            }
        }
    );
});
