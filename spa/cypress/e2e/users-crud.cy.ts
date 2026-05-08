describe('Users CRUD', () => {
    describe('is normal user', () => {
        beforeEach(()=>{
            cy.fixture('users').then((users) => {
                const user = users.find(u => u.roles.includes('user'));
                cy.intercept('GET', '/services/sandbox/auth/me/', {
                    statusCode: 200,
                    body: { 
                        ...user
                    }
                }).as('meRequest');

                cy.intercept('GET', '/services/sandbox/user/*', {
                    statusCode: 200,
                    body: {
                        count: users.length,
                        next: null,
                        previous: null,
                        results: users
                    }
                }).as('getUsersRequest');
            })

            cy.fixture('departments').then((departmentList) => {
                cy.intercept('GET', '/services/sandbox/department/?ordering=name', {
                    statusCode: 200,
                    body: {
                        count: departmentList.length,
                        next: null,
                        previous: null,
                        results: departmentList
                    }
                }).as('getDepartmentsRequest');
            })
            
            cy.window().then((win) => {
                win.localStorage.setItem('token', 'fake-jwt-token');
            });
            
            cy.visit('/')
            cy.wait('@meRequest');

            cy.visit('/users')
            cy.wait('@getDepartmentsRequest');
            cy.wait('@getUsersRequest');
        })

        it('should list all users', () => {
            cy.get('[data-cy="users-table"]').should('be.visible');
        })

        it('should search users by name', () => {
            cy.fixture('users').then((users) => {
                const user = users.find(u => u.username === 'testuser');
                cy.intercept('GET', '/services/sandbox/user/*', {
                    statusCode: 200,
                    body: {
                        count: 1,
                        next: null,
                        previous: null,
                        results: [
                            user
                        ]
                    }
                }).as('getUsersRequest');
            })
            cy.visit('/users?search=testuser');

            cy.wait('@getUsersRequest')

            cy.get('[data-cy="users-table"]').should('be.visible').and('contain.text', 'testuser');
        })

        it('should filter users by department', () => {
            cy.fixture('users').then((users) => {
                const user = users.find(u => u.department === 1);
                cy.intercept('GET', '/services/sandbox/user/*', {
                    statusCode: 200,
                    body: {
                        count: 1,
                        next: null,
                        previous: null,
                        results: [
                            user
                        ]
                    }
                }).as('getUsersRequest');
            })
            cy.get('[data-cy="dep-select"]').click({ force: true });
            cy.get('mat-option').eq(0).click();
            cy.visit('/users?department=1');
            cy.wait('@getUsersRequest');
            cy.get('[data-cy="users-table"]').should('be.visible').and('contain.text', 'IT');
        })
        
        it('should view user detail', () => {
            cy.fixture('users').then((users) => {
                const user = users.find(u => u.username === 'testuser');

                cy.intercept('GET', `/services/sandbox/user/${user.id}`, {
                    statusCode: 200,
                    body: { ...user }
                }).as('getUserDetailsRequest');
                cy.fixture('departments').then((departmentList) => {
                    const department = departmentList.find(dep => dep.id === user.department);
                    cy.intercept('GET', `/services/sandbox/department/${department.id}/`, {
                        statusCode: 200,
                        body: { ...department }
                    })
                }).as('departmentRequest')
            });
            cy.get('[data-cy="table-action-button"]')
                .should('be.visible')
                .and('contain.text', 'Details')
                .eq(0)
                .click();

            cy.wait('@departmentRequest');
            cy.wait('@getUserDetailsRequest');
            cy.url().should('match', /\/users\/\d+/);
            cy.get('[data-cy="username-detail"]').should('be.visible').and('contain.text', 'testuser');
        });

        it('should edit user information', () => {
            cy.fixture('users').then((users) => {
                const user = users.find(u => u.username === 'testuser');

                cy.intercept('GET', `/services/sandbox/user/${user.id}`, {
                    statusCode: 200,
                    body: { ...user }
                }).as('getUserDetailsRequest');

                cy.intercept('PATCH', `/services/sandbox/user/${user.id}`, {
                    statusCode: 200,
                    body: { ...user }
                }).as('getUserDetailsRequest');

                cy.fixture('departments').then((departmentList) => {
                    const department = departmentList.find(dep => dep.id === user.department);
                    cy.intercept('GET', `/services/sandbox/department/${department.id}/`, {
                        statusCode: 200,
                        body: { ...department }
                    })
                }).as('userDepartmentRequest')
            });

            cy.fixture('departments').then((departmentList) => {
                cy.intercept('GET', `/services/sandbox/department/?ordering=name`, {
                    statusCode: 200,
                    body: {
                        count: departmentList.length,
                        next: null,
                        previous: null,
                        results: departmentList
                    }
                })
            }).as('departmentsRequest')

            cy.get('[data-cy="table-action-button"]')
                .should('be.visible')
                .and('contain.text', 'Details')
                .eq(0)
                .click();

            cy.wait('@userDepartmentRequest');
            cy.wait('@getUserDetailsRequest');
            cy.url().should('match', /\/users\/\d+/);
            cy.get('[data-cy="username-detail"]').should('be.visible').and('contain.text', 'testuser');
            cy.get('[data-cy="edit-btn"]').should('be.visible').click();
            cy.wait('@departmentsRequest');
            cy.get('[data-cy="first-name-input"]').type('Editing');
            cy.get('[data-cy="save-edit-btn"]').should('be.enabled').click();
            cy.get('.success-snackbar').should('contain.text', 'User updated');
        })
    })

    describe('is admin', () => {
        beforeEach(()=>{
            cy.fixture('users').then((users) => {
                const user = users.find(u => u.roles.includes('admin'));
                cy.intercept('GET', '/services/sandbox/auth/me/', {
                    statusCode: 200,
                    body: { 
                        ...user
                    }
                }).as('meRequest');

                cy.intercept('GET', '/services/sandbox/user/*', {
                    statusCode: 200,
                    body: {
                        count: users.length,
                        next: null,
                        previous: null,
                        results: users
                    }
                }).as('getUsersRequest');
            })

            cy.fixture('departments').then((departmentList) => {
                cy.intercept('GET', '/services/sandbox/department/?ordering=name', {
                    statusCode: 200,
                    body: {
                        count: departmentList.length,
                        next: null,
                        previous: null,
                        results: departmentList
                    }
                }).as('getDepartmentsRequest');
            })
            
            cy.window().then((win) => {
                win.localStorage.setItem('token', 'fake-jwt-token');
            });
            
            cy.visit('/')
            cy.wait('@meRequest');

            cy.visit('/users')
            cy.wait('@getDepartmentsRequest');
            cy.wait('@getUsersRequest');
        })

        it('should create new user as admin', () => {
            cy.fixture('departments').then((departmentList) => {
                cy.intercept('GET', '/services/sandbox/department/?ordering=name', {
                    statusCode: 200,
                    body: {
                        count: departmentList.length,
                        next: null,
                        previous: null,
                        results: departmentList
                    }
                }).as('getDepartmentsRequest');
            })
            cy.intercept('POST', '/services/sandbox/user/', {
                statusCode: 200,
                body: {
                    id: 100,
                    username: 'newusername'
                }
            }).as('crateUserRequest')

            cy.get('[data-cy="new-user-admin-btn"').should('be.visible').click();
            cy.wait('@getDepartmentsRequest')
            cy.location('pathname').should('eq', '/admin/users/create');

            cy.get('[data-cy="username-input"]').type('newusername');
            cy.intercept('GET', '/services/sandbox/user/?search=newusername', {
                statusCode: 200,
                body: {
                    count: 0,
                    next: null,
                    previous: null,
                    results: []
                }
            }).as('getUniqueUsernameRequest');
            cy.wait('@getUniqueUsernameRequest');

            cy.get('[data-cy="email-input"]').type('email@test.com');
            cy.intercept('GET', '/services/sandbox/user/?search=email@test.com', {
                statusCode: 200,
                body: {
                    count: 0,
                    next: null,
                    previous: null,
                    results: []
                }
            }).as('getUniqueEmail');
            cy.wait('@getUniqueEmail');

            cy.get('[data-cy="password-input"]').type('passWord1!', { force: true });
            cy.get('[data-cy="password-repeat-input"]').type('passWord1!', { force: true });
            cy.get('[data-cy="first-name-input"]').type('First');
            cy.get('[data-cy="last-name-input"]').type('Last');
            cy.get('[data-cy="department-input"]').click({ force: true });
            cy.get('mat-option').eq(0).click();
            cy.get('[data-cy="roles-input"]').click({ force: true });
            cy.get('mat-option').eq(0).click();
            cy.get('[data-cy="create-user-btn"]').click({ force: true });
            cy.wait('@crateUserRequest');
            cy.get('.success-snackbar').should('contain.text', 'Created user with id: 100');
        })
    })
});