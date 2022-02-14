const noteRouter = require('express').Router()
const Note = require('../models/Note')

noteRouter.get('/', async (request, response) => {
  const notes = await Note.find({})
  response.json(notes)
})

noteRouter.post('/', async (request, response, next) => {
  const { body } = request
  const { content, importance } = body

  const newNote = new Note({
    content,
    date: new Date(),
    importance: importance || false
  })

  const savedNote = await newNote.save()
  response.status(201).json(savedNote)
})

noteRouter.get('/:id', async (request, response) => {
  const { id } = request.params

  const note = await Note.findById(id)
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

noteRouter.delete('/:id', async (request, response) => {
  const { id } = request.params

  const deletedNote = await Note.findByIdAndDelete(id)
  if (deletedNote) {
    response.status(204).json(deletedNote)
  } else {
    response.status(404).end()
  }
})

noteRouter.put('/:id', async (request, response) => {
  const { id } = request.params
  const { body: noteInfo } = request

  const updatedInfo = {
    content: noteInfo.content,
    date: new Date(),
    importance: noteInfo.importance || false
  }

  const updatedNote = await Note.findByIdAndUpdate(id, updatedInfo, { new: true })
  if (updatedNote) {
    response.status(204).json(updatedNote)
  } else {
    response.status(404).end()
  }
})

module.exports = noteRouter
