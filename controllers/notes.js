const noteRouter = require('express').Router()
const Note = require('../models/Note')
const User = require('../models/User')
const tokenExtractor = require('../utils/tokenExtractor')

noteRouter.get('/', async (request, response) => {
  const notes = await Note.find({}).populate('user', {
    username: 1,
    name: 1
  })
  response.json(notes)
})

noteRouter.post('/', tokenExtractor, async (request, response) => {
  const {
    content,
    importance = false
  } = request.body

  const { userId } = request
  const user = await User.findById(userId)

  const newNote = new Note({
    content,
    date: new Date(),
    importance,
    user: user._id
  })

  const savedNote = await newNote.save()

  user.notes = user.notes.concat(savedNote._id)

  const newInfoNote = {
    username: user.username,
    name: user.name,
    notes: user.notes
  }

  await User.findByIdAndUpdate(userId, newInfoNote, { new: true })

  response.status(201).json(savedNote)
})

noteRouter.get('/:id', tokenExtractor, async (request, response) => {
  const { id } = request.params

  const note = await Note.findById(id)
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

noteRouter.delete('/:id', tokenExtractor, async (request, response) => {
  const { id } = request.params

  const deletedNote = await Note.findByIdAndDelete(id)
  if (deletedNote) {
    response.status(204).json(deletedNote)
  } else {
    response.status(404).end()
  }
})

noteRouter.put('/:id', tokenExtractor, async (request, response) => {
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
