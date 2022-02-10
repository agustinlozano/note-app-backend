require('dotenv').config()

const MONGODB_URI = process.env.MONGO_DB_URI
const LOCAL = 3001

module.exports = { MONGODB_URI, LOCAL }