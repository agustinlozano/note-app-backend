const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const notesRouter = require('./controllers/notes')
const {
  requestLogger,
  notFound,
  handleErrors
} = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch(error => {
    logger.error('error connecting to MongoDB:', error.message)
  })
process.on('uncaughtException', () => mongoose.connection.close())

app.use(cors())
app.use(express.json())
app.use(requestLogger)

app.use('/api/notes', notesRouter)

app.use(notFound)
app.use(handleErrors)

module.exports = app
