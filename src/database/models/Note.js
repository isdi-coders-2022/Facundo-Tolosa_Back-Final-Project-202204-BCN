const { Schema, model } = require("mongoose");

const NoteSchema = new Schema({
  title: {
    type: String,
    required: true,
  },

  content: {
    type: String,
  },

  category: {
    type: String,
    required: true,
    default: "",
  },

  author: {
    type: String,
    required: true,
  },

  creationDate: {
    type: Date,
    default: Date.now,
  },
});

const Note = model("Note", NoteSchema, "notes");

module.exports = Note;
