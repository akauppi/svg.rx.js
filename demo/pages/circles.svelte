<script>
	import { onMount } from 'svelte';
	//import '../../src/svg.rx.js';

	export let circles = [ {x: 100, y: 100, r: 20} ];		// { x: int, y: int, r: int }

	/*
	* Note: One can have '<svg on:mount={ ... }>` (Svelte 3.15.0) but there doesn't seem to be a way to pass that
	* 	element (the <svg> node) to the handler, i.e. `<svg on:mount{ el => { ... } }>` does not work.
	*
	* 	This would be handy, but the whole `on:mount` seems undocumented, at the moment (10-Dec-19) so we continue
	* 	with what works.
	*
	* 	btw. With `on:mount` also the `import { onMount } from 'svelte'` can be omitted.
	*
	* 	tbd. Discuss this in Svelte forums; make a sample (or share this code once we work, with a branch that
	* 		exhibits the non-working inline)?
	*/
	let svgElem;	// 'SVGSVGElement'

	onMount(() => {		// Svelte note: could provide the element as a parameter (now 'undefined')

		const outerObs = svgElem.rx_draggable();		// -> observable of observables of { x: Int, y: Int }

		alert(outerObs+"");	// :)
	});

	//...
</script>

<!-- CSS -->

<style>
	/* tbd. These classes are intended to be used dynamically, but they cause "Unused CSS selector" warnings at the
	 * development console. How to mark they're good? #help
	 *
	circle.n0 {
		fill: blue;
	}
	circle.n1 {
		fill: gray;
	}
	circle.n2 {
		fill: blue;
	}
	circle.n3 {
		fill: purple;
	}
	circle.n4 {
		fill: red;
	}
	circle.n5 {
		fill: green;
	}
	circle.n6 {
		fill: orange;
	}
	circle.n7 {
		fill: yellow;
	}
	circle.n8 {
		fill: magenta;
	}
	circle.n9 {
		fill: aqua;
	}
	*/
	circle {
		fill: lightcoral;
	}
</style>

<!-- HTML -->

<svelte:head>
	<title>Circles</title>
</svelte:head>

<h1>Circles demo</h1>

<p>Each touch (or mouse drag with primary button) is shown with a circle.
	<br />Once you end the drag, the circle disappears.
	<br />Circles should be right under the fingers, also when the page is scrolled.
	<br />Starting multiple drags at "precisely" the same time should be possible (try dual-finger tapping repeatedly).
	<br />The circles should not lag behind - that is a sign of the event skipping not working correctly.
</p>

<svg bind:this={ svgElem }>
	{#each circles as o}
		<circle class:n2={true} cx={o.x+o.r} cy={o.y+o.r} r={o.r}></circle>
	{/each}
</svg>


