const express = require("express");
const {
  getNotes,
} = require("../../controllers/notesControllers/notesControllers");

const notesRouter = express.Router();

notesRouter.get("/", getNotes);

module.exports = notesRouter;
