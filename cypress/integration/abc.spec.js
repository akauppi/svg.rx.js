/*
* cypress/abs.spec.js
*
* A sample on how tests can be done, using Cypress.
*
* Let's test the library separately from the demos (allows us to detach them).
*/
describe('svg.rx.js', () => {
    beforeEach(() => {
        cy.visit('index.html')
    });

    it('has an SVG cradle', () => {     // placeholder
        cy.get('svg')
            .should('exist');
    });

    //... tbd. Learn Cypress & make actual tests - per feature :)
});

