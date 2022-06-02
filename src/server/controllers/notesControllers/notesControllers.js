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

module.exports = { getNotes };
