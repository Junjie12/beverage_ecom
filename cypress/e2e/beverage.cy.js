describe('Add Beverage', () => {
  beforeEach(() => {
    cy.visit('/add-beverage.html'); 
  });

  it('should add a new beverage successfully', () => {
    // Ensure the form is loaded
    cy.get('#name').should('be.visible');

    cy.get('#name').type('Test Beverage');
    cy.get('#image').type('https://example.com/image.jpg');
    cy.get('#price').type('10');
    cy.get('#category').select('Soft Drinks');
    cy.get('#description').type('Test Description');
    cy.get('#rating').type('4');
    cy.get('#quantity').type('100');
    // Stub the alert and automatically click "OK"
    cy.on('window:alert', (str) => {
      expect(str).to.equal('Beverage successfully added: Test Beverage');
    });
    cy.get('#addBeverageButton').click();
  });

  it('should show validation errors for missing required fields', () => {
    cy.get('#name').should('be.visible');
    // Clear the form
    cy.get('#name').clear();
    cy.get('#image').clear();
    cy.get('#price').clear();
    cy.get('#category').select('Tea');
    cy.get('#description').clear();
    cy.get('#rating').clear();
    cy.get('#quantity').clear();


    cy.on('window:alert', (str) => {
      expect(str).to.equal('All fields are required!');
    });
    cy.get('#addBeverageButton').click();
  });
  it('should show validation errors for rating higher than 5', () => {

    cy.get('#name').should('be.visible');

    cy.get('#name').type('Test Beverage');
    cy.get('#image').type('https://example.com/image.jpg');
    cy.get('#price').type('10');
    cy.get('#category').select('Soft Drinks');
    cy.get('#description').type('Test Description');
    cy.get('#rating').type('6'); 
    cy.get('#quantity').type('100');
    cy.on('window:alert', (str) => {
      expect(str).to.equal('Rating must be between 1 and 5.');
    });

 
    cy.get('#addBeverageButton').click();
  });
});