# TODO

- Clear the `npm run jshint` output (globals)

- Using `npm run jshint` with an external configuration (with `-config`) fails, always. 

The error says should be reported to:

```
antonkovalyov <anton@kovalyov.net>
rwaldron <waldron.rick@gmail.com>
jugglinmike <mike@mikepennisi.com>
```

Do this once otherwise fine, and pushed to the github (ie. can give them instructions to reproduce).

---

Note: We're not very pleased with Bower overall. If you have suggestions on better packaging framework, please suggest (or better yet, pass a PR). AKa131215 

```
// tbd. How to optimize so that only the last event would ever be shipped, if multiple have gathered, i.e. we only need the last coordinates. AKa071015
```

- i.e. if the drag produces more coordinates than the subscriber can handle, we'd be okay always skipping to the latest one. How to formulate this in RxJS? (ask in StackOverflow) AKa251015

- Would someone with Microsoft devices (using `pointerdown` etc.) want to suggest PR's? See -> [Issue #2](https://github.com/akauppi/svg.rx.js/issues/2)

- Adding support for more (touch) events: swipes, rotation etc. IF these need SVG specific help. I would like to see this coming up via real world needs, not #justforthesakeofit. If needed, using something like the [deeptissue.js](http://deeptissuejs.com) project may be okay, but I'd rather keep the `svg.rx.js` code really, really slim.

---

## Follow

- use [RxJS 5.0](https://github.com/ReactiveX/RxJS) when appropriate. It e.g. binds together with the ES7 built-in Observable Spec.

  - or tie directly to the ES7 `Observable`s (if they are enough for us)
