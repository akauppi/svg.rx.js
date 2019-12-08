// Rollup config
//
// Note: This configuration is derived from https://github.com/sveltejs/template/blob/master/rollup.config.js
//      and should closely resemble it (check from time to time for upstream edits?).
//
import svelte from 'rollup-plugin-svelte';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';

const production = !process.env.ROLLUP_WATCH;

export default [
    // Demo app / triangles
    {
        input: "demo.svelte/main.js",
        output: {
            sourcemap: true,
            format: "iife",
            name: 'app',   // Q: what does this affect? (from 'svelte-template')
            file: "public/build/bundle.js",
        },
        plugins: [
            svelte({
                // enable run-time checks when not in production
                dev: !production,
                // extract any component CSS into a separate file — better for performance and clearer
                css: css => {
                    css.write('public/build/bundle.css');
                }
            }),

            // If you have external dependencies installed from npm, you'll most likely need these plugins. In
            // some cases you'll need additional configuration — consult the documentation for details:
            // https://github.com/rollup/rollup-plugin-commonjs
            resolve({
                browser: true,
                dedupe: importee => importee === 'svelte' || importee.startsWith('svelte/')
            }),
            commonjs(),

            // In dev mode, call `npm run start` once the bundle has been generated
            !production && serve(),

            // Watch the `public` directory and refresh the browser on changes when not in production
            !production && livereload('public'),

            // If we're building for production ('npm run build' instead of 'npm run dev'), minify
            production && terser()
        ],

        watch: {
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

                // Note: Unlike in Svelte template, we start 'sirv' directly from here, instead of going through
                //      'package.json'. This seems simpler - was there a reason to not do so, in the template?
                //
                //      Template had: 'npm run start -- --dev'
                //
                // Note: '--host' serves also in the network IP (e.g. '192.168.1.234'). We need this for mobile devices.
                //
                require('child_process').spawn('npx', ['sirv', 'public', '--dev', '--host'], {
                    stdio: ['ignore', 'inherit', 'inherit'],
                    shell: true
                });
            }
        }
    };
}