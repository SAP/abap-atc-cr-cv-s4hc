describe('template spec', () => {
    beforeEach(() => {
        cy.visit("/")
    })

    it("all rows in table are present", () => {
        cy.get("[data-component-name=\"AnalyticalTableBodyScrollableContainer\"]")
            .find("[role=\"row\"]")
            .first()
            .click()
    });
})