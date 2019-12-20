/*
* cypress/abs.spec.js
*
* A sample on how tests can be done, using Cypress.
*
* Let's test the library separately from the demos (allows us to detach them).
*/
describe('svg.rx.js', () => {
    beforeEach(() => {
        cy.visit('/')
    });

    it('has an SVG cradle', () => {     // placeholder
        cy.get('svg');      // note: we don't need to assert/should; CY fails if the 'get' does
    });

    //... tbd. Learn Cypress & make actual tests - per feature :)
});

