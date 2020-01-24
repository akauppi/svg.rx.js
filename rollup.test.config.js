//
// Rollup config for tests
//
// Note: This configuration is derived from
//          https://github.com/jakobrosenberg/svelte-filerouter-example/blob/master/rollup.config.js
//
import svelte from 'rollup-plugin-svelte';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';

// Enable live reload if Rollup is watching the sources (note: this doesn't really mean "production")
//
const watching = process.env.ROLLUP_WATCH;

const production = false;

export default [
    {   // Test app
        input: "test/main.js",
        output: {
            sourcemap: true,
            format: "iife",
            name: 'blah',   // without this, Rollup gave a warning: >> (!) If you do not supply "output.name", you may not be able to access the exports of an IIFE bundle. <<
            dir: "test/bundle"
        },
        plugins: [
            svelte({
                //include: 'test/**/*.svelte',      // note this could be done

                // enable run-time checks
                dev: !production,
                // extract any component CSS into a separate file — better for performance and clearer (tbd. not necessarily needed for tests?)
                css: css => {
                    css.write('test/bundle.css');
                }
            }),

            // If you have external dependencies installed from npm, you'll most likely need these plugins. In some
            // cases you'll need additional configuration — consult the documentation for details: https://github.com/rollup/rollup-plugin-commonjs
            //
            resolve({
                // no warnings for 'assert', but see -> https://github.com/rollup/rollup-plugin-node-resolve/issues/107
                //browser: true,
                preferBuiltins: true,
                mainFields: ['browser'],        // tbd. what does this do? (from ...??)
                dedupe: importee => importee === 'svelte' || importee.startsWith('svelte/')
            }),
            commonjs(),

            // Needed for runtime 'assert' in the browser
            globals(),
            builtins(),

            // Watch the 'test' directory and refresh the browser on changes. Covers both Svelte output (test/bundle**)
            // and the more static frame files.
            //
            // Note:
            //      Also Svelte source files ('test/main.js', 'test/**.svelte') are included in the pattern, but
            //      changes in them don't seem to cause unnecessary refreshes.
            //
            //      If this becomes an issue:
            //      'node-livereload' (that the 'rollup-plugin-reload' states "options are always passed to") supports
            //      both exclusions and multiple watched directories. -> https://www.npmjs.com/package/livereload
            //      but didn't get that to work. With those, we could do without the 'public'.
            //
            watching && livereload({
                watch: 'test' //,
                //exclusions: ["**.svelte", "test/main.js"]
            })
        ],
        watch: {
            clearScreen: false
        }
    }
];
