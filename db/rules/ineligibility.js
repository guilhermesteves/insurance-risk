module.exports = [
  {
    enable: true,
    name: 'Age over 60',
    description: 'If the user is over 60 years old, she is ineligible for disability and life insurance.',
    affects: ['disability', 'life'],
    conditionType: 'and',
    condition: {
      gt: {
        path: 'age',
        value: '60',
        valueType: 'int'
      }
    },
    order: 1,
    effect: 'ineligible',
    apply: {
      disability: 1,
      life: 1
    },
  }
]
