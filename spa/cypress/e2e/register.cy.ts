describe('Register Flow', () => {
    beforeEach(()=>{
        cy.visit('/auth/register');
    })
    
    it('should display register form', () => {
        cy.get('[data-cy="username-input"]').should('be.visible');
        cy.get('[data-cy="email-input"]').should('be.visible');
        cy.get('[data-cy="first-name-input"]').should('be.visible');
        cy.get('[data-cy="last-name-input"]').should('be.visible');
        cy.get('[data-cy="next-btn"]').should('be.visible');
        
    })
    
    it('should validate password strength', () => {
        cy.get('[data-cy="username-input"]').type('username');
        cy.get('[data-cy="next-btn"]').click();
        cy.get('[data-cy="password-input"]').type('weakpassword');
        cy.get('[data-cy="psw-strength"]').should('contain.text', 'Weak')
        cy.get('[data-cy="password-input"]').clear().type('fairPassword');
        cy.get('[data-cy="psw-strength"]').should('contain.text', 'Fair')
        cy.get('[data-cy="password-input"]').clear().type('g00dPassword');
        cy.get('[data-cy="psw-strength"]').should('contain.text', 'Good')
        cy.get('[data-cy="password-input"]').clear().type('str0ngPassword!');
        cy.get('[data-cy="psw-strength"]').should('contain.text', 'Strong')
    })

    it('should show error if username already exists', () => {
        cy.intercept('POST','/services/sandbox/auth/register/', {
            statusCode: 400,
            body: { username: 'A user with that username already exists.'}
        }).as('registerRequest');

        cy.get('[data-cy="username-input"]').type('username');
        cy.get('[data-cy="next-btn"]').click();
        cy.get('[data-cy="password-input"]').type('passWord1!');
        cy.get('[data-cy="repeat-password-input"]').type('passWord1!');
        cy.get('[data-cy="register-btn"]').click();
        cy.wait('@registerRequest');
        cy.get('.error-snackbar').should('contain.text', 'A user with that username already exists.');
    })

    describe('after successful registration', () => {
        beforeEach(() => {
            cy.intercept('POST', '/services/sandbox/auth/register/', {
                statusCode: 200,
                body: { 
                    token: 'auth-token',
                    user: {
                        id: 1,
                        username: 'username' 
                    }}
            }).as('registerRequest');

            cy.intercept('GET', '/services/sandbox/department/?ordering=name', {
                statusCode: 200,
                body: { 
                    results: [
                        { id: 1, name: 'dep-1' },
                        { id: 2, name: 'dep-2' }
                    ] 
                }
            }).as('departmentsRequest');

            cy.get('[data-cy="username-input"]').type('username');
            cy.get('[data-cy="next-btn"]').click();
            cy.get('[data-cy="password-input"]').type('passWord1!');
            cy.get('[data-cy="repeat-password-input"]').type('passWord1!');
            cy.get('[data-cy="register-btn"]').click();

            cy.wait('@registerRequest');
            cy.wait('@departmentsRequest');
        });

        it('should navigate between stepper steps', () => {
            cy.get('mat-step-header').eq(0).click();
            cy.get('[data-cy="username-input"]').should('be.visible');
            cy.get('mat-step-header').eq(1).click();
            cy.get('[data-cy="password-input"]').should('be.visible');
            cy.get('mat-step-header').eq(2).click();
            cy.get('[data-cy="dep-select"]').should('be.visible');
        })

        it('should complete registration without a department', () => {
            cy.get('[data-cy="close-btn"]').click();
            cy.url().should('include', '/dashboard');
        });

        it('should complete registration with a department selected', () => {
            cy.intercept('PATCH', '/services/sandbox/user/*/', {
                statusCode:  200
            }).as('assignDepRequest');

            cy.get('[data-cy="dep-select"]').click();
            cy.get('#mat-option-0').click();
            cy.get('[data-cy="assign-dep-btn"]').click();
            cy.wait('@assignDepRequest');
            cy.url().should('include', '/dashboard');
        });
    });
})