declare namespace Cypress {
    interface Chainable {
        loginAs(role?: string): Chainable<void>;
        adminCreateUser(options?: CreateUserOptions): Chainable<void>;
    }
}