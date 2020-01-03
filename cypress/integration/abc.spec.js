/*
* cypress/abs.spec.js
*
* A sample on how tests can be done, using Cypress.
*
* Let's test the library separately from the demos (allows us to detach them).
*/
describe('svg.rx.js collision detection', () => {
    beforeEach(() => {
        cy.visit('index.html')
    });

    // tbd. Iterate over the SVG's on the page, and assure we have tests for all of them.

    it('have a circle that changes colour', () => {     // EXPLORATION
        cy.get('svg#case-1 > circle').then( $circle => {
            getComputedStyle($circle.get(0)).fill.should.be( 'red');
            cy.click($circle);

            getComputedStyle($circle.get(0)).fill.should.be( 'blue');
            cy.click($circle);

            getComputedStyle($circle.get(0)).fill.should.be( 'red');
            cy.click($circle);
        });
    });

    //... tbd. Learn Cypress & make actual tests - per feature :)
});

