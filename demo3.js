/*
* demo3.js
*
* Sample for showing binding of SVG graphics with RxJs.
*
* Simple rectangle, getting its moves to an RxJs observable.
*/

$(function() {
    var W= 100;

    var svg = SVG("cradle");   // fills the cradle fully

    var rect= svg.rect( W, W )
                .addClass("main");

    var obs = rect.draggable();

    obs.subscribe( function(o) {
        console.log(o);
    } );
});
