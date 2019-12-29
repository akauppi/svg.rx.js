<!--
- cases/Collision0.svelte
-
- Test cases as a Svelte component.
- Checks that SVG elements that do not collide are reported as such.
-->
<script>
    export const blah = 0;		// Testing out properties: <Collision0 blah=... />

    import "../../src/main.js";

    // tbd. Mocha, Chai...

    // Note: This causes warnings for circular dependencies. Seems chai 5.x might take them away
    //      -> https://github.com/chaijs/chai/issues/1256
    //
    import "chai/register-should";      // https://www.chaijs.com/guide/styles/#should

    const rect0 = document.querySelector("#case-0 > rect");
    const line0 = document.querySelector("#case-0 > line");

    const x = checkCollision(rect0, line0);

    describe('Collision tests #0', () => {
        it('Tests should be here', () => {
            // tbd. should
            //0.should.be(1);
            alert("Inside a test! :T");
            assert(false);
        });
    });
</script>

<style>
</style>

<h1>Rect with line etc.</h1>
<svg viewBox="0 0 220 100" id="case-0">
    <rect x="100" y="150" width="100" height="50"></rect>
    <line x1="0" y1="80" x2="100" y2="20" stroke="orange" />
</svg>

