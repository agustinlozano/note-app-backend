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
  if (error.name === 'CastError') {
    res.status(400).send({ error: 'id used is malformed' })
  } else if (error.name === 'ValidationError') {
    res.status(400).send({ error: error.message })
  } else if (error.name === 'TypeError') {
    res.status(404).send({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    res.status(401).send({ error: error.message })
  } else if (error.name === 'TokenExpiredError') {
    res.status(401).send({ error: error.message })
  } else {
    console.log(error.name)
    console.log(error.message)
    res.status(500).end()
  }

  next(error)
}

module.exports = {
  requestLogger,
  handleErrors,
  notFound
}
