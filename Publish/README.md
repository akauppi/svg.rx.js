# Publish

To publish the package, you must have a *npmjs.com* user registered and be logged in:

```
$ npm login
```

>Note: For sharing this module with an application on the *same* machine, you can use `npm link`.


## Publish a `next` snapshot

We use `next` tags for work-in-progress releases, to be used e.g. in developing the `svg.rx.js-demo` applications.

You can export these as often as is needed. There are no guarantees to the users!

- Check the version in `package.json` says `alpha` or `beta`

```
$ npm publish --tag next
```


## Versioned releases

The actual publishing. 

- Check the version in `package.json`

```
$ npm publish
```
