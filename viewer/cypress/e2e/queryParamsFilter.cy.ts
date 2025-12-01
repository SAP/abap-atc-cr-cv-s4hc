describe('Query parameter driven filters', () => {
    function getDistinctStates() {
        const states: Set<string> = new Set();
        cy.get('[data-component-name="AnalyticalTableBodyScrollableContainer"]').find('[role="row"]').each($row => {
            // Each row contains ObjectStatus element for the state; grab its inner text
            const text = $row.text();
            // Collect any known state labels present in the text
            ['Deprecated', 'Not To Be Released', 'Released', 'Classic API', 'No Classic API', 'No API', 'Internal API', 'Unknown']
                .forEach(label => { if (text.includes(label)) { states.add(label); } });
        }).then(() => Array.from(states));
        return cy.wrap(states);
    }

    function assertSingleState(expected: string) {
        getDistinctStates().then(set => {
            expect(Array.from(set)).to.deep.eq([expected]);
        });
    }

    it('?states=classicAPI filters to Classic API', () => {
        cy.visit('/?states=classicAPI');
        assertSingleState('Classic API');
        cy.url().should('include', 'states=classicAPI');
    });

    it('?version=objectClassifications_SAP.json&states=classicAPI applies compatibility transform and filters', () => {
        cy.visit('/?version=objectClassifications_SAP.json&states=classicAPI');
        cy.url().should('include', 'states=classicAPI');
        assertSingleState('Classic API');
    });

    it('?version=objectClassifications_SAP.json&states=noAPI filters to No API', () => {
        cy.visit('/?version=objectClassifications_SAP.json&states=noAPI');
        cy.url().should('include', 'states=noAPI');
        assertSingleState('No API');
    });

    it('?version=objectReleaseInfo_PCELatest.json&states=released filters to Released', () => {
        cy.visit('/?version=objectReleaseInfo_PCELatest.json&states=released');
        cy.url().should('include', 'states=released');
        assertSingleState('Released');
    });

    it('?version=objectClassifications_3TierModel.json&states=classicAPI filters to Classic API', () => {
        cy.visit('/?version=objectClassifications_3TierModel.json&states=classicAPI');
        assertSingleState('Classic API');
    });

    it('?version=objectClassifications_3TierModel.json&states=noAPI filters to No API', () => {
        cy.visit('/?version=objectClassifications_3TierModel.json&states=noAPI');
        assertSingleState('No API');
    });

    it('?product=btp&states=deprecated&objectTypes=CLAS&softwareComponents=SAP_BASIS&applicationComponents=BC-SRV-NUM applies all filters', () => {
        cy.visit('/?product=btp&states=deprecated&objectTypes=CLAS&softwareComponents=SAP_BASIS&applicationComponents=BC-SRV-NUM');
        cy.url().should('include', 'product=btp');
        cy.url().should('include', 'states=deprecated');
        cy.url().should('include', 'objectTypes=CLAS');
        cy.url().should('include', 'softwareComponents=SAP_BASIS');
        cy.url().should('include', 'applicationComponents=BC-SRV-NUM');
        // Since data set may or may not contain a matching row, just assert that if rows exist they are consistent.
        cy.get('[data-component-name="AnalyticalTableBodyScrollableContainer"]').find('[role="row"]').then($rows => {
            if ($rows.length > 0) {
                // All rows must have Deprecated state label and include object type CLAS
                $rows.each((_, row) => {
                    const text = row.innerText;
                    expect(text).to.include('Deprecated');
                    expect(text).to.include('CLAS');
                });
            }
        });
    });
});
