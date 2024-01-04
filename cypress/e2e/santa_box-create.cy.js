const users = require("../fixtures/users.json");
const boxPage = require("../fixtures/pages/boxPage.json");
const generalElements = require("../fixtures/pages/general.json");
const dashboardPage = require("../fixtures/pages/dashboardPage.json");
const invitePage = require("../fixtures/pages/invitePage.json");
const inviteeBoxPage = require("../fixtures/pages/inviteeBoxPage.json");
const inviteeDashboardPage = require("../fixtures/pages/inviteeDashboardPage.json");
import { faker } from "@faker-js/faker";

describe("user can create a box and run it", () => {
  //пользователь 1 логинится
  //пользователь 1 создает коробку
  //пользователь 1 получает приглашение
  //пользователь 2 переходит по приглашению
  //пользователь 2 заполняет анкету
  //пользователь 3 переходит по приглашению
  //пользователь 3 заполняет анкету
  //пользователь 4 переходит по приглашению
  //пользователь 4 заполняет анкету
  //пользователь 1 логинится
  //пользователь 1 запускает жеребьевку
  let newBoxName = faker.word.noun({ length: { min: 5, max: 10 } });
  let wishes = faker.word.noun() + faker.word.adverb() + faker.word.adjective();
  let maxAmount = 150;
  let currency = "Евро";
  let inviteLink;

  it("user logins and create a box", () => {
    cy.visit("/login");
    cy.login(users.userAutor.email, users.userAutor.password);
    
    cy.contains("Создать коробку").click();
    cy.get(boxPage.boxNameField).type(newBoxName);
    cy.get(generalElements.arrowRight).click();
    cy.get(boxPage.sixthIcon).click();
    cy.get(generalElements.arrowRight).click();
    cy.get(boxPage.giftPriceToggle).check({force: true});
    cy.get(boxPage.maxAnount).type(maxAmount);
    cy.get(boxPage.currency).select(currency);
    cy.get(generalElements.arrowRight).click();
    cy.get(generalElements.arrowRight).click();

    cy.get(dashboardPage.createdBoxName).should("have.text", newBoxName);
    cy.get(".layout-1__header-wrapper-fixed .toggle-menu-item span")
      .invoke("text")
      .then((text) => {
        expect(text).to.include("Участники");
        expect(text).to.include("Моя карточка");
        expect(text).to.include("Подопечный");
      });
  });

  it("add participants", () => {
    cy.get(generalElements.addParticipants).click({force: true});
    cy.get(invitePage.inviteLink)
      .invoke("text")
      .then((link) => {
        inviteLink = link;
      });
    cy.clearCookies();
  });

  it("add users", () => {
    cy.approveAsUser(users.user1, wishes);

    cy.approveAsUser(users.user2, wishes);

    cy.approveAsUser(users.user3, wishes);
  });

  it("prize drawing", () => {
    cy.visit("/login");
    cy.login(users.userAutor.email, users.userAutor.password);
    cy.contains("Быстрая жеребьевка").click();
    cy.get(generalElements.arrowRight).click();
    cy.get(':nth-child(3) > .frm-wrapper > #input-table-0').type(users.user1.name);
    cy.get(':nth-child(4) > .frm-wrapper > #input-table-0').type(user.user1.email);
    cy.get(':nth-child(5) > .frm-wrapper > #input-table-0').type(users.user2.name);
    cy.get(':nth-child(6) > .frm-wrapper > #input-table-0').type(user.user2.email);
    cy.get(':nth-child(7) > .frm-wrapper > #input-table-0').type(users.user3.name);
    cy.get(':nth-child(8) > .frm-wrapper > #input-table-0').type(user.user3.email);
    cy.get(generalElements.arrowRight).click();
    cy.get(generalElements.arrowRight).click();
    cy.contains("Жеребьевка проведена!").should("exist");
  });

  it('should successfully send DELETE request', () => {
    cy.request({
      method: "DELETE",
      headers: {
        "Cookie": "jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMwMDE1NDMsImlhdCI6MTcwNDM2MjY0MywiZXhwIjoxNzA0MzY2MjQzfQ.LjMtQoi7qqHnaVeNStqhClIiZIJCpyG1OJUqr6gzxiw"
      },
      url: "https://staging.lpitko.ru/api/box/e7GQWe"
    }).then((response) => {
      expect(response.status).to.eq(200);
    });
  });
 
  after("delete box", () => {
    cy.visit("/login");
    cy.login(users.userAutor.email, users.userAutor.password);
    cy.contains("span", "Коробки").click();
    cy.get(generalElements.firstBox).first().click();
    cy.get(generalElements.toggleButton).click({ force: true });
    cy.contains("Архивация и удаление").click({ force: true });
    cy.get(generalElements.deleteBox).type(
      "Удалить коробку"
    );
    cy.get(generalElements.deleteButton).click({ force: true });
  });
});
