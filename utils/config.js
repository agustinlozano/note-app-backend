require('dotenv').config()

const PORT = process.env.PORT
const LOCAL = 3001
let MONGODB_URI = process.env.MONGO_DB_URI

if (process.env.NODE_ENV === 'test') {
  MONGODB_URI = process.env.MONGO_DB_URI_TEST
}

module.exports = { MONGODB_URI, LOCAL, PORT }
