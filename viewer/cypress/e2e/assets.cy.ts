describe('Viewer assets', () => {
    it('loads the app and its public assets from the configured base path', () => {
        cy.visit('/');
        cy.get('[data-component-name="AnalyticalTableBodyScrollableContainer"]')
            .find('[role="row"]').should('not.be.empty');
        cy.get('img[alt="SAP Logo"]').should('be.visible').and($logo => {
            expect(($logo[0] as HTMLImageElement).naturalWidth).to.be.greaterThan(0);
        });

        for (const asset of ['favicon.ico', 'manifest.json', 'translations/messagebundle_en.properties']) {
            cy.request(asset).its('status').should('eq', 200);
        }
    });
});
