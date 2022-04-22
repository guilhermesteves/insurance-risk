const connectToDatabase = require('../../../shared/db')
const Insurance = require('../../../shared/models/insurance')
const { calculateRiskProfile } = require('../../../shared/engine')
const { validateInsurance } = require('../../../shared/validation/insurance')
const { ok, unprocessableEntity, serverError } = require('../../../shared/api')

function getBody(event) {
  try {
    if (!event || !event.body) {
      return null
    }

    const body = JSON.parse(event.body)
    console.info(`BODY ${JSON.stringify(body, null, 2)}`)

    return body
  } catch (error) {
    return null
  }
}

/**
 * Mutate one or more operations
 * @param  {[type]}   event    [Event Trigger]
 * @param  {[type]}   context  [Event Context]
 * @return {[type]}            [200 or 422]
 *
 */
module.exports.handler = async (event, context = {}) => {
  console.info(`START ${JSON.stringify(event, null, 2)}`)

  try {
    const body = getBody(event)

    if (!body) {
      return unprocessableEntity({
        payload: {
          errors: [{
            message: 'Invalid body'
          }]
        }
      })
    }

    const { success, errors } = await validateInsurance(body)

    if (!success) {
      return unprocessableEntity({ payload: { errors } })
    }

    context.callbackWaitsForEmptyEventLoop = false
    await connectToDatabase()

    console.info('Calculating insurance')
    const risk_profile = await calculateRiskProfile({ insurance: body })

    await Insurance.create({
      ...body,
      risk_profile
    })

    return ok({ payload: risk_profile })
  } catch (err) {
    console.error(err)
    return serverError()
  }
}
