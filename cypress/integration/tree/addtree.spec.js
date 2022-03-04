/// <reference types="cypress" />

describe("Add tree", () => {
  beforeEach(function () {
    cy.loginAdmin();
  });

  it("success add tree", function () {
    cy.createtree();
  });

  //TO DO:
  // it("fail add tree", function () {
  //   if tree is out of organization reach or in unreachable place (water for instance)
  // });
});
