const jwt = require('jsonwebtoken')

module.exports = (request, response, next) => {
  const token = getTokenFrom(request)

  const decodedToken = jwt.verify(token, process.env.SECRET)
  console.log({ decodedToken })

  if (!token || !decodedToken.id) {
    return response.status(401).json({
      error: 'token missing or invalid'
    })
  }

  const { id: userId } = decodedToken

  request.userId = userId

  next()
}

const getTokenFrom = request => {
  const authorization = request.get('authorization')

  console.log({ authorization })

  if (authorization && authorization.toLowerCase().startsWith('bearer')) {
    return authorization.substring(7)
  }

  return null
}
