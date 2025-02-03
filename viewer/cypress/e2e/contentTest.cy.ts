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

    it("search for an entry", () => {
        cy.get("ui5-input[slot=\"searchField\"]")
            .find("input")
            .first()
            .type("LABNR_EXT1")

        cy.url().should("include", "LABNR_EXT1")
        cy.get("[data-component-name=\"AnalyticalTableBodyScrollableContainer\"]")
            .find("[role=\"row\"]")
            .should("have.length", 1)
            .find("span[title]")
            .contains("LABNR_EXT1")
            .should("exist")
    })

    it("check label remote-enabled is shown", () => {
        cy.visit("/?version=objectClassifications.json")
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