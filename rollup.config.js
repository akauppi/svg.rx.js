// Rollup config
//
import svelte from 'rollup-plugin-svelte';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
//import { terser } from 'rollup-plugin-terser';
//import pkg from './package.json';

//const production = !process.env.ROLLUP_WATCH;

export default [
    // Demo app / triangles
    {
        input: "demo.svelte/index.js",
        output: {
            file: "out/public/demos.js",
            format: "iife",    // Q: is 'iife' a good target? #advice
            sourcemap: true
        },
        plugins: [
            svelte({ dev: true, css: css => css.write('out/public/demos.css') }),
            resolve({
                jsnext: true,       // tbd. why? (from svelte-spinner example) #advice
                main: true,         // tbd. why? (-''-) #advice
                browser: true       // tbd. why? (-''-) #advice
            }),
            commonjs()      // tbd. is this neeeded and why?
        ],
        watch: {
            clearScreen: false
        }
    }
];
