const _ = require('lodash')

const Rule = require('./models/rule')

function generateCondition({ insuranceValue, key, value, valueType }) {
  let conditionValue

  switch (valueType) {
    case 'float':
      conditionValue = parseFloat(value)
      break
    case 'int':
      conditionValue = parseInt(value)
      break
    default:
      conditionValue = value
  }

  switch (key) {
    case 'eq':
      return insuranceValue === conditionValue
    case 'ne':
      return insuranceValue !== conditionValue
    case 'lt':
      return insuranceValue < conditionValue
    case 'lte':
      return insuranceValue <= conditionValue
    case 'gt':
      return insuranceValue > conditionValue
    case 'gte':
      return insuranceValue >= conditionValue
    default:
      return true
  }
}

function isRuleAffecting({ insurance, rule }) {
  const conditions = []

  const { conditionType, condition } = rule

  Object.keys(rule.condition).forEach(key => {
    const { path, value, valueType } = condition[key]
    const insuranceValue = _.get(insurance, path)

    if (insuranceValue) {
      conditions.push(generateCondition({
        insuranceValue,
        key,
        value,
        valueType
      }))
    }
  })

  let result

  if (!conditions.length) {
    return false
  } else if (conditionType === 'and') { // and condition
    result = conditions.every(condition => !!condition)
  } else { // or condition
    result = conditions.some(condition => !!condition)
  }

  return result
}

async function ineligibilityEngine({ insurance }) {
  let auto, disability, home, life
  const { income, vehicle, house } = insurance

  if (!income) {
    disability = true
  }

  if (!vehicle) {
    auto = true
  }

  if (!house) {
    home = true
  }

  const ineligibilityRules = await Rule.getIneligibilityRules()

  ineligibilityRules.forEach(rule => {
    if (auto && disability && home && life) {
      return { auto, disability, home, life }
    }

    if (isRuleAffecting({ insurance, rule })) {
      if (rule.apply.auto) auto = true
      if (rule.apply.disability) disability = true
      if (rule.apply.home) home = true
      if (rule.apply.life) life = true
    }
  })

  return { auto, disability, home, life }
}

async function calculationEngine({ insurance, affects }) {
  const calculationRules = await Rule.getCalculationRules({ affects })

  const baseScore = insurance.risk_questions.reduce((sum, question) => sum + question, 0)

  const score = {
    auto: baseScore,
    disability: baseScore,
    home: baseScore,
    life: baseScore
  }

  // dynamic rules
  calculationRules.forEach(rule => {
    if (isRuleAffecting({ insurance, rule })) {
      score.auto += rule.apply.auto || 0
      score.disability += rule.apply.disability || 0
      score.home += rule.apply.home || 0
      score.life += rule.apply.life || 0
    }
  })

  return score
}

function calculateScore(lineOfInsurance) {
  if (lineOfInsurance <= 0) {
    return 'economic'
  } else if (lineOfInsurance === 1 || lineOfInsurance === 2) {
    return 'regular'
  } else {
    return 'responsible'
  }
}

function calculateResult({ result, score }) {
  Object.keys(score).forEach(key => {
    score[key] = calculateScore(score[key])
  })

  return {
    ...score,
    ...result
  }
}

async function calculateRiskProfile({ insurance }) {
  const ineligibles = await ineligibilityEngine({ insurance })

  let result = {}
  let affects = [] // only calculate score for non ineligible insurances

  if (!ineligibles.auto) {
    affects.push('auto')
  } else {
    result.auto = 'ineligible'
  }

  if (!ineligibles.disability) {
    affects.push('disability')
  } else {
    result.disability = 'ineligible'
  }

  if (!ineligibles.home) {
    affects.push('home')
  } else {
    result.home = 'ineligible'
  }

  if (!ineligibles.life) {
    affects.push('life')
  } else {
    result.life = 'ineligible'
  }

  let score = {}
  if (affects.length > 0) {
    score = await calculationEngine({ insurance, calculate: affects })
    console.log(`Score: ${JSON.stringify(score, null, 2)}`)
  }

  return calculateResult({ result, score })
}


module.exports = {
  calculateRiskProfile
}
