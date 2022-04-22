const mongoose = require('mongoose')

const { Schema } = mongoose

const insuranceSchema = new Schema({
  age: {
    type: Number,
    required: true
  },
  dependents: {
    type: Number,
    required: true
  },
  income: {
    type: Number,
    required: true
  },
  marital_status: {
    type: String,
    required: true,
    enum: ['single', 'married']
  },
  risk_questions: {
    type: [Number],
    required: true,
  },
  vehicle: {
    year: {
      type: Number,
    }
  },
  house: {
    ownership_status: {
      type: String,
      enum: ['owned', 'mortgaged']
    }
  },
  risk_profile: {
    auto: String,
    disability: String,
    home: String,
    life: String
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
 * @typedef Insurance
 */
module.exports = mongoose.model('Insurance', insuranceSchema)

