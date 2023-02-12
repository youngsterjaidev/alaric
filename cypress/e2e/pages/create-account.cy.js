/// <reference types="cypress" />

describe("Create An Account", () => {
  beforeEach(() => {
    cy.visit("/createAccount");
  });

  it("creating a user ", () => {
    cy.get('[data-test="create-account-input-username"]').type("test333");
    cy.get('[data-test="create-account-input-email"]').type(
      "test333@gmail.com"
    );
    cy.get('[data-test="create-account-input-password"]').type(
      "test333@gmail.com"
    );

    cy.get('[data-test="create-account-submit-button"]').click();

    cy.get(".css-avwy6");
  });
});
