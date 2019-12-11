/*
* assert.js
*
* Common dependency providing 'assert' for anyone wanting one (in this project).
*
* Note:
*   Doing it so because there wasn't a clear way to dependency-inject an assert from the top-down.
*
*   See -> https://stackoverflow.com/questions/39883960/what-is-the-typescript-2-0-es2015-way-to-import-assert-from-node-js
*   Track -> https://stackoverflow.com/questions/59274936/how-to-provide-a-global-assert-for-everyone-in-a-sapper-app
*/

// BUG: This works for server, but not for client:
//  <<
//  $ npm run dev
//      ...
//      • client
//      'assert' is imported by src/assert.js, but could not be resolved – treating it as an external dependency
//      ✔ server (4.8s)
//      Imported: function strict(...args) {
//          innerOk(strict, args.length, ...args);
//      }
//  <<

/* HELP:
 *  Importing 'assert' works in Sapper 'server', but not in 'client' side.
 *
 *  Tried two different ways - different problems.
 *
 * 1. const sa = require("assert").strict;
 *  <<
 *      $ npm run dev
 *
 *      > svg.rx.js@0.0.6-svelte-sapper-maybe dev /Users/asko/Git/svg.rx.js
 *      > sapper dev
 *
 *      ✔ client (1.7s)
 *      ✔ server (1.7s)
 *      Imported: function strict(...args) {
 *          innerOk(strict, args.length, ...args);
 *      }
 *  <<
 *
 * This passes the builds, but at runtime:
 *
 *      http://localhost:3000/circles
 *          ->
 *      <<
 *          500
 *              Can't find variable: require
 *
                module code@http://localhost:3000/client/circles.9fba14dc.js:53:19
 *              evaluate@[native code]
 *              moduleEvaluation@[native code]
 *              [native code]
 *              asyncFunctionResume@[native code]
 *              [native code]
 *              promiseReactionJob@[native code]
 *      <<
 *
 * How to fix that?  (and what's actually going on......?)  :?
 *
 * 2. import { strict as sa } from 'assert';
 *
 * Would like to use this one (since it's ES6 import syntax). It creates a warning at client compile:
*   <<
*       'assert' is imported by src/assert.js, but could not be resolved – treating it as an external dependency
*   <<
*
* At runtime:
*   <<
*       500
*           Module specifier does not start with "/", "./", or "../".
*
*           resolveSync@[native code]
*           [native code]
*           asyncFunctionResume@[native code]
*           [native code]
*           promiseReactionJob@[native code]
*   <<
*/
//const sa = require("assert").strict;
//import { strict as sa } from 'assert';        // we can change which assert we use in one place


assert = (cond, msg) => {
    if (cond) return;
    msg |= "Assertion failed!";
    console.assert(cond, msg);
    debugger;
    throw new Error(msg);
};



console.debug( "Imported: "+ sa );

sa.ok(true);
sa(true);

export { sa as assert };
