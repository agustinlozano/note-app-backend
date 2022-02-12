const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Note = require('../models/Note')

const initialNotes = [
  {
    content: 'Cato and Bebe are brothers even though Bebe didn\'t want',
    date: new Date(),
    importance: true
  },
  {
    content: 'Cato is a little boy that loves to eat meat and sleep',
    date: new Date(),
    importance: true
  },
  {
    content: 'There is a gray kitty that it\'s known as \'Ninito\', but its real name is Gordo Gris',
    date: new Date(),
    importance: true
  }
]

const getAllFromNotes = async () => {
  const response = await Note.find({})
  const contents = response.map(note => note.content)

  return { response, contents }
}

module.exports = {
  app,
  api,
  initialNotes,
  getAllFromNotes
}
