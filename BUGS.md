# BUGS

- If the SVG area is scrolled partly out-of-bounds, the dragged circles (demo4) come in wrong places. AKa271215

<!-- Probably got this fixed today? AKa060116
- In demo4, circles sometimes (now rare) remain on the screen. AKa271215, AKa060116
-->

## Testing system

- Using `npm run jshint` with an external configuration (with `-config`) fails in a crash if there are hint errors. Replicate in a simple repo and report to the people mentioned in the crash log:

```
antonkovalyov
rwaldron
jugglinmike
```

This may be the expected behaviour, but may be worth checking. (give them link to this repo). AKa271215

