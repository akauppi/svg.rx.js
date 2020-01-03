/*
* cypress/abs.spec.js
*
* A sample on how tests can be done, using Cypress.
*
* Let's test the library separately from the demos (allows us to detach them).
*/
import "chai/register-should";      // https://www.chaijs.com/guide/styles/#should

describe('svg.rx.js collision detection', () => {
    beforeEach(() => {
        cy.visit('index.html')
    });

    assert(should);

    // tbd. Iterate over the SVG's on the page, and assure we have tests for all of them.

    it.only('have a title', () => {     // DEBUG
        cy.get('h1');
    });

    it('have a circle that changes colour', () => {     // EXPLORATION
        cy.get('svg#case-1 > circle').then( ($circle) => {
            const el = $circle.get(0);  // one element; native
            const red = "rgb(255, 0, 0)";
            const blue = "rgb(0, 0, 255)";

            getComputedStyle(el).fill.toString().should.equal(blue);
        }); /***.and()
            $circle.click();

            getComputedStyle(el).fill.toString().should.equal(red);
            cy.click($circle);

            getComputedStyle(el).fill.toString().should.equal(blue);
            cy.click($circle);
        });***/
    });

    //... tbd. Learn Cypress & make actual tests - per feature :)
});

