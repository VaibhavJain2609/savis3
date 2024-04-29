describe('towMeansCI', () => {
  beforeEach(() => {
      cy.viewport(1920, 1080)
      cy.visit('localhost:4200/twomeansCI')
  })
 
  it('passes', () => {
    cy.viewport(1920, 1080)
    cy.visit('localhost:4200/twomeansCI')
    //cy.get('.form-incline > #forget').click()
  })


  it ('should select and load sample 1', () => {
    
    cy.get('.border-t-0').select("Sample 1")
        cy.get('#loadData').click()
   
      })
      it ('should select and load sample 2', () => {
          cy.get('.border-t-0').select("Sample 2")
          cy.get('.w-3\\/12 > div.w-full > :nth-child(2)').click()
  
      })

      it ('should click the run simulation chart when there is data', () => {
        cy.get('.border-t-0').select("Sample 1")
        cy.get('#loadData').click()
        

    })

    it ('should input a number in the run simulation inputfiled when there is data', () => {
      cy.get('.border-t-0').select("Sample 1")
      cy.get('#loadData').click()
      
  })

})
