<!--
- cases/Collision-1.svelte
-
- Test cases as a (second) Svelte component.
-
- (just a placeholder, for now)
-->
<script>
    export const blah = 0;		// Testing out properties: <Collision0 blah=... />

    import { onMount } from 'svelte';

    import "../../src/main.js";

    // tbd. Mocha, Chai...

    // Note: This causes warnings for circular dependencies. Seems chai 5.x might take them away
    //      -> https://github.com/chaijs/chai/issues/1256
    //
    import "chai/register-should";      // https://www.chaijs.com/guide/styles/#should

    let circleClicked = false;

    /*
    * Run the test, either manually or pushed by Cypress
    */
    function testMe() {
        const circleEl = svgEl.querySelector('circle');

        // ...undone!


        describe('#indexOf()', function() {
            it('should return -1 when the value is not present', function() {
                assert.equal([1, 2, 3].indexOf(4), -1);
            });
        });
    }

    let svgEl;

    onMount(() => {
        //const rect0 = document.querySelector("#case-1 > rect");
        //const circle0 = document.querySelector("#case-1 > circle");
    });
</script>

<style>
    circle {
        fill: blue;
        stroke: gray;
        transition: 300ms;  /* any change of any 'circle' parameters (we only change the fill) */
    }
    circle.selected {
        fill: red;
    }
</style>

<h1>Rect with circle (sounds like an art title)</h1>
<svg viewBox="0 0 220 100" bind:this={svgEl} id="case-1">
    <rect x="100" y="150" width="100" height="50"></rect>
    <circle class:selected={circleClicked} cx="78" cy="52" r="30" on:click={() => circleClicked = !circleClicked }/>
</svg>
<button on:click={testMe}>Test</button>
