/*
* common.js
*
* Tools common to all the tests
*/
/*global: SVG, assert*/
/*jshint devel: true */

// Create just one SVG cradle (not a new one to each test)
//
var svg = SVG( document.body );   // just append the SVG to the body

SVG.extend( SVG.Element, {

  /*
  * Transform a coordinate from some SVG element to the coordinates of the enclosing SVG.Doc.
  */
  transformBack: function (x,y) {    // (Num,Num) -> {x:Num,y:Num}
    var m= this.ctm();

    // This should take into account also rotation.
    //
    // See -> http://stackoverflow.com/questions/18554224/getting-screen-positions-of-d3-nodes-after-transform/18561829
    //
    return {
      x: m.e + x*m.a + y*m.c,
      y: m.f + x*m.b + y*m.d
    }
  },

  /*
  * Simulate dragging
  *
  * Note: The effects of the dispatched events are available right after returning from the function (ie. handling
  *      the events seems to be synchronous).
  */
  simulateDrag: function (dx,dy) {    // (Num,Num) ->
    var self= this;

    // Create 'mousedown', 'mousemove' or 'mouseup' events
    //
    var mouseEvent = function (eventName, o) {   // (String,Object) -> MouseEvent
      var ev;

      // Add fields that are same for all calls
      //
      o.button = 0;      // 0: primary button
      o.bubbles = true;
      o.cancelable = true;    // event's default action can be prevented (does not seem to matter)

      // PhantomJS (at least 1.9.7, which is used by 'mocha-phantomjs' still in May 2016) seems to need a workaround.
      //
      // [ ] 'npm install phantomjs-prebuilt' installs a later (2.1.1) PhantomJS. How to make 'mocha-phantomjs' use it? AKa090516
      //
      // See -> https://github.com/ariya/phantomjs/issues/11289
      //
      try {
        ev= new MouseEvent( eventName, o );
      } catch(e) {
        // PhantomJS
        //
        // See -> https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/initMouseEvent
        //
        ev = document.createEvent('MouseEvent');
        ev.initMouseEvent(
          eventName,    // type
          o.bubbles,    // canBubble
          o.cancelable, // cancelable
          window,       // view
          undefined,    // detail
          undefined,    // screenX
          undefined,    // screenY
          o.clientX,    // clientX
          o.clientY,    // clientY
          false,        // ctrlKey
          false,        // altKey
          false,        // shiftKey
          false,        // metaKey
          o.button,     // button
          null          // relatedTarget ("pass null" - if not 'mouseover' or 'mouseout')
        );
      }

      return ev;
    }

    // See:
    //    MouseEvent documentation (Mozilla) -> https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent
    //    Simulating Mouse Events in JavaScript -> http://marcgrabanski.com/simulating-mouse-click-events-in-javascript/
    //
    // 'svg.rx.js' uses the following events:
    //    "mousedown" (caught at the element level)
    //      .button: 0
    //      .clientX
    //      .clientY
    //    "mousemove" (caught at the window level)
    //      .button 0
    //      .clientX
    //      .clientY
    //    "mouseup" (caught at the window level)
    //      .button 0
    //
    // Note: The correctness of our '.clientX' and 'clientY' coordinates is not that important: the dragging code will
    //    not check whether the coordinates actually fell within the borders of the SVG element. It just uses the diff
    //    to the next coordinates to do dragging (also, there's no scaling involved).
    //
    var CX= 0, CY= 0;   // the constants don't matter

    self.native().dispatchEvent( mouseEvent( 'mousedown', { clientX: CX, clientY: CY } ) );
    window.dispatchEvent( mouseEvent( 'mousemove', { clientX: CX+dx, clientY: CY+dy } ) );
    window.dispatchEvent( mouseEvent( 'mouseup', {} ) );
  }
});
