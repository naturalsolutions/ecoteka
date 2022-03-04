// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add("login", (username, password) => {
  cy.session([username, password], () => {
    cy.visit("/signin");
    cy.get("[data-test=signin-form-username]").type(username);
    cy.get("[data-test=signin-form-password]").type(password);
    cy.get("[data-test=signin-form-submit]").click();
    cy.get("[data-test=page-organizationSlug-index]", {
      timeout: 30000,
    }).should("be.visible");
  });
});

Cypress.Commands.add("loginAdmin", () => {
  cy.session("admin session", () => {
    cy.visit("/signin");
    cy.fixture("users").then((data) => {
      cy.login(data.admin.email, data.admin.password);
    });
  });
});

Cypress.Commands.add("logout", () => {
  cy.visit("/");
  cy.get("[data-test=user-menu]").click();
  cy.get("[data-test=button-logout]").click();
  cy.get("[data-test=button-confirm-logout]").click();
});

Cypress.Commands.add("createtree", () => {
  cy.visit("/ecoteka-1/map");
  cy.get("[data-test=add-tree-button]").click({ force: true });
  cy.get("#view-default-view", {
    timeout: 30000,
  }).click({ force: true });
  cy.get("[data-test=tree-basic-form]", {
    timeout: 30000,
  }).should("be.visible");
  cy.get("[data-test=save-tree-button]").click();
  cy.get("[data-test=update-tree-button]").click();
  cy.get("[data-test=tree-page]", {
    timeout: 30000,
  }).should("be.visible");
});

Cypress.Commands.add("visitTree", (treeId) => {
  cy.visit("/ecoteka-1/tree/" + treeId);
  cy.get("[data-test=tree-page]").should("be.visible");
});
