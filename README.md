# svg.rx.js

[![](https://badges.gitter.im/akauppi/svg.rx.js.svg)](https://gitter.im/akauppi/svg.rx.js?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

## What is it?

`svg.rx.js` binds [RxJS](https://github.com/Reactive-Extensions/RxJS) together with SVG graphics.

It currently uses [svg.js](https://github.com/wout/svg.js) for dealing with the SVG elements, but this dependency may later be relaxed (so that any such library could be used, or none at all, leaving it an application decision).

With `svg.rx.js`, user interactions such as touch and mouse events can be modeled as `RX.Observable`s, tremendously simplifying the code concerned.

The intention is that also animations would be modeled to use `Rx.Observable`s, instead of SVG-specific constructs that have a learning curve, and limitations.

The end game is to get a simple programming paradigm for making SVG-only animated, interactive applications that run fast in the browser.

The reasons why this isn't already practical lie within the SVG details. It doesn't seem easy to make a group out of SVG elements that can be dragged and interacted with. <strike>We're intending to fix these shortcomings, with the `gx` object.</strike>

><font color=orange>tbd. In the mean time (2017-19), Svelte 3 emerged. Looking at integration with it, now.</font>

## Design goals

- simplicity of API over feature support
- every documented API must have unit tests
- touch and mouse should not seem very different
- touch first (treat mouse as a useable fallback 2nd class citizen)
- any touch is treated the same (enables multiuser touch on a big tablet/table)
- providing the bare mechanisms needed, instead of trying to cater for a certain kind of application
- value brewity of the code, and maintainability
- provide support for both desktop and touch use cases, equally
- embrace Svelte 3, as a development abstraction and toolchain
  
## Platform scope

Scope of the project is SVG on modern browsers. That probably means no IE9..11 support (we can always add that later). In practice the code gets tested on:

- Latest Safari on macOS
- Latest Chrome on macOS
- Safari on iOS 13 (iPad Pro)
- Chrome on Android 9 (Sony Xperia phone) 

<!-- hidden (but take back?)
- Chrome on Andoid xxx (Nexus 7)
--> 

If you find platforms where it doesn't work for you, [issues](https://github.com/akauppi/svg.rx.js/issues) and pull requests are the way to go.

## Not supported
  
- Dragging of `SVG.Nested` and `SVG.Text`
  - there is special code for these in the [svg.draggable.js](https://github.com/wout/svg.draggable.js) project but since we don't have demos for these, we are currently not supporting them, at all

- Changing the draggable object's conversion matrix (scaling, rotation and translation) during a drag.
  - this is probably not needed in practical applications

Please send a PR if you need these - and provide a demo or test that proves when the support works.

## Following Svelte conventions

The folder structure is derived from [Svelte template](https://github.com/sveltejs/template). In particular:

```
|- public      # files to host
|   |- index.html
|   |- global.css
|   |- build      # output folder for the bundles
|       |- ...
|- src         # source files
``` 

We embrace Svelte as the building technology and wish to remain familiar in structure to developers using it, elsewhere.


---

## Getting started

Install the tools and dependencies (needed for running demos):

```
$ npm install
```

<!-- remove (replace with mention of installing Puppeteer; only needed for running the tests)
-->
<strike>Have PhantomJS installed, on the command line:

```
$ phantomjs --version
2.1.1
```
</strike>

><font color=orange>⚠️ PhantomJS is discontinued. Change tests to run with Puppeteer.</font>


## Demos

- [sources](demo.svelte/)
- [online](http://akauppi.github.io/svg.rx.js/index.html) - may not be the latest versions

><font color=orange>Note: The online demos are currently from an older branch (2015-16); they are *not* what the source creates. WIP</font>

The demos work both as sample code and as manual tests.

```
$ npm run dev
...
  Your application is ready~! 🚀

  - Local:      http://0.0.0.0:5000
  - Network:    http://192.168.1.234:5000

────────────────── LOGS ──────────────────
```

This builds the demos and serves them. Changes to the code will be reflected in the browser, without need of refresh. 😏


### Running on a mobile device

Open the mobile device's browser at `http://192.168.1.234:5000` (IP mentioned by `npm run dev`).

This allows you to experiment with the demos. 

>For setting up remote debugging, see [DEV-TIPS/Remote debugging](DEV-TIPS/Remote%20debugging.md).


## Code

- [src/svg.rx.js](src/svg.rx.js)

>Note: The code is currently using RxJS 5.

><font color=orange>⚠️ RxJS is now at 6.5.3 and 7.0.0-alpha.0. Upgrade to 6.x.</font>


## Tests 

All claimed features should have tests.

Run the tests:

```
$ npm test
```

Alternatively, you can run the tests in a browser:

```
$ open test/index.html
```

>💔<font color=orange>There are no tests at the moment. We'll tranfer the earlier ones to Puppeteer, at some point.</font>


## Usage 

>⚠️<font color=orange>WARNING: This section is out-of-date. To be corrected once we have transitioned to Svelte, fully.</font>

<strike>You can simply download the `svg.rx.js` file and place it in your project.</strike>

>tbd. Make pulling dependencies a separate part. Here just API usage.


### HTML

...tbd.


### JavaScript API

The library extends `SVGElement` by:

```
.rx_draggable()		// () -> observable of observables of {x:int,y:int}
```

<!-- disabled: treat them as an implementation detail?
If you only wish to handle mouse or touch, you can also use:

```
.rx_mouse()
.rx_touch()
```
-->

### Sample

```
const outerObs = rect.rx_draggable();
    
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

!!: The library does not move (drag) your object automatically. This is intentional and allows other kinds of dragging behaviour (e.g. constraints or circular following) to happen, instead of the usual 1:1 dragging.

</strike>

<!-- disabled; doing this
## Road ahead

Potentially, the `svg.js` library could be ditched at some point. It's turned out to be more of a bother - it embraces too much and things where it tries to be helpful, e.g. providing a `.move` for groups though they don't actually observe `.x` and `.y`  attributes, is simply misleading. In the end, we may be better off without it (but that is not a pressing concern).
-->

## Help requested!!

See:
 
- `TODO.md`
- [GitHub Issues](https://github.com/akauppi/svg.rx.js/issues) 

for ways to help

---

## References

### Other dragging libraries

Presented for code comparisons. Their approach is the normal event capture (no Rx).

- [svg.draggable.js](https://github.com/wout/svg.draggable.js)
  - has been the basis for our touch event and coordinate translation handling. Thanks, Fuzzy!

### Tools

- [How to Use npm as a Build Tool](https://www.keithcirkel.co.uk/how-to-use-npm-as-a-build-tool/) - (blog, Dec 2014) by Keith Cirkel
- [End to End Testing a Web Application using Cypress](https://www.youtube.com/watch?v=woI490HRM34) (Youtube 20:40, Apr 2019)
- [Writing your first test](https://docs.cypress.io/guides/getting-started/writing-your-first-test.html#Add-a-test-file) (Cypress docs)
