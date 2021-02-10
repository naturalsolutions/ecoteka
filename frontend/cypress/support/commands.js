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
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

import "cypress-localstorage-commands";
import "@testing-library/cypress/add-commands";

function logLocalStorage() {
  Object.keys(localStorage).forEach((key) => {
    cy.log(key + ": " + localStorage[key]);
  });
}

Cypress.Commands.add("login", () =>
  cy
    .request({
      method: "POST",
      url: "http://localhost:8000/api/v1/auth/login",
      form: true,
      body: {
        username: Cypress.env("username"),
        password: Cypress.env("password"),
      },
    })
    .then((resp) => {
      cy.setLocalStorage("ecoteka_access_token", resp.body.access_token);
      cy.setLocalStorage("ecoteka_refresh_token", resp.body.refresh_token);
      cy.request({
        method: "GET",
        url: "http://localhost:8000/api/v1/users/me",
        headers: {
          Authorization: `Bearer ${resp.body.access_token}`,
        },
      }).then((resp) => {
        const user = {
          ...resp.body,
          currentOrganization: resp.body.organizations[0],
        };
        cy.setLocalStorage("user", JSON.stringify(user));
      });
    })
);
