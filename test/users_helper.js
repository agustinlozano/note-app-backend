const User = require('../models/User')

const initialUsers = [
  {
    username: 'CatitoX',
    name: 'Cato',
    passwordHash: 'BebeIsMyFriend'
  },
  {
    username: 'Ninito',
    name: 'Gordo Gris',
    passwordHash: 'DadIsTheBest'
  }
]

const getUserResponse = async () => {
  const response = await User.find({})
  const usernames = response.map(user => user.username)
  const names = response.map(user => user.name)
  const passwordsHash = response.map(user => user.passwordHash)

  return { response, usernames, names, passwordsHash }
}

module.exports = {
  initialUsers,
  getUserResponse
}
