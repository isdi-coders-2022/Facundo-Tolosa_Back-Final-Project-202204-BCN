const express = require("express");
const { validate } = require("express-validation");
const { noteSchema } = require("../../../schemas/notesSchemas");
const {
  getNotes,
  deleteNote,
  getUserNotes,
  createNote,
  editNote,
} = require("../../controllers/notesControllers/notesControllers");

const notesRouter = express.Router();

notesRouter.get("/", getNotes);
notesRouter.get("/:username", getUserNotes);
notesRouter.delete("/:idNote", deleteNote);
notesRouter.post("/", validate(noteSchema), createNote);
notesRouter.put("/:noteId", validate(noteSchema), editNote);

module.exports = notesRouter;
