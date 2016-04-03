# svg.rx.js

[![Join the chat at https://gitter.im/akauppi/svg.rx.js](https://badges.gitter.im/akauppi/svg.rx.js.svg)](https://gitter.im/akauppi/svg.rx.js?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Binds [RxJS](https://github.com/Reactive-Extensions/RxJS) with [svg.js](https://github.com/wout/svg.js), for handling user interactions.

Allows SVG applications to be crafted without callbacks or events, using `RX.Observable`s instead.

The API is tremendously simple, but powerful in the RxJS fashion. All drags are mapped into an `observable of observables of {x: Int, y:Int}`. This means, among other things that:

- mouse is not very different from touch
- any touch is treated the same (enables multiuser touch UIs on a big tablet / table)

## Road ahead

I'm doing this to be a building block for a non-open-source project. So the focus is not in utter general feature coverage, but "just enough" to scratch my own itch (that doing interactive SVG web apps is Hard!).

I will prefer simplicity (of the API) over full feature coverage.

Any features should have tests (currently, they have none). If you wish to contribute, planning and starting to make tests would be Great!

Next steps:

- making `demo-triangles` to work
  - making a CAD-like "halo" menu system around a group
  - making undo/redo (won't be part of this project, but maybe integrating such in one demo)

Potentially, the `svg.js` library could be ditched at some point. It's turned out to be more of a bother - it embraces too much and things where it tries to be helpful, e.g. providing a `.move` for groups though they don't actually observe `.x` and `.y`  attributes, is simply misleading. In the end, we may be better off without it (but that is not a pressing concern).

## Code

- [src/svg.rx.js](src/svg.rx.js)

The code is currently using RxJS 5.0.0 beta4. Once RxJS 5 becomes available via node.js, we're moving to it.

( Check the [current situation](https://www.npmjs.com/package/rxjs) of RxJS releases for npm. )

## Demos

- [sources](demo/)
- [online](http://akauppi.github.io/svg.rx.js/index.html)

The demos work both as sample code and as manual tests.

## Tests 

Unfortunately, there are no tests at the moment. Once the APIs get stable, making an automated test set would be highly appreciated. All claimed features should have tests. 
 
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

### Platform scope

Scope of the project is SVG on modern browsers. That probably means IE9 and later, but in practice the code gets tested on:

- Latest Safari on OS X
- Latest Chrome on OS X
- Safari on iOS 9
  - on iPhone 6 and iPad Lite
- Latest Android browser 
  - on Nexus 7

If you find platforms where it doesn't work for you, [issues](https://github.com/akauppi/svg.rx.js/issues) and pull requests are the way to go.


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

## Development

If you wish to help with the project, do this after cloning:

```
$ npm update
```

This downloads the demo dependencies.

The `demo/lib/*` files are symbolic links to the libraries that are fetched when doing the updates.

Note: It is important to keep `demo/` self-sufficient (i.e. no paths leading up from it, other than via the symbolic links), because of the way it gets published (see below). Likewise, `demo/src` is a symbolic link to `src`.

Note: `git` supports symbolic links fully, but some IDEs may get confused if you open the same file (say the source) as both `src/rx.svg.js` and `demo/src/rx.svg.js`. The solution is simple - try to only open one of them, or change tools.

### Testing on Android Browser

Chrome has a wonderful [Android Remote Debugging](https://developer.chrome.com/devtools/docs/remote-debugging) mode that allows one to debug what's happening in the mobile browser, from the desktop. It requires no additional installations (no `adb`) - just:

1. enable the USB debugging mode in your device (see the link)
2. open desktop Chrome at `chrome:inspect`

You can use the "Port forwarding" feature, together with a lightweight node based http-server, to test code changes without publishing to the Internet:

1. run `npm run serve` on the command line. This serves the `demo/` folder in `localhost:8080`
2. enable the "Port forwarding" in desktop Chrome (under `chrome:inspect`)
3. browse the demos with the phone/tablet

It really couldn't be easier!

iOS has a similar feature. See [DEV-TIPS/Remote Debugging.md](DEV-TIPS/Remote Debugging.md) for more info on these.

## Publishing

The demos are published on [GitHub Pages](https://pages.github.com), using the `gh-pages` npm module.

```
$ npm run gh-pages
```

This removes any previous contents of the `gh-pages` branch and replaces them with what's in `demo/` folder. 


<!-- This does not really need to be public. At least not now. Think about once we are actually pulling svg.rx.js via npm, ourselves. AKa090116

## Packaging

The project is published via `npm`.

```
$ npm publish
```

The package is then visible [here](https://www.npmjs.com/package/svg.rx.js). You need to be properly registered with `npm` in order to publish packages.

### Adding versions

- Check that `CHANGELOG.md` is up to date
- Check that all manual demos work
- Check that the version in `package.json` is correct
-->

## Help requested!!

See `TODO.md`, `BUGS.md` and [GitHub Issues](https://github.com/akauppi/svg.rx.js/issues) for ways to help.

---

## References

### Other dragging libraries

These are presented for code comparisons. Their approach is the normal event capture (no Rx).

- [svg.draggable.js](https://github.com/wout/svg.draggable.js)
  - has been the basis for our touch event and coordinate translation handling. Thanks, Fuzzy!
- [svg.draggy.js](https://github.com/jillix/svg.draggy.js/)

### Background info

- [How to Use npm as a Build Tool](http://blog.keithcirkel.co.uk/how-to-use-npm-as-a-build-tool/) - blog by Keith Cirkel

<br />
