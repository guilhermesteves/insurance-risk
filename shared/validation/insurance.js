const joi = require('joi')
const { validate } = require('./_default')

const insuranceSchema = joi.object().keys({
  age: joi.number().integer().required(),
  dependents: joi.number().integer().required(),
  income: joi.number().required(),
  house: joi.object().keys({
    ownership_status: joi.string().required(),
  }),
  marital_status: joi.string().required(),
  risk_questions: joi.array().items(joi.number().integer()).required(),
  vehicle: joi.object().keys({
    year: joi.number().integer().required(),
  }),
})

async function validateInsurance(user) {
  return validate(user, insuranceSchema)
}

module.exports = {
  validateInsurance
}
