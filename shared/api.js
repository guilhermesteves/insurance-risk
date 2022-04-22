const ALLOWED_HEADERS = [
  'Content-Type',
  'Authorization',
  'X-Amz-Date',
  'X-Api-Key',
  'X-Amz-Security-Token',
  'x-amzn-RequestId',
  'X-Amz-Cf-Id'
].join(',')

const ALLOWED_METHODS = [
  'OPTIONS',
  'GET',
  'POST',
  'PATCH',
  'PUT',
  'DELETE'
].join(',')

const EXPOSE_HEADERS = [
  'x-amzn-Remapped-Authorization',
  'Authorization',
  'x-custom-Authorization'
].join(',')

const DEFAULT_HEADERS = {
  'Access-Control-Allow-Headers': ALLOWED_HEADERS,
  'Access-Control-Allow-Methods': ALLOWED_METHODS,
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
  'Access-Control-Expose-Headers': EXPOSE_HEADERS // Expose a header on AWS Cors
}

const custom = ({ payload, statusCode, headers } = {}) => {
  const result = {
    statusCode,
    body: payload ? JSON.stringify(payload) : '',
    headers: headers ? { ...DEFAULT_HEADERS, ...headers } : DEFAULT_HEADERS
  }

  console.info(`END ${JSON.stringify(result, null, 2)}`)
  return result
}

// 200s

const ok = ({ payload, headers = {} } = {}) => custom({ payload, statusCode: 200, headers })

// 400s

const notFound = ({ headers } = {}) => custom({ statusCode: 404, headers })

const unprocessableEntity = ({ payload, headers } = {}) => custom({ payload, statusCode: 422, headers })

// 500s

const serverError = ({ headers } = {}) => custom({ statusCode: 500, headers })

module.exports = {
  ok,
  unprocessableEntity,
  notFound,
  serverError
}
