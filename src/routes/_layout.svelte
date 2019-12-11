<script>
	import Nav from '../components/Nav.svelte';

	export let segment;
</script>

<!-- delete
<script context="module">    // runs once
	// Provide a runtime 'assert' for 'svg.rx.js' (and maybe others)
	//
	import { strict as myAssert } from 'assert';
	console.log( "Imported: "+ myAssert );

	const g = (1, eval)('this');    // see -> https://stackoverflow.com/questions/9107240/1-evalthis-vs-evalthis-in-javascript
	myAssert( typeof g === "object" );
	g.assert = myAssert;			// spread to others
</script>
-->

<style>
	main {
		position: relative;
		max-width: 56em;
		background-color: white;
		padding: 2em;
		margin: 0 auto;
		box-sizing: border-box;
	}
</style>

<Nav {segment}/>

<main>
	<slot></slot>
</main>