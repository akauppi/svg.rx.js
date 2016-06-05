# TODO

- demo-triangles further

- Using streams for an animation API
  - test with demo 4, at least

- Clean up the code and documentation

- `Rx.config.longStackSupport = true`
  - "When running the same example again with the flag set at the top, our stack trace looks much nicer and indicates exactly where the error occurred:" Do we need that? [link](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/gettingstarted/testing.md)
    
- Fix (or remove?) unnecessary demos (demo 2)

- Consider if svg.js could be left out (direct access to browser's SVG API)

- Release via npm packaging
  
- Would someone with Microsoft devices (using `pointerdown` etc.) want to suggest PR's? See -> [Issue #2](https://github.com/akauppi/svg.rx.js/issues/2)

- Is there a case to support mouse buttons other than the first?

- Once ES7 `Observable`s are out, check if they are enough for us (i.e. would we still need/benefit from RxJS) (not urgent)

## Backpressure 

- if the drag produces more coordinates than the subscriber can handle, we'd be okay always skipping to the latest one. AKa251015
  
Note that RxJS states this about [backpressure](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/gettingstarted/backpressure.md#future-work):

>In future versions of RxJS, the idea of the controlled observable will be baked into the subscription itself which then allows the backpressure to be an essential part of the contract or requesting n number of items.

With this in mind, we might be best off just waiting for RxJS to develop in this direction, and handling all the drag events until it does. AKa050616

## One Day...

- redefining group methods so that `move` etc. start making sense.
  - change translation before first move = set the origin of a group
  - freeze the origin e.g. with first move
  - just make it so that `move`, `rotate` etc. really work (so we don`t need to move by translate, as it is now)
 

<br />
