async function validate(payload, schema) {
  const { error } = await schema.validate(payload, { abortEarly: false })

  if (!error) {
    return { success: true }
  }

  const errors = error.details.map(err => {
    return { field: err.context.key, error: err.message }
  })

  return { success: false, errors }
}

module.exports = {
  validate
}
