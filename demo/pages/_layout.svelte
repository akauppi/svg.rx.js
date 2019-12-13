<script>
	import Nav from '../components/Nav.svelte';

	export let segment;
	let layoutName = "pages/_layout";
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

<Nav {segment}/>

<main>
	<slot scoped="{{ layoutName: layoutName }}"></slot>
</main>


