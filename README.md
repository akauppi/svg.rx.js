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

## Code

- [src/svg.rx.js](src/svg.rx.js)

## Demos

- [demo sources](demo/)
- [demos online](http://akauppi.github.io/svg.rx.js/index.html)

The demos work both as sample code and as manual tests. There are no automated tests, because testing such graphical stuff would probably become more complex than the library itself. Ideas for how to make automated tests are of course appreciated.

## Scope

The project aims at:

- providing enough bridging between `RxJS` and `svg.js` so that event callbacks are never needed in application code
- using the RxJS API directly - no need to blur it behind an abstraction
- having manual tests (demos) for all supported entries
- providing the bare mechanisms needed, instead of trying to cater for a certain kind of application
- value brewity of the code, and maintainability
- provide support for both desktop and touch (tablet) use cases
  
Not supported:
  
- Dragging of `SVG.Nested`, `SVG.Use` and `SVG.Text`
  - there is special code for these in the [svg.draggable.js](https://github.com/wout/svg.draggable.js) project but since we don't have demos for these, we are currently not supporting them, at all

- Changing the draggable object's conversion matrix (scaling, rotation and translation) during a drag.
  - this is probably not needed in practical applications (if it is, we'll make a demo and build the support for it)

Please send a PR if you need these - and provide a manual test that proves when the support works.


## Usage 

### HTML

```html
  <script src=".../svg.min.js"></script>
  <script src=".../rx.lite.min.js"></script>
  <script src=".../svg.rx.js"></script>
```

### JavaScript API

The library extends `SVGElement` by:

```
.rx_draggable()		// () -> observable of observables of {x:int,y:int}
```

### Sample

```javascript
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

- `svg.js` ^2.2.0
- `rx.lite.js` ^4.0.6

Note: `rx.lite.js` is not available via `bower` (the full `rx.js` package is).

<!-- disabled (now using 4.0.6)
Note: `rx[.lite].js` 4.0.1 release has a bug that causes `fromEvent()` not to pass events to an observable. Avoid that release.
-->

## Building

```
$ make
```

This downloads the demo dependencies.

Then open `demo/index.html` in the browser.

### src/ symbolic linking

The `demo/src` directory is a symbolic link to `src`. This is so that we can both:

- separate the actual sources from the demo code
- publish just the ´demo´ folder using ´gh-pages´ branch

This arrangement seems to work (i.e. git is fine with symbolic links). Please tell if you have problems with it.

## Publishing the demo

The `gh-pages` branch has the ´demo´ folder, with dependency libraries, visible online. This is a very nice, normal GitHub feature. 

To update the online demo (note: this should only be done by project maintainers!):

```
$ npm install gh-pages
$ node_modules/.bin/gh-pages -d demo
```

This removes any previous contents of the `gh-pages` branch and replaces them with what's in `demo`.


## Bower

The package has been registered with the `svg.rx.js` bower name, so this should be enough to use it:

```
$ bower install svg.rx.js
```

### Adding versions (only by maintaners!)

Bower uses semver tags. Just

- edit `CHANGELOG.md` and commit
- `git tag <x.y.z>`
- `git push --tags`


## Other dragging libraries

These are presented for code comparisons. Their approach is the normal event capture (no Rx).

- [svg.draggable.js](https://github.com/wout/svg.draggable.js)
  - has been the basis for our touch event and coordinate translation handling. Thanks, Fuzzy!
- [svg.draggy.js](https://github.com/jillix/svg.draggy.js/)


## Contributors

- [akauppi](https://github.com/akauppi)

### Help requested!!

- checking the code from `RxJS` point of view
  - especially for leaks - does something need to be manually discarded?
- checking the code from `svg.js` point of view
  - are there `svg.js` APIs that could be used instead of `.node` (i.e. native SVG)?  
- general testing on Windows platform (building and behaviour in IE versions)

<br />
