# Svelte ideas

## Adding a parameter for `onMount`

>Before suggesting to Svelte (as a PR?) let's see in practise how much we'd benefit from this.

Currently, `onMount` receives no parameters and is normally being used together with `bind:this` to get the element in question.

Svelte could make this easier, by providing the root element's handle for the callback:

Now:

```svelte
<script>
	let svgElem;
	onMount(() => { ... something with `svgElem` });
</script>

<svg bind:this={ svgElem }>
  ...
</svg>  
```

Could be:

```svelte
<script>
	onMount(el => ...something...)
</script>

<svg>
  ...
</svg>  
```


Alternatively, elements themselves could have an `on:mount={ el => ... }` handler, but this maybe deviates too much from normal JavaScript event flows. It's good to keep abstractions one-to-one with the underlying well established technologies (i.e. adding cushioning decrades the driving experience).






