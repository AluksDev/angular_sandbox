describe('Navigation', () => {
    beforeEach(() => {
        cy.loginAs('user');
        cy.visit('/');
    });

    it('should navigate between sections', () => {
        const navItems = [
            {
                label: 'Users',
                path: '/users',
                intercepts: [
                    {
                        method: 'GET' as const,
                        url: '/services/sandbox/user/*',
                        alias: 'userRequest',
                        response: { count: 0, next: null, previous: null, results: [] }
                    },
                    {
                        method: 'GET' as const,
                        url: '/services/sandbox/department/?ordering=name',
                        alias: 'departmentRequest',
                        response: {}
                    }
                ]
            },
            {
                label: 'Departments',
                path: '/departments',
                intercepts: [
                    {
                        method: 'GET' as const,
                        url: '/services/sandbox/department/?ordering=name',
                        alias: 'departmentRequest2',
                        response: {}
                    }
                ]
            }
        ];

        navItems.forEach((item, index) => {
            item.intercepts.forEach(({ method, url, alias, response }) => {
                cy.intercept(method, url, { statusCode: 200, body: response }).as(alias);
            });

            cy.get('.fuse-vertical-navigation-item')
                .eq(index)
                .click();

            item.intercepts.forEach(({ alias }) => {
                cy.wait(`@${alias}`);
            });

            cy.location('pathname').should('eq', item.path);
        });
    });

    it('should show active route in sidenav', () => {
        cy.intercept('GET', '/services/sandbox/department/*', {
            statusCode: 200,
            body: {}
        }).as('departmentsRequest');
        cy.visit('/departments');
        cy.wait('@departmentsRequest');
        cy.get('.fuse-vertical-navigation-item-active')
            .should('contain.text', 'Departments')
            .and('have.class', 'fuse-vertical-navigation-item-active');
    });

    it('should generate correct breadcrumbs', () => {
        cy.fixture('users').then((users) => {
            const user = users.find(u => u.username === 'testuser');

            cy.fixture('departments').then((departmentList) => {
                const department = departmentList.find(dep => dep.id === user.department);

                cy.intercept('GET', `/services/sandbox/department/${department.id}/`, {
                    statusCode: 200,
                    body: { ...department }
                }).as('departmentRequest');

                cy.intercept('GET', `/services/sandbox/user/${user.id}`, {
                    statusCode: 200,
                    body: { ...user }
                }).as('getUserDetailsRequest');

                cy.visit(`/users/${user.id}`);
                cy.wait('@getUserDetailsRequest');
                cy.wait('@departmentRequest');

                cy.location('pathname').then((pathname) => {
                    const segments = ['Dashboard', ...pathname.split('/').filter(Boolean)];

                    cy.get('[data-cy="breadcrumb-item"]').should('have.length', segments.length);

                    segments.forEach((segment, index) => {
                        if (index === segments.length - 1) return;
                        cy.get('[data-cy="breadcrumb-item"]')
                            .eq(index)
                            .should('contain.text', segment.charAt(0).toUpperCase() + segment.slice(1));
                    });

                    cy.get('[data-cy="breadcrumb-item"]')
                        .last()
                        .should('be.visible')
                        .and('not.be.empty');
                });
            });
        });
    });

    describe('Admin route protection', () => {
        describe('when user is admin', () => {
            beforeEach(() => {
                cy.loginAs('admin');
                cy.visit('/');
            });

            it('should allow navigation to protected route', () => {
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

                    cy.visit('/admin/users/create');
                    cy.wait('@getDepartmentsRequest');
                    cy.get('[data-cy="username-input"]').should('be.visible');
                });
            });
        });

        describe('when user is NOT admin', () => {
            beforeEach(() => {
                cy.loginAs('user');
                cy.visit('/');
            });

            it('should redirect to 403', () => {
                cy.visit('/admin/users/create');
                cy.location('pathname').should('eq', '/403');
            });
        });
    });
});