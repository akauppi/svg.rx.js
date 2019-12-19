describe('svg.rx.js (using demos for tests)', () => {
	beforeEach(() => {
		cy.visit('/')
	});

	it('has the correct <h1>', () => {
		cy.contains('h1', 'svg.rx.js demos')
	});

	it('navigates to /circles', () => {
		cy.get('nav a').contains('circles').click();
		cy.url().should('include', '/circles');
	});
});