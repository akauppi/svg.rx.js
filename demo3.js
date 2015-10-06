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

    var source = Rx.Observable.fromEvent(rect.node, 'click');

    source.subscribe(
        function (x) {
            console.log(x);
        }
    );

    var obs = rect.rx_draggable();      // should be an observable of observables of {x:int,y:int}
    console.log(obs);

    /***
    obs.subscribe( function(o) {
        console.log(o);
    } );
    ***/
});
