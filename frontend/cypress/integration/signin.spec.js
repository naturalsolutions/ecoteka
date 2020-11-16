describe('Go to Signin page', () => {
  it('Visits signin page', () => {
    cy.visit('http://localhost:8000/signin/');
    cy.get('[name="username"]')
      .type(Cypress.env("username"))
      .should('have.value', Cypress.env("username"));
    cy.get('[name="password"]').type(Cypress.env("password"));
    cy.contains('OK').click();
  });
})