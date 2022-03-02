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
    cy.get("@password").invoke("attr", "type").should("eq", "password");
    cy.login(this.data.admin.email, this.data.admin.password);
    cy.visit("/");
    cy.get("[data-test=login-button-header]").should("not.exist");
    cy.get("[data-test=user-menu]").should(() => {
      expect(localStorage.getItem("ecoteka_access_token")).to.exist;
      expect(localStorage.getItem("user")).to.exist;
    });
  });

  it("wrong password", function () {
    cy.get("@username").type(this.data.admin.email);
    cy.get("@password").type("wrong password").type("{enter}");
    cy.get("@password").should("have.attr", "aria-invalid", "true");
    cy.get(".MuiFormHelperText-root").should("be.visible");
  });

  it("wrong username", function () {
    cy.get("@username").type("wrong email");
    cy.get("@password").type("wrong password").type("{enter}");
    cy.get("@username").should("have.attr", "aria-invalid", "true");
    cy.get(".MuiFormHelperText-root").should("be.visible");
  });

  it("empty password", function () {
    cy.get("@username").type(this.data.admin.email);
    cy.get("@password").type("{enter}");
    cy.get("@password").should("have.attr", "aria-invalid", "true");
    cy.get(".MuiFormHelperText-root").and("be.visible");
  });

  it("empty username", function () {
    cy.get("@password").type(this.data.admin.password).type("{enter}");
    cy.get("@username").should("have.attr", "aria-invalid", "true");
    cy.get(".MuiFormHelperText-root").and("be.visible");
  });

  it("empty fields", function () {
    cy.get("@password").type("{enter}");
    cy.get("@username").should("have.attr", "aria-invalid", "true");
    cy.get("@password").should("have.attr", "aria-invalid", "true");
    cy.get(".MuiFormHelperText-root").and("be.visible");
  });

  it("type enter in email field", function () {
    cy.get("@username").type(this.data.admin.email).type("{enter}");
    cy.focused().should("have.attr", "type").and("eq", "password");
  });
});
