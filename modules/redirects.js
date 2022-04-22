const { notFound } = require('../shared/api/response')

module.exports.notFound = async () => {
  return notFound()
}
