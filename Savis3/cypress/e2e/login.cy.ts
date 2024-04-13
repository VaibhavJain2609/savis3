describe('template spec', () => {
    beforeEach(() => {
        cy.viewport(1920, 1080)
        cy.visit('localhost:4200/login')
    })
    
    it('passes', () => {
        cy.viewport(1920, 1080)
        cy.visit('localhost:4200/login')
        // cy.get('.form-incline > #forget').click()
    })

    it('should display the login form', () => {
        cy.get('[formControlName = "username"]').type('test@gmail.com')
        cy.get('[formControlName = "password"]').type('Test1234!')
        cy.contains('button', 'Login').click()
    })
    
    it('should click the forgot password', () => {
        cy.wait(1000)
        cy.get('#forget').click()
    })

    it('should click sign up button', () => {
        cy.wait(1000)
        cy.get('a[routerLink="/signup"]').click()
    })

    it('should click the continue as guest button', () => {
        cy.wait(1000)
        cy.contains('button', 'Guest').click()
    })
    // it('should display error message for empty fields', () => {
    //     cy.get('button[type="submit"]').click()
    //     cy.contains('Your form is invalid').should('be.visible')
    // })
    
    // it('should navigate to signup page when signup link is clicked', () => {
    //     cy.get('a[routerLink="/signup"]').click()
    //     cy.url().should('include', '/signup') // Assuming signup page URL is '/signup'
    // })

})