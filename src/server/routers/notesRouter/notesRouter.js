const express = require("express");
const {
  getNotes,
  deleteNote,
  getUserNotes,
  createNote,
} = require("../../controllers/notesControllers/notesControllers");

const notesRouter = express.Router();

notesRouter.get("/", getNotes);
notesRouter.get("/:username", getUserNotes);
notesRouter.delete("/:idNote", deleteNote);
notesRouter.post("/", createNote);

module.exports = notesRouter;
