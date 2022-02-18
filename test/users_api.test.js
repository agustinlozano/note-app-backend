const server = require('../index')
const mongoose = require('mongoose')
const User = require('../models/User')
const { api } = require('./helper.js')
const {
  initialUsers,
  getUserResponse
} = require('./users_helper')

beforeEach(async () => {
  await User.deleteMany({})

  const firstUser = new User(initialUsers[0])
  const secondUser = new User(initialUsers[1])

  await firstUser.save()
  await secondUser.save()
})

describe('Test initial users', () => {
  test('there are two users in the database', async () => {
    const { response: users } = await getUserResponse()

    expect(users).toHaveLength(initialUsers.length)
  })
})

describe('GET /api/users', () => {
  test('user are returned as json', async () => {
    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /json/)
  })
})

describe('POST /api/users', () => {
  test('fails with status code 400 if username is already taken', async () => {
    const { response: usersAtStart } = await getUserResponse()
    const userAlreadyTaken = initialUsers[0]

    await api
      .post('/api/users')
      .send(userAlreadyTaken)
      .expect(400)
      .expect('Content-Type', /json/)

    const { response: usersAtEnd } = await getUserResponse()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('success with status code 201 when a valid user is passed', async () => {
    const validUser = {
      username: 'MobBebe',
      name: 'bebe',
      password: 'CatoIsAnIdiot'
    }

    await api
      .post('/api/users')
      .send(validUser)
      .expect(201)
      .expect('Content-Type', /json/)

    const { response: usersAtEnd } = await getUserResponse()
    const { passwordsHash } = await getUserResponse()
    const { names } = await getUserResponse()

    expect(usersAtEnd).toHaveLength(initialUsers.length + 1)
    expect(names).toContain('bebe')
    expect(passwordsHash).not.toContain('CatoIsAnIdiot')
  })

  test('fails with status code 400 when we do not respect username minlength', async () => {
    const invalidUsername = {
      username: 'B',
      name: 'bebe',
      password: 'CatoIsAnIdiot'
    }

    await api
      .post('/api/users')
      .send(invalidUsername)
      .expect(400)
      .expect({
        error: 'User validation failed: username: Path `username` (`B`) is shorter than the minimum allowed length (2).'
      })
  })

  test('fails with status code 400 when we do not respect name minlength', async () => {
    const invalidUsername = {
      username: 'TotiX',
      name: 'T',
      password: 'CatoIsAnIdiot'
    }

    await api
      .post('/api/users')
      .send(invalidUsername)
      .expect(400)
      .expect({
        error: 'User validation failed: name: Path `name` (`T`) is shorter than the minimum allowed length (2).'
      })
  })
})

afterAll(() => {
  mongoose.connection.close()
  server.close()
})
