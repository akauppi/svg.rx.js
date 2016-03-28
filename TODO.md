# TODO

- demo-triangles further

- Using streams for an animation API
  - test with demo 4, at least

- Clean up the code and documentation

- Consider if svg.js could be left out (direct access to browser's SVG API)

- Package for npm (not Bower!)

- `Rx.config.longStackSupport = true`
  "When running the same example again with the flag set at the top, our stack trace looks much nicer and indicates exactly where the error occurred:"
  https://github.com/Reactive-Extensions/RxJS/blob/master/doc/gettingstarted/testing.md  
  
## Features

- In demo3, make the line between the knob and the base follow moves declaratively. Also, make constraints (in angles) for the movement of the knob, declaratively.

- Would someone with Microsoft devices (using `pointerdown` etc.) want to suggest PR's? See -> [Issue #2](https://github.com/akauppi/svg.rx.js/issues/2)

- Once ES7 `Observable`s are out, check if they are enough for us (i.e. would we still need/benefit from RxJS)

- is there a case to support mouse buttons other than the first?


## Optimizations
 
- How to optimize so that only the last event would ever be shipped, if multiple have gathered, i.e. we only need the last coordinates. AKa071015

- i.e. if the drag produces more coordinates than the subscriber can handle, we'd be okay always skipping to the latest one. How to formulate this in RxJS? (ask in StackOverflow) AKa251015
 
## Packaging

- Package using `npm` (already done the basics)

<!--
Note: We're not very pleased with Bower overall. If you have suggestions on better packaging framework, please suggest (or better yet, pass a PR). AKa131215 
-->

<br />
