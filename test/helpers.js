const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Note = require('../models/Note')

const nonexistentId = async () => {
  const note = new Note({
    content: 'This notes will be deleted',
    date: new Date(),
    importance: false
  })

  await note.save()
  await note.remove()

  return note.id.toString()
}

module.exports = {
  app,
  api,
  nonexistentId
}
