const { autoBindSteps, loadFeatures } = require('jest-cucumber')
const { handler } = require('../../modules/insurance/endpoints/insurance')

const mockIneligibilityRules = require('../../db/rules/ineligibility')
const mockCalculationRules = require('../../db/rules/calculation')

let path, method, body
const headers = {}

let response = {}

jest.mock('../../shared/db', () => {
  return jest.fn().mockImplementation(() => {
    Promise.resolve()
  })
})

jest.mock('../../shared/models/rule', () => {
  return {
    getIneligibilityRules: jest.fn().mockImplementation(() => {
      return mockIneligibilityRules
    }),
    getCalculationRules: jest.fn().mockImplementation(() => {
      return mockCalculationRules
    }),
  }
})

jest.mock('../../shared/models/insurance', () => {
  return {
    create: (insurance) => {
      return Promise.resolve(insurance)
    },
  }
})

const riskInsuranceSteps = ({ given, and, when, then }) => {
  beforeEach(() => {
    jest.setTimeout(10000)
  })

  afterEach(() => {
    response = {}
  })

  given(/^the path is '(.*)'$/, (givenPath) => {
    path = givenPath
  })

  and(/^method is '(.*)'$/, (givenMethod) => {
    method = givenMethod
  })

  and('request body:', (givenBody) => {
    body = givenBody
  })

  and('request headers:', (table) => {
    if (table) {
      table.forEach((element) => {
        headers[element.key] = element.value
      })
    }
  })

  when('making request', async () => {
    const event = {
      path: path,
      headers: headers,
      httpMethod: method,
      body
    }

    response = await handler(event)
  })

  then('expect the following response:', (docString) => {
    expect(JSON.parse((response).body)).toEqual(
      JSON.parse(docString)
    )
  })

  and(/^expect a "(.*)" status code$/, (statusCode) => {
    expect(response.statusCode).toEqual(parseInt(statusCode))
  })
}

const features = loadFeatures('test/integration/*.feature')
autoBindSteps(features, [riskInsuranceSteps])
