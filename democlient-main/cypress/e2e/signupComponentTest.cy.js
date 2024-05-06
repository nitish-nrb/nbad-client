describe("Signup Page", () => {
    it("Should Show Validation Error when existing user Signup", () => {
      cy.visit("http://54.209.196.31:3000/signup");

      cy.intercept('POST', 'http://34.237.5.250:3000/app/signup', {
        statusCode: 201,
        body: {
          message: 'Email is already registered, Please Login',
        },
      }).as('signupRequest');

      cy.get('[data-cy=email]').type('nbanda@uncc.edu');
      cy.get('[data-cy=firstName]').type('Nitesh');
      cy.get('[data-cy=lastName]').type('Banda');
      cy.get('[data-cy=username]').type('nitesh');
      cy.get('[data-cy=password]').type('nitesh');
      cy.get('[data-cy=mobile]').type('123');
      cy.get('[data-cy=gender]').type('male');

      cy.get('[data-cy="signupbtn"]').click();
      cy.get('[data-cy=error-message]').should('be.visible').and('contain.text', 'Email is already registered, Please Login');

    });
  });