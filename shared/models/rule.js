const mongoose = require('mongoose')

const { Schema } = mongoose
const INSURANCES = ['auto', 'disability','home', 'life']

const ruleSchema = new Schema({
  enable: {
    type: Boolean,
    required: true,
    default: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  affects: {
    type: [String],
    enum: INSURANCES
  },
  conditionType: {
    value: String,
    enum: ['and', 'or']
  },
  condition: {
    eq: {
      path: String,
      value: String,
      valueType: {
        type: String,
        enum: ['string', 'float', 'int']
      }
    },
    ne: {
      path: String,
      value: String,
      valueType: {
        type: String,
        enum: ['string', 'float', 'int']
      }
    },
    lt: {
      path: String,
      value: String,
      valueType: {
        type: String,
        enum: ['string', 'float', 'int']
      }
    },
    lte: {
      path: String,
      value: String,
      valueType: {
        type: String,
        enum: ['string', 'float', 'int']
      }
    },
    gt: {
      path: String,
      value: String,
      valueType: {
        type: String,
        enum: ['string', 'float', 'int']
      }
    },
    gte: {
      path: String,
      value: String,
      valueType: {
        type: String,
        enum: ['string', 'float', 'int']
      }
    },
  },
  order: Number,
  effect: {
    type: String,
    enum: ['ineligible', 'calculation']
  },
  apply: {
    auto: Number,
    disability: Number,
    home: Number,
    life: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
}, {
  timestamps: true,
})

/**
 * Statics
 */
ruleSchema.statics = {
  INSURANCES,

  async getIneligibilityRules() {
    const ineligibilityRules = await this.find({
      enable: true,
      effect: 'ineligible'
    })
      .sort({order: 1})
      .exec()

    console.info(`Inegibility Rules: ${ineligibilityRules.length}`)

    return ineligibilityRules
  },

  async getCalculationRules({ affects = INSURANCES }) {
    const calculationRules = await this.find({
      enable: true,
      effect: 'calculation',
      affects: {
        $in: affects
      }
    })
      .sort({order: 1})
      .exec()

    console.info(`Calculation Rules: ${calculationRules.length}`)

    return calculationRules
  }
}

/**
 * @typedef Rule
 */
module.exports = mongoose.model('Rule', ruleSchema)
