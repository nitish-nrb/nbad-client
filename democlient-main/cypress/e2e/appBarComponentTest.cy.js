describe("Renders and Checks the Test of Button on AppBar", () => {
  it("passes", () => {
    cy.visit("http://54.209.196.31:3000/");

    cy.get('[data-testid="loginsignup-btn"]')
      .should("exist")
      .should("have.text", "Login/Signup");
  });
});

describe("Redirects to Login Page", () => {
  it("passes", () => {
    cy.visit("http://54.209.196.31:3000/");

    cy.get('[data-testid="loginsignup-btn"]').click();
    cy.url().should("eq", "http://54.209.196.31:3000/login");
  });
});

describe("Successfully Login the User", () => {
  it("passes", () => {
    cy.visit("http://54.209.196.31:3000/");


    cy.get('[data-testid="loginsignup-btn"]').click();
    cy.url().should("eq", "http://54.209.196.31/login");
    cy.get("[data-cy=email]").type("nbanda@uncc.edu");
    cy.get("[data-cy=password]").type("Nitesh");
    cy.get('[data-testid="login-btn"]').click();

    cy.intercept('POST', 'http://34.237.5.250:3000/app/userDetails', {
        statusCode: 200,
        body: {
          message: 'Nitesh',
        },
      }).as('user details');

    cy.url().should("include", "/");
    cy.window().its("localStorage").invoke("getItem", "token").should("exist");
    cy.eyesOpen({
      appName: "Personal Budget",
      testName: "Login User Test",
    });
    cy.eyesCheckWindow();
    cy.eyesClose();
  });
});
