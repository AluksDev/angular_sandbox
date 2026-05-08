function fillLoginForm(options: {username?: string, password?: string} = {}) {
    const { username = 'username', password = 'password' } = options;
    cy.get('[data-cy="username-input"]').type(username);
    cy.get('[data-cy="password-input"]').type(password);
}

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
        fillLoginForm();
        cy.get('[data-cy="submit-btn"]').click();

        cy.wait('@loginRequest');
        cy.url().should('include', '/dashboard');
    })

    it('should show error with invalid credentials', () => {
        cy.intercept('POST', '/services/sandbox/auth/login/', {
            statusCode: 400,
            body: {}
        }).as('loginRequest');

        fillLoginForm();
        cy.get('[data-cy="submit-btn"]').click();

        cy.wait('@loginRequest');
        cy.get('.error-snackbar').should('contain.text', 'Invalid username or password');
    });

    describe('when user is already authenticated', () => {
        it('should prevent access to login if already authenticated', () => {
            cy.loginAs('user');
            cy.visit('/');

            cy.visit('/auth/login');
            cy.wait('@meRequest');

            cy.url().should('not.include', '/auth/login');
        });
    });
})