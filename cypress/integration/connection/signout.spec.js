/// <reference types="cypress" />

describe("Sign Out", () => {
  beforeEach(function () {
    cy.loginAdmin();
  });

  it("success logout", function () {
    cy.logout();
    cy.visit("/signin");
    cy.get("[data-test=user-menu]").should("not.exist");
    cy.get("[data-test=login-button-header]").should(() => {
      expect(localStorage.getItem("user")).to.be.null;
      expect(localStorage.getItem("ecoteka_access_token")).to.be.null;
    });
  });

  it("private organization logout", function () {
    cy.logout();
    cy.visit("/ecoteka-1");
    cy.url().should("not.contain", "ecoteka-1");
  });

  it("public organization logout", function () {
    cy.logout();
    cy.visit("/argenteuil-2");
    cy.url().should("contain", "argenteuil-2");
    cy.get("[data-test=public-organization]").should("be.visible");
  });
});
