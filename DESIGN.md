# Design

## JavaScript inheritance

There are many ways of doing inheritance in JavaScript. We wanted to balance between the 'plain' JavaScript simplicity, and getting things declared in pretty much a single place.

The actual criteria are:

- want to use construction parameters (i.e. `new Xxx` calling for instance creation)
- want to have `instanceof` working, also for supertypes (this abandons ways that simply copy the prototype tables instead of creating proper prototype chains)
- keep `Gx` apart from the `svg.js` library on the upper levels - i.e. not use its `SVG.invent` API for implementing inheritance.
- be mentally prepared for transitioning to ES6 class inheritance model, once we feel like it

As any JavaScript project, we used maybe too much time in dealing with such a simple detail. It's just the way things are. 

### Sample

See the `GxSub` code in `test/gx-test.js` for a sample on how to inherit.

### Property tables

`Object.create` introduces the property table concept, which may be useful. The choice, whether to use this feature or not is wholly on the inheriting class.

