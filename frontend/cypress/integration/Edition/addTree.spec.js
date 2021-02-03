function logLocalStorage() {
  Object.keys(localStorage).forEach((key) => {
    cy.log(key + ": " + localStorage[key]);
  });
}

before(() => {
  cy.login();
  cy.saveLocalStorage();
});

beforeEach(() => {
  cy.restoreLocalStorage();
});

describe("Add a Tree", () => {
  it("Visits Edition page", () => {
    logLocalStorage();
    cy.visit("http://localhost:8000/edition/");
  });
});
