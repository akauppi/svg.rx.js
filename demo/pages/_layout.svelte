<script>
	import Nav from '../components/Nav.svelte';

	export let route;		// { path: "/index" | "/circles" | ... }

	// Segment for '<Nav>'
	const segment =
		(route.path === "/index") ? "" :
		/^\/([^/]+)$/.exec(route.path)[1];		// "circles"|...
</script>

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

<Nav segment={segment} />

<main>
	<slot></slot>
</main>
