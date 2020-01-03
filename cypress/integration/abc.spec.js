/*
* cypress/abs.spec.js
*
* A sample on how tests can be done, using Cypress.
*
* Let's test the library separately from the demos (allows us to detach them).
*/
import {createEventDispatcher} from "svelte";

describe('svg.rx.js', () => {
    beforeEach(() => {
        cy.visit('index.html')
    });

    // tbd. Iterate over the SVG's and send 'cyTest' event to them.
    //

    let dispatch = createEventDispatcher();
    function myCustom() {
        cy.get('svg#case-1').dispatch("cyTest");
    }

    it('has an SVG cradle', () => {     // placeholder
        cy.get('svg')
            .should('exist');
    });

    //... tbd. Learn Cypress & make actual tests - per feature :)
});

