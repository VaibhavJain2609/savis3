describe('template spec', () => {
    beforeEach(() => {
        cy.viewport(1920, 1080)
        cy.visit('localhost:4200/twomeans')
    })
   
    it('passes', () => {
      cy.viewport(1920, 1080)
      cy.visit('localhost:4200/twomeans')
      // cy.get('.form-incline > #forget').click()
    })
    it ('should select and load sample 1', () => {
        cy.get('.border-t-0').select("Sample 1")
        cy.get('#loadData').click()
       


    })
    it ('should select and load sample 2', () => {
        cy.get('.border-t-0').select("Sample 2")
        cy.get('.w-3\\/12 > div.w-full > :nth-child(2)').click()

    })
    it ('should reset the chart', () => {
        cy.window().then((win) => {
            cy.stub(win.console, 'log').as('consoleLog');
          });
        cy.get('div.w-full > :nth-child(3)').click()
        cy.get('@consoleLog').should('have.been.calledWith', 'chart reset');

    })
    it ('should check if run simulation button is disabled on an empty chart', () => {
        cy.get('.w-3\\/12 > .mt-1').should('be.disabled')

    })

    it ('should check if "type of test" selector is disabled on an empty chart', () => {
        cy.get('select.if-disabled').should('be.disabled')

    })
    it ('should check if the increment tab is disabled on an empty chart', () => {
        cy.get('#tail-input').should('be.disabled')

    })

    it ('should click the run simulation chart when there is data', () => {
        cy.get('.border-t-0').select("Sample 1")
        cy.get('#loadData').click()
        cy.get('.w-3\\/12 > .mt-1').click({ force: true });

    })

    it ('should input a number in the run simulation inputfiled when there is data', () => {
        cy.get('.border-t-0').select("Sample 1")
        cy.get('#loadData').click()
        cy.get(':nth-child(6) > .w-3\\/12 > .border-gray-300').type("2",{ force: true })
        cy.get('.w-3\\/12 > .mt-1').click({ force: true });

    })
    it ('should select the one tails right from the option menu', () => {
        cy.get('.border-t-0').select("Sample 1")
        cy.get('#loadData').click()
        cy.get('.w-3\\/12 > .mt-1').click({ force: true });
        cy.get('select.if-disabled').select("One Tail Right", { force: true });

    })

    it ('should select the one tails left from the option menu', () => {
        cy.get('.border-t-0').select("Sample 1")
        cy.get('#loadData').click()
        cy.get('.w-3\\/12 > .mt-1').click({ force: true });
        cy.get('select.if-disabled').select("One Tail Left", { force: true });

    })
    it ('should select the two tails  from the option menu', () => {
        cy.get('.border-t-0').select("Sample 1")
        cy.get('#loadData').click()
        cy.get('.w-3\\/12 > .mt-1').click({ force: true });
        cy.get('select.if-disabled').select("Two Tails", { force: true });

    })
    it ('should change the input value for extreme', () => {
        cy.get('.border-t-0').select("Sample 1")
        cy.get('#loadData').click()
        cy.get('.w-3\\/12 > .mt-1').click({ force: true });
        cy.get('select.if-disabled').select("Two Tails", { force: true });
        cy.get('#tail-input').type("2",{ force: true })

    })
    
    

    
})