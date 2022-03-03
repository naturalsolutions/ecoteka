/// <reference types="cypress" />

describe("Add tree", () => {
  beforeEach(function () {
    cy.loginAdmin();
    cy.visit("/ecoteka-1/map");
  });

  it("success add tree", function () {
    cy.createtree();
  });
});
