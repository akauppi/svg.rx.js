# Known Issues


## Why does the screen clear?

It's a bit annoying that Svelte or Rollup clear the screen so often. 

Track [this](https://github.com/rollup/rollup/issues/2820).

---

More info:

```
        watch: {
            clearScreen: false
        }
```

..in `rollup.config.js` switches off another screen clear - not this one. :/


## Circular dependency warnings for `chai` 4.x

```
$ npm run test:build
...
(!) Circular dependencies
node_modules/chai/lib/chai.js -> node_modules/chai/lib/chai/utils/index.js -> node_modules/chai/lib/chai/utils/addProperty.js -> node_modules/chai/lib/chai.js
node_modules/chai/lib/chai.js -> node_modules/chai/lib/chai/utils/index.js -> node_modules/chai/lib/chai/utils/addProperty.js -> /Users/asko/Git/svg.rx.js/node_modules/chai/lib/chai.js?commonjs-proxy -> node_modules/chai/lib/chai.js
node_modules/chai/lib/chai.js -> node_modules/chai/lib/chai/utils/index.js -> node_modules/chai/lib/chai/utils/addMethod.js -> node_modules/chai/lib/chai.js
...and 4 more
```

Please ignore those. Nothing we can do (tbd. do you know how to suppress such a warning?).

Chai 5.x [should (pun) bring a rescue](https://github.com/chaijs/chai/issues/1256).


<!-- disabled (got rid of it?)
## "address already in use :::35729"

This occurs with `npm test:dev`. Reason unlcear.

```
...
[rollup] Error: listen EADDRINUSE: address already in use :::35729
[rollup]     at Server.setupListenHandle [as _listen2] (net.js:1308:16)
[rollup]     at listenInCluster (net.js:1356:12)
[rollup]     at Server.listen (net.js:1444:7)
[rollup]     at Server.listen (/Users/asko/Git/svg.rx.js/node_modules/livereload/lib/livereload.js:80:28)
[rollup]     at Object.exports.createServer (/Users/asko/Git/svg.rx.js/node_modules/livereload/lib/livereload.js:245:14)
[rollup]     at livereload (/Users/asko/Git/svg.rx.js/node_modules/rollup-plugin-livereload/dist/index.cjs.js:20:29)
[rollup]     at Object.<anonymous> (/Users/asko/Git/svg.rx.js/rollup.test.config.js:71:13)
[rollup]     at Module._compile (internal/modules/cjs/loader.js:1139:30)
[rollup]     at Object.require.extensions.<computed> (/Users/asko/Git/svg.rx.js/node_modules/rollup/dist/bin/rollup:832:24)
[rollup]     at Module.load (internal/modules/cjs/loader.js:988:32) {
[rollup]   code: 'EADDRINUSE',
[rollup]   errno: -48,
[rollup]   syscall: 'listen',
[rollup]   address: '::',
[rollup]   port: 35729
[rollup] }
```

Cure for now: no `--kill-...`
-->