# BUGS

- in demo2, the knob does not follow the mouse precisely. This is because the drag stream gets the element x,y coordinates but moving the element is done with cx,cy.

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

<br />
