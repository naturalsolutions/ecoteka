/// <reference types="cypress" />

describe("Add tree", () => {
  beforeEach(function () {
    cy.loginAdmin();
    // cy.createtree();
    cy.visitTree("11530");
    cy.get("[data-test=tree-full-form-0]").click();
    cy.fixture("trees").then(function (data) {
      this.data = data;
    });
  });

  it("success edit form-0", function () {
    cy.get("[data-test=tree-full-form-family]")
      .clear()
      .type(this.data.commontree.family);
    cy.get("[data-test=save-tree-button]").click();
    cy.reload();
    cy.get("[data-test=tree-full-form-0]").click();
    cy.get("[data-test=tree-full-form-family]").should(
      "have.value",
      this.data.commontree.family
    );
  });

  it("check type fields tree", function () {
    cy.get("[data-test=tree-full-form-family] input")
      .invoke("attr", "type")
      .should("eq", "text");
    cy.get("[data-test=tree-full-form-genus] input")
      .invoke("attr", "type")
      .should("eq", "text");
    cy.get("[data-test=tree-full-form-species] input")
      .invoke("attr", "type")
      .should("eq", "text");
    cy.get("[data-test=tree-full-form-cultivar] input")
      .invoke("attr", "type")
      .should("eq", "text");
    cy.get("[data-test=tree-full-form-townshipCode] input")
      .invoke("attr", "type")
      .should("eq", "number");
    cy.get("[data-test=tree-full-form-zipCode] input")
      .invoke("attr", "type")
      .should("eq", "number");
    cy.get("[data-test=tree-full-form-zone] input")
      .invoke("attr", "type")
      .should("eq", "text");
    cy.get("[data-test=tree-full-form-code] input")
      .invoke("attr", "type")
      .should("eq", "text");
  });
});
