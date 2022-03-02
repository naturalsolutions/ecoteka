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

Cypress.Commands.add("logout", () => {
  cy.visit("/");
  cy.get("[data-test=user-menu]").click();
  cy.get("[data-test=button-logout]").click();
  cy.get("[data-test=button-confirm-logout]").click();
});
