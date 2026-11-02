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

    it("check label remote-enabled is shown", () => {
        cy.get("ui5-input[slot=\"searchField\"]")
        .find("input")
        .first()
        .type("BAPI_ACCSERV_CHECKACCASSIGNMT")

        cy.url().should("include", "BAPI_ACCSERV_CHECKACCASSIGNMT")
        cy.get("[data-component-name=\"AnalyticalTableBodyScrollableContainer\"]")
            .find("[role=\"row\"]")
            .first()
            .click()

        cy.get("div[slot=\"midColumn\"]")
            .find("[data-component-name=\"DynamicPageContent\"]")
            .contains("remote-enabled")
            .should("exist")
    })
})