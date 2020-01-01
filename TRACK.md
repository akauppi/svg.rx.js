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

