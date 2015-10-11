/*
* demo3.js
*
* Simple rectangle, getting its moves from an RxJs observable.
*/

$(function() {
    var W= 100;
    
    var svg = SVG("cradle");   // fills the cradle fully
    
    /*
    * This rectangle is simply moved by the cursor. Note that unlike with other SVG draggable
    * API's, the library does not actually move the object (this allows us to do anything with
    * the drag streams that we get). 
    *
    * Note: It's simple to do a 'just move' helper method if there's need for such.
    */
    var rect= svg.rect( W, W )
                .addClass("main");
    
    var outerObs = rect.rx_draggable();      // observable of observables of {x:int,y:int}
    
    outerObs.subscribe( function(dragObs) {
        //console.log("Drag started");
    
        dragObs.subscribe( function(o) {       // {x:Int,y:Int}
            //console.log( JSON.stringify(o) );
            rect.move(o.x, o.y);
        },
        function () {
            //console.log("Drag ended");
        } );
    } );
});
