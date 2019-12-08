<!--
- TrianglesDemo.svelte
-->

<script>
    export let name;
</script>

<style>
    .gxTriangle {
        fill: blue;
    }
    .gxTriangle .handle {
        visibility: hidden;
    }

    .gxTriangle.selected {
        stroke-width: 3px;
        stroke: red;
    }
    .gxTriangle.selected .handle {
        fill: red;
        visibility: initial;
    }
</style>

<!-- HTML -->
<p>
    HEY THERE {name}!!!
</p>
