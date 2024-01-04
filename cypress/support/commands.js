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

const loginPage = require("../fixtures/pages/loginPage.json");
const generalElements = require("../fixtures/pages/general.json");

Cypress.Commands.add("login", (userName, password) => {
  cy.get(loginPage.loginField).type(userName);
  cy.get(loginPage.passwordField).type(password);
  cy.get(generalElements.submitButton).click();
});

Cypress.Commands.add("approveAsUser", (user, wishes) => {
  cy.visit(inviteLink);
  cy.get(generalElements.submitButton).click();
  cy.contains("войдите").click();
  cy.login(user.email, user.password);
  cy.contains("Создать карточку участника").should("exist");
  cy.get(generalElements.submitButton).click();
  cy.get(generalElements.arrowRight).click();
  cy.get(generalElements.arrowRight).click();
  cy.get(inviteeBoxPage.wishesInput).type(wishes);
  cy.get(generalElements.arrowRight).click();
  cy.get(inviteeDashboardPage.noticeForInvitee)
    .invoke("text")
    .then((text) => {
      expect(text).to.contain("Это — анонимный чат с вашим Тайным Сантой");
    });
  cy.clearCookies();
});