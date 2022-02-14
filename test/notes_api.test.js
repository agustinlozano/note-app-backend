const server = require('../index')
const mongoose = require('mongoose')
const Note = require('../models/Note')
const _ = require('lodash')
const {
  api,
  initialNotes,
  getAllFromNotes,
  nonexistentId
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

  test('if a new note has no importance true then it is assigned to false', async () => {
    const unimportantNote = {
      content: 'This note is not important',
      importance: undefined
    }

    await api
      .post('/api/notes')
      .send(unimportantNote)
      .expect(201)
      .expect('Content-Type', /json/)

    const { response: notesAtEnd } = await getAllFromNotes()
    const lastNoteAdded = _.last(notesAtEnd)

    expect(notesAtEnd).toHaveLength(initialNotes.length + 1)
    expect(lastNoteAdded.importance).toBe(false)
  })
})

describe('GET /api/notes/id', () => {
  test('a note can be viewed', async () => {
    const { response: notes } = await getAllFromNotes()
    const note = notes[0]

    await api
      .get(`/api/notes/${note.id}`)
      .expect(200)
      .expect('Content-Type', /json/)
  })

  test('fails with status code 404 when a nonexistent id is passed', async () => {
    const id = await nonexistentId()

    await api
      .get(`/api/notes/${id}`)
      .expect(404)
  })

  test('fails with status code 400 when an ivalid id is passed', async () => {
    await api
      .get('/api/notes/12345')
      .expect(400)
  })
})

describe('DELETE /api/notes/id', () => {
  test('a note can be deleted', async () => {
    const { response: notes } = await getAllFromNotes()
    const note = notes[0]

    await api
      .delete(`/api/notes/${note.id}`)
      .expect(204)
  })

  test('fails with status code 404 when a nonexisting id is passed', async () => {
    const id = await nonexistentId()

    await api
      .delete(`/api/notes/${id}`)
      .expect(404)
  })

  test('fails with status code 400 when an ivalid id is passed', async () => {
    await api
      .delete('/api/notes/12345')
      .expect(400)
  })
})

describe('PUT /api/notes/id', () => {
  test('a note body can ben updated', async () => {
    const { response: notes } = await getAllFromNotes()
    const note = notes[0]

    const updatedNote = {
      content: 'This is the new content for this note',
      date: new Date(),
      importance: undefined
    }

    await api
      .put(`/api/notes/${note.id}`)
      .send(updatedNote)
      .expect(204)

    const { contents } = await getAllFromNotes()

    expect(contents).toContain('This is the new content for this note')
  })

  test('fails with status code 404 when a nonexisting id is passed', async () => {
    const id = await nonexistentId()

    await api
      .put(`/api/notes/${id}`)
      .expect(404)
  })

  test('fails with status code 400 when an ivalid id is passed', async () => {
    await api
      .put('/api/notes/12345')
      .expect(400)
  })
})

describe('when an unknown endpoint is passed as a route', () => {
  test('returns a status code 404', async () => {
    const unknownEndpoint = '/an/Invalid/RouteLikeThis'

    await api
      .get(unknownEndpoint)
      .expect(404)
      .expect({ error: 'unknown endpoint' })
  })
})

afterAll(() => {
  server.close()
  mongoose.connection.close()
})
