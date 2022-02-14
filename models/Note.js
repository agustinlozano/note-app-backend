const { Schema, model } = require('mongoose')

const noteSchema = new Schema({
  content: {
    type: String,
    required: true,
    minlength: 10
  },
  date: {
    type: Date,
    required: true
  },
  importance: Boolean,
  users: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
})

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Note = model('Note', noteSchema)

module.exports = Note
