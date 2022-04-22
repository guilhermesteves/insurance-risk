const { calculateRiskProfile } = require('../../../shared/engine')
const mockIneligibilityRules = require('../../../db/rules/ineligibility')
const mockCalculationRules = require('../../../db/rules/calculation')

jest.mock('../../../shared/db', () => {
  return jest.fn().mockImplementation(() => {
    Promise.resolve()
  })
})

jest.mock('../../../shared/models/rule', () => {
  return {
    getIneligibilityRules: jest.fn().mockImplementation(() => {
      return mockIneligibilityRules
    }),
    getCalculationRules: jest.fn().mockImplementation(() => {
      return mockCalculationRules
    }),
  }
})

jest.mock('../../../shared/models/insurance', () => {
  return {
    create: (insurance) => {
      return Promise.resolve(insurance)
    },
  }
})

describe('Engine lib', () => {

  describe('Should calculate using existing rules', () => {
    it('when no insurance is available', async () => {
      const insurance = {
        age: 62,
        dependents: 2,
        income: 0,
        marital_status: 'married',
        risk_questions: [0, 1, 0],
      }

      const expected = {
        auto: 'ineligible',
        disability: 'ineligible',
        home: 'ineligible' ,
        life: 'ineligible'
      }

      const result = await calculateRiskProfile({ insurance })
      expect(result).toEqual(expected)
    })

    it('when the user has no disability and life insurance available', async () => {
      const insurance = {
        age: 62,
        dependents: 2,
        income: 2000,
        house: {
          ownership_status: 'owned'
        },
        marital_status: 'married',
        risk_questions: [0, 1, 0],
        vehicle: {
          year: 2018
        }
      }

      const expected = {
        auto: 'regular',
        disability: 'ineligible',
        home: 'regular',
        life: 'ineligible'
      }

      const result = await calculateRiskProfile({ insurance })
      expect(result).toEqual(expected)
    })

    it('when the user has no disability', async () => {
      const insurance = {
        age: 35,
        dependents: 2,
        income: 0,
        house: {
          ownership_status: 'owned'
        },
        marital_status: 'married',
        risk_questions: [0, 1, 0],
        vehicle: {
          year: 2018
        }
      }

      const expected = {
        auto: 'regular',
        disability: 'ineligible',
        home: 'economic' ,
        life: 'regular'
      }

      const result = await calculateRiskProfile({ insurance })
      expect(result).toEqual(expected)
    })
  })
})
