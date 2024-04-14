describe('template spec', () => {
    beforeEach(() => {
        cy.viewport(1920, 1080)
        cy.visit('localhost:4200/signup')
    })

    it('passes', () => {
        cy.viewport(1920, 1080)
        cy.visit('localhost:4200/signup')
        // cy.get('.form-incline > #forget').click()
    })

    it('should sign up correctly with correct credentials', () => {
        cy.get('[formControlName = "firstName"]').type('Hetvi')
        cy.get('[formControlName = "lastName"]').type('Patel')
        cy.get('[formControlName = "email"]').type('test1@gmail.com')
        cy.get('[formControlName = "password"]').type('Test1234$')
        cy.get('[formControlName = "confirmPassword"]').type('Test1234$')
        cy.get('button[type="submit"').click()
        cy.log('Please check your email for verification of account creation, you will be redirected to the login page in 5 seconds.')
        cy.wait(5000)
        cy.visit('http://localhost:4200/login')
    })

    it('should go back to login page if already have an account', () => {
        cy.get('#forget').click()
    })
    
})