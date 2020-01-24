# Deployment

To publish the package, you must:

- have a user and be logged in to the `npm` registry:

   ```
   $ npm login
   ```
   
   The login will ask you for 2FA codes as well, if you have enabled such.

## Publish a `next` snapshot

We use `next` tags for work-in-progress releases, to be used e.g. in developing the `svg.rx.js-demo` applications.

You can export these as often as is needed. There are no guarantees to the users!

```
$ npm publish --tag next
```


## Publish a versioned release

The actual publishing. 

- Check the version in `package.json`

```
$ npm publish
```

