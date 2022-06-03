const express = require("express");
const {
  getNotes,
  deleteNote,
} = require("../../controllers/notesControllers/notesControllers");

const notesRouter = express.Router();

notesRouter.get("/", getNotes);
notesRouter.delete("/:idNote", deleteNote);

module.exports = notesRouter;
