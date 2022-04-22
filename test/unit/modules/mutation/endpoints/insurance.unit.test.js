const { handler } = require('../../../../../modules/insurance/endpoints/insurance')

const mockIneligibilityRules = require('../../../../../db/rules/ineligibility')
const mockCalculationRules = require('../../../../../db/rules/calculation')

const toStr = body => body ? { body: JSON.stringify(body) } : {}
const toJSON = result => result ? JSON.parse(result) : {}

jest.mock('../../../../../shared/db', () => {
  return jest.fn().mockImplementation(() => {
    Promise.resolve()
  })
})

jest.mock('../../../../../shared/models/rule', () => {
  return {
    getIneligibilityRules: jest.fn().mockImplementation(() => {
      return mockIneligibilityRules
    }),
    getCalculationRules: jest.fn().mockImplementation(() => {
      return mockCalculationRules
    }),
  }
})

jest.mock('../../../../../shared/models/insurance', () => {
  return {
    create: (insurance) => {
      return Promise.resolve(insurance)
    },
  }
})

const examplePayload = {
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

describe('Test API /insurance', () => {

  describe('Should not accept a request with', () => {
    it('missing body', async () => {
      const { body, statusCode } = await handler(toStr())

      expect(statusCode).toBe(422)
      expect(toJSON(body)).toEqual({
        errors: [{
          message: 'Invalid body'
        }]
      })
    })

    it('missing parameter age', async () => {
      const missingParamBody = { ...examplePayload }
      delete missingParamBody.age

      const { body, statusCode } = await handler(toStr(missingParamBody))

      expect(statusCode).toBe(422)
      expect(toJSON(body)).toEqual({
        errors: [{
          field: 'age',
          error: '\"age\" is required'
        }]
      })
    })

    it('missing parameter dependents', async () => {
      const missingParamBody = { ...examplePayload }
      delete missingParamBody.dependents

      const { body, statusCode } = await handler(toStr(missingParamBody))

      expect(statusCode).toBe(422)
      expect(toJSON(body)).toEqual({
        errors: [{
          field: 'dependents',
          error: '\"dependents\" is required'
        }]
      })
    })

    it('missing parameter income', async () => {
      const missingParamBody = { ...examplePayload }
      delete missingParamBody.income

      const { body, statusCode } = await handler(toStr(missingParamBody))

      expect(statusCode).toBe(422)
      expect(toJSON(body)).toEqual({
        errors: [{
          field: 'income',
          error: '\"income\" is required'
        }]
      })
    })

    it('missing parameter marital_status', async () => {
      const missingParamBody = { ...examplePayload }
      delete missingParamBody.marital_status

      const { body, statusCode } = await handler(toStr(missingParamBody))

      expect(statusCode).toBe(422)
      expect(toJSON(body)).toEqual({
        errors: [{
          field: 'marital_status',
          error: '\"marital_status\" is required'
        }]
      })
    })

    it('missing parameter risk_questions', async () => {
      const missingParamBody = { ...examplePayload }
      delete missingParamBody.risk_questions

      const { body, statusCode } = await handler(toStr(missingParamBody))

      expect(statusCode).toBe(422)
      expect(toJSON(body)).toEqual({
        errors: [{
          field: 'risk_questions',
          error: '\"risk_questions\" is required'
        }]
      })
    })


  })

  describe('Should accept a request when user',  () => {
    it('is ineligible to all insurances', async () => {
      const payload = {
        age: 62,
        dependents: 2,
        income: 2000,
        marital_status: 'married',
        risk_questions: [0, 1, 0],
      }

      const { body, statusCode } = await handler(toStr(payload))
      const expected = {
        auto: 'ineligible',
        disability: 'ineligible',
        home: 'ineligible' ,
        life: 'ineligible'
      }

      expect(statusCode).toBe(200)
      expect(toJSON(body)).toEqual(expected)
    })

    it('is eligible to example insurances', async () => {
      const { body, statusCode } = await handler(toStr(examplePayload))
      const expected = {
        auto: 'regular',
        disability: 'ineligible',
        home: 'economic' ,
        life: 'regular'
      }

      expect(statusCode).toBe(200)
      expect(toJSON(body)).toEqual(expected)
    })
  })


})
