describe('template spec', () => {

    beforeEach(() => {
      
      const token = "71e3d32f10cc9905bdb0a07d82247ca464cc3ba0";
      localStorage.setItem('auth_token', token);
  });

  it('it should not create a department if it exists', () => {

    cy.visit('http://localhost:4200/departments');

    cy.contains('Crear departamento').click();

    cy.get('#name').type('Marketing');
    cy.get('#code').type('MARK');

    cy.get('mat-dialog-actions')
    .find('button.app-button-confirm')
    .contains('Crear') 
    .should('be.visible')
    .click();

    cy.contains('Error al crear: Ya existe departamento con ese nombre').should('be.visible');
  });

  it('it should create a department', () => {

    cy.visit('http://localhost:4200/departments');

    cy.contains('Crear departamento').click();

    cy.get('#name').type('Ventas');
    cy.get('#code').type('VEN');

    cy.get('mat-dialog-actions')
    .find('button.app-button-confirm')
    .contains('Crear')
    .click();

    cy.get('mat-dialog-container').should('not.exist');
    
    cy.contains('mat-card.data-card', 'Ventas')
    .should('be.visible')
    .within(() => {
      cy.get('p.card-title').should('have.text', 'Ventas');
      
      cy.get('p.card-subtitle').should('have.text', 'VEN');

      cy.get('button.edit-button').should('be.visible');
      cy.get('button.delete-button').should('be.visible');
    });
  });


  it('it should update a department', () => {

    cy.visit('http://localhost:4200/departments');

    cy.contains('mat-card.data-card', 'Ventas')
    .should('be.visible')
    .within(() => {

      cy.get('button.edit-button').click();
    });

    cy.get('#name').should('have.value', 'Ventas');
        
    cy.get('#code').should('have.value', 'VEN');

    cy.get('#name').clear();
    cy.get('#name').type('Devops');
    cy.get('#code').clear();
    cy.get('#code').type('DEV');

    cy.get('mat-dialog-actions')
    .find('button.app-button-confirm')
    .contains('Guardar Cambios')
    .click();

    cy.get('mat-dialog-container').should('not.exist');
    
    cy.contains('mat-card.data-card', 'Devops')
    .should('be.visible')
    .within(() => {
      cy.get('p.card-title').should('have.text', 'Devops');
      
      cy.get('p.card-subtitle').should('have.text', 'DEV');

      cy.get('button.edit-button').should('be.visible');
      cy.get('button.delete-button').should('be.visible');
    });
  });

  it('it should not update a department', () => {

    cy.visit('http://localhost:4200/departments');

    cy.contains('mat-card.data-card', 'Devops')
    .should('be.visible')
    .within(() => {

      cy.get('button.edit-button').click();
    });

    cy.get('#name').should('have.value', 'Devops');
        
    cy.get('#code').should('have.value', 'DEV');

    cy.get('#name').clear();
    cy.get('#name').type('Marketing');
    cy.get('#code').clear();
    cy.get('#code').type('MARK');

    cy.get('mat-dialog-actions')
    .find('button.app-button-confirm')
    .contains('Guardar Cambios')
    .click();

    cy.get('mat-dialog-container').should('not.exist');
    
    cy.contains('Error al actualizar: Ya existe departamento con ese nombre').should('be.visible');
  });

  it('it should delete a department', () => {

    cy.visit('http://localhost:4200/departments');

    cy.contains('mat-card.data-card', 'Devops')
    .should('be.visible')
    .within(() => {

      cy.get('button.delete-button').click();
    });

    cy.get('mat-dialog-container')
    .should('be.visible')
    .within(() => {
      cy.get('h2.dialog-warn-title').should('be.visible');
      cy.contains('p', 'Departamento a eliminar:')
        .find('strong')
        .should('have.text', 'Devops');

      cy.get('button.app-button-confirm')
        .contains('SÍ, ELIMINAR')
        .click();
    });
  });
})