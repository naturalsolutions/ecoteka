/// <reference types="cypress" />

describe("Add tree", () => {
  beforeEach(function () {
    cy.loginAdmin();
    cy.visit("/ecoteka-1/tree/11481");
    cy.get("[data-test=tree-page]").should("be.visible");
    cy.fixture("trees").then(function (data) {
      this.data = data;
    });
  });

  it("success empty tree form", function () {
    cy.get("@canonicalname").clear();
    cy.get("[data-test=tree-page]").click();
    cy.get("@vernacularname").clear();
    cy.get("@height").clear();
    cy.get("@diameter").clear();
    cy.get("@address").clear();
    cy.get("@plantationDate").clear();
    cy.get("@treeOfInterest").then((input) => {
      if (input.val() == true) {
        input.click();
      }
    });
    cy.get("[data-test=save-tree-button]").click();
    cy.reload();
    cy.get("@vernacularname").should("be.empty");
  });

  it("check type fields tree", function () {
    cy.get("@canonicalname").invoke("attr", "type").should("eq", "text");
    cy.get("@vernacularname").invoke("attr", "type").should("eq", "text");
    cy.get("@height").invoke("attr", "type").should("eq", "number");
    cy.get("@diameter").invoke("attr", "type").should("eq", "number");
    cy.get("@address").invoke("attr", "type").should("eq", "text");
    cy.get("@plantationDate").invoke("attr", "type").should("eq", "text");
    cy.get("@treeOfInterest").invoke("attr", "type").should("eq", "checkbox");
  });
});
