const server = require('../index')
const mongoose = require('mongoose')
const Note = require('../models/Note')
const {
  api,
  initialNotes,
  getAllFromNotes
} = require('./helpers')

beforeEach(async () => {
  await Note.deleteMany({})

  for (const note of initialNotes) {
    const noteObject = new Note(note)
    await noteObject.save()
  }
})

describe('test the initial notes', () => {
  test('how many notes are', async () => {
    const { response: notes } = await getAllFromNotes()

    expect(notes).toHaveLength(initialNotes.length)
  })
})

describe('GET /api/notes', () => {
  test('notes are returned as json', async () => {
    await api
      .get('/api/notes')
      .expect(200)
      .expect('Content-Type', /json/)
  })
})

describe('POST /api/notes', () => {
  test('success with status code 201 when a valid note is passed', async () => {
    const newNote = {
      content: 'Cats are really funny pets',
      importance: true
    }

    await api
      .post('/api/notes')
      .send(newNote)
      .expect(201)
      .expect('Content-Type', /json/)

    const { response: notesAtEnd, contents } = await getAllFromNotes()

    expect(notesAtEnd).toHaveLength(initialNotes.length + 1)
    expect(contents).toContain('Cats are really funny pets')
  })

  test('fails with status code 400 when an invalid note is passed', async () => {
    const invalidNote = {
      importance: true
    }

    await api
      .post('/api/notes')
      .send(invalidNote)
      .expect(400)
      .expect({ error: 'Note validation failed: content: Path `content` is required.' })

    const { response: notesAtEnd } = await getAllFromNotes()

    expect(notesAtEnd).toHaveLength(initialNotes.length)
  })
})

afterAll(() => {
  server.close()
  mongoose.connection.close()
})