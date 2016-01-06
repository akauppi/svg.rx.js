# BUGS

- If the SVG area is scrolled partly out-of-bounds, the dragged circles (demo4) come in wrong places. AKa271215

- In demo4, circles sometimes (now rare) remain on the screen. AKa271215, AKa060116


## Testing system

- Using `npm run jshint` with an external configuration (with `-config`) fails in a crash if there are hint errors. Replicate in a simple repo and report to:

```
antonkovalyov <anton@kovalyov.net>
rwaldron <waldron.rick@gmail.com>
jugglinmike <mike@mikepennisi.com>
```

This may be the expected behaviour, but may be worth checking. (give them link to this repo). AKa271215

