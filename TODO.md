# TODO

Sometimes it's faster to write down things here. [GitHub Issues](https://github.com/akauppi/svg.rx.js/issues) is the official place for feedback.

---

## npm 

- [ ] package and publish (once ready for it)

## Other

- [ ] Would someone with Microsoft devices (using `pointerdown` etc.) want to suggest PR's? See -> [Issue #2](https://github.com/akauppi/svg.rx.js/issues/2)

- Is there a case to support mouse buttons other than the first?

- Once ES7 `Observable`s are out, check if they are enough for us (i.e. would we still need/benefit from RxJS) (not urgent)
  - Svelte observables could do the same

  
<!-- disabled. test with modern RxJS, one day.  
## Backpressure 

<font color=red>This may have already been handled by recent (>5) RxJS versions. Just need manual testing.</font>

- if the drag produces more coordinates than the subscriber can handle, we'd be okay always skipping to the latest one. AKa251015
  
Note that RxJS states this about [backpressure](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/gettingstarted/backpressure.md#future-work) (version 4):

>In future versions of RxJS, the idea of the controlled observable will be baked into the subscription itself which then allows the backpressure to be an essential part of the contract or requesting n number of items.

With this in mind, we might be best off just waiting for RxJS to develop in this direction, and handling all the drag events until it does. AKa050616
-->

- [ ] Tests: <strike>decide</strike> between Cypress and Puppeteer
  - we only need to test static files (Cypress needs things to be served) 
  - Cypress installs a native (GUI) app; a bit excessive... 

- [x] Split demo from main code
  - demo doesn't need to have tests; good to separate Git histories
- [ ] **Touch back**
- [ ] Group handling

- [ ] Rename src/*.js -> src/*.mjs ? (does it matter?)

<!-- mentioned in demo; needs work in both
## Asset workflow

- [ ] **Import of graphics from external file** (where it is editable)
  - handle e.g. arms, as subgroups of such graphics, from the script

-->


## Tests

- [ ] Could do "accordeon" UI to keep multiple tests, but showing only one.

## More Svelte

There are discussions about merger of Svelte and RxJS patterns. 

Study if we can integrate the `svg.rx.js` APIs to be visible as Svelte observables, instead of RxJS observables.


## Testing duel

- [Puppeteer](https://developers.google.com/web/tools/puppeteer) has all that we need, and some useful stuff like "touch emulation". #drooling

However, let's go Cypress, at least until we know it well. There's no benefit in *maintaining* two test stacks, but there's certainly benefit in *learning* them borh. ("borh", that's a nice word, eh?) /AKa 1-Jan-20 


## References

- [e2echeck](https://github.com/Mercateo/e2e-check) (GitHub; blog-like)
  - mentions use of multiple test suits, for the same code
 