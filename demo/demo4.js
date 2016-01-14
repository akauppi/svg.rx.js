/*
* demo4.js
*
* Multi-touch demo #1
*
* For each touch, a circle will be created and following that touch.
*
* Credit:
*   http://tomicloud.com/2012/03/multi-touch-demo
*/
/*jshint devel: true */

(function() {
  "use strict";

  var R=100;
  var COLORS=10;    // 0..9 in the CSS

  var svg = SVG("cradle");

  var c= -1;   // next CSS color to use

  // Note: Within the multi-touch demo, it is obvious we should have some back pressure handling in place. Moving
  //      the SVG circles through all the received coordinates is unnecessary - the circles drag behind the finder.
  //      However, how to implement this currently (rx-lite 4.0.7; 9-Jan-16) is by no means clear.
  //
  //      Tried all the suggested approaches; none of them work.
  //
  //        - 'dragObs.throttleFirst' simply didn't exist (should be there!)
  //        - with '.sample', we got "triggerObs.onNext is not a function" (but it should be!)
  //
  //      Using '.sample' with a trigger managed here on the application side is probably the best approach, but didn't
  //      get even that to work (see below).
  //
  //      RxJS documentation says about these things:
  //
  //        "In future versions of RxJS, the idea of the controlled observable will be baked into the subscription
  //        itself which then allows the backpressure to be an essential part of the contract or requesting n number of items."
  //
  //      Ref.
  //        RxJS Getting Started > Backpressure -> https://github.com/Reactive-Extensions/RxJS/blob/master/doc/gettingstarted/backpressure.md
  //
  svg.rx_draggable().subscribe( function (dragObs) {
    c = (c+1) % COLORS;

    var circle = svg.circle(R).addClass("n"+c).hide();
    var fresh = true;

    // Handle back pressure by getting new entries only in response to our triggers.
    //
    var triggerObs = new Rx.Subject().startWith(true);

    // tbd. What, there's no '.throttleFirst'? AKa090116
    //
    //console.log(dragObs.throttleFirst);

    // BUG: 'triggerObs.onNext' does not exist
    //
    console.log( triggerObs.onNext );   // undefined

    dragObs.sample(triggerObs)
      .subscribe(
        function (o) {
          //console.log( "Dragging: "+ o.x + " "+ o.y );
          circle.center(o.x, o.y);

          if (fresh) {
            circle.show();
            fresh = false;
          }
          triggerObs.onNext(true);   // ready for the next value
        },
        null,   // error handling
        function () {  // end of drag
          circle.remove();    // remove from 'svg'
          triggerObs.dispose();
        }
      );
  });

})();
