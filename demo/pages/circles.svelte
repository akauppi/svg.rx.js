<script>
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	import { assert } from 'assert';

	// tbd. an import from node, or elsewhere where published (to test the full route)
	// import ...;
	import '../../src/svg.rx.js';		// in the same repo

	assert( SVGElement.prototype.rx_draggable );

	export let circles = [];		// { x: int, y: int, r: int, n: 0..9 }

	let svgElem;	// 'SVGSVGElement'

	const COLORS = 10;
	let nextN = 0; 		// 0..'COLORS-1' and again

	onMount(() => {		// Svelte note: could provide the element as a parameter (now 'undefined')
		const outerObs = svgElem.rx_draggable();		// -> observable of observables of { x: Int, y: Int }

		outerObs.subscribe( dragObs => {	// new drag

			console.debug("New drag");
			const myN = nextN;
			nextN = (nextN+1) % COLORS;

			const circle = { r: 50, n: myN };		// coords added at first drag handling
			circles = circles.concat( circle );

			//const firstTime = true;	// tbd. need this?

			dragObs.subscribe( o => {		// { x: Int, y: Int }
				console.debug(`Dragging at: { x: ${o.x}, y: ${o.y} }`);

				circle.x = o.x;
				circle.y = o.y;
				circles = circles;	// update the DOM on next chance
			},
			null,	// error handling
			() => {		// end of drag
				const i = circles.indexOf(circle);
				circles.splice(i, 1);		// remove
				circles = circles;			// update DOM on next chance

				console.debug("Circle removed");
			})
		});
	});

	//...
</script>

<!-- CSS -->

<style>
	/* tbd. These classes are intended to be used dynamically, but they cause "Unused CSS selector" warnings at the
	 * development console. How to mark they're good? #help
	 */
	circle[n="0"] {
		fill: blue;
	}
	circle[n="1"] {
		fill: gray;
	}
	circle[n="2"] {
		fill: blue;
	}
	circle[n="3"] {
		fill: purple;
	}
	circle[n="4"] {
		fill: red;
	}
	circle[n="5"] {
		fill: green;
	}
	circle[n="6"] {
		fill: orange;
	}
	circle[n="7"] {
		fill: yellow;
	}
	circle[n="8"] {
		fill: magenta;
	}
	circle[n="9"] {
		fill: aqua;
	}
</style>

<!-- HTML -->

<svelte:head>
	<title>Circles</title>
</svelte:head>

<h1>Circles demo</h1>

Each touch (or mouse drag with primary button) is shown with a circle.
<ul>
	<li>Once you end the drag, the circle disappears.</li>
	<li>Circles should be right under the fingers, also when the page is scrolled.</li>
	<li>Starting multiple drags at "precisely" the same time should be possible (try dual-finger tapping repeatedly).</li>
	<li>The circles should not lag behind - that is a sign of the event skipping not working correctly.</li>
</ul>

<svg bind:this={ svgElem }>
	{#each circles as o}
		<circle in:fade="{{ duration: 1000 }}" out:fade="{{ duration: 200 }}" cx={o.x} cy={o.y} r={o.r} n={o.n}></circle>
	{/each}
</svg>


