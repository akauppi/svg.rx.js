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
//import { terser } from 'rollup-plugin-terser';
import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';

const production = false;   // always dev for tests

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

                // enable run-time checks when not in production (tbd. Test always is - do we have a case for anything else?)
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
            livereload({
                watch: 'test' //,
                //exclusions: ["**.svelte", "test/main.js"]
            }),

            // disabled
            // If we're building for production, minify
            //production && terser(),

            // disabled
            // In dev mode, call `npm run start` once the bundle has been generated
            //!production && serve()
        ],
        watch: {
            // Note: This suppresses some clear screen, but not the one before `Your application is ready~! 🚀`.
            //       track -> https://github.com/rollup/rollup/issues/2820
            //
            clearScreen: false
        }
    }
];

function serve() {
    let started = false;

    return {
        writeBundle() {
            if (!started) {
                started = true;

                // Based on https://github.com/sveltejs/template/blob/master/rollup.config.js
                //
                // Uses 'package.json' 'start' target, but adds '--dev' to it. Alternatively, we could launch stuff
                // right here, but going through 'package.json' has the benefit that other params are just in one
                // place.
                //
                //require('child_process').spawn('npx', ['sirv', 'public', '--dev', '--host', '--single'], {
                require('child_process').spawn('npm', ['run', 'test:_start', '--', '--dev'], {
                    stdio: ['ignore', 'inherit', 'inherit'],
                    shell: true
                });
            }
        }
    };
}
