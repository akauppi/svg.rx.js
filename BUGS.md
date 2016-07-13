# BUGS

- `demo/halo.html` shows problems in the positioning of symbols. 

We should get the symbols within the red squares

- so that they scale according to browser zoom changes (remain in the boxes)
- so that rotating with the disc (pink part), rotates the symbols in place

Also in `demo/halo.html`, the rotation of the disk is not correct, but that's a 
minor bug.


## Testing system

- Using `npm run jshint` with an external configuration (with `-config`) fails in a crash if there are hint errors. Replicate in a simple repo and report to the people mentioned in the crash log:

```
antonkovalyov
rwaldron
jugglinmike
```

This may be the expected behaviour, but may be worth checking. (give them link to this repo). AKa271215

<br />
