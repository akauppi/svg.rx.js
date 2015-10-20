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
    * Helper function for dragging.
    */
    var dragItWithFilter = function (outerObs,conv,f) {        // (observable of observables of {x:int,y:int}, (observable of {x:int,y:int}) => observable of T, (T) =>)
        outerObs.subscribe( function(dragObs) {
          //console.log("Drag started");
          conv(dragObs).subscribe(f,
          function () {
            //console.log("Drag ended");
          } );
        } );
    }

    var g = svg.group().move(100,100);

    g.circle(2*A).addClass("knob").center(0,0);
    g.rect(B+C/2,C).addClass("lever").move(-C/2,-C/2);
    var handle = g.circle(D).addClass("handle").center(B,0);

    g.circle(X).addClass("origin").center(0,0);     // debugging

    //g.animate().rotate(-45,0,0);

    var pivotX = 0,
        pivotY = 0;

    // Tie dragging the 'handle' to rotating the whole group.
    //
    // Note: This could be done simpler but wanted to show how a 'deg' observable can be created. It can be useful
    //      e.g. if a value should be shown in some text field.
    //
    // tbd. Is there an RxJS method that does both filter and map?
    //
    dragItWithFilter( handle.rx_draggable(),

        function (dragObs) {   // (observable of {x:int,y:int}) => observable
            return dragObs.map( function (o) {  // ({x:int, y:int}) => degNum|null
                var dx = o.x - pivotX,
                    dy = o.y - pivotY;

                if (dx && dy) {
                    var deg = Math.atan2(dy,dx) * (180.0/Math.PI);
                    return deg;
                } else {
                    return null;
                }
            }).filter( function(degOrNull) { return degOrNull !== null; } )
        },

        function (deg) {    // (degNum) =>
            g.rotate(deg,pivotX,pivotY);
        }
    );
});
