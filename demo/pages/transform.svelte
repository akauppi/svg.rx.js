<!--
- demo/pages/transform.svelte
-
- Based on -> https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/transform
-->
<script>

	/** remove
	import { onMount } from 'svelte';
	import { assert } from 'assert';

	// tbd. an import from node, or elsewhere where published (to test the full route)
	// import ...;
	import '../../src/svg.rx.js';		// in the same repo

	assert( SVGElement.prototype.rx_draggable );

	export let circles = [ {x: 100, y: 100, r: 20, n: 1} ];		// { x: int, y: int, r: int, n: 0..9 }

	let svgElem;	// 'SVGSVGElement'

	onMount(() => {		// Svelte note: could provide the element as a parameter (now 'undefined')

		debugger;

		const outerObs = svgElem.rx_draggable();		// -> observable of observables of { x: Int, y: Int }

		alert(outerObs+"");	// :)
	});

	//...
	**/
</script>

<!-- CSS -->

<style>
</style>

<!-- HTML -->

<svelte:head>
	<title>Transform</title>
</svelte:head>

<h1>Transform demo</h1>

<p>Based on -&gt; <a href="https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/transform">MDN transform</a>
	<br />tbd. We want to ensure that drags work through transforms
</p>

<svg viewBox="-40 0 150 100" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
	<g fill="grey"
	   transform="rotate(-10 50 100)
                translate(-36 45.5)
                skewX(40)
                scale(1 0.5)">
		<path id="heart" d="M 10,30 A 20,20 0,0,1 50,30 A 20,20 0,0,1 90,30 Q 90,60 50,90 Q 10,60 10,30 z" />
	</g>

	<use xlink:href="#heart" fill="none" stroke="red"/>
</svg>



