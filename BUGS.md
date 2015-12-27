# BUGS

- If the SVG area is scrolled partly out-of-bounds, the dragged circles (demo4) come in wrong places. AKa271215

- The caching in demo4 does not work. (internal but still worth checking) AKa271215

- In demo4, circles tend to remain on the screen. That should never happen. Try with multiple fingers for a while. AKa271215


## Testing system

- Using `npm run jshint` with an external configuration (with `-config`) fails in a crash if there are hint errors. Replicate in a simple repo and report to:

```
antonkovalyov <anton@kovalyov.net>
rwaldron <waldron.rick@gmail.com>
jugglinmike <mike@mikepennisi.com>
```

This may be the expected behaviour, but may be worth checking. (give them link to this repo). AKa271215

