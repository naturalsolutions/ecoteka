/// <reference types="cypress" />

describe("Forgot Password", () => {
  beforeEach(function () {
    cy.visit("/forgot");
  });

  it("already logged in", function () {
    cy.fixture("users").then((data) => {
      cy.login(data.admin.email, data.admin.password);
    });
    cy.visit("/forgot");
    cy.url().should("not.contain", "forgot");
  });

  it("success send reset link", function () {
    cy.fixture("users").then((data) => {
      cy.get("[data-test=forgot-form-username]").type(data.admin.email);
    });
    cy.get("[data-test=forgot-form-submit]").click();
    cy.get("[data-test=forgot-form-success]").should("be.visible");
  });

  it("empty email", function () {
    cy.get("[data-test=forgot-form-submit]").click();
    cy.get(".MuiFormHelperText-root").should("be.visible");
  });

  it("wrong email", function () {
    cy.get("[data-test=forgot-form-username]").type("wrong email");
    cy.get("[data-test=forgot-form-submit]").click();
    cy.get(".MuiFormHelperText-root").should("be.visible");
  });

  it("unmatched email", function () {
    cy.get("[data-test=forgot-form-username]").type("unmatched@email.com");
    cy.get("[data-test=forgot-form-submit]").click();
    cy.get(".MuiFormHelperText-root").should("be.visible");
  });
});
