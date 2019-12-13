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
