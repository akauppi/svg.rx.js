/*
* assert.js
*
* Provide global debugging features.
*/
"use strict";
/* exported assert */

function assert(b,msg) {    // (boolish, String) =>
  if (!b) {
    throw ("Assert failed" + (msg ? ": "+msg : ""))
  }
}
