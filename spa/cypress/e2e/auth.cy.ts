describe('Authentication', () => {
    beforeEach(() => {
        cy.loginAs('user');
        cy.visit('/');
    });

    it('should protect private routes', () => {
        cy.window().then((win) => win.localStorage.removeItem('token'));
        cy.visit('/users');
        cy.location('pathname').should('eq', '/auth/login');
    });

    it('should persist session on refresh', () => {
        cy.reload();
        cy.location('pathname').should('not.eq', '/auth/login');
    });

    it('should logout and clear session', () => {
        cy.intercept('POST', '/services/sandbox/auth/logout/', {
            statusCode: 200,
            body: {}
        }).as('logoutRequest');
        cy.get('[data-cy="user-snippet"]').first().click();
        cy.get('[data-cy="logout-btn"]').click();
        cy.wait('@logoutRequest');
        cy.window().its('localStorage').invoke('getItem', 'token').should('be.null');
        cy.location('pathname').should('eq', '/auth/login');
    });

    it('should handle expired token', () => {
        cy.on('uncaught:exception', (err) => {
            if (err.message.includes('401')) {
                return false;
            }
            throw err;
        });
        cy.intercept('GET', '/services/sandbox/auth/me/', {
            statusCode: 401,
            body: { details: 'Invalid token.' }
        }).as('expiredTokenRequest');
        cy.visit('/');
        cy.wait('@expiredTokenRequest');
        cy.get('.error-snackbar').should('contain.text', 'Session expired. Please log in again');
    });
});