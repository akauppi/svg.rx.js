// Rollup config for Sapper (multi-page apps)
//
// Note: This configuration is derived from:
//          https://github.com/sveltejs/template/blob/master/rollup.config.js
//          https://github.com/sveltejs/sapper-template/blob/master/rollup.config.js
//      and should closely resemble them (check from time to time for upstream edits?).
//
import resolve from 'rollup-plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import commonjs from 'rollup-plugin-commonjs';
import svelte from 'rollup-plugin-svelte';
//import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';

import config from 'sapper/config/rollup.js';
import pkg from './package.json';

const mode = process.env.NODE_ENV;
const dev = mode === 'development';

/*
* Control of compilation warnings
*/
// tbd. How to disable only the 'circle.n{1..9}' classes?
//
const onwarn = (warning, onwarn) =>
    (warning.code === 'CIRCULAR_DEPENDENCY' && /[/\\]@sapper[/\\]/.test(warning.message))
    //|| console.log("WARNING CODE: "+ warning)
    //|| (warning.code === 'PLUGIN_WARNING' && warning.message === "Unused CSS selector")
    || onwarn(warning);

const dedupe = importee => importee === 'svelte' || importee.startsWith('svelte/');

export default {
    client: {
        input: config.client.input(),
        output: config.client.output(),
        plugins: [
            replace({
                'process.browser': true,
                'process.env.NODE_ENV': JSON.stringify(mode)
            }),
            svelte({
                dev,
                hydratable: true,
                emitCss: true
            }),
            resolve({
                browser: true,
                preferBuiltins: true,
                dedupe
            }),
            commonjs(),

            !dev && terser({
                module: true
            })
        ],

        onwarn,
    },

    server: {
        input: config.server.input(),
        output: config.server.output(),
        plugins: [
            replace({
                'process.browser': false,
                'process.env.NODE_ENV': JSON.stringify(mode)
            }),
            svelte({
                generate: 'ssr',
                dev
            }),
            resolve({
                dedupe
            }),
            commonjs()
        ],
        external: Object.keys(pkg.dependencies).concat(
            require('module').builtinModules || Object.keys(process.binding('natives'))
        ),

        onwarn,
    }

    // Note: 'serviceworker' section not needed
    /*** no need?
    serviceworker: {
        input: config.serviceworker.input(),
        output: config.serviceworker.output(),
        plugins: [
            resolve(),
            replace({
                'process.browser': true,
                'process.env.NODE_ENV': JSON.stringify(mode)
            }),
            commonjs(),
            !dev && terser()
        ],

        onwarn,
    }***/
};

