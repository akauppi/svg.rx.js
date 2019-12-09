<script>
	import '../svg.rx.js';

	export let circles = [ {x: 100, y: 100, r: 20} ];		// { x: int, y: int, r: int }

	//...
</script>

<!-- CSS -->

<!--
-- tbd. These classes are intended to be used dynamically, but they cause "Unused CSS selector" warnings at the
--		development console. How to mark they're good? #help
-->
<style>
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
</style>

<!-- HTML -->

<svelte:head>
	<title>Circles</title>

	<!-- Here until we don't need it -->
	<script source="lib/svg.min.js"></script>
</svelte:head>

<h1>Circles demo</h1>

<p>Each touch (or mouse drag with primary button) is shown with a circle.
	<br />Once you end the drag, the circle disappears.
	<br />Circles should be right under the fingers, also when the page is scrolled.
	<br />Starting multiple drags at "precisely" the same time should be possible (try dual-finger tapping repeatedly).
	<br />The circles should not lag behind - that is a sign of the event skipping not working correctly.
</p>

<svg>
	{#each circles as o}
		<circle class:n2={true} cx={o.x+o.r} cy={o.y+o.r} r={o.r}></circle>
	{/each}
</svg>

