Cypress.Commands.add('loginAs', (role: string = 'user') => {
    cy.fixture('users').then((users) => {
        const user = users.find(u => u.roles.includes(role));
        cy.intercept('GET', '/services/sandbox/auth/me/', {
            statusCode: 200,
            body: { ...user }
        }).as('meRequest');
    });

    cy.session(role, () => {
        cy.window().then((win) => {
            win.localStorage.setItem('token', 'fake-jwt-token');
        });
        cy.visit('/');
        cy.wait('@meRequest');
    });
});

export interface CreateUserOptions {
  username?: string;
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  departmentIndex?: number;
  roleIndex?: number;
  responseId?: number;
}

Cypress.Commands.add('adminCreateUser', (options: CreateUserOptions = {}) => {
    const {
        username = 'testuser',
        email = 'test@test.com',
        password = 'passWord1!',
        firstName = 'First',
        lastName = 'Last',
        departmentIndex = 0,
        roleIndex = 0,
        responseId = 100,
    } = options;

    // Intercepts are set up before any UI interaction so Cypress
    // is ready to catch the requests the moment they fire
    cy.fixture('departments').then((departmentList) => {
        cy.intercept('GET', '/services/sandbox/department/?ordering=name', {
        statusCode: 200,
        body: { count: departmentList.length, next: null, previous: null, results: departmentList }
        }).as('getDepartmentsRequest');
    });

    cy.intercept('POST', '/services/sandbox/user/', {
        statusCode: 200,
        body: { id: responseId, username }
    }).as('createUserRequest');

    cy.get('[data-cy="new-user-admin-btn"]').should('be.visible').click();
    cy.wait('@getDepartmentsRequest');
    cy.location('pathname').should('eq', '/admin/users/create');

    cy.get('[data-cy="username-input"]').type(username);
    cy.intercept('GET', `/services/sandbox/user/?search=${username}`, {
        statusCode: 200,
        body: { count: 0, next: null, previous: null, results: [] }
    }).as('getUniqueUsernameRequest');
    cy.wait('@getUniqueUsernameRequest');

    cy.get('[data-cy="email-input"]').type(email);
    cy.intercept('GET', `/services/sandbox/user/?search=${email}`, {
        statusCode: 200,
        body: { count: 0, next: null, previous: null, results: [] }
    }).as('getUniqueEmailRequest');
    cy.wait('@getUniqueEmailRequest');

    cy.get('[data-cy="password-input"]').type(password, { force: true });
    cy.get('[data-cy="password-repeat-input"]').type(password, { force: true });
    cy.get('[data-cy="first-name-input"]').type(firstName);
    cy.get('[data-cy="last-name-input"]').type(lastName);
    cy.get('[data-cy="department-input"]').click({ force: true });
    cy.get('mat-option').eq(departmentIndex).click();
    cy.get('[data-cy="roles-input"]').click({ force: true });
    cy.get('mat-option').eq(roleIndex).click();
    cy.get('[data-cy="create-user-btn"]').click({ force: true });
    cy.wait('@createUserRequest');
});