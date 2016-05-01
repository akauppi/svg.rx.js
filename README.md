# svg.rx.js

[![](https://badges.gitter.im/akauppi/svg.rx.js.svg)](https://gitter.im/akauppi/svg.rx.js?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

## What is it?

Binds [RxJS](https://github.com/Reactive-Extensions/RxJS) with [svg.js](https://github.com/wout/svg.js), for handling user interactions.

Allows SVG applications to be crafted without callbacks or events, using `RX.Observable`s instead.

The API is tremendously simple, but powerful in the RxJS fashion. All drags are mapped into an `observable of observables of {x: Int, y:Int}`. This means, among other things that:

- mouse is not very different from touch
- any touch is treated the same (enables multiuser touch UIs on a big tablet / table)

<!-- could embed a demo right here to give a feeling what it's about
-->

<!-- then show the code of that demo, right here as well. AKa010516
-->

## Requirements

- `npm`

## Platform scope

Scope of the project is SVG on modern browsers. That probably means IE9 and later, but in practice the code gets tested on:

- Latest Safari on OS X
- Latest Chrome on OS X
- Safari on iOS 9
  -  on iPhone 6 and iPad Lite
- Latest Android browser 
  - on Nexus 7

If you find platforms where it doesn't work for you, [issues](https://github.com/akauppi/svg.rx.js/issues) and pull requests are the way to go.

## Getting started

Install the tools and dependencies:

```
$ npm update
```

## Code

- [src/svg.rx.js](src/svg.rx.js)

- [sources](demo/)
- [online](http://akauppi.github.io/svg.rx.js/index.html) - may not be the latest versions

The demos work both as sample code and as manual tests.

|Note|
|-|
| The code is currently using RxJS 5.0.0 beta4. Once RxJS 5 becomes available via node.js, we're moving to it. Check the [current situation](https://www.npmjs.com/package/rxjs) of RxJS releases for npm. |

<!-- 5.0.0-beta7 as of AKa010516 -->


## Tests 

All claimed features should have tests.

Run the tests:

```
$ npm run test
```

Alternatively, you can run the tests in a browser:

```
$ open test/NoTest.html   # tbd. have to change that name :)
```
 
## Scope

The project aims at:

- providing enough bridging between `RxJS` and `svg.js` so that event callbacks are never needed in application code
- using the RxJS API directly - no need to blur it behind an abstraction
  - alternatively, the ES7 native Observables API can be used, if that is sufficient for our other purposes
- having manual tests (demos) for all supported entries
- providing the bare mechanisms needed, instead of trying to cater for a certain kind of application
- value brewity of the code, and maintainability
- provide support for both desktop and touch use cases, equally
  
Not supported:
  
- Dragging of `SVG.Nested` and `SVG.Text`
  - there is special code for these in the [svg.draggable.js](https://github.com/wout/svg.draggable.js) project but since we don't have demos for these, we are currently not supporting them, at all

- Changing the draggable object's conversion matrix (scaling, rotation and translation) during a drag.
  - this is probably not needed in practical applications

Please send a PR if you need these - and provide a manual test that proves when the support works.


---

## Usage 

<font color=red>Note: The APIs are still in flux, and it might be better to see the 
working samples. AKa030416</font>

You can simply download the `svg.rx.js` file and place it in your project. 

<!-- Mention here about 'npm' once we distribute through it. AKa060116
-->

### HTML

```html
<script src="svg.min.js"></script>
<script src="Rx.umd.min.js"></script>
<script src="svg.rx.js"></script>
```

### JavaScript API

The library extends `SVGElement` and `SVGDocument` by:

```
.rx_draggable()		// () -> observable of observables of {x:int,y:int}
```

If you only wish to handle mouse or touch, you can also use:

```
.rx_mouse()
.rx_touch()
```


### Sample

```javascript
var outerObs = rect.rx_draggable();
    
outerObs.subscribe( function(dragObs) {
    console.log("Drag started");
    
    dragObs.subscribe( function(o) {       // {x:Int,y:Int}
        rect.move(o.x, o.y);
    },
    null, 	// no error handler
    function () {
        console.log("Drag ended");
	} );
} );
```

Note that the library does not move (drag) your object automatically. This is intentional and allows other kinds of dragging behaviour (e.g. constraints or circular following) to happen, instead of the usual 1:1 dragging.

Dependencies:

- `svg.js`
- RxJS 5.0 

You are expected to provide the dependencies in any way you like.

---

## Road ahead

<!--
I'm doing this to be a building block for a non-open-source project. So the focus is not in utter general feature coverage, but "just enough" to scratch my own itch (that doing interactive SVG web apps is Hard!).

I will prefer simplicity (of the API) over full feature coverage.

Any features should have tests (just starting...).

Next steps:

- making `demo-triangles` to work
  - making a CAD-like "halo" menu system around a group
  - making undo/redo (won't be part of this project, but maybe integrating such in one demo)
-->

Potentially, the `svg.js` library could be ditched at some point. It's turned out to be more of a bother - it embraces too much and things where it tries to be helpful, e.g. providing a `.move` for groups though they don't actually observe `.x` and `.y`  attributes, is simply misleading. In the end, we may be better off without it (but that is not a pressing concern).

## Help requested!!

See:
 
- `TODO.md`
- `BUGS.md` and
- [GitHub Issues](https://github.com/akauppi/svg.rx.js/issues) 

for ways to help

---

## References

### Other dragging libraries

These are presented for code comparisons. Their approach is the normal event capture (no Rx).

- [svg.draggable.js](https://github.com/wout/svg.draggable.js)
  - has been the basis for our touch event and coordinate translation handling. Thanks, Fuzzy!
- [svg.draggy.js](https://github.com/jillix/svg.draggy.js/)

### Background info

- [How to Use npm as a Build Tool](http://blog.keithcirkel.co.uk/how-to-use-npm-as-a-build-tool/) - blog by Keith Cirkel
- [Phantomjs, Mocha and Chai for functional testing](http://doublenegative.com/phantomjs-mocha-and-chai-for-functional-testing/) (blog, Thomas Clowes, Aug 2014)

<br />
