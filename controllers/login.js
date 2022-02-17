const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/User')

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body

  const user = await User.findOne({ username })

  const correctPassword = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)

  if (!(user && correctPassword)) {
    response.status(401).json({
      error: 'invalid user or password'
    })
  }

  const userForToken = {
    id: user._id,
    username: user.username
  }

  const token = jwt.sign(userForToken, process.env.SECRET, {
    expiresIn: 60 * 60 * 24 * 7
  })

  response.send({
    username: user.username,
    name: user.name,
    token
  })
})

module.exports = loginRouter
