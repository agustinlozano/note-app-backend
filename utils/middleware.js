const logger = require('./logger')

const requestLogger = (request, response, next) => {
  logger.info('---------------')
  logger.info(request.method)
  logger.info(request.path)
  logger.info(request.body)
  logger.info('---------------')
  next()
}

const notFound = (req, res, next) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

const handleErrors = (error, req, res, next) => {
  console.log(error.message)
  if (error.name === 'CastError') {
    res.status(400).send({ error: 'id used is malformed' })
  } else if (error.name === 'ValidationError') {
    res.status(400).send({ error: error.message })
  } else {
    res.status(500).end()
  }

  next(error)
}

module.exports = {
  requestLogger,
  handleErrors,
  notFound
}
