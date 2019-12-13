// Rollup config
//
// Note: This configuration is derived from
//          https://github.com/jakobrosenberg/svelte-filerouter-example/blob/master/rollup.config.js
//      and should closely resemble it (check from time to time for upstream edits?).
//
import svelte from 'rollup-plugin-svelte';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import { fileRouter } from 'svelte-filerouter';
import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';

const production = !process.env.ROLLUP_WATCH;

export default [
    {   // Demo app
        input: "demo/main.js",
        output: {
            sourcemap: true,
            format: "iife",
            name: 'app',   // Q: what does this affect? #help
            dir: "public/bundle"
        },
        plugins: [
            fileRouter({
                appFile: 'demo/App.svelte',
                pages: './demo/pages',
                dynamicImports: false
                // ignore: ''
            }),
            svelte({
                // enable run-time checks when not in production
                dev: !production,
                // extract any component CSS into a separate file — better for performance and clearer
                css: css => {
                    css.write('public/bundle.css');
                }
            }),

            // If you have external dependencies installed from npm, you'll most likely need these plugins. In
            // some cases you'll need additional configuration — consult the documentation for details:
            // https://github.com/rollup/rollup-plugin-commonjs
            resolve({
                // no warnings for 'assert', but see -> https://github.com/rollup/rollup-plugin-node-resolve/issues/107
                //browser: true,
                preferBuiltins: true,
                mainFields: ['browser'],
                dedupe: importee => importee === 'svelte' || importee.startsWith('svelte/')
            }),
            commonjs(),

            // Needed for runtime 'assert' in the browser
            globals(),
            builtins(),

            // Watch the `public` directory and refresh the browser on changes when not in production
            !production && livereload('public'),

            // If we're building for production, minify
            production && terser(),

            // In dev mode, call `npm run start` once the bundle has been generated
            !production && serve()
        ],
        watch: {
            clearScreen: false      // tbd. and yet the screen clears
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
                // Differences:
                //      - start 'sirv' directly from here, instead of going through 'package.json'. Simpler.
                //      - using 'npx'
                //      - added '--host': serves also in the network IP (e.g. '192.168.1.234'). We need this for mobile devices.
                //      - added '--single'
                //
                require('child_process').spawn('npx', ['sirv', 'public', '--dev', '--host', '--single'], {
                    stdio: ['ignore', 'inherit', 'inherit'],
                    shell: true
                });
            }
        }
    };
}
