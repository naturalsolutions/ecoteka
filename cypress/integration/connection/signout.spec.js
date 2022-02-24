/// <reference types="cypress" />

describe("Sign Out", () => {
  beforeEach(function () {
    cy.fixture("users").then((data) => {
      cy.login(data.admin.email, data.admin.password);
    });
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

  //test redirection si organisation privée => home
  //si orga publique reste sur la m page
});
