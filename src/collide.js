/*
* collide.js
*
* Collision detection of SVG elements
*
* Note:
*   SVG has `getIntersectionList` and `checkIntersection` but they work only on bounding box level.
*
* Design criteria:
*   - "good enough for games" (performance etc.)
*   - accurate
*   - if not colliding, give an estimate of distance (nearest points); can be used for "warming up" animations
*
* References:
*   Collision detection with SVG (blog, 2014)
*     -> https://www.inkfood.com/collision-detection-with-svg/
*/


/*
* Provides a number that indicates true collision between two SVG elements:
*
* Returns:
*       == -1:  elements collide
*       == 0:   elements touch each other (up to the application whether they wish to see this as a collision)
*       0 < .. < 'warnDist': elements don't collide. They are, however, near, and the nearest distance is returned.
*       inf:    elements don't collide (they are farther apart than 'warnDist').
*
* 'warnDist' can be used if some animation or other "oh, that's close" effect is wanted. Running without it is fastest.
*/
function checkCollision(el1, el2, warnDistOpt) {     // (SVGElement, SVGElement [, number == 0.0]) -> number

    const warnDist = warnDistOpt || 0.0;

    // 1. Check bounding boxes
    //
    const b1 = el1.getBoundingClientRect();     // SVGRect: { left:, right:, top:, bottom: }
    const b2 = el2.getBoundingClientRect();

    const cleared = (b2.left > b1.right + warnDist ||
        b2.right < b1.left - warnDist ||
        b2.top > b1.bottom + warnDist ||
        b2.bottom < b1.top - warnDist);

    if (cleared) {
        return Infinity;    // boundary boxes are far apart
    }

    // 2. Need for a closer look
    //
    debugger;
    //...
}

export {
    checkCollision
};

