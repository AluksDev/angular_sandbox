describe('Users CRUD', () => {

    // Runs once before all tests — loads fixtures into this.users / this.departments
    beforeEach(function () {
        cy.fixture('users').as('users');
        cy.fixture('departments').as('departments');
    });

    const mockUsersAndDepartments = () => {
        cy.fixture('users').then((users) => {
            cy.intercept('GET', '/services/sandbox/user/*', {
                statusCode: 200,
                body: { count: users.length, next: null, previous: null, results: users }
            }).as('getUsersRequest');
        });

        cy.fixture('departments').then((departments) => {
            cy.intercept('GET', '/services/sandbox/department/?ordering=name', {
                statusCode: 200,
                body: { count: departments.length, next: null, previous: null, results: departments }
            }).as('getDepartmentsRequest');
        });
    };

    describe('is normal user', () => {
        beforeEach(() => {
            cy.loginAs('user');
            mockUsersAndDepartments();
            cy.visit('/users');
            cy.wait('@getDepartmentsRequest');
            cy.wait('@getUsersRequest');
        });

        it('should list all users', () => {
            cy.get('[data-cy="users-table"]').should('be.visible');
        });

        it('should search users by name', function () {
            const user = this.users.find((u: any) => u.username === 'testuser');
            cy.intercept('GET', '/services/sandbox/user/*', {
                statusCode: 200,
                body: { count: 1, next: null, previous: null, results: [user] }
            }).as('getUsersRequest');

            cy.visit('/users?search=testuser');
            cy.wait('@getUsersRequest');
            cy.get('[data-cy="users-table"]').should('be.visible').and('contain.text', 'testuser');
        });

        it('should filter users by department', function () {
            const user = this.users.find((u: any) => u.department === 1);
            cy.intercept('GET', '/services/sandbox/user/*', {
                statusCode: 200,
                body: { count: 1, next: null, previous: null, results: [user] }
            }).as('getUsersRequest');

            cy.get('[data-cy="dep-select"]').click({ force: true });
            cy.get('mat-option').eq(0).click();
            cy.visit('/users?department=1');
            cy.wait('@getUsersRequest');
            cy.get('[data-cy="users-table"]').should('be.visible').and('contain.text', 'IT');
        });

        it('should view user detail', function () {
            const user = this.users.find((u: any) => u.username === 'testuser');
            const department = this.departments.find((d: any) => d.id === user.department);

            cy.intercept('GET', `/services/sandbox/department/*`, {
                statusCode: 200,
                body: department
            }).as('departmentRequest');

            cy.intercept('GET', `/services/sandbox/user/${user.id}`, {
                statusCode: 200,
                body: user
            }).as('getUserDetailsRequest');

            cy.get('[data-cy="table-action-button"]').contains('Details').eq(0).click();
            cy.wait('@departmentRequest');
            cy.wait('@getUserDetailsRequest');

            cy.url().should('match', /\/users\/\d+/);
            cy.get('[data-cy="username-detail"]').should('be.visible').and('contain.text', 'testuser');
        });

        it('should edit user information', function () {
            const user = this.users.find((u: any) => u.username === 'testuser');
            const department = this.departments.find((d: any) => d.id === user.department);

            cy.intercept('GET', `/services/sandbox/department/?ordering=name`, {
                statusCode: 200,
                body: { count: this.departments.length, next: null, previous: null, results: this.departments }
            }).as('departmentsRequest');

            cy.intercept('GET', `/services/sandbox/department/${department.id}/`, {
                statusCode: 200,
                body: department
            }).as('userDepartmentRequest');

            cy.intercept('GET', `/services/sandbox/user/${user.id}`, {
                statusCode: 200,
                body: user
            }).as('getUserDetailsRequest');

            cy.intercept('PATCH', `/services/sandbox/user/${user.id}`, {
                statusCode: 200,
                body: user
            }).as('patchUserRequest');

            cy.get('[data-cy="table-action-button"]').contains('Details').eq(0).click();
            cy.wait('@userDepartmentRequest');
            cy.wait('@getUserDetailsRequest');

            cy.url().should('match', /\/users\/\d+/);
            cy.get('[data-cy="username-detail"]').should('be.visible').and('contain.text', 'testuser');
            cy.get('[data-cy="edit-btn"]').should('be.visible').click();
            cy.wait('@departmentsRequest');
            cy.get('[data-cy="first-name-input"]').type('Editing');
            cy.get('[data-cy="save-edit-btn"]').should('be.enabled').click();
            cy.wait('@patchUserRequest');
            cy.get('.success-snackbar').should('contain.text', 'User updated');
        });
    });

    describe('is admin', () => {
        beforeEach(() => {
            cy.loginAs('admin');
            mockUsersAndDepartments();
            cy.visit('/users');
            cy.wait('@getDepartmentsRequest');
            cy.wait('@getUsersRequest');
        });

        it('should create new user as admin', () => {
            cy.adminCreateUser({ responseId: 100 });
            cy.get('.success-snackbar').should('contain.text', 'Created user with id: 100');
        });
    });
});