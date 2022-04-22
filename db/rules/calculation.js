module.exports = [
  {
    enable: true,
    name: 'Age under 30',
    description: 'If the user is under 30 years old, deduct 2 risk points from all lines of insurance.',
    affects: ['auto', 'disability','home', 'life'],
    conditionType: 'and',
    condition: {
      lt: {
        path: 'age',
        value: '30',
        valueType: 'int'
      }
    },
    order: 1,
    effect: 'calculation',
    apply: {
      auto: -2,
      disability: -2,
      home: -2,
      life: -2
    },
  },
  {
    enable: true,
    name: 'Age between 30 and 40',
    description: 'If the user is between 30 and 40 years old, deduct 1.',
    affects: ['auto', 'disability','home', 'life'],
    conditionType: 'and',
    condition: {
      lte: {
        path: 'age',
        value: '40',
        valueType: 'int'
      },
      gte: {
        path: 'age',
        value: '30',
        valueType: 'int'
      }
    },
    order: 2,
    effect: 'calculation',
    apply: {
      auto: -1,
      disability: -1,
      home: -1,
      life: -1
    },
  },
  {
    enable: true,
    name: 'Income above 200K',
    description: 'If the user\'s income is above $200k, deduct 1 risk point from all lines of insurance.',
    affects: ['auto', 'disability','home', 'life'],
    conditionType: 'and',
    condition: {
      gt: {
        path: 'income',
        value: '200000',
        valueType: 'int'
      }
    },
    order: 3,
    effect: 'calculation',
    apply: {
      auto: -1,
      disability: -1,
      home: -1,
      life: -1
    },
  },
  {
    enable: true,
    name: 'House mortgaged',
    description: 'If the user\'s house is mortgaged, add 1 risk point to her home score and add 1 risk point to her disability score.',
    affects: ['disability','home'],
    conditionType: 'and',
    condition: {
      eq: {
        path: 'house.ownership_status',
        value: 'mortgaged',
        valueType: 'string'
      }
    },
    order: 4,
    effect: 'calculation',
    apply: {
      disability: 1,
      home: 1
    },
  },
  {
    enable: true,
    name: 'Has dependents',
    description: 'If the user has dependents, add 1 risk point to both the disability and life scores.',
    affects: ['disability','life'],
    conditionType: 'and',
    condition: {
      gte: {
        path: 'dependents',
        value: '1',
        valueType: 'int'
      }
    },
    order: 5,
    effect: 'calculation',
    apply: {
      disability: 1,
      life: 1
    },
  },
  {
    enable: true,
    name: 'User is married',
    description: 'If the user is married, add 1 risk point to the life score and remove 1 risk point from disability.',
    affects: ['disability','life'],
    conditionType: 'and',
    condition: {
      eq: {
        path: 'marital_status',
        value: 'married',
        valueType: 'string'
      }
    },
    order: 6,
    effect: 'calculation',
    apply: {
      disability: -1,
      life: 1
    },
  },
  {
    enable: true,
    name: 'Vehicle was produced in the last 5 years',
    description: 'If the user\'s vehicle was produced in the last 5 years, add 1 risk point to that vehicle’s score.',
    affects: ['auto'],
    conditionType: 'and',
    condition: {
      gte: {
        path: 'vehicle.year',
        value: '2017',
        valueType: 'int'
      }
    },
    order: 7,
    effect: 'calculation',
    apply: {
      auto: 1
    },
  }
]
