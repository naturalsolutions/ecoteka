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

  it("send reset link", function () {
    cy.get("[data-test=forgot-form-submit]").click();
  });

  it("empty email", function () {});

  it("wrong email", function () {});
});
