describe('Login Flow', () => {
    beforeEach(()=>{
        cy.visit('/auth/login');
    })

    it('should display the login form', () => {
        cy.get('[data-cy="username-input"]').should('be.visible');
        cy.get('[data-cy="password-input"]').should('be.visible');
        cy.get('[data-cy="submit-btn"]').should('be.visible');
    })

    it('should login with correct credentials', () => {
        cy.intercept('POST', '/services/sandbox/auth/login/', {
            statusCode: 200,
            body: { 
                token: 'auth-token',
                user: {
                        username: 'username'
                }
            }
        }).as('loginRequest');
        cy.get('[data-cy="username-input"]').type('validuser@example.com');
        cy.get('[data-cy="password-input"]').type('correctpassword');
        cy.get('[data-cy="submit-btn"]').click();

        cy.wait('@loginRequest');
        cy.url().should('include', '/dashboard');
    })

    it('should show error with invalid credentials', () => {
        cy.intercept('POST', '/services/sandbox/auth/login/', {
            statusCode: 400,
            body: {}
        }).as('loginRequest');

        cy.get('[data-cy="username-input"]').type('wrong@example.com');
        cy.get('[data-cy="password-input"]').type('wrongpassword');
        cy.get('[data-cy="submit-btn"]').click();

        cy.wait('@loginRequest');
        cy.get('.error-snackbar').should('be.visible');
        cy.get('.error-snackbar').should('contain.text', 'Invalid username or password');
    });

    describe('when user is already authenticated', () => {
        it('should prevent access to login if already authenticated', () => {
            cy.intercept('GET', '/services/sandbox/auth/me/', {
                statusCode: 200,
                body: { username: 'testuser' }
            }).as('meRequest');

            cy.visit('/');

            cy.window().then((win) => {
                win.localStorage.setItem('token', 'fake-jwt-token');
            });

            cy.visit('/auth/login');
            cy.wait('@meRequest');

            cy.url().should('not.include', '/auth/login');
        });
    });
})