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
  it("Visits Edition page, add a Tree and edit its features", () => {
    cy.visit("http://localhost:8000/edition/").then(() => {
      cy.get('[value="edition"]').click();
      cy.get('[value="draw_point"]').click();
      cy.wait(3000);
      cy.get(".mapboxgl-canvas")
        .click(300, 200)
        .click(400, 500)
        .click(100, 450)
        .click(227, 466);
      cy.get('[value="simple_select"]').click();
      cy.get(".mapboxgl-canvas").click(227, 466);
      cy.get(
        ":nth-child(1) > .MuiAutocomplete-root > .MuiFormControl-root > .MuiInputBase-root"
      )
        .click()
        .type("Quercus robur");
      cy.get('.MuiAutocomplete-popper li[data-option-index="0"]').click();
      cy.get(
        ":nth-child(2) > .MuiGrid-container > :nth-child(3) > .MuiFormControl-root > .MuiInputBase-root > .MuiInputBase-input"
      )
        .click()
        .type("Chêne pédonculé");
      cy.get(
        ":nth-child(6) > .MuiGrid-container > :nth-child(2) > .MuiButtonBase-root"
      ).click();
      cy.get('[value="analysis"]').click();
      cy.get(".mapboxgl-canvas").dblclick(227, 466);
    });
  });
});
