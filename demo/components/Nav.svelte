<script>
	export let segment;		// undefined | "circles" | "transform" | ... ; adjusts the visuals
</script>

<style>
	nav {
		border-bottom: 1px solid rgba(255,62,0,0.1);
		font-weight: 300;
		padding: 0 1em;
	}

	ul {
		margin: 0;
		padding: 0;
	}

	/* clearfix */
	ul::after {
		content: '';
		display: block;
		clear: both;
	}

	li {
		display: block;
		float: left;
	}

	.selected {
		position: relative;
		display: inline-block;
	}

	.selected::after {
		position: absolute;
		content: '';
		width: calc(100% - 1em);
		height: 2px;
		background-color: rgb(255,62,0);
		display: block;
		bottom: -1px;
	}

	a {
		text-decoration: none;
		padding: 1em 0.5em;
		display: block;
	}

	.dimmed {
		color: #888888;
		text-decoration: none;
		padding: 1em 0.5em;
		display: block;
		font-style: italic;
	}
</style>

<nav>
	<ul>
		<li><a class:selected='{segment === undefined}' href='.'>home</a></li>
		<li><a class:selected='{segment === "circles"}' href='circles'>circles</a></li>
		<li><a class:selected='{segment === "transform"}' href='transform'>transform</a></li>

		<!--
		<li><a class:dimmed={true} class:selected='{segment === "triangles"}' href='triangles'>triangles</a></li>
		<li><a class:dimmed={true} class:selected='{segment === "petals"}' href='petals'>petals</a></li>
		-->
		<li class:dimmed={true}>triangles</li>
		<li class:dimmed={true}>petals</li>

		<!-- disabled
		-- for the blog link, we're using rel=prefetch so that Sapper prefetches
		     the blog data when we hover over the link or tap it on a touchscreen --
		<li><a rel=prefetch class:selected='{segment === "blog"}' href='blog'>blog</a></li>
		-->
	</ul>
</nav>
