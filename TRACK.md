# Track

## How to test local files, with Cypress?

Our test builds create local files. Instead of serving them, we could simply open them directly.

However, having this in `cypress.json`:

```
	"baseUrl": "file://test/index.html",
```

..causes:

```
$ npx cypress run
We found an invalid value in the file: `cypress.json`

Expected `baseUrl` to be a fully qualified URL (starting with `http://` or `https://`). Instead the value was: `"file://test/index.html"`
```

---

Then again, loading from `file://` will introduce CORS issues with some browsers (at least Safari), so maybe we can do with the serving.

---


## `.should.have.css(...)`

Cypress allows this:

```
expect($el).to.have.css('background-color', 'rgb(0, 0, 0)')
```

...but not this:

```
$el.should.have.css('background-color', 'rgb(0, 0, 0)')

# $el.should.have.css('background-color', 'rgb(0, 0, 0)')
```

Is there a reason, why not?  Can we make it support it?

- [ ] open discussion at their forums. Nothing to track, yet.

Nah, seems that's the way `.should` works, in general. Maybe we can extend, but that would change the *overall* should, not just this case.

-> https://docs.cypress.io/api/commands/should.html#Yields

