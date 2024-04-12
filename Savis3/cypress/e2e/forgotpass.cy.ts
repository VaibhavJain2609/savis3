describe('template spec', () => {
    beforeEach(() => {
        cy.viewport(1920, 1080)
        cy.visit('localhost:4200/forgotpassword')
    })

    it('passes', () => {
        cy.viewport(1920, 1080)
        cy.visit('localhost:4200/forgotpassword')
        // cy.get('.form-incline > #forget').click()
    })

    it('should display forgotpassword form', () => {
        cy.get('[formControlName = "email"]').type('test@gmail.com')
        cy.get('button[type="submit"').click()
    })

    it('should follow link back to login page', () => {
        cy.get('#forget').click()
    })
    
})