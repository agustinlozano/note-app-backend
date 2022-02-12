const noteRouser = require('express').Router()
const Note = require('../models/Note')

noteRouser.get('/', async (request, response) => {
  const notes = await Note.find({})
  response.json(notes)
})

noteRouser.post('/', async (request, response, next) => {
  const body = request.body
  const { content, importance } = body

  const newNote = new Note({
    content,
    date: new Date(),
    importance: importance || false
  })

  const savedNote = await newNote.save()
  response.status(201).json(savedNote)
})

module.exports = noteRouser
