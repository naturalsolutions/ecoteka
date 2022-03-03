/// <reference types="cypress" />

describe("Add tree", () => {
  beforeEach(function () {
    cy.loginAdmin();
    cy.visit("/ecoteka-1/tree/11481");
    cy.get("[data-test=tree-page]").should("be.visible");
    cy.fixture("trees").then(function (data) {
      cy.get("[data-test=tree-basic-form-canonicalname] input").as(
        "canonicalname"
      );
      cy.get("[data-test=tree-basic-form-vernacularname]").as("vernacularname");
      cy.get("[data-test=tree-basic-form-height]").as("height");
      cy.get("[data-test=tree-basic-form-diameter]").as("diameter");
      cy.get("[data-test=tree-basic-form-address]").as("address");
      cy.get("[data-test=tree-basic-form-plantationDate]").as("plantationDate");
      cy.get("[data-test=tree-basic-form-treeOfInteres] input").as(
        "treeOfInterest"
      );
      this.data = data;
    });
  });

  it("success empty tree form", function () {
    cy.get("@canonicalname").clear();
    cy.get("[data-test=tree-page]").click();
    cy.get("@vernacularname").clear();
    cy.get("@height").clear();
    cy.get("@diameter").clear();
    cy.get("@address").clear();
    cy.get("@plantationDate").clear();
    // cy.get("@treeOfInterest").then((input) => {
    //   if (input.val() == true) {
    //     input.click();
    //   }
    // });
    cy.get("[data-test=save-tree-button]").click();
    cy.reload();
    cy.get("@vernacularname").should("be.empty");
  });

  it("check type fields tree", function () {
    cy.get("@canonicalname").invoke("attr", "type").should("eq", "text");
    cy.get("@vernacularname").invoke("attr", "type").should("eq", "text");
    cy.get("@height").invoke("attr", "type").should("eq", "number");
    cy.get("@diameter").invoke("attr", "type").should("eq", "number");
    cy.get("@address").invoke("attr", "type").should("eq", "text");
    cy.get("@plantationDate").invoke("attr", "type").should("eq", "text");
    cy.get("@treeOfInterest").invoke("attr", "type").should("eq", "checkbox");
  });

  // it("success edit tree", function () {
  //   cy.get("@canonicalname")
  //     .type(this.data.commontree.canonicalname)
  //     .type("{downArrow}")
  //     .type("{enter}");
  //   cy.get("[data-test=tree-page]").click();
  //   cy.get("@vernacularname").type(this.data.commontree.vernacularname);
  // cy.get("@height").invoke("attr", "type").should("eq", "number");
  //   cy.get("@height").type(this.data.commontree.height);
  //   cy.get("@diameter").type(this.data.commontree.diameter);
  //   cy.get("@address").type(this.data.commontree.address);
  //   cy.get("@plantationDate").type(this.data.commontree.plantationDate);
  //   cy.get("@treeOfInterest").click();
  //   cy.get("[data-test=save-tree-button]").click();
  //   cy.reload();
  //   cy.get("@vernacularname").should(
  //     "have.value",
  //     this.data.commontree.vernacularname
  //   );
  // });

  // it("fail edit tree", function () {
  //   cy.get("@canonicalname")
  //     .type(this.data.failtree.canonicalname)
  //     .type("{downArrow}")
  //     .type("{enter}");
  //   cy.get("[data-test=tree-page]").click();
  //   cy.get("@vernacularname").type(this.data.failtree.vernacularname);
  //   cy.get("@height").type(this.data.failtree.height);
  //   cy.get("@diameter").type(this.data.failtree.diameter);
  //   cy.get("@address").type(this.data.failtree.address);
  //   cy.get("@plantationDate").type(this.data.failtree.plantationDate);
  //   cy.get("@treeOfInterest").click();
  //   cy.get("[data-test=save-tree-button]").click();
  //   cy.reload();
  //   cy.get("@vernacularname").should(
  //     "not.have.value",
  //     this.data.failtree.vernacularname
  //   );
  //   cy.get("@height").should("not.have.value", this.data.failtree.height);
  // });

  it("test autocomplete tree", function () {
    cy.get("@canonicalname").type("a");
    cy.contains("Abarema acreana").should("be.visible");
    cy.get("@canonicalname").clear().type("zy");
    cy.contains("Zygogynum vinkii").should("be.visible").click();
    cy.get("@canonicalname").should("have.value", "Zygogynum vinkii");
  });

  it("test autocomplete tree", function () {
    cy.get("@canonicalname").type("a");
    cy.contains("Abarema acreana").should("be.visible");
    cy.get("@canonicalname").clear().type("zy");
    cy.contains("Zygogynum vinkii").should("be.visible").click();
    cy.get("@canonicalname").should("have.value", "Zygogynum vinkii");
  });

  it("test datePlantation tree", function () {
    cy.get("@plantationDate").type("a");
    cy.get("@plantationDate").should("not.have.value", "a");
    cy.get("@plantationDate").clear().type("1");
    cy.get("@plantationDate").should("have.attr", "aria-invalid", "true");
  });
});
