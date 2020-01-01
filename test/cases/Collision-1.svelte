<!--
- cases/Collision-1.svelte
-
- Test cases as a (second) Svelte component.
-
- (just a placeholder, for now)
-->
<script>
    export const blah = 0;		// Testing out properties: <Collision0 blah=... />

    import "../../src/main.js";

    // tbd. Mocha, Chai...

    // Note: This causes warnings for circular dependencies. Seems chai 5.x might take them away
    //      -> https://github.com/chaijs/chai/issues/1256
    //
    import "chai/register-should";      // https://www.chaijs.com/guide/styles/#should

    const rect0 = document.querySelector("#case-1 > rect");
    const circle0 = document.querySelector("#case-1 > circle");

    let circleClicked = false;
</script>

<style>
    circle {
        fill: blue;
        stroke: gray;
        transition: 300ms;  // any change of any 'circle' parameters (we only change the fill)
    }
    circle.selected {
        fill: red;
    }
</style>

<h1>Rect with circle (sounds like an art title)</h1>
<svg viewBox="0 0 220 100" id="case-0">
    <rect x="100" y="150" width="100" height="50"></rect>
    <circle class:selected={circleClicked} cx="78" cy="52" r="30" on:click={() => circleClicked = !circleClicked }/>
</svg>
