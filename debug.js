/*
* debug.js
*
* Just stuff for any experiments.
*/
/*jshint devel: true */

(function() {
  "use strict";

  function assert(b,msg) {    // (boolish, String) =>
    if (!b) {
      throw ("Assert failed" + (msg ? ": "+msg : ""))
    }
  }

  var svg = SVG("cradle");

  var last = {};     // { [touchId]: "touchstart"|"touchmove"|"touchend"; ... }

  var genHandler = function (name) {
    return function (ev) {

      // '.preventDefault' e.g. prevents the event from causing a scroll (Safari iOS)
      //
      if (name === "touchstart") {
        ev.preventDefault();
        ev.stopPropagation();
      }

      console.log(ev.changedTouches);

      // Note: 'ev.changedTouches' does not work like an array, i.e. no '.map' and such. AKa131215
      //
      var s="";
      var i,touch;

      for( /*var*/ i=0; i< ev.changedTouches.length; i++ ) {
        /*var*/ touch = ev.changedTouches[i];
        var x = touch.clientX;
        var y = touch.clientY;
        s += touch.identifier + ": "+ x +" "+ y + " ";
      }

      console.log(name + " "+ s);

      for( i=0; i< ev.changedTouches.length; i++ ) {
        touch = ev.changedTouches[i];

        if (name === "touchstart") {
          assert(last[i] === undefined);
        } else {
          assert(last[i] !== undefined);
        }

        if ((name !== "touchend") && (name !== "touchcancel")) {
          last[i]= name;
        } else {
          delete last.name;   // clear the field
        }
      }
      console.log(last);
    }
  }

  svg.node.addEventListener("touchstart", genHandler("touchstart"), false);
  svg.node.addEventListener("touchend", genHandler("touchend"), false);
  svg.node.addEventListener("touchcancel", genHandler("touchcancel"), false);
  svg.node.addEventListener("touchmove", genHandler("touchmove"), false);
}());
