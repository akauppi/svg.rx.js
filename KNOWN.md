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


