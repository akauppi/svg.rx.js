# TODO

- Check through the README

- Animation of demo 4, using CSS

- Clean up the code and documentation

- Package for npm (not Bower!)

 
## Features

- In demo3, make the line between the knob and the base follow moves declaratively. Also, make constraints (in angles) for the movement of the knob, declaratively.

- Would someone with Microsoft devices (using `pointerdown` etc.) want to suggest PR's? See -> [Issue #2](https://github.com/akauppi/svg.rx.js/issues/2)

- use [RxJS 5.0](https://github.com/ReactiveX/RxJS) when appropriate. It e.g. binds together with the ES7 built-in Observable Spec.

  - or tie directly to the ES7 `Observable`s (if they are enough for us)
  - make this first as a branch, `master` remains ExJS 4.x until 5.0 is stable and available via npm

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
