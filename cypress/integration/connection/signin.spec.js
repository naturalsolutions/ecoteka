/// <reference types="cypress" />

describe("Sign In", () => {
  beforeEach(function () {
    cy.fixture("users").then(function (data) {
      cy.visit("/signin");
      cy.get("[data-test=signin-form-username]").as("username");
      cy.get("[data-test=signin-form-password]").as("password");
      cy.get("[data-test=signin-form-submit]").as("connection");
      this.data = data;
    });
  });

  it("success login", function () {
    cy.get("@username").invoke("attr", "type").should("eq", "email");
    cy.get("@username").type(this.data.admin.email);
    cy.get("@password").invoke("attr", "type").should("eq", "password");
    cy.get("@password").type(this.data.admin.password);
    cy.get("@connection").click();
    cy.get("[data-test=page-organizationSlug-index]");
  });
});
