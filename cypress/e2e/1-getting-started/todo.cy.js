/// <reference types="cypress" />

// Welcome to Cypress!
//
// This spec file contains a variety of sample tests
// for a todo list app that are designed to demonstrate
// the power of writing tests in Cypress.
//
// To learn more about how Cypress works and
// what makes it such an awesome testing tool,
// please read our getting started guide:
// https://on.cypress.io/introduction-to-cypress

describe('example to-do app', () => {
  beforeEach(() => {
    // Cypress starts out with a blank slate for each test
    // so we must tell it to visit our website with the `cy.visit()` command.
    // Since we want to visit the same URL at the start of all our tests,
    // we include it in our beforeEach function so that it runs before each test
    cy.visit('/login')
  })

	it("checking the login form", () => {

		// enter the email and password
		cy.get('[data-test="login-input-email"]').type("test333@gmail.com")
		cy.get('[data-test="login-input-password"]').type("test000")

		// check if the button is disabled or not
		cy.get('[data-test="login-submit-button"]').should("not.be.disabled")

		// click the submit button
		//cy.get('[data-test="login-submit-button"]').click()
	})

	it("Wrong password entered in the login form", () => {

		// enter the email and password
		cy.get('[data-test="login-input-email"]').type("test333@gmail.com")
		cy.get('[data-test="login-input-password"]').type("test0000")

		// check if the button is disabled or not
		cy.get('[data-test="login-submit-button"]').should("not.be.disabled")

		// click the submit button
		cy.get('[data-test="login-submit-button"]').click()

		// showing the button loader on submit form
		cy.get('.css-avwy6')
	})

	it("checking the themetoggle button", () => {
		
		// check the button is present or not on the page
		cy.get('[data-test="web-nav-link-themetoggle"]')

		// click on the themetoggle button
		cy.get('[data-test="web-nav-link-themetoggle"]').click()
		cy.get('[data-test="web-nav-link-themetoggle"]').click()
		cy.get('[data-test="web-nav-link-themetoggle"]').click()
		cy.get('[data-test="web-nav-link-themetoggle"]').click()

	})

	it("checking it works on phone", () => {

		cy.viewport('iphone-6')
		cy.get('[data-test="mobile-nav-link-menu"]').click()
		cy.get('[data-test="mobile-sidebar-container"]')
		cy.get('[data-test="mobile-sidebar-close"]').click()
	})

	it("checking the third party way to login", () => {

		cy.get('[data-test="login-google"]').click()
		cy.get('[data-test="login-facebook"]').click()

		cy.get('[data-test="web-nav-link-home"]').click()
	})

})


