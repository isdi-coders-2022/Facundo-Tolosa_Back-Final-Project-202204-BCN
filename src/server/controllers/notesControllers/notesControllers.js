const debug = require("debug")("amazingN:notesControllers");
const chalk = require("chalk");
const Note = require("../../../database/models/Note");

const getNotes = async (req, res, next) => {
  try {
    const notes = await Note.find();
    debug(chalk.green("Someone asked for all the notes"));

    res.status(200).json({ notes });
  } catch (err) {
    err.message = "Error getting all the notes";
    err.code = 404;

    next(err);
  }
};

const deleteNote = async (req, res, next) => {
  const { idNote } = req.params;

  try {
    await Note.findByIdAndDelete(idNote);

    res.status(200).json({ msg: "Note deleted" });
    debug(chalk.green("Someone deleted a note"));
  } catch (err) {
    debug(chalk.red("Someone tried to delete a note that we don't have"));
    err.message = "No note with that id found";
    err.code = 404;

    next(err);
  }
};

module.exports = { getNotes, deleteNote };
