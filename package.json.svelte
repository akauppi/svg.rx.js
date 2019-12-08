{
  "name": "svg.rx.js",
  "version": "0.0.6-svelte-maybe",
  "private": true,
  "//scripts for Svelte": {
    "gh-pages": "gh-pages -d demo",
    "clean": "(rm public/build/* 2> /dev/null || true)",
    "build": "rollup -c",
    "dev": "rollup -c -w",
    "//start": "sirv public"
  },
  "scripts": {
    "gh-pages": "gh-pages -d demo",
    "//clean": "(rm public/build/* 2> /dev/null || true)",
    "dev": "sapper dev",
    "build": "sapper build",
    "export": "sapper export",
    "start": "node __sapper__/build",
    "cy:run": "npx cypress run",
    "cy:open": "npx cypress open",
    "test": "run-p --race dev cy:run",
  },
  "//dependencies for Svelte": {
    "@reactivex/rxjs": "5.0.0-beta.10",
    "svg.js": "^2.3.2"
  },
  "dependencies": {
    "@reactivex/rxjs": "5.0.0-beta.10",
    "svg.js": "^2.3.2",
    "compression": "^1.7.1",
    "polka": "next",
    "sirv": "^0.4.0"
  },
  "//devDependencies for Svelte": {
    "gh-pages": "^2.1.1",
    "rollup": "^1.27.9",
    "rollup-plugin-commonjs": "^10.1.0",
    "rollup-plugin-livereload": "^1.0.0",
    "rollup-plugin-node-resolve": "^5.2.0",
    "rollup-plugin-svelte": "^5.1.1",
    "rollup-plugin-terser": "^5.1.2",
    "sirv-cli": "^0.4.5",
    "svelte": "^3.15.0"
  },
  "devDependencies": {
    "gh-pages": "^2.1.1",
    "npm-run-all": "^4.1.5",
    "sapper": "^0.27.0",
    "svelte": "^3.0.0",
    "@rollup/plugin-replace": "^2.2.0",
    "rollup": "^1.12.0",
    "rollup-plugin-commonjs": "^10.0.0",
    "rollup-plugin-node-resolve": "^5.2.0",
    "rollup-plugin-svelte": "^5.0.1",
    "rollup-plugin-terser": "^4.0.4"
  }
}
