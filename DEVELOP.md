# Development

## Requirements

- `npm` is enough

## Misc

The `demo/lib/*` files are symbolic links to the libraries that are fetched when doing the updates.

Note: It is important to keep `demo/` self-sufficient (i.e. no paths leading up from it, other than via the symbolic links), because of the way it gets published (see below). Likewise, `demo/src` is a symbolic link to `src`.

Note: `git` supports symbolic links fully, but some IDEs may get confused if you open the same file (say the source) as both `src/rx.svg.js` and `demo/src/rx.svg.js`. The solution is simple - try to only open one of them, or change tools.

## Testing on Android Browser

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

