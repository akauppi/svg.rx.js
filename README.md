# svg.rx.js

Binding [RxJS](https://github.com/Reactive-Extensions/RxJS) with [svg.js](https://github.com/wout/svg.js).

Allows SVG applications to be crafted without callbacks or events, using `RX.Observable`s instead.

## Platform scope

Scope of the project is SVG, and modern browsers. That probably means IE9 and later, but in practice the code gets tested on:

- Safari on OS X
- Chrome on OS X
- Safari on iOS 9
- Latest Android browser on Nexus 7

If you find platforms where it doesn't work for you, Issues and Pull Requests are the way to go.

<!-- disabled (not needed here AKa081115)
## What are Reactive Extensions?

[Reactive Extensions](http://reactivex.io) is a wonderful programming model that replaces callbacks and events with observables. These are one-to-many async relations between entities, and tend to make the code simpler and more maintainable than functionally equal implementations using callbacks and events.

RxJS is the implementation of RX programming for browsers. It provides support for transforming native browser events into observables, but no support for svg.js itself.

### What's the benefit?

Handling multiple levels of asynchronous flying events, and callbacks can be tedious. This bridge aims at eliminating all that - so you can make SVG "applications" with all the user interactions (drags, clicks etc.) modeled as RxJS streams, instead.
-->


## Code

- [src/svg.rx.js](src/svg.rx.js)
- [demo sources](demo/)
- [demo online](http://akauppi.github.io/svg.rx.js/demo/index.html)

The demos work both as sample code and as manual tests. There are no automated tests, because testing such graphical stuff would probably become more complex than the library itself. Ideas for how to make automated tests are of course appreciated.

## Usage 

### Fetch package

```
$ bower install akauppi/svg.rx.js
```

### HTML

```
  <script src="..some../svg.min.js"></script>
  <script src="..some../rx.lite-4.0.0.js"></script>
  <script src="..some../svg.rx.js"></script>
```

### JavaScript API

The library extends `SVGElement` by:

```
.rx_draggable()		// () -> observable of observables of {x:int,y:int}
```

### Sample

```
    var outerObs = rect.rx_draggable();
    
    outerObs.subscribe( function(dragObs) {
        console.log("Drag started");
    
        dragObs.subscribe( function(o) {       // {x:Int,y:Int}
            rect.move(o.x, o.y);
        },
        function () {
            console.log("Drag ended");
    	} );
    } );
```

Note that the library does not move (drag) your object automatically. This is intentional and allows other kinds of dragging behaviour (e.g. constraints or circular following) to happen, instead of the usual 1:1 dragging.

Dependencies:

- `svg.js` ^2.1.1
- `rx.lite.js` 4.0.0

Note: `rx.lite.js` is not available via `bower` (the full `rx.js` package is).

Note: `rx[.lite].js` 4.0.1 release has a bug that causes `fromEvent()` not to pass events to an observable. Avoid that release.


## Building

```
$ cd demo
$ make
```

Then open `demo/index.html` in the browser.

The `gh-pages` branch is what's visible in the online demo. It has copies of the libs. To update the online demo to match changes in master:

```
$ git checkout gh-pages
$ git merge master
# do 'cd demo; make update' if libraries are to be updated
$ git push
```

## Scope

The project aims at:

- providing enough bridging between `RxJS` and `svg.js` so that event callbacks are never needed in application code
- using the RxJS API directly - no need to blur it behind an abstraction
- having manual tests for all supported entries
- providing the bare mechanisms needed, instead of trying to cater for a certain kind of application
- remain close to how `svg.js` itself is built, documented and packaged
  - however, we do use `;` at the end of lines
  - if needed, we use `>` to show "inherits from" (opposite of `svg.js`)
  - limit to only Bower for distribution
    - don't want to replicate same stuff multiple times
  - no build tools are needed. **If** we need one, it shall not be any JavaScript tool (those are confusing to me!), but probably Gradle. 
  
Not supported:
  
- Dragging of `SVG.Nested`, `SVG.Use` and `SVG.Text`
  - there is special code for these in the [svg.draggable.js](https://github.com/wout/svg.draggable.js) project but since we're not having demos for these, we've also commented out such code

- Changing the draggable object's conversion matrix (scaling, rotation and translation) during a drag.

Please send a PR if you need these - and provide a manual test that proves the support works.


## Other dragging libraries

These are presented for code comparisons. Their approach is the normal event capture (no Rx).

- [svg.draggable.js](https://github.com/wout/svg.draggable.js)
  - has been the basis for our touch event and coordinate translation handling. Thanks, Fuzzy!
- [svg.draggy.js](https://github.com/jillix/svg.draggy.js/)


## Contributors

- [Asko Kauppi](https://github.com/akauppi)

### Help requested!!

- checking the code from `RxJS` point of view
  - especially for leaks - does something need to be manually discarded?
- checking the code from `svg.js` point of view
  - are there `svg.js` APIs that could be used instead of `.node` (i.e. native SVG)?  

<br />
