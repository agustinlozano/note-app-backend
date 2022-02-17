const { api } = require('./helpers')

const getAnUserToken = async () => {
  const blanquitoUser = {
    username: 'Blanquito',
    name: 'Blanco Saenz Penia',
    password: 'ThisIsItsPassword'
  }

  await api
    .post('/api/users')
    .send(blanquitoUser)

  const loggedUser = await api
    .post('/api/login')
    .send({
      username: blanquitoUser.username,
      password: blanquitoUser.password
    })

  return loggedUser.body.token
}

module.exports = getAnUserToken
